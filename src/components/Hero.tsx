import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { HERO_IMAGE, VEHICLE_MAKES } from '../data/inventory';
import { Button } from './ui/button';
import { ChipSelect } from './ui/chip-select';
import { Slider } from './ui/slider';
import { Drawer } from './ui/drawer';
import type { VehicleFilters } from '../lib/filters';

const HERO_LINES = ['Find it. Finance it.', 'Drive it home', 'today.'];

interface HeroProps {
  filters: VehicleFilters;
  onFiltersChange: (next: VehicleFilters) => void;
  onSearch: () => void;
}

export function Hero({ filters, onFiltersChange, onSearch }: HeroProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [localMake, setLocalMake] = useState(filters.make);
  const [localQuery, setLocalQuery] = useState(filters.query);
  const [localMonthly, setLocalMonthly] = useState(
    filters.maxMonthly >= 10000 ? 800 : filters.maxMonthly,
  );

  const applySearch = () => {
    onFiltersChange({
      ...filters,
      make: localMake,
      maxMonthly: localMonthly,
      query: localQuery,
    });
    onSearch();
    setSearchOpen(false);
  };

  const makeOptions = [
    { value: 'All', label: 'All makes' },
    ...VEHICLE_MAKES.map((m) => ({ value: m, label: m })),
  ];

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden bg-[var(--background)]">
      <img
        src={HERO_IMAGE}
        alt="Sleek modern car on a wet city street at night"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(18,20,26,0.95) 0%, rgba(18,20,26,0.6) 45%, rgba(18,20,26,0.25) 100%)',
        }}
      />

      <div className="container-apex relative pt-[110px] pb-20 md:pl-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="eyebrow mb-6"
        >
          Miami, FL · 340 vehicles in stock · Open 7 days
        </motion.p>

        <h1 className="max-w-3xl font-display font-extrabold leading-none tracking-[-0.035em] text-[var(--foreground)] [font-size:clamp(40px,5.6vw,88px)]">
          {HERO_LINES.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.45 }}
          className="mt-6 max-w-xl text-base font-light text-[color-mix(in_srgb,var(--foreground)_80%,transparent)] md:text-lg"
        >
          New and certified pre-owned across twelve makes, with transparent pricing
          and no four-hour finance office marathon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Button size="lg" onClick={onSearch}>
            Browse Inventory
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="ghost" onClick={() => document.querySelector('#trade-in')?.scrollIntoView({ behavior: 'smooth' })}>
            Value My Trade
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 hidden max-w-3xl items-stretch gap-4 rounded-2xl border border-[var(--border)] bg-white/[0.04] p-4 backdrop-blur-xl md:flex"
          style={{ boxShadow: '0 20px 60px -20px rgba(10,144,255,0.35)' }}
        >
          <div className="flex-1">
            <ChipSelect
              ariaLabel="Make"
              value={localMake}
              options={makeOptions}
              onChange={setLocalMake}
              className="w-full justify-between"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Model"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div className="flex-[1.4] px-2 py-1">
            <Slider
              label="Max monthly payment"
              value={localMonthly}
              min={300}
              max={1500}
              step={50}
              onChange={setLocalMonthly}
              displayValue={`$${localMonthly}/mo`}
            />
          </div>
          <Button size="md" onClick={applySearch}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:hidden"
        >
          <Button
            className="w-full py-4"
            size="lg"
            variant="ghost"
            onClick={() => setSearchOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Search inventory
          </Button>
        </motion.div>
      </div>

      <Drawer open={searchOpen} onClose={() => setSearchOpen(false)} title="Search inventory">
        <div className="space-y-5">
          <ChipSelect
            ariaLabel="Make"
            value={localMake}
            options={makeOptions}
            onChange={setLocalMake}
            className="w-full justify-between"
          />
          <input
            type="text"
            placeholder="Model"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
          <Slider
            label="Max monthly payment"
            value={localMonthly}
            min={300}
            max={1500}
            step={50}
            onChange={setLocalMonthly}
            displayValue={`$${localMonthly}/mo`}
          />
          <Button className="w-full py-4" onClick={applySearch}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </Drawer>
    </section>
  );
}
