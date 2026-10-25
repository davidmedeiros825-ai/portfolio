import type { Dict } from "@/content/en";

export function Contact({ t }: { t: Dict }) {
  const c = t.contact;
  return (
    <div id="contact" className="contact">
      <h2>{c.title}</h2>
      <dl>
        <dt>{c.email}</dt>
        <dd><a href={`mailto:${c.emailValue}`}>{c.emailValue}</a></dd>
        <dt>{c.linkedin}</dt>
        <dd>
          <a href="https://www.linkedin.com/in/david-medeiros-693453253/" target="_blank" rel="noopener noreferrer">
            {c.linkedinValue}
          </a>
        </dd>
        <dt>{c.github}</dt>
        <dd>
          <a href="https://github.com/davidmedeiros825-ai" target="_blank" rel="noopener noreferrer">
            {c.githubValue}
          </a>
        </dd>
      </dl>
    </div>
  );
}
