import * as React from 'react';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Checkbox } from './checkbox';
import { cn } from '@/lib/utils';

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  options?: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  allValues?: string[];
  onValueChange?: (val: string[]) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CheckboxGroupComponent = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(({
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  allValues,
  onValueChange,
  disabled,
  children,
  className,
  ...props
}, ref) => {
  return (
    <BaseCheckboxGroup
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      allValues={allValues}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cn('space-y-3 w-full', className)}
      {...props}
    >
      {label && (
        <div className="space-y-0.5">
          <span className="font-label text-sm font-bold text-on-surface block">{label}</span>
          {description && (
            <span className="font-sans text-sm text-on-surface-variant block">{description}</span>
          )}
        </div>
      )}
      {children ? (
        children
      ) : (
        <div className="space-y-1">
          {options?.map((opt) => (
            <Checkbox
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              disabled={disabled || opt.disabled}
            />
          ))}
        </div>
      )}
      {error && (
        <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none">
          <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
            error
          </span>
          <span>{error}</span>
        </span>
      )}
    </BaseCheckboxGroup>
  );
});

CheckboxGroupComponent.displayName = 'CheckboxGroup';

// Compound export mapping Base UI primitives
export const CheckboxGroup = Object.assign(CheckboxGroupComponent, {
  Root: BaseCheckboxGroup,
});

export { BaseCheckboxGroup };
export const CheckboxGroupRoot = BaseCheckboxGroup;

export default CheckboxGroup;
