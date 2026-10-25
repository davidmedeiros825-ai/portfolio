import type { Metadata } from "next";
import { en } from "@/content/en";
import { CasePage } from "@/components/CasePage";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: en.meta.caseTitle, description: en.meta.description };

export default function CaseEn() {
  return (
    <SiteShell t={en} otherHref={en.paths.other.case}>
      <CasePage t={en} />
    </SiteShell>
  );
}
