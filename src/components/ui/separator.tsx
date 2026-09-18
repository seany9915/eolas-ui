import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
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

