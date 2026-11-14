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
}

function waitForScrollEnd(scroller: HTMLElement | Window, idleTimeoutMs = 100): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      scroller.removeEventListener('scrollend', finish);
      scroller.removeEventListener('scroll', onScroll);
      resolve();
    };

    const onScroll = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = setTimeout(finish, idleTimeoutMs);
    };

    scroller.addEventListener('scrollend', finish, { once: true });
    scroller.addEventListener('scroll', onScroll, { passive: true });
    timeoutId = setTimeout(finish, idleTimeoutMs);
  });
}

/**
 * Scrolls `element` into view and resolves once the scroll animation settles.
 */
export function scrollIntoViewAsync(
  element: Element,
  options?: ScrollIntoViewOptions,
  completionOptions?: ScrollCompletionOptions
): Promise<void> {
  const result = element.scrollIntoView(options) as unknown;
  if (result instanceof Promise) {
    return result;
  }
  return waitForScrollEnd(
    completionOptions?.scroller ?? window,
    completionOptions?.idleTimeoutMs
  );
}

/**
 * Scrolls `scroller` to `options` and resolves once the scroll animation settles.
 */
export function scrollToAsync(
  scroller: HTMLElement | Window,
  options: ScrollToOptions,
  idleTimeoutMs = 100
): Promise<void> {
  const result = scroller.scrollTo(options) as unknown;
  if (result instanceof Promise) {
    return result;
  }
  return waitForScrollEnd(scroller, idleTimeoutMs);
}
