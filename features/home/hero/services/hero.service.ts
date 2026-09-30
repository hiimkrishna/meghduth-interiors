import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { HeroSlide } from "@/packages/contracts/src/hero.schema";

// হিরো স্লাইড — সরাসরি API থেকে, Envelope lib/api খোলে।
export async function getHeroSlides(): Promise<HeroSlide[]> {
  return cached("hero-slides", () => api.get<HeroSlide[]>("/hero-slides"));
}
