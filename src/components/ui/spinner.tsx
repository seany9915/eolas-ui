/**
 * Spinner primitive.
 *
 * Base UI Integration: Companion status & loading indicator.
 * Specification & Reference: https://ui.shadcn.com/docs/components/base/spinner
 *
 * TAXONOMY & USAGE:
 * - Lightweight, accessible loading indicator showing asynchronous operations.
 * - Suitable for standalone loading states, form submission feedback, and inline button indicators.
 * - Accessible: renders role="status" and aria-label="Loading", with motion-reduce:animate-none for vestibular safety.
 * - Automatically inherits currentColor for flawless integration across buttons, badges, and text.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: SpinnerSize;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
};

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'sm', label = 'Loading', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        role="status"
        aria-label={label}
        data-slot="spinner"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'animate-spin motion-reduce:animate-none shrink-0',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
        <path d="M12 3a9 9 0 0 1 9 9" />
      </svg>
    );
  }
);
Spinner.displayName = 'Spinner';

export default Spinner;
