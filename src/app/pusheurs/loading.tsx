import { PageHeader } from "@/components/PageHeader";
import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        eyebrow="Compétition"
        title="Pusheurs"
        description="Qui gagne le plus de trophées, saison après saison — le classement du push, pas des totaux."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="card-elevated rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-7 w-40" />
            </div>
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>

        <div className="mt-8">
          <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
            <Skeleton className="mb-4 h-4 w-48" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
