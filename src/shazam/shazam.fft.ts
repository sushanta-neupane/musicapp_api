export class ComplexNumber {
  constructor(
    public real: number,
    public imag: number
  ) {}

  static add(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return new ComplexNumber(a.real + b.real, a.imag + b.imag);
  }

  static subtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return new ComplexNumber(a.real - b.real, a.imag - b.imag);
  }

  static multiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return new ComplexNumber(a.real * b.real - a.imag * b.imag, a.real * b.imag + a.imag * b.real);
  }
}

export function fft(input: ComplexNumber[]): ComplexNumber[] {
  const N = input.length;

  if (N <= 1) {
    return input;
  }

  const even = fft(input.filter((_, index) => index % 2 === 0));
  const odd = fft(input.filter((_, index) => index % 2 === 1));

  const twiddleFactors = Array.from(
    {
      length: N
    },
    (_, k) => {
      const angle = (-2 * Math.PI * k) / N;
      return new ComplexNumber(Math.cos(angle), Math.sin(angle));
    }
  );

  const result: ComplexNumber[] = [];
  for (let k = 0; k < N / 2; k++) {
    const t = ComplexNumber.multiply(twiddleFactors[k], odd[k]);
    const add = ComplexNumber.add(even[k], t);
    const subtract = ComplexNumber.subtract(even[k], t);

    result[k] = add;
    result[k + N / 2] = subtract;
  }

  return result;
}
