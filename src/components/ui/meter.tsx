/**
 * Meter primitive (@base-ui/react/meter).
 *
 * Base UI Documentation: https://base-ui.com/react/components/meter
 *
 * TAXONOMY & USAGE:
 * - Displays a graphical meter representing a scalar value within a known range (e.g. disk space, battery level, audio volume).
 * - For task progress towards completion, use Progress instead.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, semantic tokens, and motion restraint.
 */
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
  children?: React.ReactNode;
  className?: string;
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success';
}

const colorRoleClasses: Record<'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success', string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  warning: 'bg-warning',
  error: 'bg-error',
  success: 'bg-success',
};

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
  children,
  className,
  colorRole = 'primary',
  ...props
}, ref) => {
  // Composable compound usage
  if (children) {
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
        {children}
      </BaseMeter.Root>
    );
  }

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
          <BaseMeter.Value className="font-mono text-sm font-bold text-on-surface tabular-nums">
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
            'h-full transition-[width] duration-[var(--duration-standard)] ease-[var(--ease-standard)] motion-reduce:transition-none',
            colorRoleClasses[colorRole]
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

export default Meter;
