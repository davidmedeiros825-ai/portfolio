import type { Metadata } from "next";
import { pt } from "@/content/pt";
import { SegmentsCase } from "@/components/SegmentsCase";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: pt.meta.segmentsTitle, description: pt.meta.description };

export default function SegmentsPt() {
  return (
    <SiteShell t={pt} otherHref={pt.paths.other.segments}>
      <SegmentsCase t={pt} />
    </SiteShell>
  );
}
