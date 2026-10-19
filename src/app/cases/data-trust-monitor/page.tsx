import styles from "./page.module.css";
import { TrustMonitor } from "./TrustMonitor";

const writeup = [
  ["Problem", "Two sources disagreed on the same number, and the pipeline also carried a fraud that inflated volume."],
  ["Architecture", "Synthetic generator, pipeline with injectable faults, ledger, invariants, grid."],
  [
    "Decisions",
    "Anchored baseline over moving average; reconciliation and invariants as separate controls (reconciliation validates transport, invariants validate internal consistency); materiality thresholds to keep alerts near 1 per day.",
  ],
  ["Verification", "Unit tests prove each invariant fires on its planted fault and stays silent on clean data."],
  [
    "Original system",
    "BigQuery + Python + Postgres functions, daily schedule. This demo reproduces the logic, not the code.",
  ],
];

export default function DataTrustMonitorPage() {
  return (
    <main className="wrap">
      <div className="page">
        <header className="header">
          <span className="eyebrow">Case 01</span>
          <h1 className="title">Data Trust Monitor</h1>
          <p className="muted lede">
            Reconciling a transaction pipeline with the official ledger, and catching what reconciliation alone
            misses.
          </p>
        </header>

        <TrustMonitor />

        <section className={styles.block} aria-labelledby="writeup">
          <h2 id="writeup" className={styles.h2}>
            Write-up
          </h2>
          <ul className={styles.writeup}>
            {writeup.map(([label, text]) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </ul>
        </section>

        <footer className="muted footer">
          <p>Synthetic data, fixed seed.</p>
        </footer>
      </div>
    </main>
  );
}
