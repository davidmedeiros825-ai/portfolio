import Link from "next/link";
import type { Dict } from "@/content/en";

const X = [60, 353, 646, 940];
// Returned to real-money play within 7 days, treated vs control, by inactivity band (first holdout reading).
const BARS = [
  { treated: 10.4, control: 9.2 },
  { treated: 13.2, control: 6.7 },
  { treated: 6.7, control: 4.8 },
];
const Y0 = 200;
const SCALE = 12; // px per percentage point

export function SegmentsCase({ t }: { t: Dict }) {
  const c = t.segments;
  const ch = c.s4.chart;
  const pct = (n: number) => `${t.htmlLang === "en" ? n.toFixed(1) : n.toFixed(1).replace(".", ",")}%`;
  return (
    <>
      <Link className="back" href={`${t.paths.home}#work`}>{c.back}</Link>
      <header className="c-hero">
        <p className="label">{c.label}</p>
        <h1>{c.title}</h1>
        <dl className="facts">
          {c.facts.map((f) => (
            <div key={f.dt}><dt>{f.dt}</dt><dd>{f.dd}</dd></div>
          ))}
        </dl>
      </header>

      <div className="flow" aria-label={c.flow.aria}>
        <div className="flow-head">
          <p className="label">{c.flow.head}</p>
          <p className="label" style={{ color: "var(--blue)" }}>{c.flow.tag}</p>
        </div>
        <svg viewBox="0 0 1000 140" role="img" aria-label={c.flow.tag}>
          <path d="M60 60 H940" stroke="var(--line)" strokeWidth={6} fill="none" />
          <path d="M646 60 H940" stroke="var(--blue)" strokeWidth={6} fill="none" />
          {t.flow.stages.map((s, i) => {
            const last = i === 3;
            const on = i >= 2;
            const tx = last ? 932 : X[i];
            const anchor = last ? "end" : "middle";
            return (
              <g key={s.name}>
                {on ? (
                  <circle cx={X[i]} cy={60} r={14} fill="var(--blue)" />
                ) : (
                  <circle cx={X[i]} cy={60} r={14} fill="var(--sheet)" stroke="var(--line)" strokeWidth={4} />
                )}
                <text className="st" x={tx} y={104} textAnchor={anchor}>{s.name}</text>
                <text className="sub" x={tx} y={124} textAnchor={anchor}>{s.sub}</text>
              </g>
            );
          })}
        </svg>
        <ol className="flow-list" aria-hidden="true">
          {t.flow.stages.map((s, i) => (
            <li key={s.name} className={i >= 2 ? "on" : undefined}>
              <b>{s.name}</b>
              <span>{s.sub}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="story">
        <div><span className="step">{c.s1.step}</span><h2>{c.s1.title}</h2></div>
        <div className="body">
          <p>{c.s1.p1}</p>
          <p className="formula">{c.s1.formula}</p>
          <p>{c.s1.p2}</p>
        </div>
      </div>

      <div className="story">
        <div><span className="step">{c.s2.step}</span><h2>{c.s2.title}</h2></div>
        <div className="body"><p>{c.s2.p1}</p></div>
      </div>

      <div className="story">
        <div><span className="step">{c.s3.step}</span><h2>{c.s3.title}</h2></div>
        <div className="body">
          <ul>
            {c.s3.items.map((it) => (
              <li key={it.bold}><b>{it.bold}</b>{it.text}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="story">
        <div><span className="step">{c.s4.step}</span><h2>{c.s4.title}</h2></div>
        <div className="body">
          <div className="chart wide">
            <svg viewBox="0 0 640 260" role="img" aria-label={ch.aria}>
              <line x1={20} y1={Y0} x2={620} y2={Y0} stroke="var(--muted)" />
              {BARS.map((b, i) => {
                const x = 60 + i * 200;
                const ht = b.treated * SCALE;
                const hc = b.control * SCALE;
                const strong = i === 1;
                return (
                  <g key={i}>
                    <rect x={x} y={Y0 - ht} width={52} height={ht} fill="var(--blue)" opacity={strong ? 1 : 0.45} />
                    <rect x={x + 60} y={Y0 - hc} width={52} height={hc} fill="var(--line)" />
                    <text x={x + 26} y={Y0 - ht - 8} textAnchor="middle" style={{ fontWeight: strong ? 700 : 400 }}>{pct(b.treated)}</text>
                    <text x={x + 86} y={Y0 - hc - 8} textAnchor="middle">{pct(b.control)}</text>
                    <text x={x + 56} y={Y0 + 22} textAnchor="middle" style={{ fill: "var(--muted)" }}>{ch.bands[i]}</text>
                  </g>
                );
              })}
              <rect x={20} y={240} width={12} height={10} fill="var(--blue)" />
              <text x={38} y={249}>{ch.treated}</text>
              <rect x={260} y={240} width={12} height={10} fill="var(--line)" />
              <text x={278} y={249}>{ch.control}</text>
            </svg>
          </div>
          <p className="cap">{c.s4.caption}</p>
          <div className="results">
            {c.s4.results.map((r) => (
              <div key={r.num}><span className="num">{r.num}</span><p>{r.text}</p></div>
            ))}
          </div>
          <p>{c.s4.closing}</p>
        </div>
      </div>

      <div className="story" style={{ borderBottom: 0 }}>
        <div><span className="step">{c.s5.step}</span><h2>{c.s5.title}</h2></div>
        <div className="body"><p>{c.s5.text}</p></div>
      </div>

      <div className="demo">
        <div><h3>{c.next.title}</h3><p>{c.next.text}</p></div>
        <Link className="btn primary" href={t.paths.coffee}>{c.next.button}</Link>
      </div>
    </>
  );
}
