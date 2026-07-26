export function Panel({
  title,
  linkLabel,
  linkHref,
  children,
  className = "",
}: {
  title: string;
  linkLabel?: string;
  linkHref?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-elevated rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </h2>
        {linkLabel && linkHref && (
          <a
            href={linkHref}
            className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary-2 hover:text-primary"
          >
            {linkLabel}
          </a>
        )}
      </div>
      {children}
    </div>
  );
}
