import Image from "next/image";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded-xl bg-white p-1.5 shadow-[0_2px_12px_rgba(113,54,186,0.18)]"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-x-square.png"
        alt="Projet X"
        fill
        sizes={`${size}px`}
        className="object-contain p-1"
      />
    </div>
  );
}

export function LogoWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={38} />
      <span className="font-display text-base tracking-[0.15em] text-foreground">
        PROJET <span className="text-gradient-primary">X</span>
      </span>
    </div>
  );
}
