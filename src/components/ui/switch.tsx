'use client';

/**
 * Switch primitive (@base-ui/react/switch).
 *
 * Base UI Documentation: https://base-ui.com/react/components/switch
 *
 * TAXONOMY & USAGE:
 * - Use Switch for standalone binary settings that take effect immediately (e.g. Dark Mode, Notifications).
 * - Do NOT use Switch for in-group option selections (use Checkbox or ToggleGroup instead).
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   flush primary track fill, smooth thumb sliding, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { Icon } from './icon';
import { cn, composeClassName } from '@/lib/utils';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'onChange'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean | string;
  size?: SwitchSize;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const sizeConfig: Record<
  SwitchSize,
  { track: string; thumb: string; translate: string }
> = {
  sm: {
    track: 'w-9 h-5 p-0.5',
    thumb: 'size-4',
    translate: 'data-[checked]:translate-x-4 rtl:data-[checked]:-translate-x-4',
  },
  md: {
    track: 'w-11 h-6 p-0.5',
    thumb: 'size-5',
    translate: 'data-[checked]:translate-x-5 rtl:data-[checked]:-translate-x-5',
  },
  lg: {
    track: 'w-14 h-8 p-1',
    thumb: 'size-6',
    translate: 'data-[checked]:translate-x-6 rtl:data-[checked]:-translate-x-6',
  },
};

const SwitchComponent = React.forwardRef<HTMLElement, SwitchProps>(
  (
    {
      label,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      value,
      form,
      id,
      inputRef,
      nativeButton,
      description,
      error,
      size = 'md',
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelBy,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;
    const descriptionId = label && description ? `${switchId}-description` : undefined;
    const hasErrorText = typeof error === 'string' && !!error;
    const errorId = label && hasErrorText ? `${switchId}-error` : undefined;
    const describedBy = [props['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined;
    const currentSize = sizeConfig[size] || sizeConfig.md;
    const isClassNameFn = typeof className === 'function';

    const switchNode = (
      <BaseSwitch.Root
        ref={ref}
        data-slot="switch"
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        value={value}
        form={form}
        inputRef={inputRef}
        nativeButton={nativeButton}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelBy}
        className={composeClassName(
          cn(
            'rounded-full border transition-[background-color,border-color] duration-[var(--duration-quick)] motion-reduce:transition-none relative flex items-center shrink-0 cursor-pointer select-none after:absolute after:content-[\'\']',
            size === 'sm' ? 'after:-inset-y-3 after:-inset-x-1' : 'after:-inset-y-2.5 after:-inset-x-0.5',
            'bg-surface-container-high data-[checked]:bg-primary',
            error
              ? 'border-error data-[checked]:border-error focus-visible:outline-error'
              : 'border-outline data-[checked]:border-primary focus-visible:outline-primary',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            'forced-colors:data-[checked]:bg-[Highlight] forced-colors:data-[checked]:border-[Highlight]',
            'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
            currentSize.track
          ),
          !label || isClassNameFn ? className : undefined
        )}
        {...props}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={describedBy}
      >
        {children ?? (
          <BaseSwitch.Thumb
            data-slot="switch-thumb"
            className={cn(
              'rounded-full bg-surface shadow-ambient transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] translate-x-0 motion-reduce:transition-none forced-colors:bg-[HighlightText]',
              currentSize.thumb,
              currentSize.translate
            )}
          />
        )}
      </BaseSwitch.Root>
    );

    if (!label) {
      return switchNode;
    }

    return (
      <div
        className={cn(
          'flex w-full items-center justify-between gap-4 min-h-[44px] py-2 px-3 rounded transition-colors motion-reduce:transition-none hover:bg-state-hover',
          disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
          !isClassNameFn ? className : undefined
        )}
      >
        <div className="flex flex-col flex-1 min-w-0 break-words">
          <label
            htmlFor={switchId}
            className="font-sans text-sm font-medium text-on-surface cursor-pointer select-none"
          >
            {label}
          </label>
          {description && (
            <span id={descriptionId} className="font-sans text-sm text-on-surface-variant font-normal mt-0.5">
              {description}
            </span>
          )}
          {hasErrorText && (
            <span id={errorId} className="flex items-center gap-1 font-sans text-sm font-semibold text-error mt-1 select-none">
              <Icon name="error" size="sm" className="shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </span>
          )}
        </div>
        {switchNode}
      </div>
    );
  }
);
SwitchComponent.displayName = 'Switch';

export const SwitchRoot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Root> & { size?: SwitchSize; error?: boolean }
>(({ className, size = 'md', error, ...props }, ref) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  return (
    <BaseSwitch.Root
      ref={ref}
      data-slot="switch"
      className={composeClassName(
        cn(
          'rounded-full border transition-[background-color,border-color] duration-[var(--duration-quick)] motion-reduce:transition-none relative flex items-center shrink-0 cursor-pointer select-none after:absolute after:content-[\'\']',
          size === 'sm' ? 'after:-inset-y-3 after:-inset-x-1' : 'after:-inset-y-2.5 after:-inset-x-0.5',
          'bg-surface-container-high data-[checked]:bg-primary',
          error
            ? 'border-error data-[checked]:border-error focus-visible:outline-error'
            : 'border-outline data-[checked]:border-primary focus-visible:outline-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'forced-colors:data-[checked]:bg-[Highlight] forced-colors:data-[checked]:border-[Highlight]',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
          currentSize.track
        ),
        className
      )}
      {...props}
    />
  );
});
SwitchRoot.displayName = 'SwitchRoot';

export const SwitchThumb = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Thumb> & { size?: SwitchSize }
>(({ className, size = 'md', ...props }, ref) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  return (
    <BaseSwitch.Thumb
      ref={ref}
      data-slot="switch-thumb"
      className={composeClassName(
        cn(
          'rounded-full bg-surface shadow-ambient transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] translate-x-0 motion-reduce:transition-none forced-colors:bg-[HighlightText]',
          currentSize.thumb,
          currentSize.translate
        ),
        className
      )}
      {...props}
    />
  );
});
SwitchThumb.displayName = 'SwitchThumb';

// Compound export mapping Base UI primitives
export const Switch = Object.assign(SwitchComponent, {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
});

// Re-export Base UI primitives for compound composition
export { BaseSwitch };

export default Switch;
