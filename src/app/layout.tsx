import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/footer-cyberpunk.css";
import { HeaderManga } from "@/components/layout/header-manga";
import { FooterManga } from "@/components/layout/footer-manga";
import { SmoothScroll } from "@/components/manga";
import { GlobalEffectsWrapper } from "@/components/GlobalEffectsWrapper";
import { Providers } from "@/components/Providers";

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
    icon: "/logo-cbsn-v4.png",
    shortcut: "/logo-cbsn-v4.png",
    apple: "/logo-cbsn-v4.png"
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
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <GlobalEffectsWrapper />
          <SmoothScroll>
            <HeaderManga />
            <main className="flex-1 relative z-10">
              {children}
            </main>
            <FooterManga />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
