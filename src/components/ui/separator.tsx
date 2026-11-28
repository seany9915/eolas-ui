'use client';

/**
 * Separator primitive (@base-ui/react/separator).
 *
 * Base UI Documentation: https://base-ui.com/react/components/separator
 *
 * TAXONOMY & USAGE:
 * - A visual or semantic separator between sections of content.
 * - Supports horizontal and vertical orientations with accessible role/aria-hidden attributes.
 * - Follows DESIGN.md Tier B tokens: border-outline-variant.
 */
import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn, composeClassName } from '@/lib/utils';

export type SeparatorSize = 'full' | 'sm' | 'md';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof BaseSeparator> {
  orientation?: 'horizontal' | 'vertical';
  /**
   * Controls the separator length along its orientation axis:
   * - `'full'` (default): stretches across the container (`w-full` horizontally, `h-full self-stretch` vertically; pair with `self-center` if overriding vertical height via `className`).
   * - `'sm'`: compact `16px` (`w-4` / `h-4`) centered (`self-center`) divider for inline flex headers and toolbars.
   * - `'md'`: medium `24px` (`w-6` / `h-6`) centered (`self-center`) divider for inline flex headers and toolbars.
   */
  size?: SeparatorSize;
  decorative?: boolean;
}

const SEPARATOR_CLASSES: Record<'horizontal' | 'vertical', Record<SeparatorSize, string>> = {
  horizontal: {
    full: 'h-px w-full',
    sm: 'h-px w-4 self-center',
    md: 'h-px w-6 self-center',
  },
  vertical: {
    full: 'w-px h-full self-stretch',
    sm: 'w-px h-4 self-center',
    md: 'w-px h-6 self-center',
  },
};

const SeparatorComponent = React.forwardRef<HTMLDivElement, SeparatorProps>(({
  orientation = 'horizontal',
  size = 'full',
  decorative = true,
  className,
  ...props
}, ref) => {
  return (
    <BaseSeparator
      ref={ref}
      data-slot="separator"
      orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={composeClassName(
        cn(
          'bg-outline-variant forced-colors:bg-[CanvasText] shrink-0',
          SEPARATOR_CLASSES[orientation][size]
        ),
        className
      )}
      {...props}
    />
  );
});

SeparatorComponent.displayName = 'Separator';

// Compound export mapping Base UI primitives
export const Separator = Object.assign(SeparatorComponent, {
  Root: BaseSeparator,
});

export { BaseSeparator };
export const SeparatorRoot = BaseSeparator;

export default Separator;
