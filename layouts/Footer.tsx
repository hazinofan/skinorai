"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatMessage, useI18n } from "@/lib/i18n";

const hiddenFooterRoutes = new Set([
  "/login",
  "/register",
  "/auth/callback",
  "/scan",
  "/ingredient-library",
]);

const navigationLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.products", href: "/products" },
  { labelKey: "nav.ingredients", href: "/ingredient-library" },
  { labelKey: "nav.pricing", href: "/pricing" },
];

const productLinks = [
  { labelKey: "footer.scan", href: "/scan" },
  { labelKey: "footer.productsLibrary", href: "/products" },
  { labelKey: "footer.ingredientsLibrary", href: "/ingredient-library" },
];

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();

  const normalizedPathname = pathname
    ? pathname.replace(/\/$/, "") || "/"
    : "/";

  if (hiddenFooterRoutes.has(normalizedPathname)) {
    return null;
  }

  return (
    <footer className="relative z-30 shrink-0 overflow-hidden border-t border-[#eadff0] bg-[#fdf7ff] text-[#261d2c]">
      <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-[#d9c1ff]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#f2cce2]/25 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
        <div className="grid gap-10 border-b border-[#e9deee] pb-9 md:grid-cols-[1.2fr_0.65fr_0.8fr] md:gap-12">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="SkinorAI"
                width={250}
                height={136}
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6f6277]">
              {t("footer.description")}
            </p>

            <Link
              href="/scan"
              className="group mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2b2430] px-5 text-xs font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#17131b]"
            >
              {t("footer.scan")}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6fc7]">
              {t("footer.navigation")}
            </p>

            <nav className="mt-4 flex flex-col items-start gap-2.5">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#75687c] transition duration-200 hover:translate-x-0.5 hover:text-[#2c2132]"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6fc7]">
              SkinorAI
            </p>

            <nav className="mt-4 flex flex-col items-start gap-2.5">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#75687c] transition duration-200 hover:translate-x-0.5 hover:text-[#2c2132]"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-6 text-[11px] leading-5 text-[#918598] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {formatMessage(t("footer.rights"), {
              year: new Date().getFullYear(),
            })}
          </p>

          <p className="max-w-lg sm:text-right">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
