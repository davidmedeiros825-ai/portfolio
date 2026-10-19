import { describe, expect, it } from "vitest";
import { ALL_OFF, ALL_ON, generateDataset, generateLedger, type AnomalyFlags } from "./generate";
import { INVARIANT_IDS, runInvariants, type BaselineMode, type InvariantId } from "./invariants";
import { reconcile } from "./reconcile";

function run(flags: AnomalyFlags, mode: BaselineMode = "anchored") {
  const { ledger, pipeline } = generateDataset(flags);
  return runInvariants(ledger, pipeline, mode);
}
const alertDays = (res: ReturnType<typeof run>, id: InvariantId) =>
  res[id].filter((r) => r.status === "alert").map((r) => r.day);
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

describe("generator", () => {
  it("is deterministic for the same seed", () => {
    expect(generateLedger(20260918)).toEqual(generateLedger(20260918));
    expect(generateDataset(ALL_ON)).toEqual(generateDataset(ALL_ON));
  });
  it("changes with a different seed", () => {
    expect(generateLedger(1)).not.toEqual(generateLedger(2));
  });
});

describe("invariants", () => {
  it("raise zero alerts on clean data (anchored and moving)", () => {
    for (const mode of ["anchored", "moving"] as const) {
      const res = run(ALL_OFF, mode);
      for (const id of INVARIANT_IDS) expect(alertDays(res, id)).toEqual([]);
    }
  });

  it("cancel_exploit alone: I3 alerts days 12 to 30; I1 and I4 silent", () => {
    const res = run({ ...ALL_OFF, cancel_exploit: true });
    expect(alertDays(res, "I3")).toEqual(range(12, 30));
    expect(alertDays(res, "I1")).toEqual([]);
    expect(alertDays(res, "I4")).toEqual([]);
  });

  it("cancel_exploit with moving baseline: I3 alerts day 12, then goes silent", () => {
    const res = run({ ...ALL_OFF, cancel_exploit: true }, "moving");
    expect(alertDays(res, "I3")).toContain(12);
    const silentAfter18 = res.I3.filter((r) => r.day > 18 && r.status === "ok").length;
    expect(silentAfter18).toBeGreaterThanOrEqual(5);
  });

  it("feed_outage alone: I2 (slots_b) and I5 alert on days 20 to 22 only", () => {
    const res = run({ ...ALL_OFF, feed_outage: true });
    expect(alertDays(res, "I2")).toEqual([20, 21, 22]);
    for (const d of res.I2.filter((r) => r.status === "alert")) expect(d.providers).toEqual(["slots_b"]);
    expect(alertDays(res, "I5")).toEqual([20, 21, 22]);
  });

  it("duplicate_rows alone: I1 alerts days 5 to 9 only", () => {
    const res = run({ ...ALL_OFF, duplicate_rows: true });
    expect(alertDays(res, "I1")).toEqual(range(5, 9));
  });
});

describe("reconcile", () => {
  it("leaves 0.0% unexplained with all anomalies on", () => {
    const { ledger, pipeline } = generateDataset(ALL_ON);
    for (const row of reconcile(ledger, pipeline, ALL_ON)) {
      expect(row.unexplainedPct).toBeLessThan(0.05);
      expect(row.explainedBy.length).toBe(1);
    }
  });
  it("reports no gap on clean data", () => {
    const { ledger, pipeline } = generateDataset(ALL_OFF);
    for (const row of reconcile(ledger, pipeline, ALL_OFF)) expect(row.gap).toBe(0);
  });
});
