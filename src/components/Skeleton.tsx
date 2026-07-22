export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

// Ligne générique (avatar + nom + valeur) — utilisée par les loading.tsx des
// pages qui affichent des listes de joueurs (classement, pusheurs, effectif club...).
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2">
      <Skeleton className="h-4 w-5 shrink-0 rounded" />
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <Skeleton className="h-4 flex-1 rounded" />
      <Skeleton className="h-4 w-12 shrink-0 rounded" />
    </div>
  );
}
