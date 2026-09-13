import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '@/lib/utils';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

const SeparatorComponent: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  decorative = true,
  className,
}) => {
  return (
    <BaseSeparator
      orientation={orientation}
      className={cn(
        'bg-outline-variant shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full my-3' : 'w-[1px] h-full mx-3',
        className
      )}
    />
  );
};

// Compound export mapping Base UI primitives
export const Separator = Object.assign(SeparatorComponent, {
  Root: BaseSeparator,
});

export { BaseSeparator };
export const SeparatorRoot = BaseSeparator;

