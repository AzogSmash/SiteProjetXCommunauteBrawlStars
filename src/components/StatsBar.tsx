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
      <div className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-surface sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
        {items.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
