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
  variant?: 'default' | 'unstyled' | 'ghost';
  /**
   * When true, automatically adjusts the height of the textarea to fit its content
   * using modern CSS `field-sizing: content` without JavaScript recalculations.
   * @default false
   */
  autoGrow?: boolean;
}

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, variant = 'default', autoGrow = false, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full min-h-[80px] p-3 rounded font-sans text-base transition-[border-color,box-shadow]',
      variant === 'default' && [
        'bg-surface text-on-surface',
        'border border-outline focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
        'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        'aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:outline-error',
        'user-invalid:border-error user-invalid:focus-visible:border-error user-invalid:focus-visible:outline-error',
        error && 'border-error focus-visible:border-error focus-visible:outline-error',
      ],
      (variant === 'unstyled' || variant === 'ghost') && [
        'bg-transparent text-on-surface border-0 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none p-0',
        'disabled:bg-transparent disabled:border-none disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
      ],
      autoGrow && '[field-sizing:content] min-h-[3lh] max-h-[12lh] h-auto resize-none',
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
  autoGrow,
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
            autoGrow={autoGrow}
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
