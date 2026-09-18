import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cn } from '@/lib/utils';

export interface FieldsetProps extends React.ComponentPropsWithoutRef<typeof BaseFieldset.Root> {
  legend?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'card' | 'flat';
  className?: string;
}

const FieldsetComponent = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(({
  legend,
  description,
  children,
  variant = 'default',
  className,
  ...props
}, ref) => {
  return (
    <BaseFieldset.Root
      ref={ref}
      className={cn(
        'w-full',
        variant === 'default' && 'border-none p-0 space-y-3',
        variant === 'card' && 'p-5 rounded bg-surface border border-outline-variant shadow-ambient space-y-4',
        variant === 'flat' && 'p-5 rounded bg-surface-container/60 border-none space-y-4',
        className
      )}
      {...props}
    >
      {legend && (
        <BaseFieldset.Legend className="px-0.5">
          <span className="font-heading text-base font-bold text-on-surface block">{legend}</span>
          {description && (
            <span className="font-sans text-sm text-on-surface-variant block mt-0.5">{description}</span>
          )}
        </BaseFieldset.Legend>
      )}
      <div className={variant === 'default' ? 'space-y-3' : 'space-y-4'}>
        {children}
      </div>
    </BaseFieldset.Root>
  );
});

FieldsetComponent.displayName = 'Fieldset';

// Compound export mapping Base UI primitives
export const Fieldset = Object.assign(FieldsetComponent, {
  Root: BaseFieldset.Root,
  Legend: BaseFieldset.Legend,
});

// Re-export Base UI primitives for compound composition
export { BaseFieldset };
export const FieldsetRoot = BaseFieldset.Root;
export const FieldsetLegend = BaseFieldset.Legend;

export default Fieldset;
