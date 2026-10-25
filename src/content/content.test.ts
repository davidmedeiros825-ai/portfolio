import { describe, expect, it } from "vitest";
import { en } from "./en";
import { pt } from "./pt";

function keys(v: unknown, prefix = ""): string[] {
  if (Array.isArray(v)) {
    return [`${prefix}[${v.length}]`, ...v.flatMap((x, i) => keys(x, `${prefix}[${i}]`))];
  }
  if (v && typeof v === "object") {
    return Object.entries(v as Record<string, unknown>).flatMap(([k, x]) => keys(x, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe("content dictionaries", () => {
  it("pt and en have the same keys (deep)", () => {
    expect(keys(pt).sort()).toEqual(keys(en).sort());
  });
  it("pt has no em dash", () => {
    expect(JSON.stringify(pt)).not.toContain("—");
  });
});
