import { describe, expect, it } from "vitest";
import { formatInt, formatPct } from "./format";

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
