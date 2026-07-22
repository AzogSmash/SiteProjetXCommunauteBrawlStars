import Image from "next/image";

export function SeasonClock({ size = 16 }: { size?: number }) {
  return (
    <Image
      src="/clock.gif"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      // Sans ça Next.js ré-encode le gif à l'optimisation et perd l'animation.
      unoptimized
      className="shrink-0"
    />
  );
}
