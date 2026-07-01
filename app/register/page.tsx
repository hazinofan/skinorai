"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(name, email, password);
      router.push("/scan");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Inscription impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(165,120,255,0.18),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#fbfaff_100%)] px-4 py-28 text-[#111631]">
      <section className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <Image src="/logo.png" alt="SkinorAI" width={180} height={44} className="h-11 w-auto" priority />
          <h1 className="mt-10 text-4xl font-bold leading-tight sm:text-5xl">Creez votre compte</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[#66708f]">
            Lancez vos analyses skincare et gardez votre espace pret pour les prochains scans.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#e8e0fb] bg-white p-7 shadow-[0_24px_60px_rgba(90,66,165,0.10)]">
          <h2 className="text-2xl font-bold">Inscription</h2>
          <p className="mt-2 text-sm text-[#66708f]">Email + mot de passe ou Google.</p>

          <a
            href={`${API_BASE_URL}/api/auth/google`}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl border border-[#e4ddf7] bg-white text-sm font-semibold text-[#252044] transition hover:bg-[#faf7ff]"
          >
            Continuer avec Google
          </a>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-[#98a0bc]">
            <span className="h-px flex-1 bg-[#ebe7f7]" />
            OU
            <span className="h-px flex-1 bg-[#ebe7f7]" />
          </div>

          <label className="block text-sm font-semibold text-[#252044]">
            Nom
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#e1daf4] px-4 text-sm outline-none transition focus:border-[#8d60ef] focus:ring-4 focus:ring-[#efe7ff]"
              placeholder="Clara"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#252044]">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-[#e1daf4] px-4 text-sm outline-none transition focus:border-[#8d60ef] focus:ring-4 focus:ring-[#efe7ff]"
              placeholder="clara@email.com"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#252044]">
            Mot de passe
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              minLength={8}
              className="mt-2 h-12 w-full rounded-2xl border border-[#e1daf4] px-4 text-sm outline-none transition focus:border-[#8d60ef] focus:ring-4 focus:ring-[#efe7ff]"
              placeholder="8 caracteres minimum"
            />
          </label>

          {error && <p className="mt-4 rounded-2xl bg-[#fff7f8] px-4 py-3 text-sm font-medium text-[#c6405f]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-[#8d60ef] to-pink-300 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(116,69,232,0.24)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creation..." : "Creer mon compte"}
          </button>

          <p className="mt-5 text-center text-sm text-[#66708f]">
            Deja un compte ?{" "}
            <Link href="/login" className="font-semibold text-[#7b57ea]">
              Se connecter
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
