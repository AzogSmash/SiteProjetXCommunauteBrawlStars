import { PageHeader } from "@/components/PageHeader";
import { NewsCard } from "@/components/NewsCard";
import { DataUnavailable } from "@/components/DataUnavailable";
import { getFamilyNews } from "@/lib/family";

export default async function ActualitesPage() {
  const news = await getFamilyNews();

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="Actualités"
        description="Toute l'actualité de Projet X : résultats, recrutement et vie du club."
      />

      <main className="mx-auto max-w-7xl px-6 pb-14">
        {news.length === 0 ? (
          <DataUnavailable message="Aucune actualité publiée pour l'instant." showContact={false} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.title + item.time} {...item} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
