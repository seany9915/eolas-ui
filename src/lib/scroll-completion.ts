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

/**
 * Scrolls `element` into view and resolves once the scroll animation settles.
 */
export function scrollIntoViewAsync(
  element: Element,
  options?: ScrollIntoViewOptions,
  completionOptions?: ScrollCompletionOptions
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const result = element.scrollIntoView(options) as unknown;
  if (result instanceof Promise) {
    return result;
  }
  const scroller = completionOptions?.scroller ?? getScrollParent(element) ?? window;
  return waitForScrollEnd(scroller, completionOptions?.idleTimeoutMs);
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
