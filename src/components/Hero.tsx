import Link from "next/link";
import { ChevronsRight, BarChart3 } from "lucide-react";
import { HeroHighlights } from "./HeroHighlights";
import { BrandCorner } from "./BrandCorner";
import type { FamilyClub, RankedPlayer } from "@/lib/family";

export function Hero({
  flagship,
  bestPlayer,
  currentSeason,
  seasonTimeLeft,
}: {
  flagship: FamilyClub;
  bestPlayer: RankedPlayer;
  currentSeason: string;
  seasonTimeLeft: string;
}) {
  return (
    <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 overflow-hidden px-6 py-14 lg:grid-cols-2 lg:py-16">
      <div className="glow-spot -left-24 -top-32 h-80 w-80 bg-primary/25" />
      <div className="glow-spot -right-32 top-10 h-96 w-96 bg-primary-2/20" />

      <BrandCorner className="absolute left-2 top-2 hidden sm:block" />
      <BrandCorner className="absolute right-2 top-2 hidden rotate-90 sm:block" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-2">
            Bienvenue sur
          </p>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted">
            Est. 2026
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
          Projet <span className="text-gradient-primary">X</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          Regroupe, analyse et compare les performances de notre communauté de
          clubs Brawl Stars.
        </p>
        <p className="mt-3 font-display text-xs tracking-[0.3em] text-muted/70">
          Built different.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/clubs"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(113,54,186,0.35)] transition-transform hover:scale-[1.03]"
          >
            <ChevronsRight size={18} />
            Découvrir les clubs
          </Link>
          <Link
            href="/classement"
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
          >
            <BarChart3 size={18} />
            Voir le classement
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        <HeroHighlights
          flagship={flagship}
          bestPlayer={bestPlayer}
          currentSeason={currentSeason}
          seasonTimeLeft={seasonTimeLeft}
        />
      </div>
    </section>
  );
}
