import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  description?: string;
}

const SwitchComponent: React.FC<SwitchProps> = ({
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
}) => {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  return (
    <div className="flex w-full items-center justify-between gap-4 min-h-[44px] py-2 px-3 rounded transition-colors hover:bg-surface-variant/30">
      <label htmlFor={switchId} className="font-sans text-sm font-medium text-on-surface cursor-pointer select-none flex flex-col flex-1">
        <span>{label}</span>
        {description && <span className="text-xs text-on-surface-variant font-normal">{description}</span>}
      </label>
      <BaseSwitch.Root
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        value={value}
        className={cn(
          'w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 cursor-pointer',
          'bg-surface-variant border-[1px] border-outline-variant',
          'data-[checked]:bg-primary data-[checked]:border-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <BaseSwitch.Thumb className="w-4.5 h-4.5 rounded-full bg-surface shadow-md transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] translate-x-0 data-[checked]:translate-x-5" />
      </BaseSwitch.Root>
    </div>
  );
};

// Compound export mapping Base UI primitives
export const Switch = Object.assign(SwitchComponent, {
  Root: BaseSwitch.Root,
  Thumb: BaseSwitch.Thumb,
});

// Re-export Base UI primitives for compound composition
export { BaseSwitch };
export const SwitchRoot = BaseSwitch.Root;
export const SwitchThumb = BaseSwitch.Thumb;
