import { motion } from 'motion/react';
import { Award, HeartHandshake, ShieldCheck, Timer } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { ABOUT_IMAGE } from '../data/inventory';
import { CtaBand } from '../components/ui/CtaBand';

const STATS = [
  { value: '2014', label: 'Serving Algiers since' },
  { value: '340+', label: 'Vehicles on the lot' },
  { value: '4.8★', label: 'From 2,100+ reviews' },
  { value: '22', label: 'Lender partners' },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Radical transparency',
    body: 'Every vehicle has a real price, a real payment, and a real inspection. What you see online is what you get in person.',
  },
  {
    icon: Timer,
    title: 'Your time is money',
    body: 'Paperwork prepared in advance, offers honored on arrival, and a finance office that takes about an hour — not four.',
  },
  {
    icon: HeartHandshake,
    title: 'Zero-pressure buying',
    body: 'No add-ons pushed at the desk, no four-hour negotiations. If the numbers work, great. If not, you leave with a coffee and a handshake.',
  },
  {
    icon: Award,
    title: 'Backed by a 172-point standard',
    body: 'Every certified vehicle passes a 172-point inspection and carries a 7-day return policy. Confidence comes standard.',
  },
];

const TEAM = [
  { name: 'Elena Reyes', role: 'Founder & General Manager', initials: 'ER' },
  { name: 'Marcus Cole', role: 'Sales Director', initials: 'MC' },
  { name: 'Priya Natarajan', role: 'Finance Manager', initials: 'PN' },
  { name: 'Darius Webb', role: 'Service Director', initials: 'DW' },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Apex"
        title="A Dealership Built on Trust, Not Tactics"
        subline="We started Apex Motors in 2014 with one idea: the car-buying experience should be as good as the car. Twelve years later, that's still the whole plan."
        image={ABOUT_IMAGE}
        alt="Apex Motors showroom floor"
      />

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-[var(--border)]"
          >
            <img src={ABOUT_IMAGE} alt="Apex Motors showroom floor" className="aspect-[16/10] w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">Our story</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[40px] md:leading-none">
              From One Lot in Bordj El Kiffan to 340 Vehicles
            </h2>
            <div className="mt-6 space-y-4 font-light text-[var(--muted-foreground)]">
              <p>
                Apex Motors started as a twelve-car corner lot in Bordj El Kiffan.
                We sold on one promise — the price on the windshield is the price you
                pay — and built the business one referral at a time.
              </p>
              <p>
                Today we stock new and certified pre-owned vehicles across twelve
                makes, work with 22 lenders, and run a service department that keeps
                every car we've ever sold on the road. The inventory grew. The
                promise didn't.
              </p>
              <p>
                No haggling. No surprise add-ons. No four-hour finance office
                marathons. Just real cars, real numbers, and a seven-day return
                policy in case we get it wrong.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container-apex mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center sm:p-6"
            >
              <p className="font-display text-3xl font-extrabold tabular-nums text-[var(--primary)] md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
        <div className="container-apex">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="eyebrow mb-3">Values</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
              What We Refuse to Change
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 sm:p-7"
              >
                <value.icon className="h-6 w-6 text-[var(--primary)]" />
                <h3 className="mt-4 font-display text-lg font-bold text-[var(--foreground)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm font-light text-[var(--muted-foreground)]">
                  {value.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Leadership</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
              The People Behind the Promise
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center sm:p-6"
              >
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] font-display text-xl font-extrabold text-[var(--primary)]">
                  {member.initials}
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-[var(--foreground)]">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Come meet us in Bordj El Kiffan."
        subline="Stop by for a coffee and a test drive — no pressure, no appointment needed. Open seven days a week."
      />
    </>
  );
}
