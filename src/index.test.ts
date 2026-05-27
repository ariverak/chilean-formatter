import { describe, expect, it } from "vitest";
import { cleanClp, cleanRut, formatterRut, getRutDv, numberToClp, validateRut } from "./index.js";

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
