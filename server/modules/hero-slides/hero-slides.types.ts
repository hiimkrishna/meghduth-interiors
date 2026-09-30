import type { HeroSlide } from "@/packages/contracts/src/hero.schema";

export type { HeroSlide };

export interface HeroSlidePage {
  items: HeroSlide[];
  total: number;
}
