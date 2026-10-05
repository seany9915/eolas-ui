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
import { cn } from '@/lib/utils';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'onChange'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean | string;
  size?: SwitchSize;
  className?: string;
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
    translate: 'data-[checked]:translate-x-4',
  },
  md: {
    track: 'w-11 h-6 p-0.5',
    thumb: 'size-5',
    translate: 'data-[checked]:translate-x-5',
  },
  lg: {
    track: 'w-14 h-8 p-1',
    thumb: 'size-6',
    translate: 'data-[checked]:translate-x-6',
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
    const currentSize = sizeConfig[size] || sizeConfig.md;

    const switchNode = (
      <BaseSwitch.Root
        ref={ref}
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
        aria-label={!label ? ariaLabel || 'Switch' : ariaLabel}
        aria-labelledby={ariaLabelBy}
        className={cn(
          'rounded-full border transition-[background-color,border-color] duration-[var(--duration-quick)] relative flex items-center shrink-0 cursor-pointer select-none',
          'bg-surface-variant',
          error ? 'border-error focus-visible:outline-error' : 'border-outline',
          'data-[checked]:bg-primary data-[checked]:border-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
          currentSize.track,
          !label && className
        )}
        {...props}
      >
        <BaseSwitch.Thumb
          className={cn(
            'rounded-full bg-surface shadow-ambient transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] translate-x-0 motion-reduce:transition-none',
            currentSize.thumb,
            currentSize.translate
          )}
        />
      </BaseSwitch.Root>
    );

    if (!label) {
      return switchNode;
    }

    return (
      <div
        className={cn(
          'flex w-full items-center justify-between gap-4 min-h-[44px] py-2 px-3 rounded transition-colors hover:bg-surface-variant/30',
          disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
          className
        )}
      >
        <label
          htmlFor={switchId}
          className="font-sans text-sm font-medium text-on-surface cursor-pointer select-none flex flex-col flex-1"
        >
          <span>{label}</span>
          {description && (
            <span className="font-sans text-sm text-on-surface-variant font-normal mt-0.5">
              {description}
            </span>
          )}
          {typeof error === 'string' && error && (
            <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error mt-1 select-none">
              <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
                error
              </span>
              <span>{error}</span>
            </span>
          )}
        </label>
        {switchNode}
      </div>
    );
  }
);
SwitchComponent.displayName = 'Switch';

// Compound export mapping Base UI primitives
export const Switch = Object.assign(SwitchComponent, {
  Root: BaseSwitch.Root,
  Thumb: BaseSwitch.Thumb,
});

// Re-export Base UI primitives for compound composition
export { BaseSwitch };
export const SwitchRoot = BaseSwitch.Root;
export const SwitchThumb = BaseSwitch.Thumb;

export default Switch;
