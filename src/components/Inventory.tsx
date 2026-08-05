import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { VEHICLE_COUNT } from '../data/inventory';
import { VEHICLE_MAKES, VEHICLE_TYPES } from '../types/vehicle';
import type { VehicleFilters } from '../lib/filters';
import { useVehicles } from '../lib/vehicles';
import { cn, formatPrice } from '../lib/utils';
import { Button } from './ui/button';
import { ChipSelect } from './ui/chip-select';
import { Slider } from './ui/slider';
import { Drawer } from './ui/drawer';
import { VehicleCard } from './VehicleCard';

const PAGE_SIZE = 9;

const typeOptions = [
  { value: 'All', label: 'All types' },
  ...VEHICLE_TYPES.map((t) => ({ value: t, label: t })),
];

const makeOptions = [
  { value: 'All', label: 'All makes' },
  ...VEHICLE_MAKES.map((m) => ({ value: m, label: m })),
];

interface InventoryProps {
  filters: VehicleFilters;
  onFiltersChange: (next: VehicleFilters) => void;
}

export function Inventory({ filters, onFiltersChange }: InventoryProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const { vehicles: shown, total, loading } = useVehicles({
    type: filters.type,
    make: filters.make,
    maxPrice: filters.maxPrice,
    maxMonthly: filters.maxMonthly,
    q: filters.query,
    limit: PAGE_SIZE,
  });

  const update = (patch: Partial<VehicleFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  const filterBar = (
    <>
      <div className="hidden flex-wrap items-center gap-3 lg:flex">
        <div className="relative w-full max-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Search cars"
            className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--card)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <ChipSelect
          ariaLabel="Type"
          value={filters.type}
          options={typeOptions}
          onChange={(v) => update({ type: v })}
        />
        <ChipSelect
          ariaLabel="Make"
          value={filters.make}
          options={makeOptions}
          onChange={(v) => update({ make: v })}
        />
        <div className="hidden w-full max-w-[260px] lg:block">
          <Slider
            label="Max price"
            value={filters.maxPrice}
            min={20000}
            max={90000}
            step={500}
            onChange={(v) => update({ maxPrice: v })}
            displayValue={formatPrice(filters.maxPrice)}
          />
        </div>
        <span className="ml-auto text-sm text-[var(--muted-foreground)]">
          {total} vehicles
        </span>
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
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
    <section id="inventory" className="bg-[var(--background)] py-16 md:py-24">
      <div className="container-apex">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-3">In stock now</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
            Browse Inventory
          </h2>
        </motion.div>
      </div>

      <div className="sticky top-[76px] z-30 mt-10 border-y border-[var(--border)] bg-[var(--background)]/95 py-3 backdrop-blur">
        <div className="container-apex">{filterBar}</div>
      </div>

      <div className="container-apex mt-10">
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
            No vehicles match those filters — try widening your price range.
          </motion.p>
        )}

        <div className="mt-14 flex flex-col items-center gap-5">
          {total <= PAGE_SIZE && total > 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing all {total} matching vehicles.
            </p>
          )}
          <Link
            to="/inventory"
            className="group flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
          >
            View all {VEHICLE_COUNT} vehicles
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter inventory">
        <div className="space-y-6">
          <ChipSelect
            ariaLabel="Type"
            value={filters.type}
            options={typeOptions}
            onChange={(v) => update({ type: v })}
            className="w-full justify-between"
          />
          <ChipSelect
            ariaLabel="Make"
            value={filters.make}
            options={makeOptions}
            onChange={(v) => update({ make: v })}
            className="w-full justify-between"
          />
          <Slider
            label="Max price"
            value={filters.maxPrice}
            min={20000}
            max={90000}
            step={500}
            onChange={(v) => update({ maxPrice: v })}
            displayValue={formatPrice(filters.maxPrice)}
          />
          <Button
            className={cn('w-full py-4')}
            onClick={() => setSheetOpen(false)}
          >
            Show {total} vehicles
          </Button>
        </div>
      </Drawer>
    </section>
  );
}
