import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { VEHICLE_COUNT } from '../data/inventory';
import { VEHICLE_TYPES } from '../types/vehicle';
import { useVehicles } from '../lib/vehicles';
import { VehicleCard } from './VehicleCard';

const PAGE_SIZE = 9;

export function Inventory() {
  const { vehicles: shown, total, loading } = useVehicles({ limit: PAGE_SIZE });

  return (
    <section id="inventory" className="bg-[var(--background)] py-16 md:py-24">
      <div className="container-apex">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">In stock now</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
              Browse Inventory
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <p className="text-sm text-[var(--muted-foreground)]">
              {VEHICLE_COUNT} vehicles · {VEHICLE_TYPES.length} body types
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-apex mt-10">
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {shown.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </AnimatePresence>
        </motion.div>

        {loading && shown.length === 0 && (
          <p className="py-16 text-center text-sm text-[var(--muted-foreground)]">
            Loading inventory…
          </p>
        )}

        {!loading && shown.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-[var(--muted-foreground)]"
          >
            No vehicles match those filters — try widening your price range.
          </motion.p>
        )}

        <div className="mt-14 flex flex-col items-center gap-5">
          {total <= PAGE_SIZE && total > 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing all {total} matching vehicles.
            </p>
          )}
          <Link
            to="/inventory"
            className="group flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
          >
            View all {VEHICLE_COUNT} vehicles
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
