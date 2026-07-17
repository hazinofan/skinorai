import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/layouts/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import Footer from "@/layouts/Footer";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
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
          <ThemeProvider>
            <AuthProvider>
              <Navbar />

              <div className="flex flex-1 flex-col">
                {children}
              </div>

              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
