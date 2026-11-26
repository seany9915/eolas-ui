'use client';

/**
 * TextSwap
 *
 * Micro-transition for in-place text state changes based strictly on transitions.dev (04-text-states-swap.md).
 * Platform Reference: https://transitions.dev/detail.html?t=text-states-swap
 *
 * Implements the 3-phase sequence:
 * 1. .is-exit: Old text slides up 4px with 2px micro-blur and fades to 0 over 150ms.
 * 2. .is-enter-start: Text swaps and jumps below (+4px) without transition.
 * 3. Forced reflow -> .is-enter: New text rises smoothly back to rest (0) over 150ms.
 *
 * Prevents layout thrashing inside buttons, chips, and status badges.
 * Complies with WCAG 2.2 and motion-reduce:transition-none.
 */
import * as React from 'react';
import { cn, useMergedRefs } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

export interface TextSwapProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The current text or string value to display */
  children: React.ReactNode;
  /**
   * Stable identity key used to detect state swaps.
   * Defaults to `children` when primitive (`string | number`).
   * Provide `swapKey` when rendering JSX children so parent re-renders do not replay the swap.
   */
  swapKey?: string | number;
  /** Custom duration in milliseconds. Defaults to 150ms (--text-swap-dur / --duration-quick). */
  duration?: number;
  /** Vertical displacement in pixels. Defaults to 4px (--text-swap-translate-y). */
  translateY?: number;
  className?: string;
}

type SwapPhase = 'idle' | 'exit' | 'enter-start' | 'enter';

export const TextSwap = React.forwardRef<HTMLSpanElement, TextSwapProps>(
  ({ children, swapKey, duration = 150, translateY = 4, className, style, ...props }, ref) => {
    const [displayedText, setDisplayedText] = React.useState<React.ReactNode>(children);
    const [phase, setPhase] = React.useState<SwapPhase>('idle');
    const spanRef = React.useRef<HTMLSpanElement | null>(null);
    const durationRef = React.useRef(duration);
    const latestChildrenRef = React.useRef(children);

    const exitTimerRef = React.useRef<number | null>(null);
    const settleTimerRef = React.useRef<number | null>(null);
    const rafRef = React.useRef<number | null>(null);
    const raf2Ref = React.useRef<number | null>(null);

    React.useEffect(() => {
      durationRef.current = duration;
    }, [duration]);

    React.useEffect(() => {
      latestChildrenRef.current = children;
    });

    const clearScheduledTimers = React.useCallback(() => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);
      exitTimerRef.current = null;
      settleTimerRef.current = null;
      rafRef.current = null;
      raf2Ref.current = null;
    }, []);

    React.useEffect(() => {
      return () => clearScheduledTimers();
    }, [clearScheduledTimers]);

    // Merge external ref with internal ref
    const setRefs = useMergedRefs(spanRef, ref);

    const resolvedKey: string | number | undefined =
      swapKey !== undefined
        ? swapKey
        : typeof children === 'string' || typeof children === 'number'
          ? children
          : undefined;

    const prevKeyRef = React.useRef<string | number | undefined>(resolvedKey);

    React.useEffect(() => {
      if (resolvedKey !== prevKeyRef.current) {
        prevKeyRef.current = resolvedKey;

        // Check prefers-reduced-motion
        clearScheduledTimers();

        if (prefersReducedMotion()) {
          setDisplayedText(children);
          setPhase('idle');
          return;
        }

        const swapDuration = durationRef.current;

        // Phase 1: Start exit of old text
        setPhase('exit');

        exitTimerRef.current = window.setTimeout(() => {
          // Phase 2: Swap text and commit enter-start frame before animating in
          setDisplayedText(latestChildrenRef.current);
          setPhase('enter-start');

          rafRef.current = requestAnimationFrame(() => {
            raf2Ref.current = requestAnimationFrame(() => {
              setPhase('enter');
              settleTimerRef.current = window.setTimeout(() => {
                setPhase('idle');
              }, durationRef.current);
            });
          });
        }, swapDuration);
      } else if (phase === 'idle') {
        setDisplayedText(children);
      }
    }, [resolvedKey, children, phase, clearScheduledTimers]);

    const isExit = phase === 'exit';
    const isEnterStart = phase === 'enter-start';

    return (
      <span
        ref={setRefs}
        data-slot="text-swap"
        className={cn(
          'inline-block select-none translate-y-[var(--swap-y,0px)]',
          isEnterStart
            ? 'transition-none'
            : 'transition-[transform,filter,opacity] ease-in-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none',
          isExit && 'opacity-0 blur-[var(--blur-small)]',
          isEnterStart && 'opacity-0 blur-[var(--blur-small)]',
          (phase === 'enter' || phase === 'idle') && 'opacity-100 blur-none',
          className
        )}
        style={{
          ...style,
          transitionDuration: isEnterStart ? '0ms' : `${duration}ms`,
          ['--swap-y' as string]: isExit
            ? `-${translateY}px`
            : isEnterStart
            ? `${translateY}px`
            : '0px',
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
