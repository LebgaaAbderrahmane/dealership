import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { TRADE_IN_IMAGE } from '../data/inventory';
import { Button } from './ui/button';

const STEPS = [
  {
    title: 'Tell us about it',
    body: 'Year, make, model, mileage, and honest condition. Two minutes.',
  },
  {
    title: 'Get a real number',
    body: 'Not a range. An actual offer, backed by our current auction and retail data.',
  },
  {
    title: 'Bring it in',
    body: 'We verify the condition, and if it matches, the offer stands. Apply it to a purchase or take a cheque.',
  },
];

const FIELDS = [
  { name: 'Year', type: 'text', placeholder: 'e.g. 2020' },
  { name: 'Make', type: 'text', placeholder: 'e.g. Aurora' },
  { name: 'Model', type: 'text', placeholder: 'e.g. GT Line' },
  { name: 'Mileage', type: 'text', placeholder: 'e.g. 45,000' },
  { name: 'Condition', type: 'select', placeholder: 'Excellent · Good · Fair' },
];

export function TradeIn() {
  return (
    <section id="trade-in" className="overflow-hidden bg-[var(--background)] py-16 md:py-24">
      <div className="grid items-stretch lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[320px] lg:min-h-full"
        >
          <img
            src={TRADE_IN_IMAGE}
            alt="Car keys being handed across a counter"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(18,20,26,0) 60%, rgba(18,20,26,0.85) 100%)',
            }}
          />
        </motion.div>

        <div className="container-apex py-8 lg:py-12 lg:pl-20 lg:pr-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">Trade-in</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
              Your Car Is Worth More Than You Think
            </h2>
          </motion.div>

          <div className="mt-8 space-y-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] font-display text-sm font-bold text-[var(--primary)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm font-light text-[var(--muted-foreground)]">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {FIELDS.map((field) =>
              field.type === 'select' ? (
                <select
                  key={field.name}
                  defaultValue=""
                  aria-label={field.name}
                  className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                >
                  <option value="" disabled>
                    {field.name}
                  </option>
                  {['Excellent', 'Good', 'Fair'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={field.name}
                  type={field.type}
                  placeholder={`${field.name} ${field.placeholder}`}
                  aria-label={field.name}
                  className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                />
              ),
            )}
            <Button type="submit" className="h-11 sm:col-span-2">
              Get My Offer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Offers are good for 7 days and 800 km, whether or not you buy from us.
          </p>
        </div>
      </div>
    </section>
  );
}
