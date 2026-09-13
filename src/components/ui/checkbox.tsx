import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  label?: string;
  value?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  parent?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

const CheckboxComponent: React.FC<CheckboxProps> = ({
  label,
  value,
  name,
  required,
  readOnly,
  checked,
  defaultChecked,
  indeterminate,
  parent,
  onCheckedChange,
  disabled,
  id,
  description,
  compact,
  className,
}) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  const checkboxNode = (
    <BaseCheckbox.Root
      id={checkboxId}
      value={value}
      name={name}
      required={required}
      readOnly={readOnly}
      checked={checked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      parent={parent}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'w-5 h-5 rounded-sm border-[1px] border-outline bg-surface transition-all flex items-center justify-center shrink-0 cursor-pointer',
        'data-[checked]:bg-primary data-[checked]:border-primary text-on-primary',
        'data-[indeterminate]:bg-primary data-[indeterminate]:border-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:bg-surface-variant/40 disabled:border-outline-variant disabled:cursor-not-allowed',
        !label && className
      )}
    >
      <BaseCheckbox.Indicator
        render={(indicatorProps, state) => (
          <span
            {...indicatorProps}
            className="flex items-center justify-center transition-[transform,opacity] duration-[var(--duration-quick)] ease-[var(--ease-standard)] data-[starting-style]:scale-75 data-[starting-style]:opacity-0"
          >
            <span className="material-symbols-outlined text-xs font-bold text-on-primary select-none" aria-hidden="true">
              {state.indeterminate ? 'remove' : 'check'}
            </span>
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );

  if (!label) {
    return checkboxNode;
  }

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'flex items-start gap-3 cursor-pointer group rounded transition-colors',
        compact ? 'p-1' : 'w-full min-h-[44px] py-2 px-3 hover:bg-surface-variant/30',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
        className
      )}
    >
      <div className="relative flex items-center justify-center min-w-[24px] h-6 mt-0.5">
        {checkboxNode}
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-sans text-sm font-medium text-on-surface select-none group-disabled:text-on-surface-variant">
          {label}
        </span>
        {description && (
          <span className="font-sans text-xs text-on-surface-variant select-none">
            {description}
          </span>
        )}
      </div>
    </label>
  );
};

// Compound export mapping Base UI primitives
export const Checkbox = Object.assign(CheckboxComponent, {
  Root: BaseCheckbox.Root,
  Indicator: BaseCheckbox.Indicator,
});

export { BaseCheckbox };
export const CheckboxRoot = BaseCheckbox.Root;
export const CheckboxIndicator = BaseCheckbox.Indicator;
