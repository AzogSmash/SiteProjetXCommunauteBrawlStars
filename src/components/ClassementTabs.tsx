"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Avatar } from "./Avatar";
import { TierIcon } from "./TierIcon";
import { TrophyIcon } from "./TrophyIcon";
import { SeasonClock } from "./SeasonClock";
import { tierColorClass } from "@/lib/tiers";
import { colorFromSeed, formatNumber } from "@/lib/format";
import { formatSeasonEndLabel, type SeasonCategory } from "@/lib/seasonReset";
import type { RankedPlayer, Player } from "@/lib/family";
import type { Api1v1Player, ApiCasinoPlayer } from "@/lib/api";
import { DataUnavailable } from "./DataUnavailable";
import { PlayerLink } from "./PlayerLink";

const TABS = [
  { id: "ranked", label: "Ranked" },
  { id: "ranked-all-time", label: "Ranked all-time" },
  { id: "trophees", label: "Trophées" },
  { id: "1v1", label: "1v1" },
  { id: "casino", label: "Casino" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Onglets qui ont une vraie notion de saison qui se termine — "ranked
// all-time" est un record permanent, pas de reset, donc pas de bulle.
const SEASON_CATEGORY: Partial<Record<TabId, SeasonCategory>> = {
  ranked: "ranked",
  trophees: "trophees",
  "1v1": "1v1",
  casino: "casino",
};

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

const TAB_IDS = TABS.map((t) => t.id);

function isTabId(value: string | undefined): value is TabId {
  return !!value && (TAB_IDS as string[]).includes(value);
}

// Nombre de lignes affichées avant "Voir plus" — évite d'imposer un scroll
// interminable sur des classements de 150+ joueurs, surtout sur mobile.
const PAGE_SIZE = 15;

function ShowMoreButton({ remaining, onClick }: { remaining: number; onClick: () => void }) {
  if (remaining <= 0) return null;
  return (
    <button
      onClick={onClick}
      className="mt-2 w-full rounded-xl border border-border py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-2 transition-colors hover:bg-surface-2"
    >
      Voir plus ({remaining} de plus)
    </button>
  );
}

export function ClassementTabs({
  ranked,
  rankedAllTime,
  trophees,
  duel1v1,
  casino,
  initialTab,
}: {
  ranked: RankedPlayer[];
  rankedAllTime: RankedPlayer[];
  trophees: Player[];
  duel1v1: Api1v1Player[];
  casino: ApiCasinoPlayer[];
  initialTab?: string;
}) {
  const [active, setActive] = useState<TabId>(isTabId(initialTab) ? initialTab : "ranked");
  const [expandedTabs, setExpandedTabs] = useState<Set<TabId>>(new Set());
  const expandTab = (id: TabId) => setExpandedTabs((prev) => new Set(prev).add(id));

  // Calcul direct au rendu (précision à l'heure près, pas à la seconde —
  // un désaccord d'hydratation serveur/client n'arriverait que si la
  // requête traverse pile une frontière d'heure, sans conséquence si ça
  // arrive : juste un avertissement console, pas de plantage).
  const seasonCategory = SEASON_CATEGORY[active];
  const seasonLabel = seasonCategory ? formatSeasonEndLabel(seasonCategory) : null;

  return (
    <div className="card-elevated relative rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Classements</h2>
        <div className="flex items-center gap-3">
          {seasonLabel && (
            <span className="card-elevated relative -top-8 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/25 bg-surface px-3 py-1 text-[11px] font-semibold text-primary-2">
              <SeasonClock size={13} />
              {seasonLabel}
            </span>
          )}
          <Link
            href="/clubs"
            className="text-xs font-semibold uppercase tracking-wide text-primary-2 hover:text-primary"
          >
            Voir les clubs
          </Link>
        </div>
      </div>

      <div className="mb-4 flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1">
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

      {active === "ranked" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {ranked.length === 0 && <DataUnavailable message="Classement ranked pas encore synchronisé." />}
            {(expandedTabs.has("ranked") ? ranked : ranked.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                  {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(p.tier)}`}>{p.tier}</span>
                <TierIcon tier={p.tier} size={20} />
                <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.elo}</span>
              </li>
            ))}
          </ul>
          {!expandedTabs.has("ranked") && (
            <ShowMoreButton remaining={ranked.length - PAGE_SIZE} onClick={() => expandTab("ranked")} />
          )}
        </>
      )}

      {active === "ranked-all-time" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {rankedAllTime.length === 0 && (
              <DataUnavailable message="Pas encore de records synchronisés — ça arrive automatiquement au fil des prochaines heures." />
            )}
            {(expandedTabs.has("ranked-all-time") ? rankedAllTime : rankedAllTime.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                  {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(p.tier)}`}>{p.tier}</span>
                <TierIcon tier={p.tier} size={20} />
                <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.elo}</span>
              </li>
            ))}
          </ul>
          {!expandedTabs.has("ranked-all-time") && (
            <ShowMoreButton remaining={rankedAllTime.length - PAGE_SIZE} onClick={() => expandTab("ranked-all-time")} />
          )}
        </>
      )}

      {active === "trophees" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {trophees.length === 0 && <DataUnavailable message="Classement des trophées pas encore synchronisé." />}
            {(expandedTabs.has("trophees") ? trophees : trophees.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                  {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
                </span>
                <span className="flex w-24 items-center justify-end gap-1 text-right text-sm font-semibold text-foreground/90">
                  {p.trophies}
                  <TrophyIcon size={16} />
                </span>
              </li>
            ))}
          </ul>
          {!expandedTabs.has("trophees") && (
            <ShowMoreButton remaining={trophees.length - PAGE_SIZE} onClick={() => expandTab("trophees")} />
          )}
        </>
      )}

      {active === "1v1" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {duel1v1.length === 0 && <DataUnavailable message="Aucun duel joué pour l'instant." />}
            {(expandedTabs.has("1v1") ? duel1v1 : duel1v1.slice(0, PAGE_SIZE)).map((p, i) => (
              <li key={p.name + i} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={i + 1} />
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
          {!expandedTabs.has("1v1") && (
            <ShowMoreButton remaining={duel1v1.length - PAGE_SIZE} onClick={() => expandTab("1v1")} />
          )}
        </>
      )}

      {active === "casino" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {casino.length === 0 && <DataUnavailable message="Personne n'a encore de jetons." />}
            {(expandedTabs.has("casino") ? casino : casino.slice(0, PAGE_SIZE)).map((p, i) => (
              <li key={p.name + i} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={i + 1} />
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
          {!expandedTabs.has("casino") && (
            <ShowMoreButton remaining={casino.length - PAGE_SIZE} onClick={() => expandTab("casino")} />
          )}
        </>
      )}
    </div>
  );
}
