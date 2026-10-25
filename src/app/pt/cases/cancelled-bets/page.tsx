import type { Metadata } from "next";
import { pt } from "@/content/pt";
import { CasePage } from "@/components/CasePage";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: pt.meta.caseTitle, description: pt.meta.description };

export default function CasePt() {
  return (
    <SiteShell t={pt} otherHref={pt.paths.other.case}>
      <CasePage t={pt} />
    </SiteShell>
  );
}
