import {
  RUT_FORMAT,
  RUT_PUNCTUATION,
  THOUSANDS_SEPARATOR_BOUNDARY,
  computeDv,
} from "./internal.js";

const RUT_BUSINESS_THRESHOLD = 50_000_000;

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

export function getRutDv(cleanRut: string | number): number | "K" {
  return computeDv(cleanRut.toString());
}

export function getRutType(rut: string | number): "persona" | "empresa" {
  const body = cleanRut(rut, false);
  return Number(body) >= RUT_BUSINESS_THRESHOLD ? "empresa" : "persona";
}

export function isProbablyRut(input: unknown): boolean {
  if (typeof input !== "string" && typeof input !== "number") return false;
  return RUT_FORMAT.test(input.toString());
}

export function maskRut(rut: string | number, visible = 5): string {
  const formatted = formatterRut(rut);
  if (formatted.length <= visible) return formatted;
  const cutoff = formatted.length - visible;
  return formatted.slice(0, cutoff).replace(/\d/g, "X") + formatted.slice(cutoff);
}
