import Image from "next/image";

export function MembersIcon({ size = 22 }: { size?: number }) {
  return (
    <Image
      src="/membres.png"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}
