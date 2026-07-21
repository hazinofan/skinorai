"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Download,
  Droplet,
  EyeOff,
  FlaskConical,
  Leaf,
  Lightbulb,
  Lock,
  LoaderCircle,
  LogOut,
  Mic,
  Moon,
  MoreVertical,
  PanelLeft,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  SquareDashed,
  Target,
  TextCursorInput,
  UploadCloud,
  Upload,
  Sun,
  UserRound,
  X,
  Zap,
  ScanBarcode,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { ChangeEvent, DragEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { getStoredAuthToken, useAuth } from "@/components/AuthProvider";
import { translateStaticText, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { normalizeSkinGoalId, SKIN_GOAL_STORAGE_KEY } from "@/lib/skinGoals";
import FaceScanDialog from "@/components/scan/FaceScanDialog";

const stepLabels = [
  "Objectif peau",
  "Importer l'étiquette",
  "Ingrédients détectés",
  "Résultat IA",
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
    positiveMatches: [
      "glycerin",
      "hyaluron",
      "panthenol",
      "betaine",
      "urea",
      "aloe",
    ],
    tips: [
      "Appliquez sur peau legerement humide.",
      "Scellez ensuite avec une creme hydratante.",
      "Utilisez un SPF le matin.",
    ],
    questions: [
      "Puis-je utiliser ce produit avec du retinol ?",
      "Est-ce un bon choix pour une peau deshydratee ?",
    ],
    nextStep:
      "Utilisez 2 a 3 fois par semaine au debut, puis augmentez si votre peau reste confortable.",
  },
  {
    id: "acne",
    label: "Acne & imperfections",
    image: "/icons/acne.png",
    accentLabel: "cibler les imperfections",
    icon: Sparkles,
    positiveMatches: [
      "salicy",
      "niacinamide",
      "zinc",
      "sulfur",
      "tea tree",
      "azela",
    ],
    tips: [
      "Introduisez le produit progressivement.",
      "Evitez de le superposer avec trop d actifs irritants.",
      "Hydratez bien la peau pour proteger la barriere.",
    ],
    questions: [
      "Ce produit aide-t-il pour les boutons inflammatoires ?",
      "Puis-je l utiliser le meme jour qu un exfoliant ?",
    ],
    nextStep:
      "Commencez doucement et observez si la formule aide sans augmenter la sensibilite.",
  },
  {
    id: "barrier",
    label: "Reparation de la barriere",
    image: "/icons/reparation.png",
    accentLabel: "renforcer la barriere cutanee",
    icon: ShieldCheck,
    positiveMatches: [
      "ceramide",
      "panthenol",
      "squalane",
      "cholesterol",
      "centella",
      "oat",
    ],
    tips: [
      "Favorisez une routine simple pendant quelques jours.",
      "Evitez les exfoliants forts si la peau est reactive.",
      "Appliquez sur peau propre avec des gestes doux.",
    ],
    questions: [
      "Est-ce adapte apres une irritation ?",
      "Ce produit soutient-il une barriere abimee ?",
    ],
    nextStep:
      "Associez-le a des formules simples et evitez les actifs trop puissants le meme jour.",
  },
  {
    id: "redness",
    label: "Rougeurs",
    image: "/icons/rougeurs.png",
    accentLabel: "apaiser les rougeurs",
    icon: Lightbulb,
    positiveMatches: [
      "allantoin",
      "centella",
      "panthenol",
      "bisabolol",
      "aloe",
      "oat",
    ],
    tips: [
      "Testez d abord sur une petite zone.",
      "Evitez l eau trop chaude apres application.",
      "Associez-le a une routine tres douce.",
    ],
    questions: [
      "Ce produit convient-il a une peau sensible ?",
      "Y a-t-il des ingredients qui peuvent aggraver les rougeurs ?",
    ],
    nextStep:
      "Si votre peau reagit facilement, utilisez-le seul pendant quelques jours pour evaluer la tolerance.",
  },
  {
    id: "oily",
    label: "Peau grasse",
    image: "/icons/hydratation.png",
    accentLabel: "equilibrer l exces de sebum",
    icon: Target,
    positiveMatches: [
      "niacinamide",
      "zinc",
      "salicy",
      "green tea",
      "clay",
      "tea tree",
    ],
    tips: [
      "Appliquez en fine couche pour eviter l effet lourd.",
      "Ne sautez pas l hydratation meme si la peau est grasse.",
      "Surveillez si le produit laisse un fini confortable.",
    ],
    questions: [
      "Ce produit risque-t-il de boucher les pores ?",
      "Est-ce une bonne option pour limiter la brillance ?",
    ],
    nextStep:
      "Observez le fini sur la zone T et combinez-le avec une routine legere et non comedogene.",
  },
  {
    id: "morning",
    label: "Routine du matin",
    image: "/icons/routine-matin.png",
    accentLabel: "optimiser la routine du matin",
    icon: Zap,
    positiveMatches: [
      "vitamin c",
      "niacinamide",
      "caffeine",
      "green tea",
      "hyaluron",
      "glycerin",
    ],
    tips: [
      "Superposez du plus leger au plus riche.",
      "Terminez toujours par un SPF.",
      "Gardez la routine simple pour gagner du temps le matin.",
    ],
    questions: [
      "Ce produit se combine-t-il bien avec la vitamine C ?",
      "Est-ce une bonne etape avant la creme solaire ?",
    ],
    nextStep:
      "Utilisez-le dans une routine courte et verifiez qu il se superpose bien sous la protection solaire.",
  },
];

type IngredientStatus = "OK" | "À surveiller";

type IngredientItem = {
  name: string;
  status: IngredientStatus;
};

type UploadedImage = {
  id: string;
  file: File;
  url: string;
};

type ScanVerdict =
  | "excellent_match"
  | "good_choice"
  | "use_with_caution"
  | "not_ideal";

type PositiveDetail = {
  ingredient: string;
  reason: string;
  tag: string;
};

type WatchoutDetail = {
  ingredient: string;
  reason: string;
  severity: "low" | "medium" | "high";
};

type QuotaStatus = {
  planStatus: PlanStatus;
  freeScanLimit: number;
  freeScansUsed: number;
  freeScansRemaining: number;
  freePromptLimit: number;
  promptCount: number;
  promptsRemaining: number;
};

type AnalysisResult = {
  score: number;
  verdict: ScanVerdict;
  verdictLabel: string;
  summary: string;
  positives: PositiveDetail[];
  watchouts: WatchoutDetail[];
  recommendations: string[];
  nextStep: string;
  followUpQuestions: string[];
  disclaimer: string;
  scanId?: string;
  quota?: QuotaStatus;
};

type LibrarySuggestions = {
  products: Array<{
    id: string;
    slug: string;
    name: string;
    brand: string;
    imagePath: string;
    productType: string;
    matchScore: number;
    reason: string;
  }>;
  ingredients: Array<{
    id: string;
    name: string;
    category: string;
    reason: string;
  }>;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  attachment?: {
    type: "image";
    mimeType: string;
    previewUrl?: string;
    url?: string;
  };
  librarySuggestions?: LibrarySuggestions;
};

type ScanChatResponse = {
  answer: string;
  suggestions: string[];
  quota?: QuotaStatus;
  messages?: ChatMessage[];
  librarySuggestions?: LibrarySuggestions;
};

type SelectedChatImage = {
  file: File;
  previewUrl: string;
};

function useChatImageAttachment() {
  const [image, setImage] = useState<SelectedChatImage | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const urlsRef = useRef(new Set<string>());

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const selectFile = (file?: File | null) => {
    if (!file) return null;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Utilisez une image JPEG, PNG ou WebP.");
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("L image doit peser au maximum 8 Mo.");
    }
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
      urlsRef.current.delete(image.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    urlsRef.current.add(previewUrl);
    const selected = { file, previewUrl };
    setImage(selected);
    return selected;
  };

  const remove = () => {
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
      urlsRef.current.delete(image.previewUrl);
    }
    setImage(null);
  };

  const consume = () => {
    const selected = image;
    setImage(null);
    return selected;
  };

  return { image, inputRef, selectFile, remove, consume };
}

type ProductExtractionResponse = {
  extractionId: string;
  usable: boolean;
  imageType: "product_front" | "product_label" | "product_multiple" | "unrelated" | "unclear";
  brand: string | null;
  productName: string | null;
  productCategory: string | null;
  visibleText: string;
  visibleClaims: string[];
  ingredients: string[];
  fullIngredientListVisible: boolean;
  uncertainText: string[];
  confidence: "low" | "medium" | "high";
  warnings: string[];
  retakeInstructions: string[];
};

type ScanHistoryItem = {
  id: string;
  productName: string;
  customTitle?: string | null;
  skinGoal?: string;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
  analysisSummary?: string;
  analysisVerdict?: string;
};


type FaceScanHistoryItem = {
  id: string;
  skinGoal?: string | null;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  customTitle?: string | null;
  summary?: string;
};

type RecentDiscussionItem =
  | ({ kind: "product" } & ScanHistoryItem)
  | ({ kind: "face" } & FaceScanHistoryItem);
type ScanConversationDetail = ScanHistoryItem & {
  ingredients: string[];
  analysisResult: AnalysisResult;
  conversation: ChatMessage[];
};
type FaceScanDetail = {
  id: string;
  skinGoal?: string | null;
  title?: string;
  customTitle?: string | null;
  observations: {
    quality?: { lighting?: string; focus?: string; faceCoverage?: string };
    observations?: Array<{ area?: string; concern?: string; description?: string; confidence?: string }>;
  };
  guidance: {
    explanation?: string;
    priorities?: string[];
    routineCategories?: Array<{ step: string; guidance: string }>;
    potentiallyUsefulIngredients?: string[];
    introduceCautiously?: string[];
    followUpQuestions?: string[];
    disclaimer?: string;
  };
  conversation: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const DEFAULT_PRODUCT_IMAGE = "/products/default-product.png";
type PlanStatus = "free" | "pro";
type UpgradeDialogReason = "scan-limit" | "prompt-limit" | "face-scan-pro-required";

const FREE_SCAN_LIMIT = 3;
const FREE_PROMPT_LIMIT = 1;
const CHAT_TITLE_STORAGE_KEY = "skinorai_chat_titles";

class UpgradeRequiredError extends Error {
  reason: UpgradeDialogReason;
  quota?: QuotaStatus;

  constructor(
    reason: UpgradeDialogReason,
    message: string,
    quota?: QuotaStatus,
  ) {
    super(message);
    this.name = "UpgradeRequiredError";
    this.reason = reason;
    this.quota = quota;
  }
}

const watchTerms = [
  "parfum",
  "fragrance",
  "alcohol",
  "denat",
  "essential oil",
  "citric acid",
];

function buildIngredientItems(names: string[]): IngredientItem[] {
  return names.map((name) => {
    const normalized = name.toLowerCase();
    const shouldWatch = watchTerms.some((term) => normalized.includes(term));
    return {
      name,
      status: shouldWatch ? "À surveiller" : "OK",
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
    return "Produit analysé";
  }

  return imageName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const token = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let reason: UpgradeDialogReason | undefined;
    let quota: QuotaStatus | undefined;

    try {
      const errorBody = (await response.json()) as {
        message?: string | string[];
        reason?: UpgradeDialogReason;
        quota?: QuotaStatus;
      };
      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(" ");
      } else if (errorBody.message) {
        message = errorBody.message;
      }
      reason = errorBody.reason;
      quota = errorBody.quota;
    } catch {
      // Keep the status-based message when the backend does not return JSON.
    }

    if (response.status === 402 && reason) {
      throw new UpgradeRequiredError(reason, message, quota);
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const token = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string | string[] };
      message = Array.isArray(errorBody.message)
        ? errorBody.message.join(" ")
        : errorBody.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
const skinGoalApiMap: Record<string, string> = {
  hydration: "hydration",
  acne: "acne",
  barrier: "barrier_repair",
  redness: "redness",
  oily: "oily_skin",
  morning: "morning_routine",
};

function buildAttachmentImageUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("blob:") || url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}
function buildProductImageUrl(imagePath?: string | null) {
  if (!imagePath) return `${API_BASE_URL}${DEFAULT_PRODUCT_IMAGE}`;
  if (imagePath.startsWith("http")) return imagePath;

  const normalizedPath = imagePath.startsWith("/public/")
    ? imagePath.replace("/public", "")
    : imagePath.startsWith("public/")
      ? `/${imagePath.replace("public/", "")}`
      : imagePath;

  return `${API_BASE_URL}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
}

function requestScanHistory() {
  return getJson<ScanHistoryItem[]>("/api/scans");
}

function requestFaceScanHistory() {
  return getJson<FaceScanHistoryItem[]>("/api/face-scans");
}

function requestScanConversation(scanId: string) {
  return getJson<ScanConversationDetail>(`/api/scans/${scanId}`);
}

function requestFaceScanConversation(faceScanId: string) {
  return getJson<FaceScanDetail>(`/api/face-scans/${faceScanId}`);
}

type RenameConversationResponse = {
  id: string;
  productName?: string;
  title?: string;
  customTitle?: string | null;
  updatedAt: string;
};

function requestRenameProductConversation(scanId: string, title: string) {
  return patchJson<RenameConversationResponse>(`/api/scans/${scanId}/title`, { title });
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

  return `${label} - ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

const WINDOWS_1252_BYTE_OVERRIDES = new Map<number, number>([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84], [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87],
  [0x02c6, 0x88], [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e],
  [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93], [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

function countEncodingArtifacts(value: string) {
  return (value.match(/[\u00c3\u00c2\u00e2\u00d8\u00d9\u00c5\u00d0\ufffd]/g) ?? []).length + (value.match(/\u00ef\u00bf\u00bd/g) ?? []).length * 3;
}

function countReplacementCharacters(value: string) {
  return (value.match(/[\ufffd]/g) ?? []).length + (value.match(/\u00ef\u00bf\u00bd/g) ?? []).length;
}

function encodeWindows1252(value: string) {
  const bytes: number[] = [];

  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0xff) {
      bytes.push(code);
    } else if (WINDOWS_1252_BYTE_OVERRIDES.has(code)) {
      bytes.push(WINDOWS_1252_BYTE_OVERRIDES.get(code)!);
    } else {
      return null;
    }
  }

  return Uint8Array.from(bytes);
}

function normalizeDisplayText(value: string) {
  let normalized = value;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (countEncodingArtifacts(normalized) === 0) {
      break;
    }

    const bytes = encodeWindows1252(normalized);
    if (!bytes) {
      break;
    }

    const decoded = new TextDecoder("utf-8").decode(bytes);
    if (
      countEncodingArtifacts(decoded) < countEncodingArtifacts(normalized) &&
      countReplacementCharacters(decoded) <= countReplacementCharacters(normalized)
    ) {
      normalized = decoded;
    } else {
      break;
    }
  }

  return normalized;
}

function requestScanAnalysis({
  goal,
  extractionId,
  ingredients,
}: {
  goal: SkinGoal;
  extractionId: string | null;
  ingredients: IngredientItem[];
}) {
  return postJson<AnalysisResult>("/api/scans/analyze", {
    skinGoal: skinGoalApiMap[goal.id] ?? goal.id,
    extractionId: extractionId || undefined,
    confirmedIngredients: ingredients.map((item) => item.name),
  });
}

async function requestProductExtraction(
  file: File,
): Promise<ProductExtractionResponse> {
  const formData = new FormData();
  formData.append("image", file);
  const token = getStoredAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/scans/extract-product`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `Extraction request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string | string[] };
      message = Array.isArray(errorBody.message)
        ? errorBody.message.join(" ")
        : errorBody.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json() as Promise<ProductExtractionResponse>;
}

async function requestFaceScanChat({
  faceScanId,
  message,
  image,
}: {
  faceScanId: string;
  message: string;
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append("message", message);
  if (image) formData.append("image", image);
  const token = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/face-scans/${faceScanId}/messages`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });

  if (!response.ok) {
    let messageText = `Request failed with status ${response.status}`;
    let reason: UpgradeDialogReason | undefined;
    try {
      const body = (await response.json()) as { message?: string | string[]; reason?: UpgradeDialogReason };
      messageText = Array.isArray(body.message) ? body.message.join(" ") : body.message || messageText;
      reason = body.reason;
    } catch {}
    if (response.status === 402 && reason) {
      throw new UpgradeRequiredError(reason, messageText);
    }
    throw new Error(messageText);
  }

  return response.json() as Promise<ScanChatResponse>;
}
async function requestScanChat({
  scanId,
  message,
  image,
}: {
  scanId: string | null;
  message: string;
  image?: File | null;
}) {
  if (!scanId) {
    throw new Error("A saved scan is required before starting chat.");
  }
  const formData = new FormData();
  formData.append("message", message);
  if (image) formData.append("image", image);
  const token = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/scans/${scanId}/messages`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });

  if (!response.ok) {
    let messageText = `Request failed with status ${response.status}`;
    let reason: UpgradeDialogReason | undefined;
    let quota: QuotaStatus | undefined;
    try {
      const body = (await response.json()) as {
        message?: string | string[];
        reason?: UpgradeDialogReason;
        quota?: QuotaStatus;
      };
      messageText = Array.isArray(body.message) ? body.message.join(" ") : body.message || messageText;
      reason = body.reason;
      quota = body.quota;
    } catch {}
    if (response.status === 402 && reason) {
      throw new UpgradeRequiredError(reason, messageText, quota);
    }
    throw new Error(messageText);
  }
  return response.json() as Promise<ScanChatResponse>;
}

function buildFallbackChatAnswer(
  question: string,
  selectedGoal: SkinGoal,
  analysisResult: AnalysisResult,
) {
  const loweredQuestion = question.toLowerCase();

  if (
    loweredQuestion.includes("irrit") ||
    loweredQuestion.includes("sensible")
  ) {
    return analysisResult.watchouts.length > 0
      ? `Avancez doucement: ${analysisResult.watchouts.map((item) => item.ingredient).join(", ")} meritent un test localise avant usage regulier.`
      : "La formule ne montre pas de gros signal irritant dans cette analyse, mais faites un test localise si votre peau reagit vite.";
  }

  if (loweredQuestion.includes("matin") || loweredQuestion.includes("spf")) {
    return "Le matin, gardez ce produit avant la protection solaire. Le SPF reste la derniere etape.";
  }

  return `Pour ${selectedGoal.label}, ce produit semble coherent avec l analyse actuelle. Introduisez-le progressivement et surveillez la tolerance de votre peau.`;
}

export default function ScanPage() {
  const router = useRouter();
  const { isReady: isAuthReady, token, user } = useAuth();
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0].id);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [manualIngredientsInput, setManualIngredientsInput] = useState("");
  const [ingredientItems, setIngredientItems] = useState<IngredientItem[]>([]);
  const [stepTwoError, setStepTwoError] = useState("");
  const [isExtractingIngredients, setIsExtractingIngredients] = useState(false);
  const [ocrWarnings, setOcrWarnings] = useState<string[]>([]);
  const [ocrRawText, setOcrRawText] = useState("");
  const [productExtraction, setProductExtraction] =
    useState<ProductExtractionResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisRequestId, setAnalysisRequestId] = useState(0);
  const [isResultReady, setIsResultReady] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [chatScanIdToOpen, setChatScanIdToOpen] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("chat");
  });
  const [faceScanIdToOpen, setFaceScanIdToOpen] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("faceChat");
  });
  const [analysisError, setAnalysisError] = useState("");
  const [planStatus, setPlanStatus] = useState<PlanStatus>("free");
  const [freeScansUsed, setFreeScansUsed] = useState(0);
  const [currentScanPromptCount, setCurrentScanPromptCount] = useState(0);
  const [upgradeDialogReason, setUpgradeDialogReason] =
    useState<UpgradeDialogReason | null>(null);
  const uploadedImagesRef = useRef<UploadedImage[]>([]);

  const hasManualIngredients =
    parseIngredientText(manualIngredientsInput).length > 0;
  const hasStepTwoData = ingredientItems.length > 0 || hasManualIngredients;
  const selectedGoal =
    goals.find((goal) => goal.id === selectedGoalId) ?? goals[0];
  const hasActivePlan = planStatus === "pro";
  const freeScansRemaining = hasActivePlan
    ? 999999
    : Math.max(0, FREE_SCAN_LIMIT - freeScansUsed);

  const applyQuotaStatus = (quota?: QuotaStatus) => {
    if (!quota) {
      return;
    }

    setPlanStatus(quota.planStatus);
    setFreeScansUsed(quota.freeScansUsed);
    setCurrentScanPromptCount(quota.promptCount);
  };

  const activatePlan = () => {
    setUpgradeDialogReason(null);
    router.push("/pricing");
  };
  const goToStep = (step: number) => {
    const nextStep = Math.min(Math.max(step, 1), 4);

    if (nextStep >= 3 && currentStep <= 2 && !hasStepTwoData) {
      setStepTwoError(
        "Ajoutez au moins une image ou collez vos ingredients avant de continuer.",
      );
      return;
    }

    setStepTwoError("");

    if (nextStep === 4) {
      setIsAnalyzing(true);
      setAnalysisError("");
    }
    setCurrentStep(nextStep);
  };
  const selectedImage =
    uploadedImages.find((image) => image.id === selectedImageId) ??
    uploadedImages[0] ??
    null;
  const extractedDisplayName = [productExtraction?.brand, productExtraction?.productName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const productName = extractedDisplayName || formatProductName(selectedImage?.file.name ?? null);

  const resetFlow = () => {
    uploadedImagesRef.current.forEach((image) =>
      URL.revokeObjectURL(image.url),
    );
    uploadedImagesRef.current = [];
    setUploadedImages([]);
    setSelectedImageId(null);
    setManualIngredientsInput("");
    setIngredientItems([]);
    setStepTwoError("");
    setIsExtractingIngredients(false);
    setOcrWarnings([]);
    setOcrRawText("");
    setProductExtraction(null);
    setIsAnalyzing(false);
    setAnalysisRequestId(0);
    setIsResultReady(false);
    setAnalysisResult(null);
    setActiveScanId(null);
    setChatScanIdToOpen(null);
    setAnalysisError("");
    setCurrentScanPromptCount(0);
    setUpgradeDialogReason(null);
    setCurrentStep(1);
  };

  const startNewScan = () => {
    resetFlow();
    const preferredGoal = normalizeSkinGoalId(
      user?.preferredSkinGoal ??
        user?.skinGoal ??
        (typeof window !== 'undefined' ? window.localStorage.getItem(SKIN_GOAL_STORAGE_KEY) : null),
    );
    if (preferredGoal) {
      setSelectedGoalId(preferredGoal);
    }
    setIsWizardOpen(false);
  };

  useEffect(() => {
    uploadedImagesRef.current = uploadedImages;
  }, [uploadedImages]);

  useEffect(() => {
    return () => {
      uploadedImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.url),
      );
    };
  }, []);

  useEffect(() => {
    if (isAuthReady && !token) {
      router.replace("/login");
    }
  }, [isAuthReady, router, token]);

  useEffect(() => {
    const syncChatIdFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setChatScanIdToOpen(params.get("chat"));
      setFaceScanIdToOpen(params.get("faceChat"));
    };

    window.addEventListener("popstate", syncChatIdFromUrl);
    return () => window.removeEventListener("popstate", syncChatIdFromUrl);
  }, []);
  useEffect(() => {
    if (!isAuthReady || !user) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPlanStatus(user.planStatus ?? "free");
      setFreeScansUsed(user.freeScansUsed ?? 0);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [isAuthReady, user]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    const preferredGoal = normalizeSkinGoalId(
      user?.preferredSkinGoal ??
        user?.skinGoal ??
        (typeof window !== "undefined" ? window.localStorage.getItem(SKIN_GOAL_STORAGE_KEY) : null),
    );

    if (!preferredGoal) return;
    const timeoutId = window.setTimeout(() => setSelectedGoalId(preferredGoal), 0);
    return () => window.clearTimeout(timeoutId);
  }, [isAuthReady, user?.preferredSkinGoal, user?.skinGoal]);
  useEffect(() => {
    if (!isWizardOpen || isResultReady || currentStep === 4) {
      document.body.dataset.navbarHidden = "true";

      return () => {
        delete document.body.dataset.navbarHidden;
      };
    }

    delete document.body.dataset.navbarHidden;
  }, [currentStep, isResultReady, isWizardOpen]);

  useEffect(() => {
    if (currentStep !== 4 || isResultReady) {
      return;
    }

    let isCancelled = false;
    const timeout = window.setTimeout(async () => {
      let didAnalyze = false;

      try {
        const response = await requestScanAnalysis({
          goal: selectedGoal,
          extractionId: productExtraction?.extractionId ?? null,
          ingredients: ingredientItems,
        });

        if (isCancelled) {
          return;
        }

        setAnalysisResult(response);
        setActiveScanId(response.scanId ?? null);
        setChatScanIdToOpen(response.scanId ?? null);
        applyQuotaStatus(response.quota);
        didAnalyze = true;
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error instanceof UpgradeRequiredError) {
          applyQuotaStatus(error.quota);
          setUpgradeDialogReason(error.reason);
          setCurrentStep(3);
        } else {
          setAnalysisError(
            "Impossible de générer l'analyse IA pour le moment. Vérifiez le backend et réessayez.",
          );
        }
        setAnalysisResult(null);
        setActiveScanId(null);
        setChatScanIdToOpen(null);
      } finally {
        if (!isCancelled) {
          setIsAnalyzing(false);
          if (didAnalyze) {
            setIsWizardOpen(false);
            setCurrentStep(1);
            setIsResultReady(false);
          } else {
            setIsResultReady(false);
          }
        }
      }
    }, 700);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    analysisRequestId,
    currentStep,
    ingredientItems,
    isResultReady,
    productExtraction?.extractionId,
    selectedGoal,
  ]);

  const addFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );
    if (!validFiles.length) {
      setStepTwoError(
        "Ajoutez une image JPG, PNG ou WEBP pour lancer l extraction OCR.",
      );
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
    setOcrWarnings([]);
    setIsExtractingIngredients(true);

    try {
      const extractionResults = await Promise.all(
        validFiles.map((file) => requestProductExtraction(file)),
      );
      const usableResults = extractionResults.filter((result) => result.usable);
      const primaryResult = usableResults
        .slice()
        .sort((left, right) => {
          const rank = { high: 3, medium: 2, low: 1 };
          return rank[right.confidence] - rank[left.confidence];
        })[0] ?? extractionResults[0];

      setProductExtraction(primaryResult ?? null);
      const detectedIngredients = usableResults.flatMap((result) => result.ingredients);
      const uniqueIngredients = Array.from(new Set(detectedIngredients));
      const detectedIngredientsText = uniqueIngredients.join(", ");
      const extractionWarnings = extractionResults.flatMap((result) => [
        ...result.warnings,
        ...(result.fullIngredientListVisible ? [] : ["La liste INCI complète n'est pas visible. L'analyse sera partielle."]),
        ...(result.confidence === "low" ? ["Confiance d'extraction faible. Vérifiez chaque ingrédient."] : []),
        ...(result.imageType === "product_front" ? ["Seule la face avant du produit est visible. Ajoutez une photo nette de l'étiquette ingrédients."] : []),
        ...(result.uncertainText.length ? [`Texte incertain: ${result.uncertainText.join(", ")}`] : []),
        ...(!result.usable ? result.retakeInstructions : []),
      ]);
      const rawText = extractionResults
        .map((result) => result.visibleText)
        .filter(Boolean)
        .join("\n\n---\n\n");

      setManualIngredientsInput(detectedIngredientsText);
      setOcrWarnings(Array.from(new Set(extractionWarnings)));
      setOcrRawText(rawText);

      if (!primaryResult?.usable) {
        setIngredientItems([]);
        setStepTwoError(primaryResult?.retakeInstructions.join(" ") || "Cette image n'est pas exploitable. Reprenez une photo plus nette.");
        return;
      }

      if (!uniqueIngredients.length) {
        setIngredientItems([]);
        setStepTwoError(
          primaryResult.imageType === "product_front"
            ? "La face avant a été reconnue, mais aucune liste d'ingrédients n'est visible. Ajoutez l'étiquette INCI ou saisissez-la manuellement."
            : "Aucun ingrédient lisible n'a été détecté. Corrigez la liste manuellement ou reprenez la photo.",
        );
        return;
      }

      setIngredientItems(buildIngredientItems(uniqueIngredients));
      setStepTwoError("");
      setCurrentStep(3);
    } catch (error) {
      setIngredientItems([]);
      setStepTwoError(
        error instanceof Error
          ? error.message
          : "Impossible d extraire les ingredients depuis cette image.",
      );
    } finally {
      setIsExtractingIngredients(false);
    }
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
    setOcrWarnings([]);
    setIsManualDialogOpen(false);
    setStepTwoError("");
    setCurrentStep(3);
  };

  const updateIngredientDraft = (value: string) => {
    setManualIngredientsInput(value);
    setIngredientItems(buildIngredientItems(parseIngredientText(value)));
  };

  const confirmIngredients = () => {
    const parsedIngredients = parseIngredientText(manualIngredientsInput);

    if (!parsedIngredients.length) {
      setStepTwoError(
        "Confirmez au moins un ingredient avant de lancer l analyse.",
      );
      return;
    }

    setIngredientItems(buildIngredientItems(parsedIngredients));
    setStepTwoError("");
    setAnalysisRequestId((requestId) => requestId + 1);
    goToStep(4);
  };

  if (!isAuthReady || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfaff] px-4 text-[#111631] [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
        <div className="rounded-[28px] border border-[#e8e0fb] bg-white px-8 py-7 text-center shadow-[0_24px_60px_rgba(90,66,165,0.10)]">
          <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-[#7548e8]" />
          <h1 className="mt-4 text-xl font-bold">
            Verification de votre session...
          </h1>
          <p className="mt-2 text-sm text-[#66708f]">
            Redirection vers la connexion si necessaire.
          </p>
        </div>
      </main>
    );
  }

  if (!isWizardOpen) {
    return (
      <ChatWorkspace
        onScanAnother={() => undefined}
        initialSelectedChatId={chatScanIdToOpen}
        initialSelectedFaceChatId={faceScanIdToOpen}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfaff] text-[#111631] [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      <section className="relative overflow-hidden border-t border-[#ece8f7] bg-[radial-gradient(circle_at_83%_18%,_rgba(149,105,255,0.16),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#fbfaff_42%,_#ffffff_100%)] px-4 pb-6 pt-24 sm:px-6 lg:flex lg:min-h-[calc(100svh-72px)] lg:items-center lg:px-10 lg:pt-20">
        <div
          className={`pointer-events-none absolute right-[8%] top-12 hidden lg:block ${currentStep === 1 || currentStep === 4 ? "opacity-0" : "opacity-100"}`}
        >
          <ProductStill />
        </div>

        <div className="mx-auto flex w-full max-w-[1500px] flex-col justify-center">
          <div className="text-center">
            <h1 className="text-[30px] font-bold leading-tight sm:text-[40px] lg:text-[46px]">
              Analysez votre premier produit
            </h1>
            <p className="mx-auto mt-2 max-w-[820px] text-[15px] leading-6 text-[#66708f] sm:text-[17px]">
              {currentStep === 3
                ? tr("Vérifiez les ingrédients détectés par l'IA avant de lancer l'analyse complète.")
                : tr("Scannez l etiquette d un produit de soin pour obtenir une analyse simple des ingredients par IA.") }
            </p>
          </div>

          <div className="mt-6">
            <ScanProgress
              currentStep={currentStep}
              onStepClick={goToStep}
              selectedGoalLabel={selectedGoal.label}
            />

            <Stepper
              activeStep={currentStep - 1}
              onChangeStep={(event) => goToStep(event.index + 1)}
              linear
              className="scan-prime-stepper mx-auto max-w-[1280px]"
              pt={{
                nav: { className: "!hidden" },
                panelContainer: { className: "mt-8" },
              }}
            >
              <StepperPanel header={tr(stepLabels[0])}>
                <GoalStep
                  selectedGoalId={selectedGoalId}
                  onSelectGoal={setSelectedGoalId}
                />
              </StepperPanel>
              <StepperPanel header={tr(stepLabels[1])}>
                <UploadStep
                  uploadedImages={uploadedImages}
                  selectedImage={selectedImage}
                  stepTwoError={stepTwoError}
                  isExtractingIngredients={isExtractingIngredients}
                  ocrWarnings={ocrWarnings}
                  onAddFiles={addFiles}
                  onSelectImage={setSelectedImageId}
                  onRemoveImage={removeImage}
                  onOpenManualDialog={() => setIsManualDialogOpen(true)}
                />
              </StepperPanel>
              <StepperPanel header={tr(stepLabels[2])}>
                <IngredientsStep
                  ingredientItems={ingredientItems}
                  ingredientText={manualIngredientsInput}
                  ocrRawText={ocrRawText}
                  ocrWarnings={ocrWarnings}
                  onIngredientTextChange={updateIngredientDraft}
                  onOpenManualDialog={() => setIsManualDialogOpen(true)}
                  onContinue={confirmIngredients}
                />
              </StepperPanel>
              <StepperPanel header={tr(stepLabels[3])}>
                <AnalysisLoadingStep
                  selectedGoal={selectedGoal}
                  ingredientCount={ingredientItems.length}
                  isAnalyzing={isAnalyzing}
                  analysisError={analysisError}
                  onRetry={() => {
                    setAnalysisError("");
                    setIsAnalyzing(true);
                    setAnalysisRequestId((requestId) => requestId + 1);
                  }}
                  onBack={() => setCurrentStep(3)}
                />
              </StepperPanel>
            </Stepper>

            {currentStep !== 4 && (
              <div className="relative z-20 mx-auto mt-6 flex max-w-[1280px] flex-wrap items-center justify-center gap-3">
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
                  disabled={
                    currentStep === 2 &&
                    (!hasStepTwoData || isExtractingIngredients)
                  }
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#9b75f2] to-pink-300 px-14 py-2.5 tracking-tighter text-white ${currentStep === 2 &&
                    (!hasStepTwoData || isExtractingIngredients)
                    ? "cursor-not-allowed opacity-55"
                    : "cursor-pointer"
                    }`}
                >
                  <span className="absolute h-0 w-0 rounded-full bg-[#8d68ef] transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
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
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-white/30"></span>
                  <span className="relative text-base font-semibold">
                    Continuer{" "}
                  </span>
                </button>
              </div>
            )}
          </div>

          {currentStep !== 4 && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[#727a99]">
              <Lock className="h-4 w-4" />
              Vos photos sont privees et securisees. Elles ne sont utilisees que
              pour l analyse.
            </p>
          )}
        </div>
      </section>

      {upgradeDialogReason && (
        <UpgradePlanDialog
          reason={upgradeDialogReason}
          scansUsed={freeScansUsed}
          scansRemaining={freeScansRemaining}
          onClose={() => setUpgradeDialogReason(null)}
          onUpgrade={activatePlan}
        />
      )}
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
      <style jsx global>{`
  @keyframes dialog-overlay-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes dialog-panel-fade {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dialog-overlay-fade {
    animation: dialog-overlay-fade 220ms ease-out both;
  }

  .dialog-panel-fade {
    animation: dialog-panel-fade 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: opacity, transform;
  }
`}</style>
    </main>
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
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  return (
    <div className="mx-auto flex max-w-[860px] items-center pb-8">
      {stepLabels.map((label, index) => {
        const step = index + 1;
        const isComplete = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={label} className="contents">
            <button
              type="button"
              onClick={() => onStepClick(step)}
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              aria-label={`Aller a l etape ${step}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold shadow-sm transition ${isComplete
                  ? "border-[#7548e8] bg-[#7548e8] text-white"
                  : isActive
                    ? "border-[#7548e8] bg-gradient-to-b from-[#8d5df4] to-[#6c35d8] text-white"
                    : "border-[#d9ddec] bg-white text-[#5f6780]"
                  }`}
              >
                {isComplete ? <Check className="h-5 w-5" /> : step}
              </span>
              <span
                className={`absolute left-1/2 top-10 w-40 -translate-x-1/2 text-center text-xs font-semibold ${currentStep >= step ? "text-[#6b3ee4]" : "text-[#66708f]"
                  }`}
              >
                {tr(label)}
                {step === 1 && (
                  <span className="mt-1 block text-xs font-medium text-[#7f86a3]">
                    {tr(selectedGoalLabel)}
                  </span>
                )}
              </span>
            </button>
            {step < stepLabels.length && (
              <span className="mx-2 h-0.5 flex-1 rounded bg-[#dfe2ee]">
                <span
                  className={`block h-full rounded bg-[#7548e8] transition-all ${currentStep > step ? "w-full" : "w-0"}
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
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  return (
    <div className="mx-auto mt-9 grid max-w-[1280px] gap-6 lg:grid-cols-[minmax(0,840px)_360px] lg:items-center lg:justify-center">
      <Panel className="min-h-[420px] px-7 pb-20 pt-6">
        <StepTitle
          number="1"
          title={tr("Choisissez votre objectif peau")}
          description={tr("Selectionnez votre priorite du moment pour personnaliser l analyse.")}
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <button
                key={goal.label}
                type="button"
                onClick={() => onSelectGoal(goal.id)}
                className={`relative flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-2xl border bg-white px-3 py-3 text-center transition hover:-translate-y-0.5 ${isSelected
                  ? "border-[#8c57eb] bg-[radial-gradient(circle_at_center,_#fbf8ff_0%,_#ffffff_72%)] shadow-[0_16px_40px_rgba(123,86,238,0.12)]"
                  : "border-[#e2e5f0] shadow-[0_8px_24px_rgba(65,58,105,0.04)]"
                  }`}
              >
                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#7947e6] text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span className="flex h-14 w-14 items-center justify-center">
                  <Image
                    src={goal.image}
                    alt=""
                    width={74}
                    height={74}
                    className="h-14 w-14 object-contain drop-shadow-[0_8px_16px_rgba(124,86,238,0.16)]"
                  />
                </span>
                <span className="mt-3 text-[15px] font-semibold">
                  {tr(goal.label)}
                </span>
                <span className="mt-1 text-xs text-[#7a819e]">
                  {tr(goal.accentLabel)}
                </span>
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
  isExtractingIngredients,
  ocrWarnings,
  onAddFiles,
  onSelectImage,
  onRemoveImage,
  onOpenManualDialog,
}: {
  uploadedImages: UploadedImage[];
  selectedImage: UploadedImage | null;
  stepTwoError: string;
  isExtractingIngredients: boolean;
  ocrWarnings: string[];
  onAddFiles: (files: FileList | File[]) => Promise<void>;
  onSelectImage: (imageId: string) => void;
  onRemoveImage: (imageId: string) => void;
  onOpenManualDialog: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      void onAddFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files?.length) {
      void onAddFiles(event.dataTransfer.files);
    }
  };

  return (
    <div className="mx-auto mt-9 grid max-w-[1280px] gap-6 lg:grid-cols-[minmax(0,840px)_360px] lg:items-center">
      <Panel>
        <StepTitle
          number="2"
          title="Importez l etiquette du produit"
          description="Prenez une photo claire de la liste d ingredients pour que notre IA puisse l analyser."
        />
        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtractingIngredients}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex min-h-[285px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${isExtractingIngredients ? "cursor-wait opacity-80" : "cursor-pointer"} ${isDragging
                ? "border-[#8f68f2] bg-[#f4edff] hover:bg-[#f0e8ff] hover:duration-500 hover:transition-all shadow-[0_22px_45px_rgba(123,86,238,0.14)]"
                : "border-[#bda7ff] bg-[#fbf8ff] hover:bg-[#f0e8ff] hover:duration-500 hover:transition-all"
                }`}
            >
              {isExtractingIngredients ? (
                <LoaderCircle className="h-14 w-14 animate-spin text-[#9b77f5]" />
              ) : (
                <UploadCloud className="h-14 w-14 text-[#9b77f5]" />
              )}
              <span className="mt-5 text-lg font-bold">
                {isExtractingIngredients
                  ? "Extraction OCR en cours..."
                  : "Glissez-deposez votre image ici"}
              </span>
              <span className="mt-2 text-base font-semibold text-[#6f3fe4]">
                {isExtractingIngredients
                  ? "Google Vision lit l etiquette"
                  : "ou cliquez pour parcourir"}
              </span>
              <span className="mt-5 text-xs text-[#727a99]">
                Formats acceptes : JPG, PNG, WEBP
              </span>
              <span className="mt-5 flex items-center gap-2 text-xs text-[#727a99]">
                <Lock className="h-4 w-4" />
                Vos images sont privées et sécurisées.
              </span>
            </button>
            {uploadedImages.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#e6defa] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#161933]">
                      Images ajoutees
                    </p>
                    <p className="text-xs text-[#727a99]">
                      {uploadedImages.length} image
                      {uploadedImages.length > 1 ? "s" : ""} prete
                      {uploadedImages.length > 1 ? "s" : ""} pour l analyse.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dfd2ff] bg-[#faf6ff] px-4 py-2 text-xs font-semibold text-[#7548e8] transition hover:bg-[#f3edff]"
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
                        className={`group relative overflow-hidden rounded-2xl border bg-[#faf8ff] ${isSelected
                          ? "border-[#8d68ef] ring-2 ring-[#eadfff]"
                          : "border-[#ece5ff]"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectImage(image.id)}
                          className="block w-full text-left"
                        >
                          <div className="relative h-28 w-full bg-[#f3ecff]">
                            <Image
                              src={image.url}
                              alt={image.file.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-3">
                            <p className="truncate text-xs font-semibold text-[#1d2140]">
                              {image.file.name}
                            </p>
                            <p className="mt-1 text-xs text-[#727a99]">
                              {Math.max(1, Math.round(image.file.size / 1024))}{" "}
                              KB
                            </p>
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
            <div className="my-5 flex items-center gap-4 text-xs font-semibold text-[#8a91aa]">
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
                <span className="block text-sm font-bold">
                  Ou collez la liste d ingredients manuellement
                </span>
                <span className="block text-xs text-[#727a99]">
                  Copiez/collez la liste d ingredients depuis l emballage ou le
                  site du produit.
                </span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </button>
            {stepTwoError && (
              <p className="mt-4 rounded-2xl border border-[#ffd7dd] bg-[#fff7f8] px-4 py-3 text-xs font-medium text-[#c6405f]">
                {stepTwoError}
              </p>
            )}
            {ocrWarnings.length > 0 && (
              <div className="mt-4 space-y-2 rounded-2xl border border-[#ffe7ba] bg-[#fffaf2] px-4 py-3 text-xs font-medium text-[#9b6500]">
                {ocrWarnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}
          </div>
          <PhotoPreview
            selectedImage={selectedImage}
            imageCount={uploadedImages.length}
          />
        </div>
      </Panel>

      <TipsCard />
    </div>
  );
}

function IngredientsStep({
  ingredientItems,
  ingredientText,
  ocrRawText,
  ocrWarnings,
  onIngredientTextChange,
  onOpenManualDialog,
  onContinue,
}: {
  ingredientItems: IngredientItem[];
  ingredientText: string;
  ocrRawText: string;
  ocrWarnings: string[];
  onIngredientTextChange: (value: string) => void;
  onOpenManualDialog: () => void;
  onContinue: () => void;
}) {
  const midpoint = Math.ceil(ingredientItems.length / 2);
  const leftColumn = ingredientItems.slice(0, midpoint);
  const rightColumn = ingredientItems.slice(midpoint);

  return (
    <div className="mx-auto mt-9 grid max-w-[1280px] gap-6 lg:grid-cols-[minmax(0,840px)_360px] lg:items-center">
      <Panel className="px-8 py-7">
        <StepTitle
          number="3"
          title="Confirmez les ingredients"
          description="Corrigez la liste OCR si necessaire. Ce sont ces ingredients confirmes qui seront analyses ensuite."
        />
        <div className="mt-7 overflow-hidden rounded-[30px] border border-[#ece7fb] bg-white">
          <div className="grid gap-8 px-6 py-6 xl:grid-cols-1 xl:px-7">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h2 className="text-base font-bold text-[#171b36]">
                  Liste editable des ingredients (INCI)
                </h2>
                <span className="rounded-full bg-[#f2ebff] px-3 py-1 text-xs font-semibold text-[#7c57eb]">
                  {ingredientItems.length} ingrédients détectés
                </span>
              </div>

              {ocrWarnings.length > 0 && (
                <div className="mb-5 space-y-2 rounded-2xl border border-[#ffe7ba] bg-[#fffaf2] px-4 py-3 text-xs font-medium text-[#9b6500]">
                  {ocrWarnings.map((warning) => (
                    <p key={warning}>{warning}</p>
                  ))}
                </div>
              )}

              <textarea
                value={ingredientText}
                onChange={(event) => onIngredientTextChange(event.target.value)}
                placeholder="Ex: Aqua (Water), Glycerin, Niacinamide..."
                className="min-h-[180px] w-full rounded-[24px] border border-[#dfd7f4] bg-[#fcfbff] px-5 py-4 text-sm leading-6 text-[#1d2140] outline-none transition placeholder:text-[#9aa1ba] focus:border-[#9b75f2] focus:ring-4 focus:ring-[#efe7ff]"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#faf7ff] px-4 py-3">
                <p className="text-xs text-[#66708f]">
                  Modifiez les virgules, noms ou retours a la ligne avant de
                  confirmer.
                </p>
                <button
                  type="button"
                  onClick={onOpenManualDialog}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#7b57ea] transition hover:text-[#5d39cf]"
                >
                  <Pencil className="h-4 w-4" />
                  Ouvrir l editeur large
                </button>
              </div>

              {ocrRawText && (
                <details className="mt-4 rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-4 py-3 text-xs text-[#66708f]">
                  <summary className="cursor-pointer font-semibold text-[#6f49e2]">
                    Voir le texte OCR brut
                  </summary>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-[#4f5473]">
                    {ocrRawText}
                  </pre>
                </details>
              )}

              <h3 className="mt-7 text-sm font-bold text-[#171b36]">
                Apercu des ingredients confirmes
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <IngredientColumn items={leftColumn} startIndex={0} />
                <IngredientColumn
                  items={rightColumn}
                  startIndex={leftColumn.length}
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-[#f0ecfa] pt-6">
                <button
                  type="button"
                  onClick={onOpenManualDialog}
                  className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-full border border-[#dccdfd] bg-white px-6 text-xs font-semibold text-[#7b57ea] transition hover:bg-[#fbf8ff]"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier la liste
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={ingredientItems.length === 0}
                  className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8d60ef] to-pink-300 px-6 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(116,69,232,0.24)] transition hover:shadow-[0_18px_40px_rgba(116,69,232,0.32)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirmer et continuer
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
                <span className="block text-sm font-bold text-[#171b36]">
                  Prochaine étape : Résultat IA
                </span>
                <span className="mt-1 block text-xs text-[#727a99]">
                  L IA analysera vos ingredients pour vous fournir une
                  evaluation personnalisee.
                </span>
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
          <div
            key={`${startIndex + index}-${name}`}
            className="grid grid-cols-[28px_minmax(0,1fr)_112px] items-center gap-3"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eef0f7] text-[11px] font-bold text-[#66708f]">
              {startIndex + index + 1}
            </span>
            <span className="truncate text-sm font-semibold text-[#1c2140]">
              {name}
            </span>
            <span
              className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status === "OK" ? "bg-[#dff4e7] text-[#15864a]" : "bg-[#fff0d9] text-[#ad6b00]"}`}
            >
              {status === "OK" ? (
                <Check className="h-3 w-3" />
              ) : (
                <CircleHelp className="h-3 w-3" />
              )}
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
  analysisError,
  onRetry,
  onBack,
}: {
  selectedGoal: SkinGoal;
  ingredientCount: number;
  isAnalyzing: boolean;
  analysisError: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  const GoalIcon = selectedGoal.icon;

  return (
    <div className="mx-auto mt-4 flex max-w-[980px] justify-center">
      <Panel className="overflow-hidden border-[#e8e0fb] bg-[radial-gradient(circle_at_top,_rgba(158,118,255,0.16),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(250,246,255,0.98)_100%)] px-8 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/90 text-[#7448e8] shadow-[0_18px_45px_rgba(116,72,232,0.15)]">
            {isAnalyzing ? (
              <LoaderCircle className="h-10 w-10 animate-spin" />
            ) : (
              <Sparkles className="h-10 w-10" />
            )}
          </span>

          <h2 className="mt-8 text-3xl font-bold text-[#151833] sm:text-4xl">
            Analyse IA en cours
          </h2>
          <p className="mt-4 max-w-[640px] text-base leading-8 text-[#68708b] sm:text-lg">
            Nous analysons {ingredientCount} ingredient
            {ingredientCount > 1 ? "s" : ""} pour verifier si ce produit
            correspond a votre objectif peau: {selectedGoal.label}.
          </p>

          {analysisError && (
            <div className="mt-6 max-w-[680px] rounded-2xl border border-[#ffd7dd] bg-[#fff7f8] px-5 py-4 text-sm font-medium leading-6 text-[#c6405f]">
              {analysisError}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#efc6d0] bg-white px-5 text-sm font-semibold text-[#8f3850]"
                >
                  Retour aux ingredients
                </button>
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#8d60ef] to-pink-300 px-5 text-sm font-semibold text-white"
                >
                  Reessayer
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 grid w-full gap-4 md:grid-cols-3">
            <LoadingInfoCard
              icon={GoalIcon}
              title="Objectif choisi"
              text={selectedGoal.label}
            />
            <LoadingInfoCard
              icon={ClipboardCheck}
              title="Ingrédients vérifiés"
              text={`${ingredientCount} elements confirmes`}
            />
            <LoadingInfoCard
              icon={Sparkles}
              title="Etape actuelle"
              text="Generation du resultat personnalise"
            />
          </div>

          <div className="mt-10 w-full max-w-[640px]">
            <div className="h-3 overflow-hidden rounded-full bg-white/90 shadow-inner">
              <span className="block h-full w-full origin-left animate-[analysis-fill_2.2s_ease-in-out_forwards] rounded-full bg-gradient-to-r from-[#8a5df0] via-[#a97cf8] to-[#f1b6ff]" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium text-[#7b829e]">
              <span>Lecture de la formule</span>
              <span>Évaluation de compatibilité</span>
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
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#956cf8]">
        {title}
      </p>
      <p className="mt-2 text-base font-semibold text-[#171b36]">{text}</p>
    </div>
  );
}


type FeatureCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  points: string[];
  primaryCtaLabel?: string;
  action?: "scan";
};


const featureCards: FeatureCard[] = [
  {
    id: "ingredient-analyzer",
    icon: FlaskConical,
    title: "Analyseur d'ingrédients",
    text: "Décodez les ingrédients, vérifiez les points à surveiller et comprenez ce qui convient à votre peau.",
    image: "/chat/ingredients.png",
    imageAlt: "Illustration de l'analyse des ingrédients",
    points: [
      "Collez ou scannez la liste d'ingrédients d'un produit de soin.",
      "Comprenez le rôle de chaque ingrédient.",
      "Repérez les ingrédients pouvant irriter les peaux sensibles.",
      "Obtenez une explication claire, sans jargon INCI compliqué.",
    ],
    primaryCtaLabel: "Analyser les ingrédients",
    action: "scan",
  },
  {
    id: "routine-coach",
    icon: Bot,
    title: "Coach routine",
    text: "Recevez des routines personnalisées selon vos objectifs peau.",
    image: "/chat/routine.png",
    imageAlt: "Illustration du coach routine",
    points: [
      "Construisez une routine simple pour le matin ou le soir.",
      "Sachez quel produit appliquer en premier, ensuite et en dernier.",
      "Évitez de mélanger trop d'actifs puissants.",
      "Recevez des rappels sur le SPF et la fréquence d'utilisation.",
    ],
  },
  {
    id: "product-scanner",
    icon: SquareDashed,
    title: "Scanner produit",
    text: "Scannez un produit et analysez sa formule.",
    image: "/chat/scan.png",
    imageAlt: "Illustration du scanner produit",
    points: [
      "Importez une photo claire de l'étiquette du produit.",
      "Extrayez automatiquement les ingrédients grâce à l'OCR.",
      "Corrigez la liste détectée avant l'analyse.",
      "Recevez un score, un verdict, des points forts et des ingrédients à surveiller.",
    ],
    primaryCtaLabel: "Scanner un produit",
    action: "scan",
  },
  {
    id: "skin-insights",
    icon: Sparkles,
    title: "Insights peau",
    text: "Suivez vos analyses et obtenez des insights plus précis sur votre peau.",
    image: "/chat/insights.png",
    imageAlt: "Illustration des insights peau",
    points: [
      "Comprenez les tendances dans vos produits scannés.",
      "Identifiez les ingrédients qui correspondent le plus souvent à vos objectifs peau.",
      "Repérez ce que votre peau semble mieux tolérer.",
      "Préparez des recommandations plus intelligentes avec le temps.",
    ],
  },
];

function ChatWorkspace({
  onScanAnother,
  initialSelectedChatId = null,
  initialSelectedFaceChatId = null,
}: {
  onScanAnother: () => void;
  initialSelectedChatId?: string | null;
  initialSelectedFaceChatId?: string | null;
}) {
  const { locale } = useI18n();
  const { user, updateUser } = useAuth();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [faceScanHistory, setFaceScanHistory] = useState<FaceScanHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [selectedHistoryChatId, setSelectedHistoryChatId] = useState<
    string | null
  >(() => initialSelectedChatId);
  const [selectedHistoryDetail, setSelectedHistoryDetail] =
    useState<ScanConversationDetail | null>(null);
  const [selectedFaceChatId, setSelectedFaceChatId] = useState<string | null>(() => initialSelectedFaceChatId);
  const [selectedFaceDetail, setSelectedFaceDetail] = useState<FaceScanDetail | null>(null);
  const [isFaceConversationLoading, setIsFaceConversationLoading] = useState(false);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [renamedDiscussions, setRenamedDiscussions] = useState<Record<string, string>>({});
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [chatNameDraft, setChatNameDraft] = useState("");
  const [isChatNameSaving, setIsChatNameSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFeatureCard, setSelectedFeatureCard] =
    useState<FeatureCard | null>(null);
  const [isFaceScanDialogOpen, setIsFaceScanDialogOpen] = useState(false);
  const [isFaceScanTutorialOpen, setIsFaceScanTutorialOpen] = useState(false);
  const [faceScanTutorialStep, setFaceScanTutorialStep] = useState(0);
  const [localUpgradeReason, setLocalUpgradeReason] = useState<UpgradeDialogReason | null>(null);
  const chatAttachment = useChatImageAttachment();
  const scanUploadInputRef = useRef<HTMLInputElement | null>(null);
  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [newScanImage, setNewScanImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [newScanExtraction, setNewScanExtraction] = useState<ProductExtractionResponse | null>(null);
  const [newScanIngredientText, setNewScanIngredientText] = useState("");
  const [newScanWarnings, setNewScanWarnings] = useState<string[]>([]);
  const [newScanError, setNewScanError] = useState("");
  const [isNewScanExtracting, setIsNewScanExtracting] = useState(false);
  const [isNewScanAnalyzing, setIsNewScanAnalyzing] = useState(false);
  const [selectedNewScanGoalId, setSelectedNewScanGoalId] = useState(() => normalizeSkinGoalId(user?.preferredSkinGoal ?? user?.skinGoal) ?? goals[0].id);

  const { theme, setTheme, isDarkTheme } = useTheme();
  const hasProPlan = user?.planStatus === "pro";
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const chatMessageIdRef = useRef(0);

  useEffect(() => {
    document.body.dataset.navbarHidden = "true";

    return () => {
      delete document.body.dataset.navbarHidden;
    };
  }, []);

  useEffect(() => {
    try {
      const storedTitles = window.localStorage.getItem(CHAT_TITLE_STORAGE_KEY);
      if (storedTitles) {
        setRenamedDiscussions(JSON.parse(storedTitles) as Record<string, string>);
      }
    } catch {
      setRenamedDiscussions({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      CHAT_TITLE_STORAGE_KEY,
      JSON.stringify(renamedDiscussions),
    );
  }, [renamedDiscussions]);

  useEffect(() => {
    let isCancelled = false;

    const loadHistory = async () => {
      setIsHistoryLoading(true);

      try {
        const [scans, faceScans] = await Promise.all([
          requestScanHistory(),
          requestFaceScanHistory().catch(() => []),
        ]);
        if (!isCancelled) {
          setScanHistory(scans);
          setFaceScanHistory(faceScans);
        }
      } catch {
        if (!isCancelled) {
          setScanHistory([]);
          setFaceScanHistory([]);
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

  useEffect(() => {
    if (!initialSelectedChatId) {
      return;
    }

    setSelectedHistoryChatId(initialSelectedChatId);
  }, [initialSelectedChatId]);

  useEffect(() => {
    if (!initialSelectedFaceChatId) {
      return;
    }

    setSelectedFaceChatId(initialSelectedFaceChatId);
    setSelectedHistoryChatId(null);
  }, [initialSelectedFaceChatId]);

  useEffect(() => {
    const nextUrl = selectedFaceChatId
      ? `/scan?faceChat=${encodeURIComponent(selectedFaceChatId)}`
      : selectedHistoryChatId
        ? `/scan?chat=${encodeURIComponent(selectedHistoryChatId)}`
        : "/scan";

    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [selectedFaceChatId, selectedHistoryChatId]);

  useEffect(() => {
    if (editingChatId && editingChatId !== selectedHistoryChatId) {
      setEditingChatId(null);
      setChatNameDraft("");
    }
  }, [editingChatId, selectedHistoryChatId]);

  useEffect(() => {
    if (!selectedHistoryChatId) {
      setSelectedHistoryDetail(null);
      setIsConversationLoading(false);
      return;
    }

    let isCancelled = false;

    const loadConversation = async () => {
      setIsConversationLoading(true);

      try {
        const detail = await requestScanConversation(selectedHistoryChatId);
        if (!isCancelled) {
          setSelectedHistoryDetail(detail);
        }
      } catch {
        if (!isCancelled) {
          setSelectedHistoryDetail(null);
        }
      } finally {
        if (!isCancelled) {
          setIsConversationLoading(false);
        }
      }
    };

    void loadConversation();

    return () => {
      isCancelled = true;
    };
  }, [selectedHistoryChatId]);
  useEffect(() => {
    if (!selectedFaceChatId) {
      setSelectedFaceDetail(null);
      setIsFaceConversationLoading(false);
      return;
    }

    let isCancelled = false;

    const loadFaceConversation = async () => {
      setIsFaceConversationLoading(true);
      setChatMessages([]);

      try {
        const detail = await requestFaceScanConversation(selectedFaceChatId);
        if (!isCancelled) {
          setSelectedFaceDetail(detail);
        }
      } catch {
        if (!isCancelled) {
          setSelectedFaceDetail(null);
        }
      } finally {
        if (!isCancelled) {
          setIsFaceConversationLoading(false);
        }
      }
    };

    void loadFaceConversation();

    return () => {
      isCancelled = true;
    };
  }, [selectedFaceChatId]);

useEffect(() => {
  if (!workspaceRef.current) {
    return;
  }

  const ctx = gsap.context(() => {
    const heroItems = gsap.utils.toArray<HTMLElement>("[data-chat-hero]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-chat-card]");
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    gsap.set(cards, { opacity: 1, y: 0 });

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    if (isDesktop) {
      timeline.from(sidebarRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.65,
        clearProps: "transform,opacity",
      });
    }

    timeline
      .from(
        headerRef.current,
        {
          y: -18,
          opacity: 0,
          duration: 0.45,
          clearProps: "transform,opacity",
        },
        isDesktop ? "-=0.35" : 0,
      )
      .from(
        heroItems,
        {
          y: 20,
          opacity: 0,
          scale: 0.985,
          duration: 0.56,
          stagger: 0.07,
          clearProps: "transform,opacity",
        },
        "-=0.18",
      )
      .fromTo(
        cards,
        {
          y: 22,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.44,
          stagger: 0.07,
          clearProps: "transform,opacity",
        },
        "-=0.2",
      );
  }, workspaceRef);

  return () => {
    ctx.revert();
  };
}, [theme, selectedHistoryChatId]);

  const recentDiscussions: RecentDiscussionItem[] = [
    ...scanHistory.map((item) => ({ ...item, kind: "product" as const })),
    ...faceScanHistory.map((item) => ({ ...item, kind: "face" as const })),
  ]
    .sort((left, right) =>
      new Date(right.updatedAt || right.createdAt).getTime() -
      new Date(left.updatedAt || left.createdAt).getTime(),
    )
    .slice(0, 6);
  const getChatDisplayName = (
    scanId: string | null | undefined,
    fallbackName: string,
    persistedTitle?: string | null,
  ) => {
    if (!scanId) {
      return normalizeDisplayText(persistedTitle || fallbackName);
    }

    const renamedTitle = renamedDiscussions[scanId]?.trim();
    return normalizeDisplayText(persistedTitle?.trim() || renamedTitle || fallbackName);
  };
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const selectedHistoryChat =
    scanHistory.find((chat) => chat.id === selectedHistoryChatId) ?? null;
  const selectedFaceHistoryChat =
    faceScanHistory.find((chat) => chat.id === selectedFaceChatId) ?? null;
  const selectedNewScanGoal = goals.find((goal) => goal.id === selectedNewScanGoalId) ?? goals[0];
  const newScanIngredientItems = buildIngredientItems(parseIngredientText(newScanIngredientText));
  const hasSavedGoalPreference = Boolean(normalizeSkinGoalId(user?.preferredSkinGoal ?? user?.skinGoal));
  const selectedGoal =
    goals.find(
      (goal) =>
        goal.id === selectedHistoryDetail?.skinGoal ||
        skinGoalApiMap[goal.id] === selectedHistoryDetail?.skinGoal,
    ) ?? goals[0];
  const selectedAnalysisResult: AnalysisResult | null = selectedHistoryChat
    ? (selectedHistoryDetail?.analysisResult ?? {
      score: 0,
      verdict: "good_choice",
      verdictLabel:
        selectedHistoryChat.analysisVerdict || "Analyse enregistrée",
      summary:
        selectedHistoryChat.analysisSummary ||
        "Analyse enregistrée pour ce produit.",
      positives: [],
      watchouts: [],
      recommendations: selectedGoal.tips,
      nextStep: selectedGoal.nextStep,
      followUpQuestions: selectedGoal.questions,
      disclaimer:
        "Analyse informative, non médicale. Consultez un professionnel en cas de doute.",
    })
    : null;
  const selectedIngredientItems = buildIngredientItems(
    selectedHistoryDetail?.ingredients ?? [],
  );
  const selectedProductName =
    selectedHistoryDetail?.productName ||
    selectedHistoryChat?.productName ||
    "Produit scanné";
  const selectedDisplayName = getChatDisplayName(
    selectedHistoryChat?.id,
    selectedProductName,
    selectedHistoryDetail?.customTitle || selectedHistoryChat?.customTitle,
  );
  const selectedFollowUpQuestions = selectedAnalysisResult?.followUpQuestions
    ?.length
    ? selectedAnalysisResult.followUpQuestions
    : selectedGoal.questions;
  const conversationMessages = (
    selectedHistoryDetail?.conversation ?? []
  ).filter((message, index) => !(index === 0 && message.role === "assistant"));

  useEffect(() => {
    if (selectedFaceChatId) {
      return;
    }

    setChatMessages(conversationMessages);
  }, [selectedHistoryDetail?.id, selectedHistoryDetail?.updatedAt, selectedFaceChatId]);

  useEffect(() => {
    if (!selectedFaceChatId) {
      return;
    }

    setChatMessages(selectedFaceDetail?.conversation ?? []);
  }, [selectedFaceChatId, selectedFaceDetail?.id, selectedFaceDetail?.updatedAt, selectedFaceDetail?.conversation]);

  const refreshScanHistory = async () => {
    try {
      const scans = await requestScanHistory();
      setScanHistory(scans);
    } catch {
      setScanHistory([]);
      setFaceScanHistory([]);
    }
  };

  const openFaceScanTutorial = () => {
    setFaceScanTutorialStep(0);
    setIsFaceScanTutorialOpen(true);
  };

  const continueFromFaceScanTutorial = () => {
    setIsFaceScanTutorialOpen(false);
    if (user?.planStatus === "pro") {
      setIsFaceScanDialogOpen(true);
      return;
    }

    setLocalUpgradeReason("face-scan-pro-required");
  };

  const resetNewScanDraft = () => {
    if (newScanImage?.previewUrl) {
      URL.revokeObjectURL(newScanImage.previewUrl);
    }
    setNewScanImage(null);
    setNewScanExtraction(null);
    setNewScanIngredientText("");
    setNewScanWarnings([]);
    setNewScanError("");
    setIsNewScanExtracting(false);
    setIsNewScanAnalyzing(false);
  };

  const beginConversationScan = () => {
    setSelectedHistoryChatId(null);
    resetNewScanDraft();
    const preferredGoal = normalizeSkinGoalId(user?.preferredSkinGoal ?? user?.skinGoal ?? (typeof window !== "undefined" ? window.localStorage.getItem(SKIN_GOAL_STORAGE_KEY) : null));
    setSelectedNewScanGoalId(preferredGoal ?? goals[0].id);
    setIsNewScanOpen(true);
  };

  const savePreferredScanGoal = async (goalId: string) => {
    setSelectedNewScanGoalId(goalId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SKIN_GOAL_STORAGE_KEY, goalId);
    }
    updateUser({ preferredSkinGoal: goalId, skinGoal: goalId });

    const token = getStoredAuthToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferredSkinGoal: goalId }),
      });
    } catch {
      // Local preference is still useful if the profile update cannot be saved now.
    }
  };

  const handleConversationScanFile = async (file?: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNewScanError("Ajoutez une image JPG, PNG ou WEBP.");
      return;
    }

    if (newScanImage?.previewUrl) {
      URL.revokeObjectURL(newScanImage.previewUrl);
    }

    setNewScanImage({ file, previewUrl: URL.createObjectURL(file) });
    setNewScanExtraction(null);
    setNewScanIngredientText("");
    setNewScanWarnings([]);
    setNewScanError("");
    setIsNewScanExtracting(true);

    try {
      const extraction = await requestProductExtraction(file);
      setNewScanExtraction(extraction);
      setNewScanIngredientText(extraction.ingredients.join(", "));
      setNewScanWarnings(Array.from(new Set([
        ...extraction.warnings,
        ...(extraction.fullIngredientListVisible ? [] : ["La liste complète n'est pas visible. L'analyse sera partielle."]),
        ...(extraction.confidence === "low" ? ["Confiance d'extraction faible. Vérifiez les ingrédients."] : []),
        ...(extraction.imageType === "product_front" ? ["Ajoutez la photo de l'étiquette INCI si possible."] : []),
        ...(extraction.uncertainText.length ? [`Texte incertain: ${extraction.uncertainText.join(", ")}`] : []),
        ...(!extraction.usable ? extraction.retakeInstructions : []),
      ])));
      if (!extraction.usable) {
        setNewScanError(extraction.retakeInstructions.join(" ") || "Cette image n'est pas exploitable.");
      } else if (!extraction.ingredients.length) {
        setNewScanError("Je n'ai pas trouvé de liste d'ingrédients lisible. Collez-la ci-dessous ou ajoutez une photo plus nette.");
      }
    } catch (error) {
      setNewScanError(error instanceof Error ? error.message : "Impossible d'extraire les informations du produit.");
    } finally {
      setIsNewScanExtracting(false);
    }
  };

  const analyzeConversationScan = async () => {
    const ingredients = buildIngredientItems(parseIngredientText(newScanIngredientText));
    if (!ingredients.length) {
      setNewScanError("Ajoutez ou confirmez au moins un ingrédient avant l'analyse.");
      return;
    }

    setNewScanError("");
    setIsNewScanAnalyzing(true);

    try {
      const result = await requestScanAnalysis({
        goal: selectedNewScanGoal,
        extractionId: newScanExtraction?.extractionId ?? null,
        ingredients,
      });
      await refreshScanHistory();
      if (result.scanId) {
        setSelectedFaceChatId(null);
        setSelectedHistoryChatId(result.scanId);
      }
      setIsNewScanOpen(false);
      setNewScanImage(null);
      setNewScanExtraction(null);
      setNewScanIngredientText("");
      setNewScanWarnings([]);
    } catch (error) {
      if (error instanceof UpgradeRequiredError) {
        setLocalUpgradeReason(error.reason);
      }
      setNewScanError(error instanceof Error ? error.message : "Impossible de générer l'analyse pour le moment.");
    } finally {
      setIsNewScanAnalyzing(false);
    }
  };

  const askSavedQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();

    if (
      !question ||
      !selectedHistoryChat ||
      !selectedAnalysisResult ||
      isChatSending
    ) {
      return;
    }

    const pendingImage = chatAttachment.consume();
    const createdAt = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: `history-user-${chatMessageIdRef.current++}`,
      role: "user",
      content: question,
      createdAt,
      attachment: pendingImage
        ? { type: "image", mimeType: pendingImage.file.type, previewUrl: pendingImage.previewUrl }
        : undefined,
    };

    setChatInput("");
    setChatMessages((messages) => [...messages, userMessage]);
    setIsChatSending(true);

    try {
      const response = await requestScanChat({
        message: question,
        image: pendingImage?.file,
        scanId: selectedHistoryChat.id,
      });

      const assistantMessage: ChatMessage = {
        id: `history-assistant-${chatMessageIdRef.current++}`,
        role: "assistant",
        content: response.answer,
        createdAt: new Date().toISOString(),
        librarySuggestions: response.librarySuggestions,
      };

      setChatMessages((messages) => [...messages, assistantMessage]);
      setSelectedHistoryDetail((current) =>
        current
          ? {
            ...current,
            promptCount: current.promptCount + 1,
            updatedAt: assistantMessage.createdAt ?? current.updatedAt,
            conversation: [
              ...current.conversation,
              userMessage,
              assistantMessage,
            ],
          }
          : current,
      );
      setScanHistory((items) =>
        items.map((item) =>
          item.id === selectedHistoryChat.id
            ? {
              ...item,
              promptCount: item.promptCount + 1,
              updatedAt: assistantMessage.createdAt ?? item.updatedAt,
            }
            : item,
        ),
      );
    } catch (error) {
      if (error instanceof UpgradeRequiredError) {
        setLocalUpgradeReason(error.reason);
      }
      setChatMessages((messages) => [
        ...messages,
        {
          id: `history-assistant-${chatMessageIdRef.current++}`,
          role: "assistant",
          content: error instanceof Error
            ? error.message
            : "Impossible de répondre pour le moment. Réessayez dans quelques instants.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };


  const askFaceQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();

    if (!question || !selectedFaceChatId || isChatSending) {
      return;
    }

    const pendingImage = chatAttachment.consume();
    const createdAt = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: `face-user-${chatMessageIdRef.current++}`,
      role: "user",
      content: question,
      createdAt,
      attachment: pendingImage
        ? { type: "image", mimeType: pendingImage.file.type, previewUrl: pendingImage.previewUrl }
        : undefined,
    };

    setChatInput("");
    setChatMessages((messages) => [...messages, userMessage]);
    setIsChatSending(true);

    try {
      const response = await requestFaceScanChat({
        faceScanId: selectedFaceChatId,
        message: question,
        image: pendingImage?.file,
      });

      const assistantMessage: ChatMessage = {
        id: `face-assistant-${chatMessageIdRef.current++}`,
        role: "assistant",
        content: response.answer,
        createdAt: new Date().toISOString(),
        librarySuggestions: response.librarySuggestions,
      };

      setChatMessages((messages) => [...messages, assistantMessage]);
      setSelectedFaceDetail((current) =>
        current
          ? {
            ...current,
            updatedAt: assistantMessage.createdAt ?? current.updatedAt,
            conversation: [...current.conversation, userMessage, assistantMessage],
          }
          : current,
      );
    } catch (error) {
      if (error instanceof UpgradeRequiredError) {
        setLocalUpgradeReason(error.reason);
      }
      setChatMessages((messages) => [
        ...messages,
        {
          id: `face-assistant-${chatMessageIdRef.current++}`,
          role: "assistant",
          content: error instanceof Error
            ? error.message
            : "Impossible de répondre pour le moment. Réessayez dans quelques instants.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };
  const startChatRename = () => {
    if (!selectedHistoryChat) {
      return;
    }

    setEditingChatId(selectedHistoryChat.id);
    setChatNameDraft(selectedDisplayName);
  };

  const cancelChatRename = () => {
    setEditingChatId(null);
    setChatNameDraft("");
  };

  const router = useRouter()

  const saveChatRename = async () => {
    if (!editingChatId || isChatNameSaving) {
      return;
    }

    const trimmedName = chatNameDraft.trim();
    if (!trimmedName) {
      return;
    }

    const previousTitles = renamedDiscussions;
    const previousHistory = scanHistory;
    const previousDetail = selectedHistoryDetail;

    setIsChatNameSaving(true);
    setRenamedDiscussions((current) => ({
      ...current,
      [editingChatId]: trimmedName,
    }));
    setScanHistory((items) =>
      items.map((item) =>
        item.id === editingChatId ? { ...item, customTitle: trimmedName } : item,
      ),
    );
    setSelectedHistoryDetail((current) =>
      current && current.id === editingChatId
        ? { ...current, customTitle: trimmedName }
        : current,
    );

    try {
      const saved = await requestRenameProductConversation(editingChatId, trimmedName);
      setRenamedDiscussions((current) => {
        const next = { ...current };
        delete next[editingChatId];
        return next;
      });
      setScanHistory((items) =>
        items.map((item) =>
          item.id === editingChatId
            ? { ...item, customTitle: saved.customTitle ?? trimmedName, updatedAt: saved.updatedAt ?? item.updatedAt }
            : item,
        ),
      );
      setSelectedHistoryDetail((current) =>
        current && current.id === editingChatId
          ? { ...current, customTitle: saved.customTitle ?? trimmedName, updatedAt: saved.updatedAt ?? current.updatedAt }
          : current,
      );
      setEditingChatId(null);
      setChatNameDraft("");
    } catch (error) {
      setRenamedDiscussions(previousTitles);
      setScanHistory(previousHistory);
      setSelectedHistoryDetail(previousDetail);
      setChatMessages((messages) => [
        ...messages,
        {
          id: `history-assistant-${chatMessageIdRef.current++}`,
          role: "assistant",
          content: error instanceof Error ? error.message : tr("Impossible d'enregistrer le nouveau nom."),
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsChatNameSaving(false);
    }
  };

  const palette = isDarkTheme
    ? {
      page: "bg-[#080912] text-[#f7f1fb]",
      overlay:
        "bg-[radial-gradient(circle_at_62%_10%,rgba(224,128,194,0.16),transparent_28%),radial-gradient(circle_at_78%_70%,rgba(151,210,139,0.08),transparent_24%),linear-gradient(135deg,#0d111b_0%,#070811_45%,#11101a_100%)]",
      sidebar:
        "border-r border-white/[0.07] bg-[#0b0d17]/92 shadow-[18px_0_55px_rgba(0,0,0,0.20)]",
      logo: "brightness-0 invert",
      sidebarButton:
        "border-white/10 bg-white/[0.03] text-[#a8a8b8] hover:bg-white/[0.08]",
      primaryButton:
        "bg-[linear-gradient(135deg,rgba(149,81,151,0.88)_0%,rgba(231,139,199,0.88)_100%)] text-white shadow-[0_16px_34px_rgba(202,105,179,0.22)]",
      sidebarLabel: "text-[#777583]",
      navActive:
        "bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      navIdle: "text-[#dbd8e4] hover:bg-white/[0.05]",
      recentCard: "border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.07]",
      recentActive: "border-[#e8a0d8]/45 bg-white/[0.09]",
      recentText: "text-white",
      recentMuted: "text-[#918f9e]",
      premiumCard:
        "border-white/[0.08] bg-[linear-gradient(180deg,rgba(45,31,55,0.82)_0%,rgba(25,22,34,0.9)_100%)] shadow-[0_14px_38px_rgba(0,0,0,0.18)]",
      premiumTitle: "text-[#f0a8d9]",
      premiumText: "text-[#bdb7c8]",
      premiumButton:
        "bg-[linear-gradient(135deg,#9b5f99_0%,#cf7db5_100%)] text-white shadow-[0_10px_22px_rgba(198,111,177,0.22)]",
      headerButton:
        "border-white/[0.10] bg-white/[0.04] text-white hover:bg-white/[0.08]",
      heading: "text-white",
      subtext: "text-[#aaa6b5]",
      orb: "border-[#d88fe1]/70 text-[#f09bd1] shadow-[0_0_42px_rgba(219,126,209,0.14)]",
      orbRing: "border-[#a47df2]/80",
      actionCard:
        "border-white/[0.13] bg-white/[0.045] hover:border-[#dca0dd]/50 hover:bg-white/[0.07]",
      actionTitle: "text-white",
      actionText: "text-[#aaa6b5]",
      prompt:
        "border-white/[0.16] bg-white/[0.045] shadow-[0_18px_50px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.05)]",
      promptInput: "text-white placeholder:text-[#898693]",
      promptMeta: "text-[#a9a5b3]",
      iconButton: "border-white/[0.16] bg-white/[0.04] text-white",
      featureCard:
        "border-white/[0.10] bg-white/[0.045] hover:bg-white/[0.07]",
      featureTitle: "text-white",
      featureText: "text-[#aaa6b5]",
      detailCard:
        "border-white/[0.10] bg-white/[0.045] shadow-[0_18px_50px_rgba(0,0,0,0.18)]",
      detailBadge: "bg-white/[0.08] text-[#f5c0e1]",
      detailMeta: "text-[#b9b5c5]",
    }
    : {
      page: "bg-[#f6f1fb] text-[#1b1a2b]",
      overlay:
        "bg-[radial-gradient(circle_at_60%_14%,rgba(194,128,224,0.18),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(180,223,164,0.18),transparent_20%),linear-gradient(180deg,#fffdfd_0%,#f9f5ff_40%,#f4f8fb_100%)]",
      sidebar:
        "border-r border-[#eadff7] bg-white/88 shadow-[18px_0_45px_rgba(103,74,151,0.10)]",
      logo: "",
      sidebarButton:
        "border-[#ebddf9] bg-[#faf6ff] text-[#6c6289] hover:bg-[#f3ecff]",
      primaryButton:
        "bg-[linear-gradient(135deg,#a56ae2_0%,#e89ac7_100%)] text-white shadow-[0_16px_32px_rgba(202,105,179,0.18)]",
      sidebarLabel: "text-[#8f86a7]",
      navActive:
        "bg-[#f6f1ff] text-[#231f36] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
      navIdle: "text-[#5c5671] hover:bg-[#f6f1ff]",
      recentCard: "border-[#ece5f7] bg-white/90 hover:bg-[#fbf8ff]",
      recentActive: "border-[#ceafe8] bg-[#f9f2ff]",
      recentText: "text-[#221d35]",
      recentMuted: "text-[#7c7693]",
      premiumCard:
        "border-[#ecdff7] bg-[linear-gradient(180deg,#fbf7ff_0%,#f7effa_100%)] shadow-[0_14px_38px_rgba(136,101,184,0.12)]",
      premiumTitle: "text-[#b1689b]",
      premiumText: "text-[#7d7792]",
      premiumButton:
        "bg-[linear-gradient(135deg,#c882bf_0%,#e7a0cf_100%)] text-white shadow-[0_10px_22px_rgba(198,111,177,0.18)]",
      headerButton:
        "border-[#e7def4] bg-white/85 text-[#2a2440] hover:bg-white",
      heading: "text-[#221d35]",
      subtext: "text-[#726b86]",
      orb: "border-[#d7a5dd] text-[#c76ab6] shadow-[0_0_35px_rgba(219,126,209,0.12)] bg-white/70",
      orbRing: "border-[#c9a0ef]",
      actionCard:
        "border-[#eadff7] bg-white/86 hover:border-[#dca0dd] hover:bg-white",
      actionTitle: "text-[#241f36]",
      actionText: "text-[#726b86]",
      prompt:
        "border-[#eadff7] bg-white/88 shadow-[0_18px_45px_rgba(136,101,184,0.10)]",
      promptInput: "text-[#241f36] placeholder:text-[#928aa6]",
      promptMeta: "text-[#7f7893]",
      iconButton: "border-[#e5dbf4] bg-white text-[#433d58]",
      featureCard: "border-[#eadff7] bg-white/86 hover:bg-white",
      featureTitle: "text-[#241f36]",
      featureText: "text-[#726b86]",
      detailCard:
        "border-[#eadff7] bg-white/88 shadow-[0_18px_45px_rgba(136,101,184,0.10)]",
      detailBadge: "bg-[#f5ecff] text-[#9a56bf]",
      detailMeta: "text-[#7d7792]",
    };

  return (
    <main
      className={`h-screen overflow-hidden [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed ${palette.page}`}
    >
      <div className={`pointer-events-none fixed inset-0 ${palette.overlay}`} />
      <div className={`fixed inset-0 z-40 bg-[#120d20]/30 backdrop-blur-[4px] transition lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsSidebarOpen(false)} />
      <div
        className={`fixed inset-0 z-40 bg-[#120d20]/30 backdrop-blur-[4px] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div ref={workspaceRef} className="relative flex h-screen w-full">
        <aside
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[86vw] shrink-0 flex-col px-4 py-4 backdrop-blur-2xl transition-transform duration-300 ease-out
                    lg:static lg:z-auto lg:w-[248px] lg:max-w-none lg:translate-x-0 lg:px-4
                    xl:w-[270px] xl:px-5
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    ${palette.sidebar}`}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/logo.png"
              alt="SkinorAI"
              width={150}
              height={36}
              className={`h-8 cursor-pointer w-auto ${palette.logo}`}
              priority
              onClick={() => { router.push("/")}}
            />
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className={`rounded-lg cursor-pointer border p-1.5 transition ${palette.sidebarButton}`}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSidebarOpen(false);
              beginConversationScan();
            }}
            className="mt-6 flex h-[45px] cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-[#F7DDE8] via-[#F3D4E3] to-[#EEDAF7] px-5 text-sm font-medium text-[#7A3F5C] shadow-[0_10px_24px_rgba(122,63,92,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#F4D2DF] hover:via-[#EFC9DB] hover:to-[#E8D1F4] active:translate-y-0"
          >
            <Plus className="h-5 w-5" />
            {tr("Nouvelle discussion")}
          </button>

          <div className="mt-6">
            <p
              className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${palette.sidebarLabel}`}
            >
              {tr("Menu")}
            </p>
            <nav className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedHistoryChatId(null);
                  setIsSidebarOpen(false);
                }}
                className={`relative flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium transition ${selectedHistoryChat || selectedFaceChatId ? palette.navIdle : palette.navActive}`}
              >
                {!selectedHistoryChat && !selectedFaceChatId && (
                  <span className="absolute -left-5 h-8 w-1 rounded-full bg-[#ef8fdf]" />
                )}
                <CircleHelp className="h-5 w-5" />
                {tr("Discussions")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push("/ingredient-library");
                }}
                className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium transition ${palette.navIdle}`}
              >
                <FlaskConical className="h-5 w-5" />
                {tr("Bibliothèque d'ingrédients")}
              </button>
            </nav>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <p
              className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${palette.sidebarLabel}`}
            >
              {tr("Récent")}
            </p>
            <div className="mt-3 space-y-2">
              {isHistoryLoading ? (
                <p
                  className={`rounded-xl border px-3 py-2.5 text-xs ${palette.recentCard} ${palette.recentMuted}`}
                >
                  {tr("Chargement des discussions...")}
                </p>
              ) : recentDiscussions.length > 0 ? (
                recentDiscussions.map((chat) => {
                  const isFaceChat = chat.kind === "face";
                  const isActive = isFaceChat ? chat.id === selectedFaceChatId : chat.id === selectedHistoryChatId;

                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => {
                        if (isFaceChat) {
                          setSelectedHistoryChatId(null);
                          setSelectedFaceChatId(chat.id);
                        } else {
                          setSelectedFaceChatId(null);
                          setSelectedHistoryChatId(chat.id);
                        }
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${isActive ? palette.recentActive : palette.recentCard}`}
                    >
                      <p
                        className={`truncate text-sm font-medium ${palette.recentText}`}
                      >
                        {isFaceChat ? getChatDisplayName(chat.id, chat.title, chat.customTitle) : getChatDisplayName(chat.id, chat.productName, chat.customTitle)}
                      </p>
                      <p className={`mt-1 text-sm ${palette.recentMuted}`}>
                        {formatScanHistoryDate(
                          chat.updatedAt || chat.createdAt,
                        )}
                      </p>
                      {(isFaceChat ? chat.summary : chat.analysisSummary) && (
                        <p
                          className={`mt-2 line-clamp-2 text-sm leading-5 ${palette.recentMuted}`}
                        >
                          {isFaceChat ? chat.summary : chat.analysisSummary}
                        </p>
                      )}
                    </button>
                  );
                })
              ) : (
                <p
                  className={`rounded-xl border px-3 py-2.5 text-xs leading-5 ${palette.recentCard} ${palette.recentMuted}`}
                >
                  {tr("Aucune discussion pour le moment. Lancez un scan pour alimenter cette liste.")}
                </p>
              )}
            </div>
          </div>

          <div
            className={`mt-4 rounded-2xl p-2 text-center max-lg:mb-4 lg:p-2 xl:p-2 ${palette.premiumCard}`}
          >
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#f0a4db]/25 bg-transparent text-[#f3a6d6]">
              {hasProPlan ? <ShieldCheck className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <h2
              className={`mt-3 text-sm font-semibold ${palette.premiumTitle}`}
            >
              {hasProPlan ? tr("Plan Pro actif") : tr("Débloquer Premium")}
            </h2>
            <p className={`mt-2 text-sm leading-5 ${palette.premiumText}`}>
              {hasProPlan
                ? tr("Votre abonnement Pro est actif sur ce compte.")
                : tr("Obtenez des analyses plus poussées, des scans illimités et des routines personnalisées.")}
            </p>
            {!hasProPlan && (
              <button
                type="button"
                onClick={() => router.push('/pricing')}
                className={`mt-4 h-10 w-full rounded-xl text-sm font-semibold cursor-pointer ${palette.premiumButton}`}
              >
                {tr("Passer à Premium")}
              </button>
            )}
          </div>
        </aside>

        <section className="relative min-w-0 flex-1 overflow-y-auto px-4 pt-4 sm:px-5 lg:px-6 xl:px-7">
          <header ref={headerRef} className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setIsSidebarOpen(true)} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden ${palette.headerButton}`}>
              <PanelLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setTheme((current) => (current === "dark" ? "light" : "dark"))
                }
                className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium backdrop-blur transition ${palette.headerButton}`}
              >
                {isDarkTheme ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {isDarkTheme ? tr("Clair") : tr("Sombre")}
              </button>
              <button
                type="button"
                onClick={() => router.push('/settings')}
                className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-4 text-xs font-medium backdrop-blur transition-colors duration-300 hover:!bg-gray-50 ${palette.headerButton}`}
              >
                {tr("Paramètres")}
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[980px] flex-col justify-start pt-6">
            {selectedFaceChatId ? (
              <div ref={heroRef} className="flex flex-1 flex-col pt-4">
                <div data-chat-hero className="flex items-center justify-between gap-4">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${palette.subtext}`}>{tr("Conversation visage")}</p>
                    <h1 className={`mt-2 text-[24px] font-medium leading-tight tracking-[-0.04em] sm:text-[32px] ${palette.heading}`}>{normalizeDisplayText(selectedFaceDetail?.customTitle || selectedFaceHistoryChat?.customTitle || selectedFaceDetail?.title || selectedFaceHistoryChat?.title || selectedFaceDetail?.guidance?.priorities?.[0] || tr("Analyse visage"))}</h1>
                    <p className={`mt-2 max-w-2xl text-sm leading-6 ${palette.subtext}`}>{tr("Un résumé simple, sans diagnostic. Vous pouvez continuer la discussion dans ce fil.")}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedFaceChatId(null)} className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition ${palette.headerButton}`}>{tr("Retour à l'accueil")}</button>
                </div>

                <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-[22px]">
                  <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
                    <div className="space-y-4 p-4">
                      {isFaceConversationLoading ? (
                        <div className={`h-40 rounded-2xl border ${palette.detailCard}`} />
                      ) : selectedFaceDetail ? (
                        <div data-chat-card className={`rounded-[24px] border p-5 shadow-sm ${isDarkTheme ? "border-white/[0.1] bg-white/[0.05]" : "border-[#ece5fb] bg-white"}`}>
                          <div className="flex items-start gap-3">
                            <span className={`mt-1 flex h-11 w-11 items-center justify-center rounded-full ${isDarkTheme ? "bg-[#1b1630] text-[#e9a2d0]" : "bg-[#f3edff] text-[#7a55ea]"}`}><Sparkles className="h-5 w-5" /></span>
                            <div>
                              <h2 className={`text-xl font-bold ${palette.heading}`}>{tr("À retenir")}</h2>
                              <p className={`mt-3 max-w-[760px] text-sm leading-6 ${palette.subtext}`}>{normalizeDisplayText(selectedFaceDetail.guidance.explanation || tr("Voici les points visibles à retenir, sans diagnostic médical."))}</p>
                            </div>
                          </div>
                          <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <div className={`rounded-2xl border p-4 ${palette.detailCard}`}><p className={`text-sm font-bold ${palette.heading}`}>{tr("Priorités")}</p><ul className={`mt-3 space-y-2 text-sm leading-5 ${palette.subtext}`}>{(selectedFaceDetail.guidance.priorities ?? []).slice(0, 3).map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{normalizeDisplayText(item)}</li>)}</ul></div>
                            <div className={`rounded-2xl border p-4 ${palette.detailCard}`}><p className={`text-sm font-bold ${palette.heading}`}>{tr("Routine")}</p><div className={`mt-3 space-y-2 text-sm leading-5 ${palette.subtext}`}>{(selectedFaceDetail.guidance.routineCategories ?? []).slice(0, 2).map((item) => <p key={`${item.step}-${item.guidance}`}><span className="font-semibold text-[#a764dc]">{normalizeDisplayText(item.step)}:</span> {normalizeDisplayText(item.guidance)}</p>)}</div></div>
                            <div className={`rounded-2xl border p-4 ${palette.detailCard}`}><p className={`text-sm font-bold ${palette.heading}`}>{tr("Ingrédients")}</p><div className="mt-3 flex flex-wrap gap-2">{(selectedFaceDetail.guidance.potentiallyUsefulIngredients ?? []).slice(0, 5).map((item) => <span key={item} className="rounded-full bg-[#ce98fb]/16 px-3 py-1.5 text-xs font-bold text-[#a764dc]">{normalizeDisplayText(item)}</span>)}</div></div>
                          </div>
                          <p className={`mt-5 rounded-2xl px-4 py-3 text-xs leading-5 ${isDarkTheme ? "bg-white/[0.04] text-white/65" : "bg-[#faf7ff] text-[#68708b]"}`}>{normalizeDisplayText(selectedFaceDetail.guidance.disclaimer || tr("Ces informations ne sont pas un diagnostic médical. La lumière et la caméra peuvent influencer le résultat."))}</p>
                          {(selectedFaceDetail.guidance.followUpQuestions ?? []).length > 0 && <div className="mt-5 flex flex-wrap gap-2">{(selectedFaceDetail.guidance.followUpQuestions ?? []).slice(0, 4).map((question) => <button key={question} type="button" onClick={() => void askFaceQuestion(question)} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${isDarkTheme ? "border-white/[0.1] bg-white/[0.04] text-[#f0c2df] hover:bg-white/[0.08]" : "border-[#e7defc] bg-[#faf7ff] text-[#7350e5] hover:bg-[#f1eaff]"}`}>{normalizeDisplayText(question)}</button>)}</div>}
                        </div>
                      ) : <div className={`rounded-2xl border p-4 text-sm ${palette.detailCard} ${palette.subtext}`}>{tr("Impossible de charger cette analyse visage pour le moment.")}</div>}

                      {chatMessages.map((message) => <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className="max-w-[78%]"><div className={`rounded-[22px] border px-4 py-3 text-sm leading-6 ${message.role === "user" ? isDarkTheme ? "border-[#d598d2]/20 bg-gradient-to-r from-[#a56ae2] to-[#e89ac7] text-white" : "border-[#e8defc] bg-[#f7f2ff] text-[#252044]" : isDarkTheme ? "border-white/[0.1] bg-white/[0.05] text-white" : "border-[#ece5fb] bg-white text-[#59617d]"}`}>{message.attachment && buildAttachmentImageUrl(message.attachment.previewUrl ?? message.attachment.url) && <div className="mb-2 overflow-hidden rounded-xl border border-[#e5ddfb]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={buildAttachmentImageUrl(message.attachment.previewUrl ?? message.attachment.url)!} alt={tr("Image jointe")} className="max-h-44 w-full object-cover" /></div>}<AnimatedChatText content={message.content} animate={message.role === "assistant"} /></div>{message.role === "assistant" && <LibrarySuggestionStrip suggestions={message.librarySuggestions} isDarkTheme={isDarkTheme} />}</div></div>)}
                      {isChatSending && <div className="flex justify-start"><div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-sm ${isDarkTheme ? "border-white/[0.12] bg-white/[0.05] text-[#f0c2df]" : "border-[#ece5fb] bg-white text-[#7a55ea]"}`}><LoaderCircle className="h-3.5 w-3.5 animate-spin" />{tr("SkinorAI réfléchit...")}</div></div>}
                    </div>
                  </div>
                  <div className="sticky bottom-0 z-20 mt-auto -mx-5 px-5 pb-3 pt-3 backdrop-blur-xl lg:-mx-7 lg:px-7">
                    <input ref={chatAttachment.inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; try { chatAttachment.selectFile(file); } catch (error) { setChatMessages((messages) => [...messages, { id: `face-assistant-${chatMessageIdRef.current++}`, role: "assistant", content: error instanceof Error ? error.message : tr("Image invalide."), createdAt: new Date().toISOString() }]); } }} />
                    {chatAttachment.image && <div className={`mx-auto mb-2 flex w-full max-w-3xl items-center gap-3 rounded-2xl border p-2 ${isDarkTheme ? "border-white/10 bg-[#15111d]" : "border-[#ead8ef] bg-white"}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={chatAttachment.image.previewUrl} alt={tr("Image sélectionnée")} className="h-12 w-12 rounded-xl object-cover" /><span className="min-w-0 flex-1 truncate text-xs font-semibold">{chatAttachment.image.file.name}</span><button type="button" onClick={chatAttachment.remove} className="grid h-8 w-8 place-items-center rounded-full" aria-label={tr("Retirer l'image")}><X className="h-4 w-4" /></button></div>}
                    <div className={`mx-auto flex h-12 w-full max-w-3xl items-center gap-2 rounded-full border px-3 shadow-[0_14px_35px_rgba(122,63,92,0.12)] transition ${isDarkTheme ? "border-white/10 bg-[#15111d]" : "border-[#ead8ef] bg-gradient-to-r from-[#fff7fb] via-[#f8edf7] to-[#f1e9ff]"}`}><button type="button" onClick={() => chatAttachment.inputRef.current?.click()} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${isDarkTheme ? "text-white/75 hover:bg-white/10" : "text-[#8b5cf6] hover:bg-[#efe5ff]"}`}><Plus className="h-4 w-4" /></button><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void askFaceQuestion(chatInput); } }} placeholder={tr("Posez une question sur vos résultats...")} className={`h-full min-w-0 flex-1 bg-transparent text-sm outline-none ${palette.promptInput}`} /><button type="button" onClick={() => void askFaceQuestion(chatInput)} disabled={!chatInput.trim() || isChatSending || !selectedFaceChatId} className="ml-auto flex h-10 w-10 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#b594ff] to-[#8c57eb] text-white transition disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /></button></div>
                  </div>
                </div>
              </div>
            ) : selectedHistoryChat ? (
              <div ref={heroRef} className="flex flex-1 flex-col pt-4">
                <div
                  data-chat-hero
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.22em] ${palette.subtext}`}
                    >
                      Conversation
                    </p>
                    {editingChatId === selectedHistoryChat.id ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={chatNameDraft}
                          onChange={(event) =>
                            setChatNameDraft(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void saveChatRename();
                            }

                            if (event.key === "Escape") {
                              event.preventDefault();
                              cancelChatRename();
                            }
                          }}
                          className={`min-w-[280px] rounded-xl border px-4 py-2 text-[24px] font-medium leading-tight tracking-[-0.04em] outline-none sm:text-[32px] ${isDarkTheme ? "border-white/[0.12] bg-white/[0.04] text-white" : "border-[#e7defc] bg-white text-[#221d35]"}`}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => void saveChatRename()}
                          disabled={!chatNameDraft.trim() || isChatNameSaving}
                          className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${palette.headerButton}`}
                        >
                          <Check className="h-4 w-4" />
                          {isChatNameSaving ? tr("Enregistrement...") : tr("Enregistrer")}
                        </button>
                        <button
                          type="button"
                          onClick={cancelChatRename}
                          className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${palette.headerButton}`}
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h1
                          className={`text-[24px] font-medium leading-tight tracking-[-0.04em] sm:text-[32px] ${palette.heading}`}
                        >
                          {selectedDisplayName}
                        </h1>
                        <button
                          type="button"
                          onClick={startChatRename}
                          className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${palette.headerButton}`}
                        >
                          <Pencil className="h-4 w-4" />
                          Renommer
                        </button>
                      </div>
                    )}
                    <p
                      className={`mt-2 max-w-2xl text-sm leading-6 ${palette.subtext}`}
                    >
                      Reprenez votre analyse, retrouvez le résultat précédent et
                      continuez la discussion dans le même fil.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryChatId(null)}
                    className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition ${palette.headerButton}`}
                  >
                    Retour à l&apos;accueil
                  </button>
                </div>

                <div
                  ref={promptRef}
                  className="mt-5 flex min-h-0 flex-1 flex-col rounded-[22px]"
                >
                  <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
                    <div className="space-y-4 p-4">
                      <div className="flex justify-end">
                        <div
                          data-chat-card
                          className={`max-w-[78%] rounded-[22px] border px-4 py-3 text-sm leading-6 ${isDarkTheme ? "border-white/[0.1] bg-white/[0.06] text-white" : "border-[#e8defc] bg-[#f7f2ff] text-[#252044]"}`}
                        >
                          <p className="font-medium">
                            {selectedDisplayName} - objectif :{" "}
                            {normalizeDisplayText(selectedGoal.label)}
                          </p>
                          <p
                            className={`mt-2 ${isDarkTheme ? "text-white/75" : "text-[#69718f]"}`}
                          >
                            J&apos;ai scanné ce produit pour vérifier s&apos;il
                            est bien adapté à mon objectif peau et à ma routine.
                          </p>
                        </div>
                      </div>

                      {selectedAnalysisResult && (
                        <div
                          data-chat-card
                          className={`rounded-[24px] border p-5 shadow-sm ${isDarkTheme ? "border-white/[0.1] bg-white/[0.05]" : "border-[#ece5fb] bg-white"}`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-1 flex h-11 w-11 items-center justify-center rounded-full ${isDarkTheme ? "bg-[#1b1630] text-[#e9a2d0]" : "bg-[#f3edff] text-[#7a55ea]"}`}
                              >
                                <Sparkles className="h-5 w-5" />
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h2
                                    className={`text-xl font-bold ${palette.heading}`}
                                  >
                                    Résultat de l&apos;analyse IA
                                  </h2>
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${isDarkTheme ? "bg-[#1c2f24] text-[#86d79f]" : "bg-[#e7f8ec] text-[#21a35c]"}`}
                                  >
                                    {normalizeDisplayText(selectedAnalysisResult.verdictLabel)}
                                  </span>
                                </div>
                                <p
                                  className={`mt-3 max-w-[760px] text-sm leading-6 ${palette.subtext}`}
                                >
                                  {normalizeDisplayText(selectedAnalysisResult.summary)}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`rounded-[16px] px-3 py-2 text-2xl font-bold shadow-sm ${isDarkTheme ? "bg-[#16291d] text-[#86d79f]" : "bg-[#e9faef] text-[#20a45c]"}`}
                            >
                              {selectedAnalysisResult.score > 0
                                ? `${selectedAnalysisResult.score}/10`
                                : "--/10"}
                            </span>
                          </div>

                          <div className="mt-5 grid gap-4 xl:grid-cols-3">
                            <InsightCard
                              title="Points forts"
                              tone="green"
                              items={(selectedAnalysisResult.positives ?? []).map((item) => ({ ...item, ingredient: normalizeDisplayText(item.ingredient), reason: normalizeDisplayText(item.reason), tag: normalizeDisplayText(item.tag) }))}
                              isDarkTheme={isDarkTheme}
                            />
                            <InsightCard
                              title="À surveiller"
                              tone="orange"
                              items={(selectedAnalysisResult.watchouts ?? []).map((item) => ({ ...item, ingredient: normalizeDisplayText(item.ingredient), reason: normalizeDisplayText(item.reason) }))}
                              isDarkTheme={isDarkTheme}
                            />
                            <NextStepCard
                              tips={
                                selectedAnalysisResult.recommendations?.length
                                  ? selectedAnalysisResult.recommendations.map(normalizeDisplayText)
                                  : selectedGoal.tips.map(normalizeDisplayText)
                              }
                              nextStep={
                                normalizeDisplayText(selectedAnalysisResult.nextStep) ||
                                normalizeDisplayText(selectedGoal.nextStep)
                              }
                              isDarkTheme={isDarkTheme}
                            />
                          </div>

                          <p
                            className={`mt-5 rounded-2xl px-4 py-3 text-xs leading-5 ${isDarkTheme ? "bg-white/[0.04] text-white/65" : "bg-[#faf7ff] text-[#68708b]"}`}
                          >
                            {selectedAnalysisResult.disclaimer ||
                              "Analyse informative, non médicale. Consultez un professionnel en cas de doute."}
                          </p>

                          <div className="mt-5">
                            <h3
                              className={`text-base font-semibold ${palette.heading}`}
                            >
                              Questions à poser
                            </h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selectedFollowUpQuestions.map((question) => (
                                <button
                                  key={question}
                                  type="button"
                                  onClick={() =>
                                    void askSavedQuestion(question)
                                  }
                                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${isDarkTheme ? "border-white/[0.1] bg-white/[0.04] text-[#f0c2df] hover:bg-white/[0.08]" : "border-[#e7defc] bg-[#faf7ff] text-[#7350e5] hover:bg-[#f1eaff]"}`}
                                >
                                  {normalizeDisplayText(question)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {isConversationLoading ? (
                        <div className="space-y-3">
                          <div
                            className={`h-16 rounded-2xl border ${palette.detailCard}`}
                          />
                          <div
                            className={`ml-auto h-14 w-[72%] rounded-2xl border ${palette.detailCard}`}
                          />
                          <div
                            className={`h-16 w-[78%] rounded-2xl border ${palette.detailCard}`}
                          />
                        </div>
                      ) : chatMessages.length > 0 ? (
                        <div className="space-y-3">
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[78%] rounded-[22px] border px-4 py-3 text-sm leading-6 ${message.role === "user"
                                  ? isDarkTheme
                                    ? "border-[#d598d2]/20 bg-gradient-to-r from-[#a56ae2] to-[#e89ac7] text-white shadow-[0_12px_28px_rgba(168,103,197,0.24)]"
                                    : "border-[#e8defc] bg-[#f7f2ff] text-[#252044]"
                                  : isDarkTheme
                                    ? "border-white/[0.1] bg-white/[0.05] text-white"
                                    : "border-[#ece5fb] bg-white text-[#59617d]"
                                  }`}
                              >
                                {message.attachment && (
                                  <div className={`mb-2 overflow-hidden rounded-xl border ${isDarkTheme ? "border-white/10" : "border-[#ece5fb]"}`}>
                                    {buildAttachmentImageUrl(message.attachment.previewUrl ?? message.attachment.url) ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={buildAttachmentImageUrl(message.attachment.previewUrl ?? message.attachment.url)!} alt={tr("Image jointe")} className="max-h-44 w-full object-cover" />
                                    ) : (
                                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold"><Paperclip className="h-3.5 w-3.5" />{tr("Image jointe")}</div>
                                    )}
                                  </div>
                                )}
                                <AnimatedChatText content={message.content} animate={message.role === "assistant"} />
                                {message.role === "assistant" && (
                                  <LibrarySuggestionStrip suggestions={message.librarySuggestions} isDarkTheme={isDarkTheme} />
                                )}
                                <p
                                  className={`mt-2 text-[11px] ${message.role === "user" ? (isDarkTheme ? "text-white/80" : "text-[#7a6ea6]") : palette.subtext}`}
                                >
                                  {formatScanHistoryDate(
                                    message.createdAt ??
                                    selectedHistoryDetail?.updatedAt ??
                                    selectedHistoryChat.updatedAt ??
                                    new Date().toISOString(),
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`rounded-2xl border p-4 text-sm ${palette.detailCard} ${palette.subtext}`}
                        >{tr("Aucune question enregistree pour ce scan pour le moment. Vous pouvez reprendre la conversation ci-dessous.")}</div>
                      )}

                      {isChatSending && (
                        <div className="flex justify-start">
                          <div
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-sm ${isDarkTheme ? "border-white/[0.12] bg-white/[0.05] text-[#f0c2df]" : "border-[#ece5fb] bg-white text-[#7a55ea]"}`}
                          >
                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                            SkinorAI réfléchit...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`sticky bottom-0 z-20 mt-auto -mx-5 px-5 pb-3 pt-3 backdrop-blur-xl lg:-mx-7 lg:px-7`}
                  >
                    <input
                      ref={chatAttachment.inputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        try {
                          chatAttachment.selectFile(file);
                        } catch (error) {
                          setChatMessages((messages) => [...messages, {
                            id: `history-assistant-${chatMessageIdRef.current++}`,
                            role: "assistant",
                            content: error instanceof Error ? error.message : tr("Image invalide."),
                            createdAt: new Date().toISOString(),
                          }]);
                        }
                      }}
                    />
                    {chatAttachment.image && (
                      <div className={`mx-auto mb-2 flex w-full max-w-3xl items-center gap-3 rounded-2xl border p-2 ${isDarkTheme ? "border-white/10 bg-[#15111d]" : "border-[#ead8ef] bg-white"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={chatAttachment.image.previewUrl} alt={tr("Image sélectionnée")} className="h-12 w-12 rounded-xl object-cover" />
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold">{chatAttachment.image.file.name}</span>
                        <button type="button" onClick={chatAttachment.remove} className="grid h-8 w-8 place-items-center rounded-full" aria-label={tr("Retirer l'image")}><X className="h-4 w-4" /></button>
                      </div>
                    )}
                    <div
                      className={`mx-auto flex h-12 w-full max-w-3xl items-center gap-2 rounded-full border px-3 shadow-[0_14px_35px_rgba(122,63,92,0.12)] transition ${isDarkTheme
                        ? "border-white/10 bg-[#15111d]"
                        : "border-[#ead8ef] bg-gradient-to-r from-[#fff7fb] via-[#f8edf7] to-[#f1e9ff]"
                        }`}
                    >
                      <div className="relative shrink-0">
                        {showPlusMenu && (
                          <div
                            className={`plus-menu-fade-in absolute bottom-full left-0 mb-3 min-w-[150px] rounded-2xl border p-1 shadow-[0_18px_40px_rgba(0,0,0,0.14)] ${isDarkTheme
                              ? "border-white/10 bg-[#1b1624]"
                              : "border-[#ead8ef] bg-white"
                              }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setShowPlusMenu(false);
                                chatAttachment.inputRef.current?.click();
                              }}
                              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${isDarkTheme
                                ? "text-white/85 hover:bg-white/10"
                                : "text-[#33243c] hover:bg-[#f5eefe]"
                                }`}
                            >
                              <Paperclip className="h-4 w-4" />
                              {tr("Joindre une image")}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPlusMenu(false);
                                router.push("/ingredient-library");
                              }}
                              className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${isDarkTheme
                                ? "text-white/85 hover:bg-white/10"
                                : "text-[#33243c] hover:bg-[#f5eefe]"
                                }`}
                            >
                              {tr("Bibliothèque d'ingrédients")}
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowPlusMenu((prev) => !prev)}
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${isDarkTheme
                            ? "text-white/75 hover:bg-white/10"
                            : "text-[#8b5cf6] hover:bg-[#efe5ff]"
                            }`}
                          aria-label="Nouvelle question"
                        >
                          <Plus className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <input
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void askSavedQuestion(chatInput);
                          }
                        }}
                        className={`min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none ${isDarkTheme
                          ? "text-white placeholder:text-white/40"
                          : "text-[#33243c] placeholder:text-[#9a88a8]"
                          }`}
                        placeholder="Poser une question"
                      />

                      <button
                        type="button"
                        onClick={() => void askSavedQuestion(chatInput)}
                        disabled={!chatInput.trim() || isChatSending}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9b7cff] to-[#d78ac8] text-white shadow-[0_8px_18px_rgba(139,92,246,0.24)] transition hover:scale-105 hover:shadow-[0_10px_24px_rgba(139,92,246,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={tr("Envoyer")}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>

                    <p
                      className={`mt-2 text-center text-[10px] ${isDarkTheme ? "text-white/35" : "text-[#9a8faa]"
                        }`}
                    >
                      SkinorAI peut faire des erreurs. Vérifiez les informations
                      importantes.
                    </p>
                  </div>
                </div>
              </div>
            ) : isNewScanOpen ? (
              <NewScanConversationPanel
                isDarkTheme={isDarkTheme}
                palette={palette}
                tr={tr}
                goals={goals}
                selectedGoal={selectedNewScanGoal}
                selectedGoalId={selectedNewScanGoalId}
                hasSavedGoalPreference={hasSavedGoalPreference}
                uploadInputRef={scanUploadInputRef}
                image={newScanImage}
                extraction={newScanExtraction}
                ingredientText={newScanIngredientText}
                ingredientItems={newScanIngredientItems}
                warnings={newScanWarnings}
                error={newScanError}
                isExtracting={isNewScanExtracting}
                isAnalyzing={isNewScanAnalyzing}
                onPickFile={handleConversationScanFile}
                onSelectGoal={savePreferredScanGoal}
                onIngredientTextChange={setNewScanIngredientText}
                onAnalyze={analyzeConversationScan}
                onCancel={() => {
                  resetNewScanDraft();
                  setIsNewScanOpen(false);
                }}
              />
            ) : (
              <div
                ref={heroRef}
                className="flex flex-1 flex-col items-center justify-start py-2 text-center"
              >
                <div
                  data-chat-hero
                  className="relative mt-1 flex justify-center"
                >
                  <img src={isDarkTheme ? "/favicon.png" : "/favicon.png"} alt="Scan hero" className="w-[16px] h-20" />
                </div>
                <h1
                  data-chat-hero
                  className={`mt-3 text-[28px] font-medium leading-tight tracking-[-0.05em] sm:text-[36px] ${palette.heading}`}
                >
                  {tr("Prête à mieux comprendre votre peau ?")}
                </h1>
                {/* <p data-chat-hero className={`mt-2 max-w-xl text-[13px] leading-5 sm:text-sm ${palette.subtext}`}>
                  Your AI skincare companion for science-backed insights and personalized recommendations.
                </p> */}

                <div
                  data-chat-hero
                  className="mt-4 grid w-full max-w-[700px] gap-4 md:grid-cols-2"
                >
                  <button
                    type="button"
                    onClick={beginConversationScan}
                    className={`group cursor-pointer flex min-h-[316px] gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-1 ${palette.actionCard}`}
                  >
                    {/* <ScanBarcode className="h-10 w-10 text-[#bce58d]" /> */}
                    <span className="justify-items-center">
                      <span
                        className={`block text-[17px] font-semibold ${palette.actionTitle}`}
                      >
                        {tr("Scanner un produit")} <span className="ml-1 rounded-full bg-emerald-500/12 px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-500">{tr("Inclus en Free")}</span>
                      </span>
                      <span
                        className={`mt-1.5 block text-[13px] leading-5 ${palette.actionText}`}
                      >
                        {tr("Extrayez les informations visibles du produit et analysez les ingrédients confirmés.")}
                      </span>
                      <img src="/icons/scan.png" alt="scan product" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={openFaceScanTutorial}
                    className={`group cursor-pointer flex min-h-[316px] items-center gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-1 ${palette.actionCard}`}
                  >
                    {/* <Leaf className="h-7 w-7 text-[#f09ac7]" /> */}
                    <span className="justify-items-center">
                      <span
                        className={`block text-[17px] font-semibold ${palette.actionTitle}`}
                      >
                        {tr("Scan du visage")} <span className="rounded-full bg-[#ce98fb]/20 px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-[#ad6ee0]">Pro</span>
                      </span>
                      <span
                        className={`mt-1.5 block text-[13px] leading-5 ${palette.actionText}`}
                      >
                        {tr("Analysez des caractéristiques cosmétiques visibles avec des conseils prudents.")}
                      </span>
                      <img src="/icons/face.png" alt="analyze ingredients" />
                    </span>
                  </button>
                </div>

                <div
                  ref={cardsRef}
                  className="mt-6 grid w-full gap-3 md:grid-cols-2 xl:grid-cols-4"
                >
                  {featureCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <button
                        key={card.id}
                        type="button"
                        data-chat-card
                        onClick={() => setSelectedFeatureCard(card)}
                        className={`group min-h-[118px] rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${palette.featureCard}`}
                      >
                        <Icon className="h-6 w-6 text-[#ec9ccc]" />

                        <h3
                          className={`mt-3 text-[15px] font-semibold tracking-[-0.02em] ${palette.featureTitle}`}
                        >
                          {tr(card.title)}
                        </h3>

                        <p className={`mt-1.5 text-[11px] leading-5 ${palette.featureText}`}>
                          {tr(card.text)}
                        </p>

                        <ArrowRight
                          className={`ml-auto mt-3 h-4 w-4 transition group-hover:translate-x-1 ${palette.featureText}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {selectedFeatureCard && (
        <FeatureCardDialog
          card={selectedFeatureCard}
          isDarkTheme={isDarkTheme}
          onClose={() => setSelectedFeatureCard(null)}
          onPrimaryAction={() => {
            if (selectedFeatureCard.action === "scan") {
              setSelectedFeatureCard(null);
              beginConversationScan();
              return;
            }

            setSelectedFeatureCard(null);
          }}
        />
      )}

      {isFaceScanTutorialOpen && (
        <FaceScanTutorialDialog
          isDarkTheme={isDarkTheme}
          activeStep={faceScanTutorialStep}
          onStepChange={setFaceScanTutorialStep}
          onClose={() => setIsFaceScanTutorialOpen(false)}
          onContinue={continueFromFaceScanTutorial}
        />
      )}

      {isFaceScanDialogOpen && (
        <FaceScanDialog
          isDarkTheme={isDarkTheme}
          skinGoal={user?.preferredSkinGoal ?? user?.skinGoal}
          onClose={() => setIsFaceScanDialogOpen(false)}
          onUpgradeRequired={() => {
            setIsFaceScanDialogOpen(false);
            setLocalUpgradeReason("face-scan-pro-required");
          }}
          onContinueDiscussion={(faceScanId) => {
            setIsFaceScanDialogOpen(false);
            setSelectedHistoryChatId(null);
            setSelectedFaceChatId(faceScanId);
          }}
        />
      )}

      {localUpgradeReason && (
        <UpgradePlanDialog
          reason={localUpgradeReason}
          scansUsed={user?.freeScansUsed ?? 0}
          scansRemaining={user?.planStatus === "pro" ? 999999 : Math.max(0, FREE_SCAN_LIMIT - (user?.freeScansUsed ?? 0))}
          onClose={() => setLocalUpgradeReason(null)}
          onUpgrade={() => {
            setLocalUpgradeReason(null);
            router.push("/pricing");
          }}
        />
      )}

      <style jsx global>{`
  @keyframes dialog-overlay-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes dialog-panel-fade {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dialog-overlay-fade {
    animation: dialog-overlay-fade 220ms ease-out both;
  }

  .dialog-panel-fade {
    animation: dialog-panel-fade 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: opacity, transform;
  }
`}</style>
    </main>
  );
}


type NewScanConversationPanelProps = {
  isDarkTheme: boolean;
  palette: Record<string, string>;
  tr: (value: string) => string;
  goals: SkinGoal[];
  selectedGoal: SkinGoal;
  selectedGoalId: string;
  hasSavedGoalPreference: boolean;
  uploadInputRef: React.RefObject<HTMLInputElement | null>;
  image: { file: File; previewUrl: string } | null;
  extraction: ProductExtractionResponse | null;
  ingredientText: string;
  ingredientItems: IngredientItem[];
  warnings: string[];
  error: string;
  isExtracting: boolean;
  isAnalyzing: boolean;
  onPickFile: (file?: File | null) => void;
  onSelectGoal: (goalId: string) => void;
  onIngredientTextChange: (value: string) => void;
  onAnalyze: () => void;
  onCancel: () => void;
};

function AnimatedChatText({ content, animate }: { content: string; animate: boolean }) {
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (!animate || !textRef.current) return;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-chat-word]");
      gsap.fromTo(
        words,
        { opacity: 0, y: 7, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.26, stagger: 0.018, ease: "power2.out" },
      );
    }, textRef);
    return () => ctx.revert();
  }, [animate, content]);

  if (!animate) return <p className="whitespace-pre-wrap">{content}</p>;

  return (
    <p ref={textRef} className="whitespace-pre-wrap">
      {content.split(/(\s+)/).map((part, index) =>
        part.trim() ? (
          <span key={`${part}-${index}`} data-chat-word className="inline-block will-change-transform">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
}

const faceScanTutorialSlides = [
  {
    title: "Préparez une lumière naturelle",
    description: "Placez-vous face à une fenêtre ou une source douce pour éviter les ombres fortes sur la peau.",
    image: "/faceScan.png",
    alt: "Préparation du scan visage",
  },
  {
    title: "Cadrez le visage clairement",
    description: "Gardez le visage centré, net, sans filtre, avec les joues, le front et le menton bien visibles.",
    image: "/icons/face.png",
    alt: "Cadrage du visage",
  },
  {
    title: "Recevez vos résultats dans le chat",
    description: "Après l'analyse, SkinorAI ouvre directement la conversation pour expliquer les résultats et suggérer la suite.",
    image: "/Ai.png",
    alt: "Résultats SkinorAI",
  },
];

type FaceScanTutorialDialogProps = {
  isDarkTheme: boolean;
  activeStep: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onContinue: () => void;
};

function FaceScanTutorialDialog({
  isDarkTheme,
  activeStep,
  onStepChange,
  onClose,
  onContinue,
}: FaceScanTutorialDialogProps) {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);
  const slide = faceScanTutorialSlides[activeStep] ?? faceScanTutorialSlides[0];
  const isFirst = activeStep === 0;
  const isLast = activeStep === faceScanTutorialSlides.length - 1;
  const panelClass = isDarkTheme
    ? "border-white/10 bg-[#111214] text-white"
    : "border-[#eadff7] bg-white text-[#221d35]";
  const mutedClass = isDarkTheme ? "text-white/62" : "text-[#746d86]";
  const stepButtonClass = isDarkTheme
    ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] disabled:text-white/25"
    : "border-[#eadff7] bg-[#fbf8ff] text-[#2b2540] hover:bg-white disabled:text-[#c2b8d2]";

  return (
    <div className="fixed inset-0 z-[155] flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={tr("Tutoriel scan visage")}>
      <div className={`relative max-h-[calc(100vh-24px)] w-full max-w-[520px] overflow-y-auto rounded-[28px] border shadow-2xl sm:max-h-[calc(100vh-48px)] ${panelClass}`}>
        <button type="button" onClick={onClose} className={`absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border transition ${stepButtonClass}`} aria-label={tr("Fermer")}>
          <X className="h-4 w-4" />
        </button>

        <div className="p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-[22px] bg-[#f7eefc]">
            <div className="h-[240px] max-h-[34vh] w-full sm:h-[280px] sm:max-h-[36vh]">
              <Image src={slide.image} alt={tr(slide.alt)} width={760} height={520} className="h-full w-full object-contain p-3 sm:p-4" priority />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {faceScanTutorialSlides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onStepChange(index)}
                className={`h-2 rounded-full transition ${index === activeStep ? "w-8 bg-[#ce98fb]" : isDarkTheme ? "w-2 bg-white/22" : "w-2 bg-[#d9c9ef]"}`}
                aria-label={tr(`Étape ${index + 1}`)}
              />
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a764dc]">{tr(`Étape ${activeStep + 1} sur 3`)}</p>
            <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">{tr(slide.title)}</h2>
            <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedClass}`}>{tr(slide.description)}</p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button type="button" onClick={() => onStepChange(Math.max(0, activeStep - 1))} disabled={isFirst} className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition disabled:cursor-not-allowed ${stepButtonClass}`} aria-label={tr("Étape précédente")}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={isLast ? onContinue : () => onStepChange(Math.min(faceScanTutorialSlides.length - 1, activeStep + 1))} className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ce98fb] px-4 text-sm font-black text-[#22172a] transition hover:bg-[#d9affb]">
              {isLast ? tr("Commencer l'analyse") : tr("Suivant")}
              {!isLast && <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibrarySuggestionStrip({
  suggestions,
  isDarkTheme,
}: {
  suggestions?: LibrarySuggestions;
  isDarkTheme: boolean;
}) {
  const router = useRouter();
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(value, locale);
  const [isOpen, setIsOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const products = suggestions?.products ?? [];
  const ingredients = suggestions?.ingredients ?? [];
  const hasProducts = products.length > 0;
  const hasIngredients = ingredients.length > 0;
  const suggestionCount = products.length + ingredients.length;

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.set(body, { display: "block", overflow: "hidden" });
        gsap.fromTo(
          body,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.28,
            ease: "power2.out",
            onComplete: () => gsap.set(body, { height: "auto", overflow: "visible" }),
          },
        );
        gsap.fromTo(
          body.querySelectorAll("[data-library-suggestion-item]"),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.24, stagger: 0.035, ease: "power2.out", delay: 0.05 },
        );
      } else {
        gsap.to(body, {
          height: 0,
          opacity: 0,
          duration: 0.22,
          ease: "power2.inOut",
          onStart: () => gsap.set(body, { overflow: "hidden" }),
          onComplete: () => gsap.set(body, { display: "none" }),
        });
      }
    }, body);

    return () => ctx.revert();
  }, [isOpen]);

  if (!hasProducts && !hasIngredients) return null;

  return (
    <div className={`mt-3 rounded-2xl border ${isDarkTheme ? "border-white/10 bg-white/[0.04]" : "border-[#eee5fb] bg-[#fbf8ff]"}`}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8b6eea]">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{tr("Suggestions de la bibliotheque")}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isDarkTheme ? "bg-white/10 text-white/70" : "bg-white text-[#8b6eea]"}`}>{suggestionCount}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#8b6eea] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div ref={bodyRef} className="hidden px-3 pb-3">
        {hasProducts && (
          <div className="grid gap-2 sm:grid-cols-2">
            {products.slice(0, 3).map((product) => (
              <button
                key={product.id}
                type="button"
                data-library-suggestion-item
                onClick={() => router.push(`/products?product=${encodeURIComponent(product.slug || product.id)}&search=${encodeURIComponent(product.name)}`)}
                className={`flex min-w-0 items-center gap-3 rounded-xl border p-2 text-left transition hover:-translate-y-0.5 ${isDarkTheme ? "border-white/10 bg-black/10" : "border-[#eadff8] bg-white"}`}
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f1fb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={buildProductImageUrl(product.imagePath)} alt={product.name} className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-xs font-bold ${isDarkTheme ? "text-white" : "text-[#24213f]"}`}>{product.name}</span>
                  <span className={`block truncate text-[11px] ${isDarkTheme ? "text-white/55" : "text-[#7b7592]"}`}>{product.brand} - {product.matchScore}%</span>
                  <span className={`mt-0.5 block line-clamp-2 text-[11px] leading-4 ${isDarkTheme ? "text-white/60" : "text-[#6b6384]"}`}>{tr(product.reason)}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {hasIngredients && (
          <div className="mt-3 flex flex-wrap gap-2">
            {ingredients.slice(0, 4).map((ingredient) => (
              <button
                key={ingredient.id}
                type="button"
                data-library-suggestion-item
                onClick={() => router.push(`/ingredient-library?ingredient=${encodeURIComponent(ingredient.id)}&search=${encodeURIComponent(ingredient.name)}`)}
                className={`inline-flex max-w-full items-start gap-2 rounded-xl border px-3 py-2 text-left transition hover:-translate-y-0.5 ${isDarkTheme ? "border-white/10 bg-black/10" : "border-[#eadff8] bg-white"}`}
              >
                <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8b6eea]" />
                <span className="min-w-0">
                  <span className={`block text-xs font-bold ${isDarkTheme ? "text-white" : "text-[#24213f]"}`}>{ingredient.name}</span>
                  <span className={`block text-[11px] leading-4 ${isDarkTheme ? "text-white/60" : "text-[#6b6384]"}`}>{tr(ingredient.reason)}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function NewScanConversationPanel({
  isDarkTheme,
  palette,
  tr,
  goals,
  selectedGoal,
  selectedGoalId,
  hasSavedGoalPreference,
  uploadInputRef,
  image,
  extraction,
  ingredientText,
  ingredientItems,
  warnings,
  error,
  isExtracting,
  isAnalyzing,
  onPickFile,
  onSelectGoal,
  onIngredientTextChange,
  onAnalyze,
  onCancel,
}: NewScanConversationPanelProps) {
  const productName = [extraction?.brand, extraction?.productName].filter(Boolean).join(" ").trim() || image?.file.name || tr("Nouveau produit");

  return (
    <div className="flex flex-1 flex-col pt-4">
      <div data-chat-hero className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${palette.subtext}`}>{tr("Nouveau scan")}</p>
          <h1 className={`mt-2 text-[28px] font-medium leading-tight tracking-[-0.04em] sm:text-[38px] ${palette.heading}`}>
            {tr("Scannez un produit dans la conversation")}
          </h1>
          <p className={`mt-2 max-w-2xl text-sm leading-6 ${palette.subtext}`}>
            {tr("Ajoutez une photo ou collez les ingrédients, confirmez votre objectif peau, puis l'analyse sera enregistrée comme discussion.")}
          </p>
        </div>
        <button type="button" onClick={onCancel} className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition ${palette.headerButton}`}>
          {tr("Annuler")}
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section data-chat-card className={`rounded-[24px] border p-5 ${palette.detailCard}`}>
          <div className={`rounded-[22px] border border-dashed p-4 ${isDarkTheme ? "border-white/12 bg-white/[0.03]" : "border-[#dfd2f4] bg-white/70"}`}>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                onPickFile(file);
              }}
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className={`flex min-h-40 flex-1 items-center justify-center rounded-2xl border transition ${isDarkTheme ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]" : "border-[#eadff7] bg-[#fbf8ff] hover:bg-white"}`}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.previewUrl} alt={tr("Produit sélectionné")} className="max-h-56 w-full rounded-2xl object-cover" />
                ) : (
                  <span className={`flex flex-col items-center gap-3 text-sm font-semibold ${palette.subtext}`}>
                    <UploadCloud className="h-8 w-8 text-[#9b75f2]" />
                    {tr("Importer une photo de l'étiquette")}
                  </span>
                )}
              </button>
              <div className="min-w-0 flex-1 text-left">
                <p className={`text-sm font-semibold ${palette.heading}`}>{normalizeDisplayText(productName)}</p>
                <p className={`mt-2 text-sm leading-6 ${palette.subtext}`}>
                  {isExtracting
                    ? tr("Extraction des informations visibles...")
                    : extraction
                      ? tr("Vérifiez les ingrédients détectés avant de lancer l'analyse.")
                      : tr("Vous pouvez aussi coller directement la liste INCI ci-dessous.")}
                </p>
                {extraction && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                    <span className={`rounded-full px-2.5 py-1 ${isDarkTheme ? "bg-white/8 text-white/70" : "bg-[#f1eaff] text-[#7654de]"}`}>{extraction.confidence}</span>
                    <span className={`rounded-full px-2.5 py-1 ${isDarkTheme ? "bg-white/8 text-white/70" : "bg-[#f1eaff] text-[#7654de]"}`}>{extraction.fullIngredientListVisible ? tr("Liste complète") : tr("Liste partielle")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className={`text-base font-semibold ${palette.heading}`}>{tr("Ingrédients confirmés")}</h2>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDarkTheme ? "bg-white/8 text-white/65" : "bg-[#f7f2ff] text-[#7a55ea]"}`}>{ingredientItems.length}</span>
            </div>
            <textarea
              value={ingredientText}
              onChange={(event) => onIngredientTextChange(event.target.value)}
              placeholder={tr("Collez les ingrédients ici, séparés par des virgules.")}
              className={`mt-3 min-h-36 w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-6 outline-none ${isDarkTheme ? "border-white/10 bg-white/[0.04] text-white placeholder:text-white/35" : "border-[#e7def4] bg-white text-[#241f36] placeholder:text-[#9a8faa]"}`}
            />
            {warnings.length > 0 && (
              <div className={`mt-3 rounded-2xl border px-4 py-3 text-xs leading-5 ${isDarkTheme ? "border-amber-300/20 bg-amber-300/10 text-amber-100" : "border-[#ffe3a8] bg-[#fffaf0] text-[#9b6500]"}`}>
                {warnings.slice(0, 3).map((warning) => <p key={warning}>{normalizeDisplayText(warning)}</p>)}
              </div>
            )}
            {error && (
              <p className={`mt-3 rounded-2xl border px-4 py-3 text-xs font-semibold ${isDarkTheme ? "border-red-300/20 bg-red-300/10 text-red-100" : "border-[#ffd6df] bg-[#fff4f6] text-[#c6405f]"}`}>{normalizeDisplayText(error)}</p>
            )}
          </div>
        </section>

        <aside data-chat-card className={`rounded-[24px] border p-5 ${palette.detailCard}`}>
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${isDarkTheme ? "bg-white/8 text-[#f0a6d6]" : "bg-[#f1eaff] text-[#7a55ea]"}`}>
              <Target className="h-5 w-5" />
            </span>
            <div>
              <h2 className={`text-base font-semibold ${palette.heading}`}>{tr("Objectif peau")}</h2>
              <p className={`mt-1 text-xs ${palette.subtext}`}>
                {hasSavedGoalPreference ? tr("Préférence chargée depuis vos paramètres.") : tr("Choisissez une fois, vous pourrez la changer dans Paramètres.")}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = goal.id === selectedGoalId;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => onSelectGoal(goal.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${isSelected ? "border-[#9b75f2] bg-[#f5efff] text-[#241f36]" : isDarkTheme ? "border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.07]" : "border-[#eadff7] bg-white/70 text-[#5c5671] hover:bg-white"}`}
                >
                  <Icon className="h-4 w-4 text-[#9b75f2]" />
                  <span className="min-w-0 flex-1 text-sm font-semibold">{normalizeDisplayText(goal.label)}</span>
                  {isSelected && <Check className="h-4 w-4 text-[#7a55ea]" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isExtracting || isAnalyzing || ingredientItems.length === 0}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9b75f2] to-pink-300 px-5 text-sm font-bold text-white shadow-[0_16px_32px_rgba(139,92,246,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isAnalyzing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isAnalyzing ? tr("Analyse en cours...") : tr("Analyser dans la conversation")}
          </button>
          <p className={`mt-3 text-center text-[11px] leading-5 ${palette.subtext}`}>{tr("Le résultat sera enregistré et ouvert comme une discussion.")}</p>
        </aside>
      </div>
    </div>
  );
}
function ResultWorkspace({
  analysisResult,
  analysisError,
  currentStep,
  ingredientItems,
  productName,
  selectedGoal,
  selectedImage,
  scanId,
  hasActivePlan,
  currentScanPromptCount,
  upgradeDialogReason,
  freeScansUsed,
  freeScansRemaining,
  onPromptConsumed,
  onQuotaUpdated,
  onUpgradeRequired,
  onUpgradeDismiss,
  onUpgrade,
  onChangeGoal,
  onScanAnother,
}: {
  analysisResult: AnalysisResult;
  analysisError: string;
  currentStep: number;
  ingredientItems: IngredientItem[];
  productName: string;
  selectedGoal: SkinGoal;
  selectedImage: UploadedImage | null;
  scanId: string | null;
  hasActivePlan: boolean;
  currentScanPromptCount: number;
  upgradeDialogReason: UpgradeDialogReason | null;
  freeScansUsed: number;
  freeScansRemaining: number;
  onPromptConsumed: () => void;
  onQuotaUpdated: (quota?: QuotaStatus) => void;
  onUpgradeRequired: (reason: UpgradeDialogReason) => void;
  onUpgradeDismiss: () => void;
  onUpgrade: () => void;
  onChangeGoal: () => void;
  onScanAnother: () => void;
}) {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  useEffect(() => {
    document.body.dataset.navbarHidden = "true";

    return () => {
      delete document.body.dataset.navbarHidden;
    };
  }, []);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-intro",
      role: "assistant",
      content:
        "Je peux maintenant répondre à vos questions sur ce résultat, la routine, les ingrédients à surveiller ou la fréquence d'utilisation.",
    },
  ]);
  const [isChatSending, setIsChatSending] = useState(false);
  const chatAttachment = useChatImageAttachment();


  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const chatMessageIdRef = useRef(0);
  const freePromptsRemaining = Math.max(
    0,
    FREE_PROMPT_LIMIT - currentScanPromptCount,
  );
  const historyItems = scanHistory.map((item) => ({
    id: item.id,
    name: item.productName,
    date: formatScanHistoryDate(item.updatedAt || item.createdAt),
    active: item.id === scanId,
    image:
      item.id === scanId
        ? (selectedImage?.url ?? "/cleanser.png")
        : "/cleanser.png",
  }));
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
  }, [scanId]);

  const askQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();

    if (!question || isChatSending) {
      return;
    }

    if (!hasActivePlan && currentScanPromptCount >= FREE_PROMPT_LIMIT) {
      onUpgradeRequired("prompt-limit");
      return;
    }

    const pendingImage = chatAttachment.consume();
    const userMessage: ChatMessage = {
      id: `user-${chatMessageIdRef.current++}`,
      role: "user",
      content: question,
      attachment: pendingImage
        ? { type: "image", mimeType: pendingImage.file.type, previewUrl: pendingImage.previewUrl }
        : undefined,
    };

    setChatInput("");
    setChatMessages((messages) => [...messages, userMessage]);
    setIsChatSending(true);

    try {
      const response = await requestScanChat({
        message: question,
        image: pendingImage?.file,
        scanId,
      });

      onQuotaUpdated(response.quota);
      if (!response.quota) {
        onPromptConsumed();
      }
      setChatMessages((messages) => [
        ...messages,
        {
          id: `assistant-${chatMessageIdRef.current++}`,
          role: "assistant",
          content: response.answer,
          librarySuggestions: response.librarySuggestions,
        },
      ]);
    } catch (error) {
      if (error instanceof UpgradeRequiredError) {
        onQuotaUpdated(error.quota);
        onUpgradeRequired(error.reason);
        return;
      }

      setChatMessages((messages) => [
        ...messages,
        {
          id: `assistant-${chatMessageIdRef.current++}`,
          role: "assistant",
          content: error instanceof Error
            ? error.message
            : "Impossible de répondre pour le moment. Réessayez dans quelques instants.",
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(165,120,255,0.12),_transparent_32%),linear-gradient(180deg,_#fcfbff_0%,_#f7f4ff_100%)] text-sm text-[#161a35] [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      <div className="flex h-screen w-full bg-white/85">
        <ResultSidebarShell
          historyItems={historyItems}
          isHistoryLoading={isHistoryLoading}
          onScanAnother={onScanAnother}
          selectedImage={selectedImage}
        />
        <section className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 flex items-center justify-between border-b border-[#ede7fb] px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={onChangeGoal}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6d58ac] transition hover:text-[#5837d2]"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour au scan
            </button>
            <div className="flex items-center gap-4 text-[#636b88]">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium transition hover:text-[#151833]"
              >
                <CircleHelp className="h-5 w-5" />
                Aide
              </button>
              <button
                type="button"
                className="relative rounded-full border border-[#ebe4fb] p-2.5 transition hover:bg-[#faf7ff]"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#8f64f2]" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1050px]">
              <ScanProgress
                currentStep={currentStep}
                onStepClick={() => undefined}
                selectedGoalLabel={selectedGoal.label}
              />

              {analysisError && (
                <p className="mt-4 rounded-2xl border border-[#ffe3a8] bg-[#fffaf0] px-4 py-3 text-xs font-medium text-[#9b6500]">
                  {analysisError}
                </p>
              )}

              <div className="mt-4 flex items-start justify-end gap-3">
                <div className="max-w-[680px] rounded-[22px] border border-[#ece5fb] bg-[linear-gradient(180deg,_rgba(247,242,255,0.95)_0%,_rgba(243,238,255,0.95)_100%)] px-5 py-4 shadow-[0_16px_40px_rgba(104,78,171,0.08)]">
                  <p className="text-sm font-semibold text-[#1a1e39] sm:text-[15px]">
                    {productName} - objectif: {selectedGoal.label}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-[#69718f] sm:text-sm">
                    J&apos;ai scanné ce produit pour vérifier s&apos;il est bien adapté à
                    mon objectif peau et à ma routine.
                  </p>
                </div>
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1eaff] text-[#7b57ec] shadow-sm">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span className="text-xs text-[#868daa]">10:24</span>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-[#ece5fb] px-4 py-5 shadow-[0_22px_50px_rgba(89,62,165,0.08)] sm:px-6 sm:py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3edff] text-[#7a55ea]">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-[#171b36]">
                          Résultat de l&apos;analyse IA
                        </h2>
                        <span className="rounded-full bg-[#e7f8ec] px-3 py-1 text-xs font-semibold text-[#21a35c]">
                          {analysisResult.verdictLabel}
                        </span>
                      </div>
                      <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f6784]">
                        {analysisResult.summary}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-[16px] bg-[#e9faef] px-3 py-2 text-2xl font-bold text-[#20a45c] shadow-sm">
                    {analysisResult.score}/10
                  </span>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  <InsightCard
                    title="Points forts"
                    tone="green"
                    items={analysisResult.positives}
                  />
                  <InsightCard
                    title="À surveiller"
                    tone="orange"
                    items={analysisResult.watchouts}
                  />
                  <NextStepCard
                    tips={analysisResult.recommendations}
                    nextStep={analysisResult.nextStep}
                  />
                </div>

                <p className="mt-5 rounded-2xl bg-[#faf7ff] px-4 py-3 text-xs leading-5 text-[#68708b]">
                  {analysisResult.disclaimer}
                </p>

                <div className="mt-5">
                  <h3 className="text-base font-semibold text-[#171b36]">
                    Questions à poser
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysisResult.followUpQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void askQuestion(question)}
                        className="rounded-xl border border-[#e7defc] bg-[#faf7ff] px-3 py-2 text-xs font-semibold text-[#7350e5] transition hover:bg-[#f1eaff]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 pb-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[760px] rounded-[22px] border px-4 py-3 text-sm leading-6 shadow-sm ${message.role === "user"
                        ? "border-[#e8defc] bg-[#f7f2ff] text-[#252044]"
                        : "border-[#ece5fb] bg-white text-[#59617d]"
                        }`}
                    >
                      {message.attachment && (
                        <div className="mb-2 overflow-hidden rounded-xl border border-[#e5ddfb]">
                          {buildAttachmentImageUrl(message.attachment.previewUrl ?? message.attachment.url) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={buildAttachmentImageUrl(message.attachment.previewUrl ?? message.attachment.url)!} alt={tr("Image jointe")} className="max-h-48 w-full object-cover" />
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold"><Paperclip className="h-3.5 w-3.5" />{tr("Image jointe")}</div>
                          )}
                        </div>
                      )}
                      <AnimatedChatText content={message.content} animate={message.role === "assistant"} />
                      {message.role === "assistant" && (
                        <LibrarySuggestionStrip suggestions={message.librarySuggestions} isDarkTheme={false} />
                      )}
                    </div>
                  </div>
                ))}

                {isChatSending && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ece5fb] bg-white px-4 py-2 text-xs font-medium text-[#7a55ea] shadow-sm">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      {tr("SkinorAI reflechit...")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[#ede7fb] bg-white/90 px-4 py-3 shadow-[0_-14px_35px_rgba(90,66,165,0.06)] backdrop-blur sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1050px] rounded-[24px] border border-[#e8e0fb] bg-white px-4 py-4 shadow-[0_12px_35px_rgba(90,66,165,0.06)] sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[#7a55ea]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {tr("Posez une question sur ce produit...")}
                    </span>
                  </div>
                  <input
                    ref={chatAttachment.inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      try {
                        chatAttachment.selectFile(file);
                      } catch (error) {
                        setChatMessages((messages) => [...messages, {
                          id: `assistant-${chatMessageIdRef.current++}`,
                          role: "assistant",
                          content: error instanceof Error ? error.message : "Image invalide.",
                        }]);
                      }
                    }}
                  />
                  {chatAttachment.image && (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#e5ddfb] bg-[#faf7ff] p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={chatAttachment.image.previewUrl} alt="Image sélectionnée" className="h-12 w-12 rounded-xl object-cover" />
                      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#59617d]">{chatAttachment.image.file.name}</span>
                      <button type="button" onClick={chatAttachment.remove} className="grid h-8 w-8 place-items-center rounded-full text-[#6a7290]" aria-label={tr("Retirer l'image")}><X className="h-4 w-4" /></button>
                    </div>
                  )}
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void askQuestion(chatInput);
                      }
                    }}
                    className="mt-3 w-full border-0 bg-transparent text-sm text-[#171b36] outline-none placeholder:text-[#98a0bc]"
                    placeholder="Compatibilite, usage, sensibilite, routine..."
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => chatAttachment.inputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-full border border-[#e5ddfb] px-3 py-1.5 text-xs font-medium text-[#6a7290]"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Joindre une image
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-[#e5ddfb] px-3 py-1.5 text-xs font-medium text-[#6a7290]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Exemples de questions
                    </button>
                  </div>
                  {!hasActivePlan && (
                    <p className="mt-3 text-xs font-medium text-[#7a7893]">
                      {freePromptsRemaining > 0
                        ? `${freePromptsRemaining} question gratuite restante pour ce scan.`
                        : "Votre question gratuite est utilisee. Passez au plan Pro pour continuer."}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void askQuestion(chatInput)}
                  disabled={!chatInput.trim() || isChatSending}
                  className="ml-auto flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#b594ff] to-[#8c57eb] text-white shadow-[0_14px_28px_rgba(112,75,225,0.24)] transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChatSending ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {upgradeDialogReason && (
        <UpgradePlanDialog
          reason={upgradeDialogReason}
          scansUsed={freeScansUsed}
          scansRemaining={freeScansRemaining}
          onClose={onUpgradeDismiss}
          onUpgrade={onUpgrade}
        />
      )}
    </main>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-[#e1e4ef] bg-white/86 p-7 shadow-[0_18px_45px_rgba(64,56,105,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function StepTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#9b75f2] to-pink-200 text-lg font-bold text-white">
        {number}
      </span>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-[#66708f]">{description}</p>
      </div>
    </div>
  );
}

function HowItWorksCard() {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  const items = [
    [
      Target,
      "Choisissez votre objectif peau",
      "Indiquez votre priorite actuelle.",
    ],
    [
      Camera,
      "Importez l etiquette du produit",
      "Prenez une photo claire de l etiquette du produit.",
    ],
    [
      Sparkles,
      "Obtenez l analyse IA",
      "Recevez une analyse simple et comprehensible des ingredients.",
    ],
  ] as const;

  return (
    <Panel className="min-h-[420px] px-7 py-7">
      <h2 className="flex items-center justify-between text-xl font-bold">
        {tr("Comment ca marche")}
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-7 space-y-6">
        {items.map(([Icon, title, text], index) => (
          <div
            key={title}
            className="relative grid grid-cols-[28px_56px_1fr] gap-4"
          >
            {/* Step number + line */}
            <div className="relative flex justify-center">
              {index !== items.length - 1 && (
                <div className="absolute top-8 h-[calc(100%+36px)] w-px bg-[#b894ff]" />
              )}

              <div className="relative z-10 mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#9b75f2] to-pink-200 text-sm font-bold text-white shadow-[0_0_18px_rgba(155,99,255,0.45)]">
                {index + 1}
              </div>
            </div>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e5dcff] bg-[#f6f1ff] text-[#7548e8] shadow-[0_8px_18px_rgba(117,72,232,0.12)]">
              <Icon className="h-7 w-7" strokeWidth={2.5} />
            </div>

            {/* Text */}
            <div className="pt-1">
              <h3 className="text-[14px] font-extrabold leading-5 text-[#101632]">
                {tr(title)}
              </h3>

              <p className="mt-1.5 max-w-[210px] text-[14px] leading-5 text-[#66708f]">
                {tr(text)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TipsCard() {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  const tips = [
    [
      Lightbulb,
      "Bonne luminosité",
      "Prenez la photo dans un endroit bien éclairé.",
    ],
    [
      SquareDashed,
      "Centrée et lisible",
      "Assurez-vous que toute la liste d ingredients est visible et nette.",
    ],
    [
      EyeOff,
      "Evitez le flou",
      "Stabilisez votre appareil et verifiez la mise au point avant d envoyer.",
    ],
  ] as const;

  return (
    <Panel>
      <h2 className="flex items-center justify-between text-xl font-bold">
        {tr("Conseils photo")}
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-7 space-y-6">
        {tips.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e6ddff] bg-[#f5f0ff] text-[#7548e8]">
              <Icon className="h-8 w-8" />
            </span>
            <span>
              <span className="block text-sm font-bold">{tr(title)}</span>
              <span className="mt-2 block text-sm leading-6 text-[#66708f]">
                {tr(text)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BeforeContinueCard() {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  const items = [
    [
      ClipboardCheck,
      "Vérifiez que la liste est complète",
      "Assurez-vous que tous les ingredients presents sur l etiquette sont detectes.",
    ],
    [
      TextCursorInput,
      "Corrigez si necessaire",
      "L IA peut faire des erreurs de lecture. Modifiez les noms mal orthographies.",
    ],
    [
      ShieldCheck,
      "Continuez en toute confiance",
      "Si tout correspond a l etiquette, vous pouvez lancer l analyse.",
    ],
  ] as const;

  return (
    <Panel className="px-8 py-7">
      <h2 className="flex items-center justify-between text-2xl font-bold">
        {tr("Avant de continuer")}
        <Sparkles className="h-8 w-8 text-[#b79dff]" />
      </h2>
      <div className="mt-8 divide-y divide-[#efeaf9]">
        {items.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-4 py-6 first:pt-0 last:pb-0">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e8ddff] bg-[#f7f2ff] text-[#7548e8] shadow-[0_8px_18px_rgba(117,72,232,0.08)]">
              <Icon className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-base font-bold text-[#171b36]">
                {tr(title)}
              </span>
              <span className="mt-2 block text-sm leading-6 text-[#66708f]">
                {tr(text)}
              </span>
            </span>
          </div>
        ))}
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
  imageCount?: number;
  small?: boolean;
}) {
  return (
    <div className={small ? "mt-5" : "mt-6"}>
      <div className={`overflow-hidden rounded-[28px] border border-[#e8e0fb] bg-[#fbf9ff] ${small ? "h-44" : "h-56"}`}>
        {selectedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selectedImage.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-5 text-center text-[#7a6f99]">
            <Camera className="h-10 w-10 text-[#a184f4]" />
            <p className="mt-4 text-xs font-semibold">Ajoutez une image pour afficher l&apos;aperçu.</p>
            <p className="mt-2 text-xs leading-5 text-[#8a84a4]">
              Vous pouvez importer une ou plusieurs photos de l&apos;étiquette.
            </p>
          </div>
        )}
      </div>
      <p className={`mx-auto mt-4 ${small ? "max-w-[180px]" : "max-w-[220px]"} text-center text-xs text-[#66708f]`}>
        {selectedImage
          ? `Vous pouvez modifier la liste si necessaire.${imageCount && imageCount > 1 ? ` ${imageCount} images importees.` : ""}`
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
            <h2 id="manual-ingredients-title" className="mt-2 text-2xl font-bold text-[#111631]">
              Collez vos ingredients manuellement
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#66708f]">
              Collez la liste INCI telle qu elle apparait sur l emballage ou le site du produit.
            </p>
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
            {parsedCount > 0
              ? `${parsedCount} ingrédients détectés dans votre saisie.`
              : "Collez votre liste pour preparer l etape suivante."}
          </p>
          <p className="text-sm font-semibold text-[#7a54ea]">
            Separateurs acceptes : virgule, point-virgule, retour a la ligne
          </p>
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

function UpgradePlanDialog({
  reason,
  scansUsed,
  scansRemaining,
  onClose,
  onUpgrade,
}: {
  reason: UpgradeDialogReason;
  scansUsed: number;
  scansRemaining: number;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  const isScanLimit = reason === "scan-limit";
  const isFaceScan = reason === "face-scan-pro-required";

  return (
    <div className="dialog-overlay-fade fixed inset-0 z-[100] flex items-center justify-center bg-[#120a24]/45 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-plan-title"
        className="dialog-panel-fade w-full max-w-md rounded-[32px] border border-white/70 bg-white p-7 text-[#171b36] shadow-[0_35px_90px_rgba(42,22,84,0.3)]"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#f3edff] text-[#7a55ea] shadow-[0_14px_28px_rgba(112,75,225,0.16)]">
            <Sparkles className="h-6 w-6" />
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f1ff] text-[#6f3fe4] transition hover:bg-[#ede5ff]"
            aria-label="Fermer la fenetre"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6dff]">
          Plan Pro
        </p>
        <h2 id="upgrade-plan-title" className="mt-2 text-2xl font-bold">
          {isFaceScan
            ? "Le scan du visage est réservé au plan Pro"
            : isScanLimit
              ? "Vos 3 scans gratuits sont termines"
              : "Votre question gratuite est utilisee"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#66708f]">
          {isFaceScan
            ? "Passez au plan Pro pour analyser des caractéristiques cosmétiques visibles. Les photos brutes du visage ne sont pas stockées par défaut."
            : isScanLimit
              ? "Passez au plan Pro pour continuer a analyser de nouveaux produits avec SkinorAI."
              : "Le plan Pro débloque davantage de questions après chaque scan produit."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {isFaceScan ? (
            <>
              <div className="rounded-2xl border border-[#ebe4fb] bg-[#faf7ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b83a7]">Moteur visuel</p>
                <p className="mt-2 text-base font-bold text-[#7a55ea]">Gemini</p>
              </div>
              <div className="rounded-2xl border border-[#ebe4fb] bg-[#faf7ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b83a7]">Photos brutes</p>
                <p className="mt-2 text-base font-bold text-[#7a55ea]">Non stockées</p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-[#ebe4fb] bg-[#faf7ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b83a7]">Scans gratuits</p>
                <p className="mt-2 text-2xl font-bold text-[#7a55ea]">{Math.min(scansUsed, FREE_SCAN_LIMIT)}/{FREE_SCAN_LIMIT}</p>
              </div>
              <div className="rounded-2xl border border-[#ebe4fb] bg-[#faf7ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b83a7]">Restants</p>
                <p className="mt-2 text-2xl font-bold text-[#7a55ea]">{scansRemaining}</p>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#8c57eb] via-[#b674f4] to-[#f0a1d3] px-6 text-sm font-bold text-white shadow-[0_18px_36px_rgba(117,72,232,0.24)] transition hover:-translate-y-0.5"
        >
          Passer au plan Pro
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#ddd6f6] bg-white px-6 text-sm font-semibold text-[#4f5473] transition hover:bg-[#faf9ff]"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
function ProductStill() {
  return (
    <div className="relative h-56 w-72">
      <Image
        src="/cleanser.png"
        alt=""
        width={150}
        height={180}
        className="absolute right-20 top-0 h-44 w-auto object-contain drop-shadow-xl"
      />
      <Image
        src="/cleanser.png"
        alt=""
        width={160}
        height={160}
        className="absolute bottom-2 right-0 h-32 w-auto object-contain drop-shadow-xl"
      />
      <Sparkles className="absolute left-4 top-10 h-7 w-7 text-[#bba1ff]" />
    </div>
  );
}

function ResultSidebarShell({
  historyItems,
  isHistoryLoading,
  onScanAnother,
  selectedImage,
}: {
  historyItems: Array<{
    id: string;
    name: string;
    date: string;
    active: boolean;
    image: string;
  }>;
  isHistoryLoading: boolean;
  onScanAnother: () => void;
  selectedImage: UploadedImage | null;
}) {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const displayName = user?.name?.trim() || user?.email || "Compte";
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  return (
    <aside className="hidden h-screen w-[320px] shrink-0 border-r border-[#ede7fb] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(249,245,255,0.92)_100%)] text-[13px] lg:flex lg:flex-col">
      <div className="border-b border-[#ede7fb] px-6 py-6">
        <div className="flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="SkinorAI"
            width={170}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <button
            type="button"
            className="rounded-full p-2 text-[#6c7190] transition hover:bg-[#f5f1ff]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onScanAnother}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8b5aef] to-[#6c35d8] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_18px_35px_rgba(110,65,226,0.24)]"
        >
          <Plus className="h-5 w-5" />
          {tr("Nouveau scan")}
        </button>

        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#e8e0fb] bg-white px-4 py-3 text-[#8a90aa]">
          <Search className="h-5 w-5" />
          <span className="text-[13px]">{tr("Rechercher un scan...")}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#171b36]">
          <Clock3 className="h-5 w-5 text-[#7260ad]" />
          {tr("Historique")}
        </h3>

        <div className="mt-5 space-y-3">
          {isHistoryLoading ? (
            <div className="rounded-[22px] border border-[#ece5fb] bg-white/70 px-4 py-4 text-[13px] text-[#7b829e]">
              {tr("Chargement de l historique...")}
            </div>
          ) : historyItems.length > 0 ? (
            historyItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-[22px] border px-3 py-2.5 shadow-sm ${item.active ? "border-[#e6ddfb] bg-[#f8f4ff]" : "border-transparent bg-white/70"}`}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#efe7fb] bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized={item.image === selectedImage?.url}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1b1f39]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[13px] text-[#7b829e]">{item.date}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-[#7680a0] transition hover:bg-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-[#ece5fb] bg-white/70 px-4 py-4 text-[13px] leading-6 text-[#7b829e]">
              Aucun scan enregistre pour le moment.
            </div>
          )}
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#6f49e2] transition hover:text-[#5d39cf]"
          >
            Voir tous les scans
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        ref={profileMenuRef}
        className="relative mt-auto border-t border-[#ede7fb] px-4 py-4"
      >
        <button
          type="button"
          onClick={() => setIsProfileMenuOpen((current) => !current)}
          className="flex w-full items-center gap-3 rounded-[22px] px-2 py-2 text-left transition hover:bg-white/70"
          aria-haspopup="menu"
          aria-expanded={isProfileMenuOpen}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b585ff] to-[#8b5cf6] text-white shadow-sm">
            <UserRound className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-[#171b36]">
              {displayName}
            </span>
            <span className="block text-[13px] font-medium text-[#7a55ea]">
              Plan Pro
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#6e7693] transition ${isProfileMenuOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <div
          className={`absolute bottom-[calc(100%+8px)] left-4 right-4 rounded-[24px] border border-[#efebe7] bg-[#fbf9f6] p-3 shadow-[0_24px_65px_rgba(15,23,42,0.14)] transition-all ${isProfileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"}`}
          role="menu"
        >
          <div className="rounded-[20px] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <p className="truncate text-[13px] font-semibold text-[#18181b]">
              {displayName}
            </p>
            <p className="mt-1 truncate text-[13px] text-[#6b7280]">
              {user?.email}
            </p>
          </div>

          <div className="mt-3 overflow-hidden rounded-[20px] border border-[#efebe7] bg-white">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-medium text-[#262626] transition hover:bg-[#f6f3ef]"
              role="menuitem"
            >
              <Settings className="h-4 w-4 text-[#555]" />
              Settings
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 border-t border-[#f1ede8] px-4 py-3 text-left text-[13px] font-medium text-[#262626] transition hover:bg-[#f6f3ef]"
              role="menuitem"
            >
              <LogOut className="h-4 w-4 text-[#555]" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function InsightCard({
  title,
  tone,
  items,
  isDarkTheme = false,
}: {
  title: string;
  tone: "green" | "orange";
  items: PositiveDetail[] | WatchoutDetail[];
  isDarkTheme?: boolean;
}) {
  const isGreen = tone === "green";
  return (
    <section
      className={`rounded-[24px] border p-5 ${isDarkTheme
        ? isGreen
          ? "border-[#234936] bg-[#101b15]"
          : "border-[#5a3a16] bg-[#1a1610]"
        : isGreen
          ? "border-[#ddf1e6] bg-[#fcfffd]"
          : "border-[#f5e5cb] bg-[#fffdf9]"
        }`}
    >
      <h3
        className={`flex items-center gap-2.5 text-lg font-bold ${isDarkTheme ? "text-white" : "text-[#171b36]"}`}
      >
        <CheckCircle2
          className={`h-6 w-6 ${isGreen ? "text-[#55c987]" : "text-[#ffae4f]"}`}
        />
        {title}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs ${isGreen ? "bg-[#ddf7e7] text-[#20a45c]" : "bg-[#fff0d9] text-[#ad6b00]"}`}
        >
          {items.length}
        </span>
      </h3>
      {items.length > 0 ? (
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div key={item.ingredient} className="flex gap-3">
              <span
                className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isGreen ? "bg-[#e7f8ec] text-[#20a45c]" : "bg-[#fff2df] text-[#ff9d2f]"}`}
              >
                {isGreen ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <CircleHelp className="h-3.5 w-3.5" />
                )}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${isDarkTheme ? "text-white" : "text-[#171b36]"}`}
                >
                  {item.ingredient}
                </p>
                <p
                  className={`mt-1 text-xs leading-5 ${isDarkTheme ? "text-white/70" : "text-[#66708f]"}`}
                >
                  {item.reason}
                </p>
                {"tag" in item && (
                  <p className="mt-1 text-[11px] font-semibold text-[#20a45c]">
                    {item.tag}
                  </p>
                )}
                {"severity" in item && (
                  <p className="mt-1 text-[11px] font-semibold text-[#ad6b00]">
                    Risque {item.severity}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          className={`mt-4 text-sm leading-6 ${isDarkTheme ? "text-white/70" : "text-[#66708f]"}`}
        >
          {isGreen
            ? "Aucun point fort spécifique détecté pour le moment."
            : "Aucun ingrédient préoccupant détecté pour le moment."}
        </p>
      )}
    </section>
  );
}

function NextStepCard({
  tips,
  nextStep,
  isDarkTheme = false,
}: {
  tips: string[];
  nextStep: string;
  isDarkTheme?: boolean;
}) {
  return (
    <section
      className={`rounded-[24px] border p-5 ${isDarkTheme ? "border-[#3c2e61] bg-[#14111d]" : "border-[#e8defc] bg-[#fefcff]"}`}
    >
      <h3
        className={`flex items-center gap-2.5 text-lg font-bold ${isDarkTheme ? "text-white" : "text-[#171b36]"}`}
      >
        <Sparkles className="h-5 w-5 text-[#7a55ea]" />
        Prochaine étape
      </h3>
      <p
        className={`mt-3 text-xs leading-6 ${isDarkTheme ? "text-white/70" : "text-[#66708f]"}`}
      >
        {nextStep}
      </p>
      <div className="mt-4 space-y-3">
        {tips.map((tip, index) => (
          <div
            key={tip}
            className={`flex gap-3 border-t pt-3 first:border-t-0 first:pt-0 ${isDarkTheme ? "border-white/[0.08]" : "border-[#f0e9fd]"}`}
          >
            <span
              className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#7a55ea] ${isDarkTheme ? "bg-[#221a35]" : "bg-[#f3edff]"}`}
            >
              {index === 0 ? (
                <Clock3 className="h-3.5 w-3.5" />
              ) : index === 1 ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <Droplet className="h-3.5 w-3.5" />
              )}
            </span>
            <p
              className={`text-xs leading-6 ${isDarkTheme ? "text-white/72" : "text-[#535a78]"}`}
            >
              {tip}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCardDialog({
  card,
  isDarkTheme,
  onClose,
  onPrimaryAction,
}: {
  card: FeatureCard;
  isDarkTheme: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
}) {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(normalizeDisplayText(value), locale);
  const Icon = card.icon;
  const hasPrimaryCta = Boolean(card.primaryCtaLabel);

  return (
    <div className="dialog-overlay-fade fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-card-dialog-title"
        className={`dialog-panel-fade w-full max-w-3xl rounded-[34px] border p-6 shadow-[0_35px_90px_rgba(15,23,42,0.28)] ${isDarkTheme
          ? "border-white/10 bg-[#11101a] text-white"
          : "border-white/70 bg-white text-[#171b36]"
          }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isDarkTheme
                ? "bg-white/[0.07] text-[#f0a6d6]"
                : "bg-[#f5ecff] text-[#9a56bf]"
                }`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isDarkTheme ? "text-[#f0a6d6]" : "text-[#9a56bf]"
                  }`}
              >
                {tr("Fonctionnalité SkinorAI")}
              </p>

              <h2
                id="feature-card-dialog-title"
                className="mt-1 text-xl font-bold tracking-[-0.03em]"
              >
                {tr(card.title)}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${isDarkTheme
              ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.10]"
              : "bg-[#f5f1ff] text-[#6f3fe4] hover:bg-[#ede5ff]"
              }`}
            aria-label={tr("Fermer la fenêtre")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <img
          src={card.image}
          alt={tr(card.imageAlt)}
          className="relative my-5 w-full rounded-lg z-10 w-auto object-contain drop-shadow-[0_18px_35px_rgba(122,63,92,0.16)]"
        />

        <div className="mt-6 space-y-3">
          {card.points.map((point: string) => (
            <div
              key={point}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${isDarkTheme
                ? "border-white/10 bg-white/[0.04]"
                : "border-[#efe7fb] bg-[#fbf8ff]"
                }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isDarkTheme
                  ? "bg-white/[0.08] text-[#f0a6d6]"
                  : "bg-[#f1eaff] text-[#7a55ea]"
                  }`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>

              <p
                className={`text-sm leading-6 ${isDarkTheme ? "text-white/72" : "text-[#535a78]"
                  }`}
              >
                {tr(point)}
              </p>
            </div>
          ))}
        </div>

        {hasPrimaryCta && (
          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#a56ae2] to-[#e89ac7] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(202,105,179,0.22)] transition hover:-translate-y-0.5"
            >
              {card.primaryCtaLabel ? tr(card.primaryCtaLabel) : null}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}








