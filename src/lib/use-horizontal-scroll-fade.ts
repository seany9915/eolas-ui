/**
 * Horizontal scroll overflow detection for soft edge-fade masks.
 *
 * Platform Reference: Modern Web Guidance (MWG: soft-edge-content-fade, scrollability-affordance-hints)
 *
 * Updates `--fade-start` and `--fade-end` CSS custom properties on the scroll container
 * so edge masks only appear on sides with actual horizontal overflow.
 */
import * as React from 'react';

export interface UseHorizontalScrollFadeOptions {
  /** Fade width in pixels when overflow exists on an edge. Defaults to 20. */
  fadeSize?: number;
  /** Disable overflow tracking (e.g. vertical orientation or stacked layout). */
  disabled?: boolean;
}

export function useHorizontalScrollFade<T extends HTMLElement = HTMLElement>(
  externalRef?: React.Ref<T>,
  options: UseHorizontalScrollFadeOptions = {}
) {
  const { fadeSize = 20, disabled = false } = options;
  const internalRef = React.useRef<T | null>(null);

  const setRef = React.useCallback(
    (node: T | null) => {
      internalRef.current = node;
      if (typeof externalRef === 'function') {
        externalRef(node);
      } else if (externalRef) {
        (externalRef as React.MutableRefObject<T | null>).current = node;
      }
    },
    [externalRef]
  );

  React.useEffect(() => {
    const el = internalRef.current;
    if (!el || disabled) {
      if (el) {
        el.style.removeProperty('--fade-start');
        el.style.removeProperty('--fade-end');
      }
      return;
    }

    const updateFades = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      const startFade = maxScroll > 0 ? Math.min(fadeSize, Math.max(0, Math.round(scrollLeft))) : 0;
      const endFade = maxScroll > 0 ? Math.min(fadeSize, Math.max(0, Math.round(maxScroll - scrollLeft))) : 0;
      el.style.setProperty('--fade-start', `${startFade}px`);
      el.style.setProperty('--fade-end', `${endFade}px`);
    };

    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateFades);
      ro.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', updateFades);
      ro?.disconnect();
    };
  }, [fadeSize, disabled]);

  return { ref: setRef };
}
