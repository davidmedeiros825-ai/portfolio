export const SEED = 20260918;
export const DAYS = 30;

export const PROVIDERS = ["slots_a", "slots_b", "crash_c"] as const;
export type Provider = (typeof PROVIDERS)[number];

export type ProviderDay = { bets: number; stake: number; win: number };

export type DayRecord = {
  day: number;
  providers: Record<Provider, ProviderDay>;
  deposits: number;
  withdrawals: number;
};

export type AnomalyFlags = {
  cancel_exploit: boolean;
  feed_outage: boolean;
  duplicate_rows: boolean;
};

export const ANOMALY_KEYS = ["cancel_exploit", "feed_outage", "duplicate_rows"] as const;
export type AnomalyKey = (typeof ANOMALY_KEYS)[number];

export const ALL_ON: AnomalyFlags = { cancel_exploit: true, feed_outage: true, duplicate_rows: true };
export const ALL_OFF: AnomalyFlags = { cancel_exploit: false, feed_outage: false, duplicate_rows: false };

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PROFILE: Record<Provider, { bets: number; ticket: number; rtp: number }> = {
  slots_a: { bets: 9000, ticket: 11, rtp: 0.96 },
  slots_b: { bets: 6000, ticket: 8, rtp: 0.95 },
  crash_c: { bets: 4000, ticket: 10, rtp: 0.97 },
};

// symmetric noise in [-amp, amp]
function noise(rand: () => number, amp: number): number {
  return (rand() * 2 - 1) * amp;
}

/** The official back office: true values. */
export function generateLedger(seed: number = SEED): DayRecord[] {
  const rand = mulberry32(seed);
  const out: DayRecord[] = [];
  for (let day = 1; day <= DAYS; day++) {
    const providers = {} as Record<Provider, ProviderDay>;
    for (const p of PROVIDERS) {
      const prof = PROFILE[p];
      const bets = Math.round(prof.bets * (1 + noise(rand, 0.08)));
      const ticket = prof.ticket * (1 + noise(rand, 0.1));
      const stake = bets * ticket;
      const win = stake * (prof.rtp + noise(rand, 0.01));
      providers[p] = { bets, stake, win };
    }
    const deposits = 180000 * (1 + noise(rand, 0.08));
    const withdrawals = 150000 * (1 + noise(rand, 0.08));
    out.push({ day, providers, deposits, withdrawals });
  }
  return out;
}

/** The pipeline: ledger values plus the anomalies that are switched on. */
export function applyAnomalies(ledger: DayRecord[], flags: AnomalyFlags, seed: number = SEED): DayRecord[] {
  // separate stream so toggling one anomaly never changes another's randomness
  const rand = mulberry32(seed + 1);
  const multipliers = ledger.map(() => 12 + rand() * 35);
  return ledger.map((rec, i) => {
    const providers = {
      slots_a: { ...rec.providers.slots_a },
      slots_b: { ...rec.providers.slots_b },
      crash_c: { ...rec.providers.crash_c },
    };
    let deposits = rec.deposits;
    if (flags.cancel_exploit && rec.day >= 12) providers.crash_c.stake *= multipliers[i];
    if (flags.feed_outage && rec.day >= 20 && rec.day <= 22) providers.slots_b.win = 0;
    if (flags.duplicate_rows && rec.day >= 5 && rec.day <= 9) deposits *= 1.015;
    return { ...rec, providers, deposits };
  });
}

export function generateDataset(flags: AnomalyFlags, seed: number = SEED) {
  const ledger = generateLedger(seed);
  const pipeline = applyAnomalies(ledger, flags, seed);
  return { ledger, pipeline };
}
