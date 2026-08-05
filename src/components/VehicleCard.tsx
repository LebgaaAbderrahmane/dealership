import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Vehicle } from '../data/inventory';
import { formatDistance, formatPrice } from '../lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/vehicle/${vehicle.id}`}
        className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={vehicle.image}
            alt={`${vehicle.name} exterior`}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ background: 'var(--success)', color: '#04180f' }}
          >
            In stock
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {vehicle.year} {vehicle.name}
            </h3>
          </div>
          <div className="mt-1 text-sm text-[var(--muted-foreground)]">
            {formatDistance(vehicle.miles)} · {vehicle.drivetrain} · {vehicle.badge}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <span className="font-display text-2xl font-bold tabular-nums text-[var(--foreground)]">
              {formatPrice(vehicle.price)}
            </span>
            <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition-all duration-300 group-hover:brightness-110 sm:w-auto">
              View Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
