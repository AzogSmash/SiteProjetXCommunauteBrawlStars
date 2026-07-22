"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { X, Loader2, CircleCheck } from "lucide-react";
import { linkBsAccount } from "@/app/actions/bslink";
import { formatNumber } from "@/lib/format";

const DISMISS_KEY = "px-bslink-prompt-dismissed";

// Popup proposant de lier son compte Brawl Stars, affichée aux membres du
// Discord connectés au site qui n'ont pas encore de compte lié (demande du
// 22/07/2026). La liaison se fait directement ici (formulaire -> server
// action -> !bslink côté bot) plutôt que de juste renvoyer vers Discord. Un
// dismiss retient le choix en local — pas la peine de re-solliciter à
// chaque page une fois refusé une fois.
export function BsLinkModal({ shouldShow }: { shouldShow: boolean }) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!shouldShow) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    // localStorage n'existe pas côté serveur : le premier rendu doit rester
    // fermé pour matcher le SSR, cette ouverture ne peut légitimement se
    // décider qu'après montage côté client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true);
  }, [shouldShow]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!tag.trim() || isPending) return;
    startTransition(async () => {
      const res = await linkBsAccount(tag);
      if (res.ok) {
        localStorage.setItem(DISMISS_KEY, "1");
        setResult({
          ok: true,
          message: `${res.name} — ${formatNumber(res.trophies)} 🏆${res.tier ? ` · ${res.tier}` : ""}`,
        });
      } else {
        setResult({ ok: false, message: res.error });
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card-elevated relative w-full max-w-md rounded-2xl border border-border bg-surface p-6">
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute right-4 top-4 text-muted transition-colors hover:text-foreground"
        >
          <X size={18} />
        </button>

        <h2 className="pr-6 font-display text-lg font-bold uppercase tracking-wide text-foreground">
          Lie ton compte Brawl Stars
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          On ne sait pas encore quel joueur Brawl Stars tu es. En liant ton compte, on peut te faire
          apparaître dans les classements de la famille — et ça servira aussi à débloquer bientôt un
          profil personnel sur le site (stats, historique, et d&apos;autres mises à jour à venir).
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <Image
            src="/Tag_BS.png"
            alt="Le tag Brawl Stars est affiché juste sous le pseudo, sur la fiche de profil en jeu"
            width={933}
            height={414}
            className="w-full"
            priority
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Ton tag (ex : <code className="rounded bg-surface-2 px-1 py-0.5">#8QQPQUU</code>) est affiché
          juste sous ton pseudo, sur ta fiche de profil en jeu.
        </p>

        {result?.ok ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
            <CircleCheck size={16} className="shrink-0" />
            Compte lié : {result.message}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="#TONTAG"
              disabled={isPending}
              className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
            />
            {result && !result.ok && <p className="text-xs text-red-500">{result.message}</p>}
            <button
              type="submit"
              disabled={isPending || !tag.trim()}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {isPending && <Loader2 size={15} className="animate-spin" />}
              Lier mon compte
            </button>
          </form>
        )}

        <button
          onClick={dismiss}
          className="mt-3 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
        >
          {result?.ok ? "Fermer" : "Plus tard"}
        </button>
      </div>
    </div>
  );
}
