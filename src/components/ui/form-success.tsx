import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './button';

interface FormSuccessProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export function FormSuccess({
  title = 'Request received',
  message = 'Thanks — we have your details and will be in touch shortly.',
  onReset,
}: FormSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center rounded-2xl border border-[var(--success)]/40 bg-[color-mix(in_srgb,var(--success)_8%,transparent)] p-4 text-center sm:p-8"
    >
      <CheckCircle2 className="h-12 w-12 text-[var(--success)]" />
      <h3 className="mt-4 font-display text-lg font-bold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm font-light text-[var(--muted-foreground)]">{message}</p>
      {onReset && (
        <Button variant="ghost" size="sm" className="mt-5" onClick={onReset}>
          Submit another
        </Button>
      )}
    </motion.div>
  );
}
