import FeaturesSection from "@/components/FeaturesSection";
import HeroBanner from "@/components/HeroBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@heroui/react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturesSection/>
      <TestimonialsSection/>
    </div>
  );
}
