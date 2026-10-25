import type { Metadata } from "next";
import { pt } from "@/content/pt";
import { Home } from "@/components/Home";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: pt.meta.title, description: pt.meta.description };

export default function HomePt() {
  return (
    <SiteShell t={pt} otherHref={pt.paths.other.home}>
      <Home t={pt} />
    </SiteShell>
  );
}
