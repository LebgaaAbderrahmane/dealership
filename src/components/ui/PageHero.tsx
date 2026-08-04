import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subline?: ReactNode;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, subline, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)] pt-[132px] pb-14 md:pb-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--primary) 14%, transparent), transparent)',
        }}
      />
      <div className="container-apex relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="max-w-3xl font-display text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
            {title}
          </h1>
          {subline && (
            <p className="mt-5 max-w-2xl font-light text-[var(--muted-foreground)]">
              {subline}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
