import { THOUSANDS_SEPARATOR_BOUNDARY } from "./internal.js";

export function formatDecimal(value: number | string, decimals?: number): string {
  const num =
    typeof value === "string" ? Number(value.replace(/\./g, "").replace(",", ".")) : value;
  if (!Number.isFinite(num)) return "";
  const fixed = decimals !== undefined ? num.toFixed(decimals) : num.toString();
  const negative = fixed.startsWith("-");
  const unsigned = negative ? fixed.slice(1) : fixed;
  const [intPart, decPart] = unsigned.split(".");
  const grouped = (intPart ?? "0").replace(THOUSANDS_SEPARATOR_BOUNDARY, ".");
  const body = decPart ? `${grouped},${decPart}` : grouped;
  return negative ? `-${body}` : body;
}

export function cleanDecimal(value: string | number): string {
  const str = value.toString().replace(/[^\d,.\-]/g, "");
  return str.replace(/\./g, "").replace(",", ".");
}
