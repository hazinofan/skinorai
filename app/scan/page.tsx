"use client";

import Image from "next/image";
import {
  Bookmark,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Droplet,
  EyeOff,
  Lightbulb,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
  SquareDashed,
  Target,
  TextCursorInput,
  UploadCloud,
  Zap,
} from "lucide-react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useState } from "react";

const stepLabels = [
  "Objectif peau",
  "Importer l etiquette",
  "Ingredients detectes",
  "Resultat IA",
];

const goals = [
  { label: "Hydratation", image: "/icons/hydratation.png", selected: true },
  { label: "Acne & imperfections", image: "/icons/acne.png" },
  { label: "Reparation de la barriere", image: "/icons/reparation.png" },
  { label: "Rougeurs", image: "/icons/rougeurs.png" },
  { label: "Peau grasse", image: "/icons/hydratation.png" },
  { label: "Routine du matin", image: "/icons/routine-matin.png" },
];

const ingredients = [
  ["Aqua (Water)", "OK"],
  ["Glycerin", "OK"],
  ["Niacinamide", "OK"],
  ["Propanediol", "OK"],
  ["Sodium Hyaluronate", "OK"],
  ["Panthenol", "OK"],
  ["Allantoin", "OK"],
  ["Parfum (Fragrance)", "A surveiller"],
  ["Alcohol Denat.", "A surveiller"],
  ["Citric Acid", "OK"],
];

export default function ScanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const goToStep = (step: number) => setCurrentStep(Math.min(Math.max(step, 1), 4));

  return (
    <main className="min-h-screen bg-[#fbfaff] text-[#111631]">
      <ScanHeader />

      <section className="relative overflow-hidden border-t border-[#ece8f7] bg-[radial-gradient(circle_at_83%_18%,_rgba(149,105,255,0.16),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#fbfaff_42%,_#ffffff_100%)] px-4 pb-8 pt-32 sm:px-6 lg:px-10 lg:pt-36">
        <div className={`pointer-events-none absolute right-[8%] top-12 hidden lg:block ${currentStep === 1 || currentStep === 4 ? "opacity-0" : "opacity-100"}`}>
          <ProductStill />
        </div>

        <div className="mx-auto max-w-[1500px]">
          <div className="text-center">
            <h1 className="text-[36px] font-bold leading-tight sm:text-[48px] lg:text-[58px]">
              Analysez votre premier produit
            </h1>
            <p className="mx-auto mt-3 max-w-[900px] text-[17px] leading-7 text-[#66708f] sm:text-[20px]">
              {currentStep === 3
                ? "Verifiez les ingredients detectes par l IA avant de lancer l analyse complete."
                : "Scannez l etiquette d un produit de soin pour obtenir une analyse simple des ingredients par IA."}
            </p>
          </div>

          <div className="mt-9">
            <ScanProgress currentStep={currentStep} onStepClick={goToStep} />

            <Stepper
              activeStep={currentStep - 1}
              onChangeStep={(event) => setCurrentStep(event.index + 1)}
              linear
              className="scan-prime-stepper mx-auto max-w-[1380px]"
              pt={{
                nav: { className: "!hidden" },
                panelContainer: { className: "mt-12" },
              }}
            >
              <StepperPanel header={stepLabels[0]}>
              <GoalStep />
              </StepperPanel>
              <StepperPanel header={stepLabels[1]}>
              <UploadStep />
              </StepperPanel>
              <StepperPanel header={stepLabels[2]}>
              <IngredientsStep />
              </StepperPanel>
              <StepperPanel header={stepLabels[3]}>
              <ResultStep />
              </StepperPanel>
            </Stepper>

            {currentStep !== 4 && (
              <div
                className={`relative z-20 mx-auto flex max-w-[1380px] ${
                  currentStep === 1
                    ? "pointer-events-none -mt-[94px] justify-start pl-[310px]"
                    : "mt-10 justify-between"
                }`}
              >
                {currentStep !== 1 && (
                  <button
                    type="button"
                    onClick={() => goToStep(currentStep - 1)}
                    className="inline-flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-full border border-[#bda7ff] bg-white px-6 text-base font-semibold text-[#7b56ee] shadow-sm transition hover:bg-[#f7f3ff]"
                  >
                    Retour
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => goToStep(currentStep + 1)}
                  className="pointer-events-auto inline-flex h-12 min-w-[220px] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#8c57eb] to-[#6c35d8] px-8 text-base font-semibold text-white shadow-[0_14px_32px_rgba(114,64,217,0.28)] transition hover:-translate-y-0.5"
                >
                  Continuer
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {currentStep !== 4 && (
            <p className={`${currentStep === 1 ? "mt-2" : "mt-6"} flex items-center justify-center gap-2 text-sm text-[#727a99]`}>
              <Lock className="h-4 w-4" />
              Vos photos sont privees et securisees. Elles ne sont utilisees que pour l analyse.
            </p>
          )}
        </div>
      </section>

      <style jsx global>{`
        .scan-prime-stepper > .p-stepper-nav {
          display: none !important;
        }

        .scan-prime-stepper > .p-stepper-panels {
          margin-top: 0;
          background: transparent;
        }

        .scan-prime-stepper .p-stepper-content,
        .scan-prime-stepper .p-stepper-panels {
          border: 0;
          padding: 0;
        }
      `}</style>
    </main>
  );
}

function ScanHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-[78px] w-full max-w-[1600px] items-center justify-between px-4 sm:h-[84px] sm:px-6 md:px-8 lg:h-[92px] lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="SkinorAI" width={168} height={40} className="h-10 w-auto" priority />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <button className="hidden items-center gap-2 text-sm font-medium text-[#5f5d6b] transition hover:text-[#151522] md:inline-flex">
            <CircleHelp className="h-5 w-5" />
            Aide
          </button>
          <button className="hidden items-center gap-2 text-sm font-medium text-[#5f5d6b] transition hover:text-[#151522] md:inline-flex">
            <Clock3 className="h-5 w-5" />
            Historique
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-[#e5dcff] bg-white/55 px-2 py-1.5 text-xs font-semibold text-[#151522] shadow-[0_10px_26px_rgba(95,70,150,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm">
            <span className="flex h-8 w-8 overflow-hidden rounded-full bg-[#e9ddff] sm:h-9 sm:w-9">
              <Image src="/people.png" alt="Clara" width={36} height={36} className="h-full w-full object-cover object-left" />
            </span>
            <span className="hidden sm:block">Clara</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}

function ScanProgress({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="mx-auto flex max-w-[920px] items-center pb-12">
      {stepLabels.map((label, index) => {
        const step = index + 1;
        const isComplete = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={label} className="contents">
            <button
              type="button"
              onClick={() => onStepClick(step)}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              aria-label={`Aller a l etape ${step}`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-base font-bold shadow-sm transition ${
                  isComplete
                    ? "border-[#7548e8] bg-[#7548e8] text-white"
                    : isActive
                      ? "border-[#7548e8] bg-gradient-to-b from-[#8d5df4] to-[#6c35d8] text-white"
                      : "border-[#d9ddec] bg-white text-[#5f6780]"
                }`}
              >
                {isComplete ? <Check className="h-5 w-5" /> : step}
              </span>
              <span
                className={`absolute left-1/2 top-12 w-44 -translate-x-1/2 text-center text-sm font-semibold ${
                  currentStep >= step ? "text-[#6b3ee4]" : "text-[#66708f]"
                }`}
              >
                {label}
              </span>
            </button>
            {step < stepLabels.length && (
              <span className="mx-2 h-0.5 flex-1 rounded bg-[#dfe2ee]">
                <span
                  className={`block h-full rounded bg-[#7548e8] transition-all ${
                    currentStep > step ? "w-full" : "w-0"
                  }`}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GoalStep() {
  return (
    <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[minmax(0,930px)_410px] lg:items-stretch lg:justify-center">
      <Panel className="min-h-[500px] px-9 pb-28 pt-8">
        <StepTitle number="1" title="Choisissez votre objectif peau" description="Selectionnez votre priorite du moment pour personnaliser l analyse." />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            return (
              <button
                key={goal.label}
                type="button"
                className={`relative flex min-h-[132px] flex-col items-center justify-center rounded-2xl border bg-white px-4 text-center transition hover:-translate-y-0.5 ${
                  goal.selected
                    ? "border-[#8c57eb] bg-[radial-gradient(circle_at_center,_#fbf8ff_0%,_#ffffff_72%)] shadow-[0_16px_40px_rgba(123,86,238,0.12)]"
                    : "border-[#e2e5f0] shadow-[0_8px_24px_rgba(65,58,105,0.04)]"
                }`}
              >
                {goal.selected && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#7947e6] text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span className="flex h-20 w-20 items-center justify-center">
                  <Image
                    src={goal.image}
                    alt=""
                    width={92}
                    height={92}
                    className="h-20 w-20 object-contain drop-shadow-[0_10px_18px_rgba(124,86,238,0.18)]"
                  />
                </span>
                <span className="mt-4 text-base font-semibold">{goal.label}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      <HowItWorksCard />
    </div>
  );
}

function UploadStep() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
      <Panel>
        <StepTitle number="2" title="Importez l etiquette du produit" description="Prenez une photo claire de la liste d ingredients pour que notre IA puisse l analyser." />
        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <button className="flex min-h-[285px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#bda7ff] bg-[#fbf8ff] px-6 text-center">
              <UploadCloud className="h-16 w-16 text-[#9b77f5]" />
              <span className="mt-5 text-xl font-bold">Glissez-deposez votre image ici</span>
              <span className="mt-2 text-lg font-semibold text-[#6f3fe4]">ou cliquez pour parcourir</span>
              <span className="mt-5 text-sm text-[#727a99]">Formats acceptes : JPG, PNG, HEIC</span>
              <span className="mt-5 flex items-center gap-2 text-sm text-[#727a99]">
                <Lock className="h-4 w-4" />
                Vos images sont privees et securisees.
              </span>
            </button>
            <div className="my-5 flex items-center gap-4 text-sm font-semibold text-[#8a91aa]">
              <span className="h-px flex-1 bg-[#e6e8f2]" />
              OU
              <span className="h-px flex-1 bg-[#e6e8f2]" />
            </div>
            <button className="flex w-full items-center gap-4 rounded-2xl border border-[#e3e5f0] bg-white p-4 text-left shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1ebff] text-[#7446e2]">
                <TextCursorInput className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">Ou collez la liste d ingredients manuellement</span>
                <span className="block text-sm text-[#727a99]">Copiez/collez la liste d ingredients depuis l emballage ou le site du produit.</span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <PhotoPreview />
        </div>
      </Panel>

      <TipsCard />
    </div>
  );
}

function IngredientsStep() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
      <Panel>
        <StepTitle number="3" title="Verifiez les ingredients detectes" description="Passez en revue la liste d ingredients extraite par l IA. Modifiez-la si necessaire." />
        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold">Liste des ingredients (INCI)</h2>
              <span className="rounded-full bg-[#f0e9ff] px-3 py-1 text-sm font-semibold text-[#6f3fe4]">10 ingredients detectes</span>
            </div>
            <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
              {ingredients.map(([name, status], index) => (
                <div key={name} className="grid grid-cols-[34px_minmax(0,1fr)_112px] items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef0f7] text-xs font-bold text-[#66708f]">{index + 1}</span>
                  <span className="truncate font-semibold">{name}</span>
                  <span className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status === "OK" ? "bg-[#dff4e7] text-[#15864a]" : "bg-[#fff0d9] text-[#ad6b00]"}`}>
                    {status === "OK" ? <Check className="h-3 w-3" /> : "!"}
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <PhotoPreview small />
        </div>
        <div className="mt-7 border-t border-[#e6e8f2] pt-6">
          <button className="flex w-full items-center gap-4 rounded-2xl border border-[#e3e5f0] bg-[#fbf8ff] p-4 text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0e9ff] text-[#7548e8]">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">Prochaine etape : Resultat IA</span>
              <span className="block text-sm text-[#727a99]">L IA analysera vos ingredients pour vous fournir une evaluation personnalisee.</span>
            </span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Panel>

      <BeforeContinueCard />
    </div>
  );
}

function ResultStep() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold">
              <Sparkles className="h-7 w-7 text-[#7548e8]" />
              AI Analysis Result
            </h2>
            <p className="mt-2 text-lg text-[#59617d]">Here is what we found for your skin goal: <span className="font-semibold text-[#6f3fe4]">Hydration</span></p>
          </div>
          <button className="rounded-full border border-[#bda7ff] px-6 py-3 font-semibold text-[#6f3fe4]">View full report</button>
        </div>

        <section className="grid gap-6 rounded-3xl border border-[#e4e1ef] bg-[#f8f2ff] p-7 sm:grid-cols-[260px_minmax(0,1fr)]">
          <div className="flex items-center justify-center">
            <ShieldCheck className="h-36 w-36 text-[#7548e8]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#59617d]">Overall Result</p>
            <h3 className="mt-1 text-3xl font-bold text-[#6f3fe4]">Good Choice</h3>
            <p className="mt-4 max-w-[460px] text-lg leading-8 text-[#31364f]">This product is beneficial for your hydration goal. It has good hydrating ingredients with a few things to watch.</p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <span className="rounded-full bg-[#ddf7e7] px-5 py-2 text-2xl font-bold text-[#20a45c]">7.8 / 10</span>
              <button className="font-semibold text-[#6f3fe4]">How is this score calculated?</button>
            </div>
          </div>
        </section>

        <ResultBand title="Key positives" count="3" tone="green" items={["Glycerin", "Niacinamide", "Sodium Hyaluronate"]} />
        <ResultBand title="Things to watch" count="2" tone="orange" items={["Parfum (Fragrance)", "Alcohol Denat."]} />

        <section className="rounded-3xl border border-[#ddd9f0] bg-[#fbfbff] p-7">
          <h3 className="flex items-center gap-3 text-xl font-bold text-[#6f3fe4]">
            <Zap className="h-6 w-6" />
            Next best step
          </h3>
          <p className="mt-4 max-w-[620px] text-lg leading-8 text-[#31364f]">Use 2-3 times per week and avoid strong exfoliants on the same day. Monitor how your skin feels.</p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <button className="h-14 rounded-2xl border border-[#bda7ff] bg-white text-lg font-semibold text-[#5f3bd8]">Scan another product</button>
          <button className="h-14 rounded-2xl bg-gradient-to-r from-[#8c57eb] to-[#6c35d8] text-lg font-semibold text-white">
            <Bookmark className="mr-2 inline h-5 w-5" />
            Save result
          </button>
        </div>
      </div>

      <ResultSidebar />
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-[#e1e4ef] bg-white/86 p-7 shadow-[0_18px_45px_rgba(64,56,105,0.08)] backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}

function StepTitle({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#9b75f2] to-pink-200 text-lg font-bold text-white">
        {number}
      </span>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-base text-[#66708f]">{description}</p>
      </div>
    </div>
  );
}

function HowItWorksCard() {
  const items = [
    [Target, "Choisissez votre objectif peau", "Indiquez votre priorite actuelle."],
    [Camera, "Importez l etiquette du produit", "Prenez une photo claire de l etiquette du produit."],
    [Sparkles, "Obtenez l analyse IA", "Recevez une analyse simple et comprehensible des ingredients."],
  ] as const;

  return (
    <Panel className="min-h-[500px] px-8 py-9">
      <h2 className="flex items-center justify-between text-2xl font-bold">
        Comment ca marche
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-10 space-y-9">
        {items.map(([Icon, title, text], index) => (
          <div key={title} className="relative flex gap-5">
            {index < items.length - 1 && (
              <span className="absolute left-[17px] top-11 h-[54px] border-l-2 border-dashed border-[#c7cadd]" />
            )}
            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#b99df7] to-[#7548e8] font-bold text-white">{index + 1}</span>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#e6ddff] bg-[#f5f0ff] text-[#7548e8]">
              <Icon className="h-8 w-8" />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="mt-2 block leading-6 text-[#66708f]">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TipsCard() {
  const tips = [
    [Lightbulb, "Bonne luminosite", "Prenez la photo dans un endroit bien eclaire."],
    [SquareDashed, "Centree et lisible", "Assurez-vous que toute la liste d ingredients est visible et nette."],
    [EyeOff, "Evitez le flou", "Stabilisez votre appareil et verifiez la mise au point avant d envoyer."],
  ] as const;

  return (
    <Panel>
      <h2 className="flex items-center justify-between text-2xl font-bold">
        Conseils photo
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-10 space-y-9">
        {tips.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#e6ddff] bg-[#f5f0ff] text-[#7548e8]">
              <Icon className="h-8 w-8" />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="mt-2 block leading-6 text-[#66708f]">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BeforeContinueCard() {
  const items = [
    [ClipboardCheck, "Verifiez que la liste est complete", "Assurez-vous que tous les ingredients presents sur l etiquette sont detectes."],
    [TextCursorInput, "Corrigez si necessaire", "L IA peut faire des erreurs de lecture. Modifiez les noms mal orthographies."],
    [ShieldCheck, "Continuez en toute confiance", "Si tout correspond a l etiquette, vous pouvez lancer l analyse."],
  ] as const;

  return (
    <Panel>
      <h2 className="flex items-center justify-between text-2xl font-bold">
        Avant de continuer
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-8 divide-y divide-[#e6e8f2]">
        {items.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-5 py-6 first:pt-0 last:pb-0">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#e6ddff] bg-[#f5f0ff] text-[#7548e8]">
              <Icon className="h-8 w-8" />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="mt-2 block leading-6 text-[#66708f]">{text}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4 rounded-2xl border border-[#e6e8f2] bg-[#fbfaff] p-4 text-[#66708f]">
        <Lock className="h-6 w-6 shrink-0" />
        <p>Vos donnees restent privees et securisees. Elles ne sont utilisees que pour l analyse.</p>
      </div>
    </Panel>
  );
}

function PhotoPreview({ small = false }: { small?: boolean }) {
  return (
    <div>
      <h3 className="mb-5 text-center font-bold">{small ? "Apercu de l etiquette" : "Apercu de votre photo"}</h3>
      <div className={`mx-auto rounded-2xl bg-[#cabaa3] p-7 shadow-inner ${small ? "h-[170px] w-[210px]" : "h-[290px] w-[235px]"}`}>
        <div className="h-full rounded bg-white/85 p-4 text-[12px] font-semibold leading-5 text-[#29251f]">
          <p>INGREDIENTS :</p>
          <p>Aqua (Water), Glycerin, Niacinamide, Propanediol, Sodium Hyaluronate, Panthenol, Allantoin, Parfum (Fragrance), Alcohol Denat, Citric Acid.</p>
        </div>
      </div>
      {small && <p className="mx-auto mt-4 max-w-[220px] text-center text-sm text-[#66708f]">Vous pouvez modifier la liste si necessaire.</p>}
    </div>
  );
}

function ProductStill() {
  return (
    <div className="relative h-56 w-72">
      <Image src="/cleanser.png" alt="" width={150} height={180} className="absolute right-20 top-0 h-44 w-auto object-contain drop-shadow-xl" />
      <Image src="/cleaner.png" alt="" width={160} height={160} className="absolute bottom-2 right-0 h-32 w-auto object-contain drop-shadow-xl" />
      <Sparkles className="absolute left-4 top-10 h-7 w-7 text-[#bba1ff]" />
    </div>
  );
}

function ResultBand({ title, count, tone, items }: { title: string; count: string; tone: "green" | "orange"; items: string[] }) {
  const isGreen = tone === "green";
  return (
    <section className={`rounded-3xl border p-6 ${isGreen ? "border-[#dfeee6] bg-[#fcfffd]" : "border-[#f3e5cf] bg-[#fffdf9]"}`}>
      <h3 className="flex items-center gap-3 text-xl font-bold">
        <CheckCircle2 className={`h-7 w-7 ${isGreen ? "text-[#55c987]" : "text-[#ffae4f]"}`} />
        {title}
        <span className={`rounded-full px-3 py-1 text-sm ${isGreen ? "bg-[#ddf7e7] text-[#20a45c]" : "bg-[#fff0d9] text-[#ad6b00]"}`}>{count}</span>
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-[#e5e7ef] bg-white p-4 font-semibold">{item}</div>
        ))}
      </div>
    </section>
  );
}

function ResultSidebar() {
  return (
    <aside className="space-y-5">
      <Panel>
        <h3 className="text-xl font-bold">Product summary</h3>
        <div className="mt-5 flex gap-5">
          <Image src="/cleanser.png" alt="The Ordinary serum" width={72} height={110} className="h-28 w-auto object-contain" />
          <div>
            <p className="text-lg font-bold">The Ordinary</p>
            <p className="mt-2 text-lg font-bold leading-7">Hyaluronic Acid 2% + B5</p>
            <p className="mt-4 text-[#66708f]">Serum - 30ml</p>
          </div>
        </div>
      </Panel>
      <Panel>
        <h3 className="text-xl font-bold">Your skin goal</h3>
        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-3 font-semibold"><Droplet className="h-6 w-6 text-[#7548e8]" /> Hydration</span>
          <button className="rounded-full border border-[#e2dcff] px-4 py-2 text-sm font-semibold text-[#6f3fe4]">Change</button>
        </div>
      </Panel>
      <Panel>
        <h3 className="flex items-center gap-2 text-xl font-bold text-[#6f3fe4]"><Lightbulb className="h-5 w-5" /> Tips for best results</h3>
        <ul className="mt-5 space-y-3 leading-7 text-[#4e536c]">
          <li>Apply on slightly damp skin.</li>
          <li>Follow with a moisturizer to lock in hydration.</li>
          <li>Use SPF in the morning.</li>
        </ul>
      </Panel>
      <Panel>
        <h3 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="h-5 w-5 text-[#7548e8]" /> Ask AI about this product</h3>
        <p className="mt-4 leading-7 text-[#66708f]">Ask anything about ingredients, compatibility, usage, and more.</p>
        <button className="mt-5 w-full rounded-2xl bg-[#f3edff] p-4 text-left font-semibold text-[#6f3fe4]">Can I use this with retinol?</button>
        <div className="mt-5 flex rounded-2xl border border-[#e3e5f0] bg-white p-2">
          <input className="min-w-0 flex-1 px-3 outline-none" placeholder="Ask your question..." />
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7548e8] text-white">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </Panel>
    </aside>
  );
}
