"use client";

import Image from "next/image";
import { useRef, type ElementType } from "react";
import {
  Check,
  Droplets,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";

const ingredients = [
  {
    name: "Niacinamide",
    detail: "Barrier support",
    icon: ShieldCheck,
  },
  {
    name: "Hyaluronic Acid",
    detail: "Deep hydration",
    icon: Droplets,
  },
  {
    name: "Panthenol",
    detail: "Soothing",
    icon: Sparkles,
  },
];

export default function ProductScanningSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 34,
    mass: 0.25,
  });

  /*
   * Animation timeline:
   * 0.00 → 0.20: section content enters
   * 0.20 → 0.58: scanner travels across product
   * 0.45 → 0.72: ingredient cards appear
   * 0.68 → 1.00: analysis panel appears
   */

  const contentOpacity = useTransform(
    smoothProgress,
    [0, 0.12, 0.85, 1],
    [0, 1, 1, 0.75],
  );

  const contentY = useTransform(smoothProgress, [0, 0.15], [60, 0]);

  const productScale = useTransform(
    smoothProgress,
    [0, 0.2, 0.7],
    [0.82, 1, 0.94],
  );

  const productX = useTransform(smoothProgress, [0.58, 0.82], ["0%", "-18%"]);

  const scannerTop = useTransform(smoothProgress, [0.2, 0.58], ["8%", "88%"]);

  const scannerOpacity = useTransform(
    smoothProgress,
    [0.13, 0.2, 0.58, 0.64],
    [0, 1, 1, 0],
  );

  const scannerGlowOpacity = useTransform(
    smoothProgress,
    [0.18, 0.3, 0.55, 0.65],
    [0, 0.75, 0.55, 0],
  );

  const analysisOpacity = useTransform(smoothProgress, [0.62, 0.78], [0, 1]);

  const analysisX = useTransform(smoothProgress, [0.62, 0.82], [80, 0]);
  const router = useRouter();

  const score = useTransform(smoothProgress, [0.63, 0.84], [0, 92]);
  const roundedScore = useTransform(score, (value) => Math.round(value).toString());

  const progressScaleX = useTransform(smoothProgress, [0.2, 0.58], [0, 1]);

  return (
    <section ref={sectionRef} className="relative min-h-[175vh] bg-gray-50">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden px-5 py-20 sm:px-8 lg:px-12">
        {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10rem] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[#f3d9ff]/45 blur-[80px]" />
          <div className="absolute bottom-[-10rem] right-[-7rem] h-[26rem] w-[26rem] rounded-full bg-[#ddd6ff]/50 blur-[90px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(100,73,111,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(100,73,111,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

          <motion.div
            style={{ opacity: scannerGlowOpacity }}
            className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c979f1]/20 blur-[70px]"
          />
        </div> */}

        <motion.div
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
          className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="relative z-20 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8d8ef] bg-white/70 px-4 py-2 text-sm font-medium text-[#7f4b91] shadow-sm backdrop-blur-xl">
              <ScanLine className="h-4 w-4" />
              Intelligent ingredient scanner
            </div>

            <h2 className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#251c2a] sm:text-5xl lg:text-6xl">
              Scan the label.
              <span className="block bg-gradient-to-r from-[#8d4ea0] via-[#bc72cf] to-[#6e59c9] bg-clip-text text-transparent">
                Understand the formula.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#6f6374] sm:text-lg">
              Upload a skincare label and let SkinorAI identify the
              ingredients, explain their benefits and reveal what your skin
              should watch out for.
            </p>

            <button
              type="button"
              onClick={() => { router.push("/scan"); }}
              className="mt-9 cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-[#2c2430] px-6 py-3.5 text-sm font-medium text-white shadow-[0_18px_45px_rgba(44,36,48,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b2f40]"
            >
              <ScanLine className="h-4 w-4" />
              Scan a product
            </button>
          </div>

          <div className="relative mx-auto flex min-h-[580px] w-full max-w-[680px] items-center justify-center">
            {/* <motion.div
              style={{ scale: productScale }}
              className="pointer-events-none absolute h-[510px] w-[510px] rounded-full border border-[#d9c8df]/55"
            /> */}

            {/* <motion.div
              style={{ scale: productScale }}
              className="pointer-events-none absolute h-[420px] w-[420px] rounded-full border border-dashed border-[#d6c4dc]/80"
            /> */}

            {/* <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute h-[470px] w-[470px] rounded-full border border-transparent"
            >
              <span className="absolute left-[9%] top-[13%] h-2.5 w-2.5 rounded-full bg-[#a866bb] shadow-[0_0_20px_rgba(168,102,187,0.8)]" />
              <span className="absolute bottom-[12%] right-[11%] h-2 w-2 rounded-full bg-[#7f6ad6] shadow-[0_0_18px_rgba(127,106,214,0.7)]" />
            </motion.div> */}

            <motion.div
              style={{
                scale: productScale,
                x: productX,
              }}
              className="relative z-20 h-[470px] w-[290px] overflow-hidden rounded-[2.75rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,241,251,0.88)_100%)] p-[14px] shadow-[0_28px_70px_rgba(82,51,92,0.16)] backdrop-blur-md sm:h-[510px] sm:w-[320px]"
            >
              <div className="relative h-full overflow-hidden rounded-[2.15rem] border border-white/75 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98)_0%,_rgba(245,235,249,0.92)_48%,_rgba(235,220,242,0.95)_100%)]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(146,115,160,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(146,115,160,0.06)_1px,transparent_1px)] bg-[size:26px_26px] opacity-70" />
                <div className="pointer-events-none absolute left-1/2 top-[12%] h-28 w-28 -translate-x-1/2 rounded-full bg-white/60 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-[18%] bottom-8 h-16 rounded-full bg-[#b89bc9]/20 blur-xl" />

                <div className="absolute inset-0 z-10">
                  <div className="relative h-full w-full">
                    <Image
                      src="/productScan.png"
                      alt="Skincare product being scanned"
                      fill
                      sizes="(min-width: 640px) 320px, 290px"
                      className="object-cover object-center drop-shadow-[0_28px_40px_rgba(64,47,74,0.18)]"
                    />
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#3c2d46]/05" />

                <motion.div
                  style={{
                    top: scannerTop,
                    opacity: scannerOpacity,
                  }}
                  className="pointer-events-none absolute left-3 right-3 z-30"
                >
                  <div className="absolute left-0 right-0 top-1/2 h-24 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#d07cff]/20 to-transparent blur-xl" />
                  <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_2px_rgba(255,255,255,0.95),0_0_24px_8px_rgba(200,103,241,0.85)]" />
                  <div className="absolute left-2 top-[-4px] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_15px_4px_rgba(222,149,255,0.9)]" />
                  <div className="absolute right-2 top-[-4px] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_15px_4px_rgba(222,149,255,0.9)]" />
                </motion.div>

                <div className="pointer-events-none absolute inset-5 z-20">
                  <span className="absolute left-0 top-0 h-9 w-9 rounded-tl-xl border-l-2 border-t-2 border-[#58465e]/55" />
                  <span className="absolute right-0 top-0 h-9 w-9 rounded-tr-xl border-r-2 border-t-2 border-[#58465e]/55" />
                  <span className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-xl border-b-2 border-l-2 border-[#58465e]/55" />
                  <span className="absolute bottom-0 right-0 h-9 w-9 rounded-br-xl border-b-2 border-r-2 border-[#58465e]/55" />
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-30 rounded-[1.35rem] border border-white/75 bg-white/82 p-3.5 shadow-[0_12px_26px_rgba(67,49,76,0.12)] backdrop-blur-md">
                  <div className="mb-2.5 flex items-center justify-between text-[11px] font-medium text-[#4e3c56]">
                    <span className="flex items-center gap-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3e6f6] text-[#865097]">
                        <ScanLine className="h-3.5 w-3.5" />
                      </span>
                      Reading formula
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#eadfeb]">
                    <motion.div
                      style={{ scaleX: progressScaleX }}
                      className="h-full origin-left rounded-full bg-gradient-to-r from-[#d991f2] via-[#f2c9ff] to-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-30 hidden sm:block">
              {ingredients.map((ingredient, index) => {
                const Icon = ingredient.icon;
                const revealStart = 0.39 + index * 0.07;
                const revealEnd = revealStart + 0.11;

                return (
                  <IngredientCard
                    key={ingredient.name}
                    icon={Icon}
                    name={ingredient.name}
                    detail={ingredient.detail}
                    progress={smoothProgress}
                    inputRange={[revealStart, revealEnd]}
                    align={index === 1 ? "right" : "left"}
                    className={
                      index === 0
                        ? "-left-14 top-[48%] lg:-left-20"
                        : index === 1
                          ? "right-0 top-[34%]"
                          : "bottom-[13%] -left-14 lg:-left-20"
                    }
                  />
                );
              })}
            </div>

            <motion.div
              style={{
                opacity: analysisOpacity,
                x: analysisX,
              }}
              className="absolute right-0 top-1/2 z-40 hidden w-[272px] -translate-y-1/2 rounded-[2.15rem] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,242,251,0.9)_100%)] p-5 shadow-[0_24px_62px_rgba(73,45,82,0.18)] backdrop-blur-md lg:block"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#aa9bb0]">
                    Skin compatibility
                  </p>

                  <p className="mt-2 text-[3rem] font-semibold leading-none tracking-[-0.06em] text-[#322637]">
                    <motion.span>{roundedScore}</motion.span>
                    <span className="ml-1 text-xl text-[#8b7a91]">%</span>
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[#f2e5f6] text-[#7a4e89] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 rounded-[1.4rem] border border-[#eee4ef] bg-white/88 p-3.5 shadow-[0_10px_24px_rgba(77,55,87,0.05)]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8e0] text-[#6a8730]">
                    <Droplets className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#342a38]">Hyaluronic Acid</p>
                    <p className="mt-1 text-xs leading-5 text-[#87798d]">Deep hydration</p>
                  </div>
                </div>
              </div>

              <div className="my-5 h-px bg-[#e9dfea]" />

              <div className="space-y-3">
                <ResultRow icon={ShieldCheck} text="Barrier-friendly formula" positive />
                <ResultRow icon={Droplets} text="Strong hydration support" positive />
                <ResultRow icon={TriangleAlert} text="Fragrance detected" />
              </div>

              <div className="mt-5 rounded-[1.35rem] border border-[#eee4ef] bg-white/72 p-3.5">
                <p className="text-xs font-medium text-[#786a7d]">Recommended for</p>
                <p className="mt-1 text-sm font-semibold text-[#3b303f]">Normal to dry skin</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0, 0.12, 0.85], [1, 1, 0]),
          }}
          className="absolute bottom-7 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b8f] md:flex"
        >
          <span>Scroll to scan</span>

          <div className="relative h-10 w-px overflow-hidden bg-[#ded1e2]">
            <motion.div
              animate={{ y: [-20, 40] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 top-0 h-5 w-px bg-[#7b4c8b]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type IngredientCardProps = {
  icon: ElementType;
  name: string;
  detail: string;
  progress: ReturnType<typeof useSpring>;
  inputRange: [number, number];
  align?: "left" | "right";
  className?: string;
};

function IngredientCard({
  icon: Icon,
  name,
  detail,
  progress,
  inputRange,
  align = "left",
  className = "",
}: IngredientCardProps) {
  const opacity = useTransform(progress, inputRange, [0, 1]);
  const scale = useTransform(progress, inputRange, [0.75, 1]);
  const y = useTransform(progress, inputRange, [24, 0]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className={`absolute min-w-[220px] border border-white/80 rounded-2xl p-1.5 shadow-[0_18px_42px_rgba(78,48,88,0.12)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#e8f9a8] px-3.5 py-2 text-[11px] font-semibold text-[#324116] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <span className="truncate">{name}</span>
          </div>
        </div>
      </div>

      <span
        className={`absolute top-1/2 h-px w-14 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(199,189,204,0.95),rgba(199,189,204,0))] ${
          align === "right" ? "-left-14 rotate-180" : "-right-14"
        }`}
      />

      <span
        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-4 border-white bg-[#f0e7f2] shadow-[0_0_0_1px_rgba(214,204,219,0.9)] ${
          align === "right" ? "-left-1.5" : "-right-1.5"
        }`}
      />
    </motion.div>
  );
}

type ResultRowProps = {
  icon: ElementType;
  text: string;
  positive?: boolean;
};

function ResultRow({ icon: Icon, text, positive = false }: ResultRowProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/72 px-3 py-2.5 shadow-[0_8px_18px_rgba(76,53,86,0.04)]">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          positive ? "bg-[#e9f5ed] text-[#4a815c]" : "bg-[#fff1dc] text-[#a76a21]"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <span className="text-xs font-medium leading-5 text-[#564a5a]">{text}</span>
    </div>
  );
}



