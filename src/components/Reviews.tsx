import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    quote:
      'I filtered by monthly payment instead of price, which is how I actually think about a car. Took twenty minutes to find three options in my range.',
    name: 'Andre W.',
    purchase: 'Purchased 2024 Aurora GT',
  },
  {
    quote:
      'The trade-in offer they gave me online was the same number they gave me in person. I had budgeted a whole afternoon for that argument.',
    name: 'Sofia D.',
    purchase: 'Purchased 2023 Vantage EX',
  },
  {
    quote:
      'Finance office took fifty minutes and nobody tried to sell me paint protection. I did not know that was possible.',
    name: 'Kevin O.',
    purchase: 'Purchased 2025 Nimbus EV',
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-[var(--primary)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)] py-16 md:py-24">
      <div className="container-apex">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-3">Reviews</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--foreground)] md:text-[44px] md:leading-none">
            4.8★ from 2,100+ Reviews
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.blockquote
              key={review.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card-elevated)] p-7"
            >
              <div className="flex items-center justify-between">
                <Stars />
                <Quote className="h-6 w-6 text-[color-mix(in_srgb,var(--primary)_40%,transparent)]" />
              </div>
              <p className="mt-5 flex-1 font-light text-[var(--foreground)]">
                "{review.quote}"
              </p>
              <footer className="mt-6 border-t border-[var(--border)] pt-5">
                <p className="font-display text-sm font-bold text-[var(--foreground)]">
                  {review.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--primary)]">{review.purchase}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
