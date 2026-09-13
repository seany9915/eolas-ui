import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cn } from '@/lib/utils';

// Accessible Radio Group
export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  name?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  className?: string;
}

const RadioGroupComponent: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  required,
  orientation = 'vertical',
  name,
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
}) => {
  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      name={name}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn('flex flex-col gap-1 w-full', orientation === 'horizontal' && 'flex-row flex-wrap gap-4', className)}
    >
      {children}
    </BaseRadioGroup>
  );
};

// Accessible Radio
export interface RadioProps {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
}

const RadioComponent: React.FC<RadioProps> = ({
  label,
  value,
  description,
  disabled,
  readOnly,
  required,
  id,
}) => {
  const generatedId = React.useId();
  const radioId = id || generatedId;

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'flex w-full items-start gap-3 min-h-[44px] cursor-pointer group py-2 px-3 rounded transition-colors hover:bg-surface-variant/30',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent'
      )}
    >
      <div className="relative flex items-center justify-center min-w-[24px] h-6 mt-0.5">
        <BaseRadio.Root
          id={radioId}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={cn(
            'w-5 h-5 rounded-full border-[1px] border-outline bg-surface transition-all flex items-center justify-center',
            'data-[checked]:border-[2px] data-[checked]:border-primary data-[checked]:bg-primary-container/20',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary',
            'disabled:border-outline-variant disabled:bg-surface-variant/30 disabled:cursor-not-allowed'
          )}
        >
          <BaseRadio.Indicator
            keepMounted
            className="w-2.5 h-2.5 rounded-full bg-primary transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] scale-0 data-[checked]:scale-100"
          />
        </BaseRadio.Root>
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
export const RadioGroup = Object.assign(RadioGroupComponent, {
  Root: BaseRadioGroup,
});

export const Radio = Object.assign(RadioComponent, {
  Root: BaseRadio.Root,
  Indicator: BaseRadio.Indicator,
});

export { BaseRadio, BaseRadioGroup };
export const RadioGroupRoot = BaseRadioGroup;
export const RadioRoot = BaseRadio.Root;
export const RadioIndicator = BaseRadio.Indicator;
