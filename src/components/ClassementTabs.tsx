"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Crown } from "lucide-react";
import { Avatar } from "./Avatar";
import { TierIcon } from "./TierIcon";
import { TrophyIcon } from "./TrophyIcon";
import { SeasonClock } from "./SeasonClock";
import { tierColorClass, tierAbbreviation } from "@/lib/tiers";
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

type ClubFilterable = { club?: string | null };
type DuelRow = Api1v1Player & { rank: number; club: string | null };
type CasinoRow = ApiCasinoPlayer & { rank: number; club: string | null };

function byClub<T extends ClubFilterable>(list: T[], club: string | null): T[] {
  return club ? list.filter((p) => p.club === club) : list;
}

export function ClassementTabs({
  ranked,
  rankedAllTime,
  trophees,
  duel1v1,
  casino,
  clubs,
  initialTab,
  seasons1v1,
  seasonsCasino,
  selectedSeason1v1,
  selectedSeasonCasino,
}: {
  ranked: RankedPlayer[];
  rankedAllTime: RankedPlayer[];
  trophees: Player[];
  duel1v1: DuelRow[];
  casino: CasinoRow[];
  clubs: { value: string; label: string }[];
  initialTab?: string;
  seasons1v1: { value: string; label: string }[];
  seasonsCasino: { value: string; label: string }[];
  selectedSeason1v1: string | null;
  selectedSeasonCasino: string | null;
}) {
  const [active, setActive] = useState<TabId>(isTabId(initialTab) ? initialTab : "ranked");
  const [expandedTabs, setExpandedTabs] = useState<Set<TabId>>(new Set());
  const expandTab = (id: TabId) => setExpandedTabs((prev) => new Set(prev).add(id));
  const [clubFilter, setClubFilter] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Change de saison archivée pour le 1v1/casino : contrairement au filtre
  // club (purement client, sur des données déjà chargées), changer de saison
  // change QUELLES données charger — direction serveur via l'URL, comme `tab`.
  function setSeason(param: "saison1v1" | "saisoncasino", value: string, tab: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  }

  const rankedFiltered = byClub(ranked, clubFilter);
  const rankedAllTimeFiltered = byClub(rankedAllTime, clubFilter);
  const tropheesFiltered = byClub(trophees, clubFilter);
  const duel1v1Filtered = byClub(duel1v1, clubFilter);
  const casinoFiltered = byClub(casino, clubFilter);

  // Calcul direct au rendu (précision à l'heure près, pas à la seconde —
  // un désaccord d'hydratation serveur/client n'arriverait que si la
  // requête traverse pile une frontière d'heure, sans conséquence si ça
  // arrive : juste un avertissement console, pas de plantage).
  const seasonCategory = SEASON_CATEGORY[active];
  const seasonLabel = seasonCategory ? formatSeasonEndLabel(seasonCategory) : null;

  return (
    <div className="card-elevated relative rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Classements</h2>
        <div className="flex flex-wrap items-center gap-3">
          {seasonLabel && (
            <span className="card-elevated relative flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/25 bg-surface px-3 py-1 text-[11px] font-semibold text-primary-2 sm:-top-8">
              <SeasonClock size={13} />
              {seasonLabel}
            </span>
          )}
          <Link
            href="/clubs"
            className="shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-primary-2 hover:text-primary"
          >
            Voir les clubs
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        {clubs.length > 0 && (
          <select
            value={clubFilter ?? ""}
            onChange={(e) => setClubFilter(e.target.value || null)}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary/50"
          >
            <option value="">Tous les clubs</option>
            {clubs.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        )}
        {active === "1v1" && seasons1v1.length > 0 && (
          <select
            value={selectedSeason1v1 ?? ""}
            onChange={(e) => setSeason("saison1v1", e.target.value, "1v1")}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary/50"
          >
            <option value="">Mois en cours</option>
            {seasons1v1.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
        {active === "casino" && seasonsCasino.length > 0 && (
          <select
            value={selectedSeasonCasino ?? ""}
            onChange={(e) => setSeason("saisoncasino", e.target.value, "casino")}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary/50"
          >
            <option value="">Mois en cours</option>
            {seasonsCasino.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {active === "ranked" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {rankedFiltered.length === 0 && (
              <DataUnavailable
                message={clubFilter ? "Aucun joueur de ce club dans ce classement." : "Classement ranked pas encore synchronisé."}
                showContact={!clubFilter}
              />
            )}
            {(expandedTabs.has("ranked") ? rankedFiltered : rankedFiltered.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                  {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
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
          {!expandedTabs.has("ranked") && (
            <ShowMoreButton remaining={rankedFiltered.length - PAGE_SIZE} onClick={() => expandTab("ranked")} />
          )}
        </>
      )}

      {active === "ranked-all-time" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {rankedAllTimeFiltered.length === 0 && (
              <DataUnavailable
                message={
                  clubFilter
                    ? "Aucun joueur de ce club dans ce classement."
                    : "Pas encore de records synchronisés — ça arrive automatiquement au fil des prochaines heures."
                }
                showContact={!clubFilter}
              />
            )}
            {(expandedTabs.has("ranked-all-time") ? rankedAllTimeFiltered : rankedAllTimeFiltered.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
                <Rank rank={p.rank} />
                <Avatar name={p.name} color={p.color} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  <PlayerLink tag={p.tag}>{p.name}</PlayerLink>
                  {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
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
          {!expandedTabs.has("ranked-all-time") && (
            <ShowMoreButton remaining={rankedAllTimeFiltered.length - PAGE_SIZE} onClick={() => expandTab("ranked-all-time")} />
          )}
        </>
      )}

      {active === "trophees" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {tropheesFiltered.length === 0 && (
              <DataUnavailable
                message={clubFilter ? "Aucun joueur de ce club dans ce classement." : "Classement des trophées pas encore synchronisé."}
                showContact={!clubFilter}
              />
            )}
            {(expandedTabs.has("trophees") ? tropheesFiltered : tropheesFiltered.slice(0, PAGE_SIZE)).map((p) => (
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
            <ShowMoreButton remaining={tropheesFiltered.length - PAGE_SIZE} onClick={() => expandTab("trophees")} />
          )}
        </>
      )}

      {active === "1v1" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {duel1v1Filtered.length === 0 && (
              <DataUnavailable
                message={clubFilter ? "Aucun joueur de ce club dans ce classement." : "Aucun duel joué pour l'instant."}
                showContact={!clubFilter}
              />
            )}
            {(expandedTabs.has("1v1") ? duel1v1Filtered : duel1v1Filtered.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
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
          {!expandedTabs.has("1v1") && (
            <ShowMoreButton remaining={duel1v1Filtered.length - PAGE_SIZE} onClick={() => expandTab("1v1")} />
          )}
        </>
      )}

      {active === "casino" && (
        <>
          <ul className="flex flex-col gap-0.5">
            {casinoFiltered.length === 0 && (
              <DataUnavailable
                message={clubFilter ? "Aucun joueur de ce club dans ce classement." : "Personne n'a encore de jetons."}
                showContact={!clubFilter}
              />
            )}
            {(expandedTabs.has("casino") ? casinoFiltered : casinoFiltered.slice(0, PAGE_SIZE)).map((p) => (
              <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-surface-2">
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
          {!expandedTabs.has("casino") && (
            <ShowMoreButton remaining={casinoFiltered.length - PAGE_SIZE} onClick={() => expandTab("casino")} />
          )}
        </>
      )}
    </div>
  );
}
