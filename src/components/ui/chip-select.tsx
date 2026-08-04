import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface ChipSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

export function ChipSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: ChipSelectProps) {
  const current = options.find((o) => o.value === value);

  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
          className,
        )}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {ariaLabel}
        </span>
        <SelectPrimitive.Value>{current?.label ?? value}</SelectPrimitive.Value>
        <SelectPrimitive.Icon className="text-[var(--muted-foreground)]">
          <ChevronDown className="h-3.5 w-3.5" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className="z-50 min-w-[10rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-elevated)] p-1 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.8)]"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--foreground)] outline-none data-[highlighted]:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="text-[var(--primary)]">
                  <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
