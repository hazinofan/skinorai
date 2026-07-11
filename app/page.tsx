import SkinHero from "@/components/skinHero";
import HowItWorks from "@/components/HowItWorks";
import ProductScanningSection from "@/components/ProductScanningSection";
import ProductLibrarySection from "@/components/ProductLibrarySection";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-zinc-50">
      <SkinHero />
      <HowItWorks />
      <ProductScanningSection />
      <ProductLibrarySection />
    </main>
  );
}
