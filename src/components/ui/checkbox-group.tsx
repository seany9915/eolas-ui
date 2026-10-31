/**
 * CheckboxGroup primitive (@base-ui/react/checkbox-group).
 *
 * Base UI Documentation: https://base-ui.com/react/components/checkbox-group
 *
 * TAXONOMY & USAGE:
 * - Provides shared state and keyboard management for a list of related checkboxes.
 * - Supports `allValues` for parent indeterminate checkbox synchronization.
 * - Supports both declarative `options` array and composable `children`.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Checkbox } from './checkbox';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>,
    'onChange'
  > {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  options?: CheckboxGroupOption[];
  children?: React.ReactNode;
}

const CheckboxGroupComponent = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      label,
      description,
      error,
      orientation = 'vertical',
      options,
      value,
      defaultValue,
      allValues,
      onValueChange,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const labelId = label ? `${generatedId}-label` : undefined;
    const descId = description ? `${generatedId}-desc` : undefined;

    return (
      <BaseCheckboxGroup
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        allValues={allValues}
        onValueChange={onValueChange}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={descId}
        className={cn('w-full', className)}
        {...props}
      >
        {label && (
          <div className="space-y-0.5 mb-2.5">
            <span id={labelId} className="font-label text-sm font-bold text-on-surface block">
              {label}
            </span>
            {description && (
              <span id={descId} className="font-sans text-sm text-on-surface-variant block">
                {description}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'flex',
            orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-1'
          )}
        >
          {children
            ? children
            : options?.map((opt) => (
                <Checkbox
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  description={opt.description}
                  disabled={disabled || opt.disabled}
                />
              ))}
        </div>
        {error && (
          <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none mt-1.5">
            <Icon name="error" size="sm" className="shrink-0" />
            <span>{error}</span>
          </span>
        )}
      </BaseCheckboxGroup>
    );
  }
);
CheckboxGroupComponent.displayName = 'CheckboxGroup';

// Compound export mapping Base UI primitives
export const CheckboxGroup = Object.assign(CheckboxGroupComponent, {
  Root: BaseCheckboxGroup,
  Checkbox: Checkbox,
});

// Re-export Base UI primitives for compound composition
export { BaseCheckboxGroup };
export const CheckboxGroupRoot = BaseCheckboxGroup;
export default CheckboxGroup;
