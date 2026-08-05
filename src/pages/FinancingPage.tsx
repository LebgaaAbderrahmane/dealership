import { motion } from 'motion/react';
import { CreditCard, HandCoins, Landmark, Wallet } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { FINANCE_IMAGE } from '../data/inventory';
import { PaymentCalculator } from '../components/PaymentCalculator';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { Field, Input, Select } from '../components/ui/field';
import { Button } from '../components/ui/button';
import { FormSuccess } from '../components/ui/form-success';
import { useSubmitLead } from '../hooks/useSubmitLead';
import { CtaBand } from '../components/ui/CtaBand';

const LENDERS = [
  'Apex Credit Union',
  'First Federal Bank',
  'Sunshine Bank',
  'Coral Gables Trust',
  'Marina Bay Credit',
  'El Kiffan Credit Union',
  'Palm Financial',
  'National Auto Capital',
  'EverBank Direct',
  'Meridian Lending',
  'South Coast Bank',
  'Founders Bank',
];

const TIERS = [
  { tier: 'Excellent 720+', rate: '4.9%', note: 'Best available rate' },
  { tier: 'Good 660–719', rate: '6.1%', note: 'Most common tier' },
  { tier: 'Fair 600–659', rate: '8.4%', note: 'Credit unions often beat this' },
  { tier: 'Build credit < 600', rate: 'from 11.9%', note: 'We can still get you approved' },
];

const FAQS = [
  {
    q: 'Does pre-qualification affect my credit score?',
    a: 'No. We use a soft credit pull for pre-qualification, which has zero impact on your score. A hard inquiry only happens if you decide to move forward and finalize financing.',
  },
  {
    q: 'What do I need to bring to sign?',
    a: 'A valid driver’s license, proof of insurance, and two recent pay stubs (or your best income documentation). Paperwork is prepared in advance, so the finance office usually takes under an hour.',
  },
  {
    q: 'Can I finance with a credit union I already use?',
    a: 'Absolutely. We work with 22 lenders, and if you bring your own pre-approval we will match or beat the rate where we can. Your existing lender is welcome in the deal.',
  },
  {
    q: 'Are there prepayment penalties?',
    a: 'No. You can pay the loan off early — in part or in full — with no penalty, across every lender we work with.',
  },
  {
    q: 'What is the minimum down payment?',
    a: 'There is no minimum, but a $5,000 down payment is used in the calculator above. More down lowers your payment and can unlock a better rate.',
  },
];

export function FinancingPage() {
  const { status, error, submit, reset } = useSubmitLead('pre-qualify');

  return (
    <>
      <PageHero
        eyebrow="Financing"
        title="Financing Made Transparent"
        subline="Know your payment before you walk in. Pre-qualify with a soft credit check, compare rates, and arrive ready to sign — no four-hour finance office marathon."
        image={FINANCE_IMAGE}
        alt="Driving home in a new Apex Motors vehicle"
      />

      <PaymentCalculator />

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex">
          <SectionHeading
            eyebrow="Rates"
            title="Where Your Rate Lands"
            subline="Rates vary by credit profile, term, and lender. These are the typical starting APRs we see from our partners today."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--border)]">
            <div className="grid grid-cols-3 gap-4 border-b border-[var(--border)] bg-[var(--card)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              <span>Credit profile</span>
              <span>Starting APR</span>
              <span>Note</span>
            </div>
            {TIERS.map((row, i) => (
              <div
                key={row.tier}
                className={`grid grid-cols-3 gap-4 px-6 py-4 text-sm ${
                  i % 2 === 0 ? 'bg-[var(--card)]' : 'bg-[var(--card-elevated)]'
                }`}
              >
                <span className="font-display font-bold text-[var(--foreground)]">{row.tier}</span>
                <span className="font-display font-bold tabular-nums text-[var(--primary)]">
                  {row.rate}
                </span>
                <span className="text-[var(--muted-foreground)]">{row.note}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Example: 60-month term on a $42,000 vehicle with $5,000
            down at 6.9% APR is approximately $731/month. Your approved rate
            may differ.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
        <div className="container-apex">
          <SectionHeading
            eyebrow="Lenders"
            title="We Work With 22 Lenders"
            subline="Credit unions, regional banks, and national lenders — so there's almost always more than one way to make the numbers work."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {LENDERS.map((lender) => (
              <span
                key={lender}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)]"
              >
                <Landmark className="h-4 w-4 text-[var(--primary)]" />
                {lender}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex grid items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-3">Pre-qualify</p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
              Get Pre-Qualified in Two Minutes
            </h2>
            <p className="mt-5 max-w-lg font-light text-[var(--muted-foreground)]">
              Answer a few questions and we'll send you a real rate and a real budget —
              before anyone shakes your hand. Soft credit check only.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: HandCoins, text: 'No impact on your credit score' },
                { icon: Wallet, text: 'A real rate from up to 22 lenders' },
                { icon: CreditCard, text: 'Good for 30 days while you shop' },
              ].map((b) => (
                <li key={b.text} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]">
                    <b.icon className="h-4 w-4" />
                  </span>
                  {b.text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8"
          >
            {status === 'success' ? (
              <FormSuccess
                title="You're pre-qualified"
                message="We've received your info. A finance specialist will call within one business hour with your rate and budget — no credit impact."
                onReset={reset}
              />
            ) : (
              <form
                onSubmit={(e) => {
                  const fd = new FormData(e.currentTarget);
                  submit(
                    {
                      firstName: String(fd.get('firstName') ?? ''),
                      lastName: String(fd.get('lastName') ?? ''),
                      email: String(fd.get('email') ?? ''),
                      phone: String(fd.get('phone') ?? ''),
                      income: String(fd.get('income') ?? ''),
                      preferredContact: String(fd.get('preferredContact') ?? 'phone'),
                    },
                    e,
                  );
                }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name">
                    <Input required name="firstName" placeholder="Jordan" />
                  </Field>
                  <Field label="Last name">
                    <Input required name="lastName" placeholder="Mercer" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email">
                    <Input required type="email" name="email" placeholder="jordan@email.com" />
                  </Field>
                  <Field label="Phone">
                    <Input required type="tel" name="phone" placeholder="+213 7 00 00 00 00" />
                  </Field>
                </div>
                <Field label="Estimated monthly income">
                  <Input required type="number" name="income" placeholder="6500" />
                </Field>
                <Field label="Preferred contact">
                  <Select name="preferredContact" defaultValue="phone">
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="text">Text message</option>
                  </Select>
                </Field>
                {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
                <Button type="submit" size="lg" className="w-full py-4" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Checking…' : 'Get Pre-Qualified'}
                </Button>
                <p className="text-center text-xs text-[var(--muted-foreground)]">
                  Soft credit check only — does not affect your score.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
        <div className="container-apex grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Financing Questions, Answered"
            subline="Everything buyers usually ask before signing on the dotted line."
          />
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <CtaBand
        title="Ready when you are."
        subline="Browse the lot, pick a vehicle, and pre-qualify online before you even leave the couch."
      />
    </>
  );
}
