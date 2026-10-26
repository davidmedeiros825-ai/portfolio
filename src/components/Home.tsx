import Link from "next/link";
import type { Dict } from "@/content/en";
import { Flow } from "./Flow";
import { Portrait } from "./Portrait";

export function Home({ t }: { t: Dict }) {
  const h = t.hero;
  return (
    <>
      <header className="hero">
        <div>
          <p className="label">{h.label}</p>
          <h1 style={{ marginTop: 18 }}>
            {h.titleBefore}<span className="mark">{h.titleMark}</span>{h.titleAfter}
          </h1>
          <p className="lede">
            {h.ledeBefore}<b>{h.ledeBold}</b>{h.ledeAfter}
          </p>
          <div className="cta">
            <a className="btn primary" href="#work">{h.seeCases}</a>
            <a className="btn" href="/david-medeiros-resume.pdf">{h.resume}</a>
            <a className="btn" href="#contact">{h.contact}</a>
          </div>
        </div>
        <Portrait label={h.portraitLabel} />
      </header>

      <Flow t={t} />

      <div className="numbers">
        {t.numbers.map((n) => (
          <div key={n.num}><span className="num">{n.num}</span><p>{n.text}</p></div>
        ))}
      </div>

      <section id="work">
        <div className="sec-head"><h2>{t.work.head}</h2><p className="label">{t.work.sub}</p></div>
        <div className="cases">
          {t.work.items.map((c) => {
            const href = c.link ? t.paths[c.link as "case" | "coffee" | "segments"] : null;
            const inner = (
              <>
                <div className="meta"><b>{c.org}</b><span>{c.role}</span><span>{c.period}</span></div>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  {href && <span className="go">{t.work.readCase}</span>}
                </div>
                <div className="where">
                  {c.chips.map((ch) => (
                    <span key={ch.label} className={ch.on ? "chip on" : "chip"}>{ch.label}</span>
                  ))}
                </div>
              </>
            );
            return href ? (
              <Link key={c.title} className="case" href={href}>{inner}</Link>
            ) : (
              <div key={c.title} className="case">{inner}</div>
            );
          })}
        </div>
      </section>

      <section id="ai">
        <div className="sec-head"><h2>{t.ai.head}</h2><p className="label">{t.ai.sub}</p></div>
        <p className="ai-intro">{t.ai.intro}</p>
        <div className="build ai">
          {t.ai.cards.map((c) => (
            <article key={c.title}>
              <p className="label">{c.label}</p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <div className="offline">{c.chips.map((x) => <span key={x} className="chip">{x}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="sec-head"><h2>{t.method.head}</h2></div>
        <ol className="method">
          {t.method.steps.map((s, i) => (
            <li key={s.title}><span className="n">{i + 1}</span><b>{s.title}</b><p>{s.text}</p></li>
          ))}
        </ol>
      </section>

      <section id="about">
        <div className="sec-head"><h2>{t.about.head}</h2></div>
        <div className="about">
          <div>
            <p className="lede">{t.about.lede}</p>
            <p style={{ marginTop: 16 }}>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
          <div>
            <p className="label">{t.about.offLabel}</p>
            <p style={{ marginTop: 12 }}>{t.about.off1}</p>
            <p style={{ marginTop: 12 }}>{t.about.off2Before}<b>{t.about.off2Handle}</b>{t.about.off2After}</p>
            <div className="offline">{t.about.chips.map((x) => <span key={x} className="chip">{x}</span>)}</div>
          </div>
        </div>
      </section>
    </>
  );
}
