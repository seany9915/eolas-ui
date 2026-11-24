'use client';

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
 *   For wrapped multi-row interactive chip groups, use `gap-y-3` (12px) or `gap-y-4` (16px) so expanded vertical hit areas do not overlap.
 * - Floating 2px focus ring (outline-offset: 2px) on keyboard focus.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn, composeClassName } from '@/lib/utils';
import { getContrastInk } from '@/lib/contrast';

export type ChipVariant =
  | 'filled'
  | 'outline'
  | 'soft'
  /** @deprecated Use `'soft'` instead. Kept for backwards compatibility. */
  | 'tonal'
  /** @deprecated Use `'outline'` instead. Kept for backwards compatibility. */
  | 'outlined';

export type ChipColorRole =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'warning'
  | 'success'
  | 'neutral';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'className'> {
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
  /** Accessible name for the remove button. Defaults to "Remove <text>" when children is a string. */
  removeLabel?: string;
  /** Disables interaction and reduces opacity */
  disabled?: boolean;
  /** Optional user-supplied background color for dynamic tags; computes accessible foreground contrast automatically. */
  customColor?: string;
  className?: string | ((state: BaseButton.State) => string | undefined);
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

export const Chip = React.forwardRef<HTMLElement, ChipProps>(
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
      removeLabel,
      disabled = false,
      customColor,
      onClick,
      onKeyDown,
      className,
      style,
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
      patternClass = cn(filledStyles[colorRole], 'font-semibold');
    }

    const hasSeparateTriggerAndRemove = isInteractive && Boolean(onRemove);

    const handleInteractiveClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (disabled) return;
      if (onSelect) {
        onSelect(!selected);
      }
      onClick?.(e);
    };

    // Separate compact visual pill height from vertical touch-target expansion (no horizontal sibling overlap)
    const touchTargetClass = isInteractive
      ? 'relative after:absolute after:-inset-y-2 after:inset-x-0 after:content-[\'\']'
      : '';

    const labelText = typeof children === 'string' ? children : '';

    const dynamicStyle:
      | (React.CSSProperties & { '--dynamic-bg'?: string; '--chip-ink'?: string })
      | undefined = customColor
      ? {
          '--dynamic-bg': customColor,
          '--chip-ink': getContrastInk(customColor),
          backgroundColor: customColor,
          borderColor: customColor,
          ...style,
        }
      : style;

    const isPrimitiveChildren = React.Children.toArray(children).every(
      (child) => typeof child === 'string' || typeof child === 'number'
    );

    const leadingMedia = (
      <>
        {avatar && <span className="shrink-0 -ms-1 me-1">{avatar}</span>}
        {isCurrentlySelected && (
          <span className="material-symbols-outlined shrink-0 font-bold -ms-0.5" aria-hidden="true">
            check
          </span>
        )}
        {!isCurrentlySelected && icon && (
          typeof icon === 'string' ? (
            <span className="material-symbols-outlined shrink-0 -ms-0.5" aria-hidden="true">
              {icon}
            </span>
          ) : (
            <span className="inline-flex items-center shrink-0 -ms-0.5">{icon}</span>
          )
        )}
        {isPrimitiveChildren ? (
          <span className="truncate">{children}</span>
        ) : (
          <span className="inline-flex items-center gap-1 min-w-0">{children}</span>
        )}
      </>
    );

    const { 'aria-label': ariaLabel, ...containerProps } = props;

    const sharedBaseClasses = cn(
      'inline-flex items-center max-w-full rounded-full font-label font-semibold select-none shrink-0 whitespace-nowrap',
      'transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
      '[&_.material-symbols-outlined]:leading-none [&_.material-symbols-outlined]:shrink-0',
      sizeStyles[size],
      touchTargetClass,
      patternClass,
      customColor && 'contrast-auto'
    );

    const resolvedStaticClassName =
      typeof className === 'function' ? className({ disabled }) : className;

    if (hasSeparateTriggerAndRemove) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-slot="chip"
          role={role}
          aria-disabled={disabled ? true : undefined}
          onClick={(e) => {
            if (!disabled) onClick?.(e);
          }}
          onKeyDown={onKeyDown}
          style={dynamicStyle}
          className={cn(
            sharedBaseClasses,
            !disabled && 'hover:brightness-95',
            disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
            resolvedStaticClassName
          )}
          {...containerProps}
        >
          <BaseButton
            type="button"
            disabled={disabled}
            aria-label={ariaLabel}
            aria-pressed={isFilter ? isCurrentlySelected : undefined}
            tabIndex={tabIndex}
            onClick={() => {
              if (!disabled && onSelect) {
                onSelect(!selected);
              }
            }}
            className="inline-flex items-center gap-[inherit] min-w-0 bg-transparent border-0 p-0 text-current cursor-pointer rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {leadingMedia}
          </BaseButton>
          {onRemove && (
            <BaseButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onRemove();
              }}
              disabled={disabled}
              className="relative ms-0.5 -me-1.5 size-6 min-w-[24px] min-h-[24px] hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer touch-manipulation inline-flex items-center justify-center rounded-full text-current shrink-0 after:absolute after:-inset-y-2.5 after:inset-x-0 after:content-['']"
              aria-label={removeLabel ?? (labelText ? `Remove ${labelText}` : 'Remove')}
            >
              <span className="material-symbols-outlined text-[14px] leading-none font-bold" aria-hidden="true">
                close
              </span>
            </BaseButton>
          )}
        </div>
      );
    }

    if (isInteractive) {
      return (
        <BaseButton
          ref={ref}
          type="button"
          data-slot="chip"
          {...(role !== undefined ? { role } : {})}
          aria-label={ariaLabel}
          aria-pressed={isFilter ? isCurrentlySelected : undefined}
          disabled={disabled}
          tabIndex={tabIndex}
          onClick={handleInteractiveClick}
          onKeyDown={onKeyDown}
          style={dynamicStyle}
          className={composeClassName(
            cn(
              sharedBaseClasses,
              !disabled &&
                'cursor-pointer hover:brightness-95 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
            ),
            className
          )}
          {...(containerProps as React.ComponentPropsWithoutRef<typeof BaseButton>)}
        >
          {leadingMedia}
        </BaseButton>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="chip"
        role={role}
        aria-label={ariaLabel}
        aria-disabled={disabled ? true : undefined}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        style={dynamicStyle}
        className={cn(
          sharedBaseClasses,
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
          resolvedStaticClassName
        )}
        {...containerProps}
      >
        {leadingMedia}
        {onRemove && (
          <BaseButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onRemove();
            }}
            disabled={disabled}
            className="relative ms-0.5 -me-1.5 size-6 min-w-[24px] min-h-[24px] hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer touch-manipulation inline-flex items-center justify-center rounded-full text-current shrink-0 after:absolute after:-inset-y-2.5 after:inset-x-0 after:content-['']"
            aria-label={removeLabel ?? (labelText ? `Remove ${labelText}` : 'Remove')}
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
