import { NON_DIGIT, THOUSANDS_SEPARATOR_BOUNDARY } from "./internal.js";

export function numberToClp(monto: string | number, separator = ".", symbol = "$"): string {
  const digits = monto.toString().replace(NON_DIGIT, "");
  if (!digits) return "";
  const grouped = digits.replace(THOUSANDS_SEPARATOR_BOUNDARY, separator);
  return `${symbol}${grouped}`;
}

export function cleanClp(monto: string | number): string {
  return monto.toString().replace(NON_DIGIT, "");
}
