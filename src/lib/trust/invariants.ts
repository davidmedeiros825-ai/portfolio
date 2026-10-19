import { DAYS, PROVIDERS, type DayRecord, type Provider } from "./generate";

export type BaselineMode = "anchored" | "moving";
export type InvariantId = "I1" | "I2" | "I3" | "I4" | "I5";
export const INVARIANT_IDS: InvariantId[] = ["I1", "I2", "I3", "I4", "I5"];

export const INVARIANT_LABELS: Record<InvariantId, string> = {
  I1: "Deposit reconciliation",
  I2: "RTP per provider",
  I3: "Ticket anomaly",
  I4: "Volume drop",
  I5: "Balance conservation",
};

export type DayResult = {
  day: number;
  status: "ok" | "alert";
  value: number;
  threshold: number;
  valueText: string;
  thresholdText: string;
  explanation: string;
  providers?: Provider[];
};

export type InvariantResults = Record<InvariantId, DayResult[]>;

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Baseline for `day` from a daily series (index 0 = day 1). null when no history. */
export function baselineFor(series: number[], day: number, mode: BaselineMode): number | null {
  if (mode === "anchored") return median(series.slice(0, 10));
  const from = Math.max(1, day - 7);
  const window = series.slice(from - 1, day - 1);
  return window.length ? median(window) : null;
}

const NO_BASELINE = "No history yet, so no baseline.";

function noBaseline(day: number, thresholdText: string, threshold: number): DayResult {
  return { day, status: "ok", value: 0, threshold, valueText: "n/a", thresholdText, explanation: NO_BASELINE };
}

const rtpOf = (r: DayRecord, p: Provider) => (r.providers[p].stake ? r.providers[p].win / r.providers[p].stake : 0);
const ticketOf = (r: DayRecord, p: Provider) => (r.providers[p].bets ? r.providers[p].stake / r.providers[p].bets : 0);
const balanceOf = (r: DayRecord) => {
  let stake = 0;
  let win = 0;
  for (const p of PROVIDERS) {
    stake += r.providers[p].stake;
    win += r.providers[p].win;
  }
  return r.deposits - r.withdrawals - (stake - win);
};

export function runInvariants(ledger: DayRecord[], pipeline: DayRecord[], mode: BaselineMode): InvariantResults {
  const res: InvariantResults = { I1: [], I2: [], I3: [], I4: [], I5: [] };

  const rtpSeries = {} as Record<Provider, number[]>;
  const ticketSeries = {} as Record<Provider, number[]>;
  const betsSeries = {} as Record<Provider, number[]>;
  for (const p of PROVIDERS) {
    rtpSeries[p] = pipeline.map((r) => rtpOf(r, p));
    ticketSeries[p] = pipeline.map((r) => ticketOf(r, p));
    betsSeries[p] = pipeline.map((r) => r.providers[p].bets);
  }

  for (let i = 0; i < DAYS; i++) {
    const day = i + 1;
    const pipe = pipeline[i];
    const led = ledger[i];

    // I1 deposit reconciliation
    {
      const gap = led.deposits ? Math.abs(pipe.deposits - led.deposits) / led.deposits : 0;
      const alert = gap > 0.001;
      res.I1.push({
        day,
        status: alert ? "alert" : "ok",
        value: gap * 100,
        threshold: 0.1,
        valueText: `${(gap * 100).toFixed(2)}%`,
        thresholdText: "0.10%",
        explanation: alert
          ? "Pipeline deposits differ from the ledger by more than 0.1%."
          : "Pipeline deposits match the ledger within 0.1%.",
      });
    }

    // I2 RTP per provider
    {
      const bad: Provider[] = [];
      let worst = 0;
      let missing = false;
      for (const p of PROVIDERS) {
        const base = baselineFor(rtpSeries[p], day, mode);
        if (base === null) {
          missing = true;
          continue;
        }
        const dev = (rtpSeries[p][i] - base) * 100;
        if (Math.abs(dev) > Math.abs(worst)) worst = dev;
        if (Math.abs(dev) > 3) bad.push(p);
      }
      if (missing) res.I2.push(noBaseline(day, "±3.0 pp", 3));
      else
        res.I2.push({
          day,
          status: bad.length ? "alert" : "ok",
          value: worst,
          threshold: 3,
          valueText: `${worst >= 0 ? "+" : ""}${worst.toFixed(1)} pp`,
          thresholdText: "±3.0 pp",
          explanation: bad.length
            ? `RTP outside ±3 pp of the baseline for ${bad.join(", ")}.`
            : "RTP is within ±3 pp of the baseline for every provider.",
          providers: bad,
        });
    }

    // I3 ticket anomaly
    {
      const bad: Provider[] = [];
      let worst = 0;
      let missing = false;
      for (const p of PROVIDERS) {
        const tb = baselineFor(ticketSeries[p], day, mode);
        const bb = baselineFor(betsSeries[p], day, mode);
        if (tb === null || bb === null) {
          missing = true;
          continue;
        }
        const ratio = ticketSeries[p][i] / tb;
        const betsRel = betsSeries[p][i] / bb;
        worst = Math.max(worst, ratio);
        if (ratio > 5 && Math.abs(betsRel - 1) <= 0.2) bad.push(p);
      }
      if (missing) res.I3.push(noBaseline(day, "5.0x", 5));
      else
        res.I3.push({
          day,
          status: bad.length ? "alert" : "ok",
          value: worst,
          threshold: 5,
          valueText: `${worst.toFixed(1)}x`,
          thresholdText: "5.0x",
          explanation: bad.length
            ? `Average ticket above 5x the baseline while bet count is flat (${bad.join(", ")}): volume up, activity unchanged.`
            : "Average ticket is within 5x the baseline, or bet count moved with it.",
          providers: bad,
        });
    }

    // I4 volume drop
    {
      const bad: Provider[] = [];
      let lowest = Infinity;
      let missing = false;
      for (const p of PROVIDERS) {
        const bb = baselineFor(betsSeries[p], day, mode);
        if (bb === null) {
          missing = true;
          continue;
        }
        const rel = betsSeries[p][i] / bb;
        lowest = Math.min(lowest, rel);
        if (rel < 0.5) bad.push(p);
      }
      if (missing) res.I4.push(noBaseline(day, "50% of baseline", 50));
      else
        res.I4.push({
          day,
          status: bad.length ? "alert" : "ok",
          value: lowest * 100,
          threshold: 50,
          valueText: `${(lowest * 100).toFixed(0)}% of baseline`,
          thresholdText: "50% of baseline",
          explanation: bad.length
            ? `Bet count below 50% of the baseline for ${bad.join(", ")}.`
            : "Bet count is at least 50% of the baseline for every provider.",
          providers: bad,
        });
    }

    // I5 balance conservation
    {
      const l = balanceOf(led);
      const p = balanceOf(pipe);
      const gap = Math.abs(p - l) / Math.max(Math.abs(l), 1);
      const alert = gap > 0.01;
      res.I5.push({
        day,
        status: alert ? "alert" : "ok",
        value: gap * 100,
        threshold: 1,
        valueText: `${(gap * 100).toFixed(1)}%`,
        thresholdText: "1.0%",
        explanation: alert
          ? "(deposits - withdrawals) - (stake - win) in the pipeline differs from the ledger by more than 1%."
          : "(deposits - withdrawals) - (stake - win) matches the ledger within 1%.",
      });
    }
  }
  return res;
}
