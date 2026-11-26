'use client';

/**
 * SuccessCheck
 *
 * Celebratory checkmark entrance transition based strictly on transitions.dev (10-success-check.md).
 * Platform Reference: https://transitions.dev/detail.html?t=success-check
 *
 * Composes 5 synchronized layers in parallel:
 * 1. Opacity fade (0 -> 1 over 500ms)
 * 2. 80deg rotational upright spin (80deg -> 0deg over 500ms)
 * 3. Optical blur settle (10px -> 0px over 500ms)
 * 4. Y-bob spring overshoot (translateY 40px -> 0 with cubic-bezier(0.34, 1.35, 0.64, 1))
 * 5. SVG stroke-draw (delayed 80ms stroke-dashoffset transition)
 *
 * Complies strictly with WCAG 2.2 and motion-reduce:transition-none.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

export interface SuccessCheckProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  /** Pass boolean or counter to trigger/replay the animation */
  trigger?: boolean | number | string;
  /** Whether to show filled success circular badge background or standalone icon */
  variant?: 'badge' | 'icon';
  onAnimationEnd?: () => void;
  className?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 40,
  lg: 56,
};

const EXPECTED_ANIMATIONS = new Set([
  't-check-fade',
  't-check-transform',
  't-check-blur',
  't-check-draw',
]);

export const SuccessCheck = React.forwardRef<HTMLDivElement, SuccessCheckProps>(
  (
    {
      size = 'md',
      trigger = true,
      variant = 'badge',
      onAnimationEnd,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const dimension = typeof size === 'number' ? size : SIZE_MAP[size] ?? 40;
    const strokeWidth = dimension <= 24 ? 2.5 : dimension <= 40 ? 3 : 3.5;

    const [animating, setAnimating] = React.useState(Boolean(trigger));
    const [playCount, setPlayCount] = React.useState(0);
    const prevTriggerRef = React.useRef(trigger);
    const completedAnimationsRef = React.useRef<Set<string>>(new Set());
    const onAnimationEndRef = React.useRef(onAnimationEnd);

    React.useEffect(() => {
      onAnimationEndRef.current = onAnimationEnd;
    });

    React.useEffect(() => {
      if (trigger && trigger !== prevTriggerRef.current) {
        completedAnimationsRef.current.clear();
        setAnimating(true);
        setPlayCount((count) => count + 1);
      } else if (!trigger && trigger !== prevTriggerRef.current) {
        completedAnimationsRef.current.clear();
        setAnimating(false);
      }
      prevTriggerRef.current = trigger;
    }, [trigger]);

    React.useEffect(() => {
      if (!animating) return;
      if (!prefersReducedMotion()) return;

      let cancelled = false;
      queueMicrotask(() => {
        if (cancelled) return;
        setAnimating(false);
        onAnimationEndRef.current?.();
      });
      return () => {
        cancelled = true;
      };
    }, [animating, playCount]);

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
      if (!EXPECTED_ANIMATIONS.has(e.animationName)) return;
      completedAnimationsRef.current.add(e.animationName);
      if (completedAnimationsRef.current.size >= EXPECTED_ANIMATIONS.size) {
        setAnimating(false);
        onAnimationEndRef.current?.();
      }
    };

    const isBadge = variant === 'badge';

    return (
      <div
        key={playCount}
        ref={ref}
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          'relative inline-flex items-center justify-center select-none overflow-visible',
          isBadge && 'rounded-full bg-success text-on-success shadow-ambient',
          animating && 'animate-success-check',
          'motion-reduce:animate-none motion-reduce:transform-none motion-reduce:filter-none',
          className
        )}
        aria-hidden="true"
        {...props}
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          ...style,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'size-[60%]',
            isBadge ? 'text-on-success' : 'text-success',
            animating && 'animate-check-draw',
            'motion-reduce:animate-none'
          )}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 0,
          }}
        >
          <polyline pathLength={1} points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
);

SuccessCheck.displayName = 'SuccessCheck';

export default SuccessCheck;
