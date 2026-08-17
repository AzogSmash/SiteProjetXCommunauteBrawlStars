"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BestBuildCard } from "@/components/BestBuildCard";
import { DataUnavailable } from "@/components/DataUnavailable";
import type { BestBuild } from "@/lib/family";

type SortKey = "az" | "za" | "recent";

const SORTERS: Record<SortKey, (a: BestBuild, b: BestBuild) => number> = {
  az: (a, b) => a.brawlerName.localeCompare(b.brawlerName, "fr"),
  za: (a, b) => b.brawlerName.localeCompare(a.brawlerName, "fr"),
  recent: (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
};

// Recherche + tri en local (côté client) — la liste complète est déjà
// chargée une fois par le Server Component parent, et même à 100+ brawlers
// ça reste un volume négligeable à filtrer/trier en mémoire, pas besoin
// d'aller retaper le bot à chaque frappe.
export function BestBuildsGrid({ builds }: { builds: BestBuild[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("az");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? builds.filter((b) => b.brawlerName.toLowerCase().includes(q)) : builds;
    return [...filtered].sort(SORTERS[sort]);
  }, [builds, query, sort]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted sm:w-64">
          <Search size={16} className="shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un brawler..."
            className="w-full min-w-0 bg-transparent placeholder:text-muted focus:outline-none"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary/50"
        >
          <option value="az">Alphabétique (A → Z)</option>
          <option value="za">Alphabétique (Z → A)</option>
          <option value="recent">Plus récemment ajoutés</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <DataUnavailable
          message={query ? `Aucun brawler ne correspond à « ${query} ».` : "Aucun build publié pour l'instant."}
          showContact={false}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((build) => (
            <BestBuildCard key={build.slug} {...build} />
          ))}
        </div>
      )}
    </>
  );
}
