"use client";

import { useState, useTransition } from "react";
import { Loader2, CircleCheck, Send } from "lucide-react";
import { createTicket } from "@/app/actions/createTicket";
import { TICKET_CATEGORIES } from "@/lib/data";

const MAX_DESCRIPTION_LENGTH = 1000;

export function TicketForm() {
  const [category, setCategory] = useState(TICKET_CATEGORIES[0].value);
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message?: string; channelUrl?: string; alreadyOpen?: boolean } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    const formData = new FormData();
    formData.set("category", category);
    formData.set("description", description);
    setResult(null);
    startTransition(async () => {
      const res = await createTicket(formData);
      if (res.ok) {
        setResult({ ok: true, channelUrl: res.channelUrl, alreadyOpen: res.alreadyOpen });
        setDescription("");
      } else {
        setResult({ ok: false, message: res.error });
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TICKET_CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            disabled={isPending}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              category === value
                ? "border-primary/60 bg-primary/10 text-primary-2"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={isPending}
          rows={5}
          placeholder="Décris ta demande en quelques lignes..."
          className="w-full resize-none rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        />
        <p className="mt-1 text-right text-[11px] text-muted">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </p>
      </div>

      {result && !result.ok && <p className="text-xs text-red-500">{result.message}</p>}
      {result?.ok && (
        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CircleCheck size={13} />
          {result.alreadyOpen ? "Tu as déjà un ticket ouvert." : "Ticket créé."}
          {result.channelUrl && (
            <a href={result.channelUrl} target="_blank" rel="noreferrer" className="underline">
              Rejoindre le salon Discord
            </a>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !description.trim()}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        Ouvrir le ticket
      </button>
    </form>
  );
}
