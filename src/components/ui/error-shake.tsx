import * as React from 'react';
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

/**
 * ErrorShake
 *
 * Horizontal form micro-shake wrapper based on transitions.dev
 * (https://transitions.dev/detail.html?t=error-state-shake / 12-error-state-shake.md).
 *
 * Shakes invalid form inputs or blocked actions using a decaying overshoot curve:
 * 0% -> 20% (-6px) -> 40% (+4px) -> 60% (-2px) -> 80% (+1px) -> 100% (0)
 *
 * Supports coordinated error message reveals and auto-revert timers.
 * Complies with WCAG 2.2 and motion-reduce:animate-none.
 */
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
    const prevShakeRef = React.useRef(shake);

    React.useEffect(() => {
      if (shake && shake !== prevShakeRef.current) {
        setIsShaking(true);
        setHasActiveError(true);
        prevShakeRef.current = shake;

        // Shake animation timer (280ms duration matches keyframe)
        const shakeTimer = setTimeout(() => {
          setIsShaking(false);
          onShakeEnd?.();
        }, 280);

        // Optional auto-revert timer (3000ms hold from transitions.dev)
        let revertTimer: NodeJS.Timeout | undefined;
        if (autoRevert) {
          revertTimer = setTimeout(() => {
            setHasActiveError(false);
            onRevert?.();
          }, revertHoldMs);
        }

        return () => {
          clearTimeout(shakeTimer);
          if (revertTimer) clearTimeout(revertTimer);
        };
      } else if (!shake) {
        setHasActiveError(false);
        setIsShaking(false);
      }
      prevShakeRef.current = shake;
    }, [shake, autoRevert, revertHoldMs, onShakeEnd, onRevert]);

    return (
      <div
        ref={ref}
        className={cn('w-full flex flex-col gap-1.5', className)}
        {...props}
      >
        <div
          className={cn(
            'w-full will-change-transform motion-reduce:transform-none motion-reduce:animate-none',
            isShaking && 'animate-error-shake'
          )}
        >
          {children}
        </div>

        {errorMessage && (
          <p
            className={cn(
              'font-sans text-xs font-semibold text-error flex items-center gap-1 select-none',
              'transition-opacity duration-[280ms] ease-out motion-reduce:transition-none',
              hasActiveError ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            role="alert"
          >
            <span className="material-symbols-outlined text-sm shrink-0" aria-hidden="true">
              error
            </span>
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  }
);

ErrorShake.displayName = 'ErrorShake';

export default ErrorShake;
