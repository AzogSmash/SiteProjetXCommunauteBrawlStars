import { Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Avatar } from "@/components/Avatar";
import { TrophyIcon } from "@/components/TrophyIcon";
import { getPlayersLeaderboard } from "@/lib/family";

export default async function JoueursPage() {
  const players = await getPlayersLeaderboard();

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Joueurs"
        description="Classement de tous les membres actifs de Projet X par trophées."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <Panel title={`${players.length} joueurs classés`} linkLabel="Voir les clubs" linkHref="/clubs">
          <div className="flex items-center gap-3 border-b border-border px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span className="w-5">#</span>
            <span className="w-9" />
            <span className="flex-1">Joueur</span>
            <span className="hidden w-20 text-right sm:block">Élo</span>
            <span className="w-24 text-right">Trophées</span>
          </div>
          <ul className="flex flex-col gap-1 pt-1">
            {players.map((player) => (
              <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <span className="w-5 text-sm font-bold text-muted">{player.rank}</span>
                <Avatar name={player.name} color={player.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  {player.name}
                  {player.club && (
                    <span className="ml-2 text-xs font-normal text-muted">{player.club}</span>
                  )}
                </span>
                <span className="hidden w-20 items-center justify-end gap-1 text-right text-sm font-semibold text-foreground/90 sm:flex">
                  {player.elo !== undefined ? (
                    <>
                      <Zap size={12} className="text-primary-2" />
                      {player.elo}
                    </>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </span>
                <span className="flex w-24 items-center justify-end gap-1 text-right text-sm font-semibold text-foreground/90">
                  {player.trophies}
                  <TrophyIcon size={16} />
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
    </>
  );
}
