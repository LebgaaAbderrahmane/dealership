import { useState } from 'react';
import { motion } from 'motion/react';
import { BadgeCheck, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { cn, formatPrice } from '../lib/utils';

const TERMS = [36, 48, 60, 72];
const APR = 0.069;

const BULLETS = [
  {
    icon: ShieldCheck,
    text: 'Soft credit check for pre-qualification — no impact on your score',
  },
  { icon: CreditCard, text: 'We work with 22 lenders, including credit unions' },
  { icon: BadgeCheck, text: 'Rates from 4.9% APR for qualified buyers' },
];

function computeMonthly(price: number, down: number, term: number) {
  const principal = Math.max(price - down, 0);
  if (principal === 0) return 0;
  const r = APR / 12;
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -term)));
}

export function PaymentCalculator() {
  const [price, setPrice] = useState(42000);
  const [down, setDown] = useState(5000);
  const [term, setTerm] = useState(60);
  const monthly = computeMonthly(price, down, term);

  return (
    <section id="financing" className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
      <div className="container-apex grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-3">Financing</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
            Know the Payment Before You Come In
          </h2>
          <p className="mt-5 max-w-lg font-light text-[var(--muted-foreground)]">
            Nobody enjoys discovering their real payment after three hours in a
            windowless office. Run the numbers here, get pre-qualified with a soft
            credit check, and arrive knowing exactly what you are signing.
          </p>

          <ul className="mt-8 space-y-4">
            {BULLETS.map((b, i) => (
              <motion.li
                key={b.text}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex items-start gap-3 text-sm text-[var(--foreground)]"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]">
                  <b.icon className="h-4 w-4" />
                </span>
                {b.text}
              </motion.li>
            ))}
          </ul>

          <div className="mt-9">
            <Button size="lg">Get Pre-Qualified</Button>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
              Soft credit check only — does not affect your score.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8 md:p-10"
        >
          <div className="space-y-7">
            <Slider
              label="Vehicle price"
              value={price}
              min={20000}
              max={90000}
              step={100}
              onChange={setPrice}
              displayValue={formatPrice(price)}
            />
            <Slider
              label="Down payment"
              value={down}
              min={0}
              max={30000}
              step={500}
              onChange={setDown}
              displayValue={formatPrice(down)}
            />
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Loan term</span>
                <span className="font-display text-sm font-bold tabular-nums text-[var(--foreground)]">
                  {term} months
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {TERMS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={cn(
                      'h-9 flex-1 rounded-full border px-3 text-sm font-semibold transition-colors',
                      t === term
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-8 text-center">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Estimated monthly
            </span>
            <motion.div
              key={monthly}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display text-5xl font-extrabold tabular-nums text-[var(--primary)] md:text-6xl"
            >
              ${monthly}
            </motion.div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {term} months at {(APR * 100).toFixed(1)}% APR · Estimate only, subject
              to credit approval
            </p>
          </div>
        </motion.div>
      </div>

      <div className="sticky bottom-0 z-20 mt-8 -mb-16 border-t border-[var(--border)] bg-[var(--card-elevated)]/95 px-6 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Estimated monthly
            </span>
            <motion.div
              key={monthly}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display text-3xl font-extrabold tabular-nums text-[var(--primary)]"
            >
              ${monthly}
            </motion.div>
          </div>
          <p className="max-w-[10rem] text-right text-xs text-[var(--muted-foreground)]">
            {term} months at {(APR * 100).toFixed(1)}% APR
          </p>
        </div>
      </div>
    </section>
  );
}
