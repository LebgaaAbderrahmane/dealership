import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { ChevronRight, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Financing', to: '/financing' },
  { label: 'Trade-In', to: '/trade-in' },
  { label: 'Service', to: '/service' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/logo.svg" alt="Apex Motors logo" className="h-9 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold tracking-tight text-[var(--foreground)]">
          APEX
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
          Motors
        </span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, top: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      if (!nav) return;
      const active = nav.querySelector('a[aria-current="page"]');
      if (!active) {
        setUnderline((u) => ({ ...u, opacity: 0 }));
        return;
      }
      setUnderline({
        left: (active as HTMLElement).offsetLeft,
        width: (active as HTMLElement).offsetWidth,
        top: (active as HTMLElement).offsetTop + (active as HTMLElement).offsetHeight + 6,
        opacity: 1,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [pathname]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 h-[76px] border-b backdrop-blur-md transition-colors duration-300"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: `rgba(18, 20, 26, ${scrolled ? 0.92 : 0.7})`,
        }}
      >
        <div className="container-apex flex h-full items-center justify-between gap-6">
          <Link to="/" className="group">
            <Wordmark />
          </Link>

          <nav ref={navRef} className="relative hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'relative text-sm font-medium transition-colors hover:text-[var(--foreground)]',
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <motion.span
              className="absolute h-0.5 rounded-full bg-[var(--primary)]"
              initial={false}
              animate={{
                left: underline.left,
                width: underline.width,
                top: underline.top,
                opacity: underline.opacity,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Button onClick={() => navigate('/inventory')} size="sm">
              Browse Inventory
            </Button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-[var(--foreground)] transition-colors hover:text-[var(--primary)] lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]/98 backdrop-blur-md"
          >
            <div className="flex h-[76px] items-center justify-between border-b px-6">
              <span className="flex items-center gap-2.5">
                <img src="/logo.svg" alt="Apex Motors logo" className="h-8 w-auto" />
                <span className="font-display text-xl font-extrabold tracking-tight text-[var(--foreground)]">
                  APEX <span className="text-[var(--primary)]">MOTORS</span>
                </span>
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between border-b py-4 font-display text-2xl font-bold transition-colors hover:text-[var(--primary)]',
                        isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground)]',
                      )
                    }
                  >
                    {link.label}
                    <ChevronRight className="h-6 w-6 text-[var(--muted-foreground)]" />
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="space-y-3 px-6 pb-10">
              <Button
                className="w-full py-4"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/inventory');
                }}
              >
                Browse Inventory
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
