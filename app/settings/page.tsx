"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, CircleHelp, FlaskConical, LoaderCircle, LogOut, Moon, PanelLeft, Plus, ShieldCheck, Sparkles, Sun, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { API_BASE_URL, getStoredAuthToken, useAuth, type AuthUser } from "@/components/AuthProvider";
import { useTheme } from "@/lib/theme";
import { getSkinGoalOption, normalizeSkinGoalId, SKIN_GOAL_STORAGE_KEY, skinGoalOptions, type SkinGoalId } from "@/lib/skinGoals";

type PlanStatus = 'free' | 'pro';

type ScanHistoryItem = {
  id: string;
  productName: string;
  customTitle?: string | null;
  createdAt: string;
  updatedAt: string;
  analysisSummary?: string;
};

type ProfileResponse = {
  user?: Partial<AuthUser>;
  name?: string;
  email?: string;
  provider?: 'email' | 'google';
  planStatus?: PlanStatus;
  freeScansUsed?: number;
  freeScanLimit?: number;
  skinGoal?: string;
  preferredSkinGoal?: string;
};

type Palette = {
  page: string;
  overlay: string;
  sidebar: string;
  logo: string;
  sidebarButton: string;
  sidebarLabel: string;
  navIdle: string;
  recentCard: string;
  recentText: string;
  recentMuted: string;
  premiumCard: string;
  premiumTitle: string;
  premiumText: string;
  premiumButton: string;
  headerButton: string;
  heading: string;
  subtext: string;
  card: string;
  cardSoft: string;
  input: string;
};

const CHAT_TITLE_STORAGE_KEY = 'skinorai_chat_titles';
const PROFILE_READ_ENDPOINT = '/api/auth/me';
const PROFILE_UPDATE_ENDPOINT = '/api/auth/me';
const PASSWORD_UPDATE_ENDPOINT = '/api/auth/password';

class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

function buildPalette(isDarkTheme: boolean): Palette {
  return isDarkTheme
    ? {
        page: 'bg-[#080912] text-[#f7f1fb]',
        overlay: 'bg-[radial-gradient(circle_at_62%_10%,rgba(224,128,194,0.16),transparent_28%),radial-gradient(circle_at_78%_70%,rgba(151,210,139,0.08),transparent_24%),linear-gradient(135deg,#0d111b_0%,#070811_45%,#11101a_100%)]',
        sidebar: 'border-r border-white/[0.07] bg-[#0b0d17]/92 shadow-[18px_0_55px_rgba(0,0,0,0.20)]',
        logo: 'brightness-0 invert',
        sidebarButton: 'border-white/10 bg-white/[0.03] text-[#a8a8b8] hover:bg-white/[0.08]',
        sidebarLabel: 'text-[#777583]',
        navIdle: 'text-[#dbd8e4] hover:bg-white/[0.05]',
        recentCard: 'border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.07]',
        recentText: 'text-white',
        recentMuted: 'text-[#918f9e]',
        premiumCard: 'border-white/[0.08] bg-[linear-gradient(180deg,rgba(45,31,55,0.82)_0%,rgba(25,22,34,0.9)_100%)] shadow-[0_14px_38px_rgba(0,0,0,0.18)]',
        premiumTitle: 'text-[#f0a8d9]',
        premiumText: 'text-[#bdb7c8]',
        premiumButton: 'bg-[linear-gradient(135deg,#9b5f99_0%,#cf7db5_100%)] text-white',
        headerButton: 'border-white/[0.10] bg-white/[0.04] text-white hover:bg-white/[0.08]',
        heading: 'text-white',
        subtext: 'text-[#aaa6b5]',
        card: 'border-white/[0.10] bg-white/[0.045] shadow-[0_18px_50px_rgba(0,0,0,0.18)]',
        cardSoft: 'border-white/[0.10] bg-white/[0.04]',
        input: 'border-white/[0.10] bg-white/[0.04] text-white placeholder:text-white/35',
      }
    : {
        page: 'bg-[#f6f1fb] text-[#1b1a2b]',
        overlay: 'bg-[radial-gradient(circle_at_60%_14%,rgba(194,128,224,0.18),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(180,223,164,0.18),transparent_20%),linear-gradient(180deg,#fffdfd_0%,#f9f5ff_40%,#f4f8fb_100%)]',
        sidebar: 'border-r border-[#eadff7] bg-white/88 shadow-[18px_0_45px_rgba(103,74,151,0.10)]',
        logo: '',
        sidebarButton: 'border-[#ebddf9] bg-[#faf6ff] text-[#6c6289] hover:bg-[#f3ecff]',
        sidebarLabel: 'text-[#8f86a7]',
        navIdle: 'text-[#5c5671] hover:bg-[#f6f1ff]',
        recentCard: 'border-[#ece5f7] bg-white/90 hover:bg-[#fbf8ff]',
        recentText: 'text-[#221d35]',
        recentMuted: 'text-[#7c7693]',
        premiumCard: 'border-[#ecdff7] bg-[linear-gradient(180deg,#fbf7ff_0%,#f7effa_100%)] shadow-[0_14px_38px_rgba(136,101,184,0.12)]',
        premiumTitle: 'text-[#b1689b]',
        premiumText: 'text-[#7d7792]',
        premiumButton: 'bg-[linear-gradient(135deg,#c882bf_0%,#e7a0cf_100%)] text-white',
        headerButton: 'border-[#e7def4] bg-white/85 text-[#2a2440] hover:bg-white',
        heading: 'text-[#221d35]',
        subtext: 'text-[#726b86]',
        card: 'border-[#eadff7] bg-white/88 shadow-[0_18px_45px_rgba(136,101,184,0.10)]',
        cardSoft: 'border-[#eadff7] bg-white/70',
        input: 'border-[#e4d8f4] bg-white text-[#221d35] placeholder:text-[#8f86a7]',
      };
}

function formatScanHistoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date inconnue';
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const label = date.toDateString() === now.toDateString() ? "Aujourd'hui" : date.toDateString() === yesterday.toDateString() ? 'Hier' : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return `${label} - ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

function normalizeDisplayText(value: string) {
  if (!/[???]/.test(value)) return value;
  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return value;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredAuthToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init?.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(errorBody.message)) message = errorBody.message.join(' ');
      else if (errorBody.message) message = errorBody.message;
    } catch {}
    throw new ApiRequestError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function requestScanHistory() {
  return apiRequest<ScanHistoryItem[]>('/api/scans');
}

function buildUserFromProfile(profile: ProfileResponse, currentUser: AuthUser | null): Partial<AuthUser> {
  const next = profile.user ?? {};
  return {
    id: next.id ?? currentUser?.id ?? '',
    name: next.name ?? profile.name ?? currentUser?.name ?? '',
    email: next.email ?? profile.email ?? currentUser?.email ?? '',
    provider: next.provider ?? profile.provider ?? currentUser?.provider ?? 'email',
    planStatus: next.planStatus ?? profile.planStatus ?? currentUser?.planStatus,
    freeScansUsed: next.freeScansUsed ?? profile.freeScansUsed ?? currentUser?.freeScansUsed,
    freeScanLimit: next.freeScanLimit ?? profile.freeScanLimit ?? currentUser?.freeScanLimit,
    skinGoal: next.skinGoal ?? profile.skinGoal ?? currentUser?.skinGoal,
    preferredSkinGoal: next.preferredSkinGoal ?? profile.preferredSkinGoal ?? currentUser?.preferredSkinGoal ?? next.skinGoal ?? profile.skinGoal ?? currentUser?.skinGoal,
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { isReady, token, user, updateUser, logout } = useAuth();
  const { theme, setTheme, isDarkTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [renamedDiscussions] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const storedTitles = window.localStorage.getItem(CHAT_TITLE_STORAGE_KEY);
      return storedTitles ? JSON.parse(storedTitles) as Record<string, string> : {};
    } catch {
      return {};
    }
  });
  const [nameInput, setNameInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSkinGoalId, setSelectedSkinGoalId] = useState<SkinGoalId>(() => {
    if (typeof window === 'undefined') return skinGoalOptions[0].id;
    return normalizeSkinGoalId(window.localStorage.getItem(SKIN_GOAL_STORAGE_KEY)) ?? skinGoalOptions[0].id;
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [goalMessage, setGoalMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [goalError, setGoalError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const palette = useMemo(() => buildPalette(isDarkTheme), [isDarkTheme]);
  const planStatus: PlanStatus = user?.planStatus === 'pro' ? 'pro' : 'free';
  const freeScanLimit = user?.freeScanLimit ?? 3;
  const freeScansUsed = user?.freeScansUsed ?? 0;
  const selectedGoalOption = getSkinGoalOption(selectedSkinGoalId) ?? skinGoalOptions[0];
  const freeScansRemaining = planStatus === 'pro' ? 'Illimités' : String(Math.max(0, freeScanLimit - freeScansUsed));

  useEffect(() => {
    document.body.dataset.navbarHidden = 'true';
    return () => { delete document.body.dataset.navbarHidden; };
  }, []);

  useEffect(() => {
    if (isReady && !token) router.replace('/login');
  }, [isReady, router, token]);


  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const scans = await requestScanHistory();
        if (!cancelled) setScanHistory(scans);
      } catch {
        if (!cancelled) setScanHistory([]);
      } finally {
        if (!cancelled) setIsHistoryLoading(false);
      }
    };
    if (token) void loadHistory();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      if (!token) return;
      try {
        const profile = await apiRequest<ProfileResponse>(PROFILE_READ_ENDPOINT, { method: 'GET' });
        if (cancelled) return;
        const nextUser = buildUserFromProfile(profile, user);
        updateUser(nextUser);
        const preferredGoal = normalizeSkinGoalId(nextUser.preferredSkinGoal ?? nextUser.skinGoal);
        if (preferredGoal) {
          window.localStorage.setItem(SKIN_GOAL_STORAGE_KEY, preferredGoal);
          setSelectedSkinGoalId(preferredGoal);
        }
      } catch {}
    };
    void loadProfile();
    return () => { cancelled = true; };
  }, [token, updateUser, user]);

  const getChatDisplayName = (scanId: string | null | undefined, fallbackName: string, persistedTitle?: string | null) => {
    if (!scanId) return normalizeDisplayText(persistedTitle || fallbackName);
    const renamedTitle = renamedDiscussions[scanId]?.trim();
    return normalizeDisplayText(persistedTitle?.trim() || renamedTitle || fallbackName || 'Produit scanné');
  };

  const handleLogout = () => { logout(); router.replace('/login'); };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = (nameInput || user?.name || '').trim();
    if (!trimmedName) { setProfileError('Le nom ne peut pas être vide.'); setProfileMessage(''); return; }
    setIsSavingProfile(true); setProfileError(''); setProfileMessage('');
    try {
      const response = await apiRequest<ProfileResponse>(PROFILE_UPDATE_ENDPOINT, { method: 'PATCH', body: JSON.stringify({ name: trimmedName }) });
      updateUser({ ...buildUserFromProfile(response, user), name: trimmedName });
      setProfileMessage('Votre nom a été mis à jour.');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Impossible de mettre à jour le nom.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError('Remplissez tous les champs du mot de passe.'); setPasswordMessage(''); return; }
    if (newPassword.length < 8) { setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.'); setPasswordMessage(''); return; }
    if (newPassword !== confirmPassword) { setPasswordError('La confirmation du mot de passe ne correspond pas.'); setPasswordMessage(''); return; }
    setIsSavingPassword(true); setPasswordError(''); setPasswordMessage('');
    try {
      await apiRequest(PASSWORD_UPDATE_ENDPOINT, { method: 'PATCH', body: JSON.stringify({ currentPassword, newPassword }) });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setPasswordMessage('Votre mot de passe a été mis à jour.');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Impossible de mettre à jour le mot de passe.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleGoalSave = async () => {
    setIsSavingGoal(true); setGoalError(''); setGoalMessage('');
    const payload = { skinGoal: selectedGoalOption.apiValue, preferredSkinGoal: selectedGoalOption.apiValue };
    try {
      const response = await apiRequest<ProfileResponse>(PROFILE_UPDATE_ENDPOINT, { method: 'PATCH', body: JSON.stringify(payload) });
      updateUser({ ...buildUserFromProfile(response, user), skinGoal: selectedGoalOption.apiValue, preferredSkinGoal: selectedGoalOption.apiValue });
      window.localStorage.setItem(SKIN_GOAL_STORAGE_KEY, selectedGoalOption.id);
      setGoalMessage("L'objectif peau sera maintenant présélectionné dans le scan.");
    } catch (error) {      setGoalError(error instanceof Error ? error.message : 'Impossible de sauvegarder la preference.');
    } finally {
      setIsSavingGoal(false);
    }
  };

  if (!isReady || !token) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fbfaff] px-4 text-[#111631]"><div className="rounded-[28px] border border-[#e8e0fb] bg-white px-8 py-7 text-center shadow-[0_24px_60px_rgba(90,66,165,0.10)]"><Sparkles className="mx-auto h-6 w-6 animate-pulse text-[#7548e8]" /><h1 className="mt-4 text-xl font-bold">Vérification de votre session...</h1><p className="mt-2 text-sm text-[#66708f]">Redirection vers la connexion si nécessaire.</p></div></main>;
  }

  return (
    <main className={`h-screen overflow-hidden [&_button:not(:disabled)]:cursor-pointer ${palette.page}`}>
      <div className={`pointer-events-none fixed inset-0 ${palette.overlay}`} />
      <div className={`fixed inset-0 z-40 bg-[#120d20]/30 backdrop-blur-[4px] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
      <div className="relative flex h-screen w-full">
        <DashboardSidebar palette={palette} logoClass={palette.logo} scanHistory={scanHistory} isHistoryLoading={isHistoryLoading} getChatDisplayName={getChatDisplayName} isSidebarOpen={isSidebarOpen} planStatus={planStatus} onClose={() => setIsSidebarOpen(false)} onNavigate={(path) => { setIsSidebarOpen(false); router.push(path); }} />
        <section className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-5 lg:px-6 xl:px-7">
          <header className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setIsSidebarOpen(true)} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden ${palette.headerButton}`} aria-label="Ouvrir le menu"><PanelLeft className="h-4 w-4" /></button>
            <div className="ml-auto flex items-center gap-3"><button type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium backdrop-blur transition ${palette.headerButton}`}>{isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{isDarkTheme ? 'Clair' : 'Sombre'}</button></div>
          </header>
          <div className="mx-auto max-w-[1120px] pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className={`text-xs font-semibold uppercase tracking-[0.22em] ${palette.subtext}`}>Tableau de bord</p><h1 className={`mt-2 text-[34px] font-semibold tracking-[-0.05em] sm:text-[42px] ${palette.heading}`}>Paramètres</h1><p className={`mt-3 max-w-2xl text-sm leading-6 ${palette.subtext}`}>Gérez votre statut {planStatus === 'pro' ? 'Pro' : 'Freemium'}, modifiez votre profil et choisissez l&apos;objectif peau à préremplir pendant le scan.</p></div>
              <button type="button" onClick={() => router.push('/scan')} className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#a56ae2] to-[#e89ac7] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(202,105,179,0.20)] transition hover:-translate-y-0.5">Nouveau scan</button>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <SettingsCard title="Compte" description="Informations synchronisées avec votre compte SkinorAI." palette={palette}>
                <div className="space-y-4">
                  <SettingsRow title="Email" text="Adresse utilisée pour la connexion." value={user?.email || 'Email inconnu'} palette={palette} />
                  <SettingsRow title="Connexion" text="Méthode d'authentification actuelle." value={user?.provider === 'google' ? 'Google' : 'Email'} palette={palette} />
                </div>
                <form onSubmit={handleProfileSubmit} className="mt-6 border-t border-black/5 pt-6 dark:border-white/10">
                  <h3 className={`text-sm font-semibold ${palette.heading}`}>Modifier votre nom</h3>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={nameInput || user?.name || ''} onChange={(event) => setNameInput(event.target.value)} className={`h-11 flex-1 rounded-2xl border px-4 text-sm outline-none transition focus:border-[#c88ee0] ${palette.input}`} placeholder="Votre nom" /><button type="submit" disabled={isSavingProfile} className="inline-flex h-11 items-center justify-center rounded-full bg-[#11131f] px-5 text-sm font-semibold text-white disabled:opacity-60">{isSavingProfile ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Enregistrer'}</button></div>
                  {profileMessage && <p className="mt-3 text-sm font-medium text-[#2e9b62]">{profileMessage}</p>}
                  {profileError && <p className="mt-3 text-sm font-medium text-[#d4517d]">{profileError}</p>}
                </form>
                <div className="mt-6 border-t border-black/5 pt-6 dark:border-white/10"><button type="button" onClick={handleLogout} className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${palette.headerButton}`}><LogOut className="h-4 w-4" />Se déconnecter</button></div>
              </SettingsCard>
              <SettingsCard title="Abonnement" description="Statut récupéré depuis votre compte." palette={palette}>
                <div className="space-y-4">
                  <SettingsRow title="Plan actuel" text="Votre accès aux fonctionnalités SkinorAI." value={planStatus === 'pro' ? 'Pro' : 'Freemium'} palette={palette} />
                  <SettingsRow title="Scans utilisés" text="Compteur synchronisé avec votre compte." value={planStatus === 'pro' ? 'Illimités' : `${freeScansUsed}/${freeScanLimit}`} palette={palette} />
                  <SettingsRow title="Scans restants" text="Nombre de scans disponibles avec votre plan." value={freeScansRemaining} palette={palette} />
                </div>
                <div className={`mt-6 rounded-3xl border px-5 py-4 ${palette.cardSoft}`}><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c983c4] to-[#9d72e8] text-white">{planStatus === 'pro' ? <Check className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}</span><div><h3 className={`text-base font-semibold ${palette.heading}`}>{planStatus === 'pro' ? 'Plan Pro actif' : 'Passez à Pro'}</h3><p className={`mt-1 text-sm leading-6 ${palette.subtext}`}>{planStatus === 'pro' ? 'Votre abonnement Pro est bien pris en compte sur cette page.' : 'Débloquez les scans illimités et des analyses plus poussées.'}</p></div></div><button type="button" onClick={() => router.push('/pricing')} className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#11131f] px-5 text-sm font-semibold text-white">{planStatus === 'pro' ? 'Gérer mon offre' : 'Voir les offres'}</button></div>
              </SettingsCard>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <SettingsCard title="Sécurité" description="Mettez à jour votre mot de passe." palette={palette}>
                {user?.provider === 'google' ? <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${palette.cardSoft} ${palette.subtext}`}>Votre compte utilise Google. Le changement de mot de passe local dépend du backend.</div> : <form onSubmit={handlePasswordSubmit} className="grid gap-3"><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={`h-11 rounded-2xl border px-4 text-sm outline-none transition focus:border-[#c88ee0] ${palette.input}`} placeholder="Mot de passe actuel" /><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={`h-11 rounded-2xl border px-4 text-sm outline-none transition focus:border-[#c88ee0] ${palette.input}`} placeholder="Nouveau mot de passe" /><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={`h-11 rounded-2xl border px-4 text-sm outline-none transition focus:border-[#c88ee0] ${palette.input}`} placeholder="Confirmer le nouveau mot de passe" /><button type="submit" disabled={isSavingPassword} className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#11131f] px-5 text-sm font-semibold text-white disabled:opacity-60">{isSavingPassword ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Mettre à jour'}</button>{passwordMessage && <p className="text-sm font-medium text-[#2e9b62]">{passwordMessage}</p>}{passwordError && <p className="text-sm font-medium text-[#d4517d]">{passwordError}</p>}</form>}
              </SettingsCard>
              <SettingsCard title="Apparence" description="Le même thème est utilisé dans le chat, le scan et les paramètres." palette={palette}>
                <div className="grid gap-3 sm:grid-cols-2"><ThemeButton active={theme === 'light'} label="Mode clair" icon={Sun} onClick={() => setTheme('light')} palette={palette} /><ThemeButton active={theme === 'dark'} label="Mode sombre" icon={Moon} onClick={() => setTheme('dark')} palette={palette} /></div>
              </SettingsCard>
            </div>
            <div className="mt-4">
              <SettingsCard title="Objectif peau" description="Cette préférence sera automatiquement présélectionnée dans le prochain scan produit." palette={palette}>
                <div className={`rounded-[30px] border p-5 sm:p-6 ${palette.cardSoft}`}><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c785e7] to-[#e6accf] text-lg font-semibold text-white">1</span><div><h3 className={`text-[28px] font-semibold tracking-[-0.04em] ${palette.heading}`}>Choisissez votre objectif peau</h3><p className={`mt-2 text-sm leading-6 ${palette.subtext}`}>Selectionnez votre priorite du moment pour personnaliser l analyse et pre-remplir cette etape lors du prochain scan.</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{skinGoalOptions.map((goal) => { const isSelected = selectedSkinGoalId === goal.id; return <button key={goal.id} type="button" onClick={() => setSelectedSkinGoalId(goal.id)} className={`relative rounded-[24px] border px-5 py-6 text-center transition hover:-translate-y-0.5 ${isSelected ? 'border-[#9d74ef] bg-[#fffaff] shadow-[0_18px_35px_rgba(157,116,239,0.12)]' : palette.cardSoft}`}>{isSelected && <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#8d5fe9] text-white"><Check className="h-4 w-4" /></span>}<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(235,215,255,0.9),rgba(252,246,255,0.65))]"><Image src={goal.image} alt={goal.label} width={44} height={44} className="h-11 w-11 object-contain" /></div><p className={`mt-4 text-base font-semibold ${palette.heading}`}>{goal.label}</p><p className={`mt-2 text-sm ${palette.subtext}`}>{goal.accentLabel}</p></button>; })}</div></div>
                <div className="mt-5 flex flex-col gap-4 rounded-[26px] border border-[#eadff7] bg-white/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p className={`text-sm font-semibold ${palette.heading}`}>Objectif sélectionné</p><p className={`mt-1 text-sm leading-6 ${palette.subtext}`}>{selectedGoalOption.label} sera prérempli automatiquement dans le scan produit.</p></div><button type="button" onClick={handleGoalSave} disabled={isSavingGoal} className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#a56ae2] to-[#e89ac7] px-5 text-sm font-semibold text-white disabled:opacity-60">{isSavingGoal ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Enregistrer l&apos;objectif"}</button></div>
                {goalMessage && <p className="mt-3 text-sm font-medium text-[#2e9b62]">{goalMessage}</p>}
                {goalError && <p className="mt-3 text-sm font-medium text-[#d4517d]">{goalError}</p>}
              </SettingsCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardSidebar({ palette, logoClass, scanHistory, isHistoryLoading, getChatDisplayName, isSidebarOpen, planStatus, onClose, onNavigate }: { palette: Palette; logoClass: string; scanHistory: ScanHistoryItem[]; isHistoryLoading: boolean; getChatDisplayName: (scanId: string | null | undefined, fallbackName: string, persistedTitle?: string | null) => string; isSidebarOpen: boolean; planStatus: PlanStatus; onClose: () => void; onNavigate: (path: string) => void; }) {
  const recentDiscussions = [...scanHistory].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()).slice(0, 6);
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[86vw] shrink-0 flex-col px-4 py-4 backdrop-blur-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-[248px] lg:max-w-none lg:translate-x-0 lg:px-4 xl:w-[270px] xl:px-5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${palette.sidebar}`}>
      <div className="flex items-center justify-between"><Image src="/logo.png" alt="SkinorAI" width={150} height={36} className={`h-8 w-auto ${logoClass}`} priority /><button type="button" onClick={onClose} className={`rounded-lg border p-1.5 transition lg:hidden ${palette.sidebarButton}`} aria-label="Fermer le menu"><X className="h-4 w-4" /></button></div>
      <button type="button" onClick={() => onNavigate('/scan')} className="mt-6 flex h-[45px] items-center gap-3 rounded-xl bg-gradient-to-r from-[#F7DDE8] via-[#F3D4E3] to-[#EEDAF7] px-5 text-sm font-medium text-[#7A3F5C] shadow-[0_10px_24px_rgba(122,63,92,0.10)]"><Plus className="h-5 w-5" />Nouvelle discussion</button>
      <div className="mt-6"><p className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${palette.sidebarLabel}`}>Menu</p><nav className="mt-3 space-y-2"><SidebarButton icon={CircleHelp} label="Discussions" onClick={() => onNavigate('/scan')} className={palette.navIdle} /><SidebarButton icon={FlaskConical} label="Bibliothèque d'ingrédients" onClick={() => onNavigate('/ingredient-library')} className={palette.navIdle} /></nav></div>
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1"><p className={`px-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${palette.sidebarLabel}`}>Récent</p><div className="mt-3 space-y-2">{isHistoryLoading ? <p className={`rounded-xl border px-3 py-2.5 text-xs ${palette.recentCard} ${palette.recentMuted}`}>Chargement des discussions...</p> : recentDiscussions.length > 0 ? recentDiscussions.map((chat) => <button key={chat.id} type="button" onClick={() => onNavigate(`/scan?chat=${chat.id}`)} className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${palette.recentCard}`}><p className={`truncate text-sm font-medium ${palette.recentText}`}>{getChatDisplayName(chat.id, chat.productName, chat.customTitle)}</p><p className={`mt-1 text-sm ${palette.recentMuted}`}>{formatScanHistoryDate(chat.updatedAt || chat.createdAt)}</p>{chat.analysisSummary && <p className={`mt-2 line-clamp-2 text-sm leading-5 ${palette.recentMuted}`}>{normalizeDisplayText(chat.analysisSummary)}</p>}</button>) : <p className={`rounded-xl border px-3 py-2.5 text-xs leading-5 ${palette.recentCard} ${palette.recentMuted}`}>Aucune discussion pour le moment.</p>}</div></div>
      <div className={`mt-4 rounded-2xl p-4 text-center max-lg:mb-4 lg:p-3 xl:p-4 ${palette.premiumCard}`}><span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#f0a4db]/25 bg-transparent text-[#f3a6d6]">{planStatus === 'pro' ? <ShieldCheck className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}</span><h2 className={`mt-3 text-sm font-semibold ${palette.premiumTitle}`}>{planStatus === 'pro' ? 'Plan Pro actif' : 'Débloquer Premium'}</h2><p className={`text-sm leading-5 ${palette.premiumText}`}>{planStatus === 'pro' ? 'Votre abonnement premium est bien relié à votre compte.' : 'Obtenez des analyses plus poussées et des scans illimités.'}</p><button type="button" onClick={() => onNavigate('/pricing')} className={`mt-4 h-10 w-full rounded-xl text-sm font-semibold ${palette.premiumButton}`}>{planStatus === 'pro' ? "Voir l'offre" : 'Passer à Premium'}</button></div>
    </aside>
  );
}

function SidebarButton({ icon: Icon, label, onClick, className }: { icon: LucideIcon; label: string; onClick: () => void; className: string; }) {
  return <button type="button" onClick={onClick} className={`relative flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium transition ${className}`}><Icon className="h-5 w-5" />{label}</button>;
}

function SettingsCard({ title, description, children, palette }: { title: string; description: string; children: React.ReactNode; palette: Palette; }) {
  return <section className={`rounded-[28px] border p-5 sm:p-6 ${palette.card}`}><div className="mb-5"><h2 className={`text-xl font-semibold tracking-[-0.03em] ${palette.heading}`}>{title}</h2><p className={`mt-2 text-sm leading-6 ${palette.subtext}`}>{description}</p></div>{children}</section>;
}

function SettingsRow({ title, text, value, palette }: { title: string; text: string; value: string; palette: Palette; }) {
  return <div className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${palette.cardSoft}`}><div><h3 className={`text-sm font-semibold ${palette.heading}`}>{title}</h3><p className={`mt-1 text-sm leading-6 ${palette.subtext}`}>{text}</p></div><span className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${palette.cardSoft} ${palette.heading}`}>{value}</span></div>;
}

function ThemeButton({ active, label, icon: Icon, onClick, palette }: { active: boolean; label: string; icon: LucideIcon; onClick: () => void; palette: Palette; }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 ${active ? 'border-[#dca0dd] bg-[#f6f1ff] text-[#7a55ea]' : `${palette.cardSoft} ${palette.subtext}`}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#a56ae2]"><Icon className="h-5 w-5" /></span><span><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs opacity-70">{active ? 'Actif' : 'Cliquer pour activer'}</span></span></button>;
}
