"use client";

import { Languages } from "lucide-react";
import { locales, useI18n, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
};

export default function LanguageSwitcher({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-[#ece7e3] bg-white/85 p-1 text-[#171717] shadow-sm backdrop-blur-xl ${className}`}
      aria-label={t("language.label")}
    >
      {!compact && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b5cf6]">
          <Languages className="h-4 w-4" />
        </span>
      )}

      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
            locale === item
              ? "bg-[#17151c] text-white shadow-sm"
              : "text-[#5f5666] hover:bg-[#f6f3ef]"
          }`}
          aria-pressed={locale === item}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
