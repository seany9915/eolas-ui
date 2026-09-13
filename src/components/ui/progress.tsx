import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value?: number | null;
  max?: number;
  min?: number;
  label?: string;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  'aria-valuetext'?: string;
  getAriaValueText?: (formattedValue: string | null, value: number | null) => string;
  className?: string;
}

const ProgressComponent: React.FC<ProgressProps> = ({
  value,
  max = 100,
  min = 0,
  label,
  format,
  locale,
  'aria-valuetext': ariaValueText,
  getAriaValueText,
  className,
}) => {
  const isIndeterminate = value === null || value === undefined;
  const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <BaseProgress.Root
      value={value ?? null}
      max={max}
      min={min}
      format={format}
      locale={locale}
      aria-valuetext={ariaValueText}
      getAriaValueText={getAriaValueText}
      className={cn('flex flex-col gap-1.5 w-full', className)}
    >
      {(label || !isIndeterminate) && (
        <div className="flex justify-between items-center font-label text-xs font-semibold text-on-surface">
          {label && <BaseProgress.Label>{label}</BaseProgress.Label>}
          {!isIndeterminate && (
            <BaseProgress.Value className="font-mono text-on-surface-variant">
              {(formattedValue, val) => formattedValue || `${val ?? Math.round(percentage)}%`}
            </BaseProgress.Value>
          )}
        </div>
      )}
      <BaseProgress.Track className="relative w-full h-3 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30">
        <BaseProgress.Indicator
          className={cn(
            'h-full bg-primary rounded-full transition-[width] duration-[var(--duration-medium)] ease-[var(--ease-standard)]',
            'data-[indeterminate]:w-full data-[indeterminate]:animate-pulse'
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
};

// Compound export mapping Base UI primitives
export const Progress = Object.assign(ProgressComponent, {
  Root: BaseProgress.Root,
  Track: BaseProgress.Track,
  Indicator: BaseProgress.Indicator,
  Label: BaseProgress.Label,
  Value: BaseProgress.Value,
});

// Re-export Base UI primitives for compound composition
export { BaseProgress };
export const ProgressRoot = BaseProgress.Root;
export const ProgressTrack = BaseProgress.Track;
export const ProgressIndicator = BaseProgress.Indicator;
export const ProgressLabel = BaseProgress.Label;
export const ProgressValue = BaseProgress.Value;


export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-variant/70',
        className
      )}
    />
  );
};
