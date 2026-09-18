import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Field, BaseField, FieldRoot, FieldLabel, FieldControl, FieldDescription, FieldError, FieldValidity, FieldItem } from './field';
import { Textarea, TextareaField, FormTextarea, type TextareaProps, type TextareaFieldProps } from './textarea';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentPropsWithoutRef<typeof BaseInput> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  error?: boolean | string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  leadingIcon,
  trailingIcon,
  trailingAction,
  error,
  ...props
}, ref) => {
  const hasLeading = Boolean(leadingIcon);
  const hasTrailing = Boolean(trailingIcon || trailingAction);

  const inputElement = (
    <BaseInput
      ref={ref}
      className={cn(
        'w-full h-12 rounded bg-surface text-on-surface font-sans text-base transition-colors',
        'border-[1px] border-outline focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary',
        'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant disabled:cursor-not-allowed',
        error && 'border-error focus:border-error focus:outline-error',
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
          className="text-on-surface-variant absolute left-3.5 flex items-center pointer-events-none text-xl select-none"
          aria-hidden="true"
        >
          {leadingIcon}
        </span>
      )}
      {inputElement}
      {(trailingIcon || trailingAction) && (
        <span
          className={cn(
            'absolute right-3.5 flex items-center text-xl',
            trailingAction ? 'text-on-surface' : 'text-on-surface-variant pointer-events-none select-none'
          )}
        >
          {trailingAction ?? trailingIcon}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

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
        <Input
          ref={ref}
          id={id}
          disabled={disabled}
          error={Boolean(error)}
          leadingIcon={
            error ? (
              <span className="material-symbols-outlined text-error text-xl" aria-hidden="true">
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
