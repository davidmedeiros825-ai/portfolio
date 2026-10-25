import Link from "next/link";
import type { Dict } from "@/content/en";

const POINTS_PIPE =
  "56,196 94,196 132,196 170,196 208,196 246,196 266,108 285,124 304,58 323,56 342,66 362,110 381,104 400,104 419,86 438,128 458,88 477,26 496,46 515,40 534,140 553,24 572,142 591,90 620,82";
const POINTS_OFFICE = "56,196 114,196 172,196 230,196 288,196 346,196 404,196 462,196 520,196 578,196 620,196";

export function CasePage({ t }: { t: Dict }) {
  const c = t.case;
  const ch = c.s2.chart;
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
        <svg viewBox="0 0 1000 80" role="img" aria-label={c.flow.svgLabel}>
          <path d="M60 24 H940" stroke="var(--line)" strokeWidth={6} fill="none" />
          {[60, 353, 646, 940].map((x) => (
            <circle key={x} cx={x} cy={24} r={10} fill="var(--sheet)" stroke="var(--line)" strokeWidth={4} />
          ))}
          <rect x={40} y={52} width={920} height={24} fill="var(--blue)" />
          <text x={500} y={69} textAnchor="middle" style={{ fill: "var(--on-blue)", font: "600 13px var(--body)" }}>
            {c.flow.base}
          </text>
        </svg>
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
        <div className="body">
          <p>{c.s2.p1}</p>
          <div className="chart">
            <svg viewBox="0 0 640 230" role="img" aria-label={ch.aria}>
              <line x1={56} y1={20} x2={620} y2={20} stroke="var(--line)" />
              <line x1={56} y1={80} x2={620} y2={80} stroke="var(--line)" />
              <line x1={56} y1={140} x2={620} y2={140} stroke="var(--line)" />
              <line x1={56} y1={200} x2={620} y2={200} stroke="var(--muted)" />
              {[24, 84, 144, 204].map((y, i) => (
                <text key={y} x={48} y={y} textAnchor="end">{ch.yLabels[i]}</text>
              ))}
              <text x={56} y={222}>{ch.day1}</text>
              <text x={326} y={222} textAnchor="middle">{ch.day15}</text>
              <text x={620} y={222} textAnchor="end">{ch.day30}</text>
              <polyline fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray="5 4" points={POINTS_OFFICE} />
              <polyline fill="none" stroke="var(--blue)" strokeWidth={3} points={POINTS_PIPE} />
              <line x1={266} y1={20} x2={266} y2={200} stroke="var(--leak)" strokeDasharray="3 3" />
              <text x={272} y={36} style={{ fill: "var(--leak)" }}>{ch.marker}</text>
              <rect x={420} y={160} width={12} height={3} fill="var(--blue)" />
              <text x={438} y={165}>{ch.pipeline}</text>
              <rect x={420} y={178} width={12} height={3} fill="var(--muted)" />
              <text x={438} y={183}>{ch.office}</text>
            </svg>
          </div>
          <p className="cap">{c.s2.caption}</p>
        </div>
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
        <div><h3>{c.demo.title}</h3><p>{c.demo.text}</p></div>
        <Link className="btn primary" href="/cases/data-trust-monitor">{c.demo.button}</Link>
      </div>
    </>
  );
}
