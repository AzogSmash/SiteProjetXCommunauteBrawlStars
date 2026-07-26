"use client";

import { useState } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { Avatar } from "./Avatar";
import { TierIcon } from "./TierIcon";
import { PlayerLink } from "./PlayerLink";
import { DataUnavailable } from "./DataUnavailable";
import { tierColorClass, tierAbbreviation } from "@/lib/tiers";
import { formatNumber, colorFromSeed } from "@/lib/format";
import type { ClubRanking } from "@/lib/family";

const TABS = [
  { id: "ranked", label: "Ranked" },
  { id: "ranked-all-time", label: "Ranked all-time" },
  { id: "1v1", label: "1v1" },
  { id: "casino", label: "Casino" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const crownColor: Record<number, string> = { 1: "#facc15", 2: "#d1d5db", 3: "#c2833f" };

function Rank({ rank }: { rank: number }) {
  return (
    <span className="flex w-5 justify-center">
      {rank <= 3 ? (
        <Crown size={15} color={crownColor[rank]} fill={crownColor[rank]} />
      ) : (
        <span className="text-sm font-bold text-muted">{rank}</span>
      )}
    </span>
  );
}

// N'a de sens que pour 1v1/casino (fonctionnalités internes au Discord, liées
// à un compte lié) — pour ranked/trophées, les données viennent du tag BS
// directement, un membre manquant veut dire "pas encore synchronisé", pas
// "compte pas lié". Deux messages différents pour ne pas raconter n'importe quoi.
function UnresolvedSection({
  unresolved,
  needsLink,
}: {
  unresolved: { tag: string; name: string; color: string }[];
  needsLink: boolean;
}) {
  if (unresolved.length === 0) return null;
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
        Classement indéterminé
      </p>
      <p className="mb-2 px-3 text-xs text-muted">
        {needsLink
          ? "Connecte-toi sur le site avec Discord et lie ton compte Brawl Stars à ton profil Projet X pour apparaître ici."
          : "Pas encore de données pour ces membres."}
      </p>
      <ul className="flex flex-col gap-0.5">
        {unresolved.map((m) => (
          <li key={m.tag} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
            <span className="w-5 text-sm font-bold text-muted">—</span>
            <Avatar name={m.name} color={m.color} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/60">
              <PlayerLink tag={m.tag}>{m.name}</PlayerLink>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ClubRankingTabs({ ranking }: { ranking: ClubRanking }) {
  const [active, setActive] = useState<TabId>("ranked");

  return (
    <div className="card-elevated relative rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Classement du club</h2>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                active === tab.id
                  ? "bg-gradient-to-r from-primary to-primary-2 text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {active === "ranked" && (
        <>
          {ranking.ranked.entries.length === 0 && ranking.ranked.unresolved.length === 0 && (
            <DataUnavailable message="Classement ranked pas encore synchronisé." />
          )}
          <ul className="flex flex-col gap-0.5">
            {ranking.ranked.entries.map((p) => (
              <li key={p.tag} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(p.tier)}`}>
                  <span className="hidden sm:inline">{p.tier}</span>
                  <span className="sm:hidden">{tierAbbreviation(p.tier)}</span>
                </span>
                <TierIcon tier={p.tier} size={20} />
                <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.elo}</span>
              </li>
            ))}
          </ul>
          <UnresolvedSection unresolved={ranking.ranked.unresolved} needsLink={false} />
        </>
      )}

      {active === "ranked-all-time" && (
        <>
          {ranking.rankedAllTime.entries.length === 0 && ranking.rankedAllTime.unresolved.length === 0 && (
            <DataUnavailable message="Pas encore de records synchronisés." />
          )}
          <ul className="flex flex-col gap-0.5">
            {ranking.rankedAllTime.entries.map((p) => (
              <li key={p.tag} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(p.tier)}`}>
                  <span className="hidden sm:inline">{p.tier}</span>
                  <span className="sm:hidden">{tierAbbreviation(p.tier)}</span>
                </span>
                <TierIcon tier={p.tier} size={20} />
                <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.elo}</span>
              </li>
            ))}
          </ul>
          <UnresolvedSection unresolved={ranking.rankedAllTime.unresolved} needsLink={false} />
        </>
      )}

      {active === "1v1" && (
        <>
          {ranking.duel1v1.entries.length === 0 && ranking.duel1v1.unresolved.length === 0 && (
            <DataUnavailable message="Aucun duel joué pour l'instant." />
          )}
          <ul className="flex flex-col gap-0.5">
            {ranking.duel1v1.entries.map((p) => (
              <li key={p.tag} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={colorFromSeed(p.name)} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                </span>
                <span className="hidden items-center gap-3 text-xs sm:flex">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <Image src="/check.png" alt="" width={14} height={15} style={{ width: 14, height: 15 }} />
                    {p.wins}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-red-500">
                    <Image src="/croix.png" alt="" width={14} height={15} style={{ width: 14, height: 15 }} />
                    {p.losses}
                  </span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-primary-2">{p.tier}</span>
                <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.points}</span>
              </li>
            ))}
          </ul>
          <UnresolvedSection unresolved={ranking.duel1v1.unresolved} needsLink />
        </>
      )}

      {active === "casino" && (
        <>
          {ranking.casino.entries.length === 0 && ranking.casino.unresolved.length === 0 && (
            <DataUnavailable message="Personne n'a encore de jetons." />
          )}
          <ul className="flex flex-col gap-0.5">
            {ranking.casino.entries.map((p) => (
              <li key={p.tag} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={colorFromSeed(p.name)} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Image src="/icons/coins.png" alt="" width={16} height={16} style={{ width: 16, height: 16 }} />
                  {formatNumber(p.coins)}
                </span>
              </li>
            ))}
          </ul>
          <UnresolvedSection unresolved={ranking.casino.unresolved} needsLink />
        </>
      )}
    </div>
  );
}
