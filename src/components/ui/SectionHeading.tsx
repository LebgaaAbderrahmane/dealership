import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subline?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, subline, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
        {title}
      </h2>
      {subline && (
        <p className="mt-5 font-light text-[var(--muted-foreground)]">{subline}</p>
      )}
    </motion.div>
  );
}
