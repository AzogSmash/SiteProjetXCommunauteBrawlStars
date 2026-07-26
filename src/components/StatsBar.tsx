import { Users, TrendingUp } from "lucide-react";
import { StatItem } from "./StatItem";
import { TierIcon } from "./TierIcon";
import { TrophyIcon } from "./TrophyIcon";
import { MembersIcon } from "./MembersIcon";
import { SeasonClock } from "./SeasonClock";
import { PlayerLink } from "./PlayerLink";
import type { CommunityStats } from "@/lib/family";

const NOT_SYNCED = "Pas encore synchronisé";

export function StatsBar({
  stats,
  currentSeason,
  seasonTimeLeft,
}: {
  stats: CommunityStats | null;
  currentSeason: string | null;
  seasonTimeLeft: string | null;
}) {
  const items = [
    {
      icon: Users,
      iconNode: <TrophyIcon size={26} />,
      label: "Trophées totaux",
      value: stats ? stats.totalTrophies : "—",
      sub: stats ? `${stats.clubCount} CLUBS` : NOT_SYNCED,
      numeric: true,
    },
    {
      icon: Users,
      iconNode: <MembersIcon size={26} />,
      label: "Nombre de joueurs",
      value: stats ? String(stats.activePlayers) : "—",
      sub: "ACTIFS",
      numeric: true,
    },
    {
      icon: Users,
      iconNode: stats?.bestEloTier ? <TierIcon tier={stats.bestEloTier} size={26} /> : undefined,
      label: "Meilleur élo ranked",
      value: stats?.bestElo != null ? String(stats.bestElo) : "—",
      sub: stats?.bestEloTier ?? NOT_SYNCED,
      numeric: true,
    },
    {
      icon: TrendingUp,
      label: "Meilleur pusher",
      value: stats?.topPusher ? (
        <PlayerLink tag={stats.topPusher.tag}>{stats.topPusher.name}</PlayerLink>
      ) : (
        "—"
      ),
      sub: stats?.topPusher ? `${stats.topPusher.trophies} 🏆` : NOT_SYNCED,
    },
    {
      icon: Users,
      iconNode: <SeasonClock size={26} />,
      label: "Saison en cours",
      value: currentSeason ?? "—",
      sub: seasonTimeLeft ?? NOT_SYNCED,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6">
      {/* Cartes individuelles plutôt qu'une barre divisée : avec 5 items, le
          découpage sm:grid-cols-2 laissait le dernier tout seul sur sa
          ligne, mal aligné avec les traits de séparation (voir retour du
          21/07/2026 — "cases pas alignées"). */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
