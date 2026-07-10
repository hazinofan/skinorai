"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleHelp,
  Crown,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type Plan = {
  name: string;
  price: string;
  period: string;
  eyebrow: string;
  description: string;
  badge?: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: string[];
  limits: string[];
};

const plans: Plan[] = [
  {
    name: "Freemium",
    price: "0 MAD",
    period: "",
    eyebrow: "Pour commencer",
    description:
      "Testez SkinorAI gratuitement avec vos premiers scans produits et comprenez rapidement les ingrédients essentiels.",
    cta: "Commencer gratuitement",
    href: "/scan",
    features: [
      "3 scans produits gratuits",
      "Analyse IA des ingrédients",
      "Score de compatibilité",
      "Points forts et ingrédients à surveiller",
      "1 question IA par scan",
      "Accès à la bibliothèque d’ingrédients",
    ],
    limits: ["Historique limité", "Insights avancés non inclus"],
  },
  {
    name: "Pro",
    price: "19 MAD",
    period: "/ mois",
    eyebrow: "Le plus complet",
    description:
      "Débloquez les analyses illimitées, les questions IA et des recommandations plus personnalisées pour votre routine.",
    badge: "Prix de lancement",
    cta: "Passer au Pro",
    href: "/scan",
    featured: true,
    features: [
      "Scans produits illimités",
      "Questions IA illimitées après chaque scan",
      "Historique complet des analyses",
      "Recommandations de routine personnalisées",
      "Insights avancés sur les ingrédients",
      "Accès prioritaire aux nouvelles fonctionnalités",
    ],
    limits: [],
  },
];

const comparisonRows = [
  ["Prix", "0 MAD", "19 MAD / mois"],
  ["Scans produits", "3 scans", "Illimités"],
  ["Questions IA", "1 par scan", "Illimitées"],
  ["Analyse des ingrédients", "Oui", "Oui"],
  ["Score de compatibilité", "Oui", "Oui"],
  ["Historique des scans", "Limité", "Complet"],
  ["Recommandations routine", "Basique", "Personnalisées"],
  ["Skin Insights", "Aperçu", "Avancé"],
  ["Scan du visage", "Bientôt", "Accès prioritaire"],
] as const;

const faqs = [
  {
    question: "Puis-je utiliser SkinorAI gratuitement ?",
    answer:
      "Oui. Le plan Freemium inclut 3 scans produits gratuits pour tester l’analyse IA et comprendre vos premiers ingrédients.",
  },
  {
    question: "Que contient le plan Pro ?",
    answer:
      "Le plan Pro inclut les scans illimités, les questions IA illimitées après chaque scan, l’historique complet et des recommandations plus personnalisées.",
  },
  {
    question: "Est-ce que SkinorAI remplace un dermatologue ?",
    answer:
      "Non. SkinorAI donne des informations éducatives sur les ingrédients et les routines, mais ne remplace pas un avis médical professionnel.",
  },
  {
    question: "Mes photos et mes analyses sont-elles privées ?",
    answer:
      "Les photos sont utilisées pour extraire les ingrédients et générer l’analyse. L’objectif est de garder l’expérience simple, utile et respectueuse de vos données.",
  },
];

function isPositive(value: string) {
  return [
    "Oui",
    "Illimités",
    "Complet",
    "Personnalisées",
    "Avancé",
    "Accès prioritaire",
  ].includes(value);
}

export default function PricingPage() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-pricing='badge']", {
        y: 12,
        opacity: 0,
        duration: 0.4,
        clearProps: "transform,opacity",
      })
        .from(
          "[data-pricing='title'], [data-pricing='subtitle'], [data-pricing='hero-actions']",
          {
            y: 18,
            opacity: 0,
            duration: 0.45,
            stagger: 0.07,
            clearProps: "transform,opacity",
          },
          "-=0.18",
        )
        .from(
          "[data-pricing='card']",
          {
            y: 22,
            opacity: 0,
            scale: 0.985,
            duration: 0.48,
            stagger: 0.09,
            clearProps: "transform,opacity",
          },
          "-=0.22",
        )
        .from(
          "[data-pricing='section']",
          {
            y: 18,
            opacity: 0,
            duration: 0.42,
            stagger: 0.1,
            clearProps: "transform,opacity",
          },
          "-=0.1",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="min-h-screen overflow-x-hidden bg-[#fffdfd] text-[#171729]"
    >
      <section className="relative px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(198,154,255,0.24),transparent_34%),radial-gradient(circle_at_88%_22%,rgba(248,177,217,0.24),transparent_28%),linear-gradient(180deg,#fffdfd_0%,#faf6ff_54%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute left-[-8rem] top-36 -z-10 h-72 w-72 rounded-full bg-[#f6d8eb]/60 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-28 -z-10 h-80 w-80 rounded-full bg-[#d8c7ff]/60 blur-3xl" />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div
              data-pricing="badge"
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#eadcff] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a62df] shadow-[0_12px_35px_rgba(154,98,223,0.12)] backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" />
              Tarifs SkinorAI
            </div>

            <h1
              data-pricing="title"
              className="mt-6 text-[36px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#221d35] sm:text-[52px] lg:text-[64px]"
            >
              Choisissez le plan adapté à votre routine skincare.
            </h1>

            <p
              data-pricing="subtitle"
              className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6f6a82] sm:text-lg"
            >
              Commencez gratuitement, puis passez au Pro pour débloquer les
              scans illimités, les questions IA et les conseils personnalisés.
            </p>

            <div
              data-pricing="hero-actions"
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/scan"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#111018] px-5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(17,16,24,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b1924]"
              >
                Scanner mon premier produit
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#comparaison"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#eadcff] bg-white/75 px-5 text-sm font-semibold text-[#6d4fc9] shadow-[0_12px_30px_rgba(136,101,184,0.10)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
              >
                Comparer les offres
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:items-stretch">
            {plans.map((plan) => (
              <article
                key={plan.name}
                data-pricing="card"
                className={`relative overflow-hidden rounded-[34px] border p-6 shadow-[0_26px_70px_rgba(136,101,184,0.12)] backdrop-blur-xl sm:p-8 ${
                  plan.featured
                    ? "border-[#d7b4f4] bg-[linear-gradient(145deg,#fff8ff_0%,#f8ecff_42%,#fff7fb_100%)]"
                    : "border-[#eee4f7] bg-white/88"
                }`}
              >
                {plan.featured && (
                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e8a6d5]/35 blur-3xl" />
                )}

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a36edb]">
                      {plan.eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#221d35]">
                      {plan.name}
                    </h2>
                  </div>

                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      plan.featured
                        ? "bg-[#111018] text-white shadow-[0_16px_32px_rgba(17,16,24,0.22)]"
                        : "bg-[#f5edff] text-[#9a62df]"
                    }`}
                  >
                    {plan.featured ? (
                      <Crown className="h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                  </span>
                </div>

                {plan.badge && (
                  <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-[#f0d4ff] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#9a56bf] shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-[#d58ae5]" />
                    {plan.badge}
                  </div>
                )}

                <div className="relative mt-7 flex items-end gap-1">
                  <span className="text-[44px] font-semibold leading-none tracking-[-0.05em] text-[#181526] sm:text-[50px]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="pb-1.5 text-base font-medium text-[#7d7792]">
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className="relative mt-4 max-w-xl text-sm leading-7 text-[#6f6a82]">
                  {plan.description}
                </p>

                <Link
                  href={plan.href}
                  className={`relative mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold transition hover:-translate-y-0.5 ${
                    plan.featured
                      ? "bg-gradient-to-r from-[#a56ae2] to-[#e89ac7] text-white shadow-[0_18px_38px_rgba(202,105,179,0.22)]"
                      : "border border-[#eadcff] bg-white text-[#6d4fc9] shadow-[0_12px_30px_rgba(136,101,184,0.10)] hover:bg-[#fbf7ff]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="relative mt-8 grid gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f2e6ff] text-[#9a56bf]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm leading-6 text-[#4f4a63]">
                        {feature}
                      </p>
                    </div>
                  ))}

                  {plan.limits.map((limit) => (
                    <div
                      key={limit}
                      className="flex items-start gap-3 opacity-75"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fff2f5] text-[#d46483]">
                        <X className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm leading-6 text-[#7d7792]">
                        {limit}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <section
            id="comparaison"
            data-pricing="section"
            className="mt-14 scroll-mt-28 overflow-hidden rounded-[34px] border border-[#eee4f7] bg-white/88 shadow-[0_24px_60px_rgba(136,101,184,0.12)] backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0e7fb] px-5 py-5 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a36edb]">
                  Comparaison
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#221d35]">
                  Freemium vs Pro
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#eadcff] bg-[#fbf7ff] px-4 py-2 text-xs font-semibold text-[#7d58d8]">
                <BadgeCheck className="h-4 w-4" />2 offres simples pour démarrer
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#fbf8ff] text-[#7d7792]">
                    <th className="px-5 py-4 font-semibold sm:px-8">
                      Fonctionnalité
                    </th>
                    <th className="px-5 py-4 font-semibold">Freemium</th>
                    <th className="px-5 py-4 font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([feature, free, pro]) => (
                    <tr key={feature} className="border-t border-[#f0e7fb]">
                      <td className="px-5 py-4 font-medium text-[#302a44] sm:px-8">
                        {feature}
                      </td>
                      <td className="px-5 py-4 text-[#6f6a82]">
                        <span className="inline-flex items-center gap-2">
                          {isPositive(free) && (
                            <Check className="h-4 w-4 text-[#3aa66b]" />
                          )}
                          {free}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#302a44]">
                        <span className="inline-flex items-center gap-2 font-semibold">
                          {isPositive(pro) && (
                            <Check className="h-4 w-4 text-[#3aa66b]" />
                          )}
                          {pro}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            data-pricing="section"
            className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start"
          >
            <div className="rounded-[34px] border border-[#eee4f7] bg-[linear-gradient(180deg,#fffefe_0%,#fff8ff_100%)] p-7 shadow-[0_24px_60px_rgba(136,101,184,0.12)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5edff] text-[#9a62df]">
                <CircleHelp className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#221d35]">
                Questions fréquentes
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6f6a82]">
                Tout ce qu’il faut savoir avant de choisir votre plan SkinorAI.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-[28px] border border-[#eee4f7] bg-white/88 p-5 shadow-[0_14px_35px_rgba(136,101,184,0.08)]"
                >
                  <h3 className="flex items-start gap-3 text-base font-semibold text-[#221d35]">
                    <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#b566dd]" />
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f6a82]">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            data-pricing="section"
            className="mt-12 overflow-hidden rounded-[38px] border border-[#eadcff] bg-[linear-gradient(135deg,#111018_0%,#251a35_52%,#6b3f71_100%)] p-7 text-white shadow-[0_30px_80px_rgba(17,16,24,0.22)] sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  Simple, clair, utile
                </div>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Prêt à comprendre ce que vos produits font vraiment à votre
                  peau ?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                  Scannez votre premier produit gratuitement et laissez SkinorAI
                  décoder la formule pour vous.
                </p>
              </div>

              <Link
                href="/scan"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-[#221d35] shadow-[0_18px_38px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5"
              >
                Scanner maintenant
                <Zap className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[#8a8498]">
            <Lock className="h-3.5 w-3.5" />
            SkinorAI fournit des informations éducatives et ne remplace pas un
            avis médical.
          </p>
        </div>
      </section>
    </main>
  );
}
