// Images des "meilleurs builds" (voir /best-builds) : fichiers statiques
// nommés par brawler_slug (kebab-case, ex: "el-primo"), pas de champ dédié
// côté API — même logique dérivée que tierIconPath() dans lib/tiers.ts.
export function brawlerBuildImagePath(brawlerSlug: string): string {
  return `/brawler-builds/${brawlerSlug}.png`;
}
