'use client';

/**
 * ReadingProgress primitive (@base-ui/react/progress).
 *
 * Base UI Documentation: https://base-ui.com/react/components/progress
 * Platform Reference: Modern Web Guidance (MWG: scrollytelling / scroll-driven animations)
 *
 * TAXONOMY & USAGE:
 * - Pinned reading/scroll progress indicator built on Base UI's headless Progress state machine.
 * - Manages accessibility roles (role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax) headlessly.
 * - Uses compositor-driven CSS scroll-driven animations (animation-timeline: scroll()) on supported browsers
 *   with an automatic, lightweight requestAnimationFrame scroll listener fallback for Safari and Firefox.
 * - Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint.
 */
import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '@/lib/utils';

export type ReadingProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type ReadingProgressHeight = 'xs' | 'sm' | 'md';
export type ReadingProgressPosition = 'fixed' | 'sticky' | 'relative';

export interface ReadingProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseProgress.Root>, 'value'> {
  /** Optional scroll container to track. If omitted, tracks document/window scroll */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Semantic color role conforming to DESIGN.md */
  colorRole?: ReadingProgressColor;
  /** Height preset for the progress track */
  height?: ReadingProgressHeight;
  /** Positioning mode. Defaults to 'fixed' (pinned to top of viewport) */
  position?: ReadingProgressPosition;
  /** Whether to render a small floating percentage pill */
  showPercentage?: boolean;
  /** Opt-in screen reader announcement (role="progressbar" with throttled updates). Defaults to false (decorative aria-hidden="true"). */
  announceProgress?: boolean;
  /** Accessible label for screen readers when announceProgress is enabled */
  label?: string;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

const colorStyles: Record<ReadingProgressColor, { indicator: string; track: string }> = {
  primary: { indicator: 'bg-primary', track: 'bg-surface-container-high' },
  secondary: { indicator: 'bg-secondary', track: 'bg-surface-container-high' },
  success: { indicator: 'bg-success', track: 'bg-surface-container-high' },
  warning: { indicator: 'bg-warning', track: 'bg-surface-container-high' },
  error: { indicator: 'bg-error', track: 'bg-surface-container-high' },
};

const heightClasses: Record<ReadingProgressHeight, string> = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
};

const positionClasses: Record<ReadingProgressPosition, string> = {
  fixed: 'fixed top-0 left-0 right-0 z-50',
  sticky: 'sticky top-0 z-40',
  relative: 'relative w-full',
};

const ReadingProgressComponent = React.forwardRef<HTMLDivElement, ReadingProgressProps>(
  (
    {
      targetRef,
      colorRole = 'primary',
      height = 'sm',
      position = 'fixed',
      showPercentage = false,
      announceProgress = false,
      label = 'Reading progress',
      className,
      trackClassName,
      indicatorClassName,
      format,
      locale,
      'aria-hidden': ariaHiddenProp,
      ...props
    },
    ref
  ) => {
    const [progress, setProgress] = React.useState(0);
    const [announcedProgress, setAnnouncedProgress] = React.useState(0);
    const [supportsCssScrollTimeline, setSupportsCssScrollTimeline] = React.useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

    // Feature-detect CSS scroll-driven animations & reduced-motion preference
    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      if ('CSS' in window && typeof CSS.supports === 'function') {
        const isSupported = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
        setSupportsCssScrollTimeline(isSupported);
      }
      if (typeof window.matchMedia === 'function') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
        mediaQuery.addEventListener('change', onChange);
        return () => mediaQuery.removeEventListener('change', onChange);
      }
    }, []);

    const hasTargetRef = Boolean(targetRef);
    const useCssDriven =
      supportsCssScrollTimeline &&
      !hasTargetRef &&
      !showPercentage &&
      !announceProgress &&
      !prefersReducedMotion;

    // Scroll tracker: skips window listener completely when compositor CSS scroll-driven animation is active
    React.useEffect(() => {
      if (useCssDriven) {
        return;
      }

      let rafId = 0;
      let lastAnnouncedTime = 0;
      let throttleTimerId: ReturnType<typeof setTimeout> | undefined;
      const ANNOUNCE_THROTTLE_MS = 250;

      const commitAnnounced = (rounded: number) => {
        lastAnnouncedTime = Date.now();
        setAnnouncedProgress(rounded);
      };

      const updateProgress = () => {
        const customEl = targetRef?.current;
        let pct = 0;
        if (customEl) {
          const totalHeight = customEl.scrollHeight - customEl.clientHeight;
          const currentScroll = Math.max(0, customEl.scrollTop);
          pct = totalHeight > 0 ? Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)) : 0;
        } else {
          const scrollElement = document.scrollingElement || document.documentElement;
          const totalHeight = scrollElement.scrollHeight - window.innerHeight;
          const currentScroll = Math.max(0, window.scrollY || scrollElement.scrollTop);
          pct = totalHeight > 0 ? Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)) : 0;
        }

        const rounded = Math.round(pct);
        setProgress(rounded);

        if (announceProgress) {
          const now = Date.now();
          if (rounded === 0 || rounded === 100 || now - lastAnnouncedTime >= ANNOUNCE_THROTTLE_MS) {
            if (throttleTimerId !== undefined) {
              clearTimeout(throttleTimerId);
              throttleTimerId = undefined;
            }
            commitAnnounced(rounded);
          } else if (throttleTimerId === undefined) {
            throttleTimerId = setTimeout(() => {
              throttleTimerId = undefined;
              commitAnnounced(rounded);
            }, ANNOUNCE_THROTTLE_MS - (now - lastAnnouncedTime));
          }
        }
      };

      const handleScroll = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateProgress);
      };

      updateProgress();

      const customEl = targetRef?.current;
      const target: EventTarget = customEl || window;
      target.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        cancelAnimationFrame(rafId);
        if (throttleTimerId !== undefined) clearTimeout(throttleTimerId);
        target.removeEventListener('scroll', handleScroll);
      };
    }, [targetRef, useCssDriven, announceProgress]);

    const colors = colorStyles[colorRole] || colorStyles.primary;
    const isDecorative = !announceProgress;
    const resolvedAriaHidden = ariaHiddenProp ?? (isDecorative ? true : undefined);
    const rootValue = announceProgress ? announcedProgress : progress;

    return (
      <BaseProgress.Root
        ref={ref}
        value={rootValue}
        max={100}
        min={0}
        format={format}
        locale={locale}
        aria-hidden={resolvedAriaHidden}
        className={cn(
          positionClasses[position],
          'w-full select-none pointer-events-none',
          className
        )}
        {...props}
      >
        {announceProgress && (
          <BaseProgress.Label className="sr-only">
            {label}
          </BaseProgress.Label>
        )}

        {/* Reading progress track bar */}
        <div className={cn('w-full overflow-hidden', heightClasses[height], colors.track, trackClassName)}>
          <div
            className={cn(
              'h-full origin-left rtl:origin-right',
              colors.indicator,
              useCssDriven
                ? 'reading-progress-root-driven'
                : 'transition-transform duration-75 ease-out motion-reduce:transition-none',
              indicatorClassName
            )}
            style={
              useCssDriven
                ? undefined
                : {
                    transform: `scaleX(${progress / 100})`,
                  }
            }
          />
        </div>

        {/* Optional floating reading percentage pill */}
        {showPercentage && (
          <div className="absolute top-3 end-4 pointer-events-auto">
            <span className="font-mono text-xs font-semibold tabular-nums text-on-surface bg-surface/90 backdrop-blur-sm border border-outline-variant px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', colors.indicator)} aria-hidden="true" />
              <BaseProgress.Value>
                {(formatted, val) => formatted || `${val ?? progress}%`}
              </BaseProgress.Value>
            </span>
          </div>
        )}
      </BaseProgress.Root>
    );
  }
);

ReadingProgressComponent.displayName = 'ReadingProgress';

export const ReadingProgress = Object.assign(ReadingProgressComponent, {
  Root: BaseProgress.Root,
  Value: BaseProgress.Value,
  Label: BaseProgress.Label,
});

export default ReadingProgress;
