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
import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof BaseSeparator> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

const SeparatorComponent = React.forwardRef<HTMLDivElement, SeparatorProps>(({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}, ref) => {
  return (
    <BaseSeparator
      ref={ref}
      orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        'bg-outline-variant shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full my-2' : 'w-[1px] h-full mx-2 self-stretch',
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
