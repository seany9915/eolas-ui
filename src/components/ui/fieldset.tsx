/**
 * Fieldset primitive (@base-ui/react/fieldset).
 *
 * Base UI Documentation: https://base-ui.com/react/components/fieldset
 *
 * TAXONOMY & USAGE:
 * - Use Fieldset to group related form controls with a shared legend.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 touch target compliance.
 */
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
  disabled,
  ...props
}, ref) => {
  return (
    <BaseFieldset.Root
      ref={ref}
      disabled={disabled}
      className={cn(
        'w-full',
        variant === 'default' && 'border-none p-0 space-y-3',
        variant === 'card' && 'p-5 rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-4',
        variant === 'flat' && 'p-5 rounded-xl bg-surface-container border-none space-y-4',
        className
      )}
      {...props}
    >
      {legend && (
        <BaseFieldset.Legend className="px-0.5 mb-2">
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

export const FieldsetLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithoutRef<typeof BaseFieldset.Legend>
>(({ className, ...props }, ref) => (
  <BaseFieldset.Legend
    ref={ref}
    className={cn('font-heading text-base font-bold text-on-surface px-0.5 mb-2 block', className)}
    {...props}
  />
));
FieldsetLegend.displayName = 'FieldsetLegend';

// Compound export mapping Base UI primitives
export const Fieldset = Object.assign(FieldsetComponent, {
  Root: BaseFieldset.Root,
  Legend: FieldsetLegend,
});

// Re-export Base UI primitives for compound composition
export { BaseFieldset };
export const FieldsetRoot = BaseFieldset.Root;

export default Fieldset;
