import Link from "next/link";
import type { Dict } from "@/content/en";

const X = [60, 353, 646, 940];

export function CoffeeCase({ t }: { t: Dict }) {
  const c = t.coffee;
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

      <div className="flow" aria-label={c.chain.aria}>
        <div className="flow-head">
          <p className="label">{c.chain.head}</p>
          <p className="label" style={{ color: "var(--blue)" }}>{c.chain.tag}</p>
        </div>
        <svg viewBox="0 0 1000 170" role="img" aria-label={c.chain.svgLabel}>
          <path d="M60 60 H940" stroke="var(--blue)" strokeWidth={6} fill="none" />
          {c.chain.stages.map((s, i) => {
            const last = i === 3;
            const first = i === 0;
            const tx = last ? 932 : first ? 68 : X[i];
            const anchor = last ? "end" : first ? "start" : "middle";
            return (
              <g key={s.name}>
                {last ? (
                  <circle cx={X[i]} cy={60} r={14} fill="var(--leak)" />
                ) : (
                  <circle cx={X[i]} cy={60} r={14} fill="var(--blue)" />
                )}
                <text className="st" x={tx} y={104} textAnchor={anchor}>{s.name}</text>
                <text className="sub" x={tx} y={124} textAnchor={anchor}>{s.sub}</text>
              </g>
            );
          })}
          <rect x={40} y={146} width={920} height={22} fill="var(--blue-soft)" />
          <text className="base" x={500} y={162} textAnchor="middle" style={{ fill: "var(--blue)" }}>{c.chain.base}</text>
        </svg>
        <ol className="flow-list" aria-hidden="true">
          {c.chain.stages.map((s) => (
            <li key={s.name} className="on">
              <b>{s.name}</b>
              <span>{s.sub}</span>
            </li>
          ))}
          <li className="flow-base">{c.chain.base}</li>
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
        <Link className="btn primary" href={t.paths.case}>{c.next.button}</Link>
      </div>
    </>
  );
}
