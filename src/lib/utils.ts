'use client';

import { isValidElement } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w': ['border-default', 'border-emphasis', 'border-accent'],
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
  if (cleaned.startsWith('//')) return undefined;

  if (
    cleaned.startsWith('/') ||
    cleaned.startsWith('./') ||
    cleaned.startsWith('../') ||
    cleaned.startsWith('#') ||
    cleaned.startsWith('?')
  ) {
    return cleaned;
  }

  const collapsed = cleaned.replace(/\s+/g, '');
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
