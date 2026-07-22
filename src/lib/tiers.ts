// Paliers réels du ranked BS tels que renvoyés par le bot (RANKED_TIERS dans
// main.py) : Bronze/Argent/Or/Diamant/Mythique/Légende 1-3, puis Masters 1-3
// et Pro. Vérifié depuis le code plutôt que deviné — "Légende" et non
// "Légendaire".
export function tierColorClass(tier: string): string {
  const t = tier.toLowerCase();
  if (t.includes("pro")) return "text-emerald-600 font-black";
  if (t.includes("masters")) return "text-yellow-500";
  if (t.includes("légende") || t.includes("legende")) return "text-red-500";
  if (t.includes("mythique")) return "text-primary-2";
  if (t.includes("diamant")) return "text-sky-500";
  if (t.includes("or")) return "text-amber-600";
  if (t.includes("argent")) return "text-slate-500";
  if (t.includes("bronze")) return "text-amber-800";
  return "text-muted";
}

const TIER_FAMILIES = ["bronze", "argent", "or", "diamant", "mythique", "legende", "masters"];

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Icônes officielles du ranked BS (mêmes assets que le bot Discord), voir
// public/ranked-tiers/. Retombe sur Bronze 1 si le format ne correspond à
// aucun palier réel connu (ex: anciennes données de démo en chiffres romains).
export function tierIconPath(tier: string): string {
  const t = stripAccents(tier.toLowerCase()).trim();
  if (t.startsWith("pro")) return "/ranked-tiers/pro.png";
  const match = t.match(/^([a-z]+)\s*(\d+)/);
  const family = match?.[1];
  const number = match?.[2];
  if (family && number && TIER_FAMILIES.includes(family)) {
    return `/ranked-tiers/${family}-${number}.png`;
  }
  return "/ranked-tiers/bronze-1.png";
}
