import { motion } from 'motion/react';
import { BadgeCheck, RotateCcw, ShieldCheck, Star } from 'lucide-react';

const ITEMS = [
  {
    icon: ShieldCheck,
    label: 'No-haggle pricing',
    sub: 'The price online is the price you pay.',
  },
  {
    icon: RotateCcw,
    label: '7-day return policy',
    sub: 'Drive it, and still change your mind.',
  },
  {
    icon: BadgeCheck,
    label: '172-point inspection',
    sub: 'Every vehicle, certified before sale.',
  },
  {
    icon: Star,
    label: '4.8★ from 2,100+ reviews',
    sub: 'Rated by real buyers in Miami.',
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)]">
      <div className="container-apex grid grid-cols-2 gap-x-6 gap-y-8 py-8 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-4"
          >
            <span className="glow-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-[var(--foreground)]">{item.label}</p>
              <p className="hidden text-xs text-[var(--muted-foreground)] xl:block">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
