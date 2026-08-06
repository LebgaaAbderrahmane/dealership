import type { ReactNode } from 'react';
import { PageHero } from './PageHero';

interface LegalDocProps {
  eyebrow: string;
  title: string;
  updated: string;
  image: string;
  children: ReactNode;
}

export function LegalDoc({ eyebrow, title, updated, image, children }: LegalDocProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subline={`Last updated: ${updated}`} image={image} />
      <section className="bg-[var(--background)] py-12 md:py-20">
        <div className="container-apex max-w-3xl">
          <div className="legal-prose rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:p-12">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
