import * as React from 'react';
import { Field } from './field';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full min-h-[80px] p-3 rounded bg-surface text-on-surface font-sans text-base transition-colors',
      'border-[1px] border-outline focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary',
      'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant disabled:cursor-not-allowed',
      error && 'border-error focus:border-error focus:outline-error',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export interface TextareaFieldProps extends TextareaProps {
  label?: string;
  description?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({
  label,
  description,
  hint,
  error,
  required,
  className,
  id,
  disabled,
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
      <Textarea
        ref={ref}
        id={id}
        disabled={disabled}
        error={Boolean(error)}
        {...props}
      />
    </Field>
  );
});
TextareaField.displayName = 'TextareaField';

/** Backward-compatibility alias for TextareaField */
export const FormTextarea = TextareaField;

export default Textarea;
