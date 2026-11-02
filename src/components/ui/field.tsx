/**
 * Field primitive (@base-ui/react/field).
 *
 * Base UI Documentation: https://base-ui.com/react/components/field
 *
 * TAXONOMY & USAGE:
 * - Use Field to group a form control with its label, description, and error message.
 * - Supports automatic validation (onSubmit, onBlur, onChange), validation debouncing,
 *   and accessibility attribute wiring (id, aria-labelledby, aria-describedby, aria-invalid).
 * - Supports vertical (default) and horizontal layouts (for Switch, Checkbox, Radio).
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 touch target compliance.
 */
import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

// ============================================================================
// Layout Types & Slots
// ============================================================================

export type FieldOrientation = 'vertical' | 'horizontal';

export interface FieldRootProps extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {
  orientation?: FieldOrientation;
}

export const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <BaseField.Root
      ref={ref}
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        'w-full group/field',
        orientation === 'horizontal'
          ? 'flex flex-row items-center justify-between gap-4'
          : 'flex flex-col gap-1.5',
        className
      )}
      {...props}
    />
  )
);
FieldRoot.displayName = 'FieldRoot';

// ============================================================================
// Subcomponents
// ============================================================================

export const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof BaseField.Label>
>(({ className, ...props }, ref) => (
  <BaseField.Label
    ref={ref}
    data-slot="field-label"
    className={cn(
      'font-label text-sm font-semibold text-on-surface group-has-[:user-invalid]/field:text-error data-[invalid]:text-error flex items-center justify-between select-none',
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = 'FieldLabel';

export const FieldTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-title"
      className={cn('font-label text-sm font-semibold text-on-surface select-none', className)}
      {...props}
    />
  )
);
FieldTitle.displayName = 'FieldTitle';

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseField.Description>
>(({ className, ...props }, ref) => (
  <BaseField.Description
    ref={ref}
    data-slot="field-description"
    className={cn('text-sm text-on-surface-variant font-sans', className)}
    {...props}
  />
));
FieldDescription.displayName = 'FieldDescription';

export const FieldContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-content"
      className={cn('flex flex-col gap-0.5 flex-1 min-w-0', className)}
      {...props}
    />
  )
);
FieldContent.displayName = 'FieldContent';

export const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn('flex flex-col gap-4 w-full', className)}
      {...props}
    />
  )
);
FieldGroup.displayName = 'FieldGroup';

export const FieldSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      data-slot="field-separator"
      className={cn('border-0 border-t border-outline-variant/60 my-2 w-full', className)}
      {...props}
    />
  )
);
FieldSeparator.displayName = 'FieldSeparator';

export interface FieldControlProps extends React.ComponentPropsWithoutRef<typeof BaseField.Control> {
  asChild?: boolean;
}

export const FieldControl = React.forwardRef<HTMLInputElement, FieldControlProps>(
  ({ children, render, ...props }, ref) => {
    // If a single child React element is passed, use Base UI's polymorphic render prop so that
    // children are not rendered inside the void <input> element.
    if (children && !render && React.isValidElement(children)) {
      return (
        <BaseField.Control
          ref={ref}
          data-slot="field-control"
          render={children}
          {...props}
        />
      );
    }

    return (
      <BaseField.Control
        ref={ref}
        data-slot="field-control"
        render={render}
        {...props}
      >
        {children}
      </BaseField.Control>
    );
  }
);
FieldControl.displayName = 'FieldControl';

export const FieldError = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseField.Error>
>(({ className, children, render, ...props }, ref) => (
  <BaseField.Error
    ref={ref}
    data-slot="field-error"
    className={cn(
      'flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-quick',
      className
    )}
    render={
      render ??
      ((elementProps) => (
        <div
          {...elementProps}
          className={cn(
            'flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-quick',
            elementProps.className
          )}
        >
          <Icon name="error" size="sm" className="shrink-0 text-error" />
          <span>{elementProps.children}</span>
        </div>
      ))
    }
    {...props}
  >
    {children}
  </BaseField.Error>
));
FieldError.displayName = 'FieldError';

export const FieldValidity = BaseField.Validity;
export const FieldItem = BaseField.Item;

// ============================================================================
// Monolithic Convenience Component
// ============================================================================

export interface FieldProps extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** @deprecated Use `description` instead */
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  orientation?: FieldOrientation;
  children: React.ReactNode;
  className?: string;
}

const FieldComponent = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      description,
      hint,
      error,
      required,
      orientation = 'vertical',
      children,
      className,
      name,
      disabled,
      validate,
      validationMode,
      validationDebounceTime,
      ...props
    },
    ref
  ) => {
    const helperText = description ?? hint;

    return (
      <FieldRoot
        ref={ref}
        name={name}
        disabled={disabled}
        validate={validate}
        validationMode={validationMode}
        validationDebounceTime={validationDebounceTime}
        invalid={Boolean(error)}
        orientation={orientation}
        className={className}
        {...props}
      >
        {orientation === 'horizontal' ? (
          <>
            {(label || helperText) && (
              <FieldContent>
                {label && (
                  <FieldLabel>
                    <span>{label}</span>
                    {required && (
                      <span className="text-sm text-on-surface-variant font-normal">(required)</span>
                    )}
                  </FieldLabel>
                )}
                {helperText && <FieldDescription>{helperText}</FieldDescription>}
              </FieldContent>
            )}
            {children}
          </>
        ) : (
          <>
            {label && (
              <FieldLabel>
                <span>{label}</span>
                {required && (
                  <span className="text-sm text-on-surface-variant font-normal">(required)</span>
                )}
              </FieldLabel>
            )}
            {helperText && <FieldDescription>{helperText}</FieldDescription>}
            {children}
          </>
        )}

        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <FieldError />
        )}
      </FieldRoot>
    );
  }
);
FieldComponent.displayName = 'Field';

// Compound Object export
export const Field = Object.assign(FieldComponent, {
  Root: FieldRoot,
  Label: FieldLabel,
  Title: FieldTitle,
  Control: FieldControl,
  Description: FieldDescription,
  Content: FieldContent,
  Group: FieldGroup,
  Separator: FieldSeparator,
  Error: FieldError,
  Validity: FieldValidity,
  Item: FieldItem,
});

// Re-export Base UI primitive and convenience aliases for Fieldset
export { BaseField };
export { Fieldset, FieldsetRoot, FieldsetLegend, FieldsetDescription, Fieldset as FieldSet, FieldsetLegend as FieldLegend } from './fieldset';

export default Field;
