"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { API_BASE_URL, getStoredAuthToken } from "@/components/AuthProvider";
import { translateStaticText, useI18n } from "@/lib/i18n";

type FaceImageSlot = "frontImage" | "leftImage" | "rightImage";

type SelectedPhoto = {
  file: File;
  previewUrl: string;
};

type FaceObservation = {
  usable: boolean;
  imageType: "face" | "unrelated" | "unclear";
  quality: {
    lighting: "good" | "acceptable" | "poor";
    focus: "good" | "acceptable" | "poor";
    faceCoverage: "complete" | "partial" | "insufficient";
    filterOrHeavyMakeupSuspected: boolean;
  };
  observations: Array<{
    area: "forehead" | "nose" | "cheeks" | "chin" | "under_eyes" | "general";
    concern:
      | "visible_shine"
      | "apparent_dryness"
      | "visible_flaking"
      | "visible_redness"
      | "visible_blemishes"
      | "uneven_looking_texture"
      | "visible_pores"
      | "dark_looking_spots"
      | "under_eye_darkness";
    description: string;
    confidence: "low" | "medium" | "high";
  }>;
  limitations: string[];
  retakeInstructions: string[];
  professionalReviewSuggested: boolean;
};

type FaceGuidance = {
  explanation: string;
  priorities: string[];
  routineCategories: Array<{ step: string; guidance: string }>;
  potentiallyUsefulIngredients: string[];
  introduceCautiously: string[];
  followUpQuestions: string[];
  disclaimer: string;
};

type FaceScanResponse = {
  usable: boolean;
  faceScanId: string | null;
  observations: FaceObservation;
  guidance: FaceGuidance | null;
  privacy: {
    processedForAnalysis: boolean;
    rawPhotosStored: boolean;
    nonDiagnostic: boolean;
    cameraAndLightingMayAffectResults: boolean;
  };
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachmentPreview?: string;
};

type FaceScanDialogProps = {
  isDarkTheme: boolean;
  skinGoal?: string;
  onClose: () => void;
  onUpgradeRequired: () => void;
  onContinueDiscussion: (faceScanId: string) => void;
};

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const concernLabels: Record<FaceObservation["observations"][number]["concern"], string> = {
  visible_shine: "Brillance visible",
  apparent_dryness: "SÃ©cheresse apparente",
  visible_flaking: "Desquamation visible",
  visible_redness: "Rougeurs visibles",
  visible_blemishes: "Imperfections visibles",
  uneven_looking_texture: "Texture visuellement irrÃ©guliÃ¨re",
  visible_pores: "Pores visibles",
  dark_looking_spots: "Taches d'apparence foncÃ©e",
  under_eye_darkness: "Cernes visibles",
};

const areaLabels: Record<FaceObservation["observations"][number]["area"], string> = {
  forehead: "Front",
  nose: "Nez",
  cheeks: "Joues",
  chin: "Menton",
  under_eyes: "Contour des yeux",
  general: "Vue gÃ©nÃ©rale",
};


function shortText(value?: string, maxLength = 150) {
  const cleaned = (value ?? "").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
}
async function readApiError(response: Response) {
  let message = `La requÃªte a Ã©chouÃ© (${response.status}).`;
  let reason = "";
  try {
    const body = (await response.json()) as {
      message?: string | string[];
      reason?: string;
    };
    if (Array.isArray(body.message)) message = body.message.join(" ");
    else if (body.message) message = body.message;
    reason = body.reason ?? "";
  } catch {
    // Preserve the status-based fallback.
  }
  return { message, reason };
}

export default function FaceScanDialog({
  isDarkTheme,
  skinGoal,
  onClose,
  onUpgradeRequired,
  onContinueDiscussion,
}: FaceScanDialogProps) {
  const { locale } = useI18n();
  const tr = (value: string) => translateStaticText(value, locale);
  const [photos, setPhotos] = useState<Partial<Record<FaceImageSlot, SelectedPhoto>>>({});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<FaceScanResponse | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [chatAttachment, setChatAttachment] = useState<SelectedPhoto | null>(null);
  const fileInputs = useRef<Partial<Record<FaceImageSlot, HTMLInputElement | null>>>({});
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrls = useRef(new Set<string>());
  const messageId = useRef(0);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting && !isChatSending) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isChatSending, isSubmitting, onClose]);

  const createSelectedPhoto = (file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      throw new Error(tr("Utilisez une image JPEG, PNG ou WebP."));
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(tr("Chaque photo doit peser au maximum 8 Mo."));
    }
    const previewUrl = URL.createObjectURL(file);
    objectUrls.current.add(previewUrl);
    return { file, previewUrl };
  };

  const removeUrl = (url: string) => {
    URL.revokeObjectURL(url);
    objectUrls.current.delete(url);
  };

  const selectPhoto = (slot: FaceImageSlot, file?: File) => {
    if (!file) return;
    try {
      const selected = createSelectedPhoto(file);
      setPhotos((current) => {
        const previous = current[slot];
        if (previous) removeUrl(previous.previewUrl);
        return { ...current, [slot]: selected };
      });
      setError("");
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : tr("Photo invalide."));
    }
  };

  const removePhoto = (slot: FaceImageSlot) => {
    setPhotos((current) => {
      const previous = current[slot];
      if (previous) removeUrl(previous.previewUrl);
      const next = { ...current };
      delete next[slot];
      return next;
    });
  };

  const submitFaceScan = async () => {
    if (!photos.frontImage) {
      setError(tr("Ajoutez une photo de face pour continuer."));
      return;
    }
    if (!consentAccepted) {
      setError(tr("Votre consentement explicite est requis avant l'analyse."));
      return;
    }

    setIsSubmitting(true);
    setError("");
    const formData = new FormData();
    formData.append("frontImage", photos.frontImage.file);
    if (photos.leftImage) formData.append("leftImage", photos.leftImage.file);
    if (photos.rightImage) formData.append("rightImage", photos.rightImage.file);
    if (skinGoal) formData.append("skinGoal", skinGoal);
    formData.append("consentAccepted", "true");

    try {
      const token = getStoredAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/face-scans/analyze`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      if (!response.ok) {
        const apiError = await readApiError(response);
        if (response.status === 402 && apiError.reason === "face-scan-pro-required") {
          onUpgradeRequired();
          return;
        }
        throw new Error(apiError.message);
      }
      const data = (await response.json()) as FaceScanResponse;
      setResult(data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : tr("Analyse indisponible pour le moment."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectChatAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const selected = createSelectedPhoto(file);
      if (chatAttachment) removeUrl(chatAttachment.previewUrl);
      setChatAttachment(selected);
      setError("");
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : tr("Image invalide."));
    }
  };

  const removeChatAttachment = () => {
    if (chatAttachment) removeUrl(chatAttachment.previewUrl);
    setChatAttachment(null);
  };

  const sendFaceMessage = async (suggestedQuestion?: string) => {
    const message = (suggestedQuestion ?? chatInput).trim();
    if (!message || !result?.faceScanId || isChatSending) return;

    const pendingAttachment = chatAttachment;
    setChatInput("");
    setChatAttachment(null);
    const userMessage: ChatMessage = {
      id: `face-user-${messageId.current++}`,
      role: "user",
      content: message,
      attachmentPreview: pendingAttachment?.previewUrl,
    };
    setChatMessages((current) => [...current, userMessage]);
    setIsChatSending(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("message", message);
      if (pendingAttachment) formData.append("image", pendingAttachment.file);
      const token = getStoredAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/face-scans/${result.faceScanId}/messages`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      if (!response.ok) {
        const apiError = await readApiError(response);
        if (response.status === 402 && apiError.reason === "face-scan-pro-required") {
          onUpgradeRequired();
          return;
        }
        throw new Error(apiError.message);
      }
      const data = (await response.json()) as { answer: string; suggestions?: string[] };
      setChatMessages((current) => [
        ...current,
        {
          id: `face-assistant-${messageId.current++}`,
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : tr("Message impossible Ã  envoyer."));
    } finally {
      setIsChatSending(false);
    }
  };

  const resetResult = () => {
    setResult(null);
    setChatMessages([]);
    setChatInput("");
    if (chatAttachment) removeUrl(chatAttachment.previewUrl);
    setChatAttachment(null);
    setError("");
  };

  const panel = isDarkTheme ? "border-white/10 bg-[#111214] text-white" : "border-slate-200 bg-white text-slate-950";
  const softPanel = isDarkTheme ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-slate-50";
  const muted = isDarkTheme ? "text-white/58" : "text-slate-600";

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={tr("Analyse visage Pro")}>
      <div className={`relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border shadow-2xl ${panel}`}>
        <header className={`flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-7 ${isDarkTheme ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex min-w-0 items-center gap-3">
            {result && (
              <button type="button" onClick={resetResult} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${softPanel}`} aria-label={tr("Revenir aux photos")}>
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ce98fb]/18 text-[#b975ef]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg font-black sm:text-xl">{tr("Analyse visage")}</h2>
                <span className="rounded-full bg-[#ce98fb]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#b975ef]">Pro</span>
              </div>
              <p className={`mt-0.5 text-xs sm:text-sm ${muted}`}>{tr("Observations cosmÃ©tiques prudentes, sans diagnostic")}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition hover:scale-[1.03] ${softPanel}`} aria-label={tr("Fermer")}>
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {!result ? (
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <section>
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a764dc]">{tr("Photos guidÃ©es")}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{tr("Montrez votre peau dans une lumiÃ¨re naturelle")}</h3>
                  <p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>{tr("Une photo de face est obligatoire. Les profils gauche et droit sont facultatifs, mais peuvent amÃ©liorer la couverture visuelle.")}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {([
                    ["frontImage", "Face", "Obligatoire"],
                    ["leftImage", "Profil gauche", "Facultatif"],
                    ["rightImage", "Profil droit", "Facultatif"],
                  ] as const).map(([slot, label, badge]) => {
                    const photo = photos[slot];
                    return (
                      <div key={slot} className={`group relative overflow-hidden rounded-[22px] border ${softPanel}`}>
                        <input
                          ref={(node) => { fileInputs.current[slot] = node; }}
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => selectPhoto(slot, event.target.files?.[0])}
                        />
                        {photo ? (
                          <div className="relative aspect-[4/5]">
                            {/* Blob previews are local and never uploaded through Next Image optimization. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo.previewUrl} alt={tr(label)} className="h-full w-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 pt-12 text-white">
                              <div>
                                <p className="text-sm font-black">{tr(label)}</p>
                                <p className="text-[10px] text-white/70">{tr(badge)}</p>
                              </div>
                              <button type="button" onClick={() => removePhoto(slot)} className="grid h-9 w-9 place-items-center rounded-full bg-black/35 backdrop-blur" aria-label={tr("Supprimer la photo")}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileInputs.current[slot]?.click()} className="flex aspect-[4/5] w-full flex-col items-center justify-center px-4 text-center">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ce98fb]/16 text-[#b975ef]">
                              <Camera className="h-6 w-6" />
                            </div>
                            <p className="mt-4 text-sm font-black">{tr(label)}</p>
                            <span className={`mt-1 text-xs ${muted}`}>{tr(badge)}</span>
                            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#ce98fb]/35 px-3 py-1.5 text-[11px] font-bold text-[#a764dc]">
                              <ImagePlus className="h-3.5 w-3.5" /> {tr("Ajouter")}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <aside className="space-y-4">
                <div className={`rounded-[24px] border p-5 ${softPanel}`}>
                  <div className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {tr("Pour une photo exploitable")}</div>
                  <ul className={`mt-4 space-y-3 text-sm leading-5 ${muted}`}>
                    {["LumiÃ¨re naturelle face Ã  vous, sans contre-jour.", "Visage net, entiÃ¨rement visible et centrÃ©.", "Retirez les filtres et, si possible, le maquillage couvrant.", "Expression neutre, camÃ©ra Ã  hauteur des yeux.", "JPEG, PNG ou WebP, maximum 8 Mo par photo."].map((instruction) => (
                      <li key={instruction} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ad6ee0]" /> <span>{tr(instruction)}</span></li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-[24px] border p-5 ${softPanel}`}>
                  <div className="flex items-center gap-2 text-sm font-black"><ShieldCheck className="h-4 w-4 text-[#ad6ee0]" /> {tr("ConfidentialitÃ© et limites")}</div>
                  <p className={`mt-3 text-sm leading-6 ${muted}`}>{tr("Vos photos sont traitÃ©es pour l'analyse et les images brutes du visage ne sont pas stockÃ©es par dÃ©faut. Les rÃ©sultats dÃ©crivent uniquement des caractÃ©ristiques cosmÃ©tiques visibles. Ils ne constituent pas un diagnostic mÃ©dical et peuvent Ãªtre influencÃ©s par la lumiÃ¨re ou le traitement de la camÃ©ra.")}</p>
                  <label className={`mt-4 flex cursor-pointer gap-3 rounded-2xl border p-3 ${isDarkTheme ? "border-white/10 bg-black/15" : "border-slate-200 bg-white"}`}>
                    <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#ad6ee0]" />
                    <span className="text-xs font-semibold leading-5">{tr("J'accepte que mes photos soient traitÃ©es pour produire ces observations cosmÃ©tiques.")}</span>
                  </label>
                </div>

                {error && <div className="flex gap-2 rounded-2xl border border-rose-400/35 bg-rose-500/10 p-3 text-sm text-rose-500"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}

                <button type="button" onClick={submitFaceScan} disabled={!photos.frontImage || !consentAccepted || isSubmitting} className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ce98fb] px-5 text-sm font-black text-[#22172a] transition hover:bg-[#d9affb] disabled:cursor-not-allowed disabled:opacity-50">
                  {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> {tr("Analyse visuelle en cours...")}</> : <><Sparkles className="h-4 w-4" /> {tr("Analyser mes photos")}</>}
                </button>
              </aside>
            </div>
          ) : !result.usable || !result.guidance ? (
            <div className="mx-auto max-w-2xl py-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-500/12 text-amber-500"><Camera className="h-7 w-7" /></div>
              <h3 className="mt-5 text-2xl font-black">{tr("Une nouvelle photo est nÃ©cessaire")}</h3>
              <p className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${muted}`}>{tr("Gemini n'a pas pu produire des observations suffisamment fiables Ã  partir des images envoyÃ©es.")}</p>
              <div className={`mt-6 rounded-[22px] border p-5 text-left ${softPanel}`}>
                <p className="text-sm font-black">{tr("Conseils pour reprendre la photo")}</p>
                <ul className={`mt-3 space-y-2 text-sm ${muted}`}>
                  {(result.observations.retakeInstructions.length ? result.observations.retakeInstructions : ["Utilisez une lumiÃ¨re naturelle, gardez le visage net et entiÃ¨rement visible."]).map((instruction) => (
                    <li key={instruction} className="flex gap-2"><ArrowLeft className="mt-0.5 h-4 w-4 rotate-180 shrink-0 text-[#ad6ee0]" />{instruction}</li>
                  ))}
                </ul>
              </div>
              {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
              <button type="button" onClick={resetResult} className="mt-6 rounded-2xl bg-[#ce98fb] px-6 py-3 text-sm font-black text-[#22172a]">{tr("Reprendre les photos")}</button>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="space-y-4">
                <div className={`rounded-[24px] border p-5 sm:p-6 ${softPanel}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a764dc]">{tr("RÃ©sultat cosmÃ©tique")}</p>
                      <h3 className="mt-2 text-2xl font-black">{tr("Ce qui paraÃ®t visible")}</h3>
                    </div>
                    <div className="flex gap-2 text-[11px] font-bold">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-500">{tr(`LumiÃ¨re: ${result.observations.quality.lighting}`)}</span>
                      <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-sky-500">{tr(`NettetÃ©: ${result.observations.quality.focus}`)}</span>
                    </div>
                  </div>
                  <p className={`mt-4 text-sm leading-6 ${muted}`}>{shortText(result.guidance.explanation, 190)}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {result.observations.observations.map((observation, index) => (
                      <article key={`${observation.area}-${observation.concern}-${index}`} className={`rounded-2xl border p-4 ${isDarkTheme ? "border-white/10 bg-black/15" : "border-slate-200 bg-white"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a764dc]">{tr(areaLabels[observation.area])}</p>
                          <span className={`text-[10px] font-bold ${muted}`}>{tr(`Confiance ${observation.confidence}`)}</span>
                        </div>
                        <h4 className="mt-2 text-sm font-black">{tr(concernLabels[observation.concern])}</h4>
                        <p className={`mt-2 text-xs leading-5 ${muted}`}>{shortText(observation.description, 95)}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className={`rounded-[22px] border p-5 ${softPanel}`}>
                    <p className="text-sm font-black">{tr("PrioritÃ©s douces")}</p>
                    <ul className={`mt-3 space-y-2 text-sm leading-5 ${muted}`}>{result.guidance.priorities.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{item}</li>)}</ul>
                  </div>
                  <div className={`rounded-[22px] border p-5 ${softPanel}`}>
                    <p className="text-sm font-black">{tr("IngrÃ©dients potentiellement utiles")}</p>
                    <div className="mt-3 flex flex-wrap gap-2">{result.guidance.potentiallyUsefulIngredients.map((item) => <span key={item} className="rounded-full bg-[#ce98fb]/16 px-3 py-1.5 text-xs font-bold text-[#a764dc]">{item}</span>)}</div>
                    {result.guidance.introduceCautiously.length > 0 && <><p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-amber-500">{tr("Ã€ introduire prudemment")}</p><p className={`mt-2 text-xs leading-5 ${muted}`}>{result.guidance.introduceCautiously.join(" Â· ")}</p></>}
                  </div>
                </div>

                <div className={`rounded-[22px] border p-5 ${softPanel}`}>
                  <p className="text-sm font-black">{tr("CatÃ©gories de routine recommandÃ©es")}</p>
                  <div className="mt-3 space-y-3">{result.guidance.routineCategories.map((item) => <div key={`${item.step}-${item.guidance}`}><p className="text-xs font-black text-[#a764dc]">{item.step}</p><p className={`mt-1 text-sm leading-5 ${muted}`}>{item.guidance}</p></div>)}</div>
                </div>
                <p className={`text-xs leading-5 ${muted}`}>{result.guidance.disclaimer}</p>
              </section>
              <aside className={`flex flex-col justify-between rounded-[24px] border p-5 ${softPanel}`}>
                <div>
                  <p className="text-sm font-black">{tr("Continuer avec SkinorAI")}</p>
                  <p className={`mt-2 text-sm leading-6 ${muted}`}>{tr("Vous pouvez ouvrir cette analyse dans une nouvelle discussion pour poser vos questions, ajouter une autre image si besoin et garder l'historique au même endroit.")}</p>
                  {(result.guidance.followUpQuestions ?? []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.guidance.followUpQuestions.slice(0, 3).map((question) => (
                        <span key={question} className={`rounded-full border px-3 py-2 text-xs font-bold ${isDarkTheme ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>{question}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => result.faceScanId && onContinueDiscussion(result.faceScanId)} disabled={!result.faceScanId} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ce98fb] px-5 text-sm font-black text-[#22172a] transition hover:bg-[#d9affb] disabled:cursor-not-allowed disabled:opacity-50">
                  <Send className="h-4 w-4" />
                  {tr("Continuer la discussion")}
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
