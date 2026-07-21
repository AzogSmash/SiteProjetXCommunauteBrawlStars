"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { navLinks } from "@/lib/data";
import { LogoWordmark } from "./Logo";
import { AuthButton } from "./AuthButton";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">
        <a href="/" className="shrink-0">
          <LogoWordmark />
        </a>

        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                className={
                  active
                    ? "relative text-sm font-semibold uppercase tracking-wide text-foreground after:absolute after:-bottom-[18px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                    : "text-sm font-medium uppercase tracking-wide text-muted transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted md:flex">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un joueur, un club..."
              className="w-48 bg-transparent placeholder:text-muted focus:outline-none xl:w-64"
            />
          </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
