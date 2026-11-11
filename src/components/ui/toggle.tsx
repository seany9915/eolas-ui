/**
 * Toggle primitive (@base-ui/react/toggle).
 *
 * Base UI Documentation: https://base-ui.com/react/components/toggle
 *
 * TAXONOMY & USAGE:
 * - Use Toggle for standalone two-state buttons (e.g. Star, Bookmark, Pin, Mute) using `aria-pressed`.
 * - For groups of mutually exclusive or multi-select toggles, use ToggleGroup instead.
 * - For form on/off switches that submit form values, use Switch instead.
 * - Follows DESIGN.md Tier B interactive controls: floating 2px focus ring,
 *   2px `outline` resting border -> 2px `primary` border + `primary-container` pressed state,
 *   zero box-shadow, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
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
    'bg-surface border-2 border-outline text-on-surface hover:bg-surface-container/70',
    'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary'
  ),
  outline: cn(
    'bg-transparent border-2 border-outline text-on-surface hover:bg-surface-container/60',
    'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary'
  ),
  ghost: cn(
    'bg-transparent border-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary'
  ),
  subtle: cn(
    'bg-surface border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container/40 hover:text-on-surface hover:border-outline',
    'data-[pressed]:bg-surface-container data-[pressed]:text-on-surface data-[pressed]:border-outline'
  ),
};

const sizeStyles: Record<ToggleSize, string> = {
  sm: 'h-11 px-3.5 min-w-[44px] min-h-[44px] text-xs gap-1.5 rounded-sm',
  md: 'h-12 px-4.5 min-w-[48px] min-h-[48px] text-sm gap-2 rounded',
  lg: 'h-14 px-6 min-w-[56px] min-h-[56px] text-base gap-2.5 rounded-md',
};

const ToggleComponent = React.forwardRef<HTMLButtonElement, ToggleProps<string>>(
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
        className={(state) =>
          cn(
            'inline-flex items-center justify-center font-label font-semibold cursor-pointer select-none',
            'transition-[color,background-color,border-color,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
            'active:scale-[var(--scale-small)] motion-reduce:transform-none motion-reduce:transition-none',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
            'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
            variantStyles[variant],
            sizeStyles[size],
            typeof className === 'function' ? className(state) : className
          )
        }
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
export const TogglePrimitive = BaseToggle;
export default Toggle;
