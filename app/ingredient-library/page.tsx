"use client";

import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL, getStoredAuthToken } from "@/components/AuthProvider";
import {
  AlertTriangle,
  BadgeInfo,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Droplets,
  FlaskConical,
  Heart,
  Leaf,
  Moon,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { translateStaticText, useI18n } from "@/lib/i18n";

type Category = "all" | "hydration" | "acne" | "brightening" | "barrier" | "sensitive" | "oily";
type CompatibiliteState = "great" | "caution" | "avoid";
type Ingredient = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  categories: Category[];
  tags: string[];
  badge: string;
  badgeTeint: "green" | "orange" | "purple";
  accent: string;
  icon: typeof Sparkles;
  benefits: string[];
  idealFor: string[];
  usage: string;
  compatibility: Array<{ name: string; state: CompatibiliteState }>;
};

type ScanHistoryItem = {
  id: string;
  productName: string;
  createdAt: string;
  updatedAt: string;
  analysisSummary?: string;
};

async function getJson<T>(path: string): Promise<T> {
  const token = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function requestScanHistory() {
  return getJson<ScanHistoryItem[]>("/api/scans");
}

function formatScanHistoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const label = isToday
    ? "Aujourd'hui"
    : date.toDateString() === yesterday.toDateString()
      ? "Hier"
      : date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return `${label} - ${date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function normalizeDisplayText(value: string) {
  if (!/[???]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
}
const categories: Array<{ id: Category; label: string; icon: typeof Sparkles }> = [
  { id: "all", label: "Tous les ingrédients", icon: Sparkles },
  { id: "hydration", label: "Hydratation", icon: Droplets },
  { id: "acne", label: "Acné", icon: CircleHelp },
  { id: "brightening", label: "Éclat", icon: Sparkles },
  { id: "barrier", label: "Réparation de la barrière", icon: Shield },
  { id: "sensitive", label: "Peau sensible", icon: Leaf },
  { id: "oily", label: "Peau grasse", icon: Droplets },
];

const ingredients: Ingredient[] = [
  {
    id: "azelaic-acid",
    name: "Azelaic Acid",
    subtitle: "Actif multi-action pour l’éclat",
    description: "Aide à améliorer le teint irrégulier, les imperfections et les rougeurs visibles.",
    categories: ["brightening", "acne", "sensitive"],
    tags: ["Éclat", "Rougeurs", "Acné"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#f7d9ff] via-[#eab8f7] to-[#fff1fb]",
    icon: Sparkles,
    benefits: [
      "Aide à estomper les marques post-acné",
      "Favorise un teint plus uniforme",
      "Peut réduire l’apparence des rougeurs",
      "Convient à de nombreuses routines pour peaux à tendance acnéique",
    ],
    idealFor: ["Peau à tendance acnéique", "Teint irrégulier", "Peau sujette aux rougeurs"],
    usage: "Utilisez une fois par jour au début, le matin ou le soir. Appliquez une protection solaire le matin.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Rétinol", state: "caution" },
      { name: "Acides AHA/BHA", state: "caution" },
    ],
  },
  {
    id: "glycolic-acid",
    name: "Glycolic Acid",
    subtitle: "Exfoliant AHA pour l’éclat",
    description: "Exfolie la surface de la peau et aide à raviver le teint terne.",
    categories: ["brightening"],
    tags: ["Exfoliation", "Éclat", "Texture"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#ffe6bd] via-[#ffd59a] to-[#fff8e8]",
    icon: Sun,
    benefits: [
      "Lisse les textures rugueuses",
      "Améliore l’apparence du teint terne",
      "Aide à estomper progressivement les irrégularités du teint",
    ],
    idealFor: ["Teint terne", "Peau texturée", "Teint irrégulier"],
    usage: "Utilisez le soir 1 à 3 fois par semaine. Évitez de l’associer à d’autres actifs forts dans la même routine.",
    compatibility: [
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Rétinol", state: "avoid" },
      { name: "Acide salicylique", state: "avoid" },
      { name: "Vitamine C", state: "caution" },
    ],
  },
  {
    id: "lactic-acid",
    name: "Lactic Acid",
    subtitle: "Exfoliant AHA plus doux",
    description: "Exfolie tout en aidant la peau à paraître plus lisse et plus hydratée.",
    categories: ["brightening", "hydration", "sensitive"],
    tags: ["Exfoliation", "Éclat", "Doux"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#fff0c9] via-[#ffe1a8] to-[#fffaf0]",
    icon: Droplets,
    benefits: [
      "Lisse doucement la texture",
      "Améliore l’éclat",
      "Peut être moins agressif que l’acide glycolique",
    ],
    idealFor: ["Peau sèche", "Teint terne", "Exfoliation débutant"],
    usage: "Utilisez le soir 1 à 2 fois par semaine au début. Hydratez bien après utilisation.",
    compatibility: [
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Rétinol", state: "avoid" },
      { name: "Acides BHA", state: "avoid" },
    ],
  },
  {
    id: "mandelic-acid",
    name: "Mandelic Acid",
    subtitle: "AHA doux pour peaux sensibles",
    description: "Un exfoliant doux souvent utilisé pour la texture, le teint et les peaux sujettes aux imperfections.",
    categories: ["brightening", "acne", "sensitive"],
    tags: ["Doux", "Exfoliation", "Teint"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f6e0ff] via-[#e8c5ff] to-[#fff6ff]",
    icon: Sparkles,
    benefits: [
      "Améliore doucement la texture irrégulière",
      "Aide à raviver le teint terne",
      "Peut mieux convenir aux peaux sensibles ou à tendance acnéique que les AHA plus forts",
    ],
    idealFor: ["Peau sensible", "Peau à tendance acnéique", "Teint irrégulier"],
    usage: "Utilisez le soir 1 à 3 fois par semaine. Augmentez progressivement seulement si votre peau le tolère.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Rétinol", state: "avoid" },
    ],
  },
  {
    id: "gluconolactone",
    name: "Gluconolactone",
    subtitle: "Exfoliant PHA doux",
    description: "Un exfoliant doux qui aide la peau à paraître plus lisse et plus hydratée.",
    categories: ["hydration", "sensitive", "brightening"],
    tags: ["PHA", "Doux", "Hydratation"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#e6f7ff] via-[#c8eaff] to-[#f6fcff]",
    icon: Droplets,
    benefits: [
      "Exfoliation de surface très douce",
      "Aide à améliorer le lissage de la peau",
      "Soutient mieux l’hydratation que de nombreux exfoliants plus forts",
    ],
    idealFor: ["Peau sensible", "Peau sèche", "Exfoliation débutant"],
    usage: "Utilisez 2 à 4 fois par semaine selon la tolérance. La protection solaire reste importante le jour.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Rétinol", state: "caution" },
    ],
  },
  {
    id: "benzoyl-peroxide",
    name: "Benzoyl Peroxide",
    subtitle: "Actif ciblé contre l’acné",
    description: "Aide à lutter contre les bactéries liées à l’acné et à réduire les imperfections.",
    categories: ["acne", "oily"],
    tags: ["Acné", "Imperfections", "Contrôle du sébum"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#dff7ea] via-[#bfeccc] to-[#f3fff7]",
    icon: Leaf,
    benefits: [
      "Cible les peaux à tendance acnéique",
      "Peut réduire les boutons inflammatoires",
      "Utile en soin localisé ou dans les nettoyants anti-acné",
    ],
    idealFor: ["Peau à tendance acnéique", "Peau grasse"],
    usage: "Commencez doucement. Peut être asséchant et décolorer les tissus. Hydratez bien.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Rétinol", state: "avoid" },
      { name: "Acides AHA/BHA", state: "avoid" },
    ],
  },
  {
    id: "zinc-pca",
    name: "Zinc PCA",
    subtitle: "Complexe minéral régulateur de sébum",
    description: "Aide à réguler l’excès de sébum et à favoriser une peau plus nette.",
    categories: ["oily", "acne"],
    tags: ["Contrôle du sébum", "Acné", "Pores"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#d9f9ef] via-[#b8efd9] to-[#f0fff9]",
    icon: Leaf,
    benefits: [
      "Aide à équilibrer le sébum",
      "Soutient les routines pour peaux à tendance acnéique",
      "Se combine bien avec la niacinamide",
    ],
    idealFor: ["Peau grasse", "Peau à tendance acnéique", "Peau mixte"],
    usage: "Utilisez matin ou soir avant la crème hydratante. Fonctionne bien dans les sérums légers.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Acide salicylique", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Exfoliants forts", state: "caution" },
    ],
  },
  {
    id: "panthenol",
    name: "Panthénol",
    subtitle: "Aussi connu sous le nom de provitamine B5",
    description: "Apaise, hydrate et soutient le confort de la barrière cutanée.",
    categories: ["hydration", "barrier", "sensitive"],
    tags: ["Apaisant", "Hydratation", "Barrière"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#e0f2ff] via-[#c6e4ff] to-[#f6fbff]",
    icon: Heart,
    benefits: [
      "Calme les peaux sèches ou stressées",
      "Soutient la rétention d’hydratation",
      "Aide la peau à être plus douce et confortable",
    ],
    idealFor: ["Peau sensible", "Peau sèche", "Barrière fragilisée"],
    usage: "Utilisez quotidiennement dans les sérums, lotions ou crèmes. Excellent après les exfoliants ou rétinoïdes.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Rétinol", state: "great" },
    ],
  },
  {
    id: "allantoin",
    name: "Allantoin",
    subtitle: "Actif apaisant protecteur",
    description: "Aide à apaiser les irritations et à adoucir les zones rugueuses.",
    categories: ["sensitive", "barrier"],
    tags: ["Apaisant", "Confort", "Barrière"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f0f8df] via-[#d9edb6] to-[#fbfff0]",
    icon: Heart,
    benefits: [
      "Apaise les peaux irritées",
      "Aide à réduire l’inconfort",
      "Aide la peau à être plus douce",
    ],
    idealFor: ["Peau sensible", "Peau sèche", "Peau réactive"],
    usage: "Utilisez quotidiennement. Excellent dans les crèmes hydratantes et les sérums apaisants.",
    compatibility: [
      { name: "Panthénol", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Centella asiatica", state: "great" },
      { name: "Acides forts", state: "caution" },
    ],
  },
  {
    id: "centella-asiatica",
    name: "Centella asiatica",
    subtitle: "Extrait botanique apaisant",
    description: "Apaise les rougeurs visibles et soutient les peaux stressées.",
    categories: ["sensitive", "barrier", "acne"],
    tags: ["Apaisant", "Rougeurs", "Réparation"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#ddf9e6] via-[#c0efcf] to-[#f4fff6]",
    icon: Leaf,
    benefits: [
      "Aide à calmer l’irritation visible",
      "Soutient la récupération de la barrière cutanée",
      "Convient bien aux peaux sensibles à tendance acnéique",
    ],
    idealFor: ["Peau sensible", "Peau sujette aux rougeurs", "Peau à tendance acnéique"],
    usage: "Utilisez matin ou soir. Excellent après une exfoliation ou lorsque la peau est stressée.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Panthénol", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Rétinol", state: "great" },
    ],
  },
  {
    id: "madecassoside",
    name: "Madecassoside",
    subtitle: "Actif apaisant dérivé de la centella",
    description: "Un ingrédient apaisant utilisé pour soutenir les peaux sensibles et stressées.",
    categories: ["sensitive", "barrier"],
    tags: ["Apaisant", "Barrière", "Rougeurs"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#e4ffe8] via-[#c8f0cf] to-[#f7fff8]",
    icon: Leaf,
    benefits: [
      "Apaise les rougeurs visibles",
      "Soutient le confort de la barrière cutanée",
      "Se combine bien avec les formules axées sur la réparation",
    ],
    idealFor: ["Peau sensible", "Peau réactive", "Barrière fragilisée"],
    usage: "Utilisez quotidiennement dans des crèmes ou sérums apaisants.",
    compatibility: [
      { name: "Centella asiatica", state: "great" },
      { name: "Panthénol", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Acides AHA/BHA", state: "caution" },
    ],
  },
  {
    id: "glycerin",
    name: "Glycérine",
    subtitle: "Humectant classique",
    description: "Attire l’eau dans la peau et soutient une hydratation durable.",
    categories: ["hydration", "barrier", "sensitive"],
    tags: ["Hydratation", "Adoucissant", "Barrière"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#dcf4ff] via-[#bfe7ff] to-[#f4fbff]",
    icon: Droplets,
    benefits: [
      "Renforce l’hydratation",
      "Aide la peau à être plus douce",
      "Soutient la fonction barrière",
    ],
    idealFor: ["Tous types de peau", "Peau sèche", "Peau sensible"],
    usage: "Utilisez quotidiennement. Fonctionne mieux lorsqu’il est scellé par une crème hydratante.",
    compatibility: [
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Rétinol", state: "great" },
    ],
  },
  {
    id: "squalane",
    name: "Squalane",
    subtitle: "Huile hydratante légère",
    description: "Adoucit la peau et aide à limiter la perte en eau sans sensation trop lourde.",
    categories: ["hydration", "barrier", "sensitive"],
    tags: ["Hydratation", "Barrière", "Adoucissant"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#fff0d9] via-[#ffd9b8] to-[#fffaf2]",
    icon: Droplets,
    benefits: [
      "Adoucit la peau sèche",
      "Aide à retenir l’hydratation",
      "Généralement confortable pour les peaux sensibles",
    ],
    idealFor: ["Peau sèche", "Peau sensible", "Peau mixte"],
    usage: "Utilisez après les sérums aqueux ou mélangez à la crème hydratante.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Rétinol", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Acides exfoliants", state: "great" },
    ],
  },
  {
    id: "urea",
    name: "Urea",
    subtitle: "Actif hydratant et lissant",
    description: "Hydrate et aide à adoucir les peaux sèches et rugueuses.",
    categories: ["hydration", "barrier"],
    tags: ["Hydratation", "Lissant", "Peau sèche"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#e5f2ff] via-[#cbe3ff] to-[#f8fbff]",
    icon: Droplets,
    benefits: [
      "Améliore les zones sèches et rugueuses",
      "Soutient l’hydratation",
      "Peut aider la peau à paraître plus lisse",
    ],
    idealFor: ["Peau sèche", "Texture rugueuse", "Barrière fragilisée"],
    usage: "Utilisez dans des crèmes ou lotions. Les concentrations élevées peuvent être plus actives, donc introduisez doucement.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Glycérine", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Acides forts", state: "caution" },
    ],
  },
  {
    id: "peptides",
    name: "Peptides",
    subtitle: "Chaînes d’acides aminés pour la peau",
    description: "Aide la peau à paraître plus lisse et plus ferme avec le temps.",
    categories: ["barrier", "hydration"],
    tags: ["Fermeté", "Réparation", "Lissage"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#eee2ff] via-[#dbc8ff] to-[#fbf7ff]",
    icon: Sparkles,
    benefits: [
      "Soutient une peau d’apparence plus ferme",
      "Aide à améliorer l’apparence des ridules",
      "Se combine bien avec les routines de soutien de la barrière cutanée",
    ],
    idealFor: ["Peau mature", "Peau sèche", "Soutien de la barrière cutanée"],
    usage: "Utilisez matin ou soir avant la crème hydratante. Les meilleurs résultats viennent d’une utilisation régulière.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Acides directs", state: "caution" },
    ],
  },
  {
    id: "copper-peptides",
    name: "Copper Peptides",
    subtitle: "Complexe de peptides avancé",
    description: "Soutient la réparation cutanée et une apparence plus ferme.",
    categories: ["barrier", "hydration"],
    tags: ["Fermeté", "Réparation", "Avancé"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#dff4ff] via-[#b9deff] to-[#f4fbff]",
    icon: Sparkles,
    benefits: [
      "Soutient la récupération de la peau",
      "Aide à améliorer l’apparence de la fermeté",
      "Peut soutenir une texture plus lisse",
    ],
    idealFor: ["Peau mature", "Barrière fragilisée", "Préoccupations de texture"],
    usage: "Utilisez dans des routines simples. Évitez de superposer trop d’actifs forts en même temps.",
    compatibility: [
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Vitamine C", state: "caution" },
      { name: "Acides AHA/BHA", state: "avoid" },
      { name: "Rétinol", state: "caution" },
    ],
  },
  {
    id: "bakuchiol",
    name: "Bakuchiol",
    subtitle: "Alternative botanique au rétinol",
    description: "Aide à améliorer la texture et les ridules avec un profil plus doux.",
    categories: ["brightening", "sensitive"],
    tags: ["Texture", "Lissage", "Doux"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f4e0ff] via-[#dfbdf7] to-[#fff6ff]",
    icon: Moon,
    benefits: [
      "Soutient une peau d’apparence plus lisse",
      "Aide à améliorer le teint irrégulier",
      "Souvent plus doux que les rétinoïdes classiques",
    ],
    idealFor: ["Peau sensible", "Préoccupations de texture", "Teint irrégulier"],
    usage: "Utilisez matin ou soir selon le produit. Une protection solaire est recommandée le jour.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Acides forts", state: "caution" },
    ],
  },
  {
    id: "tranexamic-acid",
    name: "Tranexamic Acid",
    subtitle: "Actif unifiant le teint",
    description: "Aide à améliorer l’apparence des taches et du teint irrégulier.",
    categories: ["brightening", "sensitive"],
    tags: ["Taches pigmentaires", "Teint", "Éclat"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#ffe2ee] via-[#ffc4dc] to-[#fff6fa]",
    icon: Sparkles,
    benefits: [
      "Cible l’apparence du teint irrégulier",
      "Aide à estomper l’apparence des taches pigmentaires",
      "Fonctionne bien dans les routines éclat",
    ],
    idealFor: ["Teint irrégulier", "Marques post-acné", "Teint terne"],
    usage: "Utilisez matin ou soir. Associez à une protection solaire le jour pour de meilleurs résultats visibles.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Alpha-arbutine", state: "great" },
      { name: "Vitamine C", state: "great" },
      { name: "Rétinol", state: "caution" },
    ],
  },
  {
    id: "alpha-arbutin",
    name: "Alpha-arbutine",
    subtitle: "Actif d’éclat pour unifier le teint",
    description: "Aide à réduire l’apparence des taches et du teint irrégulier.",
    categories: ["brightening", "sensitive"],
    tags: ["Taches pigmentaires", "Éclat", "Teint"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#fff0f7] via-[#ffd4e6] to-[#fff8fb]",
    icon: Sparkles,
    benefits: [
      "Aide à améliorer l’irrégularité du teint",
      "Soutient une peau plus lumineuse",
      "Plus doux que de nombreux actifs éclaircissants plus forts",
    ],
    idealFor: ["Taches pigmentaires", "Teint irrégulier", "Marques post-acné"],
    usage: "Utilisez matin ou soir avant la crème hydratante. Utilisez toujours une protection solaire le jour.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Tranexamic Acid", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Acides directs", state: "caution" },
    ],
  },
  {
    id: "kojic-acid",
    name: "Kojic Acid",
    subtitle: "Actif éclat",
    description: "Cible l’apparence des taches pigmentaires et du teint irrégulier.",
    categories: ["brightening"],
    tags: ["Taches pigmentaires", "Éclat", "Teint"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#fff1cc] via-[#ffe0a3] to-[#fffaf0]",
    icon: Sun,
    benefits: [
      "Aide à illuminer le teint irrégulier",
      "Cible les taches visibles",
      "Souvent utilisé dans les produits ciblés contre les taches",
    ],
    idealFor: ["Taches pigmentaires", "Teint irrégulier"],
    usage: "Introduisez progressivement et surveillez les irritations. La protection solaire est essentielle le jour.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Alpha-arbutine", state: "great" },
      { name: "Rétinol", state: "caution" },
      { name: "Acides AHA/BHA", state: "avoid" },
    ],
  },
  {
    id: "licorice-root",
    name: "Licorice Root Extract",
    subtitle: "Extrait apaisant pour l’éclat",
    description: "Aide à apaiser la peau tout en favorisant un teint plus uniforme.",
    categories: ["brightening", "sensitive"],
    tags: ["Apaisant", "Éclat", "Rougeurs"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#ffe7d6] via-[#ffd1b8] to-[#fff8f2]",
    icon: Leaf,
    benefits: [
      "Soutient une peau plus lumineuse",
      "Aide à calmer les rougeurs visibles",
      "Adapté aux routines éclat pour peaux sensibles",
    ],
    idealFor: ["Peau sensible", "Teint irrégulier", "Peau sujette aux rougeurs"],
    usage: "Utilisez matin ou soir. Fonctionne bien dans les sérums apaisants et crèmes hydratantes.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Centella asiatica", state: "great" },
      { name: "Tranexamic Acid", state: "great" },
      { name: "Acides forts", state: "caution" },
    ],
  },
  {
    id: "green-tea",
    name: "Green Tea Extract",
    subtitle: "Extrait botanique antioxydant",
    description: "Apaise la peau et aide à la protéger du stress environnemental.",
    categories: ["sensitive", "oily", "acne"],
    tags: ["Antioxydant", "Apaisant", "Contrôle du sébum"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#e4f8d6] via-[#c8ecae] to-[#f8fff2]",
    icon: Leaf,
    benefits: [
      "Apaise les peaux stressées",
      "Apporte un soutien antioxydant",
      "Peut être utile aux peaux grasses et sujettes aux imperfections",
    ],
    idealFor: ["Peau grasse", "Peau sensible", "Peau à tendance acnéique"],
    usage: "Utilisez matin ou soir. Excellent dans les sérums légers, lotions ou crèmes hydratantes.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Zinc PCA", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Rétinol", state: "great" },
    ],
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    subtitle: "Botanique hydratant et apaisant",
    description: "Aide à calmer et hydrater légèrement la peau.",
    categories: ["hydration", "sensitive"],
    tags: ["Apaisant", "Hydratation", "Cooling"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#defbe5] via-[#bdf0c9] to-[#f5fff6]",
    icon: Leaf,
    benefits: [
      "Apaise l’inconfort cutané",
      "Apporte une hydratation légère",
      "Utile après une exposition solaire ou une irritation",
    ],
    idealFor: ["Peau sensible", "Peau sèche", "Peau réactive"],
    usage: "Utilisez comme couche apaisante avant la crème hydratante. Faites un test localisé si vous réagissez aux ingrédients botaniques.",
    compatibility: [
      { name: "Panthénol", state: "great" },
      { name: "Centella asiatica", state: "great" },
      { name: "Glycérine", state: "great" },
      { name: "Parfum", state: "caution" },
    ],
  },
  {
    id: "snail-mucin",
    name: "Snail Mucin",
    subtitle: "Filtrat hydratant axé sur la réparation",
    description: "Hydrate, adoucit et soutient une barrière cutanée d’apparence saine.",
    categories: ["hydration", "barrier"],
    tags: ["Hydratation", "Réparation", "Éclat"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#eef4ff] via-[#d5e4ff] to-[#fafcff]",
    icon: Droplets,
    benefits: [
      "Apporte une hydratation légère",
      "Aide la peau à paraître plus lisse",
      "Soutient le confort de la barrière cutanée",
    ],
    idealFor: ["Peau sèche", "Peau déshydratée", "Barrière fragilisée"],
    usage: "Utilisez après le nettoyage et avant la crème hydratante. Évitez si vous êtes allergique ou sensible aux produits dérivés de l’escargot.",
    compatibility: [
      { name: "Acide hyaluronique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Acides directs", state: "caution" },
    ],
  },
  {
    id: "beta-glucan",
    name: "Beta-Glucan",
    subtitle: "Soutien hydratant apaisant",
    description: "Hydrate et réconforte les peaux sensibles ou stressées.",
    categories: ["hydration", "sensitive", "barrier"],
    tags: ["Hydratation", "Apaisant", "Barrière"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#e7f2ff] via-[#cfe1ff] to-[#f8fbff]",
    icon: Droplets,
    benefits: [
      "Réconforte profondément la peau sèche",
      "Aide à réduire les tiraillements",
      "Soutient la récupération de la barrière cutanée",
    ],
    idealFor: ["Peau sensible", "Peau sèche", "Barrière fragilisée"],
    usage: "Utilisez matin ou soir. Excellent dans les sérums hydratants et crèmes apaisantes.",
    compatibility: [
      { name: "Panthénol", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Rétinol", state: "great" },
    ],
  },
  {
    id: "colloidal-oat",
    name: "Colloidal Oat",
    subtitle: "Ingrédient apaisant respectueux de la barrière cutanée",
    description: "Aide à calmer les sensations de sécheresse, de démangeaison ou d’irritation.",
    categories: ["sensitive", "barrier", "hydration"],
    tags: ["Apaisant", "Barrière", "Peau sèche"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f5ead7] via-[#e8d2ae] to-[#fffaf2]",
    icon: Heart,
    benefits: [
      "Apaise la peau sèche",
      "Soutient le confort de la barrière cutanée",
      "Aide à réduire les tiraillements et la rugosité",
    ],
    idealFor: ["Peau sensible", "Peau sèche", "Barrière fragilisée"],
    usage: "Utilisez quotidiennement dans les crèmes hydratantes ou soins apaisants.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Panthénol", state: "great" },
      { name: "Allantoin", state: "great" },
      { name: "Acides forts", state: "caution" },
    ],
  },
  {
    id: "tocopherol",
    name: "Vitamin E",
    subtitle: "Antioxydant et adoucissant cutané",
    description: "Soutient la protection antioxydante et aide à adoucir la peau.",
    categories: ["barrier", "hydration"],
    tags: ["Antioxydant", "Adoucissant", "Barrière"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#fff0cf] via-[#ffdea3] to-[#fff8eb]",
    icon: Sun,
    benefits: [
      "Soutient la protection antioxydante",
      "Aide à adoucir la peau sèche",
      "Se combine bien avec la vitamine C",
    ],
    idealFor: ["Peau sèche", "Teint terne", "Soutien de la barrière cutanée"],
    usage: "Utilisez matin ou soir. Peut sembler riche selon la formule.",
    compatibility: [
      { name: "Vitamine C", state: "great" },
      { name: "Acide férulique", state: "great" },
      { name: "Squalane", state: "great" },
      { name: "Peau grasse", state: "caution" },
    ],
  },
  {
    id: "ferulic-acid",
    name: "Acide férulique",
    subtitle: "Boosteur antioxydant",
    description: "Aide à stabiliser les formules antioxydantes et soutient la protection contre le stress environnemental.",
    categories: ["brightening"],
    tags: ["Antioxydant", "Éclat", "Protection"],
    badge: "À utiliser le matin",
    badgeTeint: "purple",
    accent: "from-[#ffe5c7] via-[#ffc88f] to-[#fff5e8]",
    icon: Sun,
    benefits: [
      "Renforce la protection antioxydante",
      "Se combine bien avec les vitamines C et E",
      "Soutient une peau plus lumineuse",
    ],
    idealFor: ["Teint terne", "Teint irrégulier", "City Pollution Exposure"],
    usage: "À utiliser idéalement le matin sous la protection solaire.",
    compatibility: [
      { name: "Vitamine C", state: "great" },
      { name: "Vitamin E", state: "great" },
      { name: "Protection solaire", state: "great" },
      { name: "Acides forts", state: "caution" },
    ],
  },
  {
    id: "resveratrol",
    name: "Resveratrol",
    subtitle: "Soutien antioxydant",
    description: "Aide à protéger la peau du stress environnemental et soutient l’éclat.",
    categories: ["brightening", "barrier"],
    tags: ["Antioxydant", "Éclat", "Protection"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f1ddff] via-[#dabaf8] to-[#fbf4ff]",
    icon: Sparkles,
    benefits: [
      "Soutient la défense antioxydante",
      "Aide à améliorer le teint terne",
      "Fonctionne bien dans les routines anti-âge",
    ],
    idealFor: ["Teint terne", "Peau mature", "Stress environnemental"],
    usage: "Utilisez matin ou soir. Le matin, associez à une protection solaire.",
    compatibility: [
      { name: "Vitamine C", state: "great" },
      { name: "Vitamin E", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Acides directs", state: "caution" },
    ],
  },
  {
    id: "caffeine",
    name: "Caffeine",
    subtitle: "Antioxydant anti-poches",
    description: "Souvent utilisé autour des yeux pour réduire l’apparence des poches.",
    categories: ["brightening"],
    tags: ["Anti-poches", "Contour des yeux", "Antioxydant"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f0dfd1] via-[#d8b89f] to-[#fff8f2]",
    icon: Sparkles,
    benefits: [
      "Aide à réduire l’apparence des poches",
      "Soutient une apparence plus reposée",
      "Apporte un soutien antioxydant",
    ],
    idealFor: ["Poches sous les yeux", "Teint terne", "Routine du matin"],
    usage: "Utilisez une petite quantité autour des yeux. Évitez tout contact avec les yeux.",
    compatibility: [
      { name: "Acide hyaluronique", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Peptides", state: "great" },
      { name: "Acides forts", state: "avoid" },
    ],
  },
  {
    id: "tea-tree-oil",
    name: "Huile d’arbre à thé",
    subtitle: "Huile botanique pour les imperfections",
    description: "Utilisée dans les produits ciblant l’acné, mais peut irriter les peaux sensibles.",
    categories: ["acne", "oily", "sensitive"],
    tags: ["Acné", "Botanique", "Risque d'irritation"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#d9f6df] via-[#b7e9c2] to-[#f4fff6]",
    icon: Leaf,
    benefits: [
      "Peut aider les peaux sujettes aux imperfections",
      "Souvent utilisé dans les soins localisés",
      "Peut soutenir les routines de contrôle du sébum",
    ],
    idealFor: ["Peau grasse", "Peau à tendance acnéique"],
    usage: "Utilisez uniquement dilué dans des produits formulés. Évitez si votre peau est sensible ou réactive.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Zinc PCA", state: "great" },
      { name: "Rétinol", state: "caution" },
      { name: "Acides AHA/BHA", state: "caution" },
      { name: "Peau sensible", state: "avoid" },
    ],
  },
  {
    id: "sulfur",
    name: "Sulfur",
    subtitle: "Actif anti-acné et régulateur de sébum",
    description: "Aide à réduire l’excès de sébum et à cibler les zones sujettes aux imperfections.",
    categories: ["acne", "oily"],
    tags: ["Acné", "Contrôle du sébum", "Soin ciblé"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#fff6c7] via-[#ffeca0] to-[#fffdf0]",
    icon: Leaf,
    benefits: [
      "Aide les zones grasses",
      "Peut réduire l’apparence des imperfections",
      "Souvent utilisé dans les masques ou soins localisés",
    ],
    idealFor: ["Peau grasse", "Peau à tendance acnéique"],
    usage: "Utilisez selon les instructions. Peut assécher, donc hydratez bien.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Masques à l’argile", state: "great" },
      { name: "Rétinol", state: "avoid" },
      { name: "Benzoyl Peroxide", state: "caution" },
      { name: "Acides AHA/BHA", state: "avoid" },
    ],
  },
  {
    id: "kaolin-clay",
    name: "Argile kaolin",
    subtitle: "Argile douce absorbant le sébum",
    description: "Absorbe l’excès de sébum et aide la peau à se sentir plus propre.",
    categories: ["oily", "acne"],
    tags: ["Contrôle du sébum", "Masque", "Pores"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f3eadf] via-[#dfccb8] to-[#fffaf4]",
    icon: Leaf,
    benefits: [
      "Absorbe l’excès de sébum",
      "Aide à réduire la brillance",
      "Peut donner temporairement une apparence de pores plus nets",
    ],
    idealFor: ["Peau grasse", "Peau mixte", "Peau congestionnée"],
    usage: "Utilisez en masque 1 à 2 fois par semaine. Ne laissez pas les masques à l’argile trop assécher la peau.",
    compatibility: [
      { name: "Acide salicylique", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Zinc PCA", state: "great" },
      { name: "Peau sèche", state: "caution" },
    ],
  },
  {
    id: "charcoal",
    name: "Charcoal",
    subtitle: "Ingrédient nettoyant absorbant le sébum",
    description: "Aide à éliminer l’excès de sébum et les impuretés à la surface de la peau.",
    categories: ["oily", "acne"],
    tags: ["Contrôle du sébum", "Nettoyant", "Pores"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#e5e5ea] via-[#c7c7d1] to-[#f8f8fb]",
    icon: Leaf,
    benefits: [
      "Aide à absorber le sébum",
      "Utile dans les nettoyants et masques",
      "Peut donner une sensation de peau nettoyée en profondeur",
    ],
    idealFor: ["Peau grasse", "Peau congestionnée"],
    usage: "Utilisez occasionnellement. Évitez l’excès si la peau tiraille ou devient sèche.",
    compatibility: [
      { name: "Argile kaolin", state: "great" },
      { name: "Acide salicylique", state: "great" },
      { name: "Céramides", state: "great" },
      { name: "Peau sèche", state: "caution" },
    ],
  },
  {
    id: "petrolatum",
    name: "Petrolatum",
    subtitle: "Hydratant occlusif riche",
    description: "Scelle l’hydratation et protège une barrière cutanée fragilisée.",
    categories: ["barrier", "hydration", "sensitive"],
    tags: ["Occlusif", "Barrière", "Peau sèche"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#f7edf0] via-[#ead5dc] to-[#fff9fb]",
    icon: Heart,
    benefits: [
      "Scelle l’hydratation",
      "Protège la peau sèche ou abîmée",
      "Excellent pour la récupération de la barrière cutanée",
    ],
    idealFor: ["Peau très sèche", "Barrière fragilisée", "Peau sensible"],
    usage: "Utilisez en dernière étape le soir ou sur les zones sèches. Peut sembler lourd pour les peaux grasses.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Panthénol", state: "great" },
      { name: "Acide hyaluronique", state: "great" },
      { name: "Peau grasse", state: "caution" },
    ],
  },
  {
    id: "minéral-oil",
    name: "Huile minérale",
    subtitle: "Émollient qui scelle l’hydratation",
    description: "Aide à limiter la perte d’eau et à adoucir la peau sèche.",
    categories: ["hydration", "barrier"],
    tags: ["Émollient", "Barrière", "Peau sèche"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#eef2ff] via-[#d8ddf2] to-[#fbfcff]",
    icon: Droplets,
    benefits: [
      "Aide à prévenir la perte en eau",
      "Adoucit la peau sèche",
      "Utile dans les crèmes hydratantes simples",
    ],
    idealFor: ["Peau sèche", "Peau sensible", "Soutien de la barrière cutanée"],
    usage: "Utilisez dans une crème hydratante ou un baume. Peut sembler trop riche pour les peaux grasses.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Glycérine", state: "great" },
      { name: "Panthénol", state: "great" },
      { name: "Peau à tendance acnéique", state: "caution" },
    ],
  },
  {
    id: "shea-butter",
    name: "Shea Butter",
    subtitle: "Beurre riche et nourrissant",
    description: "Adoucit la peau sèche et soutient la rétention d’hydratation.",
    categories: ["hydration", "barrier"],
    tags: ["Nourrissant", "Peau sèche", "Barrière"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#fff0d8] via-[#ffdcb5] to-[#fff9f0]",
    icon: Heart,
    benefits: [
      "Adoucit la peau sèche",
      "Soutient le confort de la barrière cutanée",
      "Ajoute de la richesse aux crèmes hydratantes",
    ],
    idealFor: ["Peau sèche", "Peau très sèche", "Barrière fragilisée"],
    usage: "Utilisez dans des crèmes ou baumes. Peut être trop riche pour les peaux grasses ou à tendance acnéique.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Squalane", state: "great" },
      { name: "Glycérine", state: "great" },
      { name: "Peau grasse", state: "caution" },
    ],
  },
  {
    id: "cholesterol",
    name: "Cholesterol",
    subtitle: "Lipide de la barrière cutanée",
    description: "Travaille avec les céramides et les acides gras pour soutenir la barrière cutanée.",
    categories: ["barrier", "hydration", "sensitive"],
    tags: ["Réparation de la barrière", "Lipides", "Peau sèche"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#fff3df] via-[#ffe2bd] to-[#fffaf3]",
    icon: Heart,
    benefits: [
      "Soutient la réparation de la barrière cutanée",
      "Aide à réduire la sécheresse",
      "Fonctionne bien dans les crèmes réparatrices",
    ],
    idealFor: ["Peau sèche", "Peau sensible", "Barrière fragilisée"],
    usage: "Utilisez quotidiennement dans les crèmes hydratantes, surtout lorsque la barrière cutanée semble fragilisée.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Acides gras", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Rétinol", state: "great" },
    ],
  },
  {
    id: "fatty-acids",
    name: "Acides gras",
    subtitle: "Lipides de soutien de la barrière cutanée",
    description: "Aident à nourrir la barrière cutanée et à réduire la sécheresse.",
    categories: ["barrier", "hydration"],
    tags: ["Barrière", "Lipides", "Hydratation"],
    badge: "Adapté aux débutants",
    badgeTeint: "green",
    accent: "from-[#ffe9d6] via-[#ffd0ad] to-[#fff8f0]",
    icon: Heart,
    benefits: [
      "Soutient la barrière cutanée",
      "Aide la peau à être douce et nourrie",
      "Fonctionne bien avec les céramides et le cholestérol",
    ],
    idealFor: ["Peau sèche", "Barrière fragilisée", "Peau sensible"],
    usage: "Utilisez quotidiennement dans les crèmes hydratantes ou huiles visage.",
    compatibility: [
      { name: "Céramides", state: "great" },
      { name: "Cholesterol", state: "great" },
      { name: "Squalane", state: "great" },
      { name: "Peau grasse", state: "caution" },
    ],
  },
  {
    id: "zinc-oxide",
    name: "Zinc Oxide",
    subtitle: "Filtre UV minéral",
    description: "Offre une protection solaire large et convient souvent aux peaux sensibles.",
    categories: ["sensitive", "barrier"],
    tags: ["Protection solaire", "Filtre minéral", "Protection"],
    badge: "À utiliser le matin",
    badgeTeint: "purple",
    accent: "from-[#f1f5ff] via-[#dfe8ff] to-[#fbfdff]",
    icon: Sun,
    benefits: [
      "Protège la peau de l’exposition aux UV",
      "Souvent adapté aux peaux sensibles",
      "Peut protéger les routines axées sur la barrière cutanée",
    ],
    idealFor: ["Peau sensible", "Tous types de peau", "Protection solaire quotidienne"],
    usage: "Utilisez chaque matin comme dernière étape de soin. Réappliquez si nécessaire.",
    compatibility: [
      { name: "Vitamine C", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Rétinol", state: "great" },
      { name: "Acides AHA/BHA", state: "great" },
    ],
  },
  {
    id: "titanium-dioxide",
    name: "Titanium Dioxide",
    subtitle: "Filtre UV minéral",
    description: "Aide à protéger la peau des rayons UV et est couramment utilisé dans les protections solaires.",
    categories: ["sensitive", "barrier"],
    tags: ["Protection solaire", "Filtre minéral", "Protection"],
    badge: "À utiliser le matin",
    badgeTeint: "purple",
    accent: "from-[#f7f4ff] via-[#e8e0ff] to-[#fcfbff]",
    icon: Sun,
    benefits: [
      "Soutient la protection UV",
      "Souvent doux pour les peaux sensibles",
      "Fonctionne bien dans les formules solaires minérales",
    ],
    idealFor: ["Peau sensible", "Protection solaire quotidienne", "Tous types de peau"],
    usage: "Appliquez chaque matin en dernière étape de la routine de soin.",
    compatibility: [
      { name: "Vitamine C", state: "great" },
      { name: "Niacinamide", state: "great" },
      { name: "Rétinol", state: "great" },
      { name: "Acides exfoliants", state: "great" },
    ],
  },
  {
    id: "fragrance",
    name: "Parfum",
    subtitle: "Ingrédient parfumant",
    description: "Ajoute une odeur, mais peut irriter les peaux sensibles ou réactives.",
    categories: ["sensitive"],
    tags: ["Parfum", "Risque d'irritation", "Peau sensible"],
    badge: "Irritant potentiel",
    badgeTeint: "orange",
    accent: "from-[#ffe4f1] via-[#ffc5df] to-[#fff7fb]",
    icon: Sparkles,
    benefits: [
      "Améliore l’odeur du produit",
      "Peut rendre une formule plus luxueuse",
      "Non nécessaire à l’efficacité cutanée",
    ],
    idealFor: ["Peau non sensible"],
    usage: "Évitez si votre peau est sensible, réactive ou sujette aux rougeurs.",
    compatibility: [
      { name: "Peau sensible", state: "avoid" },
      { name: "Barrière abîmée", state: "avoid" },
      { name: "Huiles essentielles", state: "caution" },
      { name: "Alcool dénaturé", state: "caution" },
    ],
  },
  {
    id: "essential-oils",
    name: "Huiles essentielles",
    subtitle: "Huiles végétales parfumées",
    description: "Peuvent ajouter une odeur et une sensorialité agréable, mais peuvent irriter les peaux sensibles.",
    categories: ["sensitive"],
    tags: ["Botanique", "Parfum", "Risque d'irritation"],
    badge: "Irritant potentiel",
    badgeTeint: "orange",
    accent: "from-[#e8f9dd] via-[#cceeb8] to-[#f8fff2]",
    icon: Leaf,
    benefits: [
      "Ajoute un parfum naturel",
      "Peut améliorer l’expérience sensorielle",
      "Non essentiel pour la santé de la peau",
    ],
    idealFor: ["Peau non sensible"],
    usage: "Utilisez avec prudence. Évitez le contour des yeux et évitez si votre peau est réactive.",
    compatibility: [
      { name: "Peau sensible", state: "avoid" },
      { name: "Rétinol", state: "caution" },
      { name: "Acides AHA/BHA", state: "caution" },
      { name: "Parfum", state: "caution" },
    ],
  },
  {
    id: "alcohol-denat",
    name: "Alcool dénaturé",
    subtitle: "Solvant à séchage rapide",
    description: "Rend les formules plus légères, mais peut dessécher ou irriter la peau.",
    categories: ["oily", "sensitive"],
    tags: ["Séchage rapide", "Risque d'irritation", "Contrôle du sébum"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#fff0e0] via-[#ffd5ad] to-[#fff8f0]",
    icon: Leaf,
    benefits: [
      "Aide les formules à sécher rapidement",
      "Peut réduire la sensation grasse",
      "Utile dans certaines formules solaires et anti-acné",
    ],
    idealFor: ["Peau très grasse"],
    usage: "Évitez l’usage fréquent si votre peau est sèche, sensible ou si sa barrière est fragilisée.",
    compatibility: [
      { name: "Peau grasse", state: "caution" },
      { name: "Peau sensible", state: "avoid" },
      { name: "Rétinol", state: "avoid" },
      { name: "Acides AHA/BHA", state: "avoid" },
    ],
  },
  {
    id: "witch-hazel",
    name: "Witch Hazel",
    subtitle: "Extrait botanique astringent",
    description: "Peut réduire la sensation grasse, mais peut être asséchant pour certaines peaux.",
    categories: ["oily", "sensitive"],
    tags: ["Contrôle du sébum", "Astringent", "Risque d'irritation"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#efe2ff] via-[#dac3f7] to-[#fbf7ff]",
    icon: Leaf,
    benefits: [
      "Peut réduire la brillance",
      "Donne une sensation de lotion fraîche",
      "Peut aider les peaux grasses à se sentir plus propres",
    ],
    idealFor: ["Peau grasse", "Peau mixte"],
    usage: "Utilisez avec prudence. Évitez les produits à l’hamamélis riches en alcool si votre peau est sensible.",
    compatibility: [
      { name: "Niacinamide", state: "great" },
      { name: "Zinc PCA", state: "great" },
      { name: "Peau sensible", state: "caution" },
      { name: "Rétinol", state: "avoid" },
      { name: "Acides AHA/BHA", state: "caution" },
    ],
  },
  {
    id: "coconut-oil",
    name: "Huile de coco",
    subtitle: "Huile émolliente riche",
    description: "Adoucit la peau sèche, mais peut sembler lourde et obstruer les pores chez certaines personnes.",
    categories: ["hydration"],
    tags: ["Émollient", "Riche", "Risque comédogène"],
    badge: "À utiliser avec prudence",
    badgeTeint: "orange",
    accent: "from-[#fff2df] via-[#ffdfb8] to-[#fffaf2]",
    icon: Droplets,
    benefits: [
      "Adoucit la peau sèche",
      "Apporte une sensation riche et nourrissante",
      "Peut aider à réduire la perte d’hydratation",
    ],
    idealFor: ["Peau très sèche", "Soin du corps"],
    usage: "Utilisez avec prudence sur le visage si vous avez une peau à tendance acnéique. Mieux adapté aux soins du corps.",
    compatibility: [
      { name: "Peau sèche", state: "great" },
      { name: "Soin du corps", state: "great" },
      { name: "Peau à tendance acnéique", state: "avoid" },
      { name: "Peau grasse", state: "avoid" },
    ],
  },
];


function badgeTeint(tone: Ingredient["badgeTeint"]) {
  if (tone === "green") return "border-[#d5f0de] bg-[#eefbf3] text-[#30945f]";
  if (tone === "orange") return "border-[#ffd9bf] bg-[#fff5eb] text-[#dc7a32]";
  return "border-[#ead9ff] bg-[#f7f1ff] text-[#8b58df]";
}

function compatTeint(state: CompatibiliteState) {
  if (state === "great") return "border-[#d8f0e1] bg-[#f4fcf7] text-[#2e9761]";
  if (state === "caution") return "border-[#ffe0c8] bg-[#fff7ef] text-[#de7c36]";
  return "border-[#ffd7dc] bg-[#fff4f6] text-[#e05e74]";
}

export default function IngredientLibraryPage() {
  const { locale } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedId, setSelectedId] = useState(ingredients[0].id);
  const [detailOpen, setDetailOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const rootRef = useRef<HTMLElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const detailWrapRef = useRef<HTMLDivElement | null>(null);
  const detailPanelRef = useRef<HTMLElement | null>(null);
  const hasAnimatedDetailRef = useRef(false);
  const router = useRouter()
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);


  useEffect(() => {
    document.body.dataset.navbarHidden = "true";
    const storedTheme = window.localStorage.getItem("skinorai_chat_theme");
    const timeoutId = window.setTimeout(() => {
      if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      delete document.body.dataset.navbarHidden;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("skinorai_chat_theme", theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedIngredient = params.get("ingredient");
    const requestedSearch = params.get("search");
    const normalizedIngredient = requestedIngredient?.toLowerCase();
    const normalizedSearch = requestedSearch?.toLowerCase();
    const match = ingredients.find((ingredient) =>
      ingredient.id.toLowerCase() === normalizedIngredient ||
      ingredient.name.toLowerCase() === normalizedIngredient ||
      ingredient.id.toLowerCase() === normalizedSearch ||
      ingredient.name.toLowerCase() === normalizedSearch,
    );

    if (requestedSearch) setQuery(requestedSearch);
    if (match) {
      setSelectedCategory("all");
      setSelectedId(match.id);
      setDetailOpen(true);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadHistory = async () => {
      setIsHistoryLoading(true);

      try {
        const scans = await requestScanHistory();
        if (!isCancelled) {
          setScanHistory(scans);
        }
      } catch {
        if (!isCancelled) {
          setScanHistory([]);
        }
      } finally {
        if (!isCancelled) {
          setIsHistoryLoading(false);
        }
      }
    };

    void loadHistory();

    return () => {
      isCancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-animate='library-card']");
      const infoBlocks = gsap.utils.toArray<HTMLElement>("[data-animate='library-info']");

      gsap.set(cards, { opacity: 1, y: 0 });
      gsap.set(infoBlocks, { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(sidebarRef.current, {
        x: -34,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          headerRef.current,
          {
            y: -18,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.38",
        )
        .from(
          "[data-animate='library-hero']",
          {
            y: 22,
            opacity: 0,
            duration: 0.55,
          },
          "-=0.2",
        )
        .from(
          "[data-animate='library-search'], [data-animate='library-filters'], [data-animate='library-meta']",
          {
            y: 18,
            opacity: 0,
            duration: 0.42,
            stagger: 0.08,
          },
          "-=0.28",
        )
        .fromTo(
          cards,
          {
            y: 26,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.46,
            stagger: 0.05,
            clearProps: "transform,opacity",
          },
          "-=0.18",
        )
        .from(
          "[data-animate='library-detail']",
          {
            x: 26,
            opacity: 0,
            duration: 0.55,
          },
          "-=0.4",
        )
        .fromTo(
          infoBlocks,
          {
            y: 16,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.38,
            stagger: 0.05,
            clearProps: "transform,opacity",
          },
          "-=0.32",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  const isSombre = theme === "dark";
  const historyDiscussions = [...scanHistory]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 6);
  const filtered = ingredients.filter((ingredient) => {
    const categoryMatch = selectedCategory === "all" || ingredient.categories.includes(selectedCategory);
    const queryMatch = `${normalizeDisplayText(ingredient.name)} ${normalizeDisplayText(ingredient.description)} ${ingredient.tags.map(normalizeDisplayText).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && queryMatch;
  });
  const selected = filtered.find((ingredient) => ingredient.id === selectedId) ?? filtered[0] ?? ingredients[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    const wrap = detailWrapRef.current;
    const panel = detailPanelRef.current;
    if (!wrap || !panel) return;

    const desktop = window.matchMedia("(min-width: 1280px)").matches;

    if (!hasAnimatedDetailRef.current) {
      hasAnimatedDetailRef.current = true;
      gsap.set(wrap, desktop ? { width: detailOpen ? 360 : 0, overflow: "hidden" } : { overflow: "hidden" });
      gsap.set(panel, detailOpen ? { opacity: 1, x: 0, y: 0 } : desktop ? { opacity: 0, x: 32 } : { opacity: 0, y: 24 });
      return;
    }

    if (detailOpen) {
      if (desktop) {
        gsap.killTweensOf(wrap);
        gsap.to(wrap, { width: 360, duration: 0.34, ease: "power2.out" });
      }

      gsap.fromTo(
        panel,
        desktop ? { x: 32, opacity: 0 } : { y: 24, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.36,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );

      return;
    }

    gsap.to(panel, {
      x: desktop ? 32 : 0,
      y: desktop ? 0 : 24,
      opacity: 0,
      duration: 0.24,
      ease: "power2.in",
    });

    if (desktop) {
      gsap.killTweensOf(wrap);
      gsap.to(wrap, { width: 0, duration: 0.3, ease: "power2.inOut", delay: 0.04 });
    }
  }, [detailOpen, selectedId]);

  const shellClass = isSombre ? "bg-[#080912] text-white" : "bg-[#fffdfd] text-[#221d35]";
  const overlayClass = isSombre
    ? "bg-[radial-gradient(circle_at_top,_rgba(180,120,230,0.16),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(74,144,226,0.14),_transparent_30%)]"
    : "bg-[radial-gradient(circle_at_top,_rgba(215,160,229,0.16),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(255,214,230,0.22),_transparent_28%)]";

  return (
    <main ref={rootRef} className={`h-screen overflow-hidden [&_button:not(:disabled)]:cursor-pointer ${shellClass}`}>
      <div className={`pointer-events-none fixed inset-0 ${overlayClass}`} />
      <div className="relative flex h-screen w-full">
        <aside ref={sidebarRef} data-animate="library-sidebar" className={`hidden w-[285px] shrink-0 flex-col px-5 py-4 backdrop-blur-2xl lg:flex ${isSombre ? "border-r border-white/10 bg-[#0d0f18]/90" : "border-r border-[#eadff7] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(249,245,255,0.92)_100%)]"}`}>
          <div className="flex items-center justify-between">
            <Image onClick={() => router.push('/')} src="/logo.png" alt="SkinorAI" width={150} height={36} className={`h-8 w-auto cursor-pointer ${isSombre ? "brightness-[1.35]" : ""}`} priority />
            <button type="button" onClick={() => setIsSidebarOpen(false)} style={{ display: "none" }} className={`rounded-lg border md:block p-1.5 transition ${isSombre ? "border-white/10 bg-white/[0.04] text-white/70" : "border-[#eadff7] bg-white/85 text-[#6f6489]"}`}>
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
          <Link href="/scan" onClick={() => setIsSidebarOpen(false)} className="mt-6 flex h-[45px] items-center gap-3 rounded-xl bg-gradient-to-r from-[#F7DDE8] via-[#F3D4E3] to-[#EEDAF7] px-5 text-sm font-medium text-[#7A3F5C] shadow-[0_10px_24px_rgba(122,63,92,0.10)] transition hover:-translate-y-0.5">
            <Plus className="h-5 w-5" />
            {tr("Nouvelle discussion")}
          </Link>
          <div className="mt-6">
            <p className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isSombre ? "text-white/35" : "text-[#968da9]"}`}>{tr("Menu")}</p>
            <nav className="mt-3 space-y-2">
              <Link href="/scan" onClick={() => setIsSidebarOpen(false)} className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium transition ${isSombre ? "text-white/70 hover:bg-white/[0.05]" : "text-[#5c5671] hover:bg-[#f6f1ff]"}`}>
                <CircleHelp className="h-5 w-5" />
                {tr("Discussions")}
              </Link>
              <div className={`relative flex h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium ${isSombre ? "bg-white/[0.08] text-white" : "bg-[#f6f1ff] text-[#231f36] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"}`}>
                <span className="absolute -left-5 h-8 w-1 rounded-full bg-[#ef8fdf]" />
                <FlaskConical className="h-5 w-5" />
                {tr("Bibliothèque d'ingrédients")}
              </div>
            </nav>
          </div>
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <p className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isSombre ? "text-white/35" : "text-[#968da9]"}`}>{tr("Récent")}</p>
            <div className="mt-3 space-y-2">
              {isHistoryLoading ? (
                <p className={`rounded-xl border px-3 py-2.5 text-xs ${isSombre ? "border-white/10 bg-white/[0.04] text-white/60" : "border-[#ece5f7] bg-white/90 text-[#7c7693]"}`}>
                  {tr("Chargement des discussions...")}
                </p>
              ) : historyDiscussions.length > 0 ? (
                historyDiscussions.map((chat) => (
                  <Link key={chat.id} href={`/scan?chat=${chat.id}`} onClick={() => setIsSidebarOpen(false)} className={`block rounded-xl border px-3 py-2.5 transition hover:-translate-y-0.5 ${isSombre ? "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.06]" : "border-[#ece5f7] bg-white/90 text-[#7c7693] hover:bg-[#fbf8ff]"}`}>
                    <p className={`truncate text-sm font-medium ${isSombre ? "text-white" : "text-[#221d35]"}`}>
                      {chat.productName || tr("Discussion enregistrée")}
                    </p>
                    <p className="mt-1 text-sm">{formatScanHistoryDate(chat.updatedAt || chat.createdAt)}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-5">
                      {chat.analysisSummary || tr("Discussion enregistrée dans votre historique SkinorAI.")}
                    </p>
                  </Link>
                ))
              ) : (
                <p className={`rounded-xl border px-3 py-2.5 text-xs leading-5 ${isSombre ? "border-white/10 bg-white/[0.04] text-white/60" : "border-[#ece5f7] bg-white/90 text-[#7c7693]"}`}>
                  {tr("Aucune discussion pour le moment. Lancez un scan pour alimenter cette liste.")}
                </p>
              )}
            </div>
          </div>
          <div className={`mt-4 rounded-2xl p-4 text-center ${isSombre ? "border border-white/10 bg-white/[0.05]" : "border border-[#ecdff7] bg-[linear-gradient(180deg,#fbf7ff_0%,#f7effa_100%)] shadow-[0_14px_38px_rgba(136,101,184,0.12)]"}`}>
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#f0a4db]/25 bg-transparent text-[#f3a6d6]"><Sparkles className="h-4 w-4" /></span>
            <h2 className={`mt-3 text-sm font-semibold ${isSombre ? "text-[#f0a8d9]" : "text-[#b1689b]"}`}>{tr("Débloquer Premium")}</h2>
            <p className={`mt-2 text-sm leading-5 ${isSombre ? "text-white/60" : "text-[#7d7792]"}`}>{tr("Obtenez des analyses plus poussées, des scans illimités et des routines personnalisées.")}</p>
            <button type="button" className="mt-4 h-10 w-full rounded-xl bg-[linear-gradient(135deg,#c882bf_0%,#e7a0cf_100%)] text-sm font-semibold text-white shadow-[0_10px_22px_rgba(198,111,177,0.18)]">{tr("Passer à Premium")}</button>
          </div>
        </aside>
        <div className={`fixed inset-0 z-40 bg-[#120d20]/30 backdrop-blur-[4px] transition lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsSidebarOpen(false)} />
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-[285px] max-w-[88vw] flex-col px-5 py-4 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isSombre ? "border-r border-white/10 bg-[#0d0f18]/90" : "border-r border-[#eadff7] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(249,245,255,0.92)_100%)]"}`}>
          <div className="flex items-center justify-between">
            <Image src="/logo.png" alt="SkinorAI" width={150} height={36} className={`h-8 w-auto ${isSombre ? "brightness-[1.35]" : ""}`} priority />
            <button type="button" onClick={() => setIsSidebarOpen(false)} className={`rounded-lg border p-1.5 transition ${isSombre ? "border-white/10 bg-white/[0.04] text-white/70" : "border-[#eadff7] bg-white/85 text-[#6f6489]"}`}>
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
          <Link href="/scan" onClick={() => setIsSidebarOpen(false)} className="mt-6 flex h-[45px] items-center gap-3 rounded-xl bg-gradient-to-r from-[#F7DDE8] via-[#F3D4E3] to-[#EEDAF7] px-5 text-sm font-medium text-[#7A3F5C] shadow-[0_10px_24px_rgba(122,63,92,0.10)] transition hover:-translate-y-0.5">
            <Plus className="h-5 w-5" />
            {tr("Nouvelle discussion")}
          </Link>
          <div className="mt-6">
            <p className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isSombre ? "text-white/35" : "text-[#968da9]"}`}>{tr("Menu")}</p>
            <nav className="mt-3 space-y-2">
              <Link href="/scan" onClick={() => setIsSidebarOpen(false)} className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium transition ${isSombre ? "text-white/70 hover:bg-white/[0.05]" : "text-[#5c5671] hover:bg-[#f6f1ff]"}`}>
                <CircleHelp className="h-5 w-5" />
                {tr("Discussions")}
              </Link>
              <div className={`relative flex h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium ${isSombre ? "bg-white/[0.08] text-white" : "bg-[#f6f1ff] text-[#231f36] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"}`}>
                <span className="absolute -left-5 h-8 w-1 rounded-full bg-[#ef8fdf]" />
                <FlaskConical className="h-5 w-5" />
                {tr("Bibliothèque d'ingrédients")}
              </div>
            </nav>
          </div>
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <p className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isSombre ? "text-white/35" : "text-[#968da9]"}`}>{tr("Récent")}</p>
            <div className="mt-3 space-y-2">
              {isHistoryLoading ? (
                <p className={`rounded-xl border px-3 py-2.5 text-xs ${isSombre ? "border-white/10 bg-white/[0.04] text-white/60" : "border-[#ece5f7] bg-white/90 text-[#7c7693]"}`}>
                  {tr("Chargement des discussions...")}
                </p>
              ) : historyDiscussions.length > 0 ? (
                historyDiscussions.map((chat) => (
                  <Link key={chat.id} href={`/scan?chat=${chat.id}`} onClick={() => setIsSidebarOpen(false)} className={`block rounded-xl border px-3 py-2.5 transition hover:-translate-y-0.5 ${isSombre ? "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.06]" : "border-[#ece5f7] bg-white/90 text-[#7c7693] hover:bg-[#fbf8ff]"}`}>
                    <p className={`truncate text-sm font-medium ${isSombre ? "text-white" : "text-[#221d35]"}`}>
                      {chat.productName || tr("Discussion enregistrée")}
                    </p>
                    <p className="mt-1 text-sm">{formatScanHistoryDate(chat.updatedAt || chat.createdAt)}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-5">
                      {chat.analysisSummary || tr("Discussion enregistrée dans votre historique SkinorAI.")}
                    </p>
                  </Link>
                ))
              ) : (
                <p className={`rounded-xl border px-3 py-2.5 text-xs leading-5 ${isSombre ? "border-white/10 bg-white/[0.04] text-white/60" : "border-[#ece5f7] bg-white/90 text-[#7c7693]"}`}>
                  {tr("Aucune discussion pour le moment. Lancez un scan pour alimenter cette liste.")}
                </p>
              )}
            </div>
          </div>
          <div className={`mt-4 rounded-2xl p-4 text-center ${isSombre ? "border border-white/10 bg-white/[0.05]" : "border border-[#ecdff7] bg-[linear-gradient(180deg,#fbf7ff_0%,#f7effa_100%)] shadow-[0_14px_38px_rgba(136,101,184,0.12)]"}`}>
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#f0a4db]/25 bg-transparent text-[#f3a6d6]"><Sparkles className="h-4 w-4" /></span>
            <h2 className={`mt-3 text-sm font-semibold ${isSombre ? "text-[#f0a8d9]" : "text-[#b1689b]"}`}>{tr("Débloquer Premium")}</h2>
            <p className={`mt-2 text-sm leading-5 ${isSombre ? "text-white/60" : "text-[#7d7792]"}`}>{tr("Obtenez des analyses plus poussées, des scans illimités et des routines personnalisées.")}</p>
            <button type="button" className="mt-4 h-10 w-full rounded-xl bg-[linear-gradient(135deg,#c882bf_0%,#e7a0cf_100%)] text-sm font-semibold text-white shadow-[0_10px_22px_rgba(198,111,177,0.18)]">{tr("Passer à Premium")}</button>
          </div>
        </aside>

        <section className="relative min-w-0 flex-1 overflow-y-auto px-5 pb-8 pt-4 lg:px-7">
          <header ref={headerRef} data-animate="library-header" className="flex items-center justify-between">
            <button type="button" onClick={() => setIsSidebarOpen(true)} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden ${isSombre ? "border-white/10 bg-white/[0.04] text-white" : "border-[#e7def4] bg-white/85 text-[#2a2440]"}`}>
              <PanelLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))} className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium backdrop-blur transition ${isSombre ? "border-white/10 bg-white/[0.04] text-white" : "border-[#e7def4] bg-white/85 text-[#2a2440]"}`}>
                {isSombre ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isSombre ? tr("Clair") : tr("Sombre")}
              </button>
              <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-medium transition ${isSombre ? "border-white/10 bg-white/[0.04] text-white" : "border-[#e7def4] bg-white/85 text-[#2a2440]"}`}>
                {tr("Paramètres")}
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className={`mx-auto grid min-h-[calc(100vh-76px)] gap-6 pt-7 ${detailOpen ? "xl:grid-cols-[minmax(0,1fr)_360px]" : "xl:grid-cols-1"}`}>
            <div className="min-w-0">
              <div data-animate="library-hero" className="flex items-start gap-4">
                <span className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-[18px] border shadow-[0_18px_35px_rgba(190,137,222,0.12)] ${isSombre ? "border-white/10 bg-white/[0.05] text-[#eea2d1]" : "border-[#f0ddfb] bg-[linear-gradient(180deg,#fff8ff_0%,#f7ecff_100%)] text-[#b25add]"}`}><FlaskConical className="h-7 w-7" /></span>
                <div>
                  <h1 className={`text-[34px] font-semibold tracking-[-0.04em] ${isSombre ? "text-white" : "text-[#241f36]"}`}>{tr("Bibliothèque d'ingrédients")}</h1>
                  <p className={`mt-2 max-w-2xl text-sm leading-6 ${isSombre ? "text-white/60" : "text-[#7d7792]"}`}>{tr("Découvrez, apprenez et créez des routines plus intelligentes avec des ingrédients adaptés à votre peau.")}</p>
                </div>
              </div>

              <div data-animate="library-search" className={`mt-8 flex items-center gap-3 rounded-[24px] border px-5 py-4 shadow-[0_18px_45px_rgba(136,101,184,0.10)] ${isSombre ? "border-white/10 bg-[#14111d]" : "border-[#ead8ef] bg-white/90"}`}>
                <Search className={`h-5 w-5 shrink-0 ${isSombre ? "text-white/45" : "text-[#8f88a5]"}`} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Rechercher niacinamide, rétinol, acide salicylique...")} className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${isSombre ? "text-white placeholder:text-white/35" : "text-[#33243c] placeholder:text-[#8f88a5]"}`} />
                <button type="button" className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${isSombre ? "border-white/10 bg-white/[0.04] text-white/70" : "border-[#ead8ef] bg-[#fbf6ff] text-[#7c58de]"}`}><Settings className="h-4 w-4" /></button>
              </div>

              <div data-animate="library-filters" className="mt-6 flex flex-wrap items-center gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = category.id === selectedCategory;
                  return (
                    <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${active ? (isSombre ? "border-[#dfb7fb] bg-[#3c294f] text-white" : "border-[#edd8ff] bg-[linear-gradient(135deg,#f7dbe7_0%,#f0e2ff_100%)] text-[#6e40c9]") : (isSombre ? "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]" : "border-[#ece4f8] bg-white text-[#665f7f] hover:bg-[#fbf6ff]")}`}>
                      <Icon className="h-4 w-4" />
                      {tr(category.label)}
                    </button>
                  );
                })}
                <button type="button" className={`ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border ${isSombre ? "border-white/10 bg-white/[0.03] text-white/70" : "border-[#ece4f8] bg-white text-[#665f7f]"}`}><ChevronRight className="h-4 w-4" /></button>
              </div>

              <div data-animate="library-meta" className={`mt-6 flex items-center justify-between text-sm ${isSombre ? "text-white/55" : "text-[#7d7792]"}`}>
                <p>{filtered.length} {tr("ingrédients trouvés")}</p>
                <button type="button" className="inline-flex items-center gap-2">{tr("Trier par")} : <span className={isSombre ? "text-white" : "text-[#36294a]"}>{tr("Pertinence")}</span><ChevronDown className="h-4 w-4" /></button>
              </div>

              <div className={`mt-5 grid gap-4 md:grid-cols-2 ${detailOpen ? "2xl:grid-cols-3" : "xl:grid-cols-3 2xl:grid-cols-4"}`}>
                {filtered.map((ingredient) => {
                  const Icon = ingredient.icon;
                  const active = ingredient.id === selected.id;
                  return (
                    <button data-animate="library-card" key={ingredient.id} type="button" onClick={() => { setSelectedId(ingredient.id); setDetailOpen(true); }} className={`rounded-[28px] border p-5 text-left shadow-[0_18px_45px_rgba(136,101,184,0.08)] transition hover:-translate-y-1 ${active ? (isSombre ? "border-[#d1a1ff] bg-[#16111f]" : "border-[#dbb7f7] bg-[linear-gradient(180deg,#fffdfd_0%,#fff8ff_100%)]") : (isSombre ? "border-white/10 bg-white/[0.03]" : "border-[#eee6f9] bg-white/92")}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className={`flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br ${ingredient.accent} shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`}><span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/60 backdrop-blur"><Icon className="h-7 w-7 text-[#cd6ca7]" /></span></div>
                        {active && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b35de0] text-white"><Check className="h-3.5 w-3.5" /></span>}
                      </div>
                      <h2 className={`mt-5 text-[29px]/none font-semibold tracking-[-0.03em] ${isSombre ? "text-white" : "text-[#231d37]"}`}>{tr(ingredient.name)}</h2>
                      <p className={`mt-2 text-sm leading-6 ${isSombre ? "text-white/55" : "text-[#7d7792]"}`}>{tr(ingredient.description)}</p>
                      <div className="mt-4 flex flex-wrap gap-2">{ingredient.tags.map((tag) => <span key={tag} className={`rounded-full border px-3 py-1 text-xs ${isSombre ? "border-white/10 bg-white/[0.05] text-white/65" : "border-[#efe5fb] bg-[#fbf8ff] text-[#8c71c7]"}`}>{tr(tag)}</span>)}</div>
                      <div className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${badgeTeint(ingredient.badgeTeint)}`}>{ingredient.badgeTeint === "orange" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Leaf className="h-3.5 w-3.5" />}{tr(ingredient.badge)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div ref={detailWrapRef} className={`overflow-hidden xl:shrink-0 ${detailOpen ? "xl:justify-self-end" : "xl:justify-self-stretch"}`} style={{ width: detailOpen ? undefined : undefined }}>
              <aside ref={detailPanelRef} data-animate="library-detail" aria-hidden={!detailOpen} className={`w-full xl:w-[360px] rounded-[32px] border p-5 shadow-[0_24px_60px_rgba(136,101,184,0.12)] ${isSombre ? "border-white/10 bg-[#11101a]" : "border-[#eee4f7] bg-[linear-gradient(180deg,#fffefe_0%,#fff8ff_100%)]"}`}>
                <div className="flex justify-end"><button type="button" onClick={() => setDetailOpen(false)} className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isSombre ? "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]" : "border-[#eadcf5] bg-white text-[#6c6286] hover:bg-[#faf4ff]"}`}><X className="h-5 w-5" /></button></div>
                <div className="mt-2 flex items-start gap-4">
                  <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-gradient-to-br ${selected.accent} shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`}><SelectedIcon className="h-9 w-9 text-[#cd6ca7]" /></div>
                  <div className="min-w-0">
                    <h2 className={`text-[22px] font-semibold tracking-[-0.03em] ${isSombre ? "text-white" : "text-[#221d35]"}`}>{tr(selected.name)}</h2>
                    <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${badgeTeint(selected.badgeTeint)}`}><Leaf className="h-3.5 w-3.5" />{tr(selected.badge)}</div>
                    <p className={`mt-3 text-sm ${isSombre ? "text-white/55" : "text-[#7d7792]"}`}>{tr(selected.subtitle)}</p>
                  </div>
                </div>
                <section data-animate="library-info" className="mt-8"><h3 className={`flex items-center gap-2 text-lg font-semibold ${isSombre ? "text-white" : "text-[#2a2440]"}`}><Sparkles className="h-4.5 w-4.5 text-[#b566dd]" />{tr("Bienfaits clés")}</h3><div className="mt-4 space-y-3">{selected.benefits.map((benefit) => <div key={benefit} className="flex gap-3"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2e6ff] text-[#a459db]"><Check className="h-3 w-3" /></span><p className={`text-sm leading-6 ${isSombre ? "text-white/70" : "text-[#625a79]"}`}>{tr(benefit)}</p></div>)}</div></section>
                <section data-animate="library-info" className="mt-8"><h3 className={`flex items-center gap-2 text-lg font-semibold ${isSombre ? "text-white" : "text-[#2a2440]"}`}><UserRound className="h-4.5 w-4.5 text-[#b566dd]" />{tr("Idéal pour")}</h3><div className="mt-4 flex flex-wrap gap-2">{selected.idealFor.map((item) => <span key={item} className={`rounded-full border px-3 py-1.5 text-xs ${isSombre ? "border-white/10 bg-white/[0.05] text-white/70" : "border-[#efe5fb] bg-[#fbf8ff] text-[#8c71c7]"}`}>{tr(item)}</span>)}</div></section>
                <section data-animate="library-info" className="mt-8"><h3 className={`flex items-center gap-2 text-lg font-semibold ${isSombre ? "text-white" : "text-[#2a2440]"}`}><BadgeInfo className="h-4.5 w-4.5 text-[#b566dd]" />{tr("Conseils d'utilisation")}</h3><p className={`mt-4 text-sm leading-6 ${isSombre ? "text-white/65" : "text-[#625a79]"}`}>{tr(selected.usage)}</p></section>
                <section data-animate="library-info" className={`mt-8 border-t pt-6 ${isSombre ? "border-white/10" : "border-[#f0e5f7]"}`}><div className="flex items-center justify-between gap-3"><h3 className={`flex items-center gap-2 text-lg font-semibold ${isSombre ? "text-white" : "text-[#2a2440]"}`}><Heart className="h-4.5 w-4.5 text-[#b566dd]" />{tr("Compatibilité")}</h3><div className={`flex flex-wrap items-center gap-3 text-[11px] ${isSombre ? "text-white/50" : "text-[#7b7390]"}`}><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#43c57a]" />{tr("Excellent")}</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f0a13b]" />{tr("À utiliser avec prudence")}</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ef6e86]" />{tr("Éviter")}</span></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{selected.compatibility.map((item) => <div key={item.name} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${compatTeint(item.state)}`}><span>{tr(item.name)}</span><span className="h-2.5 w-2.5 rounded-full bg-current" /></div>)}</div></section>
                <button type="button" className={`mt-8 inline-flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${isSombre ? "border-white/10 bg-white/[0.04] text-white" : "border-[#eadcf5] bg-[#fbf7ff] text-[#7b4edf]"}`}>{tr("Voir l'analyse détaillée de l'ingrédient")}<ChevronRight className="h-4 w-4" /></button>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
