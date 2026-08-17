import Image from "next/image";
import { brawlerBuildImagePath } from "@/lib/brawlers";
import type { BestBuild } from "@/lib/family";

export function BestBuildCard({ slug, brawlerName, comment }: BestBuild) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-2 card-elevated card-elevated-hover">
      <div className="relative aspect-[16/11] w-full bg-background">
        <Image
          src={brawlerBuildImagePath(slug)}
          alt={`Build recommandé pour ${brawlerName}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="font-display text-lg font-black uppercase tracking-wide text-foreground">
          {brawlerName}
        </p>
        <p className="text-xs leading-relaxed text-muted">{comment}</p>
      </div>
    </div>
  );
}
