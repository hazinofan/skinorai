"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { formatMessage, useI18n } from "@/lib/i18n";

const navItems = [
  // { label: "Comment ca marche", href: "#how-it-works" },
  { labelKey: "nav.products", href: "/products" },
  { labelKey: "nav.ingredients", href: "/ingredient-library" },
  { labelKey: "nav.pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isReady, user, logout } = useAuth();
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHiddenByPage, setIsHiddenByPage] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const displayName = user?.name?.trim() || user?.email || "Compte";
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMenuOpen(false);
      setIsMobileNavOpen(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 16);
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrollState);
    };
  }, []);

  useEffect(() => {
    const syncHiddenState = () => {
      setIsHiddenByPage(document.body.dataset.navbarHidden === "true");
    };

    syncHiddenState();

    const observer = new MutationObserver(syncHiddenState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-navbar-hidden"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen && !isMobileNavOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsideAccountMenu = !menuRef.current?.contains(target);
      const clickedOutsideMobileNav = !mobileNavRef.current?.contains(target);

      if (isMenuOpen && clickedOutsideAccountMenu) {
        setIsMenuOpen(false);
      }

      if (isMobileNavOpen && clickedOutsideMobileNav) {
        setIsMobileNavOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, isMobileNavOpen]);

  if (pathname === "/login" || isHiddenByPage) {
    return null;
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <nav
        className={`relative flex h-[72px] w-full items-center justify-between border-b px-4 transition-all duration-300 sm:px-6 lg:px-28 ${
          isScrolled
            ? "border-black/5 bg-white/50 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SkinorAI"
            width={168}
            height={40}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className="text-sm font-medium text-[#2b2b2b] transition hover:text-black"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ece7e3] bg-white/85 text-[#171717] transition hover:bg-[#f6f3ef] lg:hidden"
            aria-label={isMobileNavOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-navbar-menu"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/scan"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c8a4ff] via-[#b986ff] to-[#9f72f2] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(155,108,241,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(155,108,241,0.34)] sm:px-5"
          >
            <span className="hidden sm:inline">{t("nav.scanCta")}</span>
            <span className="sm:hidden">{t("nav.scanShort")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {isReady && user ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="inline-flex cursor-pointer h-11 w-11 items-center justify-center rounded-full border border-[#ece7e3] bg-[#f6f3ef] text-[#171717] transition hover:bg-[#efebe6]"
                aria-label={formatMessage(t("nav.account"), { name: displayName })}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
              >
                <UserRound className="h-5 w-5" />
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+12px)] w-[290px] rounded-[28px] border border-[#efebe7] bg-[#fbf9f6] p-3 shadow-[0_24px_65px_rgba(15,23,42,0.14)] transition-all ${isMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
                role="menu"
              >
                <div className="flex items-center gap-3 rounded-full bg-white px-3 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b585ff] to-[#8b5cf6] text-sm font-bold text-white">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#18181b]">{displayName}</p>
                    <p className="truncate text-xs text-[#6b7280]">{user.email}</p>
                  </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-[22px] border border-[#efebe7] bg-white">
                  <button
                    type="button"
                    onClick={() => { router.push("/settings"); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#262626] transition hover:bg-[#f6f3ef]"
                    role="menuitem"
                  >
                    <Settings className="h-4 w-4 text-[#555]" />
                    {t("nav.settings")}
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 border-t border-[#f1ede8] px-4 py-3 text-left text-sm font-medium text-[#262626] transition hover:bg-[#f6f3ef]"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 text-[#555]" />
                    {t("nav.logout")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1f1f]"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>

        <div
          id="mobile-navbar-menu"
          ref={mobileNavRef}
          className={`absolute left-4 right-4 top-[calc(100%+12px)] rounded-[28px] border border-[#efebe7] bg-[#fbf9f6]/95 p-3 shadow-[0_24px_65px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all lg:hidden ${
            isMobileNavOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-[22px] border border-[#efebe7] bg-white">
            {navItems.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-[#262626] transition hover:bg-[#f6f3ef]"
              >
                <span>{t(item.labelKey)}</span>
                <ArrowRight className="h-4 w-4 text-[#8b5cf6]" />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
