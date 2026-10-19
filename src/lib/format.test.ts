import { describe, expect, it } from "vitest";
import { formatInt, formatMoney, formatPct } from "./format";

describe("formatPct", () => {
  it("uses one digit by default", () => {
    expect(formatPct(12.34)).toBe("12.3%");
  });
  it("respects the digits argument", () => {
    expect(formatPct(12.345, 2)).toBe("12.35%");
  });
});

describe("formatInt", () => {
  it("adds thousands separators", () => {
    expect(formatInt(1234567)).toBe("1,234,567");
  });
  it("leaves small numbers untouched", () => {
    expect(formatInt(999)).toBe("999");
  });
});

describe("formatMoney", () => {
  it("formats thousands with one decimal and a k suffix", () => {
    expect(formatMoney(182400)).toBe("R$ 182.4k");
  });
  it("formats millions with an M suffix", () => {
    expect(formatMoney(1_250_000)).toBe("R$ 1.3M");
  });
  it("formats small values as whole reais", () => {
    expect(formatMoney(950.4)).toBe("R$ 950");
  });
  it("keeps the sign in front of the currency", () => {
    expect(formatMoney(-2500)).toBe("-R$ 2.5k");
  });
});
