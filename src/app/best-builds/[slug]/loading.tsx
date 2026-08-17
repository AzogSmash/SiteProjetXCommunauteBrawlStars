import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Guides" title="Build" description="Chargement du build..." />

      <main className="mx-auto max-w-3xl px-6 pb-14">
        <Skeleton className="mb-4 h-4 w-28" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="mt-5 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-5/6" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
      </main>
    </>
  );
}
