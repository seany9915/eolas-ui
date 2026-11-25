'use client';

/**
 * Scrollspy primitive.
 *
 * Platform Reference: Modern Web Guidance (MWG: scrollspy)
 *
 * TAXONOMY & USAGE:
 * - In-page table of contents and section navigation primitive.
 * - Synchronizes active reading position in navigation links with visible page sections.
 * - Uses compositor-driven `scroll-target-group: auto` (Chrome/Edge 140+) with an
 *   accessible `IntersectionObserver` fallback for Safari and Firefox.
 * - Sets explicit `aria-current="true"` on the active link for screen reader synchronicity.
 * - Adheres to WCAG 2.2 SC 2.5.8 (44x44px minimum touch targets) and WCAG 1.4.1 (non-color active cues).
 * - Complies with DESIGN.md and anti-patterns.md: symmetrical rounded-md geometry without asymmetric single-sided card borders.
 */
import * as React from 'react';
import { cn, sanitizeUrl } from '@/lib/utils';

export interface ScrollspyItem {
  /** Target section DOM element ID without hash (e.g. 'overview') */
  id: string;
  /** Visible navigation link label */
  label: React.ReactNode;
  /** Optional custom URL or anchor href. Defaults to `#${id}` */
  href?: string;
}

export interface ScrollspyProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Array of section items to track */
  items: ScrollspyItem[];
  /** Controlled active section ID override */
  activeId?: string;
  /** Callback fired when the active section changes */
  onActiveChange?: (activeId: string) => void;
  /** Viewport intersection margin for section threshold detection. Defaults to '-20% 0px -70% 0px' */
  rootMargin?: string;
  /** Custom classes for individual navigation links */
  itemClassName?: string;
  /** Custom classes applied specifically to the active link */
  activeItemClassName?: string;
  /** Direction layout: 'vertical' (sidebar TOC) or 'horizontal' (sticky subnav). Defaults to 'vertical' */
  orientation?: 'vertical' | 'horizontal';
}

function getScrollParent(node: Element | null): HTMLElement | null {
  let current = node?.parentElement ?? null;
  while (current && current !== document.body && current !== document.documentElement) {
    const { overflow, overflowY, overflowX } = getComputedStyle(current);
    const isScrollableY =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay' || overflow === 'auto' || overflow === 'scroll') &&
      current.scrollHeight > current.clientHeight;
    const isScrollableX =
      (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay' || overflow === 'auto' || overflow === 'scroll') &&
      current.scrollWidth > current.clientWidth;
    if (isScrollableY || isScrollableX) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export const Scrollspy = React.forwardRef<HTMLElement, ScrollspyProps>(
  (
    {
      items,
      activeId: controlledActiveId,
      onActiveChange,
      rootMargin = '-20% 0px -70% 0px',
      className,
      itemClassName,
      activeItemClassName,
      orientation = 'vertical',
      'aria-label': ariaLabel = 'Table of contents',
      ...props
    },
    ref
  ) => {
    const navRef = React.useRef<HTMLElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        navRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    const [internalActiveId, setInternalActiveId] = React.useState<string>(
      items[0]?.id ?? ''
    );

    const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
    const activeIdRef = React.useRef(activeId);
    const controlledActiveIdRef = React.useRef(controlledActiveId);
    const onActiveChangeRef = React.useRef(onActiveChange);
    activeIdRef.current = activeId;
    controlledActiveIdRef.current = controlledActiveId;
    onActiveChangeRef.current = onActiveChange;

    // Stable callback so IntersectionObserver / scrollend do not tear down on every active section change
    const handleActiveChange = React.useCallback((newId: string) => {
      if (newId && newId !== activeIdRef.current) {
        activeIdRef.current = newId;
        if (controlledActiveIdRef.current === undefined) {
          setInternalActiveId(newId);
        }
        onActiveChangeRef.current?.(newId);
      }
    }, []);

    const isExternallyManaged = controlledActiveId !== undefined && !onActiveChange;

    React.useEffect(() => {
      if (typeof window === 'undefined' || items.length === 0 || isExternallyManaged) return;

      const sectionElements = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);
      const scrollContainer = getScrollParent(sectionElements[0] ?? null);

      // 1. Check for native CSS scroll-target-group support
      const supportsScrollTargetGroup =
        typeof CSS !== 'undefined' &&
        typeof CSS.supports === 'function' &&
        CSS.supports('scroll-target-group: auto');

      if (supportsScrollTargetGroup) {
        const syncCurrent = () => {
          const currentLink = navRef.current?.querySelector<HTMLAnchorElement>('a:target-current');
          if (currentLink) {
            const href = currentLink.getAttribute('href');
            const rawTargetId = href?.startsWith('#') ? href.slice(1) : href;
            if (rawTargetId) {
              let decodedId = rawTargetId;
              try {
                decodedId = decodeURIComponent(rawTargetId);
              } catch {
                // Fall back to rawTargetId on malformed percent-encoding
              }
              const matchedItem = items.find(
                (item) => item.id === decodedId || item.id === rawTargetId
              );
              handleActiveChange(matchedItem ? matchedItem.id : decodedId);
            }
          }
        };

        syncCurrent();
        const scrollTarget: EventTarget = scrollContainer ?? document;
        scrollTarget.addEventListener('scrollend', syncCurrent);
        return () => {
          scrollTarget.removeEventListener('scrollend', syncCurrent);
        };
      }

      // 2. IntersectionObserver fallback for Safari, Firefox, and older Chrome
      if (sectionElements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handleActiveChange(entry.target.id);
            }
          });
        },
        { root: scrollContainer, rootMargin, threshold: 0 }
      );

      sectionElements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, [items, rootMargin, handleActiveChange, isExternallyManaged]);

    const isHorizontal = orientation === 'horizontal';

    return (
      <nav
        ref={setRefs}
        aria-label={ariaLabel}
        className={cn(
          'scrollspy-nav text-sm font-sans',
          isHorizontal
            ? 'flex items-center gap-1 overflow-x-auto border-b border-outline-variant/40'
            : 'flex flex-col gap-1',
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const href = sanitizeUrl(item.href) || `#${encodeURIComponent(item.id)}`;

          return (
            <a
              key={item.id}
              href={href}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                // Base layout with mandatory 44px touch target floor and constant font-semibold to avoid active width shift
                'scrollspy-link inline-flex items-center transition-[color,background-color,border-color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none select-none cursor-pointer font-semibold text-sm',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isHorizontal
                  ? cn(
                      'shrink-0 whitespace-nowrap min-h-[44px] px-3.5 py-2 -mb-px rounded-t border-b-2',
                      isActive
                        ? 'border-primary bg-primary-container text-on-primary-container'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-state-hover hover:border-outline-variant'
                    )
                  : cn(
                      'min-h-[44px] px-3.5 py-2 rounded transition-colors motion-reduce:transition-none',
                      isActive
                        ? 'bg-primary-container text-on-primary-container'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover'
                    ),
                isActive && activeItemClassName,
                itemClassName
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    );
  }
);
Scrollspy.displayName = 'Scrollspy';
