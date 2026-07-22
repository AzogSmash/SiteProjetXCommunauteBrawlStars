import { PageHeader } from "@/components/PageHeader";
import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="La communauté" title="Club" description="Chargement de la fiche du club..." />

      <section className="mx-auto max-w-7xl px-6">
        <div className="card-elevated flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
          <Skeleton className="h-32 w-32 shrink-0 rounded-2xl sm:h-40 sm:w-40" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-3 h-4 w-full max-w-md" />
            <Skeleton className="mt-1.5 h-4 w-2/3 max-w-sm" />
            <Skeleton className="mt-4 h-10 w-44 rounded-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
