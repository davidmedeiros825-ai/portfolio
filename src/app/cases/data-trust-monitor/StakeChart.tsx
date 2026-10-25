"use client";

import type { DayRecord } from "@/lib/trust/generate";
import { formatMoney } from "@/lib/format";
import { demo } from "@/content/demo";
import styles from "./page.module.css";

const W = 640;
const H = 300;
const L = 72;
const R = 16;
const T = 24;
const B = 36;

function niceMax(v: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / pow;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * pow;
}

export function StakeChart({
  ledger,
  pipeline,
  showAnnotation,
}: {
  ledger: DayRecord[];
  pipeline: DayRecord[];
  showAnnotation: boolean;
}) {
  const led = ledger.map((r) => r.providers.crash_c.stake);
  const pipe = pipeline.map((r) => r.providers.crash_c.stake);
  const max = niceMax(Math.max(...led, ...pipe));
  const x = (day: number) => L + ((day - 1) / 29) * (W - L - R);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const xTicks = [1, 5, 10, 15, 20, 25, 30];

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img" aria-label={demo.chartAria}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted)" className={styles.mono}>
              {formatMoney(v)}
            </text>
          </g>
        ))}
        {xTicks.map((d) => (
          <text key={d} x={x(d)} y={H - B + 18} textAnchor="middle" fontSize={11} fill="var(--muted)" className={styles.mono}>
            {d}
          </text>
        ))}
        <text x={(L + W - R) / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="var(--muted)">
          Day
        </text>
        {showAnnotation && (
          <g>
            <line x1={x(12)} x2={x(12)} y1={T} y2={H - B} stroke="var(--leak)" strokeWidth={1} strokeDasharray="2 3" />
            <text x={x(12) - 6} y={T + 10} textAnchor="end" fontSize={11} fill="var(--leak)">
              Cancelled bets start counting
            </text>
          </g>
        )}
        <path d={path(led)} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="5 4" />
        <path d={path(pipe)} fill="none" stroke="var(--blue)" strokeWidth={2} />
      </svg>
      <figcaption className={styles.chartKey}>
        <span className={styles.keyItem}>
          <svg width="24" height="8" aria-hidden="true">
            <line x1="0" x2="24" y1="4" y2="4" stroke="var(--blue)" strokeWidth="2" />
          </svg>
          Pipeline
        </span>
        <span className={styles.keyItem}>
          <svg width="24" height="8" aria-hidden="true">
            <line x1="0" x2="24" y1="4" y2="4" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="5 4" />
          </svg>
          Ledger
        </span>
      </figcaption>
    </figure>
  );
}
