'use client';

/**
 * NumberField primitive (@base-ui/react/number-field).
 *
 * Base UI Documentation: https://base-ui.com/react/components/number-field
 *
 * TAXONOMY & USAGE:
 * - Use NumberField for numerical inputs with step buttons, keyboard scrubbing,
 *   wheel scrubbing, and localized formatting.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint.
 */
import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { cn, composeClassName } from '@/lib/utils';
import { Icon } from './icon';

export type NumberFieldSize = 'sm' | 'md' | 'lg';

export interface NumberFieldProps extends BaseNumberField.Root.Props {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  /** Synchronizes control height with sibling Input/Button tiers: sm (44px), md (48px), lg (56px). */
  size?: NumberFieldSize;
}

const numberFieldSizeStyles: Record<NumberFieldSize, { button: string; input: string }> = {
  sm: { button: 'size-11 min-h-[44px] min-w-[44px]', input: 'h-11 text-sm' },
  md: { button: 'size-12 min-h-[48px] min-w-[48px]', input: 'h-12 text-base' },
  lg: { button: 'size-14 min-h-[56px] min-w-[56px]', input: 'h-14 text-lg' },
};

const NumberFieldComponent = React.forwardRef<HTMLDivElement, NumberFieldProps>(({
  label,
  description,
  error,
  size = 'md',
  step = 1,
  smallStep = 0.1,
  largeStep = 10,
  allowOutOfRange = false,
  allowWheelScrub = false,
  snapOnStep = false,
  required,
  id,
  children,
  className,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const rootClassName = composeClassName('flex flex-col gap-1.5 w-max', className);

  // Composable compound usage
  if (children) {
    return (
      <BaseNumberField.Root
        ref={ref}
        step={step}
        smallStep={smallStep}
        largeStep={largeStep}
        allowOutOfRange={allowOutOfRange}
        allowWheelScrub={allowWheelScrub}
        snapOnStep={snapOnStep}
        required={required}
        id={inputId}
        className={rootClassName}
        {...props}
      >
        {children}
      </BaseNumberField.Root>
    );
  }

  return (
    <BaseNumberField.Root
      ref={ref}
      step={step}
      smallStep={smallStep}
      largeStep={largeStep}
      allowOutOfRange={allowOutOfRange}
      allowWheelScrub={allowWheelScrub}
      snapOnStep={snapOnStep}
      required={required}
      id={inputId}
      className={rootClassName}
      {...props}
    >
      {label && (
        <label htmlFor={inputId} className="font-label text-sm font-semibold text-on-surface cursor-pointer flex items-center justify-between">
          <span>{label}</span>
          {required && (
            <span className="text-sm text-on-surface-variant font-normal">(required)</span>
          )}
        </label>
      )}

      {description && (
        <span id={descriptionId} className="font-sans text-sm text-on-surface-variant">
          {description}
        </span>
      )}

      <BaseNumberField.Group
        data-slot="number-field-group"
        className={cn(
          'inline-flex w-max items-center rounded border bg-surface overflow-hidden',
          'transition-[border-color,box-shadow]',
          'has-[:focus-visible]:border-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-1 has-[:focus-visible]:outline-primary',
          'data-[disabled]:opacity-50 data-[disabled]:bg-surface-container-low data-[disabled]:pointer-events-none',
          error ? 'border-error focus-within:border-error has-[:focus-visible]:outline-error' : 'border-outline hover:border-on-surface-variant/80'
        )}
      >
        <BaseNumberField.Decrement
          aria-label="Decrease value"
          className={cn(
            numberFieldSizeStyles[size].button,
            'flex items-center justify-center text-on-surface-variant hover:bg-state-hover hover:text-on-surface active:bg-surface-container-high active:scale-[0.96] transition-colors disabled:opacity-40 data-[disabled]:opacity-40 border-e border-outline-variant focus-visible:outline-none focus-visible:bg-surface-container-low focus-visible:text-primary cursor-pointer select-none'
          )}
        >
          <Icon name="remove" size="sm" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          data-slot="number-field-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            numberFieldSizeStyles[size].input,
            'min-w-[4rem] w-20 [field-sizing:content] px-2 text-center font-mono font-bold text-on-surface tabular-nums bg-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0'
          )}
        />
        <BaseNumberField.Increment
          aria-label="Increase value"
          className={cn(
            numberFieldSizeStyles[size].button,
            'flex items-center justify-center text-on-surface-variant hover:bg-state-hover hover:text-on-surface active:bg-surface-container-high active:scale-[0.96] transition-colors disabled:opacity-40 data-[disabled]:opacity-40 border-s border-outline-variant focus-visible:outline-none focus-visible:bg-surface-container-low focus-visible:text-primary cursor-pointer select-none'
          )}
        >
          <Icon name="add" size="sm" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>

      {error && (
        <span id={errorId} className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none">
          <Icon name="error" size="sm" className="shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </span>
      )}
    </BaseNumberField.Root>
  );
});

NumberFieldComponent.displayName = 'NumberField';

// Compound export mapping Base UI primitives
export const NumberField = Object.assign(NumberFieldComponent, {
  Root: BaseNumberField.Root,
  Group: BaseNumberField.Group,
  Input: BaseNumberField.Input,
  Increment: BaseNumberField.Increment,
  Decrement: BaseNumberField.Decrement,
  ScrubArea: BaseNumberField.ScrubArea,
  ScrubAreaCursor: BaseNumberField.ScrubAreaCursor,
});

// Re-export Base UI primitives for compound composition
export { BaseNumberField };
export const NumberFieldRoot = BaseNumberField.Root;
export const NumberFieldGroup = BaseNumberField.Group;
export const NumberFieldInput = BaseNumberField.Input;
export const NumberFieldIncrement = BaseNumberField.Increment;
export const NumberFieldDecrement = BaseNumberField.Decrement;
export const NumberFieldScrubArea = BaseNumberField.ScrubArea;
export const NumberFieldScrubAreaCursor = BaseNumberField.ScrubAreaCursor;

export default NumberField;
