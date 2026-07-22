import { PageHeader } from "@/components/PageHeader";
import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Classement"
        description="Ranked Brawl Stars, trophées all-time, ranked 1v1 interne au serveur et économie casino."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mb-4 h-9 w-72 rounded-full" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
