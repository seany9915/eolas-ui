/**
 * View Transitions API React hook and utility.
 *
 * Platform Reference: Modern Web Guidance (MWG: same-document-transitions)
 *
 * Provides a strongly typed wrapper around document.startViewTransition()
 * with progressive enhancement fallback, reduced motion bypass, and
 * opt-in accessibility focus routing (via the focusTarget option).
 */
import * as React from 'react';
import { flushSync } from 'react-dom';

interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

declare global {
  interface Document {
    startViewTransition(updateCallback?: () => Promise<void> | void): ViewTransition;
  }
}

export interface TransitionOptions {
  /** Element or ref to programmatically focus once the transition completes (MWG accessibility routing) */
  focusTarget?: HTMLElement | React.RefObject<HTMLElement | null> | null;
  /** Temporary view-transition-name to apply to targetElement during morphing */
  transitionName?: string;
  /** Element on which to temporarily set transitionName */
  targetElement?: HTMLElement | null;
}

export interface UseViewTransitionReturn {
  /** Whether the current browser supports the View Transitions API */
  isSupported: boolean;
  /** Whether a view transition is currently in progress */
  isTransitioning: boolean;
  /** Executes an asynchronous or synchronous DOM/state update inside a View Transition */
  startTransition: (
    updateFn: () => void | Promise<void>,
    options?: TransitionOptions
  ) => Promise<void>;
}

export function useViewTransition(): UseViewTransitionReturn {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const isSupported = React.useMemo(() => {
    return (
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'
    );
  }, []);

  const startTransition = React.useCallback(
    async (
      updateFn: () => void | Promise<void>,
      options?: TransitionOptions
    ): Promise<void> => {
      const { focusTarget, transitionName, targetElement } = options || {};

      // Preserve any existing inline name so it can be restored afterwards
      const previousName =
        transitionName && targetElement
          ? targetElement.style.getPropertyValue('view-transition-name')
          : '';
      if (transitionName && targetElement) {
        targetElement.style.setProperty('view-transition-name', transitionName);
      }

      const routeFocus = () => {
        if (!focusTarget) return;
        const resolved =
          'current' in focusTarget ? focusTarget.current : focusTarget;
        if (resolved) {
          // Only make natively non-focusable targets programmatically focusable, and undo it on blur
          if (resolved.tabIndex < 0 && !resolved.hasAttribute('tabindex')) {
            resolved.setAttribute('tabindex', '-1');
            resolved.addEventListener('blur', () => resolved.removeAttribute('tabindex'), { once: true });
          }
          resolved.focus({ preventScroll: true });
        }
      };

      const cleanupName = () => {
        if (transitionName && targetElement) {
          if (previousName) {
            targetElement.style.setProperty('view-transition-name', previousName);
          } else {
            targetElement.style.removeProperty('view-transition-name');
          }
        }
      };

      // Commit React state updates synchronously so the new DOM is captured
      const runUpdate = async () => {
        let result: void | Promise<void> = undefined;
        flushSync(() => {
          result = updateFn();
        });
        await result;
      };

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Fallback for browsers without View Transitions support
      if (!isSupported || !document.startViewTransition || prefersReducedMotion) {
        try {
          await updateFn();
          routeFocus();
        } finally {
          cleanupName();
        }
        return;
      }

      setIsTransitioning(true);

      try {
        const transition = document.startViewTransition(runUpdate);
        transition.ready.catch(() => {});

        // Rejects if the update callback throws, so failures reach the caller
        await transition.finished;
        routeFocus();
      } catch (err: unknown) {
        // A skipped transition is not a failure; any other error propagates
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          throw err;
        }
      } finally {
        cleanupName();
        setIsTransitioning(false);
      }
    },
    [isSupported]
  );

  return {
    isSupported,
    isTransitioning,
    startTransition,
  };
}

export default useViewTransition;
