import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";
import { LogoMark } from "./Logo";
import { Avatar } from "./Avatar";
import { TierIcon } from "./TierIcon";
import { TrophyIcon } from "./TrophyIcon";
import { SeasonClock } from "./SeasonClock";
import type { FamilyClub, RankedPlayer } from "@/lib/family";

export function HeroHighlights({
  flagship,
  bestPlayer,
  currentSeason,
  seasonTimeLeft,
}: {
  flagship?: FamilyClub;
  bestPlayer?: RankedPlayer;
  currentSeason?: string;
  seasonTimeLeft?: string;
}) {
  return (
    <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        Aperçu de la famille
      </p>

      {flagship ? (
        <Link
          href="/clubs"
          className="card-elevated-hover flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-3 hover:border-primary/60"
        >
          <LogoMark size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{flagship.name}</p>
            <p className="text-xs text-muted">Club phare · {flagship.memberCount} membres</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground/90">
            <TrophyIcon size={16} />
            {flagship.trophies}
          </div>
          <ChevronRight size={16} className="text-muted" />
        </Link>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
          <Shield size={18} className="shrink-0 text-muted" />
          <p className="flex-1 text-sm text-muted">Clubs pas encore synchronisés</p>
        </div>
      )}

      {bestPlayer ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
          <Avatar name={bestPlayer.name} color={bestPlayer.color} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{bestPlayer.name}</p>
            <p className="text-xs text-muted">Meilleur élo ranked · {bestPlayer.tier}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground/90">
            <TierIcon tier={bestPlayer.tier} size={20} />
            {bestPlayer.elo}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
          <Shield size={18} className="shrink-0 text-muted" />
          <p className="flex-1 text-sm text-muted">Classement pas encore synchronisé</p>
        </div>
      )}

      {currentSeason ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary-2/10 text-primary-2">
            <Shield size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">{currentSeason}</p>
            <p className="text-xs text-muted">Saison en cours</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground/90">
            <SeasonClock size={16} />
            {seasonTimeLeft}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
          <Shield size={18} className="shrink-0 text-muted" />
          <p className="flex-1 text-sm text-muted">Saison pas encore synchronisée</p>
        </div>
      )}
    </div>
  );
}
