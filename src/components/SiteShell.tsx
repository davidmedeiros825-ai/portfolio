import type { Dict } from "@/content/en";
import { Nav } from "./Nav";
import { Contact } from "./Contact";

export function SiteShell({
  t,
  otherHref,
  children,
}: {
  t: Dict;
  otherHref: string;
  children: React.ReactNode;
}) {
  return (
    <div lang={t.htmlLang}>
      <div className="wrap">
        <Nav t={t} otherHref={otherHref} />
        <main>{children}</main>
        <Contact t={t} />
        <footer>{t.footer}</footer>
      </div>
    </div>
  );
}
