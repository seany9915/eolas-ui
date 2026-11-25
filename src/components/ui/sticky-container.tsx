'use client';

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
    const onStuckChangeRef = React.useRef(onStuckChange);
    onStuckChangeRef.current = onStuckChange;

    const [isStuckFallback, setIsStuckFallback] = React.useState<boolean>(false);
    const [supportsScrollState, setSupportsScrollState] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
        setSupportsScrollState(CSS.supports('container-type', 'scroll-state'));
      }
    }, []);

    const needsJsTracking = !supportsScrollState || Boolean(onStuckChange) || Boolean(stuckClassName);

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
      if (!needsJsTracking) {
        setIsStuckFallback(false);
        return;
      }

      const container = containerRef.current;
      const sentinel = sentinelRef.current;
      if (!container || !sentinel) return;

      const root = getScrollParent(container.parentNode ?? null);
      const sentinelContainedInRoot =
        !root ||
        (sentinel.offsetParent instanceof Node && root.contains(sentinel.offsetParent));

      // If an inner scroll container is not positioned (static), an out-of-flow absolute sentinel
      // would anchor outside `root`; fall back to a passive scroll check against the sticky container.
      if (root && !sentinelContainedInRoot) {
        let rafId = 0;
        const checkStuck = () => {
          const rootTop = root.getBoundingClientRect().top;
          const containerTop = container.getBoundingClientRect().top;
          const stuck = root.scrollTop > 0 && containerTop <= rootTop + topOffset + 1;
          setIsStuckFallback((prev) => {
            if (prev !== stuck) {
              onStuckChangeRef.current?.(stuck);
            }
            return stuck;
          });
        };
        const handleScroll = () => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(checkStuck);
        };
        checkStuck();
        root.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
          cancelAnimationFrame(rafId);
          root.removeEventListener('scroll', handleScroll);
        };
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          const rootTop = entry.rootBounds?.top ?? topOffset;
          const stuck = !entry.isIntersecting && entry.boundingClientRect.bottom <= rootTop + 1;
          setIsStuckFallback((prev) => {
            if (prev !== stuck) {
              onStuckChangeRef.current?.(stuck);
            }
            return stuck;
          });
        },
        {
          root,
          rootMargin: `-${topOffset}px 0px 0px 0px`,
          threshold: [0, 1],
        }
      );

      observer.observe(sentinel);

      return () => {
        observer.disconnect();
      };
    }, [topOffset, needsJsTracking]);

    const stickyElement = (
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
        {/* Inner presentation wrapper queried by @container scroll-state(stuck: top) */}
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
    );

    // Pure CSS scroll-state path: render sticky container directly (zero sentinel, zero display: contents)
    if (!needsJsTracking) {
      return stickyElement;
    }

    return (
      <>
        {/* Zero-offset 1px sentinel positioned immediately above stickyElement */}
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="h-px w-full -mb-px p-0 opacity-0 pointer-events-none"
        />
        {stickyElement}
      </>
    );
  }
);
StickyContainer.displayName = 'StickyContainer';
