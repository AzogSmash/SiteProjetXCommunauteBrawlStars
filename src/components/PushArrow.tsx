import Image from "next/image";

// positive/négatif déterminé depuis la valeur déjà formatée (ex: "+4.582"
// ou "-120") plutôt que de faire remonter un nombre brut supplémentaire —
// le signe "-" natif suffit, pas besoin de toucher le type Player.
export function PushArrow({ value, size = 16 }: { value: string; size?: number }) {
  const positive = !value.trim().startsWith("-");
  return (
    <Image
      src={positive ? "/arrowUp.png" : "/arrowDown.png"}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}
