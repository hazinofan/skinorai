"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProductScanShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t } = useI18n();

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const labels = gsap.utils.toArray<HTMLElement>("[data-animate='how-label']");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-animate='how-visual']", {
          x: -36,
          opacity: 0,
          duration: 0.85,
          immediateRender: false,
        })
        .from(
          labels,
          {
            y: 18,
            opacity: 0,
            scale: 0.92,
            stagger: 0.12,
            duration: 0.38,
            immediateRender: false,
          },
          "-=0.45",
        )
        .from(
          "[data-animate='how-intro']",
          {
            y: 22,
            opacity: 0,
            duration: 0.55,
            immediateRender: false,
          },
          "-=0.4",
        )
        .from(
          "[data-animate='how-divider']",
          {
            scaleY: 0.35,
            opacity: 0,
            duration: 0.5,
            transformOrigin: "top center",
            immediateRender: false,
          },
          "-=0.2",
        )
        .from(
          "[data-animate='how-arrow']",
          {
            y: -12,
            opacity: 0,
            duration: 0.35,
            immediateRender: false,
          },
          "-=0.16",
        )
        .from(
          "[data-animate='how-outro']",
          {
            y: 24,
            opacity: 0,
            duration: 0.58,
            immediateRender: false,
          },
          "-=0.16",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mt-6 bg-[#f7f7f8]">
      <div>
        <div className="overflow-hidden bg-[#d8dadd]">
          <div className="grid min-h-[920px] overflow-hidden bg-white lg:grid-cols-2">
            <div
              data-animate="how-visual"
              className="relative min-h-[460px] overflow-hidden lg:min-h-full"
            >
              <Image
                src="/faceScan.png"
                alt={t("how.imageAlt")}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover object-center"
                priority
              />

              <div className="absolute inset-0 bg-black/[0.03]" />

              <ImageLabel className="left-[44%] top-[18%]" text={t("how.label.analyze")} />
              <ImageLabel className="left-[39%] top-[50%]" text={t("how.label.hydrate")} />
              <ImageLabel className="left-[68%] top-[72%]" text={t("how.label.understand")} />
            </div>

            <div className="relative flex min-h-[440px] flex-col items-center bg-[linear-gradient(180deg,#f3eaff_0%,#faf7ff_52%,#ffffff_100%)] px-6 py-10 text-center sm:px-10 lg:min-h-[520px] lg:px-14 lg:py-12">
              <div data-animate="how-intro" className="max-w-[500px]">
                <p className="text-[34px] font-semibold tracking-[-0.05em] text-[#242127] sm:text-[42px]">
                  {t("how.title")}
                </p>

                <p className="mx-auto mt-4 max-w-[440px] text-sm leading-6 text-[#625c69]">
                  {t("how.text")}
                </p>
              </div>

              <div className="relative my-8 flex flex-1 flex-col items-center justify-center">
                <span
                  data-animate="how-divider"
                  className="h-full min-h-[190px] w-px bg-[linear-gradient(180deg,transparent_0%,#d7c4f7_22%,#bfa2f1_72%,transparent_100%)]"
                />

                <ArrowDown
                  data-animate="how-arrow"
                  className="-mt-1 h-7 w-7 text-[#c7acef]"
                  strokeWidth={1.6}
                />
              </div>

              <div data-animate="how-outro" className="max-w-[520px]">
                <h2 className="text-[36px] font-semibold tracking-[-0.055em] text-[#242127] sm:text-[46px]">
                  {t("how.outroTitle")}
                </h2>

                <p className="mx-auto mt-4 max-w-[460px] text-sm leading-6 text-[#6b6471]">
                  {t("how.outroText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageLabel({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return (
    <div
      data-animate="how-label"
      className={`absolute -translate-x-1/2 -translate-y-1/2 text-white ${className}`}
    >
      <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.12)]" />
      <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.05em] drop-shadow-sm">
        {text}
      </span>
    </div>
  );
}
