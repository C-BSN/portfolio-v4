import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/footer-cyberpunk.css";
import { HeaderManga } from "@/components/layout/header-manga";
import { FooterManga } from "@/components/layout/footer-manga";
import { SmoothScroll } from "@/components/manga";
import { GlobalEffectsWrapper } from "@/components/GlobalEffectsWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Corentin Basson - Portfolio Créatif",
    template: "%s | Corentin Basson"
  },
  description: "Corentin Basson - Portfolio créatif et artistique. Découvrez mes créations en design graphique, identité visuelle, photographie et plus encore.",
  keywords: ["CBSN", "PICS", "portfolio", "créatif", "design", "photographie", "identité visuelle", "art"],
  authors: [{ name: "Corentin Basson" }],
  creator: "Corentin Basson",
  icons: {
    icon: "/Logo%20CBSN%20v3.png",
    shortcut: "/Logo%20CBSN%20v3.png",
    apple: "/Logo%20CBSN%20v3.png"
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cbsn-pics.com",
    title: "Corentin Basson - Portfolio Créatif",
    description: "Découvrez mes créations en design graphique, identité visuelle, photographie et plus encore.",
    siteName: "Corentin Basson",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corentin Basson - Portfolio Créatif",
    description: "Découvrez mes créations en design graphique, identité visuelle, photographie et plus encore.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#050505] text-[#F0F0F0]">
        <GlobalEffectsWrapper />
        <SmoothScroll>
          <HeaderManga />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <FooterManga />
        </SmoothScroll>
      </body>
    </html>
  );
}
