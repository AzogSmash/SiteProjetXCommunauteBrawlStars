import Image from "next/image";
import Link from "next/link";
import { brawlerBuildImagePath } from "@/lib/brawlers";
import type { BestBuild } from "@/lib/family";

// Carte compacte pour la grille (100+ brawlers à terme) — image réduite et
// texte tronqué à 3 lignes, le détail complet vit sur /best-builds/[slug]
// (même pattern que les cartes club qui renvoient vers /clubs/[slug]).
export function BestBuildCard({ slug, brawlerName, comment }: BestBuild) {
  return (
    <Link
      href={`/best-builds/${slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-2 card-elevated card-elevated-hover"
    >
      <div className="relative aspect-video w-full bg-background">
        <Image
          src={brawlerBuildImagePath(slug)}
          alt={`Build recommandé pour ${brawlerName}`}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-3.5">
        <p className="font-display text-base font-black uppercase tracking-wide text-foreground">
          {brawlerName}
        </p>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted">{comment}</p>
      </div>
    </Link>
  );
}
