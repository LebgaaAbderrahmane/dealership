import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/inventory';
import { useSiteSettings } from '../lib/settings';
import { Button } from './ui/button';

const HERO_LINES = ['Find it. Buy it.', 'Drive it home', 'today.'];

interface HeroProps {
  onSearch: () => void;
}

export function Hero({ onSearch }: HeroProps) {
  const settings = useSiteSettings();
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

      <div className="container-apex relative pt-[110px] pb-20 text-center md:pl-16 md:text-left">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="eyebrow mb-6"
        >
          {settings.hero.eyebrow}
        </motion.p>

        <h1 className="mx-auto max-w-3xl font-display font-extrabold leading-none tracking-[-0.035em] text-[var(--foreground)] [font-size:clamp(40px,5.6vw,88px)] md:mx-0">
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
          className="mx-auto mt-6 max-w-xl text-base font-light text-[color-mix(in_srgb,var(--foreground)_80%,transparent)] md:mx-0 md:text-lg"
        >
          {settings.hero.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55 }}
          className="mt-9 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4"
        >
          <Button size="lg" className="w-full md:w-auto" onClick={onSearch}>
            Browse Inventory
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="ghost" className="w-full md:w-auto" onClick={() => document.querySelector('#trade-in')?.scrollIntoView({ behavior: 'smooth' })}>
            Value My Trade
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 w-full"
        >
          <dl className="grid w-full grid-cols-2 gap-y-8 rounded-2xl border border-[var(--border)] bg-white/[0.04] px-4 py-8 backdrop-blur-xl sm:grid-cols-4 lg:px-10">
            {settings.hero.stats.map((s) => (
              <div key={s.label} className="text-center">
                <dd className="font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)] md:text-[40px] md:leading-none">
                  {s.value}
                </dd>
                <dt className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
