import Link from "next/link";
import type { Dict } from "@/content/en";

export function Nav({ t, otherHref }: { t: Dict; otherHref: string }) {
  const home = t.paths.home;
  return (
    <nav className="nav" aria-label={t.nav.aria}>
      <Link className="brand" href={home}>
        {t.nav.brand}
      </Link>
      <ul>
        <li><Link href={`${home}#work`}>{t.nav.work}</Link></li>
        <li><Link href={`${home}#ai`}>{t.nav.ai}</Link></li>
        <li><Link href={`${home}#about`}>{t.nav.about}</Link></li>
        <li><Link href={`${home}#contact`}>{t.nav.contact}</Link></li>
        <li><Link href={otherHref} aria-label={t.nav.langAria}>{t.nav.langLabel}</Link></li>
      </ul>
    </nav>
  );
}
