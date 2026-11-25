/**
 * Programmatic scroll completion utilities.
 *
 * Platform Reference: Modern Web Guidance (MWG: scroll-completion-effects)
 *
 * Awaits the native Promise returned by `scrollIntoView()` / `scrollTo()` when supported,
 * and falls back to `scrollend` with an idle-scroll timer on browsers where scroll methods
 * return `undefined`. Prevents premature focus shifts or post-scroll highlights mid-animation.
 */

export interface ScrollCompletionOptions {
  /** Scroll container used for `scrollend` fallback listening. Defaults to `window`. */
  scroller?: HTMLElement | Window;
  /** Idle gap (ms) before resolving if neither scroll Promise nor `scrollend` fires. Defaults to 100ms. */
  idleTimeoutMs?: number;
  /** Optional AbortSignal to cancel waiting for scroll completion (rejects with AbortError). */
  signal?: AbortSignal;
  /** When true, rejects with AbortError if the user interrupts the programmatic scroll via wheel, touch, or pointer input. */
  abortOnUserInterrupt?: boolean;
}

function createAbortError(signal?: AbortSignal, message = 'Scroll aborted'): unknown {
  return signal?.reason ?? new DOMException(message, 'AbortError');
}

function raceWithSignalAndInterrupt(
  promise: Promise<void>,
  scroller: HTMLElement | Window,
  signal?: AbortSignal,
  abortOnUserInterrupt = false
): Promise<void> {
  if (!signal && !abortOnUserInterrupt) return promise;
  if (signal?.aborted) {
    return Promise.reject(createAbortError(signal));
  }

  return new Promise<void>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      signal?.removeEventListener('abort', onAbort);
      if (abortOnUserInterrupt) {
        scroller.removeEventListener('wheel', onUserInterrupt);
        scroller.removeEventListener('touchstart', onUserInterrupt);
        scroller.removeEventListener('pointerdown', onUserInterrupt);
      }
    };

    const onAbort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(createAbortError(signal));
    };

    const onUserInterrupt = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new DOMException('Scroll interrupted by user', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });
    if (abortOnUserInterrupt) {
      scroller.addEventListener('wheel', onUserInterrupt, { passive: true, once: true });
      scroller.addEventListener('touchstart', onUserInterrupt, { passive: true, once: true });
      scroller.addEventListener('pointerdown', onUserInterrupt, { passive: true, once: true });
    }

    promise.then(
      () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      },
      (err) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(err);
      }
    );
  });
}

function waitForScrollEnd(
  scroller: HTMLElement | Window,
  idleTimeoutMs = 100,
  signal?: AbortSignal,
  abortOnUserInterrupt = false
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (signal?.aborted) {
    return Promise.reject(createAbortError(signal));
  }

  return new Promise((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let settled = false;

    const cleanup = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      scroller.removeEventListener('scrollend', finish);
      scroller.removeEventListener('scroll', onScroll);
      signal?.removeEventListener('abort', onAbort);
      if (abortOnUserInterrupt) {
        scroller.removeEventListener('wheel', onUserInterrupt);
        scroller.removeEventListener('touchstart', onUserInterrupt);
        scroller.removeEventListener('pointerdown', onUserInterrupt);
      }
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const onAbort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(createAbortError(signal));
    };

    const onUserInterrupt = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new DOMException('Scroll interrupted by user', 'AbortError'));
    };

    const onScroll = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = setTimeout(finish, idleTimeoutMs);
    };

    scroller.addEventListener('scrollend', finish, { once: true });
    scroller.addEventListener('scroll', onScroll, { passive: true });
    signal?.addEventListener('abort', onAbort, { once: true });
    if (abortOnUserInterrupt) {
      scroller.addEventListener('wheel', onUserInterrupt, { passive: true, once: true });
      scroller.addEventListener('touchstart', onUserInterrupt, { passive: true, once: true });
      scroller.addEventListener('pointerdown', onUserInterrupt, { passive: true, once: true });
    }
    timeoutId = setTimeout(finish, idleTimeoutMs);
  });
}

function getScrollParent(node: Element | null): HTMLElement | null {
  let current = node?.parentElement ?? null;
  while (current && current !== document.body && current !== document.documentElement) {
    const { overflow, overflowY, overflowX } = getComputedStyle(current);
    const isScrollableY =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay' || overflow === 'auto' || overflow === 'scroll') &&
      current.scrollHeight > current.clientHeight;
    const isScrollableX =
      (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay' || overflow === 'auto' || overflow === 'scroll') &&
      current.scrollWidth > current.clientWidth;
    if (isScrollableY || isScrollableX) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function getScrollOffsets(scroller: HTMLElement | Window): { x: number; y: number } {
  if (scroller === window) {
    return { x: window.scrollX, y: window.scrollY };
  }
  const el = scroller as HTMLElement;
  return { x: el.scrollLeft, y: el.scrollTop };
}

function isInstantBehavior(behavior?: ScrollBehavior): boolean {
  if (behavior === 'instant') return true;
  if (behavior === 'smooth') return false;
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return true;
  }
  return false;
}

function awaitScrollSettlement(
  scroller: HTMLElement | Window,
  invokeScroll: () => unknown,
  behavior?: ScrollBehavior,
  idleTimeoutMs = 100,
  signal?: AbortSignal,
  abortOnUserInterrupt = false
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (signal?.aborted) {
    return Promise.reject(createAbortError(signal));
  }

  let sawScroll = false;
  const before = getScrollOffsets(scroller);
  const trackPreScroll = () => {
    sawScroll = true;
  };
  scroller.addEventListener('scroll', trackPreScroll, { passive: true });

  let result: unknown;
  try {
    result = invokeScroll();
  } catch (err) {
    scroller.removeEventListener('scroll', trackPreScroll);
    return Promise.reject(err);
  }

  if (result instanceof Promise) {
    scroller.removeEventListener('scroll', trackPreScroll);
    return raceWithSignalAndInterrupt(result as Promise<void>, scroller, signal, abortOnUserInterrupt);
  }

  scroller.removeEventListener('scroll', trackPreScroll);
  const after = getScrollOffsets(scroller);
  const movedSynchronously = after.x !== before.x || after.y !== before.y;

  if (isInstantBehavior(behavior) || (movedSynchronously && !sawScroll)) {
    return Promise.resolve();
  }

  return waitForScrollEnd(scroller, idleTimeoutMs, signal, abortOnUserInterrupt);
}

/**
 * Scrolls `element` into view and resolves once the scroll animation settles.
 */
export function scrollIntoViewAsync(
  element: Element,
  options?: ScrollIntoViewOptions,
  completionOptions?: ScrollCompletionOptions
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const { signal, abortOnUserInterrupt = false, idleTimeoutMs } = completionOptions ?? {};
  const scroller = completionOptions?.scroller ?? getScrollParent(element) ?? window;
  return awaitScrollSettlement(
    scroller,
    () => element.scrollIntoView(options),
    options?.behavior,
    idleTimeoutMs,
    signal,
    abortOnUserInterrupt
  );
}

/**
 * Scrolls `scroller` to `options` and resolves once the scroll animation settles.
 */
export function scrollToAsync(
  scroller: HTMLElement | Window,
  options: ScrollToOptions,
  idleTimeoutMsOrOptions: number | Pick<ScrollCompletionOptions, 'idleTimeoutMs' | 'signal' | 'abortOnUserInterrupt'> = 100
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const resolvedOptions =
    typeof idleTimeoutMsOrOptions === 'number'
      ? { idleTimeoutMs: idleTimeoutMsOrOptions }
      : idleTimeoutMsOrOptions;
  const { idleTimeoutMs = 100, signal, abortOnUserInterrupt = false } = resolvedOptions;

  return awaitScrollSettlement(
    scroller,
    () => scroller.scrollTo(options),
    options?.behavior,
    idleTimeoutMs,
    signal,
    abortOnUserInterrupt
  );
}
