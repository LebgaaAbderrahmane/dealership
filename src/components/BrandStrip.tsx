import { BRAND_LOGOS } from '../data/brandLogos';

export function BrandStrip() {
  const brands = Object.entries(BRAND_LOGOS);
  const row = [...brands, ...brands];
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)]">
      <div className="container-apex flex items-center gap-12 py-8">
        <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] md:block">
          Our brands
        </span>
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
            {row.map(([brand, path], i) => (
              <span key={`${brand}-${i}`} className="flex items-center" title={brand}>
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10 fill-current text-[var(--muted-foreground)]/55"
                  aria-label={brand}
                  role="img"
                >
                  <path d={path} />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}