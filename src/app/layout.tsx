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
  metadataBase: new URL("https://cbsn-pics.com"),
  title: {
    default: "Corentin Basson - Portfolio Créatif",
    template: "%s | Corentin Basson",
  },
  description:
    "Corentin Basson — Portfolio créatif. Design graphique, identité visuelle, photographie et direction artistique.",
  keywords: [
    "Corentin Basson",
    "CBSN",
    "portfolio",
    "design graphique",
    "identité visuelle",
    "photographie",
    "direction artistique",
    "créatif",
  ],
  authors: [{ name: "Corentin Basson", url: "https://cbsn-pics.com" }],
  creator: "Corentin Basson",
  icons: {
    icon: "/logo-cbsn-v4.png",
    shortcut: "/logo-cbsn-v4.png",
    apple: "/logo-cbsn-v4.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "Corentin Basson - Portfolio Créatif",
    description:
      "Design graphique, identité visuelle, photographie et direction artistique.",
    siteName: "Corentin Basson",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corentin Basson - Portfolio Créatif",
    description:
      "Design graphique, identité visuelle, photographie et direction artistique.",
    creator: "@cbsn_pics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <Providers>
          <GlobalEffectsWrapper />
          <SmoothScroll>
            <HeaderManga />
            <main className="flex-1 relative z-10">{children}</main>
            <FooterManga />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
