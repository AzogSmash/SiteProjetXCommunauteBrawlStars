"use client";

import { useState } from "react";
import { FileSpreadsheet, ChevronDown } from "lucide-react";

const STAT_OPTIONS = [
  { value: "ranked", label: "Ranked (saison en cours)" },
  { value: "rankedAllTime", label: "Ranked all-time" },
  { value: "trophees", label: "Trophées cumulés" },
  { value: "duel1v1", label: "Ranked 1v1" },
  { value: "casino", label: "Casino" },
] as const;

type StatId = (typeof STAT_OPTIONS)[number]["value"];

type SeasonMode = "current" | "all" | string;

function SeasonSelect({
  value,
  onChange,
  seasons,
  seasonLabels,
  currentLabel,
}: {
  value: SeasonMode;
  onChange: (v: SeasonMode) => void;
  seasons: string[];
  seasonLabels: Record<string, string>;
  currentLabel: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary/50"
    >
      <option value="current">{currentLabel}</option>
      <option value="all">Toutes les saisons archivées</option>
      {seasons.map((s) => (
        <option key={s} value={s}>
          {seasonLabels[s] ?? s}
        </option>
      ))}
    </select>
  );
}

export function ExportPanel({
  duel1v1Seasons,
  casinoSeasons,
  bsSeasons,
  seasonLabels,
}: {
  duel1v1Seasons: string[];
  casinoSeasons: string[];
  bsSeasons: string[];
  seasonLabels: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<Set<StatId>>(new Set(STAT_OPTIONS.map((s) => s.value)));
  const [duel1v1Season, setDuel1v1Season] = useState<SeasonMode>("current");
  const [casinoSeason, setCasinoSeason] = useState<SeasonMode>("current");
  const [bsSeasonMode, setBsSeasonMode] = useState<"none" | "all" | string>("all");

  function toggleStat(id: StatId) {
    setStats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function buildHref() {
    const params = new URLSearchParams();
    params.set("stats", [...stats].join(","));
    if (stats.has("duel1v1")) params.set("duel1v1Season", duel1v1Season);
    if (stats.has("casino")) params.set("casinoSeason", casinoSeason);
    params.set("bsSeasons", bsSeasonMode);
    return `/api/export?${params.toString()}`;
  }

  return (
    <div className="mb-6 flex flex-col items-end gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
        >
          <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          Options d&apos;export
        </button>
        <a
          href={buildHref()}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
        >
          <FileSpreadsheet size={16} />
          Exporter (Excel)
        </a>
      </div>

      {open && (
        <div className="card-elevated w-full rounded-2xl border border-border bg-surface p-5 text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Classements à inclure</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {STAT_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleStat(s.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  stats.has(s.value)
                    ? "border-primary/60 bg-primary/10 text-primary-2"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {stats.has("duel1v1") && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground/90">Période — Ranked 1v1</p>
                <SeasonSelect
                  value={duel1v1Season}
                  onChange={setDuel1v1Season}
                  seasons={duel1v1Seasons}
                  seasonLabels={seasonLabels}
                  currentLabel="Mois en cours"
                />
              </div>
            )}
            {stats.has("casino") && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground/90">Période — Casino</p>
                <SeasonSelect
                  value={casinoSeason}
                  onChange={setCasinoSeason}
                  seasons={casinoSeasons}
                  seasonLabels={seasonLabels}
                  currentLabel="Mois en cours"
                />
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground/90">Historique saisons Brawl Stars (push)</p>
              <select
                value={bsSeasonMode}
                onChange={(e) => setBsSeasonMode(e.target.value)}
                className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary/50"
              >
                <option value="none">Aucune</option>
                <option value="all">Toutes les saisons archivées</option>
                {bsSeasons.map((s) => (
                  <option key={s} value={s}>
                    {seasonLabels[s] ?? s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
