/**
 * Input primitive (@base-ui/react/input).
 *
 * Base UI Documentation: https://base-ui.com/react/components/input
 *
 * TAXONOMY & USAGE:
 * - A native input element that automatically works with Base UI Field context.
 * - Supports leading/trailing icons, clear button, and accessible error styling.
 * - Follows Modern Web Guidance (MWG: html) tri-token contract:
 *   - Match `type` (browser validation), `inputMode` (virtual keyboard layout), and `autoComplete` (autofill heuristic):
 *     - Email: `type="email"` + `inputMode="email"` + `autoComplete="email"`
 *     - Phone: `type="tel"` + `inputMode="tel"` + `autoComplete="tel"`
 *     - Sign-in Password: `type="password"` + `autoComplete="current-password"`
 *     - New Password / Reset: `type="password"` + `autoComplete="new-password"`
 *     - Passkey / WebAuthn: `type="text"` + `autoComplete="username webauthn"`
 *     - Search: `type="search"` + `enterKeyHint="search"`
 *     - Clinical Code / NHS ID / Dosage: `autoCorrect="off"` + `spellCheck={false}`
 *     - OTP / PIN: `type="text"` + `inputMode="numeric"` + `autoComplete="one-time-code"`
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px/48x48px touch targets, and motion restraint.
 */
import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Button as BaseButton } from '@base-ui/react/button';
import { Field, BaseField, FieldRoot, FieldLabel, FieldControl, FieldDescription, FieldError, FieldValidity, FieldItem } from './field';
import { Textarea, TextareaField, FormTextarea, type TextareaProps, type TextareaFieldProps } from './textarea';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseInput>, 'size'> {
  size?: InputSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  error?: boolean | string;
  /**
   * Autofill token for password managers and passkeys.
   * Prefer explicit tokens: 'email', 'current-password', 'new-password', 'one-time-code', 'username webauthn', 'address-level2'.
   */
  autoComplete?: string;
  /**
   * Virtual keyboard hint for mobile devices: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'.
   */
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  /**
   * Mobile virtual keyboard action button label.
   * Options: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'.
   */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /**
   * Mobile autocorrect behavior.
   * In clinical code fields (NHS IDs, dosages, medication names), set to 'off'
   * to prevent mobile OS spellcheck from mangling clinical entries.
   */
  autoCorrect?: 'on' | 'off' | string;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  size = 'md',
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
    <BaseButton
      type="button"
      aria-label="Clear input"
      onClick={(e) => {
        e.preventDefault();
        onClear?.();
      }}
      className={cn(
        "rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer touch-manipulation flex items-center justify-center select-none",
        size === 'sm' ? "size-9 min-w-[36px] min-h-[36px]" : "size-11 min-w-[44px] min-h-[44px]"
      )}
    >
      <span className="material-symbols-outlined text-base leading-none select-none" aria-hidden="true">
        close
      </span>
    </BaseButton>
  ) : null;

  const effectiveTrailing = trailingAction ?? (showClear ? clearButton : trailingIcon);
  const hasTrailing = Boolean(effectiveTrailing);

  const sizeClasses = {
    sm: 'h-11 min-h-[44px] text-sm',
    md: 'h-12 min-h-[48px] text-base',
    lg: 'h-14 min-h-[56px] text-base',
  }[size];

  const paddingClasses = size === 'sm'
    ? cn(
        hasLeading ? 'pl-10' : 'pl-3.5',
        hasTrailing ? (showClear || trailingAction ? 'pr-12' : 'pr-10') : 'pr-3.5'
      )
    : cn(
        hasLeading ? 'pl-11' : 'pl-4',
        hasTrailing ? (showClear || trailingAction ? 'pr-14' : 'pr-11') : 'pr-4'
      );

  const inputElement = (
    <BaseInput
      ref={ref}
      value={value}
      className={cn(
        'w-full rounded bg-surface text-on-surface font-sans transition-[border-color,box-shadow]',
        sizeClasses,
        paddingClasses,
        'border border-outline focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        'aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:outline-error',
        'user-invalid:border-error user-invalid:focus-visible:border-error user-invalid:focus-visible:outline-error',
        error && 'border-error focus-visible:border-error focus-visible:outline-error',
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
            'absolute flex items-center text-xl z-10',
            (trailingAction || showClear) ? 'right-1 text-on-surface' : 'right-3.5 text-on-surface-variant pointer-events-none select-none'
          )}
        >
          {effectiveTrailing}
        </span>
      )}
    </div>
  );
});

InputComponent.displayName = 'Input';

export interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'size'> {
  size?: InputSize;
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
  size = 'md',
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
          size={size}
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
