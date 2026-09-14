import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Field, BaseField, FieldRoot, FieldLabel, FieldControl, FieldDescription, FieldError, FieldValidity, FieldItem, Textarea, type TextareaProps } from './field';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> {
  label?: string;
  description?: string;
  /** Legacy alias for description */
  hint?: string;
  error?: string;
  required?: boolean;
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
        <div className="relative flex items-center w-full">
          {error && (
            <span className="material-symbols-outlined text-error absolute left-3 pointer-events-none text-xl" aria-hidden="true">
              error
            </span>
          )}
          <BaseInput
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              'w-full h-12 px-4 rounded-[0.5rem] bg-surface text-on-surface font-sans text-base transition-colors',
              'border-[1px] border-outline focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary',
              'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant disabled:cursor-not-allowed',
              error ? 'border-error pl-10 pr-4' : 'px-4'
            )}
            {...props}
          />
        </div>
      )}
    </Field>
  );
});

FormField.displayName = 'FormField';

export interface InputProps extends React.ComponentPropsWithoutRef<typeof BaseInput> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <BaseInput
      ref={ref}
      className={cn(
        'w-full h-12 px-4 rounded-[0.5rem] bg-surface text-on-surface font-sans text-base transition-colors',
        'border-[1px] border-outline focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary',
        'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

// Compound Base UI exports
export { BaseInput, BaseField, FieldRoot, FieldLabel, FieldControl, FieldDescription, FieldError, FieldValidity, FieldItem, Textarea, type TextareaProps };
export const InputRoot = BaseInput;



