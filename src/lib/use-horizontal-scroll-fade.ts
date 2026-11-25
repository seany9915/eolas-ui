'use client';

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
  const externalRefObj = React.useRef(externalRef);
  externalRefObj.current = externalRef;
  const [element, setElement] = React.useState<T | null>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);

  const setRef = React.useCallback((node: T | null) => {
    internalRef.current = node;
    setElement(node);
    const currentExternal = externalRefObj.current;
    if (typeof currentExternal === 'function') {
      currentExternal(node);
    } else if (currentExternal) {
      currentExternal.current = node;
    }
  }, []);

  React.useEffect(() => {
    const el = element ?? internalRef.current;
    if (!el || disabled) {
      if (el) {
        el.style.removeProperty('--fade-start');
        el.style.removeProperty('--fade-end');
      }
      setIsScrollable(false);
      return;
    }

    // Cache writing direction on mount, ResizeObserver, and dir-attribute mutations
    let isRtl = getComputedStyle(el).direction === 'rtl';
    let rafId = 0;

    const updateFades = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      const offset = isRtl ? Math.abs(scrollLeft) : Math.max(0, scrollLeft);
      const canScrollLeft = maxScroll > 1 && offset > 0.5;
      const canScrollRight = maxScroll > 1 && maxScroll - offset > 0.5;
      const scrollable = canScrollLeft || canScrollRight;
      setIsScrollable((prev) => (prev === scrollable ? prev : scrollable));

      const startFade = maxScroll > 0 ? Math.min(fadeSize, Math.max(0, Math.round(offset))) : 0;
      const endFade = maxScroll > 0 ? Math.min(fadeSize, Math.max(0, Math.round(maxScroll - offset))) : 0;
      el.style.setProperty('--fade-start', `${startFade}px`);
      el.style.setProperty('--fade-end', `${endFade}px`);
    };

    const scheduleRefresh = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        isRtl = getComputedStyle(el).direction === 'rtl';
        updateFades();
      });
    };

    const handleResize = () => {
      isRtl = getComputedStyle(el).direction === 'rtl';
      updateFades();
    };

    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(handleResize);
      ro.observe(el);
      if (el.firstElementChild) {
        ro.observe(el.firstElementChild);
      }
    }

    let contentMo: MutationObserver | undefined;
    let dirMo: MutationObserver | undefined;
    if (typeof MutationObserver !== 'undefined') {
      contentMo = new MutationObserver(scheduleRefresh);
      contentMo.observe(el, { childList: true, subtree: true });

      dirMo = new MutationObserver(scheduleRefresh);
      const dirTargets = new Set<Element>();
      if (document.documentElement) dirTargets.add(document.documentElement);
      const closestDir = el.closest('[dir]');
      if (closestDir) dirTargets.add(closestDir);
      dirTargets.add(el);
      for (const target of dirTargets) {
        dirMo.observe(target, { attributes: true, attributeFilter: ['dir'] });
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('scroll', updateFades);
      ro?.disconnect();
      contentMo?.disconnect();
      dirMo?.disconnect();
    };
  }, [element, fadeSize, disabled]);

  return { ref: setRef, isScrollable };
}
