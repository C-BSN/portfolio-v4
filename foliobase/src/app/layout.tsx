import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio - Graphiste Freelance",
    template: "%s | Portfolio"
  },
  description: "Portfolio de graphiste freelance. Découvrez mes créations en design graphique, identité visuelle, web design et plus encore.",
  keywords: ["graphiste", "freelance", "design", "identité visuelle", "web design", "portfolio"],
  authors: [{ name: "Portfolio" }],
  creator: "Portfolio",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://portfolio.com",
    title: "Portfolio - Graphiste Freelance",
    description: "Découvrez mes créations en design graphique, identité visuelle, web design et plus encore.",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Graphiste Freelance",
    description: "Découvrez mes créations en design graphique, identité visuelle, web design et plus encore.",
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
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
