import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { cn } from '@/lib/utils';

export interface NumberFieldProps {
  label?: string;
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  format?: Intl.NumberFormatOptions;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  id?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

const NumberFieldComponent: React.FC<NumberFieldProps> = ({
  label,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  format,
  name,
  required,
  readOnly,
  id,
  autoFocus,
  disabled,
  className,
}) => {
  return (
    <BaseNumberField.Root
      value={value}
      defaultValue={defaultValue ?? undefined}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      format={format}
      name={name}
      required={required}
      readOnly={readOnly}
      id={id}
      autoFocus={autoFocus}
      disabled={disabled}
      className={cn('flex flex-col gap-1.5 w-max', className)}
    >
      {label && (
        <label htmlFor={id} className="font-label text-xs font-semibold text-on-surface-variant cursor-pointer">
          {label}
        </label>
      )}
      <BaseNumberField.Group className="inline-flex w-max items-center rounded-md border-[1px] border-outline bg-surface overflow-hidden transition-[border-color,outline] duration-[var(--duration-quick)] focus-within:border-primary has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
        <BaseNumberField.Decrement
          aria-label="Decrease value"
          className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:bg-surface-variant active:bg-primary/10 transition-colors disabled:opacity-40 border-r border-outline-variant/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">remove</span>
        </BaseNumberField.Decrement>
        <BaseNumberField.Input className="h-11 w-16 text-center font-mono text-sm font-bold text-on-surface bg-transparent focus:outline-none" />
        <BaseNumberField.Increment
          aria-label="Increase value"
          className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:bg-surface-variant active:bg-primary/10 transition-colors disabled:opacity-40 border-l border-outline-variant/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
};

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
