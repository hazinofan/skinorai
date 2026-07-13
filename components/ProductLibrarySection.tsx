"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const CircularGallery = dynamic(() => import("@/components/CircularGallery"), {
  ssr: false,
});

const Masonry = dynamic(() => import("@/components/Masonry"), {
  ssr: false,
});

const products = [
  "avene-cicalfate.png",
  "avene-cleanance-gel.png",
  "avene-tolerance-control.png",
  "bioderma-atoderm-intensive.png",
  "bioderma-pigmentbio.png",
  "bioderma-sebium-hydra.png",
  "bioderma-sensibio-defensive.png",
  "cerave-am-facial.png",
  "cerave-foaming-cleanser.png",
  "cerave-hydrating-cleanser.png",
  "cerave-moisturizing-cream.png",
  "cerave-resurfacing-retinol.png",
  "eucerin-anti-pigment.png",
  "eucerin-oil-control.png",
  "garnier-vitamin-c.png",
  "isispharma-ruboril.png",
  "la-roche-toleriane.png",
  "laroche-cicaplast-baume.png",
  "laroche-effaclar-serum.png",
  "neutrogena-hydro-boost.png",
  "neutrogena-retinol-boost.png",
  "ordinary-azelaic-acid.png",
  "ordinary-hyaluronic-acid.png",
  "ordinary-niacinamide-zinc.png",
  "paulas-choice-bha.png",
  "svr-ampoule-b3.png",
  "svr-sebiaclear-gel.png",
  "svr-sensifine.png",
  "uriage-bariederm-cica.png",
  "vichy-capital-soleil.png",
  "vichy-mineral-89.png",
  "vichy-normaderm.png",
];

const formatProductName = (fileName: string) =>
  fileName
    .replace(/\.(png|webp)$/i, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const circularItems = products.slice(0, 18).map((fileName) => ({
  image: `/products/${fileName}`,
  text: formatProductName(fileName),
}));

const masonryItems = products.map((fileName, index) => ({
  id: fileName,
  img: `/products/${fileName}`,
  url: `/products`,
  height: [520, 620, 700, 580, 760, 660][index % 6],
}));

export default function ProductLibrarySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t } = useI18n();

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to("[data-library-bg='left']", {
        y: 90,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-library-bg='right']", {
        y: -120,
        scale: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-library-block='products']",
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-products-header='eyebrow']", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          immediateRender: false,
        })
        .from(
          "[data-products-header='title']",
          { y: 30, opacity: 0, duration: 0.7, immediateRender: false },
          "-=0.24",
        )
        .from(
          "[data-products-header='text']",
          { y: 20, opacity: 0, duration: 0.55, immediateRender: false },
          "-=0.36",
        )
        .from(
          "[data-animate='circular-shell']",
          {
            y: 44,
            opacity: 0,
            scale: 0.97,
            duration: 0.85,
            immediateRender: false,
          },
          "-=0.2",
        )
        .from(
          "[data-animate='circular-glow']",
          {
            opacity: 0,
            scaleX: 0.65,
            duration: 0.75,
            immediateRender: false,
          },
          "-=0.65",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-library-block='ingredients']",
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-ingredients-header='eyebrow']", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          immediateRender: false,
        })
        .from(
          "[data-ingredients-header='title']",
          { y: 30, opacity: 0, duration: 0.7, immediateRender: false },
          "-=0.24",
        )
        .from(
          "[data-ingredients-header='text']",
          { y: 20, opacity: 0, duration: 0.55, immediateRender: false },
          "-=0.36",
        )
        .from(
          "[data-animate='masonry-shell']",
          {
            y: 52,
            opacity: 0,
            scale: 0.985,
            duration: 0.85,
            immediateRender: false,
          },
          "-=0.14",
        );
    }, root);

    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fbf9ff] pt-20 sm:pt-24 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9c9e5] to-transparent" />
        <div
          data-library-bg="left"
          className="absolute left-[-12rem] top-20 h-96 w-96 rounded-full bg-[#eadcff]/70 blur-3xl"
        />
        <div
          data-library-bg="right"
          className="absolute right-[-12rem] top-[42%] h-96 w-96 rounded-full bg-[#e8f8cf]/60 blur-3xl"
        />
      </div>

      <div
        data-library-block="products"
        className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"
      >
        <SectionHeader
          id="products"
          eyebrow={t("library.productsEyebrow")}
          title={t("library.productsTitle")}
          text={t("library.productsText")}
          nature="products"
        />
      </div>

      <div
        data-animate="circular-shell"
        className="relative mt-10 h-[430px] overflow-hidden sm:h-[520px] lg:h-[620px]"
      >
        <div
          data-animate="circular-glow"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[68%] -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.42),_rgba(255,255,255,0)_72%)]"
        />
        <div className="relative z-10 h-full">
          <CircularGallery
            items={circularItems}
            bend={2.6}
            borderRadius={0.04}
            textColor="#33243a"
            font="bold 26px Arial"
            scrollSpeed={2.3}
            scrollEase={0.06}
          />
        </div>
      </div>

      <div
        data-library-block="ingredients"
        className="relative mx-auto mt-12 max-w-7xl px-5 sm:mt-16 sm:px-8 lg:mt-20 lg:px-12"
      >
        <SectionHeader
          id="ingredients"
          eyebrow={t("library.ingredientsEyebrow")}
          title={t("library.ingredientsTitle")}
          text={t("library.ingredientsText")}
          nature="ingredients"
        />

        <div
          data-animate="masonry-shell"
          dir="ltr"
          className="relative mt-10 h-[980px] overflow-hidden p-3 sm:h-[1100px] sm:p-4 lg:h-[1220px]"
        >
          <Masonry
            items={masonryItems}
            animateFrom="bottom"
            scaleOnHover
            hoverScale={0.97}
            blurToFocus
            colorShiftOnHover={false}
            revealOnScroll
            itemShadow={false}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-gradient-to-b from-[#fbf9ff]/0 via-[#fbf9ff]/82 to-[#fbf9ff]" />
        </div>
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  id: "products" | "ingredients";
  eyebrow: string;
  title: string;
  text: string;
  nature?: string;
};

function SectionHeader({ id, eyebrow, title, text, nature }: SectionHeaderProps) {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p
        data-products-header={id === "products" ? "eyebrow" : undefined}
        data-ingredients-header={id === "ingredients" ? "eyebrow" : undefined}
        className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b649b]"
      >
        {eyebrow}
      </p>
      <h2
        data-products-header={id === "products" ? "title" : undefined}
        data-ingredients-header={id === "ingredients" ? "title" : undefined}
        className="mt-4 text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#241a2a] sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      <p
        data-products-header={id === "products" ? "text" : undefined}
        data-ingredients-header={id === "ingredients" ? "text" : undefined}
        className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6d6273] sm:text-lg"
      >
        {text}
      </p>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => {
            router.push(`/${nature === "products" ? "products" : "ingredient-library"}`);
          }}
          className="inline-flex cursor-pointer min-h-12 items-center justify-center gap-2 rounded-md border border-[#ddcdf2] bg-[#f1e4ff] px-6 py-3 text-center text-sm font-semibold text-[#17151c] transition hover:-translate-y-0.5 hover:bg-[#ead8ff]"
        >
          {nature === "products" ? t("library.productsCta") : t("library.ingredientsCta")}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
