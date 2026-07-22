import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-10 w-3/4 max-w-xl" />
        <Skeleton className="mt-3 h-4 w-1/2 max-w-md" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, col) => (
            <div key={col} className="card-elevated rounded-2xl border border-border bg-surface p-5">
              <Skeleton className="h-4 w-28" />
              <div className="mt-4 flex flex-col gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
