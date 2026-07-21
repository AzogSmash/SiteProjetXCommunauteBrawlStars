import Image from "next/image";

export function TrophyIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icons/trophy.png"
      alt="Trophées"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
    />
  );
}
