import { ANOMALY_KEYS, PROVIDERS, applyAnomalies, type AnomalyFlags, type AnomalyKey, type DayRecord } from "./generate";

export type ReconRow = {
  metric: "Deposits" | "Stake (all providers)" | "Win (all providers)";
  ledger: number;
  pipeline: number;
  gap: number;
  gapPct: number;
  explainedBy: AnomalyKey[];
  unexplainedPct: number;
};

type Pick = (days: DayRecord[]) => number;

const sum = (days: DayRecord[], f: (r: DayRecord) => number) => days.reduce((a, r) => a + f(r), 0);

const METRICS: { metric: ReconRow["metric"]; pick: Pick }[] = [
  { metric: "Deposits", pick: (d) => sum(d, (r) => r.deposits) },
  { metric: "Stake (all providers)", pick: (d) => sum(d, (r) => PROVIDERS.reduce((a, p) => a + r.providers[p].stake, 0)) },
  { metric: "Win (all providers)", pick: (d) => sum(d, (r) => PROVIDERS.reduce((a, p) => a + r.providers[p].win, 0)) },
];

/** An anomaly "explains" a gap when switching only it off changes the metric. */
export function reconcile(ledger: DayRecord[], pipeline: DayRecord[], flags: AnomalyFlags, seed?: number): ReconRow[] {
  return METRICS.map(({ metric, pick }) => {
    const l = pick(ledger);
    const p = pick(pipeline);
    const gap = p - l;
    const explainedBy: AnomalyKey[] = [];
    let explained = 0;
    for (const key of ANOMALY_KEYS) {
      if (!flags[key]) continue;
      const without = pick(applyAnomalies(ledger, { ...flags, [key]: false }, seed));
      const delta = p - without;
      if (Math.abs(delta) > 1e-9) {
        explainedBy.push(key);
        explained += delta;
      }
    }
    const unexplained = gap - explained;
    return {
      metric,
      ledger: l,
      pipeline: p,
      gap,
      gapPct: l ? (gap / l) * 100 : 0,
      explainedBy,
      unexplainedPct: l ? (Math.abs(unexplained) / l) * 100 : 0,
    };
  });
}
