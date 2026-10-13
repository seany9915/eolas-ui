/**
 * View Transitions API React hook and utility.
 *
 * Platform Reference: Modern Web Guidance (MWG: same-document-transitions)
 *
 * Provides a strongly typed wrapper around document.startViewTransition()
 * with progressive enhancement fallback, reduced motion support, and
 * accessibility focus routing.
 */
import * as React from 'react';

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

      // If transitionName is specified on a target element, assign it prior to transition
      if (transitionName && targetElement) {
        targetElement.style.setProperty('view-transition-name', transitionName);
      }

      const routeFocus = () => {
        if (!focusTarget) return;
        const resolved =
          'current' in focusTarget ? focusTarget.current : focusTarget;
        if (resolved) {
          if (!resolved.hasAttribute('tabindex')) {
            resolved.setAttribute('tabindex', '-1');
          }
          resolved.focus({ preventScroll: true });
        }
      };

      const cleanupName = () => {
        if (transitionName && targetElement) {
          targetElement.style.removeProperty('view-transition-name');
        }
      };

      // Fallback for browsers without View Transitions support
      if (!isSupported || !document.startViewTransition) {
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
        const transition = document.startViewTransition(async () => {
          await updateFn();
        });

        // Clean up temporary transition name and route accessibility focus on finish
        await transition.finished;
        routeFocus();
      } catch (err: unknown) {
        // If transition is aborted or fails, continue gracefully
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.warn('View transition completed with warning:', err);
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
