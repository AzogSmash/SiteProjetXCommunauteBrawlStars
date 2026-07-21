export function Avatar({ name, color }: { name: string; color: string }) {
  // Array.from itère par point de code Unicode (pas par unité UTF-16) —
  // nécessaire pour les pseudos avec des caractères hors du BMP (ex "𝕏"),
  // sinon .charAt(0) coupe une paire de substitution en deux et produit un
  // rendu différent entre le serveur et le client (mismatch d'hydratation).
  const initial = Array.from(name.trim())[0] ?? "?";
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initial.toUpperCase()}
    </div>
  );
}
