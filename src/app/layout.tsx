import type { Metadata } from "next";
import { Geist, Syncopate, Lilita_One } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${syncopate.variable} ${lilitaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="bg-grid flex flex-1 flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
