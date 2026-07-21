import { communityDescription, discordInviteUrl } from "@/lib/data";

export function AboutPanel() {
  return (
    <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">
        À propos
      </h2>
      <p className="text-sm leading-relaxed text-muted">{communityDescription}</p>
      <div className="mt-5 flex items-center gap-3">
        <a
          href={discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary-2"
        >
          <DiscordIcon />
        </a>
        <a
          href="#"
          aria-label="Twitter / X"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary-2"
        >
          <XIcon />
        </a>
        <a
          href="#"
          aria-label="YouTube"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary-2"
        >
          <YoutubeIcon />
        </a>
      </div>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.3 5.3A18 18 0 0 0 15.9 4l-.3.6a13 13 0 0 1 3.7 1.4A16 16 0 0 0 12 4a16 16 0 0 0-7.3 2 13 13 0 0 1 3.8-1.4L8.1 4a18 18 0 0 0-4.4 1.3C1.6 9 1 12.6 1.2 16.1a18 18 0 0 0 5.4 2.7l.8-1.3a12 12 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.9 0l.5.4c-.6.4-1.2.6-1.9.9l.8 1.3a18 18 0 0 0 5.4-2.7c.3-4-.6-7.6-2.4-10.8ZM8.7 14.2c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm6.6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7-6.3 7H1.5l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.6-.5-5.3a3 3 0 0 0-2.1-2.1C18.7 4 12 4 12 4s-6.7 0-8.4.6a3 3 0 0 0-2.1 2.1C1 8.4 1 12 1 12s0 3.6.5 5.3a3 3 0 0 0 2.1 2.1C5.3 20 12 20 12 20s6.7 0 8.4-.6a3 3 0 0 0 2.1-2.1C23 15.6 23 12 23 12ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}
