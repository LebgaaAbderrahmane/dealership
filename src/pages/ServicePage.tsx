import { motion } from 'motion/react';
import { Clock, Gauge, Package, Phone, Wrench } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Field, Input, Select, Textarea } from '../components/ui/field';
import { Button } from '../components/ui/button';
import { FormSuccess } from '../components/ui/form-success';
import { useMockSubmit } from '../hooks/useMockSubmit';
import { CtaBand } from '../components/ui/CtaBand';

const SERVICES = [
  {
    icon: Wrench,
    title: 'Scheduled Maintenance',
    body: 'Factory-interval service by certified technicians, with a loaner car on any job over three hours. Oil, brakes, fluids, filters — done right the first time.',
    points: ['Factory-spec service intervals', 'Loaner car over 3 hours', 'Digital inspection with photos'],
  },
  {
    icon: Gauge,
    title: 'Repairs & Diagnostics',
    body: 'Full diagnostic bay, OEM parts, and a written estimate before any work begins. We explain what we found and only fix what you approve.',
    points: ['Written estimate up front', 'OEM parts warranty', 'Same-day diagnostics'],
  },
  {
    icon: Package,
    title: 'Parts & Accessories',
    body: 'Genuine parts, roof racks, tow packages, and winter sets — fitted while you wait. Stock the essentials or special-order anything in the catalog.',
    points: ['Genuine OEM parts', 'Fitted while you wait', 'Roof, tow & winter kits'],
  },
];

const SERVICE_TYPES = [
  'Oil change & filter',
  'Brake inspection / replacement',
  'Tire rotation & alignment',
  'Battery & electrical',
  'A/C service',
  'Full multi-point inspection',
  'Diagnostics (warning light)',
];

const HOURS = [
  { day: 'Monday – Friday', time: '7:00am – 6:00pm' },
  { day: 'Saturday', time: '8:00am – 4:00pm' },
  { day: 'Sunday', time: 'Closed' },
];

export function ServicePage() {
  const { status, submit, reset } = useMockSubmit();

  return (
    <>
      <PageHero
        eyebrow="Service department"
        title="We Keep It Running"
        subline="Certified technicians, genuine parts, and honest estimates. Book online and we'll have your bay ready when you arrive."
      />

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex">
          <SectionHeading
            eyebrow="What we do"
            title="Three Ways We Keep You Moving"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map((service, i) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]">
                  <service.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-[var(--foreground)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm font-light text-[var(--muted-foreground)]">
                  {service.body}
                </p>
                <ul className="mt-5 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
        <div className="container-apex grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Book a visit"
              title="Schedule Service Online"
              subline="Pick a time that works and we'll confirm within the hour. Walk-ins welcome, but booked bays get priority."
            />
            <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-7">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[var(--primary)]" />
                <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                  Service hours
                </h3>
              </div>
              <ul className="mt-5 space-y-3">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between border-b border-[var(--border)] pb-3 text-sm last:border-0 last:pb-0">
                    <span className="text-[var(--muted-foreground)]">{h.day}</span>
                    <span className="font-semibold text-[var(--foreground)]">{h.time}</span>
                  </li>
                ))}
              </ul>
              <a
                href="tel:3055550190"
                className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                <Phone className="h-4 w-4" />
                (305) 555-0190
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {status === 'success' ? (
              <FormSuccess
                title="Service booked"
                message="Your appointment request is in. We'll confirm the bay and time within the hour by text or phone."
                onReset={reset}
              />
            ) : (
              <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name">
                    <Input required placeholder="Jordan Mercer" />
                  </Field>
                  <Field label="Phone">
                    <Input required type="tel" placeholder="(305) 555-0000" />
                  </Field>
                  <Field label="Vehicle year">
                    <Input required type="number" placeholder="2021" />
                  </Field>
                  <Field label="Vehicle make & model">
                    <Input required placeholder="Aurora GT Line" />
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Service needed">
                    <Select defaultValue={SERVICE_TYPES[0]}>
                      {SERVICE_TYPES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Preferred date">
                    <Input required type="date" />
                  </Field>
                  <Field label="Preferred time">
                    <Select defaultValue="Morning">
                      <option>Morning (7am–12pm)</option>
                      <option>Afternoon (12–4pm)</option>
                      <option>Evening (4–6pm)</option>
                    </Select>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Notes (optional)">
                    <Textarea placeholder="Warning light? Sounds? Anything we should know." />
                  </Field>
                </div>
                <Button type="submit" size="lg" className="mt-6 w-full py-4" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Booking…' : 'Schedule Service'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <CtaBand
        title="Parts & accessories, fitted while you wait."
        subline="Roof racks, tow packages, winter sets, and genuine OEM parts — stop by the counter or call ahead and we'll have it ready."
      />
    </>
  );
}
