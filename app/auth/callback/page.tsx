"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function CallbackShell() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaff] px-4 text-[#111631]">
      <div className="rounded-[28px] border border-[#e8e0fb] bg-white px-8 py-7 text-center shadow-[0_24px_60px_rgba(90,66,165,0.10)]">
        <h1 className="text-2xl font-bold">Connexion Google en cours...</h1>
        <p className="mt-2 text-sm text-[#66708f]">Nous preparons votre espace SkinorAI.</p>
      </div>
    </main>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (!token || !email) {
      router.replace("/login");
      return;
    }

    completeOAuthLogin(token, {
      name: name || email.split("@")[0],
      email,
    });
    router.replace("/scan");
  }, [completeOAuthLogin, router, searchParams]);

  return <CallbackShell />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackShell />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
