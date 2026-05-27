const THOUSANDS_SEPARATOR_BOUNDARY = /\B(?=(\d{3})+(?!\d))/g;
const RUT_FORMAT = /^0*\d{1,3}(\.?\d{3})*-?[\dkK]$/;
const NON_DIGIT = /\D/g;
const RUT_PUNCTUATION = /[.\-]/g;

function computeDv(body: string): number | "K" {
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

export function formatterRut(rut: string | number): string {
  const stripped = rut.toString().replace(/^0+/, "").replace(RUT_PUNCTUATION, "");
  if (stripped.length <= 1) return stripped;
  const body = stripped.slice(0, -1).replace(THOUSANDS_SEPARATOR_BOUNDARY, ".");
  const dv = stripped.slice(-1);
  return `${body}-${dv}`;
}

export function cleanRut(rut: string | number, withoutDv = false): string {
  const clean = rut.toString().replace(RUT_PUNCTUATION, "");
  return withoutDv ? clean : clean.slice(0, -1);
}

export function validateRut(rut: string | number): boolean {
  const value = rut.toString();
  if (!RUT_FORMAT.test(value)) return false;
  const clean = cleanRut(value, true);
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  return String(computeDv(body)) === dv;
}

export function numberToClp(monto: string | number, separator = ".", symbol = "$"): string {
  const digits = monto.toString().replace(NON_DIGIT, "");
  if (!digits) return "";
  const grouped = digits.replace(THOUSANDS_SEPARATOR_BOUNDARY, separator);
  return `${symbol}${grouped}`;
}

export function cleanClp(monto: string | number): string {
  return monto.toString().replace(NON_DIGIT, "");
}

export function getRutDv(cleanRut: string | number): number | "K" {
  return computeDv(cleanRut.toString());
}
