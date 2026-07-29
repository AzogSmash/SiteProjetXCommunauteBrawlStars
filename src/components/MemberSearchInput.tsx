"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import type { SearchResult } from "@/app/api/search/route";

export type ResolvedMember = { tag: string; name: string; discordId: string };

const EMPTY: SearchResult = { players: [], clubs: [] };

// Cible un membre par nom/tag Brawl Stars plutôt que par ID Discord brut —
// tout le monde n'a pas le mode développeur activé pour copier un ID à la
// main (même souci résolu côté bot pour !fermer_ticket via mention de salon).
// Le tag est résolu en discord_id via /api/admin/resolve-member (nécessite
// un compte Discord lié, sinon message d'erreur explicite).
export function MemberSearchInput({
  onSelect,
  placeholder = "Rechercher un joueur...",
}: {
  onSelect: (member: ResolvedMember) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ResolvedMember | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    // Signale le début d'une recherche débouncée (effet réseau externe) —
    // même logique/disable ciblé que SearchBar.tsx.
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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function pick(tag: string, name: string) {
    setOpen(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/resolve-member?tag=${encodeURIComponent(tag)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Impossible de résoudre ce joueur.");
        return;
      }
      const member = { tag: data.tag, name: data.name ?? name, discordId: data.discordId };
      setSelected(member);
      setQuery("");
      onSelect(member);
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary-2">
        {selected.name}
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setError(null);
          }}
          aria-label="Changer de joueur"
          className="rounded-full p-0.5 hover:bg-primary/20"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-muted">
        <Search size={14} className="shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-40 min-w-0 bg-transparent text-foreground placeholder:text-muted focus:outline-none"
        />
        {loading && <Loader2 size={13} className="shrink-0 animate-spin" />}
      </div>

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 min-w-[16rem] overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
          {results.players.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">
              {loading ? "Recherche..." : `Aucun résultat pour « ${query.trim()} ».`}
            </p>
          ) : (
            <div className="p-2">
              {results.players.map((p) => (
                <button
                  key={p.tag}
                  type="button"
                  onClick={() => pick(p.tag, p.name)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground/90 hover:bg-surface-2"
                >
                  <span className="min-w-0 truncate">{p.name}</span>
                  {p.club && <span className="shrink-0 text-xs text-muted">{p.club}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
