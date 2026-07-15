"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Globe2,
  Heart,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { API_BASE_URL, useAuth } from "@/components/AuthProvider";

const benefits = [
  {
    icon: Sparkles,
    title: "Analyse intelligente",
    text: "IA avancee basee sur la science",
  },
  {
    icon: ShieldCheck,
    title: "Securite avant tout",
    text: "Vos donnees sont privees et protegees",
  },
  {
    icon: Heart,
    title: "Resultats personnalises",
    text: "Adaptes a vos objectifs de peau",
  },
];

type AuthMode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { isReady, user, login, register } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (authMode === "register") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      router.push("/scan");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : authMode === "register"
            ? "Inscription impossible."
            : "Connexion impossible.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setAuthMode(nextMode);
    setError("");
    setShowPassword(false);
  };

  useEffect(() => {
    if (isReady && user) {
      router.replace("/scan");
    }
  }, [isReady, router, user]);

  if (!isReady || user) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#fbf8ff] px-4 text-center text-sm font-semibold text-[#65708a]">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-svh overflow-x-hidden bg-[#fbf8ff] text-[#101a35] lg:h-svh lg:overflow-hidden">
      <div className="grid min-h-svh lg:h-svh lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(500px,1fr)]">
        <section className="relative min-h-[500px] overflow-hidden bg-[#f8efe5] px-5 py-6 hidden lg:block sm:min-h-[560px] sm:px-10 lg:h-svh lg:min-h-0 lg:px-10 xl:px-14">
          <Image
            src="/login.png"
            alt="Produits skincare SkinorAI sur une coiffeuse lumineuse"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.68),rgba(255,255,255,0.18)_54%,rgba(255,255,255,0.05))]" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent" />

          <div className="relative z-10 flex h-full min-h-[452px] flex-col sm:min-h-[512px] lg:h-full lg:min-h-0">
            <Link href="/" className="inline-flex w-fit items-center">
              <Image
                src="/logo.png"
                alt="SkinorAI"
                width={190}
                height={46}
                className="h-9 w-auto sm:h-10 xl:h-11"
                priority
              />
            </Link>

            <div className="my-auto max-w-[620px] pt-2 lg:pb-16 lg:pt-10 xl:pb-24">
              <h1 className="text-[30px] font-medium leading-[1.03] text-[#101a35] min-[380px]:text-[34px] sm:text-[42px] xl:text-[50px]">
                Comprenez vos produits.
                <br />
                <span className="text-[#8e54ff]">Prenez soin</span> de votre
                peau.
              </h1>

              <div className="mt-5 space-y-3.5 sm:mt-7">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div key={benefit.title} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1e4ff] text-[#8a50ff] shadow-[0_12px_28px_rgba(130,83,255,0.12)] sm:h-11 sm:w-11">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-[#101a35]">
                          {benefit.title}
                        </h2>
                        <p className="mt-0.5 text-xs font-medium text-[#4f5b77]">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-0 mt-6 max-w-full rounded-full border border-white/70 bg-white/72 px-4 py-2.5 shadow-[0_18px_46px_rgba(58,48,42,0.12)] backdrop-blur-xl sm:w-fit sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/people.png"
                  alt="Utilisateurs SkinorAI"
                  width={132}
                  height={54}
                  className="h-9 w-auto"
                />
                <div className="min-w-0">
                  <div className="flex gap-0.5 text-[#f5b117]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1 text-xs font-medium leading-snug text-[#5b6379]">
                    +12k utilisateurs nous font confiance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:h-svh lg:min-h-0 lg:px-8 lg:py-4 xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_12%,rgba(255,255,255,0.96),transparent_30%),radial-gradient(circle_at_88%_92%,rgba(177,125,255,0.28),transparent_34%),linear-gradient(135deg,#ffffff_0%,#fbf8ff_46%,#f4ebff_100%)]" />
          <div className="absolute right-10 top-28 hidden grid-cols-4 gap-4 text-[#b489ff] opacity-60 lg:grid">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} className="h-1.5 w-1.5 rounded-full bg-current" />
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-[-8rem] right-[-4rem] hidden h-[470px] w-[250px] rotate-12 rounded-[50%] border border-[#b38cff]/35 lg:block" />
          <div className="pointer-events-none absolute bottom-10 right-2 hidden h-[380px] w-[170px] -rotate-12 rounded-[50%] border border-[#b38cff]/35 lg:block" />

          {/* <button
            type="button"
            className="absolute right-4 top-4 z-10 inline-flex h-10 items-center gap-2 rounded-full border border-[#dcd7e8] bg-white/70 px-4 text-xs font-bold text-[#111a34] shadow-[0_12px_32px_rgba(96,72,141,0.08)] backdrop-blur sm:right-8 sm:text-sm"
          >
            <Globe2 className="h-4 w-4" />
            Francais
            <ChevronDown className="h-4 w-4" />
          </button> */}

          <form
            onSubmit={handleSubmit}
            className="relative z-10 my-12 w-full max-w-[520px] rounded-[24px] border border-white/72 bg-white/84 px-5 py-6 shadow-[0_28px_80px_rgba(77,64,106,0.13)] backdrop-blur-2xl sm:rounded-[30px] sm:px-8 lg:my-0 xl:px-10"
          >
            <div className="text-center">
              <h2 className="inline-flex items-center justify-center gap-2 text-[30px] font-semibold leading-none text-[#101a35] sm:text-[38px]">
                Bienvenue
                {/* <Sparkles
                  aria-hidden="true"
                  className="h-6 w-6 text-[#8e54ff] sm:h-7 sm:w-7"
                /> */}
              </h2>
              <p className="mt-2.5 text-sm font-medium text-[#65708a]">
                {authMode === "register"
                  ? "Creez votre compte SkinorAI"
                  : "Connectez-vous a votre compte SkinorAI"}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 border-b border-[#dfe2ea] text-center text-sm font-semibold">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`border-b-2 pb-3 cursor-pointer transition ${authMode === "login"
                  ? "border-[#7c3cff] text-[#7c3cff]"
                  : "border-transparent text-[#536079] hover:text-[#7c3cff]"
                  }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`border-b-2 pb-3 cursor-pointer transition ${authMode === "register"
                  ? "border-[#7c3cff] text-[#7c3cff]"
                  : "border-transparent text-[#536079] hover:text-[#7c3cff]"
                  }`}
              >
                Creer un compte
              </button>
            </div>

            {authMode === "register" && (
              <div className="mt-5">
                <label
                  htmlFor="register-name"
                  className="text-sm font-semibold text-[#3f4b64]"
                >
                  Nom complet
                </label>
                <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#dfe3ed] bg-white px-4 transition focus-within:border-[#9b6dff] focus-within:ring-4 focus-within:ring-[#efe7ff]">
                  <Sparkles className="h-5 w-5 shrink-0 text-[#536079]" />
                  <input
                    id="register-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required={authMode === "register"}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#101a35] outline-none placeholder:text-[#9aa3b5]"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            )}

            <div className={authMode === "register" ? "mt-4" : "mt-5"}>
              <label
                htmlFor="login-email"
                className="text-sm font-semibold text-[#3f4b64]"
              >
                Adresse e-mail
              </label>
              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#dfe3ed] bg-white px-4 transition focus-within:border-[#9b6dff] focus-within:ring-4 focus-within:ring-[#efe7ff]">
                <Mail className="h-5 w-5 shrink-0 text-[#536079]" />
                <input
                  id="login-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#101a35] outline-none placeholder:text-[#9aa3b5]"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-[#3f4b64]"
                >
                  Mot de passe
                </label>
                {authMode === "login" && (
                  <button
                    type="button"
                    className="text-xs font-bold text-[#7c3cff]"
                  >
                    Mot de passe oublie ?
                  </button>
                )}
              </div>
              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#dfe3ed] bg-white px-4 transition focus-within:border-[#9b6dff] focus-within:ring-4 focus-within:ring-[#efe7ff]">
                <LockKeyhole className="h-5 w-5 shrink-0 text-[#536079]" />
                <input
                  id="login-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#101a35] outline-none placeholder:text-[#9aa3b5]"
                  placeholder={
                    authMode === "register"
                      ? "8 caracteres minimum"
                      : "Votre mot de passe"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                  className="shrink-0 rounded-full p-1 text-[#536079] transition hover:bg-[#f4f0ff] hover:text-[#7c3cff]"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl bg-[#fff4f6] px-4 py-3 text-sm font-semibold text-[#c6405f]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#7e34f5] to-[#b14df2] text-sm font-bold text-white shadow-[0_18px_40px_rgba(126,52,245,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting
                ? authMode === "register"
                  ? "Creation..."
                  : "Connexion..."
                : authMode === "register"
                  ? "Creer mon compte"
                  : "Se connecter"}
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="my-5 flex items-center gap-3 text-center text-xs font-medium text-[#65708a] sm:text-sm">
              <span className="h-px flex-1 bg-[#dfe3ed]" />
              <span className="shrink-0">authentification OAuth</span>
              <span className="h-px flex-1 bg-[#dfe3ed]" />
            </div>

            <a
              href={`${API_BASE_URL}/api/auth/google`}
              className="flex min-h-12 w-full flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#dcd7e8] bg-white px-4 py-3 text-sm font-bold text-[#111a34] shadow-sm transition hover:-translate-y-0.5 sm:text-base"
            >
              <svg width="34px" height="24px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
              Continuer avec Google
              <ArrowRight className="h-5 w-5" />
            </a>

            <div className="mx-auto mt-5 flex w-fit max-w-full items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff6ec] text-[#2fa574]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#536079]">
                  Connexion securisee
                </p>
                <p className="mt-1 text-xs font-medium text-[#65708a]">
                  Vos donnees sont chiffrees et protegees
                </p>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
