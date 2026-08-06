import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useVehicle } from '../lib/vehicles';
import { useSubmitOrder } from '../hooks/useSubmitOrder';
import { formatPrice } from '../lib/utils';
import { PageHero } from '../components/ui/PageHero';
import { Field, Input, Select, Textarea } from '../components/ui/field';
import { Button } from '../components/ui/button';
import { FormSuccess } from '../components/ui/form-success';
import { CHECKOUT_IMAGE } from '../data/inventory';

const TERMS = [36, 48, 60, 72];
const APR = 0.069;

function computeMonthly(price: number, down: number, term: number) {
  const principal = Math.max(price - down, 0);
  if (principal === 0) return 0;
  const r = APR / 12;
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -term)));
}

export function CheckoutPage() {
  const { id } = useParams();
  const { vehicle, loading } = useVehicle(id);
  const [searchParams] = useSearchParams();

  const downParam = Number(searchParams.get('down'));
  const termParam = Number(searchParams.get('term'));
  const hasPlan = Number.isFinite(downParam) && TERMS.includes(termParam);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [finance, setFinance] = useState<'cash' | 'financing'>(hasPlan ? 'financing' : 'cash');
  const [down, setDown] = useState(hasPlan ? downParam : 5000);
  const [term, setTerm] = useState(hasPlan ? termParam : 60);
  const [notes, setNotes] = useState('');

  const { status, error, orderId, submit, reset } = useSubmitOrder();

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6 pt-[76px]">
        <p className="text-sm text-[var(--muted-foreground)]">Loading vehicle…</p>
      </section>
    );
  }

  if (!vehicle) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-[76px] text-center">
        <p className="eyebrow mb-4">Vehicle unavailable</p>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
          That vehicle can't be ordered.
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

  const monthly = computeMonthly(vehicle.price, down, term);

  const handleSubmit = (e: React.FormEvent) => {
    void submit(
      {
        vehicleId: vehicle.id,
        name,
        phone,
        email,
        finance,
        downPayment: finance === 'financing' ? down : undefined,
        term: finance === 'financing' ? term : undefined,
        notes: notes || undefined,
      },
      e,
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Tell Us You Want It"
        subline="No payment online, no fine print. Pick a vehicle, share your details, and a specialist will call to lock it down and arrange delivery or pickup."
        image={CHECKOUT_IMAGE}
        alt="About to drive home in a new Apex Motors vehicle"
      />

      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container-apex">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
            <Link to="/" className="hover:text-[var(--foreground)]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/inventory" className="hover:text-[var(--foreground)]">Inventory</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/vehicle/${vehicle.id}`} className="hover:text-[var(--foreground)]">
              {vehicle.year} {vehicle.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[var(--foreground)]">Checkout</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {status === 'success' ? (
                <div className="space-y-4">
                  <FormSuccess
                    title={orderId ? `Order #${orderId} placed` : 'Order placed'}
                    message={`Thanks, ${name.split(' ')[0] || 'there'} — a specialist will call you at ${phone} within the hour to confirm your ${vehicle.year} ${vehicle.name} and arrange next steps. No payment has been taken.`}
                    onReset={reset}
                  />
                  <div className="flex flex-wrap gap-3">
                    <Link to="/inventory">
                      <Button variant="outline">Browse more vehicles</Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="ghost">Questions? Contact us</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8"
                >
                  <p className="eyebrow mb-2">Your details</p>
                  <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-[var(--foreground)]">
                    How do we reach you?
                  </h2>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name">
                      <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Mercer" />
                    </Field>
                    <Field label="Phone">
                      <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 7 00 00 00 00" />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Email">
                      <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jordan@email.com" />
                    </Field>
                  </div>

                  <div className="mt-7 border-t border-[var(--border)] pt-7">
                    <p className="eyebrow mb-2">Purchase plan</p>
                    <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                      How would you like to pay?
                    </h3>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <Field label="Payment type">
                        <Select value={finance} onChange={(e) => setFinance(e.target.value as 'cash' | 'financing')}>
                          <option value="cash">Cash</option>
                          <option value="financing">Financing</option>
                        </Select>
                      </Field>
                      {finance === 'financing' && (
                        <>
                          <Field label="Down payment">
                            <Input type="number" min={0} step={500} value={down} onChange={(e) => setDown(Number(e.target.value) || 0)} />
                          </Field>
                          <Field label="Loan term">
                            <Select value={String(term)} onChange={(e) => setTerm(Number(e.target.value))}>
                              {TERMS.map((t) => (
                                <option key={t} value={t}>{t} months</option>
                              ))}
                            </Select>
                          </Field>
                        </>
                      )}
                    </div>
                    {finance === 'financing' && (
                      <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                        Estimated payment: <span className="font-semibold text-[var(--primary)]">{formatPrice(monthly)}/mo</span> at {(APR * 100).toFixed(1)}% APR · soft credit check only
                      </p>
                    )}
                  </div>

                  <div className="mt-7 border-t border-[var(--border)] pt-7">
                    <Field label="Notes (optional)">
                      <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferred pickup day, anything we should know?" />
                    </Field>
                  </div>

                  {error && <p className="mt-4 text-sm text-[var(--destructive)]">{error}</p>}

                  <Button type="submit" size="lg" className="mt-6 w-full py-4" disabled={status === 'submitting'}>
                    <ShoppingBag className="h-4 w-4" />
                    {status === 'submitting' ? 'Placing order…' : 'Place Order'}
                  </Button>
                  <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
                    No payment is taken online — we confirm everything by phone first.
                  </p>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-24"
            >
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <div className="aspect-[16/10] overflow-hidden bg-[var(--card-elevated)]">
                  <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[var(--primary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                      {vehicle.badge}
                    </span>
                    <span className="text-sm text-[var(--muted-foreground)]">Stock #{vehicle.stock}</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold text-[var(--foreground)]">
                    {vehicle.year} {vehicle.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {vehicle.drivetrain} · {vehicle.fuel} · {vehicle.transmission}
                  </p>
                  <div className="mt-5 flex items-end justify-between">
                    <span className="font-display text-3xl font-extrabold tabular-nums text-[var(--foreground)]">
                      {formatPrice(vehicle.price)}
                    </span>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      or {formatPrice(vehicle.monthly)}/mo
                    </span>
                  </div>
                  {finance === 'financing' && (
                    <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Down payment</span>
                        <span className="font-semibold tabular-nums text-[var(--foreground)]">{formatPrice(down)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Term</span>
                        <span className="font-semibold tabular-nums text-[var(--foreground)]">{term} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Est. monthly</span>
                        <span className="font-display font-bold tabular-nums text-[var(--primary)]">{formatPrice(monthly)}</span>
                      </div>
                    </div>
                  )}
                  <ul className="mt-6 space-y-2.5">
                    {[
                      { icon: ShieldCheck, text: '7-day return policy included' },
                      { icon: ShieldCheck, text: '172-point inspection completed' },
                      { icon: ShieldCheck, text: 'No-haggle price, verified online' },
                    ].map((b) => (
                      <li key={b.text} className="flex items-center gap-2.5 text-sm text-[var(--foreground)]">
                        <b.icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                        {b.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
