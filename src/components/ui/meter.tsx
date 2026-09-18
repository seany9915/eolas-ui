import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cn } from '@/lib/utils';

export interface MeterProps {
  value: number;
  min?: number;
  max?: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  'aria-valuetext'?: string;
  getAriaValueText?: (formattedValue: string, value: number) => string;
  className?: string;
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success';
}

const MeterComponent = React.forwardRef<HTMLDivElement, MeterProps>(({
  value,
  min = 0,
  max = 100,
  label,
  description,
  format,
  locale,
  'aria-valuetext': ariaValueText,
  getAriaValueText,
  className,
  colorRole = 'primary',
  ...props
}, ref) => {
  const bgClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
    warning: 'bg-warning',
    error: 'bg-error',
    success: 'bg-success',
  }[colorRole];

  return (
    <BaseMeter.Root
      ref={ref}
      value={value}
      min={min}
      max={max}
      format={format}
      locale={locale}
      aria-valuetext={ariaValueText}
      getAriaValueText={getAriaValueText}
      className={cn('space-y-1.5 w-full', className)}
      {...props}
    >
      {(label || value !== undefined) && (
        <div className="flex items-center justify-between font-label text-sm font-semibold text-on-surface">
          {label && <BaseMeter.Label>{label}</BaseMeter.Label>}
          <BaseMeter.Value className="font-mono text-sm font-bold text-on-surface">
            {(formattedValue, val) => formattedValue || `${val}%`}
          </BaseMeter.Value>
        </div>
      )}
      {description && (
        <span className="font-sans text-sm text-on-surface-variant block">
          {description}
        </span>
      )}
      <BaseMeter.Track className="w-full h-3 rounded-full bg-surface-variant overflow-hidden relative border border-outline-variant">
        <BaseMeter.Indicator
          className={cn(
            'h-full transition-all duration-[var(--duration-standard)] ease-[var(--ease-standard)]',
            bgClasses
          )}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
});

MeterComponent.displayName = 'Meter';

// Compound export mapping Base UI primitives
export const Meter = Object.assign(MeterComponent, {
  Root: BaseMeter.Root,
  Track: BaseMeter.Track,
  Indicator: BaseMeter.Indicator,
  Value: BaseMeter.Value,
  Label: BaseMeter.Label,
});

// Re-export Base UI primitives for compound composition
export { BaseMeter };
export const MeterRoot = BaseMeter.Root;
export const MeterLabel = BaseMeter.Label;
export const MeterValue = BaseMeter.Value;
export const MeterTrack = BaseMeter.Track;
export const MeterIndicator = BaseMeter.Indicator;

