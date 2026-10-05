/**
 * Input primitive (@base-ui/react/input).
 *
 * Base UI Documentation: https://base-ui.com/react/components/input
 *
 * TAXONOMY & USAGE:
 * - A native input element that automatically works with Base UI Field context.
 * - Supports leading/trailing icons, clear button, and accessible error styling.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px/48x48px touch targets, and motion restraint.
 */
import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Field, BaseField, FieldRoot, FieldLabel, FieldControl, FieldDescription, FieldError, FieldValidity, FieldItem } from './field';
import { Textarea, TextareaField, FormTextarea, type TextareaProps, type TextareaFieldProps } from './textarea';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentPropsWithoutRef<typeof BaseInput> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  error?: boolean | string;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  leadingIcon,
  trailingIcon,
  trailingAction,
  clearable,
  onClear,
  error,
  value,
  ...props
}, ref) => {
  const hasLeading = Boolean(leadingIcon);
  const showClear = clearable && (value === undefined || Boolean(value));

  const clearButton = showClear ? (
    <button
      type="button"
      aria-label="Clear input"
      onClick={(e) => {
        e.preventDefault();
        onClear?.();
      }}
      className="p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary transition-colors cursor-pointer flex items-center justify-center min-w-[28px] min-h-[28px]"
    >
      <span className="material-symbols-outlined text-base leading-none select-none" aria-hidden="true">
        close
      </span>
    </button>
  ) : null;

  const effectiveTrailing = trailingAction ?? (showClear ? clearButton : trailingIcon);
  const hasTrailing = Boolean(effectiveTrailing);

  const inputElement = (
    <BaseInput
      ref={ref}
      value={value}
      className={cn(
        'w-full h-12 rounded bg-surface text-on-surface font-sans text-base transition-[border-color,box-shadow] min-h-[48px]',
        'border border-outline focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        error && 'border-error focus-visible:border-error focus-visible:outline-error',
        hasLeading ? 'pl-11' : 'pl-4',
        hasTrailing ? 'pr-11' : 'pr-4',
        className
      )}
      {...props}
    />
  );

  if (!hasLeading && !hasTrailing) {
    return inputElement;
  }

  return (
    <div className="relative flex items-center w-full">
      {leadingIcon && (
        <span
          className="text-on-surface-variant absolute left-3.5 flex items-center pointer-events-none text-xl select-none z-10"
          aria-hidden="true"
        >
          {leadingIcon}
        </span>
      )}
      {inputElement}
      {effectiveTrailing && (
        <span
          className={cn(
            'absolute right-3.5 flex items-center text-xl z-10',
            (trailingAction || showClear) ? 'text-on-surface' : 'text-on-surface-variant pointer-events-none select-none'
          )}
        >
          {effectiveTrailing}
        </span>
      )}
    </div>
  );
});

InputComponent.displayName = 'Input';

export interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> {
  label?: string;
  description?: string;
  /** Legacy alias for description */
  hint?: string;
  error?: string;
  required?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  description,
  hint,
  error,
  required,
  className,
  id,
  disabled,
  leadingIcon,
  trailingIcon,
  trailingAction,
  clearable,
  onClear,
  children,
  ...props
}, ref) => {
  return (
    <Field
      label={label}
      description={description ?? hint}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    >
      {children ? (
        children
      ) : (
        <InputComponent
          ref={ref}
          id={id}
          disabled={disabled}
          error={Boolean(error)}
          clearable={clearable}
          onClear={onClear}
          leadingIcon={
            error ? (
              <span className="material-symbols-outlined text-error text-xl select-none" aria-hidden="true">
                error
              </span>
            ) : (
              leadingIcon
            )
          }
          trailingIcon={trailingIcon}
          trailingAction={trailingAction}
          {...props}
        />
      )}
    </Field>
  );
});

FormField.displayName = 'FormField';

// Compound Base UI exports
export const Input = Object.assign(InputComponent, {
  Root: BaseInput,
});

export {
  BaseInput,
  BaseField,
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
  FieldItem,
  Textarea,
  TextareaField,
  FormTextarea,
  type TextareaProps,
  type TextareaFieldProps,
};

export const InputRoot = BaseInput;

export default Input;
