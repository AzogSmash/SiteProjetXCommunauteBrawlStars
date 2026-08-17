import { PageHeader } from "@/components/PageHeader";
import { BestBuildCard } from "@/components/BestBuildCard";
import { DataUnavailable } from "@/components/DataUnavailable";
import { getBestBuilds } from "@/lib/family";

export default async function BestBuildsPage() {
  const builds = await getBestBuilds();

  return (
    <>
      <PageHeader
        eyebrow="Guides"
        title="Meilleurs builds"
        description="Un build recommandé par brawler — gadget, équipements, pouvoir star et hypercharge — avec les adaptations selon les maps et les modes."
      />

      <p className="mx-auto max-w-7xl px-6 pb-8 text-xs font-medium uppercase tracking-wide text-muted">
        By Kamanyte
      </p>

      <main className="mx-auto max-w-7xl px-6 pb-14">
        {builds.length === 0 ? (
          <DataUnavailable message="Aucun build publié pour l'instant." showContact={false} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => (
              <BestBuildCard key={build.slug} {...build} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
