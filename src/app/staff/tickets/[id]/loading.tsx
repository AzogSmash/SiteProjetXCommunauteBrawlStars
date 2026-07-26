import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Staff" title="Ticket" description="Chargement..." />

      <main className="mx-auto max-w-3xl px-6 pb-14">
        <Skeleton className="mb-4 h-20 rounded-2xl" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </main>
    </>
  );
}
