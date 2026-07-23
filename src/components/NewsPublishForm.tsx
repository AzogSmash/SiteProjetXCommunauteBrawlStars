"use client";

import { useState, useTransition } from "react";
import { Loader2, CircleCheck, Send, Skull, Shield, MessageCircle, Trophy } from "lucide-react";
import { createNews } from "@/app/actions/createNews";
import type { NewsIcon } from "./NewsCard";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

const ICONS: { value: NewsIcon; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { value: "trophy", label: "Trophée", Icon: Trophy },
  { value: "skull", label: "Victoire ranked", Icon: Skull },
  { value: "shield", label: "Club", Icon: Shield },
  { value: "message", label: "Annonce", Icon: MessageCircle },
];

export function NewsPublishForm() {
  const [icon, setIcon] = useState<NewsIcon>("trophy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    const formData = new FormData();
    formData.set("icon", icon);
    formData.set("title", title);
    formData.set("description", description);
    setResult(null);
    startTransition(async () => {
      const res = await createNews(formData);
      if (res.ok) {
        setResult({ ok: true });
        setTitle("");
        setDescription("");
      } else {
        setResult({ ok: false, message: res.error });
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ICONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setIcon(value)}
            disabled={isPending}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              icon === value
                ? "border-primary/60 bg-primary/10 text-primary-2"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          disabled={isPending}
          placeholder="Titre de l'actualité"
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={isPending}
          rows={2}
          placeholder="Description courte..."
          className="w-full resize-none rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        />
        <p className="mt-1 text-right text-[11px] text-muted">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </p>
      </div>

      {result && !result.ok && <p className="text-xs text-red-500">{result.message}</p>}
      {result?.ok && (
        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CircleCheck size={13} /> Actualité publiée.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !title.trim() || !description.trim()}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        Publier
      </button>
    </form>
  );
}
