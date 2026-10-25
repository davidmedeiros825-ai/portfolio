"use client";

import { useMemo, useState } from "react";
import { ALL_ON, generateDataset, type AnomalyFlags, type AnomalyKey } from "@/lib/trust/generate";
import {
  INVARIANT_IDS,
  runInvariants,
  type BaselineMode,
  type DayResult,
  type InvariantId,
} from "@/lib/trust/invariants";
import { reconcile } from "@/lib/trust/reconcile";
import { formatMoney } from "@/lib/format";
import { demo } from "@/content/demo";
import { StakeChart } from "./StakeChart";
import styles from "./page.module.css";

const TOGGLES: { key: AnomalyKey; label: string }[] = (Object.keys(demo.toggles) as AnomalyKey[]).map((key) => ({
  key,
  label: demo.toggles[key],
}));

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
      <section className={styles.block} aria-label={demo.controlsLabel}>
        <div className={styles.controls}>
          <div className={styles.toggles}>
            {TOGGLES.map((t) => (
              <label key={t.key} className={styles.toggle}>
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
            <legend className={styles.legend}>{demo.baselineLegend}</legend>
            <label className={styles.option}>
              <input type="radio" name="baseline" checked={mode === "anchored"} onChange={() => setMode("anchored")} />
              {demo.baselineFixed}
            </label>
            <label className={styles.option}>
              <input type="radio" name="baseline" checked={mode === "moving"} onChange={() => setMode("moving")} />
              {demo.baselineMoving}
            </label>
          </fieldset>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="grid-h">
        <h2 id="grid-h" className={styles.h2}>
          {demo.checksTitle}
        </h2>
        <div className={styles.scroll}>
          <div className={styles.grid} role="group" aria-label={demo.gridLabel}>
            <span />
            {DAY_LIST.map((d) => (
              <span key={d} className={styles.dayHead}>
                {d}
              </span>
            ))}
            {INVARIANT_IDS.map((id) => (
              <Row key={id} id={id} results={results[id]} onActive={setActive} />
            ))}
          </div>
        </div>
        <p className={styles.detail} aria-live="polite">
          {active && activeResult ? (
            <>
              {demo.checks[active.id]}, day {active.day}: {activeResult.status}. Value {activeResult.valueText}, threshold{" "}
              {activeResult.thresholdText}. {activeResult.explanation}
            </>
          ) : (
            <span className={styles.muted}>{demo.hint}</span>
          )}
        </p>
      </section>

      <section className={styles.block} aria-labelledby="chart-h">
        <h2 id="chart-h" className={styles.h2}>
          {demo.chartTitle}
        </h2>
        <StakeChart ledger={ledger} pipeline={pipeline} showAnnotation={flags.cancel_exploit} />
      </section>

      <section className={styles.block} aria-labelledby="recon-h">
        <h2 id="recon-h" className={styles.h2}>
          {demo.reconTitle}
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
                  <td className={styles.mono}>{formatMoney(r.ledger)}</td>
                  <td className={styles.mono}>{formatMoney(r.pipeline)}</td>
                  <td className={styles.mono}>
                    {formatMoney(r.gap)} ({r.gapPct.toFixed(1)}%)
                  </td>
                  <td>{r.explainedBy.length ? r.explainedBy.map((k) => demo.toggles[k]).join(", ") : "none"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${styles.mono} ${styles.muted}`}>Unexplained: {unexplained.toFixed(1)}%</p>
      </section>

      <section className={styles.callout} aria-labelledby="callout-h">
        <h2 id="callout-h" className={styles.h3}>
          {demo.calloutTitle}
        </h2>
        <p>{demo.callout1}</p>
        <p>{demo.callout2}</p>
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
      <span className={styles.rowHead}>{demo.checks[id]}</span>
      {results.map((r) => (
        <button
          key={r.day}
          type="button"
          className={`${styles.cell} ${r.status === "alert" ? styles.alert : styles.ok}`}
          aria-label={`Day ${r.day}, ${demo.checks[id]}, ${r.status}, value ${r.valueText}`}
          onMouseEnter={() => onActive({ id, day: r.day })}
          onFocus={() => onActive({ id, day: r.day })}
        />
      ))}
    </>
  );
}
