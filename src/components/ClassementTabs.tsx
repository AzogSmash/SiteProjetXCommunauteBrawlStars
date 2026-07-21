"use client";

import { useState } from "react";
import { Crown, Coins, Swords, Zap } from "lucide-react";
import { Avatar } from "./Avatar";
import { TierIcon } from "./TierIcon";
import { TrophyIcon } from "./TrophyIcon";
import { tierColorClass } from "@/lib/tiers";
import { colorFromSeed, formatNumber } from "@/lib/format";
import type { RankedPlayer, Player } from "@/lib/family";
import type { Api1v1Player, ApiCasinoPlayer } from "@/lib/api";

const TABS = [
  { id: "ranked", label: "Ranked" },
  { id: "trophees", label: "Trophées" },
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

const TAB_IDS = TABS.map((t) => t.id);

function isTabId(value: string | undefined): value is TabId {
  return !!value && (TAB_IDS as string[]).includes(value);
}

export function ClassementTabs({
  ranked,
  trophees,
  duel1v1,
  casino,
  initialTab,
}: {
  ranked: RankedPlayer[];
  trophees: Player[];
  duel1v1: Api1v1Player[];
  casino: ApiCasinoPlayer[];
  initialTab?: string;
}) {
  const [active, setActive] = useState<TabId>(isTabId(initialTab) ? initialTab : "ranked");

  return (
    <div>
      <div className="mb-4 flex w-fit gap-1 rounded-full border border-border bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
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
        <ul className="flex flex-col gap-0.5">
          {ranked.map((p) => (
            <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <Rank rank={p.rank} />
              <Avatar name={p.name} color={p.color} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                {p.name}
                {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wide ${tierColorClass(p.tier)}`}>{p.tier}</span>
              <TierIcon tier={p.tier} size={20} />
              <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.elo}</span>
            </li>
          ))}
        </ul>
      )}

      {active === "trophees" && (
        <ul className="flex flex-col gap-0.5">
          {trophees.map((p) => (
            <li key={p.tag ?? p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <Rank rank={p.rank} />
              <Avatar name={p.name} color={p.color} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                {p.name}
                {p.club && <span className="ml-2 text-xs font-normal text-muted">{p.club}</span>}
              </span>
              {p.elo !== undefined && (
                <span className="hidden items-center gap-1 text-sm font-semibold text-foreground/90 sm:flex">
                  <Zap size={12} className="text-primary-2" />
                  {p.elo}
                </span>
              )}
              <span className="flex w-24 items-center justify-end gap-1 text-right text-sm font-semibold text-foreground/90">
                {p.trophies}
                <TrophyIcon size={16} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {active === "1v1" && (
        <ul className="flex flex-col gap-0.5">
          {duel1v1.length === 0 && (
            <p className="px-3 py-6 text-sm text-muted">Aucun duel joué pour l&apos;instant.</p>
          )}
          {duel1v1.map((p, i) => (
            <li key={p.name + i} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <Rank rank={i + 1} />
              <Avatar name={p.name} color={colorFromSeed(p.name)} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">{p.name}</span>
              <span className="hidden items-center gap-1 text-xs text-muted sm:flex">
                <Swords size={12} />
                {p.wins}V / {p.losses}D
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-primary-2">{p.tier}</span>
              <span className="w-12 text-right text-sm font-semibold text-foreground/90">{p.points}</span>
            </li>
          ))}
        </ul>
      )}

      {active === "casino" && (
        <ul className="flex flex-col gap-0.5">
          {casino.length === 0 && (
            <p className="px-3 py-6 text-sm text-muted">Personne n&apos;a encore de jetons.</p>
          )}
          {casino.map((p, i) => (
            <li key={p.name + i} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <Rank rank={i + 1} />
              <Avatar name={p.name} color={colorFromSeed(p.name)} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">{p.name}</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                <Coins size={14} />
                {formatNumber(p.coins)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
