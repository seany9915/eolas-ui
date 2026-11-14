/**
 * Input primitive (@base-ui/react/input).
 *
 * Base UI Documentation: https://base-ui.com/react/components/input
 * shadcn Base Input Documentation: https://ui.shadcn.com/docs/components/base/input
 *
 * ANATOMY:
 * Input (or BaseInput / InputPrimitive)
 *
 * TAXONOMY & USAGE:
 * - A native input element that automatically works with Base UI Field context (<Field.Root>).
 * - Implements Modern Web Guidance (MWG: html) tri-token contract for autocomplete, inputMode, enterKeyHint.
 * - Follows DESIGN.md Tier B interactive controls:
 *   - 0.5rem corner radius (rounded-lg) matching Buttons as the primary form control.
 *   - Flush 2px focus indicator with negative 1px offset (focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary)
 *     for WCAG 2.4.13 contrast and Windows High Contrast Mode (forced-colors: active) compatibility.
 *   - WCAG 2.2 SC 2.5.8 compliant hit target sizes: sm (44px), md (48px), lg (56px).
 * - For complex input layouts with toolbars, prefixes, suffixes, or multiple buttons,
 *   compose with <InputGroup> (@/components/ui/input-group).
 */
import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseInput>, 'size'> {
  size?: InputSize;
  error?: boolean | string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  /**
   * Autofill token for password managers and passkeys.
   * Examples: 'email', 'current-password', 'new-password', 'one-time-code', 'username webauthn', 'address-level2'.
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

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      leadingIcon,
      trailingIcon,
      trailingAction,
      clearable,
      onClear,
      error,
      value,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );
    const isControlled = value !== undefined;
    const [uncontrolledHasValue, setUncontrolledHasValue] = React.useState(Boolean(props.defaultValue));
    const hasLeading = Boolean(leadingIcon);
    const showClear = clearable && (isControlled ? Boolean(value) : uncontrolledHasValue);

    const clearButton = showClear ? (
      <BaseButton
        type="button"
        aria-label="Clear input"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          const input = innerRef.current;
          if (!isControlled && input) {
            // Uncontrolled inputs own their value, so clear it through the native setter and notify React.
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
            setter?.call(input, '');
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          input?.focus();
          onClear?.();
        }}
        className={cn(
          'rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer touch-manipulation flex items-center justify-center select-none',
          size === 'sm'
            ? 'relative size-7 min-w-[28px] min-h-[28px] after:absolute after:-inset-2 after:content-[\'\']'
            : 'relative size-8 min-w-[32px] min-h-[32px] after:absolute after:-inset-1.5 after:content-[\'\']'
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

    // Symmetrical icon inset balance: edge-to-icon gap equals icon-to-text gap
    const paddingClasses =
      size === 'sm'
        ? cn(
            hasLeading ? 'pl-10' : 'pl-3.5',
            hasTrailing ? (showClear || trailingAction ? 'pr-12' : 'pr-10') : 'pr-3.5'
          )
        : size === 'lg'
        ? cn(
            hasLeading ? 'pl-14' : 'pl-4.5',
            hasTrailing ? (showClear || trailingAction ? 'pr-16' : 'pr-14') : 'pr-4.5'
          )
        : cn(
            hasLeading ? 'pl-12' : 'pl-4',
            hasTrailing ? (showClear || trailingAction ? 'pr-14' : 'pr-12') : 'pr-4'
          );

    const inputClasses = cn(
      // Concentric radius & Base styling conforming to DESIGN.md
      'w-full rounded-lg bg-surface text-on-surface font-sans transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
      sizeClasses,
      paddingClasses,
      // 1px outline border with flush 2px focus ring and negative 1px offset (DESIGN.md line 379)
      'border border-outline hover:border-on-surface-variant/80',
      'focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
      '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:appearance-none',
      'placeholder:text-on-surface-variant/80',
      'disabled:bg-surface-container/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
      'data-[disabled]:bg-surface-container/30 data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
      'aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:outline-error',
      'data-[invalid]:border-error data-[invalid]:focus-visible:border-error data-[invalid]:focus-visible:outline-error',
      'user-invalid:border-error user-invalid:focus-visible:border-error user-invalid:focus-visible:outline-error',
      Boolean(error) && 'border-error focus-visible:border-error focus-visible:outline-error',
      className
    );

    const inputElement = (
      <BaseInput
        ref={mergedRef}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        data-slot="input"
        className={inputClasses}
        onChange={(e) => {
          if (!isControlled) setUncontrolledHasValue(e.target.value !== '');
          onChange?.(e);
        }}
        {...props}
      />
    );

    if (!hasLeading && !hasTrailing) {
      return inputElement;
    }

    return (
      <div className="relative flex items-center w-full" data-slot="input-wrapper" role="presentation">
        {leadingIcon && (
          <span
            className={cn(
              'text-on-surface-variant absolute flex items-center pointer-events-none select-none z-10',
              size === 'sm' ? 'left-3 text-lg' : size === 'lg' ? 'left-4 text-2xl' : 'left-3.5 text-xl'
            )}
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}
        {inputElement}
        {effectiveTrailing && (
          <span
            className={cn(
              'absolute flex items-center z-10',
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl',
              trailingAction || showClear
                ? 'right-2 text-on-surface'
                : size === 'sm'
                ? 'right-3 text-on-surface-variant pointer-events-none select-none'
                : size === 'lg'
                ? 'right-4 text-on-surface-variant pointer-events-none select-none'
                : 'right-3.5 text-on-surface-variant pointer-events-none select-none'
            )}
          >
            {effectiveTrailing}
          </span>
        )}
      </div>
    );
  }
);
InputComponent.displayName = 'Input';

// Compound Base UI exports
export const Input = Object.assign(InputComponent, {
  Root: BaseInput,
});

export const InputRoot = BaseInput;
export { BaseInput };
export default Input;
