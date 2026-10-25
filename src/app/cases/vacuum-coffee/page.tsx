import type { Metadata } from "next";
import { en } from "@/content/en";
import { CoffeeCase } from "@/components/CoffeeCase";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: en.meta.coffeeTitle, description: en.meta.description };

export default function CoffeeEn() {
  return (
    <SiteShell t={en} otherHref={en.paths.other.coffee}>
      <CoffeeCase t={en} />
    </SiteShell>
  );
}
