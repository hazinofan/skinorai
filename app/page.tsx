import HowItWorks from "@/components/HowItWorks";
import ProductScanningSection from "@/components/ProductScanningSection";
import ProductLibrarySection from "@/components/ProductLibrarySection"; 
import { SkinorAITestimonialsSection } from "@/components/Testimonials";
import SkinHero from "@/components/skinHero";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-zinc-50">
      <SkinHero />
      <HowItWorks />
      <ProductScanningSection />
      <ProductLibrarySection />
      <SkinorAITestimonialsSection />
    </main>
  );
}
