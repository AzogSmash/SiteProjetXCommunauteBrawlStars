// Petit repère en coin façon "viseur technique", motif récurrent de la
// charte graphique (voir bannière.png). Purement décoratif.
export function BrandCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      className={`text-primary-2/40 ${className}`}
      fill="none"
    >
      <path d="M2 9V2h7" stroke="currentColor" strokeWidth={1.4} />
    </svg>
  );
}
