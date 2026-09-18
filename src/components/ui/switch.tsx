import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  description?: React.ReactNode;
  error?: boolean | string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const SwitchComponent = React.forwardRef<HTMLElement, SwitchProps>(({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  readOnly,
  required,
  name,
  value,
  id,
  description,
  error,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const switchId = id || generatedId;

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
      aria-label={!label ? (ariaLabel || 'Switch') : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 cursor-pointer',
        'bg-surface-variant border-[1px]',
        error ? 'border-error focus-visible:outline-error' : 'border-outline',
        'data-[checked]:bg-primary data-[checked]:border-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        !label && className
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="w-4.5 h-4.5 rounded-full bg-surface shadow-sm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] translate-x-0 data-[checked]:translate-x-5" />
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
      <label htmlFor={switchId} className="font-sans text-sm font-medium text-on-surface cursor-pointer select-none flex flex-col flex-1">
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
});

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
