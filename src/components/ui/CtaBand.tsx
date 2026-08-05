import { Link } from 'react-router';
import { ArrowRight, Phone } from 'lucide-react';

interface CtaBandProps {
  title: string;
  subline?: string;
}

export function CtaBand({ title, subline }: CtaBandProps) {
  return (
    <section
      className="gradient-drift overflow-hidden"
      style={{ background: 'linear-gradient(120deg, #0a90ff, #0b5ed7)' }}
    >
      <div className="container-apex flex flex-col items-center gap-6 py-16 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-white md:text-4xl">
            {title}
          </h2>
          {subline && <p className="mt-3 max-w-xl font-light text-white/85">{subline}</p>}
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/inventory"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-[#0b5ed7] transition-all duration-200 hover:bg-[color-mix(in_srgb,white_88%,black)] active:scale-[0.98]"
          >
            Browse Inventory
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="tel:+213796269301"
            className="flex items-center gap-2 font-display text-lg font-bold text-white"
          >
            <Phone className="h-5 w-5" />
            +213 796 26 93 01
          </a>
        </div>
      </div>
    </section>
  );
}
