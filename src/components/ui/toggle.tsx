/**
 * Toggle primitive (@base-ui/react/toggle).
 *
 * TAXONOMY & USAGE:
 * - Use Toggle for standalone two-state buttons (e.g. Star, Bookmark, Pin, Mute) using `aria-pressed`.
 * - For groups of mutually exclusive or multi-select toggles, use ToggleGroup instead.
 * - For form on/off switches that submit form values, use Switch instead.
 * - Uses `rounded` (0.5rem / 8px) per DESIGN.md Tier B interactive controls.
 */
import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'children'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  ariaLabel?: string;
  'aria-label'?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  value?: string;
}

const ToggleComponent = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed,
      defaultPressed,
      onPressedChange,
      ariaLabel,
      'aria-label': ariaLabelProp,
      children,
      disabled,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const label = ariaLabel ?? ariaLabelProp ?? 'Toggle';
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
          'inline-flex items-center justify-center h-12 px-4 min-h-[48px] rounded font-label text-sm font-semibold transition-colors cursor-pointer select-none',
          'border-[1px] border-outline bg-surface text-on-surface hover:bg-surface-container',
          'data-[pressed]:bg-primary data-[pressed]:border-primary data-[pressed]:text-on-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
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
