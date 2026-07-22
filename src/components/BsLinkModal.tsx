"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const DISMISS_KEY = "px-bslink-prompt-dismissed";

// Popup proposant de lier son compte Brawl Stars (!bslink), affichée aux
// membres du Discord connectés au site qui n'ont pas encore de compte lié
// (demande du 22/07/2026). Un dismiss retient le choix en local — pas la
// peine de re-solliciter à chaque page une fois refusé une fois.
export function BsLinkModal({ shouldShow }: { shouldShow: boolean }) {
  const [open, setOpen] = useState(false);

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
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Ton tag (ex : <code className="rounded bg-surface-2 px-1 py-0.5">#8QQPQUU</code>) est affiché
          juste sous ton pseudo, sur ta fiche de profil en jeu.
        </p>

        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
          Sur Discord, tape : <span className="font-mono font-semibold text-primary-2">!bslink #TONTAG</span>
        </div>

        <button
          onClick={dismiss}
          className="mt-4 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
