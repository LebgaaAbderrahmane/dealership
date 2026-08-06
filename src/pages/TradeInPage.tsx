import { motion } from 'motion/react';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TradeInOfferForm } from '../components/forms/TradeInOfferForm';
import { CtaBand } from '../components/ui/CtaBand';
import { TRADE_IN_IMAGE } from '../data/inventory';

const STEPS = [
  {
    title: 'Tell us about it',
    body: 'Year, make, model, mileage, and honest condition. Two minutes, no phone call required.',
  },
  {
    title: 'Get a real number',
    body: 'Not a range. An actual offer, backed by our current auction and retail data across 22 market sources.',
  },
  {
    title: 'Bring it in',
    body: 'We verify the condition, and if it matches, the offer stands. Apply it to a purchase or take a cheque on the spot.',
  },
];

export function TradeInPage() {
  return (
    <>
      <PageHero
        eyebrow="Trade-In"
        title="Your Car Is Worth More Than You Think"
        subline="Get a real, itemized offer in two minutes. If it matches our online number when you arrive, we honor it — even if you don't buy from us."
        image={TRADE_IN_IMAGE}
        alt="Apex Motors trade-in bay"
      />

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="Three Steps to an Offer"
            />
            <div className="mt-10 space-y-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="flex gap-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] font-display text-lg font-extrabold text-[var(--primary)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-md text-sm font-light text-[var(--muted-foreground)]">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm font-light text-[var(--muted-foreground)] sm:p-6">
              <span className="font-display font-bold text-[var(--foreground)]">
                The fine print, upfront:
              </span>{' '}
              Offers are good for 7 days and 800 km, whether or not you buy from
              us. We inspect for the condition you selected — no surprises after the
              fact.
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            <TradeInOfferForm />
          </motion.div>
        </div>
      </section>

      <CtaBand
        title="Got an offer? Roll it into your next car."
        subline="Apply your trade-in value to any vehicle on the lot — and finance the rest in the same visit."
      />
    </>
  );
}
