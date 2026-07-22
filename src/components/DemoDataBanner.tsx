import { TriangleAlert } from "lucide-react";

// Affichée quand le bot est injoignable (API_BASE non configuré, hors
// ligne, timeout...) — dans ce cas les pages retombent silencieusement sur
// des données de démo (voir lib/family.ts), ce qui doit être visible plutôt
// qu'implicite pour des key users en pré-prod.
export function DemoDataBanner() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs font-semibold text-amber-600">
      <TriangleAlert size={14} className="shrink-0" />
      Le serveur de données est injoignable — certaines statistiques affichées sont des exemples, pas les vraies données.
    </div>
  );
}
