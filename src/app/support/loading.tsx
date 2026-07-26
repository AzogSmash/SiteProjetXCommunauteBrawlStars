import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        eyebrow="Besoin d'aide ?"
        title="Support"
        description="Ouvre un ticket privé avec le staff : candidature, recrutement de club, incident..."
      />

      <main className="mx-auto max-w-2xl px-6 pb-14">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-3 h-32 rounded-xl" />
      </main>
    </>
  );
}
