/**
 * SwipeReveal primitive.
 *
 * Platform Reference: Modern Web Guidance (MWG: swipe-to-reveal)
 *
 * TAXONOMY & USAGE:
 * - A compositor-driven swipe-to-reveal action row built on CSS scroll-snap and `overscroll-behavior: chain`.
 * - Avoids main-thread pointermove/touchmove JS listener bottlenecks for sub-50ms INP responsiveness.
 * - Handles keyboard focus gracefully by snapping content back when tabbing with :focus-visible.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, 44px minimum hit-targets,
 *   and floating 2px focus rings.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '@/lib/utils';

export interface SwipeRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The primary content pane (snapped to start) */
  children: React.ReactNode;
  /** Action buttons revealed on trailing swipe (end) */
  actions?: React.ReactNode;
  /** Action buttons revealed on leading swipe (start) */
  leadingActions?: React.ReactNode;
  /** When true, disables swipe-to-reveal track interaction */
  disabled?: boolean;
  /** Optional callback fired when the revealed panel opens or closes */
  onOpenChange?: (open: boolean) => void;
}

export const SwipeRevealContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          'w-full min-w-full bg-surface text-on-surface [scroll-snap-align:start] outline-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SwipeRevealContent.displayName = 'SwipeRevealContent';

export interface SwipeRevealPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'start' | 'end';
}

export const SwipeRevealPanel = React.forwardRef<HTMLDivElement, SwipeRevealPanelProps>(
  ({ className, side = 'end', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-stretch shrink-0',
          side === 'start' ? '[scroll-snap-align:start]' : '[scroll-snap-align:end]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SwipeRevealPanel.displayName = 'SwipeRevealPanel';

export interface SwipeRevealActionProps extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  variant?: 'primary' | 'secondary' | 'error' | 'surface';
  children: React.ReactNode;
}

export const SwipeRevealAction = React.forwardRef<HTMLButtonElement, SwipeRevealActionProps>(
  ({ className, variant = 'surface', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary text-on-primary hover:bg-primary/90',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
      error: 'bg-error text-on-error hover:bg-error/90',
      surface: 'bg-surface-container text-on-surface hover:bg-surface-variant',
    };

    return (
      <BaseButton
        ref={ref}
        type="button"
        className={cn(
          'min-w-[48px] min-h-[44px] px-4 flex items-center justify-center font-label text-sm font-semibold cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-[var(--duration-quick)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </BaseButton>
    );
  }
);
SwipeRevealAction.displayName = 'SwipeRevealAction';

const SwipeRevealComponent = React.forwardRef<HTMLDivElement, SwipeRevealProps>(
  (
    {
      className,
      children,
      actions,
      leadingActions,
      disabled = false,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Snap content back into view on keyboard focus inside the content pane
    React.useEffect(() => {
      const content = contentRef.current;
      if (!content) return;

      const handleFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        if (target && target.matches(':focus-visible')) {
          content.scrollIntoView({
            block: 'nearest',
            inline: 'start',
          });
          onOpenChange?.(false);
        }
      };

      content.addEventListener('focusin', handleFocusIn);
      return () => {
        content.removeEventListener('focusin', handleFocusIn);
      };
    }, [onOpenChange]);

    const hasLeading = Boolean(leadingActions);
    const hasTrailing = Boolean(actions);

    const gridColumns = hasLeading && hasTrailing
      ? 'grid-cols-[max-content_100%_max-content]'
      : hasLeading
        ? 'grid-cols-[max-content_100%]'
        : 'grid-cols-[100%_max-content]';

    return (
      <div
        ref={(node) => {
          (scrollerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'grid overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-webkit-overflow-scrolling:touch]',
          // overscroll-behavior: chain prevents local rubber-band bounce while allowing parent scroll chaining
          '[overscroll-behavior:auto] [overscroll-behavior:chain]',
          gridColumns,
          disabled && 'overflow-x-hidden pointer-events-none',
          'rounded-md border border-outline-variant/50 shadow-ambient',
          className
        )}
        {...props}
      >
        {leadingActions && (
          <SwipeRevealPanel side="start">
            {leadingActions}
          </SwipeRevealPanel>
        )}

        <SwipeRevealContent ref={contentRef}>
          {children}
        </SwipeRevealContent>

        {actions && (
          <SwipeRevealPanel side="end">
            {actions}
          </SwipeRevealPanel>
        )}
      </div>
    );
  }
);

SwipeRevealComponent.displayName = 'SwipeReveal';

export const SwipeReveal = Object.assign(SwipeRevealComponent, {
  Content: SwipeRevealContent,
  Panel: SwipeRevealPanel,
  Action: SwipeRevealAction,
});

export default SwipeReveal;
