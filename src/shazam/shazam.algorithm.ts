import { ComplexNumber, fft } from './shazam.fft';
import { DecodedMessage, FrequencyBand, FrequencyPeak } from './shazam.signature-formate';

const hanning = (m: number) =>
  Array(m)
    .fill(0)
    .map((_, n) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (m - 1)));

const pyMod = (a: number, b: number) => (a % b >= 0 ? a % b : b + (a % b));

const HANNING_MATRIX = hanning(2050).slice(1, 2049);

export class RingBuffer<T> {
  public list: (T | null)[];
  public position: number = 0;
  public written: number = 0;

  constructor(
    public bufferSize: number,
    defaultValue?: T | (() => T)
  ) {
    if (typeof defaultValue === 'function') {
      this.list = Array(bufferSize)
        .fill(null)
        .map(defaultValue as () => T);
    } else {
      this.list = Array(bufferSize).fill(defaultValue ?? null);
    }
  }

  append(value: T) {
    this.list[this.position] = value;
    this.position++;
    this.written++;
    this.position %= this.bufferSize;
  }
}

export class SignatureGenerator {
  // @ts-ignore
  private inputPendingProcessing: number[];
  // @ts-ignore
  private samplesProcessed: number;
  // @ts-ignore
  private ringBufferOfSamples: RingBuffer<number>;
  // @ts-ignore
  private fftOutputs: RingBuffer<Float64Array>;
  // @ts-ignore
  private spreadFFTsOutput: RingBuffer<Float64Array>;
  // @ts-ignore
  private nextSignature: DecodedMessage;

  private initFields() {
    this.ringBufferOfSamples = new RingBuffer<number>(2048, 0);
    this.fftOutputs = new RingBuffer<Float64Array>(
      256,
      () => new Float64Array(Array(1025).fill(0))
    );
    this.spreadFFTsOutput = new RingBuffer<Float64Array>(
      256,
      () => new Float64Array(Array(1025).fill(0))
    );
    this.nextSignature = new DecodedMessage();
    this.nextSignature.sampleRateHz = 16000;
    this.nextSignature.numberSamples = 0;
    this.nextSignature.frequencyBandToSoundPeaks = {};
  }

  constructor() {
    this.inputPendingProcessing = [];
    this.samplesProcessed = 0;

    this.initFields();
  }

  feedInput(s16leMonoSamples: number[]) {
    this.inputPendingProcessing = this.inputPendingProcessing.concat(s16leMonoSamples);
  }

  getNextSignature(): DecodedMessage | null {
    if (this.inputPendingProcessing.length - this.samplesProcessed < 128) {
      return null;
    }
    this.processInput(this.inputPendingProcessing);
    this.samplesProcessed += this.inputPendingProcessing.length;
    let returnedSignature = this.nextSignature;
    this.initFields();

    return returnedSignature;
  }

  processInput(s16leMonoSamples: number[]) {
    this.nextSignature.numberSamples += s16leMonoSamples.length;
    for (
      let positionOfChunk = 0;
      positionOfChunk < s16leMonoSamples.length;
      positionOfChunk += 128
    ) {
      this.doFFT(s16leMonoSamples.slice(positionOfChunk, positionOfChunk + 128));
      this.doPeakSpreading();
      if (this.spreadFFTsOutput.written >= 46) {
        this.doPeakRecognition();
      }
    }
  }

  doFFT(batchOf128S16leMonoSamples: number[]) {
    this.ringBufferOfSamples.list.splice(
      this.ringBufferOfSamples.position,
      batchOf128S16leMonoSamples.length,
      ...batchOf128S16leMonoSamples
    );

    this.ringBufferOfSamples.position += batchOf128S16leMonoSamples.length;
    this.ringBufferOfSamples.position %= 2048;
    this.ringBufferOfSamples.written += batchOf128S16leMonoSamples.length;

    let excerptFromRingBuffer = [
      ...this.ringBufferOfSamples.list.slice(this.ringBufferOfSamples.position),
      ...this.ringBufferOfSamples.list.slice(0, this.ringBufferOfSamples.position)
    ] as number[];

    // The premultiplication of the array is for applying a windowing function before the DFT (slighty rounded Hanning without zeros at edges)

    let results = fft(
      excerptFromRingBuffer.map((v, i) => new ComplexNumber(v * HANNING_MATRIX[i], 0))
    )
      .map((e: ComplexNumber) => (e.imag * e.imag + e.real * e.real) / (1 << 17))
      .map((e: number) => (e < 0.0000000001 ? 0.0000000001 : e))
      .slice(0, 1025);

    if (results.length != 1025) {
      console.log('ASSERT FAILED!');
    }

    this.fftOutputs.append(new Float64Array(results));
  }

  doPeakSpreading() {
    let originLastFFT =
        this.fftOutputs.list[pyMod(this.fftOutputs.position - 1, this.fftOutputs.bufferSize)]!,
      spreadLastFFT = new Float64Array(originLastFFT);
    for (let position = 0; position < 1025; position++) {
      if (position < 1023) {
        spreadLastFFT[position] = Math.max(...spreadLastFFT.slice(position, position + 3));
      }

      let maxValue = spreadLastFFT[position];
      for (let formerFftNum of [-1, -3, -6]) {
        let formerFftOutput =
          this.spreadFFTsOutput.list[
            pyMod(this.spreadFFTsOutput.position + formerFftNum, this.spreadFFTsOutput.bufferSize)
          ]!;
        if (isNaN(formerFftOutput[position])) continue;
        formerFftOutput[position] = maxValue = Math.max(formerFftOutput[position], maxValue);
      }
    }
    this.spreadFFTsOutput.append(spreadLastFFT);
  }

  doPeakRecognition() {
    let fftMinus46 =
      this.fftOutputs.list[pyMod(this.fftOutputs.position - 46, this.fftOutputs.bufferSize)]!;
    let fftMinus49 =
      this.spreadFFTsOutput.list[
        pyMod(this.spreadFFTsOutput.position - 49, this.spreadFFTsOutput.bufferSize)
      ]!;

    const range = (a: number, b: number, c: number = 1) => {
      let out = [];
      for (let i = a; i < b; i += c) out.push(i);
      return out;
    };

    for (let binPosition = 10; binPosition < 1015; binPosition++) {
      // Ensire that the bin is large enough to be a peak
      if (
        fftMinus46[binPosition] >= 1 / 64 &&
        fftMinus46[binPosition] >= fftMinus49[binPosition - 1]
      ) {
        let maxNeighborInFftMinus49 = 0;
        for (let neighborOffset of [...range(-10, -3, 3), -3, 1, ...range(2, 9, 3)]) {
          const candidate = fftMinus49[binPosition + neighborOffset];
          if (isNaN(candidate)) continue;
          maxNeighborInFftMinus49 = Math.max(candidate, maxNeighborInFftMinus49);
        }
        if (fftMinus46[binPosition] > maxNeighborInFftMinus49) {
          let maxNeighborInOtherAdjacentFFTs = maxNeighborInFftMinus49;
          for (let otherOffset of [-53, -45, ...range(165, 201, 7), ...range(214, 250, 7)]) {
            const candidate =
              this.spreadFFTsOutput.list[
                pyMod(
                  this.spreadFFTsOutput.position + otherOffset,
                  this.spreadFFTsOutput.bufferSize
                )
              ]![binPosition - 1];
            if (isNaN(candidate)) continue;
            maxNeighborInOtherAdjacentFFTs = Math.max(candidate, maxNeighborInOtherAdjacentFFTs);
          }

          if (fftMinus46[binPosition] > maxNeighborInOtherAdjacentFFTs) {
            // This is a peak. Store the peak

            let fftNumber = this.spreadFFTsOutput.written - 46;

            let peakMagnitude = Math.log(Math.max(1 / 64, fftMinus46[binPosition])) * 1477.3 + 6144,
              peakMagnitudeBefore =
                Math.log(Math.max(1 / 64, fftMinus46[binPosition - 1])) * 1477.3 + 6144,
              peakMagnitudeAfter =
                Math.log(Math.max(1 / 64, fftMinus46[binPosition + 1])) * 1477.3 + 6144;

            let peakVariation1 = peakMagnitude * 2 - peakMagnitudeBefore - peakMagnitudeAfter,
              peakVariation2 = ((peakMagnitudeAfter - peakMagnitudeBefore) * 32) / peakVariation1;

            let correctedPeakFrequencyBin = binPosition * 64 + peakVariation2;
            if (peakVariation1 <= 0) {
              console.log('Assert 2 failed - ' + peakVariation1);
            }

            let frequencyHz = correctedPeakFrequencyBin * (16000 / 2 / 1024 / 64);
            let band;
            if (frequencyHz < 250) {
              continue;
            } else if (frequencyHz <= 520) {
              band = FrequencyBand._250_520;
            } else if (frequencyHz <= 1450) {
              band = FrequencyBand._520_1450;
            } else if (frequencyHz <= 3500) {
              band = FrequencyBand._1450_3500;
            } else if (frequencyHz <= 5500) {
              band = FrequencyBand._3500_5500;
            } else continue;

            if (
              !Object.keys(this.nextSignature.frequencyBandToSoundPeaks).includes(
                FrequencyBand[band]
              )
            ) {
              this.nextSignature.frequencyBandToSoundPeaks[FrequencyBand[band]] = [];
            }
            this.nextSignature.frequencyBandToSoundPeaks[FrequencyBand[band]].push(
              new FrequencyPeak(
                fftNumber,
                Math.round(peakMagnitude),
                Math.round(correctedPeakFrequencyBin),
                16000
              )
            );
          }
        }
      }
    }
  }
}
