/**
 * ProgressRing primitive (@base-ui/react/progress).
 *
 * Base UI Documentation: https://base-ui.com/react/components/progress
 *
 * TAXONOMY & USAGE:
 * - A circular progress indicator built on Base UI's headless Progress state machine.
 * - Manages accessibility roles (role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax)
 *   and internationalized number formatting headlessly.
 * - Renders a hardware-accelerated SVG conic ring with concentric stroke geometry.
 * - Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint.
 */
import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '@/lib/utils';

export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';
export type ProgressRingColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface ProgressRingProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseProgress.Root>, 'value'> {
  value?: number | null;
  max?: number;
  min?: number;
  size?: ProgressRingSize;
  color?: ProgressRingColor;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

const sizeConfig: Record<ProgressRingSize, { dimension: number; defaultStroke: number; textSize: string }> = {
  sm: { dimension: 48, defaultStroke: 4, textSize: 'text-xs' },
  md: { dimension: 72, defaultStroke: 6, textSize: 'text-sm' },
  lg: { dimension: 96, defaultStroke: 8, textSize: 'text-base' },
  xl: { dimension: 128, defaultStroke: 10, textSize: 'text-xl' },
};

const colorStyles: Record<ProgressRingColor, { indicator: string; track: string }> = {
  primary: { indicator: 'text-primary', track: 'text-surface-container' },
  secondary: { indicator: 'text-secondary', track: 'text-surface-container' },
  success: { indicator: 'text-success', track: 'text-surface-container' },
  warning: { indicator: 'text-warning', track: 'text-surface-container' },
  error: { indicator: 'text-error', track: 'text-surface-container' },
};

const ProgressRingComponent = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      value = 0,
      max = 100,
      min = 0,
      size = 'md',
      color = 'primary',
      strokeWidth: customStroke,
      showValue = true,
      label,
      children,
      className,
      trackClassName,
      indicatorClassName,
      format,
      locale,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size] || sizeConfig.md;
    const strokeWidth = customStroke ?? config.defaultStroke;
    const dimension = config.dimension;
    const radius = (dimension - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const isIndeterminate = value === null || value === undefined;
    const clampedValue = isIndeterminate ? 0 : Math.min(max, Math.max(min, value));
    const percentage = isIndeterminate ? 0 : ((clampedValue - min) / (max - min)) * 100;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colors = colorStyles[color] || colorStyles.primary;

    return (
      <BaseProgress.Root
        ref={ref}
        value={value ?? null}
        max={max}
        min={min}
        format={format}
        locale={locale}
        className={cn('relative inline-flex flex-col items-center justify-center select-none', className)}
        {...props}
      >
        {label && (
          <BaseProgress.Label className="sr-only">
            {label}
          </BaseProgress.Label>
        )}

        <div className="relative inline-flex items-center justify-center" style={{ width: dimension, height: dimension }}>
          <svg
            className={cn(
              'w-full h-full -rotate-90 origin-center',
              isIndeterminate && 'animate-spin motion-reduce:animate-none'
            )}
            viewBox={`0 0 ${dimension} ${dimension}`}
            aria-hidden="true"
          >
            {/* Background track circle */}
            <circle
              cx={dimension / 2}
              cy={dimension / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className={cn(colors.track, trackClassName)}
            />

            {/* Filled progress circle */}
            <circle
              cx={dimension / 2}
              cy={dimension / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={isIndeterminate ? circumference * 0.75 : strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={cn(
                colors.indicator,
                'transition-[stroke-dashoffset] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
                indicatorClassName
              )}
            />
          </svg>

          {/* Center Content Slot */}
          <div className={cn('absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums text-on-surface', config.textSize)}>
            {children !== undefined ? (
              children
            ) : showValue && !isIndeterminate ? (
              <BaseProgress.Value>
                {(formattedValue, val) => formattedValue || `${Math.round(val ?? percentage)}%`}
              </BaseProgress.Value>
            ) : null}
          </div>
        </div>
      </BaseProgress.Root>
    );
  }
);

ProgressRingComponent.displayName = 'ProgressRing';

export const ProgressRing = Object.assign(ProgressRingComponent, {
  Root: BaseProgress.Root,
  Value: BaseProgress.Value,
  Label: BaseProgress.Label,
});

export default ProgressRing;
