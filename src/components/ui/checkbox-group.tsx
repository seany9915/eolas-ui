import * as React from 'react';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Checkbox } from './checkbox';
import { cn } from '@/lib/utils';

export interface CheckboxGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  label?: string;
  description?: string;
  options?: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  allValues?: string[];
  onValueChange?: (val: string[]) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CheckboxGroupComponent: React.FC<CheckboxGroupProps> = ({
  label,
  description,
  options,
  value,
  defaultValue,
  allValues,
  onValueChange,
  disabled,
  children,
  className,
}) => {
  return (
    <BaseCheckboxGroup
      value={value}
      defaultValue={defaultValue}
      allValues={allValues}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cn('space-y-3 w-full', className)}
    >
      {label && (
        <div>
          <span className="font-label text-sm font-bold text-on-surface block">{label}</span>
          {description && (
            <span className="font-sans text-xs text-on-surface-variant block mt-0.5">{description}</span>
          )}
        </div>
      )}
      {children ? (
        children
      ) : (
        <div className="space-y-2.5">
          {options?.map((opt) => (
            <Checkbox
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              disabled={opt.disabled}
            />
          ))}
        </div>
      )}
    </BaseCheckboxGroup>
  );
};

// Compound export mapping Base UI primitives
export const CheckboxGroup = Object.assign(CheckboxGroupComponent, {
  Root: BaseCheckboxGroup,
});

export { BaseCheckboxGroup };
export const CheckboxGroupRoot = BaseCheckboxGroup;

