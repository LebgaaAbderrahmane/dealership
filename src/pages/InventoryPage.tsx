import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'react-router';
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { VEHICLE_MAKES, VEHICLE_TYPES } from '../types/vehicle';
import { useMeta, useVehicles } from '../lib/vehicles';
import { cn, formatPrice } from '../lib/utils';
import { PageHero } from '../components/ui/PageHero';
import { HERO_IMAGE } from '../data/inventory';
import { ChipSelect } from '../components/ui/chip-select';
import { Slider } from '../components/ui/slider';
import { Drawer } from '../components/ui/drawer';
import { Button } from '../components/ui/button';
import { VehicleCard } from '../components/VehicleCard';

const PAGE_SIZE = 9;

const typeOptions = [
  { value: 'All', label: 'All types' },
  ...VEHICLE_TYPES.map((t) => ({ value: t, label: t })),
];

const makeOptions = [
  { value: 'All', label: 'All makes' },
  ...VEHICLE_MAKES.map((m) => ({ value: m, label: m })),
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'miles-asc', label: 'Mileage: low to high' },
  { value: 'monthly-asc', label: 'Payment: low to high' },
];

export function InventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sort, setSort] = useState('featured');
  const priceRef = useRef<HTMLDivElement>(null);
  const meta = useMeta();

  useEffect(() => {
    if (!priceOpen) return;
    const onDown = (e: PointerEvent) => {
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPriceOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [priceOpen]);

  const type = searchParams.get('type') ?? 'All';
  const make = searchParams.get('make') ?? 'All';
  const maxPrice = Number(searchParams.get('maxPrice')) || 90000;
  const maxMonthly = Number(searchParams.get('maxMonthly')) || 10000;
  const query = searchParams.get('q') ?? '';

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === 'All' || value === String(90000) || value === String(10000) || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
    setVisible(PAGE_SIZE);
  };

  const hasActiveFilters =
    type !== 'All' || make !== 'All' || maxPrice !== 90000 || maxMonthly !== 10000 || query !== '';

  const clearFilters = () => {
    setSearchParams({});
    setVisible(PAGE_SIZE);
  };

  const { vehicles: shown, total, loading } = useVehicles({
    type,
    make,
    maxPrice,
    maxMonthly,
    q: query,
    sort,
    limit: visible,
  });

  const hasMore = total > visible;
  const metaCount = meta?.count;
  const metaMakes = meta?.makes ?? VEHICLE_MAKES;

  const filterBar = (
    <>
      <div className="hidden flex-wrap items-center gap-3 lg:flex">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search cars"
            className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--card)] pl-9 pr-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => update({ q: '' })}
              className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <ChipSelect
          ariaLabel="Type"
          value={type}
          options={typeOptions}
          onChange={(v) => update({ type: v })}
        />
        <ChipSelect
          ariaLabel="Make"
          value={make}
          options={makeOptions}
          onChange={(v) => update({ make: v })}
        />
        <div ref={priceRef} className="relative hidden lg:block">
          <button
            type="button"
            aria-label="Max price"
            onClick={() => setPriceOpen((o) => !o)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium text-[var(--foreground)] transition-colors',
              priceOpen
                ? 'border-[var(--primary)] bg-[var(--card)]'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)]',
            )}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Price
            </span>
            <span>{maxPrice >= 90000 ? 'Any' : formatPrice(maxPrice)}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          </button>
          <AnimatePresence>
            {priceOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--card-elevated)] p-5 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.8)]"
              >
                <Slider
                  label="Max price"
                  value={maxPrice}
                  min={20000}
                  max={90000}
                  step={500}
                  onChange={(v) => update({ maxPrice: String(v) })}
                  displayValue={formatPrice(maxPrice)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="ml-auto">
          <ChipSelect
            ariaLabel="Sort"
            value={sort}
            options={sortOptions}
            onChange={setSort}
          />
        </div>
        <span className="w-full text-sm font-semibold tabular-nums text-[var(--foreground)] lg:w-auto lg:min-w-[6rem] lg:text-right">
          {total} vehicles
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search cars"
            className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--card)] pl-9 pr-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => update({ q: '' })}
              className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Filters"
          onClick={() => setSheetOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  return (
    <>
      <PageHero
        eyebrow="In stock now"
        title="Browse Inventory"
        subline={`${metaCount ?? 'All'} vehicles across ${metaMakes.length} makes. Every listing shows both the price and the payment.`}
        image={HERO_IMAGE}
        alt="Apex Motors inventory on a city street at night"
      />

      <div className="sticky top-[76px] z-30 border-y border-[var(--border)] bg-[var(--background)]/95 py-3 backdrop-blur">
        <div className="container-apex">{filterBar}</div>
      </div>

      <section className="bg-[var(--background)] py-12 md:py-16">
        <div className="container-apex">
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {shown.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </AnimatePresence>
          </motion.div>

          {loading && shown.length === 0 && (
            <p className="py-16 text-center text-sm text-[var(--muted-foreground)]">
              Loading inventory…
            </p>
          )}

          {!loading && shown.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center text-[var(--muted-foreground)]"
            >
              No vehicles match those filters — try widening your price range or
              clearing a filter.
            </motion.p>
          )}

          <div className="mt-14 flex justify-center">
            {hasMore ? (
              <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                <Filter className="h-4 w-4" />
                Load more
              </Button>
            ) : (
              total > 0 && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Showing all {total} matching vehicles.
                </p>
              )
            )}
          </div>
        </div>
      </section>

      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter inventory">
        <div className="space-y-6">
          <ChipSelect
            ariaLabel="Type"
            value={type}
            options={typeOptions}
            onChange={(v) => update({ type: v })}
            className="w-full justify-between"
          />
          <ChipSelect
            ariaLabel="Make"
            value={make}
            options={makeOptions}
            onChange={(v) => update({ make: v })}
            className="w-full justify-between"
          />
          <Slider
            label="Max price"
            value={maxPrice}
            min={20000}
            max={90000}
            step={500}
            onChange={(v) => update({ maxPrice: String(v) })}
            displayValue={formatPrice(maxPrice)}
          />
          <ChipSelect
            ariaLabel="Sort"
            value={sort}
            options={sortOptions}
            onChange={setSort}
            className="w-full justify-between"
          />
          <Button className="w-full py-4" onClick={() => setSheetOpen(false)}>
            Show {total} vehicles
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" className="w-full" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
}
