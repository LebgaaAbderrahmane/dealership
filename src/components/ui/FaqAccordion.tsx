import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-base font-bold text-[var(--foreground)]">
              {item.q}
            </h3>
            <ChevronDown className="h-5 w-5 shrink-0 text-[var(--primary)] transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="border-t border-[var(--border)] px-5 py-4 text-sm font-light text-[var(--muted-foreground)]">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
