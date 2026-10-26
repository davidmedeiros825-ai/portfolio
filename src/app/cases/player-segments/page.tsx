import type { Metadata } from "next";
import { en } from "@/content/en";
import { SegmentsCase } from "@/components/SegmentsCase";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: en.meta.segmentsTitle, description: en.meta.description };

export default function SegmentsEn() {
  return (
    <SiteShell t={en} otherHref={en.paths.other.segments}>
      <SegmentsCase t={en} />
    </SiteShell>
  );
}
