import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  displayValue: string;
  className?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  displayValue,
  className,
}: SliderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm text-[var(--muted-foreground)]">{label}</label>
        <span className="font-display text-sm font-bold tabular-nums text-[var(--foreground)]">
          {displayValue}
        </span>
      </div>
      <SliderPrimitive.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        className="relative flex h-5 w-full touch-none select-none items-center"
        aria-label={label}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[var(--border)]">
          <SliderPrimitive.Range className="absolute h-full bg-[var(--primary)]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full border-2 border-[var(--primary)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          aria-hidden
        />
      </SliderPrimitive.Root>
    </div>
  );
}
