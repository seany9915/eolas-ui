/**
 * Radio & RadioGroup primitives (@base-ui/react/radio, @base-ui/react/radio-group).
 *
 * Base UI Documentation: https://base-ui.com/react/components/radio
 *
 * TAXONOMY & USAGE:
 * - Use RadioGroup for selecting a single option from a visible list of 2-7 mutually exclusive choices.
 * - Supports roving tabindex arrow key navigation.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   flush primary indicator, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cn } from '@/lib/utils';

export type RadioValue = string | number;

// Accessible Radio Group
export interface RadioGroupProps<Value extends RadioValue = string>
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseRadioGroup>,
    'value' | 'defaultValue' | 'onValueChange' | 'onChange'
  > {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value, eventDetails: BaseRadioGroup.ChangeEventDetails) => void;
  orientation?: 'horizontal' | 'vertical';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  error?: string;
  children?: React.ReactNode;
}

const RadioGroupComponent = React.forwardRef<HTMLDivElement, RadioGroupProps<any>>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      readOnly = false,
      required = false,
      orientation = 'vertical',
      name,
      form,
      ariaLabel,
      ariaLabelledBy,
      error,
      children,
      className,
      ...props
    },
    ref
  ) => {
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
        form={form}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          'flex w-full',
          orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-1',
          className
        )}
        {...props}
      >
        {children}
        {error && (
          <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none mt-1.5">
            <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
              error
            </span>
            <span>{error}</span>
          </span>
        )}
      </BaseRadioGroup>
    );
  }
);
RadioGroupComponent.displayName = 'RadioGroup';

// Accessible Radio Item
export interface RadioProps<Value extends RadioValue = string>
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'value'> {
  value: Value;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean | string;
  compact?: boolean;
}

const RadioComponent = React.forwardRef<HTMLElement, RadioProps<any>>(
  (
    {
      label,
      value,
      description,
      disabled = false,
      readOnly = false,
      required = false,
      id,
      error,
      compact = false,
      className,
      inputRef,
      children,
      ...props
    },
    ref
  ) => {
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
        inputRef={inputRef}
        className={cn(
          'size-5 rounded-full border bg-surface transition-[background-color,border-color,box-shadow] flex items-center justify-center shrink-0 cursor-pointer select-none',
          'data-[checked]:border-2 data-[checked]:border-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary',
          'data-[disabled]:border-outline-variant data-[disabled]:bg-surface-variant/30 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
          error ? 'border-error focus-visible:outline-error' : 'border-outline',
          !label && className
        )}
        {...props}
      >
        <BaseRadio.Indicator
          keepMounted
          className="size-2.5 rounded-full bg-primary transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] scale-0 data-[checked]:scale-100"
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
          'flex items-start gap-3 cursor-pointer group rounded transition-colors',
          compact
            ? 'p-1'
            : 'w-full min-h-[44px] py-2 px-3 hover:bg-surface-variant/30',
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
  }
);
RadioComponent.displayName = 'Radio';

// Compound export mapping Base UI primitives
export const RadioGroup = Object.assign(RadioGroupComponent, {
  Root: BaseRadioGroup,
  Item: RadioComponent,
});

export const Radio = Object.assign(RadioComponent, {
  Root: BaseRadio.Root,
  Indicator: BaseRadio.Indicator,
});

// Re-export Base UI primitives for compound composition
export { BaseRadio, BaseRadioGroup };
export const RadioRoot = BaseRadio.Root;
export const RadioIndicator = BaseRadio.Indicator;
export const RadioGroupRoot = BaseRadioGroup;

export default Radio;
