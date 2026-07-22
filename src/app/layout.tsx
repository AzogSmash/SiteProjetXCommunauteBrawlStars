import type { Metadata } from "next";
import { Geist, Syncopate, Lilita_One } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BsLinkModal } from "@/components/BsLinkModal";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { getAccessContext } from "@/lib/access";
import { isBotReachable } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Police officielle du jeu — utilisée uniquement pour les chiffres de stats
// (trophées, élo...), pas pour le logotype de marque (qui reste Syncopate).
const lilitaOne = Lilita_One({
  variable: "--font-lilita",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Projet X — Communauté Brawl Stars",
  description:
    "Regroupe, analyse et compare les performances de notre communauté de clubs Brawl Stars.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [access, botReachable] = await Promise.all([getAccessContext(), isBotReachable()]);
  const shouldShowBsLinkPrompt = access.loggedIn && access.inGuild && !access.bsLinked;

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${syncopate.variable} ${lilitaOne.variable} h-full antialiased`}
    >
      <body className="bg-grid min-h-full bg-background text-foreground">
        {/* Le footer suivait avant un bloc forcé à flex-1 (stretch jusqu'en
            bas du viewport) : sur les pages courtes (ex: /clubs), ça
            laissait un grand vide entre le contenu réel et le footer (retour
            du 21/07/2026 — "ça fait vide"). Flux normal maintenant : le
            footer suit directement le contenu, comme sur n'importe quel
            site. bg-grid posé sur <body> plutôt que sur ce div pour que le
            motif couvre aussi l'espace sous le footer si jamais le contenu
            est plus court que le viewport. */}
        {!botReachable && <DemoDataBanner />}
        <Navbar />
        {children}
        <Footer />
        <BsLinkModal shouldShow={shouldShowBsLinkPrompt} />
      </body>
    </html>
  );
}
