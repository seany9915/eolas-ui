import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SuccessCheckProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  trigger?: boolean | number | string;
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
 * Celebratory checkmark stroke-draw animation based on transitions.dev.
 * Provides instant positive feedback when a patient completes a drill,
 * an audio recording succeeds, or a clinical form is submitted.
 *
 * Complies strictly with WCAG 2.2 and prefers-reduced-motion.
 */
export const SuccessCheck = React.forwardRef<SVGSVGElement, SuccessCheckProps>(
  (
    {
      size = 'md',
      trigger = true,
      onAnimationEnd,
      className,
      ...props
    },
    ref
  ) => {
    const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];

    return (
      <div
        className={cn('inline-flex items-center justify-center shrink-0 select-none', className)}
        role="status"
        aria-live="polite"
      >
        <svg
          ref={ref}
          key={String(trigger)}
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
          onAnimationEnd={onAnimationEnd}
          {...props}
        >
          {/* Background Circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            className="fill-success transition-transform duration-[var(--duration-quick)] animate-check-pop motion-reduce:animate-none motion-reduce:transition-none"
          />

          {/* Stroke-Drawn Checkmark */}
          <path
            d="M12 20.5L17.5 26L28 15"
            stroke="var(--color-on-success)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 26,
              strokeDashoffset: 26,
            }}
            className="animate-check-draw motion-reduce:stroke-dashoffset-0 motion-reduce:animate-none"
          />
        </svg>

        <span className="sr-only">Success</span>
      </div>
    );
  }
);

SuccessCheck.displayName = 'SuccessCheck';
