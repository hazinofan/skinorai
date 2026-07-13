"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const TESTIMONIALS = [
  {
    number: "01",
    questionKey: "testimonials.01.question",
    answerKey: "testimonials.01.answer",
    testimonialKey: "testimonials.01.quote",
    author: "Sara",
    profileKey: "testimonials.01.profile",
  },
  {
    number: "02",
    questionKey: "testimonials.02.question",
    answerKey: "testimonials.02.answer",
    testimonialKey: "testimonials.02.quote",
    author: "Imane",
    profileKey: "testimonials.02.profile",
  },
  {
    number: "03",
    questionKey: "testimonials.03.question",
    answerKey: "testimonials.03.answer",
    testimonialKey: "testimonials.03.quote",
    author: "Nora",
    profileKey: "testimonials.03.profile",
  },
  {
    number: "04",
    questionKey: "testimonials.04.question",
    answerKey: "testimonials.04.answer",
    testimonialKey: "testimonials.04.quote",
    author: "Yasmine",
    profileKey: "testimonials.04.profile",
  },
  {
    number: "05",
    questionKey: "testimonials.05.question",
    answerKey: "testimonials.05.answer",
    testimonialKey: "testimonials.05.quote",
    author: "Lina",
    profileKey: "testimonials.05.profile",
  },
];

export function SkinorAITestimonialsSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const { t } = useI18n();

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
            toggleActions: "play none none none",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-testimonials='eyebrow']", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          immediateRender: false,
        })
        .from(
          "[data-testimonials='title']",
          { y: 28, opacity: 0, duration: 0.7, immediateRender: false },
          "-=0.24",
        )
        .from(
          "[data-testimonials='intro']",
          { y: 18, opacity: 0, duration: 0.55, immediateRender: false },
          "-=0.34",
        )
        .from(
          "[data-testimonial-row]",
          {
            y: 24,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            immediateRender: false,
          },
          "-=0.18",
        )
        .from(
          "[data-testimonials='cta']",
          { y: 18, opacity: 0, duration: 0.5, immediateRender: false },
          "-=0.18",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  const handleCardToggle = (cardNumber: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;

    setOpenCard((current) => (current === cardNumber ? null : cardNumber));
  };

  return (
    <section ref={sectionRef} className="mt-20 w-full">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 md:py-20 lg:px-16">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              data-testimonials="title"
              className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#241b29] sm:text-4xl md:text-5xl"
            >
              {t("testimonials.title")}
            </h2>
          </div>

          <p
            data-testimonials="intro"
            className="max-w-md text-sm leading-6 text-[#746879] md:text-base"
          >
            {t("testimonials.intro")}
          </p>
        </div>

        <div className="divide-y divide-[#e8dfe9] border-y border-[#e8dfe9]">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.number}
              data-testimonial-row
              data-open={openCard === item.number}
              onClick={() => handleCardToggle(item.number)}
              className="group relative cursor-pointer py-6 md:cursor-default md:py-8"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex max-w-4xl gap-4 md:gap-7">
                  <span className="pt-1 text-xs font-semibold text-[#a37ab6]">
                    {item.number}
                  </span>

                  <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-[#2a2130] transition-colors duration-300 group-hover:text-[#8d59aa] md:text-3xl">
                    {t(item.questionKey)}
                  </h3>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dfd2e4] bg-white text-[#8f6a9e] transition duration-300 group-hover:rotate-12 group-hover:border-[#cdaadd] group-hover:bg-[#f4eafb]">
                  <Quote className="h-4 w-4" />
                </div>
              </div>

              <div className="grid max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out data-[open=true]:max-h-[420px] data-[open=true]:opacity-100 md:group-hover:max-h-[420px] md:group-hover:opacity-100">
                <div className="grid gap-6 pb-2 pt-6 pl-8 md:grid-cols-[1fr_0.85fr] md:gap-12 md:pl-12">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#9b76a9]">
                      {t("testimonials.how")}
                    </p>

                    <p className="max-w-2xl text-sm leading-7 text-[#6e6373] md:text-base">
                      {t(item.answerKey)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e7dce9] bg-white p-5 shadow-[0_15px_40px_rgba(78,50,88,0.05)]">
                    <Quote className="mb-3 h-5 w-5 text-[#bd91d2]" />

                    <blockquote className="text-sm leading-6 text-[#4e4254]">
                      “{t(item.testimonialKey)}”
                    </blockquote>

                    <div className="mt-4 border-t border-[#eee6f0] pt-4">
                      <p className="text-sm font-semibold text-[#2a2130]">
                        {item.author}
                      </p>

                      <p className="mt-0.5 text-xs text-[#8b7d91]">
                        {t(item.profileKey)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          data-testimonials="cta"
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-xl text-xs leading-5 text-[#96899b]">
            {t("testimonials.note")}
          </p>

          <button
            type="button"
            onClick={() => router.push("/scan")}
            className="group inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#27202c] px-5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#17131a]"
          >
            {t("testimonials.cta")}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
