import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'outline' | 'ghost' | 'tonal' | 'secondary' | 'default';
  /** Legacy alias for `variant` */
  emphasis?: 'filled' | 'outlined' | 'text' | 'outline' | 'ghost' | 'tonal' | 'secondary' | 'default';
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'neutral';
  /** Legacy alias for `colorRole`. If matching a color role name, mapped safely to avoid polluting DOM ARIA role. */
  role?: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  focusableWhenDisabled?: boolean;
  nativeButton?: boolean;
  render?: BaseButton.Props['render'];
  children?: React.ReactNode;
}

const baseStyles = 'inline-flex items-center justify-center font-label text-sm font-semibold rounded-[0.5rem] transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

const sizeStyles = {
  sm: 'h-9 px-3 min-h-[44px]', // min touch target
  md: 'h-12 px-5 min-h-[48px]', // button standard floor 48px
  lg: 'h-14 px-6 min-h-[56px]',
  icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0 shrink-0 inline-flex items-center justify-center',
};

const filledStyles = {
  primary: 'bg-primary text-on-primary hover:brightness-95 active:brightness-90',
  secondary: 'bg-secondary text-on-secondary hover:brightness-95 active:brightness-90',
  tertiary: 'bg-tertiary text-on-tertiary hover:brightness-95 active:brightness-90', // Charcoal text on Sunny Amber
  error: 'bg-error text-on-error hover:brightness-95 active:brightness-90',
  warning: 'bg-warning text-on-warning hover:brightness-95 active:brightness-90',
  success: 'bg-success text-on-success hover:brightness-95 active:brightness-90',
  neutral: 'bg-neutral text-on-neutral hover:brightness-95 active:brightness-90',
};

const tonalStyles = {
  primary: 'bg-primary-container text-on-primary-container hover:brightness-95 active:brightness-90',
  secondary: 'bg-secondary-container text-on-secondary-container hover:brightness-95 active:brightness-90',
  tertiary: 'bg-tertiary text-on-tertiary',
  error: 'bg-error-container text-on-error-container hover:brightness-95 active:brightness-90',
  warning: 'bg-warning-container text-on-warning-container hover:brightness-95 active:brightness-90',
  success: 'bg-success-container text-on-success-container hover:brightness-95 active:brightness-90',
  neutral: 'bg-neutral-container text-on-neutral-container hover:brightness-95 active:brightness-90',
};

const outlinedStyles = {
  primary: 'bg-surface text-primary border-[2px] border-primary hover:bg-surface-container',
  secondary: 'bg-surface text-secondary border-[2px] border-secondary hover:bg-secondary-container/30',
  tertiary: 'bg-tertiary text-on-tertiary border-[2px] border-tertiary', // forced fallback to filled
  error: 'bg-surface text-error border-[2px] border-error hover:bg-error-container/20',
  warning: 'bg-surface text-warning border-[2px] border-warning hover:bg-warning-container/20',
  success: 'bg-surface text-success border-[2px] border-success hover:bg-success-container/20',
  neutral: 'bg-surface text-on-surface border-[2px] border-outline hover:bg-surface-container',
};

const textStyles = {
  primary: 'bg-transparent text-primary hover:bg-primary-container/30',
  secondary: 'bg-transparent text-secondary hover:bg-secondary-container/30',
  tertiary: 'bg-tertiary text-on-tertiary', // forced fallback to filled
  error: 'bg-transparent text-error hover:bg-error-container/30',
  warning: 'bg-transparent text-warning hover:bg-warning-container/30',
  success: 'bg-transparent text-success hover:bg-success-container/30',
  neutral: 'bg-transparent text-on-surface hover:bg-surface-container',
};

export interface ButtonVariantsProps {
  variant?: 'filled' | 'outlined' | 'text' | 'outline' | 'ghost' | 'tonal' | 'secondary' | 'default';
  emphasis?: 'filled' | 'outlined' | 'text' | 'outline' | 'ghost' | 'tonal' | 'secondary' | 'default';
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'neutral';
  role?: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export function buttonVariants({
  variant,
  emphasis,
  colorRole,
  role,
  size = 'md',
  className,
}: ButtonVariantsProps = {}): string {
  const rawVariant = variant ?? emphasis ?? 'filled';
  const normalizedVariant = rawVariant === 'outline' ? 'outlined' : (rawVariant === 'ghost' ? 'text' : (rawVariant === 'default' ? 'filled' : rawVariant));
  const validColorRoles = ['primary', 'secondary', 'tertiary', 'error', 'warning', 'success', 'neutral'];
  
  let resolvedColorRole: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'neutral' = colorRole ?? 'primary';
  if (rawVariant === 'secondary') {
    resolvedColorRole = 'secondary';
  }

  if (role && validColorRoles.includes(role)) {
    resolvedColorRole = role as any;
  }

  const safeVariant = (resolvedColorRole === 'tertiary' && normalizedVariant !== 'filled') ? 'filled' : normalizedVariant;

  const variantClass = safeVariant === 'filled' 
    ? filledStyles[resolvedColorRole] 
    : safeVariant === 'tonal'
      ? tonalStyles[resolvedColorRole]
      : safeVariant === 'outlined' 
        ? outlinedStyles[resolvedColorRole] 
        : textStyles[resolvedColorRole];

  return cn(baseStyles, sizeStyles[size] || sizeStyles.md, variantClass, className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant,
  emphasis,
  colorRole,
  role,
  size = 'md',
  className,
  children,
  disabled,
  focusableWhenDisabled,
  nativeButton,
  render,
  ...props
}, ref) => {
  const validColorRoles = ['primary', 'secondary', 'tertiary', 'error', 'warning', 'success', 'neutral'];
  let domRole: string | undefined = undefined;

  if (role && !validColorRoles.includes(role)) {
    domRole = role; // valid ARIA role like 'tab', 'switch', etc.
  }

  return (
    <BaseButton
      ref={ref}
      disabled={disabled}
      focusableWhenDisabled={focusableWhenDisabled}
      nativeButton={nativeButton}
      render={render}
      role={domRole}
      className={buttonVariants({ variant, emphasis, colorRole, role, size, className })}
      {...props}
    >
      {children}
    </BaseButton>
  );
});

Button.displayName = 'Button';

// Compound Base UI exports
export { BaseButton };
export const ButtonRoot = BaseButton;

