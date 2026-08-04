import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'ghost' | 'outline' | 'white' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 active:brightness-95 shadow-[0_8px_24px_-8px_rgba(10,144,255,0.6)]',
  ghost:
    'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:text-[var(--primary)]',
  outline:
    'border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]',
  white:
    'bg-white text-[#0b5ed7] hover:bg-[color-mix(in_srgb,white_88%,black)]',
  link: 'text-[var(--primary)] hover:underline underline-offset-4',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
