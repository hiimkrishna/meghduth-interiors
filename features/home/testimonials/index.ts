export { default as Testimonials } from "./components/Testimonials";
export { default as Carousel } from "./components/Carousel";
export { default as CarouselCard } from "./components/CarouselCard";
export { default as GlassCard } from "./components/GlassCard";
export { default as Indicators } from "./components/Indicators";
export { default as SectionHeader } from "./components/SectionHeader";
export { default as TestimonialCard } from "./components/TestimonialCard";
export {
  CARD_POSITIONS,
  CARD_TRANSITION,
  AUTOPLAY_TIME,
} from "./components/carouselConfig";
export {
  getPreviousIndex,
  getNextIndex,
  getVisibleTestimonials,
} from "./components/helpers";
export type { CardPosition, VisibleTestimonial } from "./components/helpers";
export { useTestimonials } from "./hooks/use-testimonials";
export type { UseTestimonialsResult } from "./hooks/use-testimonials";
export { getTestimonials } from "./services/testimonials.service";
