/**
 * Fieldset primitive (@base-ui/react/fieldset).
 *
 * Base UI Documentation: https://base-ui.com/react/components/fieldset
 *
 * TAXONOMY & USAGE:
 * - Use Fieldset to group related form controls with a shared legend and description.
 * - Cascades disabled state natively to all nested interactive form controls.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 touch target compliance.
 */
import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cn } from '@/lib/utils';

export type FieldsetVariant = 'default' | 'card' | 'flat';

export interface FieldsetProps extends React.ComponentPropsWithoutRef<typeof BaseFieldset.Root> {
  legend?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  variant?: FieldsetVariant;
  className?: string;
}

export const FieldsetRoot = React.forwardRef<
  HTMLFieldSetElement,
  React.ComponentPropsWithoutRef<typeof BaseFieldset.Root> & { variant?: FieldsetVariant }
>(({ className, variant = 'default', disabled, ...props }, ref) => (
  <BaseFieldset.Root
    ref={ref}
    data-slot="fieldset"
    disabled={disabled}
    className={cn(
      'w-full group/fieldset flex flex-col gap-3',
      variant === 'card' && 'p-5 rounded-xl bg-surface border border-outline-variant shadow-ambient gap-4',
      variant === 'flat' && 'p-5 rounded-xl bg-surface-container border-none gap-4',
      disabled && 'opacity-60 cursor-not-allowed',
      className
    )}
    {...props}
  />
));
FieldsetRoot.displayName = 'FieldsetRoot';

export const FieldsetLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithoutRef<typeof BaseFieldset.Legend>
>(({ className, ...props }, ref) => (
  <BaseFieldset.Legend
    ref={ref}
    data-slot="fieldset-legend"
    className={cn('font-heading text-base font-bold text-on-surface px-0.5 block', className)}
    {...props}
  />
));
FieldsetLegend.displayName = 'FieldsetLegend';

export const FieldsetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="fieldset-description"
    className={cn('font-sans text-sm text-on-surface-variant px-0.5', className)}
    {...props}
  />
));
FieldsetDescription.displayName = 'FieldsetDescription';

const FieldsetComponent = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ legend, description, children, variant = 'default', className, disabled, ...props }, ref) => {
    return (
      <FieldsetRoot ref={ref} variant={variant} disabled={disabled} className={className} {...props}>
        {legend && <FieldsetLegend>{legend}</FieldsetLegend>}
        {description && <FieldsetDescription>{description}</FieldsetDescription>}
        {children}
      </FieldsetRoot>
    );
  }
);
FieldsetComponent.displayName = 'Fieldset';

// Compound export mapping Base UI primitives
export const Fieldset = Object.assign(FieldsetComponent, {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
});

// Re-export Base UI primitives for compound composition
export { BaseFieldset };

export default Fieldset;
