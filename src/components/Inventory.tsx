import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Filter, SlidersHorizontal } from 'lucide-react';
import { inventory, VEHICLE_COUNT, VEHICLE_MAKES, VEHICLE_TYPES } from '../data/inventory';
import type { VehicleFilters } from '../lib/filters';
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
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(
    () =>
      inventory.filter(
        (v) =>
          (filters.type === 'All' || v.type === filters.type) &&
          (filters.make === 'All' || v.make === filters.make) &&
          v.price <= filters.maxPrice &&
          v.monthly <= filters.maxMonthly,
      ),
    [filters],
  );

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const update = (patch: Partial<VehicleFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  const filterBar = (
    <>
      <div className="flex flex-wrap items-center gap-3">
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
          {filtered.length} vehicles
        </span>
      </div>

      <div className="mt-4 lg:hidden">
        <Button
          variant="ghost"
          className="w-full justify-between py-3"
          onClick={() => setSheetOpen(true)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[var(--primary)]" />
            Filters
          </span>
          <span className="font-display text-sm font-bold tabular-nums text-[var(--primary)]">
            {formatPrice(filters.maxPrice)}
          </span>
        </Button>
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

      <div className="sticky top-[76px] z-30 mt-10 border-y border-[var(--border)] bg-[var(--background)]/95 py-4 backdrop-blur">
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

        {shown.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-[var(--muted-foreground)]"
          >
            No vehicles match those filters — try widening your price range.
          </motion.p>
        )}

        <div className="mt-14 flex flex-col items-center gap-5">
          {hasMore && (
            <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              <Filter className="h-4 w-4" />
              Load more
            </Button>
          )}
          {!hasMore && filtered.length > 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing all {filtered.length} matching vehicles.
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
            Show {filtered.length} vehicles
          </Button>
        </div>
      </Drawer>
    </section>
  );
}
