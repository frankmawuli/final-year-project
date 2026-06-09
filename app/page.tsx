import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";
import { StatsBanner } from "@/components/landing/StatsBanner";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <WhyChooseSection />
      <StatsBanner />
      <CtaSection />
      <Footer />
    </div>
  );
}
