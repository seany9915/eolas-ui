import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SuccessCheckProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  /** Pass boolean or counter to trigger/replay the animation */
  trigger?: boolean | number | string;
  /** Whether to show filled success circular badge background or standalone icon */
  variant?: 'badge' | 'icon';
  onAnimationEnd?: () => void;
  className?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 40,
  lg: 56,
};

/**
 * SuccessCheck
 *
 * Celebratory checkmark entrance transition based strictly on transitions.dev
 * (https://transitions.dev/detail.html?t=success-check / 10-success-check.md).
 *
 * Composes 5 synchronized layers in parallel:
 * 1. Opacity fade (0 -> 1 over 500ms)
 * 2. 80deg rotational upright spin (80deg -> 0deg over 500ms)
 * 3. Optical blur settle (10px -> 0px over 500ms)
 * 4. Y-bob spring overshoot (translateY 40px -> 0 with cubic-bezier(0.34, 1.35, 0.64, 1))
 * 5. SVG stroke-draw (delayed 80ms stroke-dashoffset transition)
 *
 * Complies strictly with WCAG 2.2 and motion-reduce:transition-none.
 */
export const SuccessCheck = React.forwardRef<HTMLDivElement, SuccessCheckProps>(
  (
    {
      size = 'md',
      trigger = true,
      variant = 'badge',
      onAnimationEnd,
      className,
      ...props
    },
    ref
  ) => {
    const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];
    const isBadge = variant === 'badge';

    return (
      <div
        ref={ref}
        key={String(trigger)}
        className={cn(
          'inline-flex items-center justify-center shrink-0 select-none transform-gpu origin-center will-change-[transform,opacity,filter]',
          'animate-success-check motion-reduce:animate-none motion-reduce:transform-none motion-reduce:filter-none',
          className
        )}
        role="status"
        aria-live="polite"
        onAnimationEnd={onAnimationEnd}
        {...props}
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible block"
        >
          {/* Background Circle if badge variant */}
          {isBadge && (
            <circle
              cx="20"
              cy="20"
              r="18"
              className="fill-success"
            />
          )}

          {/* Stroke-Drawn Checkmark */}
          <path
            d="M12 20.5L17.5 26L28 15"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 26,
              strokeDashoffset: 26,
            }}
            className={cn(
              'animate-check-draw motion-reduce:stroke-dashoffset-0 motion-reduce:animate-none',
              isBadge ? 'stroke-on-success' : 'stroke-success'
            )}
          />
        </svg>

        <span className="sr-only">Success</span>
      </div>
    );
  }
);

SuccessCheck.displayName = 'SuccessCheck';

export default SuccessCheck;
