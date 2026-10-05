/**
 * Progress primitive (@base-ui/react/progress).
 *
 * Base UI Documentation: https://base-ui.com/react/components/progress
 *
 * TAXONOMY & USAGE:
 * - Displays the completion status of a task or process.
 * - Supports determinate values as well as indeterminate loading state (value=null/undefined).
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, semantic tokens, and motion restraint.
 */
import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value?: number | null;
  max?: number;
  min?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  trackClassName?: string;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  'aria-valuetext'?: string;
  getAriaValueText?: (formattedValue: string | null, value: number | null) => string;
  children?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3',
};

const ProgressComponent = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      min = 0,
      label,
      showValue,
      size = 'md',
      trackClassName,
      format,
      locale,
      'aria-valuetext': ariaValueText,
      getAriaValueText,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Composable compound usage
    if (children) {
      return (
        <BaseProgress.Root
          ref={ref}
          value={value ?? null}
          max={max}
          min={min}
          format={format}
          locale={locale}
          aria-valuetext={ariaValueText}
          getAriaValueText={getAriaValueText}
          className={cn('flex flex-col gap-1.5 w-full', className)}
          {...props}
        >
          {children}
        </BaseProgress.Root>
      );
    }

    const isIndeterminate = value === null || value === undefined;
    const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    const shouldShowValue = showValue !== undefined ? showValue : label !== undefined;
    const hasHeader = Boolean(label || (shouldShowValue && !isIndeterminate));

    return (
      <BaseProgress.Root
        ref={ref}
        value={value ?? null}
        max={max}
        min={min}
        format={format}
        locale={locale}
        aria-valuetext={ariaValueText}
        getAriaValueText={getAriaValueText}
        className={cn('flex flex-col gap-1.5 w-full', className)}
        {...props}
      >
        {hasHeader && (
          <div className="flex justify-between items-center font-label text-sm font-semibold text-on-surface">
            {label && <BaseProgress.Label>{label}</BaseProgress.Label>}
            {shouldShowValue && !isIndeterminate && (
              <BaseProgress.Value className="font-mono text-sm font-bold text-on-surface tabular-nums">
                {(formattedValue, val) => formattedValue || `${val ?? Math.round(percentage)}%`}
              </BaseProgress.Value>
            )}
          </div>
        )}
        <BaseProgress.Track
          className={cn(
            'relative w-full rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30',
            sizeClasses[size],
            trackClassName
          )}
        >
          <BaseProgress.Indicator
            className={cn(
              'h-full bg-primary transition-[width] duration-[var(--duration-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:animate-none',
              'data-[indeterminate]:w-full data-[indeterminate]:animate-pulse'
            )}
          />
        </BaseProgress.Track>
      </BaseProgress.Root>
    );
  }
);
ProgressComponent.displayName = 'Progress';

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
export const ProgressLabel = BaseProgress.Label;
export const ProgressValue = BaseProgress.Value;
export const ProgressTrack = BaseProgress.Track;
export const ProgressIndicator = BaseProgress.Indicator;

// Cross-export Skeleton for backward compatibility with existing imports
export { Skeleton } from './skeleton';

export default Progress;
