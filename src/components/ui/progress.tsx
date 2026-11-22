'use client';

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
import { cn, composeClassName } from '@/lib/utils';

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseProgress.Root>, 'value'> {
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
          data-slot="progress"
          value={value ?? null}
          max={max}
          min={min}
          format={format}
          locale={locale}
          {...(ariaValueText !== undefined ? { 'aria-valuetext': ariaValueText } : {})}
          getAriaValueText={getAriaValueText}
          aria-label={props['aria-label'] || label || (children ? undefined : 'Progress')}
          className={composeClassName('flex flex-col gap-1.5 w-full', className)}
          {...props}
        >
          {children}
        </BaseProgress.Root>
      );
    }

    const isIndeterminate =
      value === null || value === undefined || !Number.isFinite(value);
    const range = max - min;
    const percentage =
      isIndeterminate || range <= 0
        ? 0
        : Math.min(100, Math.max(0, ((value - min) / range) * 100));
    const shouldShowValue = showValue !== undefined ? showValue : label !== undefined;
    const hasHeader = Boolean(label || (shouldShowValue && !isIndeterminate));

    return (
      <BaseProgress.Root
        ref={ref}
        data-slot="progress"
        value={value ?? null}
        max={max}
        min={min}
        format={format}
        locale={locale}
        {...(ariaValueText !== undefined ? { 'aria-valuetext': ariaValueText } : {})}
        getAriaValueText={getAriaValueText}
        aria-label={props['aria-label'] || label || 'Progress'}
        className={composeClassName('flex flex-col gap-1.5 w-full', className)}
        {...props}
      >
        {hasHeader && (
          <div className="flex justify-between items-center font-label text-sm font-semibold text-on-surface">
            {label && <BaseProgress.Label data-slot="progress-label">{label}</BaseProgress.Label>}
            {shouldShowValue && !isIndeterminate && (
              <BaseProgress.Value data-slot="progress-value" className="font-mono text-sm font-bold text-on-surface tabular-nums">
                {(formattedValue, val) => formattedValue || `${val ?? Math.round(percentage)}%`}
              </BaseProgress.Value>
            )}
          </div>
        )}
        <BaseProgress.Track
          data-slot="progress-track"
          className={cn(
            'relative w-full rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30',
            sizeClasses[size],
            trackClassName
          )}
        >
          <BaseProgress.Indicator
            data-slot="progress-indicator"
            className={cn(
              'h-full bg-primary transition-[width] duration-[var(--duration-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none',
              'data-[indeterminate]:w-full motion-safe:data-[indeterminate]:animate-pulse'
            )}
          />
        </BaseProgress.Track>
      </BaseProgress.Root>
    );
  }
);
ProgressComponent.displayName = 'Progress';

export const ProgressRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseProgress.Root>
>((props, ref) => <BaseProgress.Root ref={ref} data-slot="progress" {...props} />);
ProgressRoot.displayName = 'ProgressRoot';

export const ProgressLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseProgress.Label>
>((props, ref) => <BaseProgress.Label ref={ref} data-slot="progress-label" {...props} />);
ProgressLabel.displayName = 'ProgressLabel';

export const ProgressValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseProgress.Value>
>((props, ref) => <BaseProgress.Value ref={ref} data-slot="progress-value" {...props} />);
ProgressValue.displayName = 'ProgressValue';

export const ProgressTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseProgress.Track>
>((props, ref) => <BaseProgress.Track ref={ref} data-slot="progress-track" {...props} />);
ProgressTrack.displayName = 'ProgressTrack';

export const ProgressIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseProgress.Indicator>
>((props, ref) => <BaseProgress.Indicator ref={ref} data-slot="progress-indicator" {...props} />);
ProgressIndicator.displayName = 'ProgressIndicator';

// Compound export mapping Base UI primitives
export const Progress = Object.assign(ProgressComponent, {
  Root: ProgressRoot,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Value: ProgressValue,
});

// Re-export Base UI primitives for compound composition
export { BaseProgress };

// Cross-export Skeleton for backward compatibility with existing imports
export { Skeleton } from './skeleton';

export default Progress;
