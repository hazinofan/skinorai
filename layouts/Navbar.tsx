import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const navItems = [
  { label: "Comment ca marche", href: "#how-it-works" },
  { label: "Fonctionnalites", href: "#features" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "A propos", href: "#about" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <nav className="mx-auto flex h-[78px] w-full max-w-[1600px] items-center justify-between px-4 sm:h-[84px] sm:px-6 md:px-8 lg:h-[92px] lg:px-12 xl:px-16 2xl:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SkinorAI Logo"
            width={168}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Center Links */}
        <div className="hidden items-center gap-7 lg:flex xl:gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#5f5d6b] transition hover:text-[#151522]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-[#5f5d6b] transition hover:text-[#151522] md:block"
          >
            Connexion
          </Link>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#b27cff] via-[#946bff] to-[#7f64ff] px-3 py-2 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(143,109,255,0.28)] transition hover:-translate-y-0.5 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-sm lg:px-5 lg:py-3"
          >
            Demarrer le scan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
