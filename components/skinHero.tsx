"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Box, CircleUserRound, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const stats = [
  {
    icon: Sparkles,
    valueKey: "hero.stat.accuracyValue",
    labelKey: "hero.stat.accuracy",
  },
  {
    icon: CircleUserRound,
    valueKey: "hero.stat.concernsValue",
    labelKey: "hero.stat.concerns",
  },
  {
    icon: Box,
    valueKey: "hero.stat.routineValue",
    labelKey: "hero.stat.routine",
  },
];

export default function SkinHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const { t } = useI18n();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero='copy'] > *", {
          y: 28,
          opacity: 0,
          duration: 0.62,
          stagger: 0.08,
          clearProps: "transform,opacity",
        })
        .from(
          "[data-hero='video-wrap']",
          {
            y: 34,
            opacity: 0,
            scale: 0.975,
            duration: 0.85,
            clearProps: "transform,opacity",
          },
          "-=0.35",
        )
        .from(
          "[data-hero='divider']",
          { scaleY: 0, opacity: 0, duration: 0.55, transformOrigin: "top" },
          "-=0.36",
        )
        .from(
          "[data-hero='scan-box']",
          {
            opacity: 0,
            scale: 0.75,
            duration: 0.42,
            stagger: 0.12,
            clearProps: "opacity",
          },
          "-=0.32",
        )
        .from(
          "[data-hero='stat']",
          {
            x: 28,
            opacity: 0,
            duration: 0.55,
            stagger: 0.11,
            clearProps: "transform,opacity",
          },
          "-=0.45",
        );

      gsap.to("[data-hero='scan-box']", {
        scale: 1.035,
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#fbfbfa] text-[#161519]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-gradient-to-b from-transparent via-[#fbfbfa]/70 to-[#fbfbfa]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[31%] bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa]/88 to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[30%] bg-gradient-to-l from-[#fbfbfa] via-[#fbfbfa]/85 to-transparent lg:block" />

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[1760px] grid-cols-1 items-center gap-6 px-5 pb-12 pt-16 sm:gap-8 sm:px-8 sm:pt-14 lg:grid-cols-[0.72fr_1.32fr_0.52fr] lg:items-start lg:px-10 lg:pt-28 xl:px-16 xl:pt-24">
        <div
          data-hero="copy"
          className="relative z-30 mx-auto max-w-[440px] text-center lg:mx-0 lg:text-left"
          style={{ alignSelf: "center" }}
        >
          <h1 className="text-[42px] font-semibold leading-[0.89] tracking-[-0.078em] text-[#18171b] sm:text-[60px] lg:text-[70px] xl:text-[88px]">
            {t("hero.title")}
          </h1>

          <p className="mx-auto mt-6 max-w-[320px] text-sm leading-6 text-[#4d4a51] sm:mt-8 sm:text-base lg:mx-0 lg:max-w-[300px]">
            {t("hero.text")}
          </p>

          <button
            type="button"
            onClick={() => {
              router.push("/scan");
            }}
            className="mt-6 inline-flex h-12 cursor-pointer items-center gap-2 rounded-md border border-[#ddcdf2] bg-[#f1e4ff] px-6 text-sm font-semibold text-[#17151c] transition hover:-translate-y-0.5 hover:bg-[#ead8ff]"
          >
            {t("hero.cta")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-20 order-first flex min-h-[360px] items-end justify-center sm:min-h-[500px] lg:order-none lg:min-h-[calc(100vh-7rem)] lg:-translate-y-8 xl:-translate-y-10">
          <div
            data-hero="video-wrap"
            className="relative h-[420px] w-[320px] sm:h-[690px] sm:w-[540px] lg:h-[790px] lg:w-[640px] xl:h-[920px] xl:w-[750px]"
          >
            <video
              src="/skin-model-video-nobg.webm"
              className="absolute inset-0 h-full w-full scale-[1.15] object-contain object-bottom"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        <div className="relative z-30 mx-auto grid w-full max-w-[560px] grid-cols-1 gap-5 sm:grid-cols-3 lg:mx-0 lg:min-h-[calc(100vh-7rem)] lg:max-w-[270px] lg:grid-cols-1 lg:justify-items-end lg:gap-9 lg:-translate-y-8 xl:-translate-y-10">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.valueKey}
                data-hero="stat"
                className="grid grid-cols-[38px_1fr] items-center gap-4 sm:grid-cols-1 sm:justify-items-center sm:text-center lg:grid-cols-[48px_150px] lg:justify-items-stretch lg:text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-[#c8b5d9] lg:h-12 lg:w-12">
                  <Icon className="h-7 w-7" strokeWidth={1.15} />
                </div>
                <div className="text-left sm:text-center lg:text-right">
                  <p className="text-4xl font-semibold leading-none tracking-[-0.04em] text-[#2b292f] sm:text-4xl">
                    {t(stat.valueKey)}
                  </p>
                  <p className="mt-1 text-[11px] leading-[1.1] text-[#6d6871] sm:text-xs">
                    {t(stat.labelKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
