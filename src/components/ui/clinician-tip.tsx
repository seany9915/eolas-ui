import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export interface ClinicianTipProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual presentation variant:
   * - 'unboxed' (default): Pure Low-Prominence typographic lockup with zero elevation and zero border. Recommended inside cards and exercise drills.
   * - 'inset': Subtle grouping wash (`bg-surface-container`) for canvas forms or multi-field layouts outside cards.
   */
  variant?: 'unboxed' | 'inset';
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
      className={cn(
        'flex items-start gap-2.5 text-left',
        variant === 'inset' && 'rounded-md bg-surface-container px-3.5 py-2.5',
        variant === 'unboxed' && 'pt-2 bg-transparent',
        className
      )}
      {...props}
    >
      {icon && (
        <Icon
          name={icon}
          size="md"
          className="text-secondary shrink-0 mt-0.5"
          aria-hidden="true"
        />
      )}
      <div className="text-base text-on-surface-variant leading-relaxed min-w-0">
        {label ? (
          <span className="font-semibold text-on-surface mr-1.5">{label}:</span>
        ) : null}
        {children}
      </div>
    </div>
  );
});

ClinicianTip.displayName = 'ClinicianTip';
