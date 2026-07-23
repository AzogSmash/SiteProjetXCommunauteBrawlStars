import { getFamilyNews } from "@/lib/family";
import { Panel } from "./Panel";
import { NewsCard } from "./NewsCard";
import { DataUnavailable } from "./DataUnavailable";

export async function NewsSection() {
  const news = await getFamilyNews(3);
  return (
    <Panel title="Dernières actualités" linkLabel="Voir tout" linkHref="/actualites">
      {news.length === 0 ? (
        <DataUnavailable message="Aucune actualité publiée pour l'instant." showContact={false} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.title + item.time} {...item} />
          ))}
        </div>
      )}
    </Panel>
  );
}
