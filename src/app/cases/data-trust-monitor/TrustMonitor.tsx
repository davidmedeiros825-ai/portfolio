"use client";

import { useMemo, useState } from "react";
import { ALL_ON, generateDataset, type AnomalyFlags, type AnomalyKey } from "@/lib/trust/generate";
import {
  INVARIANT_IDS,
  INVARIANT_LABELS,
  runInvariants,
  type BaselineMode,
  type DayResult,
  type InvariantId,
} from "@/lib/trust/invariants";
import { reconcile } from "@/lib/trust/reconcile";
import { formatMoney } from "@/lib/format";
import { StakeChart } from "./StakeChart";
import styles from "./page.module.css";

const TOGGLES: { key: AnomalyKey; label: string }[] = [
  { key: "cancel_exploit", label: "cancel_exploit" },
  { key: "feed_outage", label: "feed_outage" },
  { key: "duplicate_rows", label: "duplicate_rows" },
];

const DAY_LIST = Array.from({ length: 30 }, (_, i) => i + 1);

export function TrustMonitor() {
  const [flags, setFlags] = useState<AnomalyFlags>(ALL_ON);
  const [mode, setMode] = useState<BaselineMode>("anchored");
  const [active, setActive] = useState<{ id: InvariantId; day: number } | null>(null);

  const { ledger, pipeline } = useMemo(() => generateDataset(flags), [flags]);
  const results = useMemo(() => runInvariants(ledger, pipeline, mode), [ledger, pipeline, mode]);
  const rows = useMemo(() => reconcile(ledger, pipeline, flags), [ledger, pipeline, flags]);

  const activeResult: DayResult | null = active ? results[active.id][active.day - 1] : null;
  const unexplained = Math.max(...rows.map((r) => r.unexplainedPct));

  return (
    <>
      <section className={styles.block} aria-label="Controls">
        <div className={styles.controls}>
          <div className={styles.toggles}>
            {TOGGLES.map((t) => (
              <label key={t.key} className={`${styles.toggle} mono`}>
                <input
                  type="checkbox"
                  checked={flags[t.key]}
                  onChange={(e) => setFlags((f) => ({ ...f, [t.key]: e.target.checked }))}
                />
                {t.label}
              </label>
            ))}
          </div>
          <fieldset className={styles.switch}>
            <legend className={`${styles.legend} muted`}>Baseline</legend>
            <label className={styles.option}>
              <input type="radio" name="baseline" checked={mode === "anchored"} onChange={() => setMode("anchored")} />
              Anchored
            </label>
            <label className={styles.option}>
              <input type="radio" name="baseline" checked={mode === "moving"} onChange={() => setMode("moving")} />
              7-day moving
            </label>
          </fieldset>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="grid-h">
        <h2 id="grid-h" className={styles.h2}>
          Invariants by day
        </h2>
        <div className={styles.scroll}>
          <div className={styles.grid} role="group" aria-label="Invariant results, rows I1 to I5, columns days 1 to 30">
            <span />
            {DAY_LIST.map((d) => (
              <span key={d} className={`${styles.dayHead} mono muted`}>
                {d}
              </span>
            ))}
            {INVARIANT_IDS.map((id) => (
              <Row key={id} id={id} results={results[id]} onActive={setActive} />
            ))}
          </div>
        </div>
        <p className={`${styles.detail} mono`} aria-live="polite">
          {active && activeResult ? (
            <>
              {active.id} day {active.day}: {activeResult.status}. Value {activeResult.valueText}, threshold{" "}
              {activeResult.thresholdText}. {activeResult.explanation}
            </>
          ) : (
            <span className="muted">Hover or focus a cell for value, threshold and explanation.</span>
          )}
        </p>
        <ul className={`${styles.key} muted`}>
          {INVARIANT_IDS.map((id) => (
            <li key={id}>
              <span className="mono">{id}</span> {INVARIANT_LABELS[id]}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.block} aria-labelledby="chart-h">
        <h2 id="chart-h" className={styles.h2}>
          Daily stake, crash_c
        </h2>
        <StakeChart ledger={ledger} pipeline={pipeline} showAnnotation={flags.cancel_exploit} />
      </section>

      <section className={styles.block} aria-labelledby="recon-h">
        <h2 id="recon-h" className={styles.h2}>
          Reconciliation, 30 days
        </h2>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Ledger</th>
                <th>Pipeline</th>
                <th>Gap</th>
                <th>Explained by</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.metric}>
                  <td>{r.metric}</td>
                  <td className="mono">{formatMoney(r.ledger)}</td>
                  <td className="mono">{formatMoney(r.pipeline)}</td>
                  <td className="mono">
                    {formatMoney(r.gap)} ({r.gapPct.toFixed(1)}%)
                  </td>
                  <td className="mono">{r.explainedBy.length ? r.explainedBy.join(", ") : "none"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mono muted">Unexplained: {unexplained.toFixed(1)}%</p>
      </section>

      <section className={styles.callout} aria-labelledby="callout-h">
        <h2 id="callout-h" className={styles.h3}>
          What the baseline switch shows
        </h2>
        <p>
          With a 7-day moving baseline, I3 fires on day 12 and goes silent after a few days because the baseline
          absorbs the fraud.
        </p>
        <p>Anchored keeps firing.</p>
      </section>
    </>
  );
}

function Row({
  id,
  results,
  onActive,
}: {
  id: InvariantId;
  results: DayResult[];
  onActive: (a: { id: InvariantId; day: number } | null) => void;
}) {
  return (
    <>
      <span className={`${styles.rowHead} mono`} title={INVARIANT_LABELS[id]}>
        {id}
      </span>
      {results.map((r) => (
        <button
          key={r.day}
          type="button"
          className={`${styles.cell} ${r.status === "alert" ? styles.alert : styles.ok}`}
          aria-label={`Day ${r.day}, ${id} ${INVARIANT_LABELS[id]}, ${r.status}, value ${r.valueText}`}
          onMouseEnter={() => onActive({ id, day: r.day })}
          onFocus={() => onActive({ id, day: r.day })}
        />
      ))}
    </>
  );
}
