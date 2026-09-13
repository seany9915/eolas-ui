import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cn } from '@/lib/utils';

export interface MeterProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  'aria-valuetext'?: string;
  getAriaValueText?: (formattedValue: string, value: number) => string;
  className?: string;
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success';
}

const MeterComponent: React.FC<MeterProps> = ({
  value,
  min = 0,
  max = 100,
  label,
  format,
  locale,
  'aria-valuetext': ariaValueText,
  getAriaValueText,
  className,
  colorRole = 'primary',
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

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
      value={value}
      min={min}
      max={max}
      format={format}
      locale={locale}
      aria-valuetext={ariaValueText}
      getAriaValueText={getAriaValueText}
      className={cn('space-y-1.5 w-full', className)}
    >
      {(label || value !== undefined) && (
        <div className="flex items-center justify-between font-label text-xs font-semibold text-on-surface-variant">
          {label && <BaseMeter.Label>{label}</BaseMeter.Label>}
          <BaseMeter.Value className="font-mono text-xs font-bold text-on-surface">
            {(formattedValue, val) => formattedValue || `${val}%`}
          </BaseMeter.Value>
        </div>
      )}
      <BaseMeter.Track className="w-full h-3 rounded-full bg-surface-variant overflow-hidden relative border border-outline-variant/30">
        <BaseMeter.Indicator
          className={cn('h-full transition-all duration-300', bgClasses)}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
};

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

