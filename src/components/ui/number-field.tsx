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
import { cn } from '@/lib/utils';

export interface NumberFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null, eventDetails?: BaseNumberField.Root.ChangeEventDetails) => void;
  onValueCommitted?: (value: number | null, eventDetails?: BaseNumberField.Root.CommitEventDetails) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  smallStep?: number;
  largeStep?: number;
  allowOutOfRange?: boolean;
  allowWheelScrub?: boolean;
  snapOnStep?: boolean;
  format?: Intl.NumberFormatOptions;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  id?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const NumberFieldComponent = React.forwardRef<HTMLDivElement, NumberFieldProps>(({
  label,
  description,
  error,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  smallStep = 0.1,
  largeStep = 10,
  allowOutOfRange = false,
  allowWheelScrub = false,
  snapOnStep = false,
  format,
  name,
  required,
  readOnly,
  id,
  autoFocus,
  disabled,
  children,
  className,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  // Composable compound usage
  if (children) {
    return (
      <BaseNumberField.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue ?? undefined}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        min={min}
        max={max}
        step={step}
        smallStep={smallStep}
        largeStep={largeStep}
        allowOutOfRange={allowOutOfRange}
        allowWheelScrub={allowWheelScrub}
        snapOnStep={snapOnStep}
        format={format}
        name={name}
        required={required}
        readOnly={readOnly}
        id={inputId}
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn('flex flex-col gap-1.5 w-max', className)}
        {...props}
      >
        {children}
      </BaseNumberField.Root>
    );
  }

  return (
    <BaseNumberField.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue ?? undefined}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
      min={min}
      max={max}
      step={step}
      smallStep={smallStep}
      largeStep={largeStep}
      allowOutOfRange={allowOutOfRange}
      allowWheelScrub={allowWheelScrub}
      snapOnStep={snapOnStep}
      format={format}
      name={name}
      required={required}
      readOnly={readOnly}
      id={inputId}
      autoFocus={autoFocus}
      disabled={disabled}
      className={cn('flex flex-col gap-1.5 w-max', className)}
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
        <span className="font-sans text-sm text-on-surface-variant">
          {description}
        </span>
      )}

      <BaseNumberField.Group
        className={cn(
          'inline-flex w-max items-center rounded border bg-surface overflow-hidden',
          'transition-[border-color,box-shadow]',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary focus-within:border-primary',
          error ? 'border-error focus-within:border-error has-[:focus-visible]:outline-error' : 'border-outline'
        )}
      >
        <BaseNumberField.Decrement
          aria-label="Decrease value"
          className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:bg-primary-container active:text-on-primary-container transition-colors disabled:opacity-40 border-r border-outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">remove</span>
        </BaseNumberField.Decrement>
        <BaseNumberField.Input className="h-11 w-16 text-center font-mono text-base font-bold text-on-surface bg-transparent focus:outline-none" />
        <BaseNumberField.Increment
          aria-label="Increase value"
          className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:bg-primary-container active:text-on-primary-container transition-colors disabled:opacity-40 border-l border-outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
        </BaseNumberField.Increment>
      </BaseNumberField.Group>

      {error && (
        <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none">
          <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
            error
          </span>
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
