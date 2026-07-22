import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary-2">
        <SearchX size={28} />
      </div>
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide">
        Page introuvable
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        Cette page n&apos;existe pas ou plus. Le lien est peut-être périmé — direction l&apos;accueil.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(113,54,186,0.3)] transition-transform hover:scale-[1.03]"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
