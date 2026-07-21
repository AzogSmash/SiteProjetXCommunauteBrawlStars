import { Users, TrendingUp, Shield } from "lucide-react";
import { StatItem } from "./StatItem";
import { TierIcon } from "./TierIcon";
import { TrophyIcon } from "./TrophyIcon";

export function StatsBar({
  totalTrophies,
  activePlayers,
  bestElo,
  bestEloTier,
  clubCount,
  topPusher,
  currentSeason,
  seasonTimeLeft,
}: {
  totalTrophies: string;
  activePlayers: number;
  bestElo: number;
  bestEloTier: string;
  clubCount: number;
  topPusher: { name: string; trophies: string };
  currentSeason: string;
  seasonTimeLeft: string;
}) {
  const items = [
    {
      icon: Users,
      iconNode: <TrophyIcon size={26} />,
      label: "Trophées totaux",
      value: totalTrophies,
      sub: `${clubCount} CLUBS`,
      numeric: true,
    },
    {
      icon: Users,
      label: "Nombre de joueurs",
      value: String(activePlayers),
      sub: "ACTIFS",
      numeric: true,
    },
    {
      icon: Users,
      iconNode: <TierIcon tier={bestEloTier} size={26} />,
      label: "Meilleur élo ranked",
      value: String(bestElo),
      sub: bestEloTier,
      numeric: true,
    },
    {
      icon: TrendingUp,
      label: "Meilleur pusher",
      value: topPusher.name,
      sub: `${topPusher.trophies} 🏆`,
    },
    {
      icon: Shield,
      label: "Saison en cours",
      value: currentSeason,
      sub: seasonTimeLeft,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6">
      {/* Cartes individuelles plutôt qu'une barre divisée : avec 5 items, le
          découpage sm:grid-cols-2 laissait le dernier tout seul sur sa
          ligne, mal aligné avec les traits de séparation (voir retour du
          21/07/2026 — "cases pas alignées"). */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
