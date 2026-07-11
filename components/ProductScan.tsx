"use client";

import {
  CheckCircle2,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const scanPoints = [
  "Détection automatique de la liste INCI",
  "Identification des ingrédients clés",
  "Signalement des éléments à surveiller",
  "Résultat adapté à votre objectif peau",
];

export default function ProductScanShowcase() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#f1e7ff]/70 blur-[130px]" />

      <div className="relative mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[18px] border border-[#eee6f7] bg-[#faf7fd] p-5 sm:p-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[linear-gradient(145deg,#f9f5ff_0%,#fffdfd_100%)]">
              <img
                src="/product-scan.png"
                alt="Aperçu du scan d’un produit skincare avec SkinorAI"
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[12%] right-[12%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#a777ff] to-transparent shadow-[0_0_16px_rgba(139,92,246,0.7)]" />

                <div className="absolute inset-[11%] rounded-[14px] border border-[#b991ff]/60">
                  <span className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-[#8b5cf6]" />
                  <span className="absolute right-0 top-0 h-7 w-7 border-r-2 border-t-2 border-[#8b5cf6]" />
                  <span className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-[#8b5cf6]" />
                  <span className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-[#8b5cf6]" />
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-[12px] border border-white/70 bg-white/88 px-4 py-3 backdrop-blur-xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f1e9ff] text-[#8b5cf6]">
                  <ScanLine className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#211a2e]">
                    Analyse de l’étiquette en cours
                  </p>
                  <p className="mt-1 truncate text-xs text-[#7c7488]">
                    Lecture des ingrédients et préparation du résultat
                  </p>
                </div>

                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#56c98d] shadow-[0_0_0_5px_rgba(86,201,141,0.12)]" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-4 hidden w-[220px] rounded-[14px] border border-[#ece4f5] bg-white p-4 lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7eb3]">
              Analyse détectée
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6f687d]">Ingrédients</span>
                <span className="font-semibold text-[#211a2e]">18</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6f687d]">Points forts</span>
                <span className="font-semibold text-[#19945a]">5</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6f687d]">À surveiller</span>
                <span className="font-semibold text-[#d18429]">2</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e9ddf8] bg-[#fcf9ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b5cf6]">
            <Sparkles className="h-4 w-4" />
            Analyse intelligente
          </div>

          <h2 className="mt-5 max-w-[620px] text-3xl font-semibold tracking-[-0.045em] text-[#1d1829] sm:text-4xl lg:text-[48px] lg:leading-[1.08]">
            Une photo suffit pour comprendre votre produit
          </h2>

          <p className="mt-5 max-w-[620px] text-sm leading-7 text-[#746d82] sm:text-base">
            Prenez une photo claire de l’étiquette. SkinorAI extrait la liste
            d’ingrédients, analyse la formule et vous présente un résultat simple
            à comprendre.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {scanPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-[12px] border border-[#eee6f7] bg-[#fffdfd] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8b5cf6]" />
                <p className="text-sm leading-6 text-[#5f586c]">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-[12px] bg-[#f8f3ff] p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8b5cf6]" />
            <p className="text-sm leading-6 text-[#6e6680]">
              Vos images sont utilisées uniquement pour effectuer l’analyse et
              ne sont pas publiées.
            </p>
          </div>

          <a
            href="/scan"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#19131f] px-6 text-sm font-semibold text-white transition hover:bg-[#30243d]"
          >
            Scanner un produit
            <ScanLine className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}