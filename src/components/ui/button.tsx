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
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'filled'
  | 'outlined'
  | 'text'
  | 'outline'
  | 'ghost'
  | 'tonal'
  | 'secondary'
  | 'default'
  | 'unstyled';

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
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'color' | 'className'> {
  className?: string;
  variant?: ButtonVariant;
  /** Legacy alias for `variant` */
  emphasis?: ButtonVariant;
  colorRole?: ButtonColorRole;
  /** Legacy alias for `colorRole`. If matching a color role name, mapped safely to avoid polluting DOM ARIA role. */
  role?: string;
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
  'transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
  'active:scale-[var(--scale-large)] motion-reduce:active:scale-100 motion-reduce:transition-none',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:active:scale-100'
);

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-11 px-3.5 min-h-[44px]', // Compact floor 44px (matches Input/Select sm)
  md: 'h-12 px-5 min-h-[48px]', // Button standard floor 48px (matches Input/Select md)
  lg: 'h-14 px-6 min-h-[56px]', // Prominent hero floor 56px (matches Input/Select lg)
  icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0 shrink-0 inline-flex items-center justify-center',
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

const tonalStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-primary-container text-on-primary-container hover:brightness-95 active:brightness-90',
  secondary: 'bg-secondary-container text-on-secondary-container hover:brightness-95 active:brightness-90',
  tertiary: 'bg-tertiary text-on-tertiary',
  error: 'bg-error-container text-on-error-container hover:brightness-95 active:brightness-90',
  warning: 'bg-warning-container text-on-warning-container hover:brightness-95 active:brightness-90',
  success: 'bg-success-container text-on-success-container hover:brightness-95 active:brightness-90',
  neutral: 'bg-neutral-container text-on-neutral-container hover:brightness-95 active:brightness-90',
};

const outlinedStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-surface text-primary border-2 border-primary hover:bg-surface-container',
  secondary: 'bg-surface text-secondary border-2 border-secondary hover:bg-secondary-container/30',
  tertiary: 'bg-tertiary text-on-tertiary border-2 border-tertiary', // forced fallback to filled for contrast
  error: 'bg-surface text-error border-2 border-error hover:bg-error-container/20',
  warning: 'bg-surface text-warning border-2 border-warning hover:bg-warning-container/20',
  success: 'bg-surface text-success border-2 border-success hover:bg-success-container/20',
  neutral: 'bg-surface text-on-surface border-2 border-outline hover:bg-surface-container',
};

const textStyles: Record<ButtonColorRole, string> = {
  primary: 'bg-transparent text-primary hover:bg-primary-container/30',
  secondary: 'bg-transparent text-secondary hover:bg-secondary-container/30',
  tertiary: 'bg-tertiary text-on-tertiary', // forced fallback to filled for contrast
  error: 'bg-transparent text-error hover:bg-error-container/30',
  warning: 'bg-transparent text-warning hover:bg-warning-container/30',
  success: 'bg-transparent text-success hover:bg-success-container/30',
  neutral: 'bg-transparent text-on-surface hover:bg-surface-container',
};

export interface ButtonVariantsProps {
  variant?: ButtonVariant;
  emphasis?: ButtonVariant;
  colorRole?: ButtonColorRole;
  role?: string;
  size?: ButtonSize;
  expandedTouchTarget?: boolean;
  className?: string;
}

export function buttonVariants({
  variant,
  emphasis,
  colorRole,
  role,
  size = 'md',
  expandedTouchTarget = false,
  className,
}: ButtonVariantsProps = {}): string {
  const rawVariant = variant ?? emphasis ?? 'filled';
  const normalizedVariant =
    rawVariant === 'outline'
      ? 'outlined'
      : rawVariant === 'ghost'
        ? 'text'
        : rawVariant === 'default'
          ? 'filled'
          : rawVariant;

  if (normalizedVariant === 'unstyled') {
    return cn(
      'cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      expandedTouchTarget && 'touch-target-expanded',
      className
    );
  }

  const validColorRoles: ButtonColorRole[] = [
    'primary',
    'secondary',
    'tertiary',
    'error',
    'warning',
    'success',
    'neutral',
  ];

  let resolvedColorRole: ButtonColorRole = colorRole ?? 'primary';
  if (rawVariant === 'secondary') {
    resolvedColorRole = 'secondary';
  }

  if (role && (validColorRoles as string[]).includes(role)) {
    resolvedColorRole = role as ButtonColorRole;
  }

  // Ensure Sunny Amber (tertiary) always uses high-contrast filled container
  const safeVariant =
    resolvedColorRole === 'tertiary' && normalizedVariant !== 'filled'
      ? 'filled'
      : normalizedVariant;

  const variantClass =
    safeVariant === 'filled'
      ? filledStyles[resolvedColorRole]
      : safeVariant === 'tonal'
        ? tonalStyles[resolvedColorRole]
        : safeVariant === 'outlined'
          ? outlinedStyles[resolvedColorRole]
          : textStyles[resolvedColorRole];

  return cn(
    baseStyles,
    sizeStyles[size] || sizeStyles.md,
    variantClass,
    expandedTouchTarget && 'touch-target-expanded',
    className
  );
}

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      emphasis,
      colorRole,
      role,
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
    const validColorRoles = [
      'primary',
      'secondary',
      'tertiary',
      'error',
      'warning',
      'success',
      'neutral',
    ];
    let domRole: string | undefined = undefined;

    if (role && !validColorRoles.includes(role)) {
      domRole = role; // valid ARIA role like 'tab', 'switch', etc.
    }

    const isActuallyDisabled = disabled || loading;
    const isFocusableWhenDisabled =
      focusableWhenDisabled ?? (loading ? true : undefined);

    return (
      <BaseButton
        ref={ref}
        disabled={isActuallyDisabled}
        focusableWhenDisabled={isFocusableWhenDisabled}
        nativeButton={nativeButton}
        render={render}
        role={domRole}
        aria-busy={loading ? true : undefined}
        className={buttonVariants({
          variant,
          emphasis,
          colorRole,
          role,
          size,
          expandedTouchTarget,
          className,
        })}
        {...props}
      >
        {loading && (
          <span
            className="material-symbols-outlined animate-spin text-base shrink-0"
            aria-hidden="true"
          >
            progress_activity
          </span>
        )}
        {size === 'icon' && loading ? null : children}
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
