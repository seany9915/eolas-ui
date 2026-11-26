'use client';

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
import { Icon } from './icon';
import { cn, useMergedRefs } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

export interface SwipeRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The primary content pane (snapped to start) */
  children: React.ReactNode;
  /** Action buttons revealed on trailing swipe (end) */
  actions?: React.ReactNode;
  /** Action buttons revealed on leading swipe (start) */
  leadingActions?: React.ReactNode;
  /** When true, disables swipe-to-reveal track interaction */
  disabled?: boolean;
  /** Renders an accessible visible toggle button for non-swipe / keyboard access (WCAG 2.5.1). When false, keeps a focusable sr-only toggle for keyboard users. */
  showToggle?: boolean;
  /** Accessible label for the toggle button. Defaults to 'Row actions' */
  toggleLabel?: string;
  /** Optional callback fired when the revealed panel opens or closes */
  onOpenChange?: (open: boolean) => void;
}

type SwipeRevealOpenSide = 'none' | 'start' | 'end';

interface SwipeRevealContextValue {
  openSide: SwipeRevealOpenSide;
  isOpen: boolean;
}

const SwipeRevealContext = React.createContext<SwipeRevealContextValue>({
  openSide: 'none',
  isOpen: false,
});

const SwipeRevealPanelSideContext = React.createContext<'start' | 'end' | null>(null);

function getPreferredScrollBehavior(): ScrollBehavior {
  if (prefersReducedMotion()) {
    return 'instant';
  }
  return 'smooth';
}

export const SwipeRevealContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          'swipe-reveal-content w-full min-w-full bg-surface text-on-surface [scroll-snap-align:start] outline-none',
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
    const { openSide } = React.useContext(SwipeRevealContext);
    const isPanelOpen = openSide === side;

    return (
      <SwipeRevealPanelSideContext.Provider value={side}>
        <div
          ref={ref}
          aria-hidden={!isPanelOpen || undefined}
          data-open={isPanelOpen ? '' : undefined}
          className={cn(
            'flex items-stretch shrink-0',
            side === 'start' ? '[scroll-snap-align:start]' : '[scroll-snap-align:end]',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SwipeRevealPanelSideContext.Provider>
    );
  }
);
SwipeRevealPanel.displayName = 'SwipeRevealPanel';

export interface SwipeRevealActionProps extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  variant?: 'primary' | 'secondary' | 'error' | 'surface';
  children: React.ReactNode;
}

export const SwipeRevealAction = React.forwardRef<HTMLButtonElement, SwipeRevealActionProps>(
  ({ className, variant = 'surface', tabIndex, 'aria-hidden': ariaHiddenProp, children, ...props }, ref) => {
    const { openSide, isOpen } = React.useContext(SwipeRevealContext);
    const panelSide = React.useContext(SwipeRevealPanelSideContext);
    const isRevealed = panelSide !== null ? openSide === panelSide : isOpen;

    const variantStyles = {
      primary: 'bg-primary text-on-primary hover:bg-primary/90',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
      error: 'bg-error text-on-error hover:bg-error/90',
      surface: 'bg-surface-container-high text-on-surface hover:bg-surface-container-high/80',
    };

    return (
      <BaseButton
        ref={ref}
        type="button"
        tabIndex={tabIndex ?? (isRevealed ? 0 : -1)}
        aria-hidden={ariaHiddenProp ?? (!isRevealed ? true : undefined)}
        className={cn(
          'min-w-[48px] min-h-[44px] px-4 flex items-center justify-center font-label text-sm font-semibold cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary transition-colors duration-[var(--duration-quick)] motion-reduce:transition-none',
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
      showToggle = true,
      toggleLabel = 'Row actions',
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const startPanelRef = React.useRef<HTMLDivElement>(null);
    const endPanelRef = React.useRef<HTMLDivElement>(null);
    const onOpenChangeRef = React.useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    const panelId = React.useId();
    const [openSide, setOpenSide] = React.useState<SwipeRevealOpenSide>('none');
    const openSideRef = React.useRef<SwipeRevealOpenSide>('none');
    const isOpen = openSide !== 'none';

    const hasLeading = Boolean(leadingActions);
    const hasTrailing = Boolean(actions);

    const scrollToContent = React.useCallback((behavior: ScrollBehavior = getPreferredScrollBehavior()) => {
      const scroller = scrollerRef.current;
      const content = contentRef.current;
      if (!scroller || !content) return;
      const delta = content.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
      if (Math.abs(delta) > 0.5) {
        scroller.scrollBy({ left: delta, behavior });
      }
    }, []);

    const scrollToPanel = React.useCallback(
      (side: 'start' | 'end', behavior: ScrollBehavior = getPreferredScrollBehavior()) => {
        const scroller = scrollerRef.current;
        const panel = side === 'start' ? startPanelRef.current : endPanelRef.current;
        if (!scroller || !panel) return;
        const scrollerRect = scroller.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const isRtl = getComputedStyle(scroller).direction === 'rtl';
        const alignToStartEdge = (side === 'start' && !isRtl) || (side === 'end' && isRtl);
        const delta = alignToStartEdge
          ? panelRect.left - scrollerRect.left
          : panelRect.right - scrollerRect.right;
        if (Math.abs(delta) > 0.5) {
          scroller.scrollBy({ left: delta, behavior });
        }
      },
      []
    );

    // Snap content back into view on keyboard focus inside the content pane
    React.useEffect(() => {
      const content = contentRef.current;
      if (!content) return;

      const handleFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        if (target && target.matches(':focus-visible') && !target.hasAttribute('data-swipe-toggle')) {
          scrollToContent();
        }
      };

      content.addEventListener('focusin', handleFocusIn);
      return () => {
        content.removeEventListener('focusin', handleFocusIn);
      };
    }, [scrollToContent]);

    // Report real open/closed state in both LTR and RTL using getBoundingClientRect() deltas
    React.useEffect(() => {
      const scroller = scrollerRef.current;
      const content = contentRef.current;
      if (!scroller || !content) return;

      let isRtl = getComputedStyle(scroller).direction === 'rtl';

      const updateOpenSide = () => {
        const deltaLeft = content.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
        let nextSide: SwipeRevealOpenSide = 'none';
        if (deltaLeft > 8) {
          nextSide = isRtl ? 'end' : 'start';
        } else if (deltaLeft < -8) {
          nextSide = isRtl ? 'start' : 'end';
        }

        if (nextSide !== openSideRef.current) {
          const prevOpen = openSideRef.current !== 'none';
          const nextOpen = nextSide !== 'none';
          openSideRef.current = nextSide;
          setOpenSide(nextSide);
          if (prevOpen !== nextOpen) {
            onOpenChangeRef.current?.(nextOpen);
          }
        }
      };

      const handleResize = () => {
        isRtl = getComputedStyle(scroller).direction === 'rtl';
        updateOpenSide();
      };

      scroller.addEventListener('scroll', updateOpenSide, { passive: true });
      let ro: ResizeObserver | undefined;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(handleResize);
        ro.observe(scroller);
      }

      return () => {
        scroller.removeEventListener('scroll', updateOpenSide);
        ro?.disconnect();
      };
    }, []);

    // Initial mount fallback for browsers without CSS scroll-initial-target: nearest
    React.useEffect(() => {
      if (!hasLeading) return;
      if (
        typeof CSS !== 'undefined' &&
        typeof CSS.supports === 'function' &&
        CSS.supports('scroll-initial-target', 'nearest')
      ) {
        return;
      }
      scrollToContent('instant');
    }, [hasLeading, scrollToContent]);

    const handleToggleActions = React.useCallback(() => {
      if (disabled) return;
      if (openSideRef.current !== 'none') {
        scrollToContent();
      } else if (hasTrailing) {
        scrollToPanel('end');
      } else if (hasLeading) {
        scrollToPanel('start');
      }
    }, [disabled, hasLeading, hasTrailing, scrollToContent, scrollToPanel]);

    const gridColumns = hasLeading && hasTrailing
      ? 'grid-cols-[max-content_100%_max-content]'
      : hasLeading
        ? 'grid-cols-[max-content_100%]'
        : 'grid-cols-[100%_max-content]';

    const toggleControlsId = hasTrailing ? `${panelId}-end` : `${panelId}-start`;
    const contextValue = React.useMemo(() => ({ openSide, isOpen }), [openSide, isOpen]);
    const mergedScrollerRef = useMergedRefs(scrollerRef, ref);

    return (
      <SwipeRevealContext.Provider value={contextValue}>
        <div
          ref={mergedScrollerRef}
          className={cn(
            'relative swipe-reveal-scroller grid overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:none] motion-safe:scroll-smooth',
            gridColumns,
            disabled && 'overflow-x-hidden',
            'rounded-md border border-outline-variant/50 shadow-ambient',
            className
          )}
          {...props}
        >
          {leadingActions && (
            <SwipeRevealPanel ref={startPanelRef} id={`${panelId}-start`} side="start">
              {leadingActions}
            </SwipeRevealPanel>
          )}

          <SwipeRevealContent
            ref={contentRef}
            className={cn(
              (hasTrailing || hasLeading) &&
                (showToggle ? 'flex items-center justify-between gap-2' : 'relative')
            )}
          >
            {hasTrailing || hasLeading ? (
              showToggle ? (
                <>
                  <div className="min-w-0 flex-1">{children}</div>
                  <BaseButton
                    type="button"
                    data-swipe-toggle=""
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-controls={toggleControlsId}
                    aria-label={toggleLabel}
                    onClick={handleToggleActions}
                    className="shrink-0 me-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-state-hover cursor-pointer transition-colors duration-[var(--duration-quick)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon name={isOpen ? 'close' : 'more_vert'} size="sm" aria-hidden="true" />
                  </BaseButton>
                </>
              ) : (
                <>
                  {children}
                  <BaseButton
                    type="button"
                    data-swipe-toggle=""
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-controls={toggleControlsId}
                    aria-label={toggleLabel}
                    onClick={handleToggleActions}
                    className="sr-only focus:not-sr-only focus:absolute focus:end-2 focus:top-1/2 focus:-translate-y-1/2 focus:z-20 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded bg-surface text-on-surface shadow-ambient cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon name={isOpen ? 'close' : 'more_vert'} size="sm" aria-hidden="true" />
                  </BaseButton>
                </>
              )
            ) : (
              children
            )}
          </SwipeRevealContent>

          {actions && (
            <SwipeRevealPanel ref={endPanelRef} id={`${panelId}-end`} side="end">
              {actions}
            </SwipeRevealPanel>
          )}
        </div>
      </SwipeRevealContext.Provider>
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
