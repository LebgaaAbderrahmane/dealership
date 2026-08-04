import type { ReactNode } from 'react';
import { PageHero } from './PageHero';

interface LegalDocProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalDoc({ eyebrow, title, updated, children }: LegalDocProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subline={`Last updated: ${updated}`} />
      <section className="bg-[var(--background)] py-12 md:py-20">
        <div className="container-apex max-w-3xl">
          <div className="legal-prose rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-12">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
