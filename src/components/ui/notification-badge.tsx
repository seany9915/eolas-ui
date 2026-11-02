/**
 * NotificationBadge
 *
 * Isolated diagonal slide-in and scale-pop badge based on transitions.dev (03-notification-badge.md).
 * Platform Reference: https://transitions.dev/detail.html?t=notification-badge
 *
 * Anchors absolutely onto trigger elements (e.g. action buttons, navigation icons)
 * without displacing trigger layout or causing parent jitter.
 *
 * Adheres to Pattern 1 (High-contrast solid fill) with WCAG AAA foreground contrast.
 * Automatically disables motion under prefers-reduced-motion.
 */
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
    if (!visible) return null;

    const isCounted = !dot && count !== undefined;

    return (
      <span
        ref={ref}
        className={cn(
          'absolute -top-1 -right-1 z-10 select-none pointer-events-none inline-flex items-center justify-center font-mono font-bold leading-none',
          'transition-[transform,opacity] duration-fast ease-smooth-out will-change-transform animate-badge-pop',
          'motion-reduce:animate-none motion-reduce:transition-none motion-reduce:transform-none',
          variant === 'primary' && 'bg-primary text-on-primary',
          variant === 'error' && 'bg-error text-on-error',
          variant === 'secondary' && 'bg-secondary text-on-secondary',
          dot
            ? 'size-2.5 rounded-full ring-2 ring-surface'
            : 'min-w-4.5 h-4.5 px-1 text-[10px] rounded-full ring-2 ring-surface',
          className
        )}
        role="status"
        aria-live="polite"
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
