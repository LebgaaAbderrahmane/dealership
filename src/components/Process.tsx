import { motion } from 'motion/react';

const STEPS = [
  {
    title: 'Browse',
    duration: 'as long as you like',
    body: 'Filter by payment rather than sticker price if that is how you actually budget. Every listing shows both.',
  },
  {
    title: 'Pre-qualify',
    duration: '2 minutes',
    body: 'Soft credit check gives you a real rate and a real budget before anyone shakes your hand.',
  },
  {
    title: 'Test drive',
    duration: '30–45 minutes',
    body: 'Take it on the highway, not around the block. Bring your car seat and check that it fits.',
  },
  {
    title: 'Sign and go',
    duration: 'about an hour',
    body: 'Paperwork is prepared before you arrive. No surprise add-ons in the finance office, because we do not sell them there.',
  },
];

export function Process() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
      <div className="container-apex">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-3">The process</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
            How Buying Works Here
          </h2>
        </motion.div>

        <div className="relative mt-14">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-5 top-5 z-0 hidden h-0.5 origin-left bg-[var(--primary)] md:left-0 md:right-0 md:top-5 lg:block"
            style={{ background: 'linear-gradient(to right, var(--primary), color-mix(in srgb, var(--primary) 30%, transparent))' }}
          />

          <div className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-16 lg:pl-0"
              >
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--card)] font-display text-base font-extrabold text-[var(--primary)] ring-4 ring-[var(--card)] lg:relative lg:mb-5"
                >
                  {i + 1}
                </motion.span>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  {step.title}
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {step.duration}
                  </span>
                </h3>
                <p className="mt-2 text-sm font-light text-[var(--muted-foreground)]">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
