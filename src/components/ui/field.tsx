import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '@/lib/utils';
import { Input, type InputProps } from './input';
import { Textarea, TextareaField, FormTextarea, type TextareaProps, type TextareaFieldProps } from './textarea';

export interface FieldProps extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Legacy alias for `description` */
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FieldComponent = React.forwardRef<HTMLDivElement, FieldProps>(({
  label,
  description,
  hint,
  error,
  required,
  children,
  className,
  ...props
}, ref) => {
  const helperText = description ?? hint;

  return (
    <BaseField.Root
      ref={ref}
      invalid={Boolean(error)}
      className={cn('flex flex-col gap-1.5 w-full', className)}
      {...props}
    >
      {label && (
        <BaseField.Label className="font-label text-sm font-semibold text-on-surface flex items-center justify-between">
          <span>{label}</span>
          {required && (
            <span className="text-sm text-on-surface-variant font-normal">(required)</span>
          )}
        </BaseField.Label>
      )}

      {helperText && (
        <BaseField.Description className="text-sm text-on-surface-variant font-sans">
          {helperText}
        </BaseField.Description>
      )}

      {children}

      {error ? (
        <BaseField.Error
          match
          className="flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]"
        >
          <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
            error
          </span>
          <span>{error}</span>
        </BaseField.Error>
      ) : (
        <BaseField.Error
          className="flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]"
          render={(elementProps) => (
            <div
              {...elementProps}
              className={cn(
                'flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]',
                elementProps.className
              )}
            >
              <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
                error
              </span>
              <span>{elementProps.children}</span>
            </div>
          )}
        />
      )}
    </BaseField.Root>
  );
});

FieldComponent.displayName = 'Field';

export const Field = Object.assign(FieldComponent, {
  Root: BaseField.Root,
  Label: BaseField.Label,
  Control: BaseField.Control,
  Description: BaseField.Description,
  Error: BaseField.Error,
  Validity: BaseField.Validity,
  Item: BaseField.Item,
});

// Styled Compound Components for advanced composition
export const FieldRoot = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseField.Root>>(
  ({ className, ...props }, ref) => (
    <BaseField.Root ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)} {...props} />
  )
);
FieldRoot.displayName = 'FieldRoot';

export const FieldLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof BaseField.Label>>(
  ({ className, ...props }, ref) => (
    <BaseField.Label
      ref={ref}
      className={cn('font-label text-sm font-semibold text-on-surface flex items-center justify-between', className)}
      {...props}
    />
  )
);
FieldLabel.displayName = 'FieldLabel';

export const FieldControl = BaseField.Control;

export const FieldDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof BaseField.Description>>(
  ({ className, ...props }, ref) => (
    <BaseField.Description
      ref={ref}
      className={cn('text-sm text-on-surface-variant font-sans', className)}
      {...props}
    />
  )
);
FieldDescription.displayName = 'FieldDescription';

export const FieldError = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseField.Error>>(
  ({ className, children, render, ...props }, ref) => (
    <BaseField.Error
      ref={ref}
      className={cn(
        'flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]',
        className
      )}
      render={
        render ??
        ((elementProps) => (
          <div
            {...elementProps}
            className={cn(
              'flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]',
              elementProps.className
            )}
          >
            <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
              error
            </span>
            <span>{elementProps.children}</span>
          </div>
        ))
      }
      {...props}
    >
      {children}
    </BaseField.Error>
  )
);
FieldError.displayName = 'FieldError';

export const FieldValidity = BaseField.Validity;
export const FieldItem = BaseField.Item;
export { BaseField };

// Cross-export Input and Textarea for backward compatibility with apps importing from Field
export {
  Input,
  type InputProps,
  Textarea,
  TextareaField,
  FormTextarea,
  type TextareaProps,
  type TextareaFieldProps,
};
