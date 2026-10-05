/**
 * Textarea primitive.
 *
 * Base UI Integration: Works seamlessly with Base UI Field via Field.Control.
 *
 * TAXONOMY & USAGE:
 * - Use Textarea for multi-line freeform text input.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 touch target compliance.
 */
import * as React from 'react';
import { Field } from './field';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full min-h-[80px] p-3 rounded-md bg-surface text-on-surface font-sans text-base transition-[border-color,box-shadow]',
      'border border-outline focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
      error && 'border-error focus-visible:border-error focus-visible:outline-error',
      className
    )}
    {...props}
  />
));
TextareaComponent.displayName = 'Textarea';

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
      <Field.Control
        render={(controlProps) => (
          <TextareaComponent
            ref={ref}
            id={id}
            disabled={disabled}
            error={Boolean(error)}
            {...controlProps}
            {...props}
          />
        )}
      />
    </Field>
  );
});
TextareaField.displayName = 'TextareaField';

/** Compound export */
export const Textarea = Object.assign(TextareaComponent, {
  Field: TextareaField,
});

/** Backward-compatibility alias for TextareaField */
export const FormTextarea = TextareaField;

export default Textarea;
