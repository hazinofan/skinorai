"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Droplet,
  EyeOff,
  Lightbulb,
  Lock,
  LoaderCircle,
  Pencil,
  Paperclip,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  SquareDashed,
  Target,
  TextCursorInput,
  UploadCloud,
  UserRound,
  X,
  Zap,
  MoreVertical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

const stepLabels = [
  "Objectif peau",
  "Importer l etiquette",
  "Ingredients detectes",
  "Resultat IA",
];

type SkinGoal = {
  id: string;
  label: string;
  image: string;
  accentLabel: string;
  icon: LucideIcon;
  positiveMatches: string[];
  tips: string[];
  questions: string[];
  nextStep: string;
};

const goals: SkinGoal[] = [
  {
    id: "hydration",
    label: "Hydratation",
    image: "/icons/hydratation.png",
    accentLabel: "hydrater et repulper",
    icon: Droplet,
    positiveMatches: ["glycerin", "hyaluron", "panthenol", "betaine", "urea", "aloe"],
    tips: ["Appliquez sur peau legerement humide.", "Scellez ensuite avec une creme hydratante.", "Utilisez un SPF le matin."],
    questions: ["Puis-je utiliser ce produit avec du retinol ?", "Est-ce un bon choix pour une peau deshydratee ?"],
    nextStep: "Utilisez 2 a 3 fois par semaine au debut, puis augmentez si votre peau reste confortable.",
  },
  {
    id: "acne",
    label: "Acne & imperfections",
    image: "/icons/acne.png",
    accentLabel: "cibler les imperfections",
    icon: Sparkles,
    positiveMatches: ["salicy", "niacinamide", "zinc", "sulfur", "tea tree", "azela"],
    tips: ["Introduisez le produit progressivement.", "Evitez de le superposer avec trop d actifs irritants.", "Hydratez bien la peau pour proteger la barriere."],
    questions: ["Ce produit aide-t-il pour les boutons inflammatoires ?", "Puis-je l utiliser le meme jour qu un exfoliant ?"],
    nextStep: "Commencez doucement et observez si la formule aide sans augmenter la sensibilite.",
  },
  {
    id: "barrier",
    label: "Reparation de la barriere",
    image: "/icons/reparation.png",
    accentLabel: "renforcer la barriere cutanee",
    icon: ShieldCheck,
    positiveMatches: ["ceramide", "panthenol", "squalane", "cholesterol", "centella", "oat"],
    tips: ["Favorisez une routine simple pendant quelques jours.", "Evitez les exfoliants forts si la peau est reactive.", "Appliquez sur peau propre avec des gestes doux."],
    questions: ["Est-ce adapte apres une irritation ?", "Ce produit soutient-il une barriere abimee ?"],
    nextStep: "Associez-le a des formules simples et evitez les actifs trop puissants le meme jour.",
  },
  {
    id: "redness",
    label: "Rougeurs",
    image: "/icons/rougeurs.png",
    accentLabel: "apaiser les rougeurs",
    icon: Lightbulb,
    positiveMatches: ["allantoin", "centella", "panthenol", "bisabolol", "aloe", "oat"],
    tips: ["Testez d abord sur une petite zone.", "Evitez l eau trop chaude apres application.", "Associez-le a une routine tres douce."],
    questions: ["Ce produit convient-il a une peau sensible ?", "Y a-t-il des ingredients qui peuvent aggraver les rougeurs ?"],
    nextStep: "Si votre peau reagit facilement, utilisez-le seul pendant quelques jours pour evaluer la tolerance.",
  },
  {
    id: "oily",
    label: "Peau grasse",
    image: "/icons/hydratation.png",
    accentLabel: "equilibrer l exces de sebum",
    icon: Target,
    positiveMatches: ["niacinamide", "zinc", "salicy", "green tea", "clay", "tea tree"],
    tips: ["Appliquez en fine couche pour eviter l effet lourd.", "Ne sautez pas l hydratation meme si la peau est grasse.", "Surveillez si le produit laisse un fini confortable."],
    questions: ["Ce produit risque-t-il de boucher les pores ?", "Est-ce une bonne option pour limiter la brillance ?"],
    nextStep: "Observez le fini sur la zone T et combinez-le avec une routine legere et non comedogene.",
  },
  {
    id: "morning",
    label: "Routine du matin",
    image: "/icons/routine-matin.png",
    accentLabel: "optimiser la routine du matin",
    icon: Zap,
    positiveMatches: ["vitamin c", "niacinamide", "caffeine", "green tea", "hyaluron", "glycerin"],
    tips: ["Superposez du plus leger au plus riche.", "Terminez toujours par un SPF.", "Gardez la routine simple pour gagner du temps le matin."],
    questions: ["Ce produit se combine-t-il bien avec la vitamine C ?", "Est-ce une bonne etape avant la creme solaire ?"],
    nextStep: "Utilisez-le dans une routine courte et verifiez qu il se superpose bien sous la protection solaire.",
  },
];

type IngredientStatus = "OK" | "A surveiller";

type IngredientItem = {
  name: string;
  status: IngredientStatus;
};

type UploadedImage = {
  id: string;
  file: File;
  url: string;
};

type ResultDetail = {
  name: string;
  note: string;
};

type AnalysisResult = {
  score: number;
  verdict: string;
  summary: string;
  positives: ResultDetail[];
  watchouts: ResultDetail[];
  tips: string[];
  questions: string[];
  nextStep: string;
};

const defaultIngredients: IngredientItem[] = [
  { name: "Aqua (Water)", status: "OK" },
  { name: "Glycerin", status: "OK" },
  { name: "Niacinamide", status: "OK" },
  { name: "Propanediol", status: "OK" },
  { name: "Sodium Hyaluronate", status: "OK" },
  { name: "Panthenol", status: "OK" },
  { name: "Allantoin", status: "OK" },
  { name: "Parfum (Fragrance)", status: "A surveiller" },
  { name: "Alcohol Denat.", status: "A surveiller" },
  { name: "Citric Acid", status: "OK" },
];

const watchTerms = ["parfum", "fragrance", "alcohol", "denat", "essential oil", "citric acid"];

function buildIngredientItems(names: string[]): IngredientItem[] {
  return names.map((name) => {
    const normalized = name.toLowerCase();
    const shouldWatch = watchTerms.some((term) => normalized.includes(term));
    return {
      name,
      status: shouldWatch ? "A surveiller" : "OK",
    };
  });
}

function parseIngredientText(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatProductName(imageName?: string | null) {
  if (!imageName) {
    return "Produit analyse";
  }

  return imageName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildIngredientNote(name: string, goalId: string, status: IngredientStatus) {
  const normalized = name.toLowerCase();

  if (status === "A surveiller") {
    if (normalized.includes("fragrance") || normalized.includes("parfum")) {
      return "Peut etre irritant sur les peaux sensibles.";
    }

    if (normalized.includes("alcohol") || normalized.includes("denat")) {
      return "Peut etre desschant selon la sensibilite de votre peau.";
    }

    if (normalized.includes("essential oil")) {
      return "A surveiller si votre peau reagit facilement.";
    }

    return "Ingredient a surveiller selon votre tolerance.";
  }

  const goalSpecificNotes: Record<string, string> = {
    hydration: "Aide a soutenir l hydratation cutanee.",
    acne: "Peut aider a garder une routine plus ciblee sur les imperfections.",
    barrier: "Soutient une routine orientee confort et barriere.",
    redness: "Interesse pour une routine plus apaisante.",
    oily: "Peut convenir a une routine pour peau grasse.",
    morning: "S integre bien dans une routine du matin simple.",
  };

  return goalSpecificNotes[goalId] ?? "Point positif pour cet objectif peau.";
}

function buildAnalysisResult(goal: SkinGoal, ingredientItems: IngredientItem[]): AnalysisResult {
  const positivesBase = ingredientItems.filter((item) => item.status === "OK");
  const watchoutsBase = ingredientItems.filter((item) => item.status === "A surveiller");

  const matchedPositives = positivesBase.filter((item) =>
    goal.positiveMatches.some((keyword) => item.name.toLowerCase().includes(keyword))
  );

  const positives = (matchedPositives.length > 0 ? matchedPositives : positivesBase)
    .slice(0, 3)
    .map((item) => ({
      name: toTitleCase(item.name),
      note: buildIngredientNote(item.name, goal.id, item.status),
    }));

  const watchouts = watchoutsBase.slice(0, 3).map((item) => ({
    name: toTitleCase(item.name),
    note: buildIngredientNote(item.name, goal.id, item.status),
  }));

  const rawScore = 6.2 + positives.length * 0.9 - watchouts.length * 0.55;
  const score = Number(Math.min(9.6, Math.max(4.2, rawScore)).toFixed(1));

  let verdict = "Good Choice";
  if (score >= 8.5) {
    verdict = "Excellent Match";
  } else if (score < 6.5) {
    verdict = "Mixed Match";
  }

  const summary =
    positives.length > 0
      ? `Ce produit semble globalement adapte pour ${goal.accentLabel}. Il presente ${positives.length} point${positives.length > 1 ? "s" : ""} positif${positives.length > 1 ? "s" : ""}${watchouts.length > 0 ? ` avec ${watchouts.length} element${watchouts.length > 1 ? "s" : ""} a surveiller` : ""}.`
      : `L analyse montre quelques points utiles pour ${goal.accentLabel}, mais la formule reste a verifier selon votre tolerance.`;

  return {
    score,
    verdict,
    summary,
    positives,
    watchouts,
    tips: goal.tips,
    questions: goal.questions,
    nextStep: goal.nextStep,
  };
}

export default function ScanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0].id);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [manualIngredientsInput, setManualIngredientsInput] = useState("");
  const [ingredientItems, setIngredientItems] = useState<IngredientItem[]>([]);
  const [stepTwoError, setStepTwoError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResultReady, setIsResultReady] = useState(false);
  const uploadedImagesRef = useRef<UploadedImage[]>([]);

  const hasManualIngredients = parseIngredientText(manualIngredientsInput).length > 0;
  const hasStepTwoData = uploadedImages.length > 0 || hasManualIngredients;
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? goals[0];
  const goToStep = (step: number) => {
    const nextStep = Math.min(Math.max(step, 1), 4);

    if (nextStep >= 3 && currentStep <= 2 && !hasStepTwoData) {
      setStepTwoError("Ajoutez au moins une image ou collez vos ingredients avant de continuer.");
      return;
    }

    setStepTwoError("");
    setCurrentStep(nextStep);
  };
  const selectedImage = uploadedImages.find((image) => image.id === selectedImageId) ?? uploadedImages[0] ?? null;
  const analysisResult = buildAnalysisResult(selectedGoal, ingredientItems);

  const resetFlow = () => {
    uploadedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    uploadedImagesRef.current = [];
    setUploadedImages([]);
    setSelectedImageId(null);
    setManualIngredientsInput("");
    setIngredientItems([]);
    setStepTwoError("");
    setIsAnalyzing(false);
    setIsResultReady(false);
    setCurrentStep(1);
  };

  useEffect(() => {
    uploadedImagesRef.current = uploadedImages;
  }, [uploadedImages]);

  useEffect(() => {
    return () => {
      uploadedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  useEffect(() => {
    if (currentStep !== 4 || isResultReady) {
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    const timeout = window.setTimeout(() => {
      setIsAnalyzing(false);
      setIsResultReady(true);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [currentStep, isResultReady]);

  const addFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!validFiles.length) {
      return;
    }

    const newImages = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
    setSelectedImageId((prev) => prev ?? newImages[0]?.id ?? null);
    setStepTwoError("");
    setIngredientItems((prev) => (prev.length > 0 ? prev : defaultIngredients));
  };

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      const nextImages = prev.filter((image) => image.id !== imageId);

      setSelectedImageId((currentSelectedId) => {
        if (currentSelectedId !== imageId) {
          return currentSelectedId;
        }

        return nextImages[0]?.id ?? null;
      });

      if (nextImages.length === 0 && !hasManualIngredients) {
        setIngredientItems([]);
      }

      return nextImages;
    });
  };

  const saveManualIngredients = () => {
    const parsedIngredients = parseIngredientText(manualIngredientsInput);
    if (!parsedIngredients.length) {
      return;
    }

    setIngredientItems(buildIngredientItems(parsedIngredients));
    setIsManualDialogOpen(false);
    setStepTwoError("");
    setCurrentStep(3);
  };

  if (isResultReady) {
    return (
      <ResultWorkspace
        analysisResult={analysisResult}
        currentStep={currentStep}
        selectedGoal={selectedGoal}
        selectedImage={selectedImage}
        onChangeGoal={() => {
          setIsResultReady(false);
          setCurrentStep(1);
        }}
        onScanAnother={resetFlow}
      />
    );
  }

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
            <ScanProgress currentStep={currentStep} onStepClick={goToStep} selectedGoalLabel={selectedGoal.label} />

            <Stepper
              activeStep={currentStep - 1}
              onChangeStep={(event) => goToStep(event.index + 1)}
              linear
              className="scan-prime-stepper mx-auto max-w-[1380px]"
              pt={{
                nav: { className: "!hidden" },
                panelContainer: { className: "mt-12" },
              }}
            >
              <StepperPanel header={stepLabels[0]}>
                <GoalStep selectedGoalId={selectedGoalId} onSelectGoal={setSelectedGoalId} />
              </StepperPanel>
              <StepperPanel header={stepLabels[1]}>
                <UploadStep
                  uploadedImages={uploadedImages}
                  selectedImage={selectedImage}
                  stepTwoError={stepTwoError}
                  onAddFiles={addFiles}
                  onSelectImage={setSelectedImageId}
                  onRemoveImage={removeImage}
                  onOpenManualDialog={() => setIsManualDialogOpen(true)}
                />
              </StepperPanel>
              <StepperPanel header={stepLabels[2]}>
                <IngredientsStep
                  ingredientItems={ingredientItems}
                  selectedImage={selectedImage}
                  onOpenManualDialog={() => setIsManualDialogOpen(true)}
                  onContinue={() => goToStep(4)}
                />
              </StepperPanel>
              <StepperPanel header={stepLabels[3]}>
                <AnalysisLoadingStep selectedGoal={selectedGoal} ingredientCount={ingredientItems.length} isAnalyzing={isAnalyzing} />
              </StepperPanel>
            </Stepper>

            {currentStep !== 4 && (
              <div
                className={`relative z-20 mx-auto flex max-w-[1380px] ${currentStep === 1
                  ? "-mt-[94px] justify-start pl-[310px]"
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
                  disabled={currentStep === 2 && !hasStepTwoData}
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#9b75f2] to-pink-300 px-14 py-2.5 tracking-tighter text-white ${currentStep === 2 && !hasStepTwoData ? "cursor-not-allowed opacity-55" : "cursor-pointer"
                    }`}
                >
                  <span
                    className="absolute h-0 w-0 rounded-full bg-[#8d68ef] transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"
                  ></span>
                  <span className="absolute bottom-0 left-0 h-full -ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-auto h-full opacity-100 object-stretch"
                      viewBox="0 0 487 487"
                    >
                      <path
                        fillOpacity=".1"
                        fillRule="nonzero"
                        fill="#FFF"
                        d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="object-cover w-full h-full"
                      viewBox="0 0 487 487"
                    >
                      <path
                        fillOpacity=".1"
                        fillRule="nonzero"
                        fill="#FFF"
                        d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                      ></path>
                    </svg>
                  </span>
                  <span
                    className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-white/30"
                  ></span>
                  <span className="relative text-base font-semibold">Continuer </span>
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

      {isManualDialogOpen && (
        <ManualIngredientsDialog
          value={manualIngredientsInput}
          onChange={setManualIngredientsInput}
          onClose={() => setIsManualDialogOpen(false)}
          onSave={saveManualIngredients}
        />
      )}

      <style jsx global>{`
        @keyframes analysis-fill {
          0% {
            transform: scaleX(0.18);
            opacity: 0.8;
          }

          65% {
            transform: scaleX(0.82);
            opacity: 1;
          }

          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

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
  selectedGoalLabel,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
  selectedGoalLabel: string;
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
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-base font-bold shadow-sm transition ${isComplete
                  ? "border-[#7548e8] bg-[#7548e8] text-white"
                  : isActive
                    ? "border-[#7548e8] bg-gradient-to-b from-[#8d5df4] to-[#6c35d8] text-white"
                    : "border-[#d9ddec] bg-white text-[#5f6780]"
                  }`}
              >
                {isComplete ? <Check className="h-5 w-5" /> : step}
              </span>
              <span
                className={`absolute left-1/2 top-12 w-44 -translate-x-1/2 text-center text-sm font-semibold ${currentStep >= step ? "text-[#6b3ee4]" : "text-[#66708f]"
                  }`}
              >
                {label}
                {step === 1 && (
                  <span className="mt-1 block text-xs font-medium text-[#7f86a3]">{selectedGoalLabel}</span>
                )}
              </span>
            </button>
            {step < stepLabels.length && (
              <span className="mx-2 h-0.5 flex-1 rounded bg-[#dfe2ee]">
                <span
                  className={`block h-full rounded bg-[#7548e8] transition-all ${currentStep > step ? "w-full" : "w-0"
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

function GoalStep({
  selectedGoalId,
  onSelectGoal,
}: {
  selectedGoalId: string;
  onSelectGoal: (goalId: string) => void;
}) {
  return (
    <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[minmax(0,930px)_410px] lg:items-stretch lg:justify-center mt-8">
      <Panel className="min-h-[500px] px-9 pb-28 pt-8">
        <StepTitle number="1" title="Choisissez votre objectif peau" description="Selectionnez votre priorite du moment pour personnaliser l analyse." />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <button
                key={goal.label}
                type="button"
                onClick={() => onSelectGoal(goal.id)}
                className={`relative flex min-h-[132px] flex-col cursor-pointer py-4 items-center justify-center rounded-2xl border bg-white px-4 text-center transition hover:-translate-y-0.5 ${isSelected
                  ? "border-[#8c57eb] bg-[radial-gradient(circle_at_center,_#fbf8ff_0%,_#ffffff_72%)] shadow-[0_16px_40px_rgba(123,86,238,0.12)]"
                  : "border-[#e2e5f0] shadow-[0_8px_24px_rgba(65,58,105,0.04)]"
                  }`}
              >
                {isSelected && (
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
                <span className="mt-1 text-sm text-[#7a819e]">{goal.accentLabel}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      <HowItWorksCard />
    </div>
  );
}

function UploadStep({
  uploadedImages,
  selectedImage,
  stepTwoError,
  onAddFiles,
  onSelectImage,
  onRemoveImage,
  onOpenManualDialog,
}: {
  uploadedImages: UploadedImage[];
  selectedImage: UploadedImage | null;
  stepTwoError: string;
  onAddFiles: (files: FileList | File[]) => void;
  onSelectImage: (imageId: string) => void;
  onRemoveImage: (imageId: string) => void;
  onOpenManualDialog: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      onAddFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files?.length) {
      onAddFiles(event.dataTransfer.files);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] mt-10">
      <Panel>
        <StepTitle number="2" title="Importez l etiquette du produit" description="Prenez une photo claire de la liste d ingredients pour que notre IA puisse l analyser." />
        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/heic,image/heif,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer min-h-[285px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${isDragging
                ? "border-[#8f68f2] bg-[#f4edff] hover:bg-[#f0e8ff] hover:duration-500 hover:transition-all shadow-[0_22px_45px_rgba(123,86,238,0.14)]"
                : "border-[#bda7ff] bg-[#fbf8ff] hover:bg-[#f0e8ff] hover:duration-500 hover:transition-all"
                }`}
            >
              <UploadCloud className="h-16 w-16 text-[#9b77f5]" />
              <span className="mt-5 text-xl font-bold">Glissez-deposez votre image ici</span>
              <span className="mt-2 text-lg font-semibold text-[#6f3fe4]">ou cliquez pour parcourir</span>
              <span className="mt-5 text-sm text-[#727a99]">Formats acceptes : JPG, PNG, HEIC</span>
              <span className="mt-5 flex items-center gap-2 text-sm text-[#727a99]">
                <Lock className="h-4 w-4" />
                Vos images sont privees et securisees.
              </span>
            </button>
            {uploadedImages.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#e6defa] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#161933]">Images ajoutees</p>
                    <p className="text-sm text-[#727a99]">{uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} prete{uploadedImages.length > 1 ? "s" : ""} pour l analyse.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dfd2ff] bg-[#faf6ff] px-4 py-2 text-sm font-semibold text-[#7548e8] transition hover:bg-[#f3edff]"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter des images
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {uploadedImages.map((image) => {
                    const isSelected = selectedImage?.id === image.id;
                    return (
                      <div
                        key={image.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-[#faf8ff] ${isSelected ? "border-[#8d68ef] ring-2 ring-[#eadfff]" : "border-[#ece5ff]"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectImage(image.id)}
                          className="block w-full text-left"
                        >
                          <div className="relative h-28 w-full bg-[#f3ecff]">
                            <Image src={image.url} alt={image.file.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="p-3">
                            <p className="truncate text-sm font-semibold text-[#1d2140]">{image.file.name}</p>
                            <p className="mt-1 text-xs text-[#727a99]">{Math.max(1, Math.round(image.file.size / 1024))} KB</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveImage(image.id)}
                          className="absolute right-2 cursor-pointer top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#4f5473] shadow-sm transition hover:bg-white"
                          aria-label={`Supprimer ${image.file.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="my-5 flex items-center gap-4 text-sm font-semibold text-[#8a91aa]">
              <span className="h-px flex-1 bg-[#e6e8f2]" />
              OU
              <span className="h-px flex-1 bg-[#e6e8f2]" />
            </div>
            <button
              type="button"
              onClick={onOpenManualDialog}
              className="flex w-full items-center gap-4 rounded-2xl border border-[#e3e5f0] bg-white p-4 text-left shadow-sm transition hover:border-[#cfbef8] hover:bg-[#fcfaff]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1ebff] text-[#7446e2]">
                <TextCursorInput className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1 cursor-pointer">
                <span className="block font-bold">Ou collez la liste d ingredients manuellement</span>
                <span className="block text-sm text-[#727a99]">Copiez/collez la liste d ingredients depuis l emballage ou le site du produit.</span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </button>
            {stepTwoError && (
              <p className="mt-4 rounded-2xl border border-[#ffd7dd] bg-[#fff7f8] px-4 py-3 text-sm font-medium text-[#c6405f]">
                {stepTwoError}
              </p>
            )}
          </div>
          <PhotoPreview selectedImage={selectedImage} imageCount={uploadedImages.length} />
        </div>
      </Panel>

      <TipsCard />
    </div>
  );
}

function IngredientsStep({
  ingredientItems,
  selectedImage,
  onOpenManualDialog,
  onContinue,
}: {
  ingredientItems: IngredientItem[];
  selectedImage: UploadedImage | null;
  onOpenManualDialog: () => void;
  onContinue: () => void;
}) {
  const midpoint = Math.ceil(ingredientItems.length / 2);
  const leftColumn = ingredientItems.slice(0, midpoint);
  const rightColumn = ingredientItems.slice(midpoint);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
      <Panel className="px-8 py-7">
        <StepTitle number="3" title="Verifiez les ingredients detectes" description="Passez en revue la liste d ingredients extraite par l IA. Modifiez-la si necessaire." />
        <div className="mt-7 overflow-hidden rounded-[30px] border border-[#ece7fb] bg-white">
          <div className="grid gap-8 px-6 py-6 xl:grid-cols-1 xl:px-7">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-[#171b36]">Liste des ingredients (INCI)</h2>
                <span className="rounded-full bg-[#f2ebff] px-3 py-1 text-sm font-semibold text-[#7c57eb]">{ingredientItems.length} ingredients detectes</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <IngredientColumn items={leftColumn} startIndex={0} />
                <IngredientColumn items={rightColumn} startIndex={leftColumn.length} />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-[#f0ecfa] pt-6">
                <button
                  type="button"
                  onClick={onOpenManualDialog}
                  className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-full border border-[#dccdfd] bg-white px-6 text-sm font-semibold text-[#7b57ea] transition hover:bg-[#fbf8ff]"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier la liste
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8d60ef] to-pink-300 px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(116,69,232,0.24)] transition hover:shadow-[0_18px_40px_rgba(116,69,232,0.32)]"
                >
                  Continuer l analyse
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* <div className="border-l border-[#f1edf8] pl-0 xl:pl-7">
              <h3 className="text-center text-base font-bold text-[#1d2140]">Apercu de l etiquette</h3>
              <PhotoPreview selectedImage={selectedImage} small imageCount={selectedImage ? 1 : 0} />
            </div> */}
          </div>

          <div className="border-t border-[#f0ecfa] p-4 sm:p-5">
            <button className="flex cursor-pointer w-full items-center gap-4 rounded-[22px] border border-[#ebe5fb] bg-[linear-gradient(90deg,_rgba(249,246,255,0.98)_0%,_rgba(244,239,255,0.98)_100%)] p-4 text-left shadow-[0_8px_20px_rgba(124,87,235,0.06)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#7d57ea] shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-[#171b36]">Prochaine etape : Resultat IA</span>
                <span className="mt-1 block text-sm text-[#727a99]">L IA analysera vos ingredients pour vous fournir une evaluation personnalisee.</span>
              </span>
              <ChevronRight className="h-5 w-5 text-[#7d57ea]" />
            </button>
          </div>
        </div>
      </Panel>

      <BeforeContinueCard />
    </div>
  );
}

function IngredientColumn({
  items,
  startIndex,
}: {
  items: IngredientItem[];
  startIndex: number;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-4 grid grid-cols-[28px_minmax(0,1fr)_112px] items-center gap-3 px-1 text-xs font-semibold text-[#9098b2]">
        <span />
        <span>Ingredient</span>
        <span>Statut</span>
      </div>
      <div className="space-y-3">
        {items.map(({ name, status }, index) => (
          <div key={`${startIndex + index}-${name}`} className="grid grid-cols-[28px_minmax(0,1fr)_112px] items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eef0f7] text-[11px] font-bold text-[#66708f]">
              {startIndex + index + 1}
            </span>
            <span className="truncate text-[15px] font-semibold text-[#1c2140]">{name}</span>
            <span className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status === "OK" ? "bg-[#dff4e7] text-[#15864a]" : "bg-[#fff0d9] text-[#ad6b00]"}`}>
              {status === "OK" ? <Check className="h-3 w-3" /> : <CircleHelp className="h-3 w-3" />}
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisLoadingStep({
  selectedGoal,
  ingredientCount,
  isAnalyzing,
}: {
  selectedGoal: SkinGoal;
  ingredientCount: number;
  isAnalyzing: boolean;
}) {
  const GoalIcon = selectedGoal.icon;

  return (
    <div className="mx-auto mt-14 max-w-[980px]">
      <Panel className="overflow-hidden border-[#e8e0fb] bg-[radial-gradient(circle_at_top,_rgba(158,118,255,0.16),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(250,246,255,0.98)_100%)] px-8 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/90 text-[#7448e8] shadow-[0_18px_45px_rgba(116,72,232,0.15)]">
            {isAnalyzing ? <LoaderCircle className="h-10 w-10 animate-spin" /> : <Sparkles className="h-10 w-10" />}
          </span>

          <h2 className="mt-8 text-3xl font-bold text-[#151833] sm:text-4xl">Analyse IA en cours</h2>
          <p className="mt-4 max-w-[640px] text-base leading-8 text-[#68708b] sm:text-lg">
            Nous analysons {ingredientCount} ingredient{ingredientCount > 1 ? "s" : ""} pour verifier si ce produit correspond a votre objectif peau: {selectedGoal.label}.
          </p>

          <div className="mt-10 grid w-full gap-4 md:grid-cols-3">
            <LoadingInfoCard icon={GoalIcon} title="Objectif choisi" text={selectedGoal.label} />
            <LoadingInfoCard icon={ClipboardCheck} title="Ingredients verifies" text={`${ingredientCount} elements confirmes`} />
            <LoadingInfoCard icon={Sparkles} title="Etape actuelle" text="Generation du resultat personnalise" />
          </div>

          <div className="mt-10 w-full max-w-[640px]">
            <div className="h-3 overflow-hidden rounded-full bg-white/90 shadow-inner">
              <span className="block h-full w-full origin-left animate-[analysis-fill_2.2s_ease-in-out_forwards] rounded-full bg-gradient-to-r from-[#8a5df0] via-[#a97cf8] to-[#f1b6ff]" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium text-[#7b829e]">
              <span>Lecture de la formule</span>
              <span>Evaluation de compatibilite</span>
              <span>Preparation du resultat</span>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function LoadingInfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/75 p-5 text-left shadow-[0_14px_35px_rgba(116,69,232,0.08)] backdrop-blur-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4eeff] text-[#7448e8]">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#956cf8]">{title}</p>
      <p className="mt-2 text-base font-semibold text-[#171b36]">{text}</p>
    </div>
  );
}

function ResultWorkspace({
  analysisResult,
  currentStep,
  selectedGoal,
  selectedImage,
  onChangeGoal,
  onScanAnother,
}: {
  analysisResult: AnalysisResult;
  currentStep: number;
  selectedGoal: SkinGoal;
  selectedImage: UploadedImage | null;
  onChangeGoal: () => void;
  onScanAnother: () => void;
}) {
  const productName = formatProductName(selectedImage?.file.name ?? null);
  const historyItems = [
    { name: productName, date: "Aujourd hui · 10:24", active: true, image: selectedImage?.url ?? "/cleanser.png" },
    { name: "Sunscreen SPF 50", date: "Hier · 14:32", active: false, image: "/cleanser.png" },
    { name: "Vitamin C Serum", date: "2 mai · 09:15", active: false, image: "/cleanser.png" },
    { name: "Retinol Night Cream", date: "28 avril · 21:08", active: false, image: "/cleanser.png" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(165,120,255,0.12),_transparent_32%),linear-gradient(180deg,_#fcfbff_0%,_#f7f4ff_100%)] p-2 text-[#161a35] sm:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1780px] overflow-hidden rounded-[34px] border border-[#e8e2fa] bg-white/85 shadow-[0_28px_80px_rgba(86,63,154,0.10)] backdrop-blur-xl sm:min-h-[calc(100vh-2rem)]">
        <ResultSidebarShell historyItems={historyItems} onScanAnother={onScanAnother} selectedImage={selectedImage} />
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#ede7fb] px-5 py-5 sm:px-8">
            <button
              type="button"
              onClick={onChangeGoal}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6d58ac] transition hover:text-[#5837d2]"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour au scan
            </button>
            <div className="flex items-center gap-4 text-[#636b88]">
              <button type="button" className="inline-flex items-center gap-2 text-sm font-medium transition hover:text-[#151833]">
                <CircleHelp className="h-5 w-5" />
                Aide
              </button>
              <button type="button" className="relative rounded-full border border-[#ebe4fb] p-2.5 transition hover:bg-[#faf7ff]">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#8f64f2]" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-7 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1080px]">
              <ScanProgress currentStep={currentStep} onStepClick={() => undefined} selectedGoalLabel={selectedGoal.label} />

              <div className="mt-6 flex items-start justify-end gap-4">
                <div className="max-w-[720px] rounded-[26px] border border-[#ece5fb] bg-[linear-gradient(180deg,_rgba(247,242,255,0.95)_0%,_rgba(243,238,255,0.95)_100%)] px-6 py-5 shadow-[0_16px_40px_rgba(104,78,171,0.08)]">
                  <p className="text-[15px] font-semibold text-[#1a1e39] sm:text-[17px]">{productName} - objectif: {selectedGoal.label}</p>
                  <p className="mt-2 text-sm leading-7 text-[#69718f] sm:text-base">J ai scanne ce produit pour verifier s il est bien adapte a mon objectif peau et a ma routine.</p>
                </div>
                <div className="hidden items-center gap-4 sm:flex">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1eaff] text-[#7b57ec] shadow-sm">
                    <UserRound className="h-7 w-7" />
                  </span>
                  <span className="text-sm text-[#868daa]">10:24</span>
                </div>
              </div>

              <div className="mt-10 rounded-[34px] border border-[#ece5fb] bg-white px-5 py-6 shadow-[0_22px_50px_rgba(89,62,165,0.08)] sm:px-7 sm:py-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3edff] text-[#7a55ea]">
                      <Sparkles className="h-7 w-7" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#171b36]">Resultat de l analyse IA</h2>
                        <span className="rounded-full bg-[#e7f8ec] px-4 py-2 text-sm font-semibold text-[#21a35c]">{analysisResult.verdict}</span>
                      </div>
                      <p className="mt-4 max-w-[780px] text-base leading-8 text-[#5f6784]">{analysisResult.summary}</p>
                    </div>
                  </div>
                  <span className="rounded-[20px] bg-[#e9faef] px-4 py-3 text-3xl font-bold text-[#20a45c] shadow-sm">
                    {analysisResult.score}/10
                  </span>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                  <InsightCard title="Points forts" tone="green" items={analysisResult.positives} />
                  <InsightCard title="A surveiller" tone="orange" items={analysisResult.watchouts} />
                  <NextStepCard tips={analysisResult.tips} nextStep={analysisResult.nextStep} />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#171b36]">Questions a poser</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {analysisResult.questions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        className="rounded-2xl border border-[#e7defc] bg-[#faf7ff] px-4 py-3 text-sm font-semibold text-[#7350e5] transition hover:bg-[#f1eaff]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[30px] border border-[#e8e0fb] bg-white px-5 py-5 shadow-[0_18px_45px_rgba(90,66,165,0.06)] sm:px-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 text-[#7a55ea]">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-semibold">Posez une question sur ce produit...</span>
                    </div>
                    <input
                      className="mt-4 w-full border-0 bg-transparent text-base text-[#171b36] outline-none placeholder:text-[#98a0bc]"
                      placeholder="Compatibilite, usage, sensibilite, routine..."
                    />
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#e5ddfb] px-4 py-2 text-sm font-medium text-[#6a7290]">
                        <Paperclip className="h-4 w-4" />
                        Joindre une image
                      </button>
                      <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#e5ddfb] px-4 py-2 text-sm font-medium text-[#6a7290]">
                        <Sparkles className="h-4 w-4" />
                        Exemples de questions
                      </button>
                    </div>
                  </div>
                  <button type="button" className="ml-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#b594ff] to-[#8c57eb] text-white shadow-[0_18px_35px_rgba(112,75,225,0.28)]">
                    <Send className="h-7 w-7" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
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
          <div key={title} className="relative grid grid-cols-[34px_64px_1fr] gap-5">
            {/* Step number + line */}
            <div className="relative flex justify-center">
              {index !== items.length - 1 && (
                <div className="absolute top-8 h-[calc(100%+36px)] w-px bg-[#b894ff]" />
              )}

              <div className="mt-4 relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#9b75f2] to-pink-200 text-sm font-bold text-white shadow-[0_0_18px_rgba(155,99,255,0.45)]">
                {index + 1}
              </div>
            </div>

            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e5dcff] bg-[#f6f1ff] text-[#7548e8] shadow-[0_8px_18px_rgba(117,72,232,0.12)]">
              <Icon className="h-8 w-8" strokeWidth={2.5} />
            </div>

            {/* Text */}
            <div className="pt-1">
              <h3 className="text-[15px] font-extrabold leading-6 text-[#101632]">
                {title}
              </h3>

              <p className="mt-2 max-w-[220px] text-[15px] leading-6 text-[#66708f]">
                {text}
              </p>
            </div>
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
    <Panel className="px-8 py-7">
      <h2 className="flex items-center justify-between text-2xl font-bold">
        Avant de continuer
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-8 divide-y divide-[#efeaf9]">
        {items.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-4 py-6 first:pt-0 last:pb-0">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e8ddff] bg-[#f7f2ff] text-[#7548e8] shadow-[0_8px_18px_rgba(117,72,232,0.08)]">
              <Icon className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-[18px] font-bold text-[#171b36]">{title}</span>
              <span className="mt-2 block leading-6 text-[#66708f]">{text}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4 rounded-[22px] border border-[#ece6f8] bg-[#fbfaff] p-5 text-[#66708f] shadow-[0_8px_18px_rgba(45,24,90,0.04)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#5f4f8c] shadow-sm">
          <Lock className="h-5 w-5" />
        </span>
        <p className="text-sm leading-6">Vos donnees restent privees et securisees. Elles ne sont utilisees que pour l analyse.</p>
      </div>
    </Panel>
  );
}

function PhotoPreview({
  selectedImage,
  imageCount,
  small = false,
}: {
  selectedImage: UploadedImage | null;
  imageCount: number;
  small?: boolean;
}) {
  return (
    <div className={small ? "mt-5" : ""}>
      {!small && <h3 className="mb-5 text-center font-bold">Apercu de votre photo</h3>}
      <div className={`mx-auto overflow-hidden rounded-[24px] border border-[#eadfff] bg-[linear-gradient(180deg,_#c7ad90_0%,_#b89772_100%)] p-3 shadow-[0_18px_40px_rgba(117,72,232,0.12)] ${small ? "w-[146px]" : "w-[260px]"}`}>
        <div className={`relative overflow-hidden rounded-[18px] bg-[#efe6ff] ${small ? "h-[132px]" : "h-[290px]"}`}>
          {selectedImage ? (
            <Image src={selectedImage.url} alt={selectedImage.file.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-5 text-center text-[#7a6f99]">
              <Camera className="h-10 w-10 text-[#a184f4]" />
              <p className="mt-4 text-sm font-semibold">{small ? "Ajoutez une image pour afficher l apercu." : "Votre apercu d image apparaitra ici."}</p>
              <p className="mt-2 text-xs leading-5 text-[#8a84a4]">Vous pouvez importer une ou plusieurs photos de l etiquette.</p>
            </div>
          )}
        </div>
      </div>
      <p className={`mx-auto mt-4 ${small ? "max-w-[180px]" : "max-w-[220px]"} text-center text-sm text-[#66708f]`}>
        {selectedImage
          ? `Vous pouvez modifier la liste si necessaire.${imageCount > 1 ? ` ${imageCount} images importees.` : ""}`
          : "Importez une image ou collez vos ingredients manuellement."}
      </p>
    </div>
  );
}

function ManualIngredientsDialog({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const parsedCount = parseIngredientText(value).length;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#120a24]/45 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-ingredients-title"
        className="w-full max-w-2xl rounded-[32px] border border-white/60 bg-white p-7 shadow-[0_35px_90px_rgba(42,22,84,0.28)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6dff]">Etape 2</p>
            <h2 id="manual-ingredients-title" className="mt-2 text-2xl font-bold text-[#111631]">Collez vos ingredients manuellement</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#66708f]">Collez la liste INCI telle qu elle apparait sur l emballage ou le site du produit. Vous pouvez utiliser des virgules, des points-virgules ou des retours a la ligne.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f1ff] text-[#6f3fe4] transition hover:bg-[#ede5ff]"
            aria-label="Fermer la fenetre"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex: Aqua, Glycerin, Niacinamide, Panthenol..."
          className="mt-6 min-h-[240px] w-full rounded-[24px] border border-[#dfd7f4] bg-[#fcfbff] px-5 py-4 text-[15px] leading-7 text-[#1d2140] outline-none transition placeholder:text-[#9aa1ba] focus:border-[#9b75f2] focus:ring-4 focus:ring-[#efe7ff]"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#faf7ff] px-4 py-3">
          <p className="text-sm text-[#66708f]">
            {parsedCount > 0 ? `${parsedCount} ingredients detectes dans votre saisie.` : "Collez votre liste pour preparer l etape suivante."}
          </p>
          <p className="text-sm font-semibold text-[#7a54ea]">Separateurs acceptes : virgule, point-virgule, retour a la ligne</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#ddd6f6] bg-white px-6 text-sm font-semibold text-[#4f5473] transition hover:bg-[#faf9ff]"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={parsedCount === 0}
            className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#9b75f2] to-pink-300 px-6 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Utiliser cette liste
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductStill() {
  return (
    <div className="relative h-56 w-72">
      <Image src="/cleanser.png" alt="" width={150} height={180} className="absolute right-20 top-0 h-44 w-auto object-contain drop-shadow-xl" />
      <Image src="/cleanser.png" alt="" width={160} height={160} className="absolute bottom-2 right-0 h-32 w-auto object-contain drop-shadow-xl" />
      <Sparkles className="absolute left-4 top-10 h-7 w-7 text-[#bba1ff]" />
    </div>
  );
}

function ResultSidebarShell({
  historyItems,
  onScanAnother,
  selectedImage,
}: {
  historyItems: Array<{ name: string; date: string; active: boolean; image: string }>;
  onScanAnother: () => void;
  selectedImage: UploadedImage | null;
}) {
  return (
    <aside className="hidden w-[320px] shrink-0 border-r border-[#ede7fb] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(249,245,255,0.92)_100%)] lg:flex lg:flex-col">
      <div className="border-b border-[#ede7fb] px-6 py-8">
        <div className="flex items-center justify-between">
          <Image src="/logo.png" alt="SkinorAI" width={170} height={40} className="h-10 w-auto" priority />
          <button type="button" className="rounded-full p-2 text-[#6c7190] transition hover:bg-[#f5f1ff]">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onScanAnother}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8b5aef] to-[#6c35d8] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(110,65,226,0.24)]"
        >
          <Plus className="h-5 w-5" />
          Nouveau scan
        </button>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#e8e0fb] bg-white px-4 py-3 text-[#8a90aa]">
          <Search className="h-5 w-5" />
          <span className="text-sm">Rechercher un scan...</span>
        </div>
      </div>

      <div className="flex-1 px-5 py-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#171b36]">
          <Clock3 className="h-5 w-5 text-[#7260ad]" />
          Historique
        </h3>

        <div className="mt-6 space-y-3">
          {historyItems.map((item) => (
            <div
              key={`${item.name}-${item.date}`}
              className={`flex items-center gap-3 rounded-[24px] border px-3 py-3 shadow-sm ${item.active ? "border-[#e6ddfb] bg-[#f8f4ff]" : "border-transparent bg-white/70"}`}
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#efe7fb] bg-white">
                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized={item.image === selectedImage?.url} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#1b1f39]">{item.name}</p>
                <p className="mt-1 text-sm text-[#7b829e]">{item.date}</p>
              </div>
              <button type="button" className="rounded-full p-2 text-[#7680a0] transition hover:bg-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6f49e2] transition hover:text-[#5d39cf]">
          Voir tous les scans
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-[#ede7fb] px-5 py-5">
        <Image src="/people.png" alt="Clara" width={44} height={44} className="h-11 w-11 rounded-full object-cover object-left" />
        <div className="flex-1">
          <p className="font-semibold text-[#171b36]">Clara</p>
          <p className="text-sm font-medium text-[#7a55ea]">Plan Pro</p>
        </div>
        <ChevronDown className="h-4 w-4 text-[#6e7693]" />
      </div>
    </aside>
  );
}

function InsightCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "green" | "orange";
  items: ResultDetail[];
}) {
  const isGreen = tone === "green";
  return (
    <section className={`rounded-[28px] border p-6 ${isGreen ? "border-[#ddf1e6] bg-[#fcfffd]" : "border-[#f5e5cb] bg-[#fffdf9]"}`}>
      <h3 className="flex items-center gap-3 text-xl font-bold">
        <CheckCircle2 className={`h-7 w-7 ${isGreen ? "text-[#55c987]" : "text-[#ffae4f]"}`} />
        {title}
        <span className={`rounded-full px-3 py-1 text-sm ${isGreen ? "bg-[#ddf7e7] text-[#20a45c]" : "bg-[#fff0d9] text-[#ad6b00]"}`}>{items.length}</span>
      </h3>
      {items.length > 0 ? (
        <div className="mt-5 space-y-5">
          {items.map((item) => (
            <div key={item.name} className="flex gap-3">
              <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isGreen ? "bg-[#e7f8ec] text-[#20a45c]" : "bg-[#fff2df] text-[#ff9d2f]"}`}>
                {isGreen ? <Check className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-semibold text-[#171b36]">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-[#66708f]">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-[#66708f]">No major {isGreen ? "positives" : "watchouts"} were identified from the current ingredient list.</p>
      )}
    </section>
  );
}

function NextStepCard({
  tips,
  nextStep,
}: {
  tips: string[];
  nextStep: string;
}) {
  return (
    <section className="rounded-[28px] border border-[#e8defc] bg-[#fefcff] p-6">
      <h3 className="flex items-center gap-3 text-xl font-bold text-[#171b36]">
        <Sparkles className="h-6 w-6 text-[#7a55ea]" />
        Prochaine etape
      </h3>
      <p className="mt-4 text-sm leading-7 text-[#66708f]">{nextStep}</p>
      <div className="mt-5 space-y-4">
        {tips.map((tip, index) => (
          <div key={tip} className="flex gap-3 border-t border-[#f0e9fd] pt-4 first:border-t-0 first:pt-0">
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3edff] text-[#7a55ea]">
              {index === 0 ? <Clock3 className="h-4 w-4" /> : index === 1 ? <ShieldCheck className="h-4 w-4" /> : <Droplet className="h-4 w-4" />}
            </span>
            <p className="text-sm leading-7 text-[#535a78]">{tip}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
