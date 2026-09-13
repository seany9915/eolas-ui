import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';

export interface ToggleGroupItemProps {
  value: string;
  ariaLabel?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  ariaLabel,
  children,
  disabled,
  className,
}) => {
  return (
    <BaseToggle
      value={value}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 h-10 px-4 min-h-[44px] rounded-sm font-label text-sm font-semibold transition-all cursor-pointer select-none',
        'text-on-surface-variant hover:text-on-surface hover:bg-surface/50',
        'data-[pressed]:bg-primary data-[pressed]:text-on-primary data-[pressed]:shadow-sm',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </BaseToggle>
  );
};

export interface ToggleGroupProps {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: any) => void;
  ariaLabel: string;
  items?: { value: string; label: string; icon?: string; disabled?: boolean }[];
  multiple?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ToggleGroupComponent: React.FC<ToggleGroupProps> = ({
  value,
  defaultValue,
  onValueChange,
  ariaLabel,
  items,
  multiple,
  orientation = 'horizontal',
  loopFocus = true,
  disabled,
  children,
  className,
}) => {
  const normalizedValue = value !== undefined ? (Array.isArray(value) ? value : [value]) : undefined;
  const normalizedDefaultValue = defaultValue !== undefined ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : undefined;

  return (
    <BaseToggleGroup
      value={normalizedValue}
      defaultValue={normalizedDefaultValue}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      multiple={multiple}
      orientation={orientation}
      loopFocus={loopFocus}
      disabled={disabled}
      className={cn(
        'inline-flex p-1 rounded-[0.5rem] border-[1px] border-outline-variant bg-surface-container gap-1',
        orientation === 'vertical' && 'flex-col',
        className
      )}
    >
      {children
        ? children
        : items?.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              ariaLabel={item.label}
              disabled={item.disabled}
            >
              {item.icon && (
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </ToggleGroupItem>
          ))}
    </BaseToggleGroup>
  );
};

// Compound export mapping Base UI primitives & wrappers
export const ToggleGroup = Object.assign(ToggleGroupComponent, {
  Root: BaseToggleGroup,
  Item: ToggleGroupItem,
});

export { BaseToggleGroup };
export const ToggleGroupRoot = BaseToggleGroup;
