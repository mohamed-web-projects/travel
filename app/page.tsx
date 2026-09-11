import { Hero } from "@/components/home/Hero";
import { ToursSection } from "@/components/home/ToursSection";
import { Discover } from "@/components/home/Discover";
import { BudgetCalculator } from "@/components/home/BudgetCalculator";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { ContactSection } from "@/components/home/ContactSection";
import { HomeGallery } from "@/components/home/HomeGallery";
import { ScrollToHash } from "@/components/home/ScrollToHash";

export default function HomePage() {
  return (
    <>
      <ScrollToHash />
      <Hero />
      <ToursSection />
      <Discover />
      <HomeGallery />
      <BudgetCalculator />
      <Testimonials />
      <FAQAccordion />
      <ContactSection />
    </>
  );
}