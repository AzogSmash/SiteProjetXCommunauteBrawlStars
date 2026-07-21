import { news } from "@/lib/data";
import { Panel } from "./Panel";
import { NewsCard } from "./NewsCard";

export function NewsSection() {
  return (
    <Panel title="Dernières actualités" linkLabel="Voir tout" linkHref="/actualites">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {news.map((item) => (
          <NewsCard key={item.title} {...item} />
        ))}
      </div>
    </Panel>
  );
}
