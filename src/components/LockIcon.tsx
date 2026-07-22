import Image from "next/image";

export function LockIcon({ size = 22 }: { size?: number }) {
  return (
    <Image
      src="/icons/lock.png"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}
