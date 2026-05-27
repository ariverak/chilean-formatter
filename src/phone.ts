import { NON_DIGIT } from "./internal.js";

const CHILE_COUNTRY_CODE = "56";
const CHILE_PHONE_LENGTH = 9;

export function cleanPhone(phone: string | number): string {
  const digits = phone.toString().replace(NON_DIGIT, "");
  if (
    digits.length === CHILE_PHONE_LENGTH + CHILE_COUNTRY_CODE.length &&
    digits.startsWith(CHILE_COUNTRY_CODE)
  ) {
    return digits.slice(CHILE_COUNTRY_CODE.length);
  }
  return digits;
}

export function validatePhone(phone: string | number): boolean {
  const clean = cleanPhone(phone);
  if (clean.length !== CHILE_PHONE_LENGTH) return false;
  return /^[2-9]/.test(clean);
}

export function formatPhone(phone: string | number): string {
  const clean = cleanPhone(phone);
  if (clean.length !== CHILE_PHONE_LENGTH || !/^[2-9]/.test(clean)) {
    return phone.toString();
  }
  const area = clean[0];
  const subscriber = clean.slice(1);
  return `+56 ${area} ${subscriber.slice(0, 4)} ${subscriber.slice(4)}`;
}
