import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subline?: ReactNode;
  children?: ReactNode;
  image: string;
  alt?: string;
}

export function PageHero({ eyebrow, title, subline, children, image, alt }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)] pt-[132px] pb-12 md:pb-16">
      <img
        src={image}
        alt={alt ?? `${eyebrow} — Apex Motors`}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(18,20,26,0.82), rgba(18,20,26,0.88))',
        }}
      />
      <div className="container-apex relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="mx-auto max-w-3xl font-display text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
            {title}
          </h1>
          {subline && (
            <p className="mx-auto mt-5 max-w-2xl font-light text-[color-mix(in_srgb,var(--foreground)_82%,transparent)]">
              {subline}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
