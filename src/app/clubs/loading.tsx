import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Nos clubs"
        description="Projet X regroupe plusieurs clubs Brawl Stars sous une même bannière. Choisis un club pour voir sa fiche complète."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </main>
    </>
  );
}
