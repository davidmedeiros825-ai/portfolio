import type { Metadata } from "next";
import Link from "next/link";
import { demo } from "@/content/demo";
import styles from "./page.module.css";
import { TrustMonitor } from "./TrustMonitor";

export const metadata: Metadata = { title: `${demo.title} · David Medeiros` };

export default function DataTrustMonitorPage() {
  return (
    <div className="wrap">
      <main className={styles.page}>
        <header className={styles.head}>
          <Link className="back" href="/cases/cancelled-bets">{demo.back}</Link>
          <h1 className={styles.title}>{demo.title}</h1>
          <p className={styles.intro}>{demo.lede}</p>
        </header>

        <TrustMonitor />

        <section className={styles.block} aria-labelledby="writeup">
          <h2 id="writeup" className={styles.h2}>{demo.writeupTitle}</h2>
          <ul className={styles.writeup}>
            {demo.writeup.map(([label, text]) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.footer}>
          <p>{demo.footer}</p>
        </footer>
      </main>
    </div>
  );
}
