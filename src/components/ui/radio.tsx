'use client';

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
import { cn, composeClassName } from '@/lib/utils';

export type RadioValue = string | number;

// Accessible Radio Group
export interface RadioGroupProps<Value = string>
  extends Omit<
    BaseRadioGroup.Props<Value>,
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

function RadioGroupComponentInner<Value = string>(
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
  }: RadioGroupProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseRadioGroup<Value>
      ref={ref}
      data-slot="radio-group"
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
      aria-invalid={error ? true : undefined}
      className={composeClassName(
        cn(
          'flex w-full',
          orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-1'
        ),
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

const RadioGroupComponent = React.forwardRef(RadioGroupComponentInner) as (<Value = string>(
  props: RadioGroupProps<Value> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };
RadioGroupComponent.displayName = 'RadioGroup';

// Accessible Radio Item
export interface RadioProps<Value = string>
  extends Omit<BaseRadio.Root.Props<Value>, 'value'> {
  value: Value;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean | string;
  compact?: boolean;
}

function RadioComponentInner<Value = string>(
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
  }: RadioProps<Value>,
  ref: React.ForwardedRef<HTMLElement>
) {
  const generatedId = React.useId();
  const radioId = id || generatedId;
  const descriptionId = label && description ? `${radioId}-description` : undefined;
  const hasErrorText = typeof error === 'string' && !!error;
  const errorId = label && hasErrorText ? `${radioId}-error` : undefined;
  const describedBy = [props['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const isClassNameFn = typeof className === 'function';

  const radioNode = (
    <BaseRadio.Root<Value>
      ref={ref}
      data-slot="radio-group-item"
      id={radioId}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      inputRef={inputRef}
      className={composeClassName(
        cn(
          'relative size-5 rounded-full border bg-surface transition-[background-color,border-color,box-shadow] flex items-center justify-center shrink-0 cursor-pointer select-none after:absolute after:-inset-3 after:content-[\'\']',
          'data-[checked]:border-2 data-[checked]:border-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary',
          'data-[disabled]:border-outline-variant data-[disabled]:bg-surface-container-high/50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
          error ? 'border-error focus-visible:outline-error' : 'border-outline'
        ),
        !label || isClassNameFn ? className : undefined
      )}
      {...props}
      aria-invalid={error ? true : props['aria-invalid']}
      aria-describedby={describedBy}
    >
      {children ?? (
        <BaseRadio.Indicator
          data-slot="radio-group-indicator"
          keepMounted
          className="size-2.5 rounded-full bg-primary transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] scale-0 data-[checked]:scale-100"
        />
      )}
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
          : 'w-full min-h-[44px] py-2 px-3 hover:bg-state-hover',
        'has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-60 has-[[data-disabled]]:hover:bg-transparent',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
        !isClassNameFn ? className : undefined
      )}
    >
      <div className="relative flex items-center justify-center min-w-[24px] h-6 mt-0.5">
        {radioNode}
      </div>
      <div className="flex flex-col flex-1 min-w-0 break-words">
        <span className="font-sans text-sm font-medium text-on-surface select-none group-has-[[data-disabled]]:text-on-surface-variant">
          {label}
        </span>
        {description && (
          <span id={descriptionId} className="font-sans text-sm text-on-surface-variant select-none mt-0.5">
            {description}
          </span>
        )}
        {hasErrorText && (
          <span id={errorId} className="flex items-center gap-1 font-sans text-sm font-semibold text-error mt-1 select-none">
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

const RadioComponent = React.forwardRef(RadioComponentInner) as (<Value = string>(
  props: RadioProps<Value> & React.RefAttributes<HTMLElement>
) => React.JSX.Element) & { displayName?: string };
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
