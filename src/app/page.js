import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroBanner from "@/components/HeroBanner";
import HeroTrendingRecipes from "@/components/HeroTrendingRecipes";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@heroui/react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturesSection />
      <ProcessSection />
      <HeroTrendingRecipes />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
