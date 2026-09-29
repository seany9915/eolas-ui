import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NotificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Numeric badge count or custom content. If undefined and dot is true, renders a small pip. */
  count?: number | string;
  /** Whether to render as an uncounted indicator dot. Defaults to false. */
  dot?: boolean;
  /** Whether the badge is visible. Defaults to true. */
  visible?: boolean;
  /** Semantic role color. Defaults to 'primary'. */
  variant?: 'primary' | 'error' | 'secondary';
  /** Accessible text for assistive technologies (e.g. "3 unread messages"). */
  srLabel?: string;
  className?: string;
}

/**
 * NotificationBadge
 *
 * Isolated diagonal slide-in and scale-pop badge based on transitions.dev.
 * Anchors absolutely onto trigger elements (e.g. action buttons, navigation icons)
 * without displacing trigger layout or causing parent jitter.
 *
 * Adheres to Pattern 1 (High-contrast solid fill) with WCAG AAA foreground contrast.
 * Automatically disables motion under prefers-reduced-motion.
 */
export const NotificationBadge = React.forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  (
    {
      count,
      dot = false,
      visible = true,
      variant = 'primary',
      srLabel,
      className,
      ...props
    },
    ref
  ) => {
    const isCounted = !dot && count !== undefined;

    const variantStyles = {
      primary: 'bg-primary text-on-primary',
      error: 'bg-error text-on-error',
      secondary: 'bg-secondary text-on-secondary',
    }[variant];

    return (
      <span
        ref={ref}
        aria-hidden={!srLabel}
        className={cn(
          'absolute -top-1 -right-1 z-20 pointer-events-none select-none flex items-center justify-center font-mono font-bold leading-none',
          isCounted
            ? 'min-w-[18px] h-[18px] px-1 text-[11px] rounded-full tabular-nums shadow-ambient'
            : 'w-2.5 h-2.5 rounded-full shadow-ambient',
          variantStyles,
          'transition-[transform,opacity,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none',
          visible
            ? 'opacity-100 scale-100 filter-none animate-badge-pop'
            : 'opacity-0 scale-0 blur-[var(--blur-small,2px)] pointer-events-none',
          className
        )}
        {...props}
      >
        {isCounted ? count : null}
        {srLabel && <span className="sr-only">{srLabel}</span>}
      </span>
    );
  }
);

NotificationBadge.displayName = 'NotificationBadge';

export default NotificationBadge;
