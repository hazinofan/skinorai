"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Box, CircleUserRound, Sparkles } from "lucide-react";

const scanLabels = [
  {
    label: "Oiliness / Shine",
    className: "left-[58%] top-[20%] h-16 w-16 sm:h-20 sm:w-20",
  },
  {
    label: "Fine Lines",
    className: "left-[60%] top-[42%] h-20 w-24 sm:h-24 sm:w-28",
  },
  {
    label: "Enlarged Pores",
    className: "left-[39%] top-[58%] h-16 w-16 sm:h-20 sm:w-20",
  },
];

const stats = [
  {
    icon: Sparkles,
    value: "95%",
    label: "accurate skin analysis",
  },
  {
    icon: CircleUserRound,
    value: "30+",
    label: "skin concerns analyzed",
  },
  {
    icon: Box,
    value: "7-day",
    label: "personalized routine",
  },
];

export default function SkinHero() {
  const rootRef = useRef<HTMLElement | null>(null);

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
          { y: 34, opacity: 0, scale: 0.975, duration: 0.85, clearProps: "transform,opacity" },
          "-=0.35",
        )
        .from(
          "[data-hero='divider']",
          { scaleY: 0, opacity: 0, duration: 0.55, transformOrigin: "top" },
          "-=0.36",
        )
        .from(
          "[data-hero='scan-box']",
          { opacity: 0, scale: 0.75, duration: 0.42, stagger: 0.12, clearProps: "opacity" },
          "-=0.32",
        )
        .from(
          "[data-hero='stat']",
          { x: 28, opacity: 0, duration: 0.55, stagger: 0.11, clearProps: "transform,opacity" },
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
      className="relative min-h-screen overflow-hidden bg-[#fbfbfa] text-[#161519]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-gradient-to-b from-transparent via-[#fbfbfa]/70 to-[#fbfbfa]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[31%] bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa]/88 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[30%] bg-gradient-to-l from-[#fbfbfa] via-[#fbfbfa]/85 to-transparent" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1760px] grid-cols-1 items-center gap-8 px-5 pb-12 pt-16 sm:px-8 sm:pt-14 lg:grid-cols-[0.72fr_1.32fr_0.52fr] lg:items-start lg:px-10 lg:pt-28 xl:px-16 xl:pt-24">
        <div data-hero="copy" className="relative z-30 max-w-[440px]">
          <h1 className="text-[54px] font-semibold leading-[0.89] tracking-[-0.078em] text-[#18171b] sm:text-[74px] lg:text-[70px] xl:text-[88px]">
            Unlock your skin's potential
          </h1>

          <p className="mt-8 max-w-[300px] text-sm leading-6 text-[#4d4a51] sm:text-base">
            Our AI scans your face and shows what can be improved
          </p>

          <button
            type="button"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-md border border-[#ddcdf2] bg-[#f1e4ff] px-6 text-sm font-semibold text-[#17151c] transition hover:-translate-y-0.5 hover:bg-[#ead8ff]"
          >
            Analyze Skin
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-20 order-first flex min-h-[500px] items-end justify-center lg:order-none lg:min-h-[calc(100vh-7rem)] lg:-translate-y-8 xl:-translate-y-10">
          <div
            data-hero="video-wrap"
            className="relative h-[560px] w-[430px] sm:h-[690px] sm:w-[540px] lg:h-[790px] lg:w-[640px] xl:h-[920px] xl:w-[750px]"
          >
            <video
              src="/skin-model-video-nobg.webm"
              className="absolute inset-0 h-full w-full object-contain object-bottom"
              autoPlay
              muted
              loop
              playsInline
            />

            <div
              data-hero="divider"
              className="absolute bottom-[9%] left-1/2 top-[11%] w-px -translate-x-1/2 bg-white/95 shadow-[0_0_22px_rgba(255,255,255,0.5)]"
            />

            {scanLabels.map((item) => (
              <div
                key={item.label}
                data-hero="scan-box"
                className={`absolute z-20 border-2 border-white/95 bg-white/5 text-white shadow-[0_10px_32px_rgba(32,24,36,0.08)] ${item.className}`}
              >
                <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-white" />
                <span className="absolute bottom-2 left-2 max-w-[58px] text-[9px] font-semibold leading-[0.9] sm:max-w-[70px] sm:text-[10px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-30 mx-auto flex w-full max-w-[270px] flex-row justify-between gap-4 lg:mx-0 lg:min-h-[calc(100vh-7rem)] lg:flex-col lg:items-end lg:justify-center lg:gap-9 lg:-translate-y-8 xl:-translate-y-10">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.value} data-hero="stat" className="grid grid-cols-[38px_1fr] items-center gap-4 lg:grid-cols-[48px_92px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-[#c8b5d9] lg:h-12 lg:w-12">
                  <Icon className="h-7 w-7" strokeWidth={1.15} />
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-2xl font-semibold leading-none tracking-[-0.04em] text-[#2b292f] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-[1.1] text-[#6d6871] sm:text-xs">
                    {stat.label}
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