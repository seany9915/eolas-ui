'use client';

/**
 * ErrorShake
 *
 * Horizontal form micro-shake wrapper based on transitions.dev (12-error-state-shake.md).
 * Platform Reference: https://transitions.dev/detail.html?t=error-state-shake
 *
 * Shakes invalid form inputs or blocked actions using a decaying overshoot curve:
 * 0% -> 20% (-6px) -> 40% (+4px) -> 60% (-2px) -> 80% (+1px) -> 100% (0)
 *
 * Synchronized with the 300ms animate-error-shake keyframe in src/globals.css.
 * Supports coordinated error message reveals and auto-revert timers.
 * Complies with WCAG 2.2 and motion-reduce:animate-none.
 */
import * as React from 'react';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

export interface ErrorShakeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trigger boolean, string, or number that plays the shake when updated or truthy */
  shake?: boolean | number | string;
  /** Optional error message displayed beneath the target with transitions.dev fade */
  errorMessage?: React.ReactNode;
  /** Whether to automatically revert error state back to neutral after a hold timer */
  autoRevert?: boolean;
  /** Duration in ms to hold the error state before auto-reverting. Defaults to 3000ms (--revert-hold). */
  revertHoldMs?: number;
  onShakeEnd?: () => void;
  onRevert?: () => void;
  children: React.ReactNode;
}

export const ErrorShake = React.forwardRef<HTMLDivElement, ErrorShakeProps>(
  (
    {
      shake,
      errorMessage,
      autoRevert = false,
      revertHoldMs = 3000,
      onShakeEnd,
      onRevert,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isShaking, setIsShaking] = React.useState(false);
    const [hasActiveError, setHasActiveError] = React.useState(Boolean(shake));
    const shakeTargetRef = React.useRef<HTMLDivElement | null>(null);
    const onShakeEndRef = React.useRef(onShakeEnd);
    const onRevertRef = React.useRef(onRevert);
    React.useEffect(() => {
      onShakeEndRef.current = onShakeEnd;
      onRevertRef.current = onRevert;
    });

    React.useEffect(() => {
      if (!shake) {
        setHasActiveError(false);
        setIsShaking(false);
        return;
      }

      // Force CSS keyframe replay when shake triggers again while already animating
      const el = shakeTargetRef.current;
      if (el && el.classList.contains('animate-error-shake')) {
        el.classList.remove('animate-error-shake');
        void el.offsetWidth;
        el.classList.add('animate-error-shake');
      }

      setIsShaking(true);
      setHasActiveError(true);

      const shakeTimer = setTimeout(() => {
        setIsShaking(false);
        onShakeEndRef.current?.();
      }, 300);

      return () => {
        clearTimeout(shakeTimer);
      };
    }, [shake]);

    React.useEffect(() => {
      if (!shake || !hasActiveError || !autoRevert) return;
      const revertTimer = setTimeout(() => {
        setHasActiveError(false);
        onRevertRef.current?.();
      }, revertHoldMs);
      return () => {
        clearTimeout(revertTimer);
      };
    }, [shake, hasActiveError, autoRevert, revertHoldMs]);

    const showError = Boolean(hasActiveError && errorMessage);

    return (
      <div
        ref={ref}
        className={cn('w-full flex flex-col', showError && 'gap-1.5', className)}
        {...props}
      >
        <div
          ref={shakeTargetRef}
          className={cn(
            'w-full motion-reduce:transform-none motion-reduce:animate-none',
            isShaking && 'animate-error-shake'
          )}
        >
          {children}
        </div>

        <p
          role="alert"
          className={cn(
            'font-sans text-sm font-semibold text-error flex items-center gap-1',
            'transition-[opacity,visibility] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
            showError
              ? 'opacity-100 visible'
              : 'opacity-0 invisible h-0 overflow-hidden m-0 pointer-events-none'
          )}
        >
          {showError ? (
            <>
              <Icon name="error" size="sm" className="shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </>
          ) : null}
        </p>
      </div>
    );
  }
);

ErrorShake.displayName = 'ErrorShake';

export default ErrorShake;
