import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextSwapProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The current text or string value to display */
  children: React.ReactNode;
  /** Custom duration in milliseconds. Defaults to 150ms (--text-swap-dur / --duration-quick). */
  duration?: number;
  /** Vertical displacement in pixels. Defaults to 4px (--text-swap-translate-y). */
  translateY?: number;
  className?: string;
}

type SwapPhase = 'idle' | 'exit' | 'enter-start' | 'enter';

/**
 * TextSwap
 *
 * Micro-transition for in-place text state changes based strictly on transitions.dev
 * (https://transitions.dev/detail.html?t=text-states-swap / 04-text-states-swap.md).
 *
 * Implements the 3-phase sequence:
 * 1. .is-exit: Old text slides up 4px with 2px micro-blur and fades to 0 over 150ms.
 * 2. .is-enter-start: Text swaps and jumps below (+4px) without transition.
 * 3. Forced reflow -> .is-enter: New text rises smoothly back to rest (0) over 150ms.
 *
 * Prevents layout thrashing inside buttons, chips, and status badges.
 * Complies with WCAG 2.2 and motion-reduce:transition-none.
 */
export const TextSwap = React.forwardRef<HTMLSpanElement, TextSwapProps>(
  ({ children, duration = 150, translateY = 4, className, ...props }, ref) => {
    const [displayedText, setDisplayedText] = React.useState<React.ReactNode>(children);
    const [phase, setPhase] = React.useState<SwapPhase>('idle');
    const spanRef = React.useRef<HTMLSpanElement | null>(null);

    // Merge external ref with internal ref for forced reflow
    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        spanRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        }
      },
      [ref]
    );

    const prevChildrenRef = React.useRef(children);

    React.useEffect(() => {
      if (children !== prevChildrenRef.current) {
        prevChildrenRef.current = children;

        // Check prefers-reduced-motion
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          setDisplayedText(children);
          setPhase('idle');
          return;
        }

        // Phase 1: Start exit of old text
        setPhase('exit');

        const exitTimer = window.setTimeout(() => {
          // Phase 2: Swap text and jump to below (instantaneous, no transition)
          setDisplayedText(children);
          setPhase('enter-start');

          // Force reflow so transition begins from enter-start position
          if (spanRef.current) {
            void spanRef.current.offsetHeight;
          }

          // Phase 3: Transition new text back to rest
          requestAnimationFrame(() => {
            setPhase('enter');
            const settleTimer = window.setTimeout(() => {
              setPhase('idle');
            }, duration);

            return () => window.clearTimeout(settleTimer);
          });
        }, duration);

        return () => window.clearTimeout(exitTimer);
      }
    }, [children, duration]);

    const isExit = phase === 'exit';
    const isEnterStart = phase === 'enter-start';

    return (
      <span
        ref={setRefs}
        className={cn(
          'inline-block select-none will-change-[transform,filter,opacity]',
          isEnterStart
            ? 'transition-none'
            : 'transition-[transform,filter,opacity] ease-in-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none',
          isExit && 'opacity-0 blur-[2px]',
          isEnterStart && 'opacity-0 blur-[2px]',
          (phase === 'enter' || phase === 'idle') && 'opacity-100 blur-none translate-y-0',
          className
        )}
        style={{
          transitionDuration: isEnterStart ? '0ms' : `${duration}ms`,
          transform: isExit
            ? `translateY(-${translateY}px)`
            : isEnterStart
            ? `translateY(${translateY}px)`
            : 'translateY(0)',
        }}
        {...props}
      >
        {displayedText}
      </span>
    );
  }
);

TextSwap.displayName = 'TextSwap';

export default TextSwap;
