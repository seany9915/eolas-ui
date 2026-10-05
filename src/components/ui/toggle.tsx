/**
 * Toggle primitive (@base-ui/react/toggle).
 *
 * Base UI Documentation: https://base-ui.com/react/components/toggle
 *
 * TAXONOMY & USAGE:
 * - Use Toggle for standalone two-state buttons (e.g. Star, Bookmark, Pin, Mute) using `aria-pressed`.
 * - For groups of mutually exclusive or multi-select toggles, use ToggleGroup instead.
 * - For form on/off switches that submit form values, use Switch instead.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   flush surface/primary active state, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';

export type ToggleVariant = 'default' | 'outline' | 'ghost' | 'subtle';
export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps<Value extends string = string>
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'value' | 'onPressedChange'> {
  value?: Value;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean, eventDetails: BaseToggle.ChangeEventDetails) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  ariaLabel?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<ToggleVariant, string> = {
  default: cn(
    'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container',
    'data-[pressed]:bg-primary data-[pressed]:text-on-primary data-[pressed]:border-primary data-[pressed]:shadow-ambient'
  ),
  outline: cn(
    'bg-transparent border border-outline text-on-surface hover:bg-surface-container/60',
    'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary data-[pressed]:shadow-ambient'
  ),
  ghost: cn(
    'bg-transparent border border-transparent text-on-surface hover:bg-surface-container',
    'data-[pressed]:bg-surface-variant data-[pressed]:text-on-surface data-[pressed]:font-semibold'
  ),
  subtle: cn(
    'bg-surface-container border border-transparent text-on-surface hover:bg-surface-variant',
    'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary/20'
  ),
};

const sizeStyles: Record<ToggleSize, string> = {
  sm: 'h-9 px-3 min-w-[36px] text-xs gap-1.5 rounded-sm',
  md: 'h-11 px-4 min-w-[44px] min-h-[44px] text-sm gap-2 rounded',
  lg: 'h-12 px-5 min-w-[48px] min-h-[48px] text-base gap-2.5 rounded-md',
};

const ToggleComponent = React.forwardRef<HTMLButtonElement, ToggleProps<any>>(
  (
    {
      pressed,
      defaultPressed,
      onPressedChange,
      variant = 'default',
      size = 'md',
      ariaLabel,
      'aria-label': ariaLabelProp,
      children,
      disabled = false,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const label = ariaLabel ?? ariaLabelProp;

    return (
      <BaseToggle
        ref={ref}
        value={value}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={onPressedChange}
        aria-label={label}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-label font-semibold cursor-pointer select-none',
          'transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
          'active:scale-[var(--scale-small)] motion-reduce:transform-none motion-reduce:transition-none',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </BaseToggle>
    );
  }
);
ToggleComponent.displayName = 'Toggle';

// Compound export mapping Base UI primitives
export const Toggle = Object.assign(ToggleComponent, {
  Root: BaseToggle,
});

export { BaseToggle };
export const ToggleRoot = BaseToggle;
export default Toggle;
