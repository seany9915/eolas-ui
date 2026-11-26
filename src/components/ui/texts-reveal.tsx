'use client';

/**
 * TextsReveal
 *
 * Staggered text entrance container based strictly on transitions.dev (18-texts-reveal.md).
 * Platform Reference: https://transitions.dev/detail.html?t=texts-reveal
 *
 * Features:
 * - Entrance: Lines enter with 12px upward rise, 3px blur, and 40ms stagger.
 * - Decoupled Exit: Single quiet 200ms opacity fade in-place without replaying the stagger in reverse.
 * - Enforces the 5-item stagger cap (max 200ms cumulative delay).
 * - Complies with prefers-reduced-motion.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

interface TextsRevealContextValue {
  show: boolean;
  hasEntered: boolean;
}

const TextsRevealContext = React.createContext<TextsRevealContextValue>({
  show: true,
  hasEntered: true,
});

export interface TextsRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether the reveal is visible. Defaults to true. */
  show?: boolean;
  /** Opt-in entrance animation on initial mount when `show` starts true. Defaults to false to avoid LCP flashes. */
  animateOnMount?: boolean;
  className?: string;
}

export interface TextsRevealLineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** 0-based stagger index. Stagger delays cap at index 4 (5 items / 200ms max per Stagger Cap Rule). */
  index?: number;
  className?: string;
}

/**
 * TextsRevealLine
 *
 * Individual line in a staggered text reveal sequence.
 * Rises 12px with micro-blur over 500ms using transitions.dev tuning.
 * Decouples on exit: fades in-place with no reverse Y-movement over 200ms.
 */
export const TextsRevealLine = React.forwardRef<HTMLDivElement, TextsRevealLineProps>(
  ({ children, index = 0, className, style, ...props }, ref) => {
    const { show, hasEntered } = React.useContext(TextsRevealContext);

    // Stagger Cap Rule: cap index at 4 (5th item) to ensure total delay <= 200ms
    const cappedIndex = Math.min(index, 4);
    const delayMs = cappedIndex * 40; // 40ms per item (--stagger-stagger)

    const isEntering = show;
    const isExiting = !show && hasEntered;
    const isInitialHidden = !show && !hasEntered;

    return (
      <div
        ref={ref}
        data-slot="texts-reveal-line"
        style={{
          transitionDelay: isEntering ? `${delayMs}ms` : '0ms',
          ...style,
        }}
        className={cn(
          'w-full',
          isEntering &&
            'opacity-100 translate-y-0 blur-none transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isExiting &&
            'opacity-0 translate-y-0 blur-none transition-opacity duration-200 ease-out',
          isInitialHidden && 'opacity-0 translate-y-3 blur-[var(--blur-medium)]',
          'motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TextsRevealLine.displayName = 'TextsRevealLine';

export const TextsRevealComponent = React.forwardRef<HTMLDivElement, TextsRevealProps>(
  ({ children, show = true, animateOnMount = false, className, ...props }, ref) => {
    const [hasEntered, setHasEntered] = React.useState(show && !animateOnMount);
    const [mounted, setMounted] = React.useState(!animateOnMount);

    React.useEffect(() => {
      if (mounted) return;

      if (prefersReducedMotion()) {
        setMounted(true);
        if (show) setHasEntered(true);
        return;
      }

      const raf = window.requestAnimationFrame(() => {
        setMounted(true);
        if (show) setHasEntered(true);
      });
      return () => window.cancelAnimationFrame(raf);
    }, [mounted, show]);

    const visible = show && mounted;

    React.useEffect(() => {
      if (!mounted) return;
      if (show) {
        setHasEntered(true);
      } else {
        // Reset hasEntered after exit fade completes (200ms) so subsequent entrance replays the rise
        const timer = setTimeout(() => {
          setHasEntered(false);
        }, 200);
        return () => clearTimeout(timer);
      }
    }, [show, mounted]);

    const contextValue = React.useMemo<TextsRevealContextValue>(
      () => ({ show: visible, hasEntered }),
      [visible, hasEntered]
    );

    return (
      <TextsRevealContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="texts-reveal"
          className={cn(
            'flex flex-col gap-1 w-full',
            !show && 'pointer-events-none',
            className
          )}
          aria-hidden={!show || undefined}
          inert={!show}
          {...props}
        >
          {children}
        </div>
      </TextsRevealContext.Provider>
    );
  }
);

TextsRevealComponent.displayName = 'TextsReveal';

export const TextsReveal = Object.assign(TextsRevealComponent, {
  Line: TextsRevealLine,
});

export default TextsReveal;
