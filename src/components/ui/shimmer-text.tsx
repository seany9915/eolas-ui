/**
 * ShimmerText
 *
 * Ambient streaming text shimmer based on transitions.dev (15-shimmer-text.md).
 * Platform Reference: https://transitions.dev/detail.html?t=shimmer-text
 *
 * Sweeps a subtle brand highlight across muted text on a continuous loop
 * to communicate live AI reasoning, clinical transcription, or background sync.
 *
 * Completely CSP-compliant with zero runtime inline <style> injection.
 * Automatically suppresses animation and settles into high-contrast text when
 * prefers-reduced-motion is active.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Component HTML tag to render. Defaults to 'span'. */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4';
  /** Whether the shimmer animation is active. Defaults to true. */
  active?: boolean;
  /** Color theme for the sweeping highlight band. Defaults to 'primary'. */
  variant?: 'primary' | 'neutral' | 'secondary';
  /** Cycle duration in milliseconds. Defaults to 2200. */
  duration?: number;
  className?: string;
}

export const ShimmerText = React.forwardRef<HTMLElement, ShimmerTextProps>(
  (
    {
      children,
      as: Component = 'span',
      active = true,
      variant = 'primary',
      duration = 2200,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const highlightColor =
      variant === 'secondary'
        ? 'var(--color-secondary)'
        : variant === 'neutral'
          ? 'var(--color-on-surface)'
          : 'var(--color-primary)';

    return (
      <Component
        ref={ref as never}
        className={cn(
          'inline-block font-sans text-on-surface-variant',
          active && 'animate-shimmer-sweep',
          'motion-reduce:animate-none motion-reduce:bg-none! motion-reduce:text-on-surface-variant! motion-reduce:[-webkit-text-fill-color:currentColor]!',
          className
        )}
        style={{
          ...(active
            ? {
                backgroundImage: `linear-gradient(90deg, var(--color-on-surface-variant) 0%, var(--color-on-surface-variant) 35%, ${highlightColor} 50%, var(--color-on-surface-variant) 65%, var(--color-on-surface-variant) 100%)`,
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                '--shimmer-dur': `${duration}ms`,
              }
            : {}),
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ShimmerText.displayName = 'ShimmerText';

export default ShimmerText;
