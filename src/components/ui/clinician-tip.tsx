'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

export interface ClinicianTipProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual presentation variant:
   * - 'unboxed' (default): Pure Low-Prominence typographic lockup with zero elevation and zero border. Recommended inside cards and exercise drills.
   * - 'surface': Crisp white surface (`bg-surface`) with `border-outline-variant` for placement on the page canvas.
   * - 'inset': Tonal grouping wash (`bg-surface-container-high`) with `border-outline` for canvas forms or multi-field layouts outside cards.
   */
  variant?: 'unboxed' | 'inset' | 'surface';
  /**
   * Name of the Material Symbol icon. Defaults to 'lightbulb'.
   */
  icon?: string;
  /**
   * Optional prefix label, e.g. 'Clinician tip' or 'Speech cue'. Defaults to 'Clinician tip'.
   * Set to null or empty string to omit the label prefix.
   */
  label?: string | null;
  /**
   * Custom class name for the wrapper container.
   */
  className?: string;
  /**
   * Tip content or instructions.
   */
  children: React.ReactNode;
}

export const ClinicianTip = React.forwardRef<HTMLDivElement, ClinicianTipProps>(({
  variant = 'unboxed',
  icon = 'lightbulb',
  label = 'Clinician tip',
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      data-slot="clinician-tip"
      data-variant={variant}
      className={cn(
        'flex items-start gap-2.5 text-start',
        variant === 'surface' && 'rounded-md bg-surface border border-outline-variant px-3.5 py-2.5',
        variant === 'inset' && 'rounded-md bg-surface-container-high border border-outline px-3.5 py-2.5',
        variant === 'unboxed' && 'bg-transparent',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="inline-flex h-[1.625em] items-center shrink-0">
          <Icon
            name={icon}
            size="md"
            className={cn(
              'text-secondary',
              variant === 'unboxed' && 'inverted:text-tertiary'
            )}
            aria-hidden="true"
          />
        </span>
      )}
      <div
        className={cn(
          'text-base text-on-surface-variant leading-relaxed min-w-0',
          variant === 'unboxed' && 'inverted:text-on-neutral'
        )}
      >
        {label ? (
          <span
            className={cn(
              'font-semibold text-on-surface me-1.5',
              variant === 'unboxed' && 'inverted:text-tertiary'
            )}
          >
            {label}:
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
});

ClinicianTip.displayName = 'ClinicianTip';
