export function s16LEToSamplesArray(rawSamples: Uint8Array) {
  const samplesArray: number[] = [];
  for (let i = 0; i < rawSamples.length / 2; i++) {
    let sample = rawSamples[2 * i] | (rawSamples[2 * i + 1] << 8);
    if (sample & 0x8000) {
      sample = (sample & 0x7fff) - 0x8000;
    }
    samplesArray.push(sample);
  }
  return samplesArray;
}
