import { PageHeader } from "@/components/PageHeader";
import { NewsCard } from "@/components/NewsCard";
import { allNews } from "@/lib/data";

export default function ActualitesPage() {
  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Actualités"
        description="Toute l'actualité de Projet X : résultats, recrutement et vie du club."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allNews.map((item) => (
            <NewsCard key={item.title} {...item} />
          ))}
        </div>
      </main>
    </>
  );
}
