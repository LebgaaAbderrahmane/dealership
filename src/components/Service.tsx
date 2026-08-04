import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Gauge, Package, Wrench } from 'lucide-react';

const SERVICES = [
  {
    icon: Wrench,
    title: 'Scheduled Maintenance',
    body: 'Factory-interval service by certified technicians, with a loaner car on any job over three hours.',
  },
  {
    icon: Gauge,
    title: 'Repairs & Diagnostics',
    body: 'Full diagnostic bay, OEM parts, and a written estimate before any work begins.',
  },
  {
    icon: Package,
    title: 'Parts & Accessories',
    body: 'Genuine parts, roof racks, tow packages, and winter sets, fitted while you wait.',
  },
];

export function Service() {
  return (
    <section id="service" className="bg-[var(--background)] py-16 md:py-24">
      <div className="container-apex">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-3">Service department</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
            We Keep It Running
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[var(--foreground)]">
                {service.title}
              </h3>
              <p className="mt-2 text-sm font-light text-[var(--muted-foreground)]">
                {service.body}
              </p>
              <Link
                to="/service"
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
              >
                Schedule Service
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p className="text-sm font-light text-[var(--muted-foreground)]">
            <span className="font-display font-bold text-[var(--foreground)]">Service hours:</span>{' '}
            Mon–Fri 7am–6pm · Sat 8am–4pm · Sun closed
          </p>
          <Link to="/service" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            Book an appointment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
