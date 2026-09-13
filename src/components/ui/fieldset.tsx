import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cn } from '@/lib/utils';

export interface FieldsetProps {
  legend: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'card' | 'flat';
  className?: string;
}

const FieldsetComponent: React.FC<FieldsetProps> = ({
  legend,
  description,
  children,
  variant = 'card',
  className,
}) => {
  return (
    <BaseFieldset.Root
      className={cn(
        'p-5 rounded-lg space-y-4 w-full',
        variant === 'card' && 'bg-surface border border-outline-variant shadow-ambient',
        variant === 'flat' && 'bg-surface-container/60 border-none',
        className
      )}
    >
      <BaseFieldset.Legend className="px-1">
        <span className="font-heading text-sm font-bold text-on-surface block">{legend}</span>
        {description && (
          <span className="font-sans text-xs text-on-surface-variant block mt-0.5">{description}</span>
        )}
      </BaseFieldset.Legend>
      <div className="space-y-4">
        {children}
      </div>
    </BaseFieldset.Root>
  );
};

// Compound export mapping Base UI primitives
export const Fieldset = Object.assign(FieldsetComponent, {
  Root: BaseFieldset.Root,
  Legend: BaseFieldset.Legend,
});

// Re-export Base UI primitives for compound composition
export { BaseFieldset };
export const FieldsetRoot = BaseFieldset.Root;
export const FieldsetLegend = BaseFieldset.Legend;

