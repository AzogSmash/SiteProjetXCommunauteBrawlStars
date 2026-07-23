"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, CircleUserRound, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { LogoWordmark } from "./Logo";
import { AuthButton } from "./AuthButton";

export function Navbar({ bsTag }: { bsTag: string | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileHref = bsTag ? `/joueurs/${encodeURIComponent(bsTag.replace(/^#/, ""))}` : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">
        <Link href="/" className="shrink-0">
          <LogoWordmark />
        </Link>

        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={
                  active
                    ? "relative text-sm font-semibold uppercase tracking-wide text-foreground after:absolute after:-bottom-[18px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                    : "text-sm font-medium uppercase tracking-wide text-muted transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted md:flex">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un joueur, un club..."
              className="w-48 bg-transparent placeholder:text-muted focus:outline-none xl:w-64"
            />
          </div>
          {profileHref && (
            <Link
              href={profileHref}
              aria-label="Mon profil"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/60 hover:text-foreground sm:flex"
            >
              <CircleUserRound size={17} />
              Mon profil
            </Link>
          )}
          <AuthButton />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border px-6 py-3 lg:hidden">
          <div className="mb-2 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted md:hidden">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un joueur, un club..."
              className="w-full bg-transparent placeholder:text-muted focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    active
                      ? "rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-2"
                      : "rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground/90 hover:bg-surface-2"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
            {profileHref && (
              <Link
                href={profileHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground/90 hover:bg-surface-2 sm:hidden"
              >
                <CircleUserRound size={16} />
                Mon profil
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
