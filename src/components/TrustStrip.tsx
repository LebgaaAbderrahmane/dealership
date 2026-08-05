import { motion } from 'motion/react';
import { BadgeCheck, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { useSiteSettings } from '../lib/settings';

const ICONS = [ShieldCheck, RotateCcw, BadgeCheck, Star];

export function TrustStrip() {
  const settings = useSiteSettings();
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)]">
      <div className="container-apex grid grid-cols-2 gap-x-6 gap-y-8 py-8 lg:grid-cols-4">
        {settings.trust.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="glow-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-[var(--foreground)]">{item.label}</p>
                <p className="hidden text-xs text-[var(--muted-foreground)] xl:block">{item.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
