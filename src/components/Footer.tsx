import { Link } from 'react-router';
import { Camera, Globe, MapPin, MessageCircle, Play } from 'lucide-react';
import { useSiteSettings } from '../lib/settings';

const SOCIAL_ICONS: Record<string, typeof Camera> = {
  instagram: Camera,
  facebook: Globe,
  youtube: Play,
  whatsapp: MessageCircle,
};

const COLUMNS = [
  {
    title: 'Inventory',
    links: [
      { label: 'All vehicles', to: '/inventory' },
      { label: 'Electric & hybrid', to: '/inventory?type=EV' },
      { label: 'Trucks & SUVs', to: '/inventory?type=Truck' },
      { label: 'Certified pre-owned', to: '/inventory' },
      { label: 'New arrivals', to: '/inventory' },
    ],
  },
  {
    title: 'Financing & Trade-In',
    links: [
      { label: 'Payment calculator', to: '/financing' },
      { label: 'Pre-qualify', to: '/financing' },
      { label: 'Trade-in offer', to: '/trade-in' },
      { label: 'Lender partners', to: '/financing' },
      { label: 'Lease options', to: '/financing' },
    ],
  },
  {
    title: 'Service & Contact',
    links: [
      { label: 'Schedule service', to: '/service' },
      { label: 'Parts & accessories', to: '/service' },
      { label: 'Service specials', to: '/service' },
      { label: 'Contact us', to: '/contact' },
      { label: 'About Apex', to: '/about' },
    ],
  },
];

export function Footer() {
  const settings = useSiteSettings();
  const social = Object.entries(settings.social).filter(([, url]) => url.trim() !== '');
  return (
    <footer id="about" className="bg-[hsl(220,16%,5%)] text-[var(--muted-foreground)]">
      <div className="container-apex grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Apex Motors logo" className="h-9 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-extrabold tracking-tight text-[var(--foreground)]">
                APEX
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
                Motors
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm font-light">
            {settings.footer.blurb}
          </p>
          <p className="mt-6 flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
            {settings.dealer.addressLine1}, {settings.dealer.addressLine2}
          </p>
          <div className="mt-6 flex gap-3">
            {social.length === 0
              ? [Camera, MessageCircle, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#top"
                    aria-label="Social link"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))
              : social.map(([key, url]) => {
                  const Icon = SOCIAL_ICONS[key] ?? Globe;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">
              {col.title}
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-[var(--foreground)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-apex py-8">
          <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
            <p>
              <span className="font-display font-bold text-[var(--foreground)]">Sales hours:</span>{' '}
              {settings.hours.sales}
            </p>
            <p className="text-xs">
              Advertised payments are estimates and exclude tax, title, and dealer
              fees. Subject to credit approval. Vehicle availability changes daily.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs md:flex-row md:items-center md:justify-between">
            <p>© 2026 Apex Motors LLC. All rights reserved.</p>
            <p>Dealer License #{settings.dealer.license}</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-[var(--foreground)]">
                Privacy Policy
              </Link>
              <Link to="/accessibility" className="hover:text-[var(--foreground)]">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
