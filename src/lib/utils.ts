import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w': ['border-default', 'border-emphasis', 'border-accent'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

// Base UI headless utilities for component authoring and prop composition
export {
  mergeProps,
  mergePropsN,
  mergeClassNames,
  makeEventPreventable,
} from '@base-ui/react/merge-props';
export { useRender } from '@base-ui/react/use-render';
