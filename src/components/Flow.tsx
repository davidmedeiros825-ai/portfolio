import type { Dict } from "@/content/en";

const X = [60, 353, 646, 940];

export function Flow({ t }: { t: Dict }) {
  const f = t.flow;
  return (
    <div className="flow" aria-label={f.aria}>
      <div className="flow-head">
        <p className="label">{f.head}</p>
        <p className="label" style={{ color: "var(--blue)" }}>{f.legend}</p>
      </div>
      <svg viewBox="0 0 1000 170" role="img" aria-label={f.svgLabel}>
        <path d="M60 60 H940" stroke="var(--line)" strokeWidth={6} fill="none" />
        <path d="M500 60 H940" stroke="var(--blue)" strokeWidth={6} fill="none" />
        <circle className="coin" r={7} fill="var(--blue)" style={{ offsetPath: "path('M60 60 H940')" }} />
        {f.stages.map((s, i) => {
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
        <rect x={40} y={146} width={920} height={22} fill="var(--blue-soft)" />
        <text className="base" x={500} y={162} textAnchor="middle" style={{ fill: "var(--blue)" }}>{f.base}</text>
      </svg>
      <ol className="flow-list" aria-hidden="true">
        {f.stages.map((s, i) => (
          <li key={s.name} className={i >= 2 ? "on" : undefined}>
            <b>{s.name}</b>
            <span>{s.sub}</span>
          </li>
        ))}
        <li className="flow-base">{f.base}</li>
      </ol>
    </div>
  );
}
