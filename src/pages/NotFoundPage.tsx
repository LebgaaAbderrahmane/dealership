import { Link } from 'react-router';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-[76px] text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="font-display text-5xl font-extrabold tracking-[-0.03em] text-[var(--foreground)] md:text-6xl">
        Wrong turn.
      </h1>
      <p className="mt-4 max-w-md font-light text-[var(--muted-foreground)]">
        That page doesn't exist — but the lot is full. Browse the inventory, check
        financing, or get back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link to="/inventory">
          <Button size="lg">Browse Inventory</Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="lg">
            Back home
          </Button>
        </Link>
      </div>
    </section>
  );
}
