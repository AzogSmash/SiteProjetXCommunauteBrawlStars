"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-500">
        <ServerCrash size={28} />
      </div>
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide">
        Un souci est survenu
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        Cette page a rencontré une erreur inattendue. Ce n&apos;est pas forcément grave — réessaie,
        et si ça persiste, préviens le staff sur Discord.
      </p>
      {error.digest && (
        <p className="text-xs text-muted/70">Référence : {error.digest}</p>
      )}
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/90 hover:border-primary/40"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
