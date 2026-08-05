import type { ReactNode } from 'react';

interface PageTitleProps {
  eyebrow: string;
  title: ReactNode;
  subline?: ReactNode;
}

export function PageTitle({ eyebrow, title, subline }: PageTitleProps) {
  return (
    <header className="bg-[var(--background)] pt-[132px] pb-10 md:pb-14">
      <div className="container-apex text-center">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="mx-auto max-w-3xl font-display text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
          {title}
        </h1>
        {subline && (
          <p className="mx-auto mt-5 max-w-2xl font-light text-[var(--muted-foreground)]">
            {subline}
          </p>
        )}
      </div>
    </header>
  );
}
