import type { Metadata } from "next";
import { pt } from "@/content/pt";
import { CoffeeCase } from "@/components/CoffeeCase";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = { title: pt.meta.coffeeTitle, description: pt.meta.description };

export default function CoffeePt() {
  return (
    <SiteShell t={pt} otherHref={pt.paths.other.coffee}>
      <CoffeeCase t={pt} />
    </SiteShell>
  );
}
