import Image from "next/image";
import { Shield, MessageCircle, Trophy } from "lucide-react";

export type NewsIcon = "skull" | "shield" | "message" | "trophy";

function NewsIconGraphic({ icon }: { icon: NewsIcon }) {
  if (icon === "skull") {
    // Vraie icône de palier "Pro" du jeu — utilisée pour les actus de victoire
    // en ranked, plus parlante que l'ancienne icône générique.
    return <Image src="/ranked-tiers/pro.png" alt="" width={24} height={24} />;
  }
  const Icon = { shield: Shield, message: MessageCircle, trophy: Trophy }[icon];
  return <Icon size={18} />;
}

export function NewsCard({
  icon,
  title,
  description,
  time,
}: {
  icon: NewsIcon;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-primary-2/10 text-primary-2">
        <NewsIconGraphic icon={icon} />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <p className="mt-auto text-[11px] font-medium text-muted/70">{time}</p>
    </div>
  );
}
