"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { spaceClubName } from "@/lib/format";
import type { SearchResult } from "@/app/api/search/route";

const EMPTY: SearchResult = { players: [], clubs: [] };

export function SearchBar({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const q = query.trim();
    // Rien à chercher : on ne touche pas à results/loading ici (setState
    // synchrone dans un effet) — le dropdown reste caché tant que la requête
    // fait moins de 2 caractères, voir showDropdown plus bas, donc un
    // éventuel résultat périmé en state ne s'affiche jamais.
    if (q.length < 2) return;
    // Signale le début d'une recherche débouncée (effet réseau externe) —
    // pas un cas "dérivable du render", d'où le disable ciblé plutôt qu'une
    // restructuration forcée (même logique que le disable de BsLinkModal).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((data: SearchResult) => setResults(data))
        .catch(() => setResults(EMPTY))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    router.push(href);
  }

  const hasResults = results.players.length > 0 || results.clubs.length > 0;
  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
        <Search size={16} className="shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un joueur, un club..."
          className="w-full min-w-0 bg-transparent placeholder:text-muted focus:outline-none"
        />
        {loading && <Loader2 size={14} className="shrink-0 animate-spin" />}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
          {loading && !hasResults ? (
            <p className="px-4 py-3 text-sm text-muted">Recherche...</p>
          ) : !hasResults ? (
            <p className="px-4 py-3 text-sm text-muted">Aucun résultat pour « {query.trim()} ».</p>
          ) : (
            <>
              {results.clubs.length > 0 && (
                <div className="border-b border-border p-2">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">Clubs</p>
                  {results.clubs.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => go(`/clubs/${c.slug}`)}
                      className="w-full rounded-lg px-2 py-2 text-left text-sm text-foreground/90 hover:bg-surface-2"
                    >
                      {spaceClubName(c.name)}
                    </button>
                  ))}
                </div>
              )}
              {results.players.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">Joueurs</p>
                  {results.players.map((p) => (
                    <button
                      key={p.tag}
                      onClick={() => go(`/joueurs/${p.tag.replace(/^#/, "")}`)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground/90 hover:bg-surface-2"
                    >
                      <span className="min-w-0 truncate">{p.name}</span>
                      {p.club && <span className="shrink-0 text-xs text-muted">{spaceClubName(p.club)}</span>}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
