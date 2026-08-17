import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { brawlerBuildImagePath } from "@/lib/brawlers";
import { getBestBuild } from "@/lib/family";

export default async function BestBuildDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const build = await getBestBuild(slug);
  if (!build) notFound();

  return (
    <>
      <PageHeader eyebrow="Guides" title={build.brawlerName} description="Build recommandé, gadget, équipements, pouvoir star et hypercharge." />

      <main className="mx-auto max-w-3xl px-6 pb-14">
        <Link
          href="/best-builds"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Tous les builds
        </Link>

        <div className="card-elevated relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-background">
          <Image
            src={brawlerBuildImagePath(build.slug)}
            alt={`Build recommandé pour ${build.brawlerName}`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-foreground/90">{build.comment}</p>
      </main>
    </>
  );
}
