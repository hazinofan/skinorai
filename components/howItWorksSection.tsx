"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import Stepper, { Step } from "@/components/Stepper";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

const stepCards = [
  {
    number: "01",
    title: "Scanner",
    footer: "Importez l etiquette",
    image: "/scan.png",
    alt: "Etape scanner",
  },
  {
    number: "02",
    title: "Analyser",
    footer: "L IA lit les ingredients",
    image: "/Ai.png",
    alt: "Etape analyser",
  },
  {
    number: "03",
    title: "Recommander",
    footer: "Recevez la prochaine etape",
    image: "/choix.png",
    alt: "Etape recommander",
  },
];

export default function HowItWorksSection() {
  const router = useRouter();
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
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-animate='works-badge']", {
          y: 16,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          "[data-animate='works-title']",
          { y: 28, opacity: 0, duration: 0.65 },
          "-=0.25",
        )
        .from(
          "[data-animate='works-subtitle']",
          { y: 18, opacity: 0, duration: 0.55 },
          "-=0.35",
        )
        .from(
          "[data-animate='works-stepper']",
          { y: 30, opacity: 0, scale: 0.98, duration: 0.7 },
          "-=0.25",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-10 xl:px-12"
    >
      <Image
        src="/bg-image.png"
        alt="Fond section comment ca marche"
        fill
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-white/62" />

      <div className="relative mx-auto w-full max-w-[1600px]">
        <div className="mx-auto max-w-[760px] text-center">
          <div
            data-animate="works-badge"
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-5 py-2 text-sm font-semibold tracking-[0.16em] text-[#8e67ff]"
          >
            <Sparkles className="h-4 w-4" />
            SKINORAI
          </div>

          <h2
            data-animate="works-title"
            className="mt-6 text-[42px] font-medium leading-[1.05] text-[#142447] sm:text-[56px] lg:text-[72px]"
          >
            Comment ca{" "}
            <span className="font-serif italic font-normal text-[#9a74ff]">
              marche
            </span>
          </h2>

          <p
            data-animate="works-subtitle"
            className="mt-4 text-lg text-[#5c6480] sm:text-[34px]"
          >
            3 etapes simples pour analyser un produit.
          </p>
        </div>

        <div data-animate="works-stepper" className="mt-10 lg:mt-12">
          <Stepper
            initialStep={1}
            backButtonText="Precedent"
            nextButtonText="Suivant"
            finalButtonText="Aller au scan"
            onFinalStepCompleted={() => router.push("/analyze")}
            stepCircleContainerClassName="rounded-[28px] border border-white/65 bg-white/42 shadow-[0_20px_56px_rgba(133,114,184,0.12)] backdrop-blur-[20px]"
            stepContainerClassName="px-6 py-6 sm:px-8 sm:py-8"
            contentClassName="px-0 sm:px-0"
            footerClassName="px-6 pb-6 sm:px-8 sm:pb-8"
            backButtonProps={{
              className:
                "rounded-lg px-3 py-2 text-sm font-medium text-[#5d6685] transition hover:bg-white/65",
            }}
            nextButtonProps={{
              className:
                "rounded-xl bg-[#8f69ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7f58f1]",
            }}
            renderStepIndicator={({ step, currentStep, onStepClick }) => {
              const isActive = currentStep === step;
              const isDone = currentStep > step;

              return (
                <button
                  type="button"
                  onClick={() => onStepClick(step)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl font-semibold transition ${
                    isActive
                      ? "border-[#bda9ff] bg-[#f3edff] text-[#7c63f5]"
                      : isDone
                        ? "border-[#bda9ff] bg-[#8f69ff] text-white"
                        : "border-[#ddd2ff] bg-white/70 text-[#8f69ff]"
                  }`}
                  aria-label={`Aller a l etape ${step}`}
                >
                  {String(step).padStart(2, "0")}
                </button>
              );
            }}
          >
            {stepCards.map((item) => (
              <Step key={item.number}>
                <article className="px-0">
                  <h3 className="text-center text-[30px] font-semibold text-[#172447] sm:text-[38px]">
                    {item.title}
                  </h3>

                  <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e3d9ff] bg-white/65 p-2">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={1100}
                      height={860}
                      className="h-auto w-full rounded-[18px] object-cover"
                    />
                  </div>

                  <p className="mt-6 text-center text-[18px] font-medium text-[#5d6685] sm:text-[22px]">
                    {item.footer}
                  </p>
                </article>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    </section>
  );
}
