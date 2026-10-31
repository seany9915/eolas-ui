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
import { cn } from '@/lib/utils';

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
    const [internalActiveId, setInternalActiveId] = React.useState<string>(
      items[0]?.id ?? ''
    );

    const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

    const handleActiveChange = React.useCallback(
      (newId: string) => {
        if (newId && newId !== activeId) {
          if (controlledActiveId === undefined) {
            setInternalActiveId(newId);
          }
          onActiveChange?.(newId);
        }
      },
      [activeId, controlledActiveId, onActiveChange]
    );

    React.useEffect(() => {
      if (typeof window === 'undefined' || items.length === 0) return;

      // 1. Check for native CSS scroll-target-group support
      const supportsScrollTargetGroup =
        typeof CSS !== 'undefined' &&
        typeof CSS.supports === 'function' &&
        CSS.supports('scroll-target-group: auto');

      if (supportsScrollTargetGroup) {
        const syncCurrent = () => {
          const currentLink = document.querySelector<HTMLAnchorElement>(
            'nav.scrollspy-nav a:target-current'
          );
          if (currentLink) {
            const href = currentLink.getAttribute('href');
            const targetId = href?.startsWith('#') ? href.slice(1) : href;
            if (targetId) {
              handleActiveChange(targetId);
            }
          }
        };

        syncCurrent();
        document.addEventListener('scrollend', syncCurrent);
        return () => {
          document.removeEventListener('scrollend', syncCurrent);
        };
      }

      // 2. IntersectionObserver fallback for Safari, Firefox, and older Chrome
      const sectionElements = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (sectionElements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handleActiveChange(entry.target.id);
            }
          });
        },
        { rootMargin, threshold: 0 }
      );

      sectionElements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, [items, rootMargin, handleActiveChange]);

    const isHorizontal = orientation === 'horizontal';

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'scrollspy-nav text-sm font-sans',
          isHorizontal
            ? 'flex items-center gap-1 overflow-x-auto border-b border-outline-variant/40'
            : 'flex flex-col space-y-1',
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const href = item.href || `#${item.id}`;

          return (
            <a
              key={item.id}
              href={href}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                // Base layout with mandatory 44px touch target floor
                'scrollspy-link inline-flex items-center transition-[color,background-color,border-color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] select-none cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isHorizontal
                  ? cn(
                      'min-h-[44px] px-3.5 py-2 -mb-px border-b-2 font-medium text-xs',
                      isActive
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
                    )
                  : cn(
                      'min-h-[44px] px-3.5 py-2 rounded-md font-medium text-xs transition-colors',
                      isActive
                        ? 'bg-primary-container/40 text-primary font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
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
