import type { AnomalyKey } from "@/lib/trust/generate";
import type { InvariantId } from "@/lib/trust/invariants";

// Copy for the live demo page (English only).
export const demo = {
  back: "← Back to the case",
  title: "Daily checks, live demo",
  lede: "Synthetic data, fixed seed. Turn each problem on or off and see which daily check catches it.",
  controlsLabel: "Controls",
  toggles: {
    cancel_exploit: "Cancelled bets counted as volume",
    feed_outage: "Winnings feed down, days 20 to 22",
    duplicate_rows: "Duplicated deposit rows, days 5 to 9",
  } satisfies Record<AnomalyKey, string>,
  baselineLegend: "Baseline",
  baselineFixed: "Fixed baseline (days 1 to 10)",
  baselineMoving: "7-day moving average",
  checksTitle: "Daily checks",
  gridLabel: "Daily check results, five checks by days 1 to 30",
  checks: {
    I1: "Deposits match",
    I2: "Payout rate per game",
    I3: "Bet size spike",
    I4: "Volume drop",
    I5: "Money in vs. money out",
  } satisfies Record<InvariantId, string>,
  hint: "Hover or focus a cell for value, threshold and explanation.",
  chartTitle: "Daily volume, crash game",
  chartAria: "Daily volume for the crash game, pipeline versus ledger, days 1 to 30",
  reconTitle: "Reconciliation, 30 days",
  calloutTitle: "What the baseline switch shows",
  callout1:
    "With a 7-day moving average, the bet size spike check fires on day 12 and goes silent after a few days because the baseline absorbs the fraud.",
  callout2: "The fixed baseline keeps firing.",
  writeupTitle: "Write-up",
  writeup: [
    ["Problem", "Two sources disagreed on the same number, and the pipeline also carried a fraud that inflated volume."],
    ["Architecture", "Synthetic generator, pipeline with problems you can switch on, official ledger, daily checks, results grid."],
    [
      "Decisions",
      "A fixed baseline over a moving average; reconciliation and daily checks as separate controls (reconciliation validates transport, the daily checks validate internal consistency); materiality thresholds to keep alerts near 1 per day.",
    ],
    ["Verification", "Unit tests prove each daily check fires on its planted problem and stays silent on clean data."],
    ["Original system", "BigQuery + Python + Postgres functions, daily schedule. This demo reproduces the logic, not the code."],
  ] as [string, string][],
  footer: "Synthetic data, fixed seed.",
};
