'use client';

/**
 * Button primitive (@base-ui/react/button).
 *
 * Base UI Documentation: https://base-ui.com/react/components/button
 *
 * TAXONOMY & USAGE:
 * - Use Button for triggering immediate page/dialog actions, form submits, or opening popups.
 * - Do NOT use Button for on/off toggles with persistent state (use Toggle instead).
 * - Do NOT use Button for in-page panel navigation (use Tabs instead).
 * - Follows DESIGN.md Tier B interactive controls: concentric radius (rounded 8px / 0.5rem),
 *   floating 2px focus ring, active micro-motion scaling, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 * - Never uses Sunny Amber (tertiary) text on light surfaces without dark container background.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

export type ButtonVariant =
  | 'filled'
  | 'outline'
  | 'text'
  | 'soft'
  | 'ghost'
  | 'default'
  | 'unstyled'
  /** @deprecated Use `'outline'` instead. Kept for backwards compatibility. */
  | 'outlined'
  /** @deprecated Use `'soft'` instead. Kept for backwards compatibility. */
  | 'tonal';

export type ButtonColorRole =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'warning'
  | 'success'
  | 'neutral';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'color'> {
  /** Button style variant. Prefer `'filled' | 'outline' | 'soft' | 'text'`; `'outlined'` and `'tonal'` are deprecated aliases. */
  variant?: ButtonVariant;
  colorRole?: ButtonColorRole;
  /** Button form type. Unlike native HTML buttons, Base UI defaults to 'button' rather than 'submit'. */
  type?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;
  loading?: boolean;
  /**
   * When true, expands the hit target to at least 44x44px using an invisible pseudo-element
   * without increasing the visual footprint of compact buttons.
   * Platform Reference: Good CSS #27 (WCAG 2.2 SC 2.5.8).
   */
  expandedTouchTarget?: boolean;
  /** ID of the target element to invoke declaratively via the HTML Invoker Commands API */
  commandfor?: string;
  /** Command to dispatch to the target element (built-in like 'show-modal' or custom '--action') */
  command?: string;
  children?: React.ReactNode;
}

const baseStyles = cn(
  'inline-flex items-center justify-center gap-2 font-label text-sm font-semibold rounded cursor-pointer select-none touch-manipulation shrink-0 whitespace-nowrap',
  '[&_svg:not([class*="size-"])]:size-4 [&_[data-icon=inline-start]]:-ms-0.5 [&_[data-icon=inline-end]]:-me-0.5',
  'transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
  'motion-reduce:active:scale-100 motion-reduce:transition-none',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary inverted:focus-visible:outline-on-neutral',
  'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:active:scale-100'
);

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-11 px-3.5 min-h-[44px] has-[>.material-symbols-outlined:first-child:not(:only-child)]:ps-3 has-[>svg:first-child:not(:only-child)]:ps-3 has-[>.material-symbols-outlined:last-child:not(:only-child)]:pe-3 has-[>svg:last-child:not(:only-child)]:pe-3', // Compact floor 44px; optical -2px on icon side
  md: 'h-12 px-5 min-h-[48px] has-[>.material-symbols-outlined:first-child:not(:only-child)]:ps-4 has-[>svg:first-child:not(:only-child)]:ps-4 has-[>.material-symbols-outlined:last-child:not(:only-child)]:pe-4 has-[>svg:last-child:not(:only-child)]:pe-4', // Button standard floor 48px; optical -4px on icon side
  lg: 'h-14 px-6 min-h-[56px] has-[>.material-symbols-outlined:first-child:not(:only-child)]:ps-5 has-[>svg:first-child:not(:only-child)]:ps-5 has-[>.material-symbols-outlined:last-child:not(:only-child)]:pe-5 has-[>svg:last-child:not(:only-child)]:pe-5', // Prominent hero floor 56px; optical -4px on icon side
  icon: 'size-11 min-h-[44px] min-w-[44px] p-0 shrink-0 inline-flex items-center justify-center',
};

const filledStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-primary text-on-primary hover:brightness-95 active:brightness-90',
  secondary: 'bg-secondary text-on-secondary hover:brightness-95 active:brightness-90',
  tertiary: 'bg-tertiary text-on-tertiary hover:brightness-95 active:brightness-90', // Charcoal text on Sunny Amber
  error: 'bg-error text-on-error hover:brightness-95 active:brightness-90',
  warning: 'bg-warning text-on-warning hover:brightness-95 active:brightness-90',
  success: 'bg-success text-on-success hover:brightness-95 active:brightness-90',
  neutral: 'bg-neutral text-on-neutral hover:brightness-95 active:brightness-90',
};

const softStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-primary-container text-on-primary-container hover:brightness-95 active:brightness-90',
  secondary: 'bg-secondary-container text-on-secondary-container hover:brightness-95 active:brightness-90',
  tertiary: 'bg-tertiary-container text-on-tertiary-container hover:brightness-95 active:brightness-90',
  error: 'bg-error-container text-on-error-container hover:brightness-95 active:brightness-90',
  warning: 'bg-warning-container text-on-warning-container hover:brightness-95 active:brightness-90',
  success: 'bg-success-container text-on-success-container hover:brightness-95 active:brightness-90',
  neutral: 'bg-neutral-container text-on-neutral-container hover:brightness-95 active:brightness-90',
};

const outlinedStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-surface text-primary border-2 border-primary hover:bg-state-hover inverted:bg-transparent inverted:text-primary-container inverted:border-primary-container inverted:hover:bg-primary-container/15',
  secondary: 'bg-surface text-secondary border-2 border-secondary hover:bg-secondary-container/30 inverted:bg-transparent inverted:text-secondary-container inverted:border-secondary-container inverted:hover:bg-secondary-container/15',
  tertiary: 'bg-tertiary text-on-tertiary border-2 border-tertiary inverted:bg-transparent inverted:text-tertiary inverted:border-tertiary inverted:hover:bg-tertiary/15', // solid amber fallback on light surfaces; true outline on dark inverted surfaces
  error: 'bg-surface text-error border-2 border-error hover:bg-error-container/20 inverted:bg-transparent inverted:text-error-container inverted:border-error-container inverted:hover:bg-error-container/15',
  warning: 'bg-surface text-warning border-2 border-warning hover:bg-warning-container/20 inverted:bg-transparent inverted:text-warning-container inverted:border-warning-container inverted:hover:bg-warning-container/15',
  success: 'bg-surface text-success border-2 border-success hover:bg-success-container/20 inverted:bg-transparent inverted:text-success-container inverted:border-success-container inverted:hover:bg-success-container/15',
  neutral: 'bg-surface text-on-surface border-2 border-outline hover:bg-state-hover inverted:bg-transparent inverted:text-on-neutral inverted:border-outline-variant inverted:hover:bg-surface/10',
};

const textStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-transparent text-primary hover:bg-primary-container/30 inverted:text-primary-container inverted:hover:bg-primary-container/15',
  secondary: 'bg-transparent text-secondary hover:bg-secondary-container/30 inverted:text-secondary-container inverted:hover:bg-secondary-container/15',
  tertiary: 'bg-tertiary-container text-on-tertiary-container hover:brightness-95 active:brightness-90 inverted:bg-transparent inverted:text-tertiary inverted:hover:bg-tertiary/15', // container pill fallback on light surfaces; amber text on dark inverted surfaces
  error: 'bg-transparent text-error hover:bg-error-container/30 inverted:text-error-container inverted:hover:bg-error-container/15',
  warning: 'bg-transparent text-warning hover:bg-warning-container/30 inverted:text-warning-container inverted:hover:bg-warning-container/15',
  success: 'bg-transparent text-success hover:bg-success-container/30 inverted:text-success-container inverted:hover:bg-success-container/15',
  neutral: 'bg-transparent text-on-surface hover:bg-state-hover inverted:text-on-neutral inverted:hover:bg-surface/10',
};

export interface ButtonVariantsProps {
  variant?: ButtonVariant;
  colorRole?: ButtonColorRole;
  size?: ButtonSize;
  expandedTouchTarget?: boolean;
  className?: string;
}

export function buttonVariants({
  variant = 'filled',
  colorRole = 'primary',
  size = 'md',
  expandedTouchTarget = false,
  className,
}: ButtonVariantsProps = {}): string {
  const normalizedVariant =
    variant === 'outline' || variant === 'outlined'
      ? 'outline'
      : variant === 'ghost'
        ? 'text'
        : variant === 'default'
          ? 'filled'
          : variant === 'soft' || variant === 'tonal'
            ? 'soft'
            : variant;

  if (normalizedVariant === 'unstyled') {
    return cn(
      'cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      expandedTouchTarget && 'touch-target-expanded',
      className
    );
  }

  const variantClass =
    normalizedVariant === 'filled'
      ? filledStyles[colorRole]
      : normalizedVariant === 'soft'
        ? softStyles[colorRole]
        : normalizedVariant === 'outline'
          ? outlinedStyles[colorRole]
          : textStyles[colorRole];

  return cn(
    baseStyles,
    sizeStyles[size] || sizeStyles.md,
    normalizedVariant !== 'text' && (size === 'icon' ? 'active:scale-[var(--scale-large)]' : 'active:scale-[var(--scale-small)]'),
    variantClass,
    expandedTouchTarget && 'touch-target-expanded',
    className
  );
}

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      colorRole,
      type,
      size = 'md',
      expandedTouchTarget,
      className,
      children,
      disabled,
      focusableWhenDisabled,
      nativeButton,
      render,
      loading = false,
      ...props
    },
    ref
  ) => {
    const isActuallyDisabled = disabled || loading;
    const isFocusableWhenDisabled =
      focusableWhenDisabled ?? (loading ? true : undefined);
    const resolvedNativeButton = resolveNativeButton(render, nativeButton);
    const resolvedType = type ?? (resolvedNativeButton === false ? undefined : 'button');

    return (
      <BaseButton
        ref={ref}
        data-slot="button"
        {...(resolvedType !== undefined ? { type: resolvedType } : {})}
        disabled={isActuallyDisabled}
        focusableWhenDisabled={isFocusableWhenDisabled}
        nativeButton={resolvedNativeButton}
        render={render}
        aria-busy={loading ? true : undefined}
        className={composeClassName(
          buttonVariants({
            variant,
            colorRole,
            size,
            expandedTouchTarget,
            className: loading && size === 'icon' ? 'relative' : undefined,
          }),
          className
        )}
        {...props}
      >
        {loading && size === 'icon' ? (
          <>
            <span className="opacity-0 inline-flex items-center justify-center">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="material-symbols-outlined motion-safe:animate-spin motion-reduce:animate-pulse text-base shrink-0">
                progress_activity
              </span>
            </span>
          </>
        ) : (
          <>
            {loading && (
              <span
                className="material-symbols-outlined motion-safe:animate-spin motion-reduce:animate-pulse text-base shrink-0"
                aria-hidden="true"
              >
                progress_activity
              </span>
            )}
            {children}
          </>
        )}
      </BaseButton>
    );
  }
);
ButtonComponent.displayName = 'Button';

export interface UnstyledButtonProps extends ButtonProps {}

/**
 * UnstyledButton
 *
 * Lightweight semantic button primitive wrapping Base UI's BaseButton.
 * Provides accessible keyboard focus ring and interaction states without
 * enforcing height, padding, or background chrome.
 * Ideal for stretched-link card triggers, table column headers, and custom row actions.
 */
export const UnstyledButton = React.forwardRef<HTMLButtonElement, UnstyledButtonProps>(
  ({ variant = 'unstyled', ...props }, ref) => {
    return <ButtonComponent ref={ref} variant={variant} {...props} />;
  }
);
UnstyledButton.displayName = 'UnstyledButton';

// Compound export mapping Base UI primitives
export const Button = Object.assign(ButtonComponent, {
  Root: BaseButton,
  Unstyled: UnstyledButton,
});

// Re-export Base UI primitives for compound composition
export { BaseButton };
export const ButtonRoot = BaseButton;
export default Button;
