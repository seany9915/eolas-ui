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
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const RadioGroupComponent = React.forwardRef<HTMLDivElement, RadioGroupProps>(({
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
  error,
  children,
  className,
  ...props
}, ref) => {
  return (
    <BaseRadioGroup
      ref={ref}
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
      {...props}
    >
      {children}
      {error && (
        <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none mt-1">
          <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
            error
          </span>
          <span>{error}</span>
        </span>
      )}
    </BaseRadioGroup>
  );
});

RadioGroupComponent.displayName = 'RadioGroup';

// Accessible Radio
export interface RadioProps {
  label?: React.ReactNode;
  value: string;
  description?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
  error?: boolean | string;
  className?: string;
}

const RadioComponent = React.forwardRef<HTMLElement, RadioProps>(({
  label,
  value,
  description,
  disabled,
  readOnly,
  required,
  id,
  error,
  className,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const radioId = id || generatedId;

  const radioNode = (
    <BaseRadio.Root
      ref={ref}
      id={radioId}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      className={cn(
        'w-5 h-5 rounded-full border-[1px] bg-surface transition-all flex items-center justify-center shrink-0 cursor-pointer',
        'data-[checked]:border-[2px] data-[checked]:border-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary',
        'disabled:border-outline-variant disabled:bg-surface-variant/30 disabled:cursor-not-allowed',
        error ? 'border-error focus-visible:outline-error' : 'border-outline',
        !label && className
      )}
      {...props}
    >
      <BaseRadio.Indicator
        keepMounted
        className="w-2.5 h-2.5 rounded-full bg-primary transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] scale-0 data-[checked]:scale-100"
      />
    </BaseRadio.Root>
  );

  if (!label) {
    return radioNode;
  }

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'flex w-full items-start gap-3 min-h-[44px] cursor-pointer group py-2 px-3 rounded transition-colors hover:bg-surface-variant/30',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
        className
      )}
    >
      <div className="relative flex items-center justify-center min-w-[24px] h-6 mt-0.5">
        {radioNode}
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-sans text-sm font-medium text-on-surface select-none group-disabled:text-on-surface-variant">
          {label}
        </span>
        {description && (
          <span className="font-sans text-sm text-on-surface-variant select-none mt-0.5">
            {description}
          </span>
        )}
        {typeof error === 'string' && error && (
          <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error mt-1 select-none">
            <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
              error
            </span>
            <span>{error}</span>
          </span>
        )}
      </div>
    </label>
  );
});

RadioComponent.displayName = 'Radio';

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

export default Radio;
