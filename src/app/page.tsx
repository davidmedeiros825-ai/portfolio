import Link from "next/link";
import styles from "./page.module.css";

const cases = [
  {
    n: "01",
    href: "/cases/data-trust-monitor",
    title: "Data Trust Monitor",
    desc: "Reconciling a transaction pipeline with the official ledger and catching fraud with daily invariants.",
  },
  {
    n: "02",
    title: "Segmentation & Holdout Lab",
    desc: "Behavioral segmentation with circuit breakers, and campaign lift measured against a control group.",
  },
  {
    n: "03",
    title: "BI Agent with Evals",
    desc: "A natural-language BI agent where every number in the answer is validated against the database.",
  },
];

export default function Home() {
  return (
    <main className="wrap">
      <div className={styles.page}>
        <header className={styles.header}>
          <span className="eyebrow">Data · CRM · AI systems</span>
          <h1 className={styles.title}>David Medeiros</h1>
          <p className={`muted ${styles.lede}`}>
            I design data and AI systems for business, direct AI agents to build them, and verify
            every output against the source of truth.
          </p>
          <div className={styles.links}>
            <a
              href="https://www.linkedin.com/in/david-medeiros-693453253/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/davidmedeiros825-ai/portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </header>

        <section className={styles.section}>
          <span className="eyebrow">Case studies</span>
          <ol className={styles.cards}>
            {cases.map((c) => (
              <li key={c.n} className={styles.card}>
                <span className="mono muted">{c.n}</span>
                <h2 className={styles.cardTitle}>
                  {c.href ? (
                    <Link href={c.href} className={styles.cardLink}>
                      {c.title}
                    </Link>
                  ) : (
                    c.title
                  )}
                </h2>
                <p className={`muted ${styles.desc}`}>{c.desc}</p>
                <span className={styles.pill}>{c.href ? "Live demo" : "In progress"}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <span className="eyebrow">Background</span>
          <div className={styles.lines}>
            <p>Former Head of Data &amp; Strategy for two licensed online gaming operators (1M+ events/day).</p>
            <p>Product &amp; Platform Lead at Pontto AI, building with a multi-agent engineering workflow.</p>
          </div>
        </section>

        <footer className={`muted ${styles.footer}`}>
          <p>All demos run on synthetic data generated for this site. The original systems were proprietary.</p>
        </footer>
      </div>
    </main>
  );
}
