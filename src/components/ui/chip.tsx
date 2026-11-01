/**
 * Chip primitive.
 *
 * Built on Base UI (@base-ui/react) interaction foundations.
 *
 * TAXONOMY & USAGE:
 * - Use Chip for INTERACTIVE compact elements:
 *   1. Filter chips: Toggleable selection filters with keyboard navigation (aria-pressed).
 *   2. Input/Removable chips: Dismissible tags with accessible remove buttons (onRemove).
 *   3. Action chips: Clickable compact triggers (onClick).
 * - For PASSIVE, non-interactive status labels or counts, use Badge instead.
 * - Implements DESIGN.md High-Contrast Accessible standards:
 *   - Pattern 1 (filled): Solid brand fill + high-contrast text.
 *   - Pattern 2 (outline): 1px border in color role + neutral white surface fill + colored text.
 *   - Pattern 3 (soft): Soft container wash (bg-*-container) + dark neutral charcoal text (on-*-container).
 * - Full WCAG 2.2 SC 2.5.8 touch target compliance (expands to 44px when interactive or removable).
 * - Floating 2px focus ring (outline-offset: 2px) on keyboard focus.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '@/lib/utils';

export type ChipVariant =
  | 'filled'
  | 'outline'
  | 'soft'
  | 'tonal' // backwards-compatible alias for soft
  | 'outlined'; // backwards-compatible alias for outline

export type ChipColorRole =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'warning'
  | 'success'
  | 'neutral';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  variant?: ChipVariant;
  colorRole?: ChipColorRole;
  size?: ChipSize;
  icon?: string | React.ReactNode;
  avatar?: React.ReactNode;
  /** Whether the chip is selected (Filter mode). Renders with aria-pressed and active selection styling. */
  selected?: boolean;
  /** Callback invoked when the chip selection state changes (Filter mode) */
  onSelect?: (selected: boolean) => void;
  /** Callback invoked when the chip's dismiss button is clicked (Removable mode) */
  onRemove?: () => void;
  /** Disables interaction and reduces opacity */
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Pattern 1: High-Contrast Mixed Palette (Solid fill + on-color text) - High Emphasis
const filledStyles: Record<ChipColorRole, string> = {
  primary: 'bg-primary text-on-primary border border-primary',
  secondary: 'bg-secondary text-on-secondary border border-secondary',
  tertiary: 'bg-tertiary text-on-tertiary border border-tertiary',
  error: 'bg-error text-on-error border border-error',
  warning: 'bg-warning text-on-warning border border-warning',
  success: 'bg-success text-on-success border border-success',
  neutral: 'bg-neutral text-on-neutral border border-neutral',
};

// Pattern 2: Colored Outline + Neutral Surface Fill + Colored Text - Everyday Default
const outlineStyles: Record<ChipColorRole, string> = {
  primary: 'bg-surface text-primary border border-primary',
  secondary: 'bg-surface text-secondary border border-secondary',
  tertiary: 'bg-tertiary text-on-tertiary border border-tertiary', // solid fallback for Sunny Amber
  error: 'bg-surface text-error border border-error',
  warning: 'bg-surface text-warning border border-warning',
  success: 'bg-surface text-success border border-success',
  neutral: 'bg-surface text-on-surface border border-outline',
};

// Pattern 3: Soft Container Wash (bg-*-container + on-*-container) - Low/Medium Emphasis
const softStyles: Record<ChipColorRole, string> = {
  primary: 'bg-primary-container text-on-primary-container border border-transparent',
  secondary: 'bg-secondary-container text-on-secondary-container border border-transparent',
  tertiary: 'bg-tertiary-container text-on-tertiary-container border border-transparent',
  error: 'bg-error-container text-on-error-container border border-transparent',
  warning: 'bg-warning-container text-on-warning-container border border-transparent',
  success: 'bg-success-container text-on-success-container border border-transparent',
  neutral: 'bg-neutral-container text-on-neutral-container border border-transparent',
};

const sizeStyles: Record<ChipSize, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5 [&>svg]:size-3.5 [&>[data-icon]]:size-3.5 [&_.material-symbols-outlined]:!text-[15px] [&_.material-symbols-outlined]:!leading-none',
  md: 'h-8 px-3 text-xs gap-2 [&>svg]:size-4 [&>[data-icon]]:size-4 [&_.material-symbols-outlined]:!text-[17px] [&_.material-symbols-outlined]:!leading-none',
  lg: 'h-9 px-3.5 text-sm gap-2 [&>svg]:size-4.5 [&>[data-icon]]:size-4.5 [&_.material-symbols-outlined]:!text-[19px] [&_.material-symbols-outlined]:!leading-none',
};

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant = 'outline',
      colorRole = 'primary',
      size = 'md',
      icon,
      avatar,
      selected,
      onSelect,
      onRemove,
      disabled = false,
      onClick,
      onKeyDown,
      className,
      tabIndex,
      role,
      children,
      ...props
    },
    ref
  ) => {
    const normalizedVariant =
      variant === 'tonal' ? 'soft' : variant === 'outlined' ? 'outline' : variant;
    // Tertiary amber cannot outline on light backgrounds
    const resolvedVariant = colorRole === 'tertiary' && normalizedVariant === 'outline' ? 'filled' : normalizedVariant;

    const isInteractive = Boolean(onClick || onSelect || selected !== undefined);
    const isFilter = selected !== undefined || Boolean(onSelect);
    const isCurrentlySelected = Boolean(selected);

    let patternClass =
      resolvedVariant === 'filled'
        ? filledStyles[colorRole]
        : resolvedVariant === 'soft'
          ? softStyles[colorRole]
          : outlineStyles[colorRole];

    if (isCurrentlySelected) {
      patternClass = 'bg-primary-container text-on-primary-container border-2 border-primary font-bold';
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (onSelect) {
          onSelect(!selected);
        } else if (onClick) {
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
      onKeyDown?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (onSelect) {
        onSelect(!selected);
      }
      onClick?.(e);
    };

    // WCAG 2.2 SC 2.5.8: 44px min-h touch target floor when interactive or removable
    const touchTargetClass = isInteractive || onRemove
      ? 'min-h-[44px]'
      : size === 'lg'
        ? 'min-h-[40px]'
        : size === 'sm'
          ? 'min-h-[28px]'
          : 'min-h-[32px]';

    const labelText = typeof children === 'string' ? children : '';

    const resolvedRole = role ?? (isFilter ? 'button' : isInteractive ? 'button' : undefined);
    const resolvedTabIndex = tabIndex ?? (isInteractive && !disabled ? 0 : undefined);

    return (
      <div
        ref={ref}
        data-slot="chip"
        role={resolvedRole}
        aria-pressed={isFilter ? isCurrentlySelected : undefined}
        aria-disabled={disabled ? true : undefined}
        tabIndex={resolvedTabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center rounded-full font-label font-semibold select-none shrink-0 whitespace-nowrap',
          'transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
          '[&_.material-symbols-outlined]:leading-none [&_.material-symbols-outlined]:shrink-0',
          sizeStyles[size],
          touchTargetClass,
          patternClass,
          isInteractive && !disabled && 'cursor-pointer hover:brightness-95 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
          className
        )}
        {...props}
      >
        {avatar && <span className="shrink-0 -ml-1 mr-1">{avatar}</span>}
        {isCurrentlySelected && (
          <span className="material-symbols-outlined shrink-0 font-bold -ml-0.5" aria-hidden="true">
            check
          </span>
        )}
        {!isCurrentlySelected && icon && (
          typeof icon === 'string' ? (
            <span className="material-symbols-outlined shrink-0 -ml-0.5" aria-hidden="true">
              {icon}
            </span>
          ) : (
            <span className="inline-flex items-center shrink-0 -ml-0.5">{icon}</span>
          )
        )}
        <span className="truncate">{children}</span>
        {onRemove && (
          <BaseButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onRemove();
            }}
            disabled={disabled}
            className="ml-1 -mr-1 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer touch-manipulation inline-flex items-center justify-center p-0.5 rounded-full text-current shrink-0"
            aria-label={labelText ? `Remove ${labelText}` : 'Remove'}
          >
            <span className="material-symbols-outlined text-[14px] leading-none font-bold" aria-hidden="true">
              close
            </span>
          </BaseButton>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';

export default Chip;
