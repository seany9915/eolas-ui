import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // eslint-disable-next-line shadcn/no-raw-colors
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
 * Resolves a public asset path with the base URL configured for the app.
 * Works seamlessly in both local dev ('/') and deployed subpaths ('/eolas-ui/').
 */
export function assetUrl(path: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

// Base UI headless utilities for component authoring and prop composition
export {
  mergeProps,
  mergePropsN,
  mergeClassNames,
  makeEventPreventable,
} from '@base-ui/react/merge-props';
export { useRender } from '@base-ui/react/use-render';
