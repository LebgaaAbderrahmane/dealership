import { motion } from 'motion/react';
import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Field, Input, Select, Textarea } from '../components/ui/field';
import { Button } from '../components/ui/button';
import { FormSuccess } from '../components/ui/form-success';
import { useSubmitLead } from '../hooks/useSubmitLead';

const CARDS = [
  {
    icon: Phone,
    title: 'Call or text',
    lines: ['+213 796 26 93 01', '7 days a week'],
    href: 'tel:+213796269301',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['sales@apexmotors.dz', 'service@apexmotors.dz'],
    href: 'mailto:sales@apexmotors.dz',
  },
  {
    icon: MapPin,
    title: 'Visit us',
    lines: ['Bordj El Kiffan', 'Algiers, Algeria'],
    href: 'https://maps.google.com/?q=Bordj+El+Kiffan,+Algiers,+Algeria',
  },
  {
    icon: Clock,
    title: 'Sales hours',
    lines: ['Mon–Sat 9am–8pm', 'Sun 11am–6pm'],
    href: undefined,
  },
];

const SUBJECTS = ['General question', 'Test drive request', 'Service appointment', 'Trade-in inquiry', 'Financing help'];

export function ContactPage() {
  const { status, error, submit, reset } = useSubmitLead('contact');

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a Real Human"
        subline="Call, text, or drop by — we answer seven days a week. Expect a reply within the hour during business hours."
      />

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-[var(--foreground)]">
                  {card.title}
                </h3>
                {card.lines.map((line) =>
                  card.href && line.includes('@') ? (
                    <a key={line} href={`mailto:${line}`} className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                      {line}
                    </a>
                  ) : card.href && line.startsWith('+213') ? (
                    <a key={line} href={card.href} className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                      {line}
                    </a>
                  ) : (
                    <p key={line} className="block text-sm text-[var(--muted-foreground)]">
                      {line}
                    </p>
                  ),
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
        <div className="container-apex grid items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">Send a message</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
              What Can We Help With?
            </h2>
            <p className="mt-5 max-w-lg font-light text-[var(--muted-foreground)]">
              Tell us what you're looking for and a specialist will get back to you —
              usually within the hour.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
              <iframe
                title="Apex Motors location map"
                src="https://maps.google.com/maps?q=Bordj%20El%20Kiffan%2C%20Algiers%2C%20Algeria&z=14&output=embed"
                className="h-[320px] w-full border-0 grayscale-[0.3]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {status === 'success' ? (
              <FormSuccess
                title="Message sent"
                message="Thanks — a specialist will reply within the hour during business hours. Need us sooner? Call +213 796 26 93 01."
                onReset={reset}
              />
            ) : (
              <form
                onSubmit={(e) => {
                  const fd = new FormData(e.currentTarget);
                  const contact = String(fd.get('contact') ?? '');
                  const isEmail = contact.includes('@');
                  submit(
                    {
                      name: String(fd.get('name') ?? ''),
                      [isEmail ? 'email' : 'phone']: contact,
                      topic: String(fd.get('topic') ?? ''),
                      message: String(fd.get('message') ?? ''),
                    },
                    e,
                  );
                }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name">
                    <Input required name="name" placeholder="Jordan Mercer" />
                  </Field>
                  <Field label="Phone or email">
                    <Input required name="contact" placeholder="+213 7 00 00 00 00" />
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Topic">
                    <Select name="topic" defaultValue={SUBJECTS[0]}>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Message">
                    <Textarea required name="message" placeholder="How can we help?" />
                  </Field>
                </div>
                {error && (
                  <p className="mt-4 text-sm text-[var(--destructive)]">{error}</p>
                )}
                <Button type="submit" size="lg" className="mt-6 w-full py-4" disabled={status === 'submitting'}>
                  <MessageSquare className="h-4 w-4" />
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
