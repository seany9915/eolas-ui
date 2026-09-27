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

/**
 * ShimmerText
 *
 * Ambient streaming text shimmer based on transitions.dev.
 * Sweeps a subtle brand highlight across muted text on a continuous loop
 * to communicate live AI reasoning, clinical transcription, or background sync.
 *
 * Automatically suppresses animation and settles into high-contrast text when
 * prefers-reduced-motion is active.
 */
export const ShimmerText = React.forwardRef<HTMLElement, ShimmerTextProps>(
  (
    {
      children,
      as: Component = 'span',
      active = true,
      variant = 'primary',
      duration = 2200,
      className,
      ...props
    },
    ref
  ) => {
    // Unique ID for instance-specific scoped styles if custom duration is supplied
    const id = React.useId().replace(/:/g, '');
    const classNameId = `shimmer-text-${id}`;

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
          active && classNameId,
          className
        )}
        {...props}
      >
        {children}

        {active && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
.${classNameId} {
  background: linear-gradient(
    90deg,
    var(--color-on-surface-variant) 0%,
    var(--color-on-surface-variant) 35%,
    ${highlightColor} 50%,
    var(--color-on-surface-variant) 65%,
    var(--color-on-surface-variant) 100%
  );
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: shimmer-sweep-${id} ${duration}ms linear infinite;
}

@keyframes shimmer-sweep-${id} {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .${classNameId} {
    animation: none !important;
    background: none !important;
    color: var(--color-on-surface-variant) !important;
    -webkit-text-fill-color: var(--color-on-surface-variant) !important;
  }
}
`,
            }}
          />
        )}
      </Component>
    );
  }
);

ShimmerText.displayName = 'ShimmerText';
