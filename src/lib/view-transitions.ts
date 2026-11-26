'use client';

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
import { prefersReducedMotion } from './use-reduced-motion';

export type ViewTransitionUpdateCallback = () => Promise<void> | void;

export interface StartViewTransitionOptions {
  update?: ViewTransitionUpdateCallback;
  types?: string[];
}

interface DOMViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  types?: Set<string>;
  skipTransition(): void;
}

declare global {
  interface Document {
    startViewTransition(
      callbackOptions?: ViewTransitionUpdateCallback | StartViewTransitionOptions
    ): DOMViewTransition;
  }

  interface Element {
    startViewTransition?(
      callbackOptions?: ViewTransitionUpdateCallback | StartViewTransitionOptions
    ): DOMViewTransition;
  }
}

export interface TransitionOptions {
  /** Element or ref to programmatically focus once the transition completes (MWG accessibility routing) */
  focusTarget?: HTMLElement | React.RefObject<HTMLElement | null> | null;
  /** Temporary view-transition-name to apply to targetElement during morphing */
  transitionName?: string;
  /** Element on which to temporarily set transitionName */
  targetElement?: HTMLElement | null;
  /** View Transitions Level 2 active transition types (matches `:active-view-transition-type(...)`) */
  types?: string[];
}

function invokeStartViewTransition(
  host: {
    startViewTransition?: (
      callbackOptions?: ViewTransitionUpdateCallback | StartViewTransitionOptions
    ) => DOMViewTransition;
  },
  update: ViewTransitionUpdateCallback,
  types?: string[]
): DOMViewTransition {
  const startFn = host.startViewTransition;
  if (typeof startFn !== 'function') {
    throw new Error('startViewTransition is not supported on this target');
  }
  if (types && types.length > 0) {
    try {
      return startFn.call(host, { update, types });
    } catch (err) {
      if (err instanceof TypeError) {
        return startFn.call(host, update);
      }
      throw err;
    }
  }
  return startFn.call(host, update);
}

function routeTransitionFocus(
  focusTarget?: HTMLElement | React.RefObject<HTMLElement | null> | null
): void {
  if (!focusTarget) return;
  const resolved = 'current' in focusTarget ? focusTarget.current : focusTarget;
  if (resolved) {
    // Only make natively non-focusable targets programmatically focusable, and undo it on blur
    const addedTempTabIndex = resolved.tabIndex < 0 && !resolved.hasAttribute('tabindex');
    if (addedTempTabIndex) {
      resolved.setAttribute('tabindex', '-1');
    }
    resolved.focus({ preventScroll: true });
    if (addedTempTabIndex) {
      if (document.activeElement === resolved) {
        resolved.addEventListener('blur', () => resolved.removeAttribute('tabindex'), { once: true });
      } else {
        resolved.removeAttribute('tabindex');
      }
    }
  }
}

const emptySubscribe = () => () => {};

function getViewTransitionSupport(): boolean {
  return typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
}

const activeTransitionOwners = new WeakMap<HTMLElement, { baseline: string; ownerId: number }>();
let nextTransitionOwnerId = 0;

function claimTargetTransitionName(
  targetElement: HTMLElement | null | undefined,
  transitionName: string | undefined,
  ownerId: number
): void {
  if (!transitionName || !targetElement) return;
  const existing = activeTransitionOwners.get(targetElement);
  const baseline = existing ? existing.baseline : targetElement.style.getPropertyValue('view-transition-name');
  activeTransitionOwners.set(targetElement, { baseline, ownerId });
  targetElement.style.setProperty('view-transition-name', transitionName);
}

function releaseTargetTransitionName(
  targetElement: HTMLElement | null | undefined,
  transitionName: string | undefined,
  ownerId: number
): void {
  if (!transitionName || !targetElement) return;
  const entry = activeTransitionOwners.get(targetElement);
  if (!entry || entry.ownerId !== ownerId) return;
  activeTransitionOwners.delete(targetElement);
  if (entry.baseline) {
    targetElement.style.setProperty('view-transition-name', entry.baseline);
  } else {
    targetElement.style.removeProperty('view-transition-name');
  }
}

function isReducedMotionPreferred(): boolean {
  return prefersReducedMotion();
}

/**
 * Runs a scoped view transition on `element` using `element.startViewTransition` (View Transitions Level 2)
 * when available, gracefully falling back to `document.startViewTransition` or immediate execution.
 */
export async function startScopedViewTransition(
  element: Element | null | undefined,
  update: () => void | Promise<void>,
  options?: TransitionOptions
): Promise<void> {
  const { focusTarget, transitionName, targetElement, types } = options || {};
  const ownerId = ++nextTransitionOwnerId;
  claimTargetTransitionName(targetElement, transitionName, ownerId);

  const cleanupName = () => {
    releaseTargetTransitionName(targetElement, transitionName, ownerId);
  };

  const runUpdate = async () => {
    let result: unknown = undefined;
    flushSync(() => {
      result = update();
    });
    if (
      result !== null &&
      (typeof result === 'object' || typeof result === 'function') &&
      'then' in result &&
      typeof (result as PromiseLike<unknown>).then === 'function'
    ) {
      await (result as PromiseLike<unknown>);
      flushSync(() => {});
    }
  };

  const scopedSupported = Boolean(element && typeof element.startViewTransition === 'function');
  const documentSupported =
    typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

  if (isReducedMotionPreferred() || (!scopedSupported && !documentSupported)) {
    try {
      await update();
      routeTransitionFocus(focusTarget);
    } finally {
      cleanupName();
    }
    return;
  }

  try {
    const host = scopedSupported && element ? element : document;
    const transition = invokeStartViewTransition(host, runUpdate, types);
    transition.ready.catch(() => {});
    await transition.finished;
    routeTransitionFocus(focusTarget);
  } catch (err: unknown) {
    if (!(err instanceof DOMException && err.name === 'AbortError')) {
      throw err;
    }
  } finally {
    cleanupName();
  }
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
  const activeIdRef = React.useRef(0);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isSupported = React.useSyncExternalStore(
    emptySubscribe,
    getViewTransitionSupport,
    () => false
  );

  const startTransition = React.useCallback(
    async (
      updateFn: () => void | Promise<void>,
      options?: TransitionOptions
    ): Promise<void> => {
      const { focusTarget, transitionName, targetElement, types } = options || {};
      const myId = ++activeIdRef.current;
      const ownerId = ++nextTransitionOwnerId;
      claimTargetTransitionName(targetElement, transitionName, ownerId);

      const routeFocus = () => {
        routeTransitionFocus(focusTarget);
      };

      const cleanupName = () => {
        releaseTargetTransitionName(targetElement, transitionName, ownerId);
      };

      // Commit synchronous and post-await React state updates before snapshots finish.
      const runUpdate = async () => {
        let result: unknown = undefined;
        flushSync(() => {
          result = updateFn();
        });
        if (
          result !== null &&
          (typeof result === 'object' || typeof result === 'function') &&
          'then' in result &&
          typeof (result as PromiseLike<unknown>).then === 'function'
        ) {
          await (result as PromiseLike<unknown>);
          if (isMountedRef.current) {
            flushSync(() => {});
          }
        }
      };

      // Fallback for browsers without View Transitions support or when reduced motion is preferred
      if (!isSupported || !document.startViewTransition || isReducedMotionPreferred()) {
        try {
          await updateFn();
          if (activeIdRef.current === myId) {
            routeFocus();
          }
        } finally {
          cleanupName();
        }
        return;
      }

      setIsTransitioning(true);

      try {
        const transition = invokeStartViewTransition(document, runUpdate, types);
        transition.ready.catch(() => {});

        // Rejects if the update callback throws, so failures reach the caller
        await transition.finished;
        if (activeIdRef.current === myId) {
          routeFocus();
        }
      } catch (err: unknown) {
        // A skipped transition is not a failure; any other error propagates
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          throw err;
        }
      } finally {
        cleanupName();
        if (activeIdRef.current === myId && isMountedRef.current) {
          setIsTransitioning(false);
        }
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
