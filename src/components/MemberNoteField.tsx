"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updateMemberNote } from "@/app/actions/updateMemberNote";

const MAX_NOTE_LENGTH = 300;

export function MemberNoteField({ clubSlug, tag, initialNote }: { clubSlug: string; tag: string; initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [draft, setDraft] = useState(initialNote);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      const res = await updateMemberNote(clubSlug, tag, draft);
      if (res.ok) {
        setNote(draft.trim());
        setEditing(false);
      } else {
        setError(res.error);
      }
    });
  }

  if (editing) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_NOTE_LENGTH}
          disabled={isPending}
          placeholder="Note staff sur ce membre..."
          autoFocus
          className="w-full min-w-0 rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs text-foreground outline-none focus:border-primary/50 sm:w-48"
        />
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            aria-label="Enregistrer la note"
            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-600 hover:bg-surface-2 disabled:opacity-60"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(note);
              setEditing(false);
              setError(null);
            }}
            disabled={isPending}
            aria-label="Annuler"
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-surface-2 disabled:opacity-60"
          >
            <X size={13} />
          </button>
        </div>
        {error && <p className="text-[11px] text-red-500 sm:absolute">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(note);
        setEditing(true);
      }}
      className="group flex min-w-0 max-w-[10rem] items-center gap-1.5 rounded-lg px-1.5 py-1 text-left text-xs text-muted hover:bg-surface-2 hover:text-foreground"
    >
      {note ? (
        <span className="min-w-0 truncate italic">{note}</span>
      ) : (
        <span className="opacity-0 group-hover:opacity-100">Ajouter une note</span>
      )}
      <Pencil size={11} className="shrink-0 opacity-0 group-hover:opacity-100" />
    </button>
  );
}
