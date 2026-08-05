import { useState } from 'react';
import { motion } from 'motion/react';
import { BadgeDollarSign, RotateCcw } from 'lucide-react';
import { Field, Input, Select } from '../ui/field';
import { Button } from '../ui/button';
import { formatDistance, formatPrice } from '../../lib/utils';

interface OfferInputs {
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  condition: string;
}

const MAKE_BASE: Record<string, number> = {
  Aurora: 24500,
  Vantage: 26000,
  Nimbus: 28000,
  Ridgeback: 27000,
  Corsa: 25000,
  Meridian: 22000,
};

const CONDITION_MULT = { Excellent: 1.15, Good: 1, Fair: 0.82, Poor: 0.6 } as const;

const INITIAL: OfferInputs = {
  year: '',
  make: 'Aurora',
  model: '',
  trim: '',
  mileage: '',
  condition: 'Good',
};

function estimateOffer(inputs: OfferInputs): number {
  const base = MAKE_BASE[inputs.make] ?? 24000;
  const year = Number(inputs.year) || 2021;
  const km = Number(inputs.mileage) || 48000;
  const miles = km / 1.609344;
  const age = 2026 - year;
  const ageFactor = Math.max(0.45, 1 - age * 0.06);
  const milesFactor = Math.max(0.55, 1 - miles / 120000);
  const mult = CONDITION_MULT[inputs.condition as keyof typeof CONDITION_MULT] ?? 1;
  const value = Math.round(((base * ageFactor * milesFactor * mult) / 100) * 100);
  return Math.max(value, 1500);
}

export function TradeInOfferForm() {
  const [inputs, setInputs] = useState<OfferInputs>(INITIAL);
  const [offer, setOffer] = useState<number | null>(null);

  const set = (key: keyof OfferInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setOffer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOffer(estimateOffer(inputs));
  };

  if (offer !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8 text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)]">
          <BadgeDollarSign className="h-6 w-6 text-[var(--success)]" />
        </span>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Your estimated trade-in offer
        </p>
        <p className="mt-2 font-display text-5xl font-extrabold tabular-nums text-[var(--primary)]">
          {formatPrice(offer)}
        </p>
        <p className="mt-4 text-sm font-light text-[var(--muted-foreground)]">
          For the {inputs.year || '—'} {inputs.make} {inputs.model} ({inputs.condition},{' '}
          {inputs.mileage ? formatDistance(Number(inputs.mileage)) : '—'}). Bring it
          in and we'll verify in about fifteen minutes.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => setOffer(null)}>
            <RotateCcw className="h-4 w-4" />
            Adjust details
          </Button>
          <p className="text-xs text-[var(--muted-foreground)]">
            Offers good for 7 days and 800 km.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Year">
          <Input required type="number" placeholder="2020" value={inputs.year} onChange={(e) => set('year', e.target.value)} />
        </Field>
        <Field label="Make">
          <Select value={inputs.make} onChange={(e) => set('make', e.target.value)}>
            {Object.keys(MAKE_BASE).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Model">
          <Input required placeholder="GT Line" value={inputs.model} onChange={(e) => set('model', e.target.value)} />
        </Field>
        <Field label="Trim (optional)">
          <Input placeholder="Touring" value={inputs.trim} onChange={(e) => set('trim', e.target.value)} />
        </Field>
        <Field label="Mileage">
          <Input required type="number" placeholder="72000" value={inputs.mileage} onChange={(e) => set('mileage', e.target.value)} />
        </Field>
        <Field label="Condition">
          <Select value={inputs.condition} onChange={(e) => set('condition', e.target.value)}>
            {Object.keys(CONDITION_MULT).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full py-4">
        Get My Offer
      </Button>
      <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
        Not a range — an actual number backed by current auction and retail data.
      </p>
    </form>
  );
}
