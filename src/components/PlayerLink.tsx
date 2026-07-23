import Link from "next/link";

// Rend un nom de joueur cliquable vers /joueurs/[tag] — retombe sur du
// texte simple quand le tag n'est pas connu (ex: joueur 1v1/casino sans
// compte Brawl Stars lié à Discord).
export function PlayerLink({
  tag,
  children,
  className = "",
}: {
  tag?: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  if (!tag) {
    return <span className={className}>{children}</span>;
  }
  return (
    <Link
      href={`/joueurs/${encodeURIComponent(tag.replace(/^#/, ""))}`}
      className={`hover:text-primary-2 hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}
