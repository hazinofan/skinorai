"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
  Heart,
  Play,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const glassCardClass =
  "rounded-[18px] border border-white/55 bg-white/28 shadow-[0_14px_40px_rgba(95,78,140,0.12)] backdrop-blur-[24px] backdrop-saturate-150";

const productSlides = [
  {
    title: "Compatibilite Produit",
    badge: "IA",
    description:
      "Scannez une etiquette et voyez si la formule convient a votre peau.",
    active: "Ingredients",
    steps: [
      { icon: FlaskConical, label: "Ingredients" },
      { icon: ShieldCheck, label: "Securite" },
      { icon: Droplets, label: "Routine" },
      { icon: Sparkles, label: "Resultat" },
    ],
  },
  {
    title: "Analyse des Risques",
    badge: "Smart",
    description:
      "Reperez les irritants possibles, les declencheurs d acne et les mauvais melanges.",
    active: "Securite",
    steps: [
      { icon: FlaskConical, label: "Formule" },
      { icon: ShieldCheck, label: "Securite" },
      { icon: Droplets, label: "Equilibre" },
      { icon: Sparkles, label: "Score" },
    ],
  },
  {
    title: "Placement Routine",
    badge: "Apercu",
    description:
      "Trouvez la meilleure place pour ce produit dans votre routine.",
    active: "Routine",
    steps: [
      { icon: FlaskConical, label: "Nettoyer" },
      { icon: ShieldCheck, label: "Proteger" },
      { icon: Droplets, label: "Routine" },
      { icon: Sparkles, label: "Finaliser" },
    ],
  },
];

const routineSlides = [
  {
    title: "Suggestion de Routine IA",
    description:
      "Obtenez la meilleure prochaine etape pour votre produit scanne.",
    action: "Analyser",
    image: "/routine.png",
  },
  {
    title: "Routine du Matin",
    description:
      "Construisez un plan leger pour l hydratation et la protection.",
    action: "Voir la routine",
    image: "/cleaner.png",
  },
  {
    title: "Reparation de la Barriere",
    description:
      "Remplacez les combinaisons agressives par une routine plus douce.",
    action: "Voir le plan",
    image: "/barriere.png",
  },
];

export default function SkinHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [productSlide, setProductSlide] = useState(0);
  const [routineSlide, setRoutineSlide] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-animate='badge']", {
        y: 20,
        opacity: 0,
        duration: 0.55,
      })
        .from(
          "[data-animate='title-line']",
          { y: 24, opacity: 0, duration: 0.55, stagger: 0.08 },
          "-=0.3",
        )
        .from(
          "[data-animate='description'], [data-animate='actions']",
          { y: 18, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.25",
        )
        .from(
          "[data-animate='video']",
          { y: 40, opacity: 0, duration: 0.75 },
          "-=0.35",
        )
        .from(
          "[data-animate='card']",
          { x: 24, opacity: 0, duration: 0.45, stagger: 0.08 },
          "-=0.4",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip text-[#171729]"
    >
      <Image
        src="/bg-image.png"
        alt="Fond hero SkinorAI"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-white/62" />

      <div className="relative mx-auto flex min-h-screen lg:mt-6 w-full max-w-[1800px] items-start px-4 pb-8 pt-24 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid w-full grid-cols-1 gap-y-8 md:gap-y-10 lg:grid-cols-[minmax(280px,0.9fr)_minmax(360px,1.05fr)] lg:gap-x-8 xl:grid-cols-[minmax(280px,0.85fr)_minmax(380px,1fr)_minmax(260px,0.72fr)] xl:gap-x-10">
          <div className="relative z-20 max-w-[560px]">
            <div
              data-animate="badge"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/42 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e67ff] shadow-[0_8px_24px_rgba(166,135,255,0.14)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Skincare Pilote par IA
            </div>

            <h1 className="mt-6 text-[38px] font-medium leading-[1.03] sm:text-[48px] md:text-[56px] xl:text-[64px]">
              <span data-animate="title-line" className="block">
                Analysez
              </span>
              <span
                data-animate="title-line"
                className="block font-serif italic font-normal text-[#9a74ff]"
              >
                Vos Produits.
              </span>
              <span data-animate="title-line" className="block">
                Soignez votre peau
              </span>
              <span data-animate="title-line" className="block">
                avec{" "}
                <span className="font-serif italic font-normal text-[#9a74ff]">
                  l IA.
                </span>
              </span>
            </h1>

            <p
              data-animate="description"
              className="mt-5 max-w-[420px] text-[15px] leading-7 text-[#5f5c72] sm:text-base"
            >
              Scannez une etiquette skincare et obtenez une lecture simple des
              ingredients, des irritants possibles et de la compatibilite avec
              votre routine.
            </p>

            <div
              data-animate="actions"
              className="mt-7 flex flex-wrap gap-3 sm:gap-4"
            >
              <button className="group cursor-pointer inline-flex h-12 items-center rounded-xl bg-[#111018] p-1 pl-4 text-sm font-medium text-white shadow-[0_10px_28px_rgba(17,16,24,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b1924] sm:h-13 sm:rounded-2xl sm:pl-5 sm:text-base">
                <span className="pr-3 sm:pr-4">Commencer le scan gratuit</span>
                <span className="flex h-9 w-9 items-center justify-center mr-1 rounded-lg border border-[#dedce7] bg-white text-[#111018] shadow-sm transition group-hover:scale-105">
                  <ScanSearch className="h-4.5 w-4.5" />
                </span>
              </button>

              <button className="group cursor-pointer inline-flex h-12 items-center gap-3 rounded-xl px-1 pr-2 text-sm font-medium text-[#25233a] transition hover:text-[#7f64ff] sm:h-13 sm:rounded-2xl sm:pr-4 sm:text-base">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/45 shadow-[0_8px_24px_rgba(96,85,133,0.12)] backdrop-blur-xl">
                  <Play className="ml-0.5 h-4 w-4" />
                </span>
                Tutoriel
              </button>
            </div>
            <div
              data-animate="social"
              className="mt-16 hidden md:flex items-center gap-4 text-sm text-[#777389]"
            >
              {" "}
              <Image
                src="/people.png"
                alt="Skincare users"
                width={112}
                height={46}
                className="h-11 w-28 object-contain"
              />{" "}
              <div className="flex items-center gap-3">
                {" "}
                <Heart className="h-4 w-4 fill-[#9a74ff] text-[#9a74ff]" />{" "}
                <p className="max-w-[160px] leading-6">
                  {" "}
                  Trusted by skincare users worldwide{" "}
                </p>{" "}
              </div>{" "}
            </div>
          </div>

          <div className="relative z-10 flex mt-10 items-start justify-center lg:justify-end xl:justify-center">
            <video
              data-animate="video"
              src="/skin-model-video-nobg.webm"
              className="h-[360px] w-auto max-w-none object-contain sm:h-[460px] md:h-[560px] lg:h-[620px] lg:-translate-y-4 xl:h-[860px] xl:-translate-y-8"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          <div className="relative z-20 flex w-full flex-col gap-3 sm:gap-4 xl:max-w-[320px] xl:justify-self-end">
            <ProductCard
              current={productSlide}
              onPrev={() =>
                setProductSlide((c) =>
                  c === 0 ? productSlides.length - 1 : c - 1,
                )
              }
              onNext={() =>
                setProductSlide((c) =>
                  c === productSlides.length - 1 ? 0 : c + 1,
                )
              }
            />

            <div data-animate="card" className={`${glassCardClass} p-4 sm:p-5`}>
              <h3 className="text-[20px] font-semibold">
                Ce Que Nous Verifions
              </h3>
              <div className="mt-4 space-y-3.5">
                <CheckItem
                  icon={FlaskConical}
                  label="Irritants Potentiels"
                  level="Signale"
                  levelClass="text-orange-500"
                />
                <CheckItem
                  icon={ShieldCheck}
                  label="Peau Acneique"
                  level="Verifie"
                  levelClass="text-[#6f64ff]"
                />
                <CheckItem
                  icon={Droplets}
                  label="Ingredients Hydratants"
                  level="Trouve"
                  levelClass="text-emerald-500"
                />
                <CheckItem
                  icon={Sparkles}
                  label="Conflits Routine"
                  level="Analyse"
                  levelClass="text-[#8f67ff]"
                />
              </div>
            </div>

            <RoutineCard
              current={routineSlide}
              onPrev={() =>
                setRoutineSlide((c) =>
                  c === 0 ? routineSlides.length - 1 : c - 1,
                )
              }
              onNext={() =>
                setRoutineSlide((c) =>
                  c === routineSlides.length - 1 ? 0 : c + 1,
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  current,
  onPrev,
  onNext,
}: {
  current: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const slide = productSlides[current];

  return (
    <div data-animate="card" className={`${glassCardClass} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[20px] font-semibold">{slide.title}</h3>
          <p className="mt-2 text-[12px] leading-5 text-[#6f6b84] sm:text-[13px] sm:leading-6">
            {slide.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#f2eaff] px-2 py-1 text-[10px] font-semibold text-[#8f67ff] sm:px-2.5 sm:text-[11px]">
          {slide.badge}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-2">
        {slide.steps.map((step) => (
          <StepItem
            key={step.label}
            icon={step.icon}
            label={step.label}
            active={step.label === slide.active}
          />
        ))}
      </div>

      <CarouselFooter
        current={current}
        total={productSlides.length}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}

function RoutineCard({
  current,
  onPrev,
  onNext,
}: {
  current: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const slide = routineSlides[current];

  return (
    <div data-animate="card" className={`${glassCardClass} p-4 sm:p-5`}>
      <h3 className="text-[20px] font-semibold">{slide.title}</h3>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-[14px] bg-white/42 shadow-[0_10px_28px_rgba(122,102,168,0.1)] sm:h-20 sm:w-16 sm:rounded-[16px]">
          <Image
            src={slide.image}
            alt={slide.title}
            width={54}
            height={72}
            className="h-14 w-auto object-contain sm:h-16"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] leading-5 text-[#6f6b84] sm:text-[13px] sm:leading-6">
            {slide.description}
          </p>
          <button className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#7f64ff] transition hover:gap-3 sm:mt-3 sm:text-sm">
            {slide.action}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CarouselFooter
        current={current}
        total={routineSlides.length}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}

function CarouselFooter({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-between sm:mt-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-[#8f67ff]" : "w-1.5 bg-[#d9d2ea]"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/35 text-[#8f67ff] backdrop-blur-xl transition hover:bg-white/55 sm:h-8 sm:w-8"
          aria-label="Diapositive precedente"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/35 text-[#8f67ff] backdrop-blur-xl transition hover:bg-white/55 sm:h-8 sm:w-8"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: typeof FlaskConical;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-sm sm:h-9 sm:w-9 ${
          active
            ? "border-[#9c73ff] bg-[#8f67ff] text-white"
            : "border-white/80 bg-white/58 text-[#707080]"
        }`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
      <span
        className={`w-full truncate text-[9px] font-medium sm:text-[10px] ${
          active ? "text-[#8f67ff]" : "text-[#777482]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function CheckItem({
  icon: Icon,
  label,
  level,
  levelClass,
}: {
  icon: typeof FlaskConical;
  label: string;
  level: string;
  levelClass: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3ecff] text-[#8f67ff] sm:h-8 sm:w-8">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <span className="truncate text-[12px] font-medium text-[#38354a] sm:text-[13px]">
          {label}
        </span>
      </div>
      <span
        className={`shrink-0 text-[11px] font-semibold sm:text-[12px] ${levelClass}`}
      >
        {level}
      </span>
    </div>
  );
}
