export const THOUSANDS_SEPARATOR_BOUNDARY = /\B(?=(\d{3})+(?!\d))/g;
export const NON_DIGIT = /\D/g;
export const RUT_PUNCTUATION = /[.\-]/g;
export const RUT_FORMAT = /^0*\d{1,3}(\.?\d{3})*-?[\dkK]$/;

export function computeDv(body: string): number | "K" {
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return 0;
  if (remainder === 10) return "K";
  return remainder;
}
