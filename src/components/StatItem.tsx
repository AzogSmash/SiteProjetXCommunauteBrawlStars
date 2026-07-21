export function StatItem({
  icon: Icon,
  iconNode,
  label,
  value,
  sub,
  numeric = false,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconNode?: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  // Police du jeu (Lilita One) pour les valeurs chiffrées (trophées, élo...) —
  // pas pour du texte libre (nom de joueur, type de club...), où elle jurerait.
  numeric?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary-2/10 text-primary-2">
        {iconNode ?? <Icon size={22} />}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className={`truncate text-xl text-foreground ${numeric ? "font-game" : "font-bold"}`}>
          {value}
        </p>
        <p className="text-xs font-medium text-primary-2">{sub}</p>
      </div>
    </div>
  );
}
