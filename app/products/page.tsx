"use client";

import { FormEvent, ReactNode, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import gsap from "gsap";
import { API_BASE_URL } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type SkinType = "all" | "dry" | "oily" | "combination" | "sensitive" | "normal";
type SkinGoal =
  | "all"
  | "hydration"
  | "acne"
  | "barrier"
  | "redness"
  | "glow"
  | "anti_age"
  | "oil_control";
type Sensitivity = "all" | "low" | "medium" | "high";
type ProductType = "all" | "cleanser" | "serum" | "moisturizer" | "spf" | "exfoliant" | "treatment";
type CategoryFilterId = "all" | "dry" | "oily" | "sensitive" | "acne" | "redness" | "barrier" | "glow";

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  imagePath: string;
  productType: ProductType;
  price: number | null;
  currency: string;
  skinTypes: string[];
  goals: string[];
  keyIngredients: string[];
  watchoutIngredients: string[];
  tags: string[];
  badges: string[];
  benefits: string[];
  matchScore: number;
  matchReasons: string[];
  warnings: string[];
};

type ProductsResponse = {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isPersonalized: boolean;
  };
};

type RecommendationForm = {
  skinType: SkinType;
  goal: SkinGoal;
  sensitivity: Sensitivity;
  productType: ProductType;
  avoidIngredients: string;
};

const PRODUCTS_PER_PAGE = 20;
const DEFAULT_PRODUCT_IMAGE = "/products/default-product.png";
const SKIN_PROFILE_STORAGE_KEY = "skinorai_skin_profile";
const SKIN_PROFILE_SKIPPED_KEY = "skinorai_skin_profile_skipped";

const initialForm: RecommendationForm = {
  skinType: "all",
  goal: "all",
  sensitivity: "all",
  productType: "all",
  avoidIngredients: "",
};

const skinTypes = [
  { id: "all", label: "Tous" },
  { id: "dry", label: "Peau sèche" },
  { id: "oily", label: "Peau grasse" },
  { id: "combination", label: "Peau mixte" },
  { id: "sensitive", label: "Peau sensible" },
  { id: "normal", label: "Peau normale" },
] satisfies Array<{ id: SkinType; label: string }>;

const goals = [
  { id: "all", label: "Tous les objectifs" },
  { id: "hydration", label: "Hydratation" },
  { id: "acne", label: "Acné & imperfections" },
  { id: "barrier", label: "Barrière abîmée" },
  { id: "redness", label: "Rougeurs" },
  { id: "glow", label: "Éclat & taches" },
  { id: "anti_age", label: "Anti-âge" },
  { id: "oil_control", label: "Excès de sébum" },
] satisfies Array<{ id: SkinGoal; label: string }>;

const sensitivities = [
  { id: "all", label: "Je ne sais pas" },
  { id: "low", label: "Faible" },
  { id: "medium", label: "Moyenne" },
  { id: "high", label: "Élevée" },
] satisfies Array<{ id: Sensitivity; label: string }>;

const productTypes = [
  { id: "all", label: "Tous les produits" },
  { id: "cleanser", label: "Nettoyants" },
  { id: "serum", label: "Sérums" },
  { id: "moisturizer", label: "Crèmes" },
  { id: "spf", label: "SPF" },
  { id: "exfoliant", label: "Exfoliants" },
  { id: "treatment", label: "Traitements" },
] satisfies Array<{ id: ProductType; label: string }>;

const categoryFilters: Array<{
  id: CategoryFilterId;
  label: string;
  filterType: "all" | "skinType" | "goal";
  value?: SkinType | SkinGoal;
}> = [
  { id: "all", label: "Tous", filterType: "all" },
  { id: "dry", label: "Peau sèche", filterType: "skinType", value: "dry" },
  { id: "oily", label: "Peau grasse", filterType: "skinType", value: "oily" },
  { id: "sensitive", label: "Peau sensible", filterType: "skinType", value: "sensitive" },
  { id: "acne", label: "Acné & imperfections", filterType: "goal", value: "acne" },
  { id: "redness", label: "Rougeurs", filterType: "goal", value: "redness" },
  { id: "barrier", label: "Barrière abîmée", filterType: "goal", value: "barrier" },
  { id: "glow", label: "Éclat & taches", filterType: "goal", value: "glow" },
];

function buildImageUrl(imagePath?: string | null) {
  if (!imagePath) return `${API_BASE_URL}${DEFAULT_PRODUCT_IMAGE}`;
  if (imagePath.startsWith("http")) return imagePath;

  const normalizedPath = imagePath.startsWith("/public/")
    ? imagePath.replace("/public", "")
    : imagePath.startsWith("public/")
      ? `/${imagePath.replace("public/", "")}`
      : imagePath;

  return `${API_BASE_URL}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
}

function useDefaultProductImage() {
  return (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const fallbackUrl = `${API_BASE_URL}${DEFAULT_PRODUCT_IMAGE}`;

    if (image.src !== fallbackUrl) {
      image.src = fallbackUrl;
    }
  };
}

function getSkinLabel(skinType: string) {
  return skinTypes.find((item) => item.id === skinType)?.label ?? skinType;
}

function getGoalLabel(goal: string) {
  return goals.find((item) => item.id === goal)?.label ?? goal;
}

function getProductTypeLabel(productType: string) {
  return productTypes.find((item) => item.id === productType)?.label ?? productType;
}

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 72) return "Très bon";
  if (score >= 60) return "Bon match";
  return "À vérifier";
}

function isDefaultProfile(profile: RecommendationForm) {
  return (
    profile.skinType === "all" &&
    profile.goal === "all" &&
    profile.sensitivity === "all" &&
    profile.productType === "all" &&
    profile.avoidIngredients.trim().length === 0
  );
}

function readStoredProfile(): RecommendationForm | null {
  try {
    const storedProfile = window.localStorage.getItem(SKIN_PROFILE_STORAGE_KEY);
    if (!storedProfile) return null;

    return {
      ...initialForm,
      ...(JSON.parse(storedProfile) as Partial<RecommendationForm>),
    };
  } catch {
    return null;
  }
}

export default function ProductsPage() {
  const [form, setForm] = useState<RecommendationForm>(initialForm);
  const [appliedForm, setAppliedForm] = useState<RecommendationForm>(initialForm);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [response, setResponse] = useState<ProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSkippedProfile, setHasSkippedProfile] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilterId>("all");

  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const isPersonalized = useMemo(() => !isDefaultProfile(appliedForm), [appliedForm]);

  useEffect(() => {
    const storedProfile = readStoredProfile();
    const skippedProfile = window.localStorage.getItem(SKIN_PROFILE_SKIPPED_KEY) === "true";

    if (storedProfile) {
      setForm(storedProfile);
      setAppliedForm(storedProfile);
      setHasSkippedProfile(false);
      return;
    }

    setHasSkippedProfile(skippedProfile);

    if (!skippedProfile) {
      setIsProfileDialogOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from([heroRef.current, profileRef.current, toolbarRef.current], {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(PRODUCTS_PER_PAGE),
        sort: isPersonalized ? "recommended" : "newest",
      });

      if (search.trim()) params.set("search", search.trim());

      const selectedCategory = categoryFilters.find((item) => item.id === activeCategory);
      const requestedSkinType =
        selectedCategory?.filterType === "skinType"
          ? (selectedCategory.value as SkinType)
          : appliedForm.skinType;
      const requestedGoal =
        selectedCategory?.filterType === "goal"
          ? (selectedCategory.value as SkinGoal)
          : appliedForm.goal;

      if (requestedSkinType !== "all") params.set("skinType", requestedSkinType);
      if (requestedGoal !== "all") params.set("goal", requestedGoal);
      if (appliedForm.sensitivity !== "all") params.set("sensitivity", appliedForm.sensitivity);
      if (appliedForm.productType !== "all") params.set("productType", appliedForm.productType);
      if (appliedForm.avoidIngredients.trim()) {
        params.set("avoidIngredients", appliedForm.avoidIngredients.trim());
      }

      try {
        const request = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!request.ok) throw new Error("Impossible de charger les produits.");

        const data = (await request.json()) as ProductsResponse;
        setResponse(data);
      } catch (caughtError) {
        if ((caughtError as Error).name !== "AbortError") {
          setError(caughtError instanceof Error ? caughtError.message : "Erreur inconnue.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadProducts();

    return () => controller.abort();
  }, [activeCategory, appliedForm, isPersonalized, page, search]);

  useEffect(() => {
    if (isLoading || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll("[data-product-card]");

    gsap.fromTo(
      cards,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.42,
        stagger: 0.035,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
  }, [isLoading, response?.meta.page, response?.items.length]);

  const updateForm = <Key extends keyof RecommendationForm>(
    key: Key,
    value: RecommendationForm[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const applyRecommendationForm = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setAppliedForm(form);
    setHasSkippedProfile(false);
    setPage(1);
    setIsProfileDialogOpen(false);

    window.localStorage.setItem(SKIN_PROFILE_STORAGE_KEY, JSON.stringify(form));
    window.localStorage.removeItem(SKIN_PROFILE_SKIPPED_KEY);
  };

  const skipProfile = () => {
    setForm(initialForm);
    setAppliedForm(initialForm);
    setHasSkippedProfile(true);
    setPage(1);
    setIsProfileDialogOpen(false);

    window.localStorage.setItem(SKIN_PROFILE_SKIPPED_KEY, "true");
    window.localStorage.removeItem(SKIN_PROFILE_STORAGE_KEY);
  };

  const clearProfile = () => {
    setForm(initialForm);
    setAppliedForm(initialForm);
    setHasSkippedProfile(false);
    setPage(1);

    window.localStorage.removeItem(SKIN_PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(SKIN_PROFILE_SKIPPED_KEY);
  };

  return (
    <main ref={pageRef} className="min-h-screen bg-[#fbfaf8] text-[#171325]">
      <section className="mx-auto max-w-[1520px] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div ref={heroRef} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5cf6]">
                Produits
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#171325]">
                Produits recommandés
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f687d]">
                Découvrez des soins classés par type de peau, objectif et ingrédients clés.
              </p>
            </div>

            <Card className="hidden rounded-[10px] border border-[#efe7fb] bg-white/85 shadow-none ring-0 lg:block">
              <CardContent className="flex gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#f3ecff] text-[#8b5cf6]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#221d35]">
                    Recommandations sans tokens IA
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#726b86]">
                    Le classement utilise les données produits en base. L’IA reste pour les conseils détaillés.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryFilters.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setPage(1);
                  }}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-[#8b5cf6] bg-[#8b5cf6] text-white"
                      : "border-[#e7def3] bg-white text-[#4f4661] hover:border-[#cdb8ee] hover:bg-[#fbf8ff]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <Card
            ref={profileRef}
            className="mt-9 overflow-hidden rounded-[14px] border border-[#eee6f8] bg-white shadow-none ring-0"
          >
            <CardHeader className="border-b border-[#f3edf9] bg-[linear-gradient(135deg,#ffffff_0%,#fbf7ff_48%,#fffafc_100%)] p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#f2eaff] text-[#8b5cf6]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#221d35]">
                      Votre profil peau
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[#756f88]">
                      Optionnel. Personnalisez vos recommandations ou affichez tout le catalogue.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isPersonalized && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearProfile}
                      className="h-10 cursor-pointer rounded-[10px] border-[#eadff7] bg-white text-[#6f6681] shadow-none hover:bg-[#fbf7ff]"
                    >
                      <X className="h-4 w-4" />
                      Réinitialiser
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={skipProfile}
                    className="h-10 cursor-pointer rounded-[10px] border-[#eadff7] bg-white text-[#6f6681] shadow-none hover:bg-[#fbf7ff]"
                  >
                    Voir tous les produits
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsProfileDialogOpen(true)}
                    className="h-10 cursor-pointer rounded-[10px] bg-[#111018] px-5 text-white shadow-none hover:bg-[#111018]/90"
                  >
                    Personnaliser
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 p-5 md:grid-cols-2 md:p-6 xl:grid-cols-5">
              <ProfileSummary label="Type de peau" value={getSkinLabel(appliedForm.skinType)} />
              <ProfileSummary label="Objectif" value={goals.find((item) => item.id === appliedForm.goal)?.label ?? "Tous"} />
              <ProfileSummary label="Sensibilité" value={sensitivities.find((item) => item.id === appliedForm.sensitivity)?.label ?? "Je ne sais pas"} />
              <ProfileSummary label="Produit" value={productTypes.find((item) => item.id === appliedForm.productType)?.label ?? "Tous"} />
              <ProfileSummary label="À éviter" value={appliedForm.avoidIngredients || "Aucun"} />
            </CardContent>
          </Card>

          <div ref={toolbarRef} className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#221d35]">
                {isLoading ? "Chargement des produits..." : `${response?.meta.total ?? 0} produits trouvés`}
              </p>
              <p className="mt-1 text-xs text-[#837c95]">
                {isPersonalized
                  ? "Classés selon votre profil peau."
                  : hasSkippedProfile
                    ? "Profil ignoré. Tous les produits actifs sont affichés."
                    : "Ajoutez votre profil pour obtenir un classement plus précis."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center gap-2 rounded-[10px] border border-[#eadff7] bg-white px-3 text-sm font-medium text-[#756f88]">
                <Search className="h-4 w-4" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Rechercher une marque..."
                  className="h-auto w-48 border-0 bg-transparent p-0 shadow-none outline-none placeholder:text-[#9c94ae] focus-visible:ring-0"
                />
              </div>

              <div className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[#eadff7] bg-white px-4 text-sm font-semibold text-[#756f88]">
                <SlidersHorizontal className="h-4 w-4" />
                Page {response?.meta.page ?? page}/{response?.meta.totalPages ?? 1}
              </div>
            </div>
          </div>

          {error && (
            <Card className="mt-6 rounded-[10px] border border-[#ffd7dd] bg-[#fff7f8] shadow-none ring-0">
              <CardContent className="p-4 text-sm font-semibold text-[#c6405f]">
                {error}
              </CardContent>
            </Card>
          )}

          <div ref={gridRef} className="mt-5 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              : response?.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isPersonalized={isPersonalized}
                    onOpen={() => setSelectedProduct(product)}
                  />
                ))}
          </div>

          {!isLoading && response?.items.length === 0 && (
            <Card className="mt-8 rounded-[10px] border border-[#eadff7] bg-white text-center shadow-none ring-0">
              <CardContent className="p-8">
                <Leaf className="mx-auto h-10 w-10 text-[#9b75f2]" />
                <h2 className="mt-4 text-xl font-semibold text-[#221d35]">
                  Aucun produit trouvé
                </h2>
                <p className="mt-2 text-sm text-[#756f88]">
                  Essayez un autre objectif ou affichez tous les produits.
                </p>
              </CardContent>
            </Card>
          )}

          {response && response.meta.totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!response.meta.hasPreviousPage}
                className="h-11 cursor-pointer rounded-[10px] border-[#eadff7] bg-white px-5 text-sm font-semibold text-[#574c70] shadow-none hover:bg-[#fbf7ff]"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <Badge className="rounded-[10px] bg-[#f5efff] px-4 py-2 text-sm font-semibold text-[#8b5cf6] shadow-none hover:bg-[#f5efff]">
                {response.meta.page} / {response.meta.totalPages}
              </Badge>

              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => Math.min(response.meta.totalPages, current + 1))}
                disabled={!response.meta.hasNextPage}
                className="h-11 cursor-pointer rounded-[10px] border-[#eadff7] bg-white px-5 text-sm font-semibold text-[#574c70] shadow-none hover:bg-[#fbf7ff]"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <SkinProfileDialog
        open={isProfileDialogOpen}
        form={form}
        onOpenChange={(open) => {
          if (!open && !isPersonalized && !hasSkippedProfile) {
            skipProfile();
            return;
          }
          setIsProfileDialogOpen(open);
        }}
        onUpdate={updateForm}
        onSubmit={applyRecommendationForm}
        onSkip={skipProfile}
      />

      <ProductDetailsDialog
        product={selectedProduct}
        isPersonalized={isPersonalized}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      />
    </main>
  );
}

function ProfileSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#f1eaf9] bg-[#fffdfd] px-4 py-3 transition hover:border-[#e3d4f5] hover:bg-[#fffafe]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8f86a5]">
        {label}
      </p>
      <p className="mt-1 line-clamp-1 text-sm font-semibold text-[#221d35]">
        {value}
      </p>
    </div>
  );
}

function SkinProfileDialog({
  open,
  form,
  onOpenChange,
  onUpdate,
  onSubmit,
  onSkip,
}: {
  open: boolean;
  form: RecommendationForm;
  onOpenChange: (open: boolean) => void;
  onUpdate: <Key extends keyof RecommendationForm>(key: Key, value: RecommendationForm[Key]) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  onSkip: () => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { y: 18, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" },
    );
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        className="w-[calc(100vw-32px)] max-h-[90vh] overflow-hidden rounded-[14px] border border-[#eadff7] bg-white p-0 shadow-[0_24px_80px_rgba(53,37,82,0.14)] sm:max-w-[760px]"
      >
        <form onSubmit={onSubmit}>
          <DialogHeader className="border-b border-[#f1eaf9] bg-[linear-gradient(135deg,#ffffff_0%,#fbf7ff_55%,#fffafc_100%)] p-6 text-left">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#f3ecff] text-[#8b5cf6]">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-[#221d35]">
              Personnaliser vos recommandations
            </DialogTitle>
            <DialogDescription className="max-w-[560px] text-sm leading-6 text-[#756f88]">
              Répondez à quelques questions pour classer les produits selon votre peau. Vous pouvez ignorer cette étape et voir tout le catalogue.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-6 lg:grid-cols-2">
            <SelectField
              label="Type de peau"
              value={form.skinType}
              options={skinTypes}
              onChange={(value) => onUpdate("skinType", value as SkinType)}
            />
            <SelectField
              label="Objectif principal"
              value={form.goal}
              options={goals}
              onChange={(value) => onUpdate("goal", value as SkinGoal)}
            />
            <SelectField
              label="Sensibilité"
              value={form.sensitivity}
              options={sensitivities}
              onChange={(value) => onUpdate("sensitivity", value as Sensitivity)}
            />
            <SelectField
              label="Produit recherché"
              value={form.productType}
              options={productTypes}
              onChange={(value) => onUpdate("productType", value as ProductType)}
            />
            <div className="md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.13em] text-[#8f86a5]">
                Ingrédients à éviter
              </Label>
              <Input
                value={form.avoidIngredients}
                onChange={(event) => onUpdate("avoidIngredients", event.target.value)}
                placeholder="Parfum, alcohol denat, huiles essentielles..."
                className="mt-2 h-11 rounded-[10px] border-[#eadff7] bg-[#fffdfd] text-sm font-semibold text-[#221d35] shadow-none focus-visible:ring-[#f2e9ff]"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 rounded-b-[14px] border-t border-[#f1eaf9] bg-[#fffdfd] p-5 sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="w-full rounded-[10px] border-[#eadff7] bg-white text-[#6f6681] shadow-none hover:bg-[#fbf7ff] sm:w-auto"
            >
              Ignorer pour l’instant
            </Button>
            <Button type="submit" className="w-full rounded-[10px] bg-[#111018] text-white shadow-none hover:bg-[#111018]/90 sm:w-auto">
              Voir mes recommandations
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-[0.13em] text-[#8f86a5]">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2 h-11 rounded-[10px] border-[#eadff7] bg-[#fffdfd] text-sm font-semibold text-[#221d35] shadow-none focus:ring-[#f2e9ff]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[10px] border border-[#eadff7] bg-white shadow-[0_18px_55px_rgba(53,37,82,0.12)]">
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ProductCard({
  product,
  isPersonalized,
  onOpen,
}: {
  product: Product;
  isPersonalized: boolean;
  onOpen: () => void;
}) {
  const fallback = useDefaultProductImage();

  return (
    <Card
      data-product-card
      className="group flex h-full overflow-hidden rounded-[10px] border border-[#eee7f7] bg-white p-0 shadow-none ring-0 transition hover:-translate-y-0.5 hover:border-[#d7c4f4] hover:bg-[#fffefe]"
    >
      <div className="flex h-full w-full flex-col">
        <button
          type="button"
          onClick={onOpen}
          className="relative cursor-pointer h-[250px] overflow-hidden bg-[#faf8fc] text-left"
        >
          {product.badges?.[0] && (
            <Badge className="absolute left-3 top-3 z-10 rounded-[10px] border border-[#eadcff] bg-white/90 px-3 py-1 text-[11px] font-medium text-[#7c4ee4] shadow-none hover:bg-white/90">
              {product.badges[0]}
            </Badge>
          )}

          <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#eee7f7] bg-white/90 text-[#1c1830] transition group-hover:bg-[#f8f2ff]">
            <Heart className="h-4 w-4" />
          </span>

          <img
            src={buildImageUrl(product.imagePath)}
            alt={product.name}
            onError={fallback}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </button>

        <CardContent className="flex flex-1 flex-col p-0">
          <button type="button" onClick={onOpen} className="flex flex-1 flex-col border-t border-[#f0eaf8] p-4 text-left">
            <p className="line-clamp-2 min-h-[40px] cursor-pointer text-[15px] font-semibold leading-tight text-[#171325]">
              {product.name}
            </p>

            <p className="mt-1 text-sm text-[#8a8299]">{product.brand}</p>

            <div className="mt-3 flex min-h-[28px] flex-wrap gap-1.5">
              {product.skinTypes?.slice(0, 2).map((skinType) => (
                <Badge
                  key={skinType}
                  className="rounded-[10px] bg-[#f4f0ff] px-2.5 py-1 text-[11px] font-medium text-[#6f45dc] shadow-none hover:bg-[#f4f0ff]"
                >
                  {getSkinLabel(skinType)}
                </Badge>
              ))}
            </div>

            <div className="mt-4 min-h-[44px] space-y-2 text-[12px] text-[#625b73]">
              {product.keyIngredients?.length > 0 && (
                <p className="line-clamp-1">
                  <span className="text-[#18a35b]">✦</span>{" "}
                  {product.keyIngredients.slice(0, 3).join(", ")}
                </p>
              )}

              {product.watchoutIngredients?.length > 0 ? (
                <p className="line-clamp-1">
                  <span className="text-[#e38a2f]">⚠</span>{" "}
                  À surveiller: {product.watchoutIngredients.slice(0, 2).join(", ")}
                </p>
              ) : (
                <p>
                  <span className="text-[#18a35b]">✓</span>{" "}
                  Sans parfum irritant détecté
                </p>
              )}
            </div>
          </button>

          <div className="mt-auto flex items-center justify-between border-t border-[#f0eaf8] px-4 py-3">
            <div>
              <p className="text-[11px] text-[#8a8299]">
                {isPersonalized ? "Score SkinorAI" : "Score global"}
              </p>
              <p className="text-sm font-semibold text-[#18a35b]">
                {product.matchScore ? `${product.matchScore}% · ${scoreLabel(product.matchScore)}` : "Global"}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onOpen}
              className="rounded-[10px] cursor-pointer border-[#e4d8fb] px-4 py-2 text-[12px] font-semibold text-[#6f45dc] shadow-none hover:border-[#b998f4] hover:bg-[#f8f3ff]"
            >
              Voir
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function ProductDetailsDialog({
  product,
  isPersonalized,
  onOpenChange,
}: {
  product: Product | null;
  isPersonalized: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const fallback = useDefaultProductImage();
  const open = Boolean(product);

  useEffect(() => {
    if (!open || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { y: 24, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: "power3.out" },
    );
  }, [open, product?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        className="w-[calc(100vw-32px)] overflow-hidden rounded-[14px] border border-[#eadff7] bg-white p-0 shadow-[0_24px_80px_rgba(53,37,82,0.14)] ring-0 sm:max-w-[920px]"
      >
        {product && (
          <div className="grid max-h-[86vh] overflow-y-auto lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-b border-[#f1eaf9] bg-[#faf8fc] p-0 lg:border-b-0 lg:border-r">
              {product.badges?.[0] && (
                <Badge className="absolute left-5 top-5 rounded-[10px] border border-[#eadcff] bg-white/90 px-3 py-1 text-[11px] font-medium text-[#7c4ee4] shadow-none hover:bg-white/90">
                  {product.badges[0]}
                </Badge>
              )}
              <img
                src={buildImageUrl(product.imagePath)}
                alt={product.name}
                onError={fallback}
                className="h-full max-h-none w-full object-cover"
              />
            </div>

            <div className="p-6">
              <DialogHeader className="text-left">
                <p className="text-sm font-medium text-[#8a8299]">{product.brand}</p>
                <DialogTitle className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#171325]">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="mt-3 text-sm leading-6 text-[#6f687d]">
                  {product.description || "Produit skincare classé selon ses ingrédients, objectifs et types de peau."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoBox label="Type" value={getProductTypeLabel(product.productType)} />
                <InfoBox
                  label={isPersonalized ? "Score SkinorAI" : "Score global"}
                  value={product.matchScore ? `${product.matchScore}% · ${scoreLabel(product.matchScore)}` : "Global"}
                />
              </div>

              <div className="mt-5 space-y-4">
                <DetailSection title="Adapté pour">
                  <div className="flex flex-wrap gap-2">
                    {product.skinTypes?.map((skinType) => (
                      <Badge key={skinType} className="rounded-[10px] bg-[#f4f0ff] text-[#6f45dc] hover:bg-[#f4f0ff]">
                        {getSkinLabel(skinType)}
                      </Badge>
                    ))}
                    {product.goals?.map((goal) => (
                      <Badge key={goal} className="rounded-[10px] bg-[#eef8f2] text-[#138f4c] hover:bg-[#eef8f2]">
                        {getGoalLabel(goal)}
                      </Badge>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="Ingrédients clés">
                  <p className="text-sm leading-6 text-[#625b73]">
                    {product.keyIngredients?.length ? product.keyIngredients.join(", ") : "Non renseigné"}
                  </p>
                </DetailSection>

                <DetailSection title="Pourquoi ce produit">
                  <ul className="space-y-2 text-sm leading-6 text-[#625b73]">
                    {(product.matchReasons?.length ? product.matchReasons : product.benefits ?? []).slice(0, 4).map((reason) => (
                      <li key={reason} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b5cf6]" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </DetailSection>

                <DetailSection title="À surveiller">
                  {product.watchoutIngredients?.length || product.warnings?.length ? (
                    <div className="space-y-2 text-sm leading-6 text-[#8a5b20]">
                      {product.watchoutIngredients?.map((item) => <p key={item}>⚠ {item}</p>)}
                      {product.warnings?.map((item) => <p key={item}>⚠ {item}</p>)}
                    </div>
                  ) : (
                    <p className="text-sm text-[#138f4c]">Aucun ingrédient à surveiller renseigné.</p>
                  )}
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#f1eaf9] bg-[#fffdfd] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8f86a5]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#221d35]">{value}</p>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-[#f1eaf9] bg-[#fffdfd] p-4">
      <h3 className="text-sm font-semibold text-[#221d35]">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <Card className="flex h-full overflow-hidden rounded-[10px] border border-[#eee7f7] bg-white p-0 shadow-none ring-0">
      <div className="flex w-full flex-col">
        <Skeleton className="h-[250px] rounded-none bg-[#f5f1fa]" />
        <CardContent className="flex flex-1 flex-col space-y-3 p-4">
          <Skeleton className="h-4 w-3/4 rounded-[6px] bg-[#eee8f5]" />
          <Skeleton className="h-3 w-1/2 rounded-[6px] bg-[#eee8f5]" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-[10px] bg-[#eee8f5]" />
            <Skeleton className="h-6 w-24 rounded-[10px] bg-[#eee8f5]" />
          </div>
          <Skeleton className="h-3 w-full rounded-[6px] bg-[#eee8f5]" />
          <Skeleton className="h-3 w-2/3 rounded-[6px] bg-[#eee8f5]" />
        </CardContent>
        <div className="mt-auto flex items-center justify-between border-t border-[#f0eaf8] px-4 py-3">
          <Skeleton className="h-8 w-20 rounded-[6px] bg-[#eee8f5]" />
          <Skeleton className="h-9 w-20 rounded-[10px] bg-[#eee8f5]" />
        </div>
      </div>
    </Card>
  );
}





