import Image from "next/image";
import { Clock, TrendingUp, Crown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Avatar } from "@/components/Avatar";
import {
  getCurrentSeasonProgress,
  getSeasonHistory,
  getCurrentSeasonInfo,
  getSeasonTopPushers,
} from "@/lib/family";

export default async function PusheursPage() {
  const [current, history, season, pushers] = await Promise.all([
    getCurrentSeasonProgress(),
    getSeasonHistory(),
    getCurrentSeasonInfo(),
    getSeasonTopPushers(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Compétition"
        title="Pusheurs"
        description="Qui gagne le plus de trophées, saison après saison — le classement du push, pas des totaux."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-2">
                Saison en cours
              </p>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide">
                {season.label}
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground">
              <Clock size={16} className="text-primary-2" />
              {season.timeLeft}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
              <TrendingUp size={22} className="text-primary-2" />
              <div>
                <p className="text-xs text-muted">Trophées gagnés par la famille</p>
                <p className="text-sm font-bold text-foreground">{current.topClubTrophies}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
              <Crown size={18} className="text-primary-2" />
              <div>
                <p className="text-xs text-muted">Roi du push</p>
                <p className="text-sm font-bold text-foreground">
                  {current.topPlayer} <span className="text-primary-2">{current.topPlayerDelta}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
          <Crown size={20} className="mt-0.5 shrink-0 text-primary-2" />
          <p className="text-sm leading-relaxed text-muted">
            <span className="font-bold text-foreground">C&apos;est quoi le &quot;roi du push&quot; ?</span> Contrairement
            au classement des trophées cumulés, ici on ne regarde que la progression pendant la
            saison en cours — celui qui gagne le plus de trophées entre le début et maintenant.
            Repart à zéro à chaque nouvelle saison Brawl Stars (1er jeudi du mois), donc tout le
            monde a sa chance à chaque fois, peu importe son total all-time.
          </p>
        </div>

        <div className="mt-8">
          <Panel
            title={`Push de la saison — ${pushers.length} joueurs`}
            linkLabel="Voir le classement complet"
            linkHref="/classement"
          >
            <ul className="flex flex-col gap-0.5">
              {pushers.map((player) => (
                <li key={player.tag ?? player.rank} className="flex items-center gap-3 rounded-xl px-3 py-2">
                  <span className="w-6 text-sm font-bold text-muted">{player.rank}</span>
                  <Avatar name={player.name} color={player.color} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                    {player.name}
                    {player.club && (
                      <span className="ml-2 text-xs font-normal text-muted">{player.club}</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary-2">
                    <TrendingUp size={14} />
                    {player.trophies}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground">
            Saisons précédentes
          </h3>

          {!history ? (
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
              <Image src="/icons/world-adventureland.png" alt="" width={40} height={40} />
              <p className="text-sm text-muted">
                Aucune saison archivée pour l&apos;instant — la première sera enregistrée à la fin
                de la saison en cours.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="font-display text-base font-bold uppercase tracking-wide">
                    {s.label}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                    <Crown size={16} className="text-primary-2" />
                    {s.topPlayer}
                    <span className="text-primary-2">{s.topPlayerDelta}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
