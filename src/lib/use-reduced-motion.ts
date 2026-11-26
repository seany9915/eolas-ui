'use client';

/**
 * Shared reduced-motion utilities.
 *
 * Subscribes to both the OS-level `(prefers-reduced-motion: reduce)` media query
 * and the document-level `:root[data-motion="reduce"]` override attribute.
 */
import * as React from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Synchronously checks whether reduced motion is currently active via either
 * `:root[data-motion="reduce"]` or `(prefers-reduced-motion: reduce)`.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (
    typeof document !== 'undefined' &&
    document.documentElement?.getAttribute('data-motion') === 'reduce'
  ) {
    return true;
  }
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }
  return false;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const cleanups: Array<() => void> = [];

  if (typeof window.matchMedia === 'function') {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    mediaQuery.addEventListener('change', callback);
    cleanups.push(() => mediaQuery.removeEventListener('change', callback));
  }

  if (typeof MutationObserver === 'function' && typeof document !== 'undefined' && document.documentElement) {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });
    cleanups.push(() => observer.disconnect());
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

/**
 * React hook returning `true` when reduced motion is preferred via OS settings
 * or `:root[data-motion="reduce"]`.
 */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false
  );
}
