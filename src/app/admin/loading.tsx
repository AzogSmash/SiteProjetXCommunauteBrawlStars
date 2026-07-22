import { PageHeader } from "@/components/PageHeader";
import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Panel admin"
        description="Tout ce que voit le staff, plus la configuration de la famille."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-6 flex justify-end">
          <Skeleton className="h-11 w-64 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start gap-6 lg:flex-row">
          <div className="card-elevated w-full rounded-2xl border border-border bg-surface p-5 lg:w-1/2">
            <Skeleton className="mb-4 h-4 w-40" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
          <div className="card-elevated w-full rounded-2xl border border-border bg-surface p-5 lg:w-1/2">
            <Skeleton className="mb-4 h-4 w-32" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
            <Skeleton className="mb-4 h-4 w-36" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
            <Skeleton className="mb-4 h-4 w-72" />
            <div className="flex flex-col gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
