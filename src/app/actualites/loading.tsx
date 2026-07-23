import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Actualités"
        description="Toute l'actualité de Projet X : résultats, recrutement et vie du club."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </main>
    </>
  );
}
