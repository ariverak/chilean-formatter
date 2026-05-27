const PATENTE_PUNCTUATION = /[·\-\s.]/g;
const PATENTE_NEW = /^[A-Z]{4}\d{2}$/;
const PATENTE_OLD = /^[A-Z]{2}\d{4}$/;

export function cleanPatente(input: string | number): string {
  return input.toString().toUpperCase().replace(PATENTE_PUNCTUATION, "");
}

export function validatePatente(input: string | number): boolean {
  const clean = cleanPatente(input);
  return PATENTE_NEW.test(clean) || PATENTE_OLD.test(clean);
}

export function formatPatente(input: string | number, separator = "·"): string {
  const clean = cleanPatente(input);
  if (!PATENTE_NEW.test(clean) && !PATENTE_OLD.test(clean)) {
    return input.toString();
  }
  return `${clean.slice(0, 2)}${separator}${clean.slice(2, 4)}${separator}${clean.slice(4)}`;
}
