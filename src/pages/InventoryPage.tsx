import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { inventory, VEHICLE_COUNT, VEHICLE_MAKES, VEHICLE_TYPES } from '../data/inventory';
import { formatPrice } from '../lib/utils';
import { PageHero } from '../components/ui/PageHero';
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
  const [sort, setSort] = useState('featured');

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = inventory.filter(
      (v) =>
        (type === 'All' || v.type === type) &&
        (make === 'All' || v.make === make) &&
        v.price <= maxPrice &&
        v.monthly <= maxMonthly &&
        (!q || [v.name, v.make, v.type].some((s) => s.toLowerCase().includes(q))),
    );
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'miles-asc':
        return [...list].sort((a, b) => a.miles - b.miles);
      case 'monthly-asc':
        return [...list].sort((a, b) => a.monthly - b.monthly);
      default:
        return list;
    }
  }, [type, make, maxPrice, maxMonthly, query, sort]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const filterBar = (
    <>
      <div className="hidden flex-wrap items-center gap-3 lg:flex">
        <div className="relative w-full max-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search cars"
            className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--card)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
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
        <div className="hidden w-full max-w-[240px] lg:block">
          <Slider
            label="Max price"
            value={maxPrice}
            min={20000}
            max={90000}
            step={500}
            onChange={(v) => update({ maxPrice: String(v) })}
            displayValue={formatPrice(maxPrice)}
          />
        </div>
        <div className="ml-auto">
          <ChipSelect
            ariaLabel="Sort"
            value={sort}
            options={sortOptions}
            onChange={setSort}
          />
        </div>
        <span className="w-full text-sm text-[var(--muted-foreground)] lg:w-auto lg:min-w-[6rem] lg:text-right">
          {filtered.length} vehicles
        </span>
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search cars"
            className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--card)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
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
        subline={`${VEHICLE_COUNT} vehicles across ${VEHICLE_MAKES.length} makes. Every listing shows both the price and the payment.`}
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

          {shown.length === 0 && (
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
              filtered.length > 0 && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Showing all {filtered.length} matching vehicles.
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
            Show {filtered.length} vehicles
          </Button>
        </div>
      </Drawer>
    </>
  );
}
