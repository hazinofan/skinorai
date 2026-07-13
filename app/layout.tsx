import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/layouts/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import Footer from "@/layouts/Footer";
import { I18nProvider } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SkinorAI",
  description: "Analyse de peau par IA et recommandations skincare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${manrope.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col"
      >
        <I18nProvider>
          <AuthProvider>
            <Navbar />

            <div className="flex flex-1 flex-col">
              {children}
            </div>

            <Footer />
            <LanguageSwitcher compact className="fixed bottom-4 right-4 z-[120]" />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
