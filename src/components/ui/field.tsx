'use client';

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
import { cn, composeClassName } from '@/lib/utils';

// ============================================================================
// Layout Types & Slots
// ============================================================================

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

export interface FieldRootProps extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {
  orientation?: FieldOrientation;
}

export const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <BaseField.Root
      ref={ref}
      data-slot="field"
      data-orientation={orientation}
      className={composeClassName(
        cn(
          'w-full group/field',
          orientation === 'horizontal'
            ? 'flex flex-row items-center justify-between gap-4'
            : orientation === 'responsive'
              ? 'flex flex-col gap-1.5 @md/field-group:flex-row @md/field-group:items-center @md/field-group:justify-between @md/field-group:gap-4'
              : 'flex flex-col gap-1.5'
        ),
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
    className={composeClassName(
      'font-label text-sm font-semibold text-on-surface group-has-[:user-invalid]/field:text-error group-data-[invalid]/field:text-error group-data-[invalid=true]/field:text-error data-[invalid]:text-error group-data-[disabled]/field:opacity-50 group-data-[disabled=true]/field:opacity-50 data-[disabled]:opacity-50 flex items-center justify-between select-none',
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
      className={cn(
        'font-label text-sm font-semibold text-on-surface group-data-[invalid]/field:text-error group-data-[invalid=true]/field:text-error data-[invalid]:text-error group-data-[disabled]/field:opacity-50 group-data-[disabled=true]/field:opacity-50 data-[disabled]:opacity-50 select-none',
        className
      )}
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
    className={composeClassName(
      'text-sm text-on-surface-variant font-sans group-data-[invalid]/field:text-error/90 group-data-[invalid=true]/field:text-error/90 data-[invalid]:text-error/90 group-data-[disabled]/field:opacity-50 group-data-[disabled=true]/field:opacity-50 data-[disabled]:opacity-50',
      className
    )}
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
      className={cn('@container/field-group flex flex-col gap-4 w-full', className)}
      {...props}
    />
  )
);
FieldGroup.displayName = 'FieldGroup';

export interface FieldSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const FieldSeparator = React.forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    if (children) {
      return (
        <div
          ref={ref}
          data-slot="field-separator"
          data-content="true"
          className={cn('relative flex items-center gap-3 my-2 w-full text-xs text-on-surface-variant font-sans', className)}
          {...props}
        >
          <span className="h-px flex-1 bg-outline-variant/60" aria-hidden="true" />
          <span data-slot="field-separator-content" className="shrink-0 px-1 text-on-surface-variant">
            {children}
          </span>
          <span className="h-px flex-1 bg-outline-variant/60" aria-hidden="true" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        data-slot="field-separator"
        className={cn('h-px bg-outline-variant/60 my-2 w-full', className)}
        {...props}
      />
    );
  }
);
FieldSeparator.displayName = 'FieldSeparator';

export type FieldControlProps = React.ComponentPropsWithoutRef<typeof BaseField.Control>;

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

export interface FieldErrorProps extends React.ComponentPropsWithoutRef<typeof BaseField.Error> {
  errors?: Array<{ message?: string } | undefined>;
}

export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, children, errors, match, render, ...props }, ref) => {
    const uniqueErrors = React.useMemo(() => {
      if (!errors?.length) return [];
      const seen = new Set<string>();
      const messages: string[] = [];
      for (const err of errors) {
        const msg = err?.message?.trim();
        if (msg && !seen.has(msg)) {
          seen.add(msg);
          messages.push(msg);
        }
      }
      return messages;
    }, [errors]);

    const hasErrorsProp = errors !== undefined;
    if (children === undefined && hasErrorsProp && uniqueErrors.length === 0) {
      return null;
    }

    const isMultipleErrors = children === undefined && uniqueErrors.length > 1;
    const resolvedChildren =
      children !== undefined
        ? children
        : uniqueErrors.length === 1
          ? uniqueErrors[0]
          : uniqueErrors.length > 1
            ? (
                <ul className="ms-4 flex list-disc flex-col gap-1">
                  {uniqueErrors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )
            : undefined;
    const resolvedMatch = match ?? (hasErrorsProp && uniqueErrors.length > 0 ? true : undefined);

    return (
      <BaseField.Error
        ref={ref}
        data-slot="field-error"
        match={resolvedMatch}
        className={composeClassName(
          cn(
            'flex gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-quick motion-reduce:transition-none',
            isMultipleErrors ? 'items-start' : 'items-center'
          ),
          className
        )}
        render={
          render ??
          ((elementProps) => (
            <div {...elementProps}>
              <Icon name="error" size="sm" className={cn('shrink-0 text-error', isMultipleErrors && 'mt-0.5')} />
              <div className="min-w-0 flex-1">{elementProps.children}</div>
            </div>
          ))
        }
        {...props}
      >
        {resolvedChildren}
      </BaseField.Error>
    );
  }
);
FieldError.displayName = 'FieldError';

export const FieldValidity = BaseField.Validity;

export const FieldItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseField.Item>
>(({ className, ...props }, ref) => (
  <BaseField.Item
    ref={ref}
    data-slot="field-item"
    className={composeClassName('flex items-center gap-2', className)}
    {...props}
  />
));
FieldItem.displayName = 'FieldItem';

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
  requiredLabel?: React.ReactNode;
  orientation?: FieldOrientation;
  children: React.ReactNode;
}

function hasFieldCompoundChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const t = child.type;
    if (
      t === FieldLabel ||
      t === FieldTitle ||
      t === FieldControl ||
      t === FieldDescription ||
      t === FieldContent ||
      t === FieldError ||
      t === FieldItem ||
      t === BaseField.Label ||
      t === BaseField.Control ||
      t === BaseField.Description ||
      t === BaseField.Error ||
      t === BaseField.Item
    ) {
      return true;
    }
    const name = typeof t === 'function' || typeof t === 'object' ? (t as { displayName?: string }).displayName : undefined;
    return Boolean(name && /^Field(Label|Title|Control|Description|Content|Error|Item)/.test(name));
  });
}

function canAcceptNativeRequired(child: React.ReactNode): child is React.ReactElement<{ required?: boolean }> {
  if (!React.isValidElement<{ required?: boolean }>(child)) return false;
  if (child.props.required !== undefined) return false;
  if (typeof child.type === 'string') {
    return child.type === 'input' || child.type === 'select' || child.type === 'textarea';
  }
  const displayName = (child.type as { displayName?: string }).displayName;
  if (displayName === 'InputGroup' || displayName === 'InputGroupRoot') return false;
  return true;
}

const FieldComponent = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      description,
      hint,
      error,
      required,
      requiredLabel = '(required)',
      orientation = 'vertical',
      children,
      className,
      name,
      disabled,
      invalid,
      validate,
      validationMode,
      validationDebounceTime,
      ...props
    },
    ref
  ) => {
    const helperText = description ?? hint;
    const isCompoundUsage =
      label === undefined &&
      helperText === undefined &&
      error === undefined &&
      hasFieldCompoundChildren(children);

    // Forward `required` to a single direct control child so native validation matches the label,
    // skipping layout wrappers like InputGroup or raw HTML containers.
    const control =
      required && canAcceptNativeRequired(children)
        ? React.cloneElement(children, { required: true })
        : children;

    return (
      <FieldRoot
        ref={ref}
        name={name}
        disabled={disabled}
        validate={validate}
        validationMode={validationMode}
        validationDebounceTime={validationDebounceTime}
        invalid={error ? true : invalid}
        orientation={orientation}
        className={className}
        {...props}
      >
        {isCompoundUsage ? (
          children
        ) : orientation === 'horizontal' || orientation === 'responsive' ? (
          <>
            {(label || helperText) && (
              <FieldContent>
                {label && (
                  <FieldLabel>
                    <span>{label}</span>
                    {required && requiredLabel !== null && (
                      <span className="text-sm text-on-surface-variant font-normal">{requiredLabel}</span>
                    )}
                  </FieldLabel>
                )}
                {helperText && <FieldDescription>{helperText}</FieldDescription>}
              </FieldContent>
            )}
            {control}
          </>
        ) : (
          <>
            {label && (
              <FieldLabel>
                <span>{label}</span>
                {required && requiredLabel !== null && (
                  <span className="text-sm text-on-surface-variant font-normal">{requiredLabel}</span>
                )}
              </FieldLabel>
            )}
            {helperText && <FieldDescription>{helperText}</FieldDescription>}
            {control}
          </>
        )}

        {!isCompoundUsage && (error ? <FieldError match={true}>{error}</FieldError> : <FieldError />)}
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
