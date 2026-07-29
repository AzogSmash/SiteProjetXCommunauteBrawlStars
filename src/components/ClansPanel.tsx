"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, Plus, Trash2, Loader2 } from "lucide-react";
import { Panel } from "@/components/Panel";
import { addClan, removeClan } from "@/app/actions/adminClans";
import type { ApiClan } from "@/lib/api";

export function ClansPanel({ clans }: { clans: ApiClan[] }) {
  const [isPending, startTransition] = useTransition();
  const [tag, setTag] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [confirmTag, setConfirmTag] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!tag.trim() || isPending) return;
    setAddError(null);
    startTransition(async () => {
      const res = await addClan(tag.trim());
      if (res.ok) setTag("");
      else setAddError(res.error);
    });
  }

  function confirmRemove(t: string) {
    setRemoveError(null);
    startTransition(async () => {
      const res = await removeClan(t);
      if (!res.ok) setRemoveError(res.error);
      setConfirmTag(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Configuration actuelle — clans de la famille">
        <ul className="flex flex-col gap-1">
          {clans.map((c) => (
            <li key={c.tag} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm odd:bg-surface-2">
              <ShieldCheck size={15} className="shrink-0 text-primary-2" />
              <span className="min-w-0 flex-1 truncate font-medium text-foreground/90">{c.name}</span>
              <span className="text-xs text-muted">#{c.tag}</span>
              <span className="hidden text-xs text-muted sm:inline">
                !{c.slug}
                {c.alias ? ` / !${c.alias}` : ""}
              </span>
              {confirmTag === c.tag ? (
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="text-xs text-red-500">Sûr ?</span>
                  <button
                    type="button"
                    onClick={() => confirmRemove(c.tag)}
                    disabled={isPending}
                    className="rounded-full bg-red-500/90 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                  >
                    Oui, retirer
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmTag(null)}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted"
                  >
                    Annuler
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmTag(c.tag)}
                  aria-label={`Retirer ${c.name}`}
                  className="shrink-0 rounded-full p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
        {removeError && <p className="mt-2 text-xs text-red-500">{removeError}</p>}
      </Panel>

      <Panel title="Ajouter un clan">
        <form onSubmit={submitAdd} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag du clan (ex: #ABC123)"
            className="w-56 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
          />
          <button
            type="submit"
            disabled={!tag.trim() || isPending}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Ajouter
          </button>
        </form>
        {addError && <p className="mt-2 text-xs text-red-500">{addError}</p>}
      </Panel>
    </div>
  );
}
