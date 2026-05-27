import { describe, expect, it } from "vitest";
import {
  cleanClp,
  cleanDecimal,
  cleanPatente,
  cleanPhone,
  cleanRut,
  formatDecimal,
  formatPatente,
  formatPhone,
  formatterRut,
  getRutDv,
  getRutType,
  isProbablyRut,
  maskRut,
  numberToClp,
  validatePatente,
  validatePhone,
  validateRut,
} from "./index.js";

describe("formatterRut", () => {
  it("formats clean numeric rut", () => {
    expect(formatterRut("181303859")).toBe("18.130.385-9");
  });

  it("strips leading zeros", () => {
    expect(formatterRut("0000181303859")).toBe("18.130.385-9");
  });

  it("accepts numeric input", () => {
    expect(formatterRut(181303859)).toBe("18.130.385-9");
  });

  it("formats rut ending in K", () => {
    expect(formatterRut("12345678K")).toBe("12.345.678-K");
  });

  it("returns input unchanged when length <= 1", () => {
    expect(formatterRut("1")).toBe("1");
  });

  it("re-formats already formatted rut", () => {
    expect(formatterRut("18.130.385-9")).toBe("18.130.385-9");
  });
});

describe("cleanRut", () => {
  it("removes dots and dash by default and drops dv", () => {
    expect(cleanRut("18.130.385-9")).toBe("18130385");
  });

  it("keeps dv when withoutDv is true", () => {
    expect(cleanRut("18.130.385-9", true)).toBe("181303859");
  });

  it("preserves K dv", () => {
    expect(cleanRut("18.130.385-K", true)).toBe("18130385K");
  });

  it("accepts numeric input", () => {
    expect(cleanRut(18130385, true)).toBe("18130385");
  });
});

describe("validateRut", () => {
  it("validates correct rut with dots and dash", () => {
    expect(validateRut("18.130.385-9")).toBe(true);
  });

  it("validates correct rut without formatting", () => {
    expect(validateRut("181303859")).toBe(true);
  });

  it("rejects rut with wrong dv", () => {
    expect(validateRut("18.130.385-0")).toBe(false);
  });

  it("rejects non-rut strings", () => {
    expect(validateRut("abc")).toBe(false);
  });

  it("rejects empty-ish input", () => {
    expect(validateRut("")).toBe(false);
  });

  it("accepts lowercase k", () => {
    expect(validateRut("12345670-k")).toBe(true);
  });

  it("accepts uppercase K", () => {
    expect(validateRut("12345670-K")).toBe(true);
  });
});

describe("numberToClp", () => {
  it("formats 7-digit amount with default separator and symbol", () => {
    expect(numberToClp("1256500")).toBe("$1.256.500");
  });

  it("uses custom separator", () => {
    expect(numberToClp("1256500", ",")).toBe("$1,256,500");
  });

  it("uses custom symbol", () => {
    expect(numberToClp("1256500", ".", "CLP ")).toBe("CLP 1.256.500");
  });

  it("returns empty string for empty input", () => {
    expect(numberToClp("")).toBe("");
  });

  it("formats single digit", () => {
    expect(numberToClp("5")).toBe("$5");
  });

  it("formats two digits", () => {
    expect(numberToClp("12")).toBe("$12");
  });

  it("formats three digits", () => {
    expect(numberToClp("123")).toBe("$123");
  });

  it("formats four digits", () => {
    expect(numberToClp("1234")).toBe("$1.234");
  });

  it("formats six digits", () => {
    expect(numberToClp("123456")).toBe("$123.456");
  });

  it("strips non-digit chars from input", () => {
    expect(numberToClp("$1.256.500")).toBe("$1.256.500");
  });

  it("accepts numeric input", () => {
    expect(numberToClp(60000)).toBe("$60.000");
  });

  it("formats zero", () => {
    expect(numberToClp("0")).toBe("$0");
  });
});

describe("cleanClp", () => {
  it("removes symbol and separators", () => {
    expect(cleanClp("$1.256.500")).toBe("1256500");
  });

  it("removes letters and commas", () => {
    expect(cleanClp("CLP 60,000")).toBe("60000");
  });

  it("returns empty string when no digits present", () => {
    expect(cleanClp("abc")).toBe("");
  });

  it("accepts numeric input", () => {
    expect(cleanClp(1256500)).toBe("1256500");
  });
});

describe("getRutDv", () => {
  it("computes numeric dv", () => {
    expect(getRutDv(18130385)).toBe(9);
  });

  it("accepts string input", () => {
    expect(getRutDv("18130385")).toBe(9);
  });

  it("returns K when computed dv equals 10", () => {
    expect(getRutDv(12345670)).toBe("K");
  });

  it("computes dv = 5", () => {
    expect(getRutDv(12345678)).toBe(5);
  });
});

describe("getRutType", () => {
  it("classifies persona below 50M threshold", () => {
    expect(getRutType("18.130.385-9")).toBe("persona");
  });

  it("classifies empresa at or above 50M threshold", () => {
    expect(getRutType("76.123.456-0")).toBe("empresa");
  });

  it("classifies edge case exactly at threshold as empresa", () => {
    expect(getRutType("50.000.000-7")).toBe("empresa");
  });

  it("classifies just below threshold as persona", () => {
    expect(getRutType("49.999.999-K")).toBe("persona");
  });
});

describe("isProbablyRut", () => {
  it("matches formatted rut", () => {
    expect(isProbablyRut("18.130.385-9")).toBe(true);
  });

  it("matches unformatted rut", () => {
    expect(isProbablyRut("181303859")).toBe(true);
  });

  it("rejects random strings", () => {
    expect(isProbablyRut("hello")).toBe(false);
  });

  it("rejects null/undefined", () => {
    expect(isProbablyRut(null)).toBe(false);
    expect(isProbablyRut(undefined)).toBe(false);
  });

  it("accepts numeric input", () => {
    expect(isProbablyRut(181303859)).toBe(true);
  });
});

describe("maskRut", () => {
  it("masks all but last 5 chars by default", () => {
    expect(maskRut("18.130.385-9")).toBe("XX.XXX.385-9");
  });

  it("accepts custom visible count", () => {
    expect(maskRut("18.130.385-9", 2)).toBe("XX.XXX.XXX-9");
  });

  it("preserves dots and dash in mask", () => {
    expect(maskRut("76.123.456-0")).toBe("XX.XXX.456-0");
  });

  it("returns unchanged when too short", () => {
    expect(maskRut("1")).toBe("1");
  });
});

describe("formatDecimal", () => {
  it("formats integer with thousands separator", () => {
    expect(formatDecimal(1234)).toBe("1.234");
  });

  it("formats decimal with comma", () => {
    expect(formatDecimal(1234.56)).toBe("1.234,56");
  });

  it("respects fixed decimals", () => {
    expect(formatDecimal(1234.5, 2)).toBe("1.234,50");
  });

  it("handles zero decimals param", () => {
    expect(formatDecimal(1234.56, 0)).toBe("1.235");
  });

  it("handles negatives", () => {
    expect(formatDecimal(-1234.5)).toBe("-1.234,5");
  });

  it("handles zero", () => {
    expect(formatDecimal(0)).toBe("0");
  });

  it("returns empty for non-numeric strings", () => {
    expect(formatDecimal("abc")).toBe("");
  });

  it("parses CL-formatted string input", () => {
    expect(formatDecimal("1.234,56")).toBe("1.234,56");
  });

  it("formats large UF-like values", () => {
    expect(formatDecimal(37854.23, 2)).toBe("37.854,23");
  });
});

describe("cleanDecimal", () => {
  it("converts CL decimal to JS-parseable", () => {
    expect(cleanDecimal("1.234,56")).toBe("1234.56");
  });

  it("strips symbols", () => {
    expect(cleanDecimal("$ 1.234,56")).toBe("1234.56");
  });

  it("handles integer", () => {
    expect(cleanDecimal("1.234")).toBe("1234");
  });

  it("handles negatives", () => {
    expect(cleanDecimal("-1.234,5")).toBe("-1234.5");
  });
});

describe("cleanPhone", () => {
  it("strips formatting and keeps 9 digits", () => {
    expect(cleanPhone("+56 9 1234 5678")).toBe("912345678");
  });

  it("strips country code 56 when present", () => {
    expect(cleanPhone("56912345678")).toBe("912345678");
  });

  it("returns 9 digits when no country code", () => {
    expect(cleanPhone("912345678")).toBe("912345678");
  });

  it("handles spaces and dashes", () => {
    expect(cleanPhone("9 1234-5678")).toBe("912345678");
  });
});

describe("validatePhone", () => {
  it("validates mobile", () => {
    expect(validatePhone("+56 9 1234 5678")).toBe(true);
  });

  it("validates Santiago landline", () => {
    expect(validatePhone("+56 2 2345 6789")).toBe(true);
  });

  it("validates regional landline", () => {
    expect(validatePhone("+56 32 234 5678")).toBe(true);
  });

  it("rejects short number", () => {
    expect(validatePhone("12345")).toBe(false);
  });

  it("rejects number starting with 0 or 1", () => {
    expect(validatePhone("012345678")).toBe(false);
    expect(validatePhone("112345678")).toBe(false);
  });

  it("rejects empty", () => {
    expect(validatePhone("")).toBe(false);
  });
});

describe("formatPhone", () => {
  it("formats mobile from raw 9 digits", () => {
    expect(formatPhone("912345678")).toBe("+56 9 1234 5678");
  });

  it("formats Santiago landline", () => {
    expect(formatPhone("223456789")).toBe("+56 2 2345 6789");
  });

  it("handles input with +56 prefix", () => {
    expect(formatPhone("+56912345678")).toBe("+56 9 1234 5678");
  });

  it("returns original when invalid length", () => {
    expect(formatPhone("123")).toBe("123");
  });

  it("accepts numeric input", () => {
    expect(formatPhone(912345678)).toBe("+56 9 1234 5678");
  });
});

describe("cleanPatente", () => {
  it("removes dots, dashes, middots and uppercases", () => {
    expect(cleanPatente("bb·cd·12")).toBe("BBCD12");
  });

  it("handles new format with no separators", () => {
    expect(cleanPatente("BBCD12")).toBe("BBCD12");
  });

  it("handles old format with dash", () => {
    expect(cleanPatente("AB-1234")).toBe("AB1234");
  });
});

describe("validatePatente", () => {
  it("validates new format (4 letters + 2 digits)", () => {
    expect(validatePatente("BBCD12")).toBe(true);
  });

  it("validates old format (2 letters + 4 digits)", () => {
    expect(validatePatente("AB1234")).toBe(true);
  });

  it("accepts formatted input", () => {
    expect(validatePatente("BB·CD·12")).toBe(true);
  });

  it("rejects wrong character composition", () => {
    expect(validatePatente("12BBCD")).toBe(false);
    expect(validatePatente("BBCDEF")).toBe(false);
  });

  it("rejects too short or long", () => {
    expect(validatePatente("ABC12")).toBe(false);
    expect(validatePatente("BBCD123")).toBe(false);
  });

  it("rejects empty", () => {
    expect(validatePatente("")).toBe(false);
  });
});

describe("formatPatente", () => {
  it("formats new patente with middots", () => {
    expect(formatPatente("BBCD12")).toBe("BB·CD·12");
  });

  it("formats old patente", () => {
    expect(formatPatente("AB1234")).toBe("AB·12·34");
  });

  it("accepts custom separator", () => {
    expect(formatPatente("BBCD12", "-")).toBe("BB-CD-12");
  });

  it("reformats already formatted input", () => {
    expect(formatPatente("bb·cd·12")).toBe("BB·CD·12");
  });

  it("returns original when invalid", () => {
    expect(formatPatente("INVALID")).toBe("INVALID");
  });
});
