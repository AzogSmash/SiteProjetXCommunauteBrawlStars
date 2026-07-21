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
    <div className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </h2>
        {linkLabel && linkHref && (
          <a
            href={linkHref}
            className="text-xs font-semibold uppercase tracking-wide text-primary-2 hover:text-primary"
          >
            {linkLabel}
          </a>
        )}
      </div>
      {children}
    </div>
  );
}
