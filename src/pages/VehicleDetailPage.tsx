import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { BadgeCheck, CalendarCheck, ChevronRight, Gauge, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { getVehicleById, similarVehicles } from '../data/inventory';
import { formatDistance, formatPrice } from '../lib/utils';
import { Button } from '../components/ui/button';
import { VehicleCard } from '../components/VehicleCard';
import { PaymentCalculator } from '../components/PaymentCalculator';
import { CtaBand } from '../components/ui/CtaBand';

const TRUST = [
  { icon: ShieldCheck, text: '172-point inspection completed' },
  { icon: BadgeCheck, text: 'No-haggle price, verified online' },
  { icon: KeyRound, text: '7-day return policy included' },
];

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-3 last:border-0">
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}

export function VehicleDetailPage() {
  const { id } = useParams();
  const vehicle = getVehicleById(id);
  const [active, setActive] = useState(0);

  if (!vehicle) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-[76px] text-center">
        <p className="eyebrow mb-4">Vehicle not found</p>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
          That vehicle isn't in our lot.
        </h1>
        <p className="mt-3 max-w-md font-light text-[var(--muted-foreground)]">
          It may have sold or the link is out of date. Browse the full inventory to
          find another option.
        </p>
        <Link to="/inventory" className="mt-8">
          <Button size="lg">Browse Inventory</Button>
        </Link>
      </section>
    );
  }

  const similar = similarVehicles(vehicle, 3);

  return (
    <>
      <section className="bg-[var(--background)] pt-[104px] md:pt-[120px]">
        <div className="container-apex">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
            <Link to="/" className="hover:text-[var(--foreground)]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/inventory" className="hover:text-[var(--foreground)]">
              Inventory
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[var(--foreground)]">
              {vehicle.year} {vehicle.name}
            </span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--border)]">
                <img
                  src={vehicle.gallery[active]}
                  alt={`${vehicle.name} photo ${active + 1}`}
                  className="h-full w-full object-cover object-center"
                />
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{ background: 'var(--success)', color: '#04180f' }}
                >
                  In stock
                </span>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {vehicle.gallery.map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setActive(i)}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                      i === active
                        ? 'border-[var(--primary)]'
                        : 'border-[var(--border)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-[var(--primary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                  {vehicle.badge}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">Stock #{vehicle.stock}</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-[var(--foreground)] md:text-4xl">
                {vehicle.year} {vehicle.name}
              </h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {formatDistance(vehicle.miles)} · {vehicle.drivetrain} · {vehicle.fuel}
              </p>

              <div className="mt-5 flex items-end justify-between gap-4">
                <span className="font-display text-4xl font-extrabold tabular-nums text-[var(--foreground)]">
                  {formatPrice(vehicle.price)}
                </span>
                <span className="font-display text-lg font-bold text-[var(--primary)]">
                  or {formatPrice(vehicle.monthly)}/mo
                </span>
              </div>

              <p className="mt-4 font-light text-[var(--muted-foreground)]">
                {vehicle.description}
              </p>

              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-2">
                <SpecRow label="Mileage" value={formatDistance(vehicle.miles)} />
                <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
                <SpecRow label="Transmission" value={vehicle.transmission} />
                <SpecRow label="Fuel" value={vehicle.fuel} />
                <SpecRow label="Color" value={vehicle.color} />
                <SpecRow label="MPG" value={vehicle.mpg > 0 ? `${vehicle.mpg} city/hwy` : 'N/A · Electric'} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  onClick={() => document.querySelector('#detail-financing')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Test Drive
                </Button>
                <Link to="/financing">
                  <Button variant="outline" size="lg" className="w-full">
                    <Zap className="h-4 w-4" />
                    Get Pre-Qualified
                  </Button>
                </Link>
              </div>

              <ul className="mt-6 space-y-3">
                {TRUST.map((t) => (
                  <li key={t.text} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                    <t.icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    {t.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)] py-14 md:py-20">
        <div className="container-apex grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">Specifications</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-3xl">
              Every Detail, in the Open
            </h2>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-2">
              <SpecRow label="Make" value={vehicle.make} />
              <SpecRow label="Model year" value={String(vehicle.year)} />
              <SpecRow label="Body style" value={vehicle.type} />
              <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
              <SpecRow label="Transmission" value={vehicle.transmission} />
              <SpecRow label="Fuel type" value={vehicle.fuel} />
              <SpecRow label="Exterior color" value={vehicle.color} />
              <SpecRow label="Combined MPG" value={vehicle.mpg > 0 ? String(vehicle.mpg) : 'Electric'} />
              <SpecRow label="Stock number" value={vehicle.stock} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">Features</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-3xl">
              What's Included
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)]"
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm font-light text-[var(--muted-foreground)]">
              <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
              <span>
                Advertised payment is an estimate based on {formatPrice(vehicle.price)}{' '}
                at 6.9% APR for 60 months with a 1,250,000 DA down payment. Excludes
                tax, title, and dealer fees. Subject to credit approval.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div id="detail-financing">
        <PaymentCalculator />
      </div>

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-3xl">
              Similar Vehicles
            </h2>
            <Link
              to="/inventory"
              className="shrink-0 text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Found the one? Let's get you behind the wheel."
        subline="Test drive today, trade in your current car, and drive home in the same visit if the numbers work."
      />
    </>
  );
}
