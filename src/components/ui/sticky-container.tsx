/**
 * StickyContainer primitive.
 *
 * Platform Reference: Modern Web Guidance (MWG: state-aware-sticky-headers)
 *
 * TAXONOMY & USAGE:
 * - A state-aware sticky header and toolbar container.
 * - Dynamically elevates (gains ambient box-shadow, surface wash, and border) when stuck to the viewport edge.
 * - Uses compositor-driven CSS Container Scroll-State queries (`container-type: scroll-state`)
 *   with zero main-thread scroll listeners in Chrome 133+ and Edge 133+.
 * - Features an accessible zero-height sentinel and IntersectionObserver fallback for Safari and Firefox.
 * - Prevents layout-shift oscillations by strictly constraining state transitions to non-layout-shifting properties
 *   (background-color, border-color, box-shadow, and backdrop-blur).
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StickyContainerProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Top offset distance when stuck in pixels. Defaults to 0 */
  topOffset?: number;
  /** Z-index layer value. Defaults to 20 */
  zIndex?: number;
  /** Additional classes applied to the inner wrapper when actively stuck */
  stuckClassName?: string;
  /** Additional classes applied to the inner wrapper in both stuck and unstuck states */
  innerClassName?: string;
  /** Callback fired when the stuck state toggles */
  onStuckChange?: (isStuck: boolean) => void;
  children: React.ReactNode;
}

function getScrollParent(node: Node | null): Element | null {
  if (
    !(node instanceof HTMLElement) ||
    node === document.body ||
    node === document.documentElement
  ) {
    return null;
  }
  if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
    const { overflow, overflowY } = getComputedStyle(node);
    if (
      (overflow !== 'visible' && overflow !== 'clip') ||
      (overflowY !== 'visible' && overflowY !== 'clip')
    ) {
      return node;
    }
  }
  return getScrollParent(node.parentNode);
}

export const StickyContainer = React.forwardRef<HTMLDivElement, StickyContainerProps>(
  (
    {
      topOffset = 0,
      zIndex = 20,
      stuckClassName,
      innerClassName,
      onStuckChange,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const sentinelRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [isStuckFallback, setIsStuckFallback] = React.useState<boolean>(false);

    const supportsScrollState =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('container-type: scroll-state');

    const setContainerRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    React.useEffect(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      // Skip IntersectionObserver in browsers supporting scroll-state unless JS hooks are requested
      if (supportsScrollState && !onStuckChange && !stuckClassName) {
        setIsStuckFallback(false);
        return;
      }

      const root = getScrollParent(containerRef.current?.parentNode ?? null);

      const observer = new IntersectionObserver(
        ([entry]) => {
          // When the sentinel is no longer intersecting the top edge, the header is stuck
          const stuck = !entry.isIntersecting;
          setIsStuckFallback(stuck);
          onStuckChange?.(stuck);
        },
        {
          root,
          rootMargin: `-${topOffset + 1}px 0px 0px 0px`,
          threshold: [0, 1],
        }
      );

      observer.observe(sentinel);

      return () => {
        observer.disconnect();
      };
    }, [topOffset, onStuckChange, stuckClassName, supportsScrollState]);

    return (
      <div className="contents">
        {/* Invisible 0px sentinel placed immediately before the sticky container */}
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="h-0 w-0 p-0 m-0 opacity-0 pointer-events-none"
        />

        {/* Outer scroll-state container */}
        <div
          ref={setContainerRef}
          className={cn('sticky-scroll-container w-full', className)}
          style={{
            top: `${topOffset}px`,
            zIndex,
            ...style,
          }}
          {...props}
        >
          {/* Inner presentation wrapper queried by @container sticky-nav scroll-state(stuck: top) */}
          <div
            className={cn(
              'sticky-nav-inner w-full transition-[background-color,border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
              isStuckFallback && (!supportsScrollState ? cn('is-stuck', stuckClassName) : stuckClassName),
              innerClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
StickyContainer.displayName = 'StickyContainer';
