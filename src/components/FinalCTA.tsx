import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from './ui/button';

export function FinalCTA() {
  return (
    <section
      className="gradient-drift overflow-hidden"
      style={{ background: 'linear-gradient(120deg, #0a90ff, #0b5ed7)' }}
    >
      <div className="container-apex py-20 text-center md:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-extrabold tracking-[-0.03em] text-white md:text-6xl"
        >
          340 vehicles. One afternoon.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-xl font-light text-white/85"
        >
          Open seven days. Pre-qualify online, test drive today, and drive home in the
          same visit if the numbers work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <Button
            variant="white"
            size="lg"
            className="shadow-none"
            onClick={() => document.querySelector('#inventory')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse Inventory
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href="tel:3055550190"
            className="flex items-center gap-2 font-display text-xl font-bold text-white"
          >
            <Phone className="h-5 w-5" />
            (305) 555-0190
          </a>
        </motion.div>
      </div>
    </section>
  );
}
