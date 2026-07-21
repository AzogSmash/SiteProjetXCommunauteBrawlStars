import { Crown, Gauge, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Avatar } from "@/components/Avatar";
import { StatItem } from "@/components/StatItem";
import { TierIcon } from "@/components/TierIcon";
import { getRankedLeaderboard } from "@/lib/family";
import { tierColorClass } from "@/lib/tiers";

const crownColor: Record<number, string> = {
  1: "#facc15",
  2: "#d1d5db",
  3: "#c2833f",
};

export default async function RankedPage() {
  const players = await getRankedLeaderboard();
  const bestElo = players[0]?.elo ?? 0;
  const bestEloTier = players[0]?.tier ?? "";
  const avgElo = players.length
    ? Math.round(players.reduce((sum, p) => sum + p.elo, 0) / players.length)
    : 0;

  return (
    <>
      <PageHeader
        eyebrow="Compétitif"
        title="Ranked"
        description="Classement élo complet des joueurs de Projet X en mode classé."
      />

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <StatItem icon={Users} iconNode={<TierIcon tier={bestEloTier} size={26} />} label="Meilleur élo" value={String(bestElo)} sub={bestEloTier} numeric />
          <StatItem icon={Gauge} label="Élo moyen" value={String(avgElo)} sub={`DU TOP ${players.length}`} numeric />
          <StatItem icon={Users} label="Joueurs classés" value={String(players.length)} sub="EN RANKED" numeric />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-6 pb-14">
        <Panel title="Classement des meilleurs élo" linkLabel="Voir les clubs" linkHref="/clubs">
          <ul className="flex flex-col gap-0.5">
            {players.map((player) => (
              <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2">
                <span className="flex w-5 justify-center">
                  {player.rank <= 3 ? (
                    <Crown size={15} color={crownColor[player.rank]} fill={crownColor[player.rank]} />
                  ) : (
                    <span className="text-sm font-bold text-muted">{player.rank}</span>
                  )}
                </span>
                <Avatar name={player.name} color={player.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  {player.name}
                  {player.club && (
                    <span className="ml-2 text-xs font-normal text-muted">{player.club}</span>
                  )}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(player.tier)}`}>
                  {player.tier}
                </span>
                <TierIcon tier={player.tier} size={20} />
                <span className="w-12 text-right text-sm font-semibold text-foreground/90">
                  {player.elo}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
    </>
  );
}
