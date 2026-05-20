import SkinHero from "@/components/skinHero";
import HowItWorksSection from "@/components/howItWorksSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-zinc-50">
      <SkinHero />
      <HowItWorksSection />
    </main>
  );
}
