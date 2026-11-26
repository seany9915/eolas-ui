'use client';

import { isValidElement, useRef, type Ref, type RefCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w': ['border-default', 'border-emphasis', 'border-accent'],
      shadow: [
        'shadow-card',
        'shadow-toggle',
        'shadow-ambient',
        'shadow-ambient-hover',
        'shadow-modal',
      ],
      duration: [
        'duration-stagger',
        'duration-micro',
        'duration-quick',
        'duration-fast',
        'duration-medium',
        'duration-slow',
        'duration-emphasis',
        'duration-very-slow',
      ],
      'font-size': [
        'text-display-lg',
        'text-display-sm',
        'text-headline-lg',
        'text-headline-md',
        'text-headline-sm',
        'text-body-lg',
        'text-body-md',
        'text-body-sm',
        'text-caption',
        'text-code-md',
        'text-label-lg',
        'text-label-md',
        'text-label-sm',
        'type-display-lg',
        'type-display-sm',
        'type-headline-lg',
        'type-headline-md',
        'type-headline-sm',
        'type-body-lg',
        'type-body-md',
        'type-body-sm',
        'type-caption',
        'type-code-md',
        'type-label-lg',
        'type-label-md',
        'type-label-sm',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

/**
 * Composes a static base class value with Base UI's `className` prop, which may be
 * either a string or a `(state) => string | undefined` callback.
 * Preserves `tailwind-merge` deduplication while avoiding extra closures for static strings.
 */
export function composeClassName<State = unknown>(
  base: ClassValue,
  className?: string | ((state: State) => string | undefined)
): string | ((state: State) => string) {
  if (typeof className === 'function') {
    return (state: State) => cn(base, className(state));
  }
  return cn(base, className);
}

/**
 * Resolves Base UI's `nativeButton` prop for triggers and buttons that accept a `render` element.
 * Respects an explicit caller value; otherwise returns `false` when `render` is an intrinsic
 * non-`<button>` element (e.g. `<a>`, `<span>`, `<div>`) so Base UI applies ARIA button semantics
 * without dev warnings.
 */
export function resolveNativeButton(
  render: unknown,
  nativeButton?: boolean
): boolean | undefined {
  if (nativeButton !== undefined) return nativeButton;
  if (isValidElement(render) && typeof render.type === 'string' && render.type !== 'button') {
    return false;
  }
  return undefined;
}

/**
 * Resolves a public asset path with the base URL configured for the app.
 * Works seamlessly in Vite (via `import.meta.env.BASE_URL`), Next.js, and root-mounted apps.
 */
export function assetUrl(path: string): string {
  const viteBase =
    typeof import.meta !== 'undefined'
      ? (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL
      : undefined;
  const base = viteBase || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function stripControlChars(value: string): string {
  let out = '';
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) continue;
    out += value[i];
  }
  return out;
}

/**
 * Validates user- or agent-supplied URLs before rendering them in links.
 * Strips control characters and allows only safe HTTP(S)/mailto/tel protocols or non-protocol-relative paths.
 */
export function sanitizeUrl(url?: string | null): string | undefined {
  if (typeof url !== 'string') return undefined;
  const cleaned = stripControlChars(url).trim();
  if (!cleaned) return undefined;

  const collapsed = cleaned.replace(/\s+/g, '');
  if (collapsed.startsWith('//') || collapsed.startsWith('/\\') || collapsed.startsWith('\\')) {
    return undefined;
  }

  if (
    collapsed.startsWith('/') ||
    collapsed.startsWith('./') ||
    collapsed.startsWith('../') ||
    collapsed.startsWith('#') ||
    collapsed.startsWith('?')
  ) {
    return cleaned;
  }

  const beforeDelimiter = collapsed.split(/[/?#]/, 1)[0];
  const colonIdx = beforeDelimiter.indexOf(':');
  if (colonIdx !== -1) {
    const scheme = beforeDelimiter.slice(0, colonIdx + 1).toLowerCase();
    return SAFE_URL_PROTOCOLS.has(scheme) ? cleaned : undefined;
  }

  return cleaned;
}

// Base UI headless utilities for component authoring and prop composition
export {
  mergeProps,
  mergePropsN,
  mergeClassNames,
  makeEventPreventable,
} from '@base-ui/react/merge-props';
export { useRender } from '@base-ui/react/use-render';

type PossibleRef<T> = Ref<T> | undefined | null;

function assignMergedRefs<T>(
  refs: readonly PossibleRef<T>[],
  instance: T
): () => void {
  const cleanups: Array<(() => void) | null> = refs.map(() => null);
  for (let i = 0; i < refs.length; i += 1) {
    const ref = refs[i];
    if (ref == null) continue;
    if (typeof ref === 'function') {
      const cleanup = ref(instance);
      if (typeof cleanup === 'function') {
        cleanups[i] = cleanup;
      }
    } else if (typeof ref === 'object') {
      (ref as { current: T | null }).current = instance;
    }
  }

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    for (let i = 0; i < refs.length; i += 1) {
      const ref = refs[i];
      if (ref == null) continue;
      if (typeof ref === 'function') {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') {
          cleanup();
        } else {
          // Legacy callback ref without attach-time cleanup
          ref(null);
        }
      } else if (typeof ref === 'object') {
        (ref as { current: T | null }).current = null;
      }
    }
  };
}

/**
 * Merges multiple React refs (callback refs with or without React 19 cleanups, and RefObjects)
 * into a single React 19-safe callback ref. Prefer `useMergedRefs` inside components so the
 * callback identity stays stable across re-renders.
 */
export function mergeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  let cleanup: (() => void) | null = null;
  return (instance: T | null) => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    if (instance != null) {
      cleanup = assignMergedRefs(refs, instance);
      return cleanup;
    }
    return undefined;
  };
}

interface MergedRefsState<T> {
  refs: PossibleRef<T>[];
  callback: RefCallback<T> | null;
  cleanup: (() => void) | null;
}

/**
 * Memoized hook that merges multiple React refs into a stable callback ref (or `null` when
 * all input refs are nullish), preventing React 19 cleanup/re-attach churn across renders.
 */
export function useMergedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> | null {
  const stateRef = useRef<MergedRefsState<T> | null>(null);
  if (stateRef.current === null) {
    stateRef.current = { refs: [], callback: null, cleanup: null };
  }
  const state = stateRef.current;

  const changed =
    state.refs.length !== refs.length ||
    refs.some((ref, index) => ref !== state.refs[index]);

  if (changed) {
    state.refs = refs;
    if (refs.every((ref) => ref == null)) {
      state.callback = null;
    } else {
      const capturedRefs = refs;
      state.callback = (instance: T | null) => {
        if (state.cleanup) {
          state.cleanup();
          state.cleanup = null;
        }
        if (instance != null) {
          state.cleanup = assignMergedRefs(capturedRefs, instance);
          return state.cleanup;
        }
        return undefined;
      };
    }
  }

  return state.callback;
}
