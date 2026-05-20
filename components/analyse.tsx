"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Sparkles, Stars, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Scanner d ingredients",
    description: "Transforme l etiquette en ingredients lisibles.",
    tag: "Lecture instantanee",
    image: "/scanner.png",
    imageAlt: "Illustration scanner d ingredients",
    tagIcon: Zap,
  },
  {
    number: "02",
    title: "Verification des irritants",
    description: "Repere les ingredients sensibles a surveiller.",
    tag: "Securite & tolerance",
    image: "/check.png",
    imageAlt: "Illustration verification des irritants",
    tagIcon: Sparkles,
    featured: true,
  },
  {
    number: "03",
    title: "Compatibilite routine",
    description: "Verifie si le produit s integre bien dans votre routine.",
    tag: "Routine harmonieuse",
    image: "/puzzle.png",
    imageAlt: "Illustration compatibilite routine",
    tagIcon: ShieldCheck,
  },
  {
    number: "04",
    title: "Prochaine etape IA",
    description: "Suggere une action simple : utiliser, tester ou espacer.",
    tag: "Conseil personnalise",
    image: "/ia.png",
    imageAlt: "Illustration intelligence artificielle",
    tagIcon: Stars,
  },
];

export default function ClearAnalysisSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 86%",
            toggleActions: "play none none none",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-animate='analysis-badge']", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          immediateRender: false,
        })
        .from(
          "[data-animate='analysis-title']",
          { y: 24, opacity: 0, duration: 0.6, immediateRender: false },
          "-=0.2",
        )
        .from(
          "[data-animate='analysis-subtitle']",
          { y: 18, opacity: 0, duration: 0.5, immediateRender: false },
          "-=0.35",
        )
        .from(
          "[data-animate='analysis-card']",
          {
            y: 28,
            scale: 0.98,
            duration: 0.6,
            stagger: 0.1,
            immediateRender: false,
          },
          "-=0.2",
        )
        .from(
          "[data-animate='analysis-footer']",
          { y: 16, opacity: 0, duration: 0.45, immediateRender: false },
          "-=0.2",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f7f2ff_46%,_#f4efff_100%)] px-4 py-14 sm:px-6 md:px-8 md:py-20 lg:px-10 xl:px-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-8 h-40 w-28 rounded-[45%] border border-white/70 bg-white/65 shadow-[0_20px_60px_rgba(188,173,255,0.35)] blur-[1px]" />
        <div className="absolute right-[-3%] top-12 h-28 w-52 rounded-[999px] bg-white/70 shadow-[0_24px_80px_rgba(188,173,255,0.28)] blur-[1px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[radial-gradient(circle_at_center,_rgba(183,162,255,0.14),_transparent_62%)]" />
        <div className="absolute left-[12%] top-[22%] text-[#c6b5ff]">
          <Sparkles className="h-8 w-8" strokeWidth={1.25} />
        </div>
        <div className="absolute right-[18%] top-[18%] text-[#ccbfff]">
          <Sparkles className="h-6 w-6" strokeWidth={1.25} />
        </div>
        <div className="absolute right-[5%] bottom-[9%] h-32 w-20 rotate-[25deg] rounded-[1.8rem] border border-white/70 bg-gradient-to-b from-white/90 to-[#d8caff]/60 shadow-[0_20px_60px_rgba(182,166,255,0.35)]" />
      </div>

      <div className="relative mx-auto max-w-[1450px]">
        <div className="mx-auto max-w-[820px] text-center">
          <div
            data-animate="analysis-badge"
            className="inline-flex items-center gap-3 rounded-full border border-[#ddd1ff] bg-white/65 px-4 py-2 text-xs font-medium text-[#8a6fff] shadow-[0_10px_35px_rgba(190,179,255,0.22)] backdrop-blur-xl sm:text-sm"
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.8} />
            <span>IA - Transparente - Fiable</span>
          </div>

          <h2
            data-animate="analysis-title"
            className="mt-5 text-[34px] font-semibold leading-[0.98] text-[#11183c] sm:text-[48px] lg:text-[64px]"
          >
            Une analyse{" "}
            <span className="bg-gradient-to-r from-[#8c70ff] via-[#7d68ff] to-[#aa91ff] bg-clip-text text-transparent">
              claire
            </span>
            , sans jargon.
          </h2>

          <p
            data-animate="analysis-subtitle"
            className="mx-auto mt-4 max-w-[680px] text-base text-[#66708f] sm:text-[20px]"
          >
            Tout ce qu il faut pour comprendre un produit skincare.
          </p>
        </div>

        <div className="relative mt-10 xl:mt-14">
          <div className="pointer-events-none absolute left-[11%] right-[11%] top-[31%] hidden items-center xl:flex">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d6c8ff] to-[#d6c8ff]" />
            <div className="mx-3 h-3 w-3 rounded-full bg-[#caaeff]" />
            <div className="h-px flex-1 bg-gradient-to-r from-[#d6c8ff] via-[#d6c8ff] to-transparent" />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr_1fr_1fr] xl:items-end">
            {steps.map((step) => {
              const TagIcon = step.tagIcon;

              return (
                <article
                  key={step.number}
                  data-animate="analysis-card"
                  className={`relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-5 shadow-[0_20px_60px_rgba(169,152,245,0.14)] backdrop-blur-[18px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(169,152,245,0.2)] sm:p-6 ${
                    step.featured
                      ? "xl:min-h-[440px] xl:rounded-[2.25rem] xl:border-[#d5c7ff] xl:pb-7"
                      : "xl:min-h-[400px]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-white/50 to-transparent" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#9a7cff] to-[#7f63ff] text-base font-semibold text-white shadow-[0_14px_35px_rgba(140,112,255,0.4)]">
                      {step.number}
                    </div>

                    {step.featured ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-white/70 bg-white/80 shadow-[0_10px_30px_rgba(187,173,255,0.28)]">
                        <ShieldCheck className="h-6 w-6 text-[#8c70ff]" strokeWidth={1.8} />
                      </div>
                    ) : (
                      <div className="text-[#cfbfff]">
                        <Sparkles className="h-6 w-6" strokeWidth={1.25} />
                      </div>
                    )}
                  </div>

                  <div
                    className={`relative mt-6 flex items-center justify-center ${
                      step.featured ? "h-48 sm:h-56" : "h-40 sm:h-44"
                    }`}
                  >
                    <div className="absolute inset-x-8 bottom-5 top-6 rounded-full bg-[radial-gradient(circle,_rgba(154,124,255,0.18)_0%,_rgba(255,255,255,0)_72%)] blur-xl" />
                    <div className="relative h-full w-full">
                      <Image
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        sizes="(max-width: 1279px) 100vw, 25vw"
                        className="object-contain drop-shadow-[0_18px_30px_rgba(154,124,255,0.25)]"
                        priority={step.featured}
                      />
                    </div>
                  </div>

                  <h3 className="mt-3 text-[24px] font-semibold leading-[1.08] text-[#11183c] sm:text-[26px]">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-[28ch] text-[16px] leading-7 text-[#66708f] sm:text-[17px]">
                    {step.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e6dcff] bg-white/80 px-4 py-2 text-xs font-medium text-[#8669ff] shadow-[0_10px_30px_rgba(190,179,255,0.16)] sm:text-sm">
                    <TagIcon className="h-4 w-4" strokeWidth={1.9} />
                    <span>{step.tag}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div
          data-animate="analysis-footer"
          className="mx-auto mt-10 flex w-fit items-center gap-3 rounded-full border border-[#e6dcff] bg-white/75 px-5 py-3 text-xs font-medium text-[#8a6fff] shadow-[0_10px_30px_rgba(190,179,255,0.18)] backdrop-blur-xl sm:text-sm"
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.8} />
          <span>Comprendre. Decider. Prendre soin de vous.</span>
        </div>
      </div>
    </section>
  );
}
