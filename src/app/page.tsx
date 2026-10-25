import { en } from "@/content/en";
import { Home } from "@/components/Home";
import { SiteShell } from "@/components/SiteShell";

export default function HomeEn() {
  return (
    <SiteShell t={en} otherHref={en.paths.other.home}>
      <Home t={en} />
    </SiteShell>
  );
}
