import Image from "next/image";
import { tierIconPath } from "@/lib/tiers";

export function TierIcon({ tier, size = 16 }: { tier: string; size?: number }) {
  return (
    <Image
      src={tierIconPath(tier)}
      alt={tier}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}
