import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';

export interface ToggleGroupItemProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'children'> {
  value: string;
  ariaLabel?: string;
  'aria-label'?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, ariaLabel, 'aria-label': ariaLabelProp, children, disabled, className, ...props }, ref) => {
    const label = ariaLabel ?? ariaLabelProp;
    return (
      <BaseToggle
        ref={ref}
        value={value}
        aria-label={label}
        disabled={disabled}
        render={(renderProps, state) => (
          <button
            {...renderProps}
            data-state={state.pressed ? 'on' : 'off'}
          />
        )}
        className={cn(
          'inline-flex items-center justify-center gap-2 h-full px-4 rounded-[4px] font-label text-sm font-semibold transition-all cursor-pointer select-none min-h-[38px]',
          'text-on-surface-variant hover:text-on-surface hover:bg-surface/50',
          'data-[pressed]:bg-primary data-[pressed]:text-on-primary data-[pressed]:shadow-sm',
          'data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:shadow-sm',
          'aria-pressed:bg-primary aria-pressed:text-on-primary aria-pressed:shadow-sm',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
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
ToggleGroupItem.displayName = 'ToggleGroupItem';

export interface ToggleGroupProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: any, eventDetails?: any) => void;
  ariaLabel?: string;
  'aria-label'?: string;
  items?: { value: string; label: string; icon?: string; disabled?: boolean }[];
  multiple?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ToggleGroupComponent = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type,
      value,
      defaultValue,
      onValueChange,
      ariaLabel,
      'aria-label': ariaLabelProp,
      items,
      multiple,
      orientation = 'horizontal',
      loopFocus = true,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isMultiple = multiple ?? (type === 'multiple');
    const label = ariaLabel ?? ariaLabelProp ?? 'Toggle selection group';

    const normalizedValue = React.useMemo(() => {
      if (value === undefined) return undefined;
      if (Array.isArray(value)) return value;
      return value ? [value] : [];
    }, [value]);

    const normalizedDefaultValue = React.useMemo(() => {
      if (defaultValue === undefined) return undefined;
      if (Array.isArray(defaultValue)) return defaultValue;
      return defaultValue ? [defaultValue] : [];
    }, [defaultValue]);

    const handleValueChange = (val: string[], eventDetails: any) => {
      if (!onValueChange) return;
      if (isMultiple) {
        onValueChange(val, eventDetails);
      } else {
        const singleVal = val.length > 0 ? val[val.length - 1] : '';
        onValueChange(singleVal, eventDetails);
      }
    };

    return (
      <BaseToggleGroup
        ref={ref}
        value={normalizedValue}
        defaultValue={normalizedDefaultValue}
        onValueChange={handleValueChange}
        aria-label={label}
        multiple={isMultiple}
        orientation={orientation}
        loopFocus={loopFocus}
        disabled={disabled}
        className={cn(
          'inline-flex items-center h-12 p-1 rounded-[0.5rem] border-[1px] border-outline-variant bg-surface-container gap-1',
          orientation === 'vertical' && 'flex-col h-auto',
          className
        )}
        {...props}
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
  }
);
ToggleGroupComponent.displayName = 'ToggleGroup';

// Compound export mapping Base UI primitives & wrappers
export const ToggleGroup = Object.assign(ToggleGroupComponent, {
  Root: ToggleGroupComponent,
  Item: ToggleGroupItem,
});

export { BaseToggleGroup };
export const ToggleGroupRoot = ToggleGroupComponent;
export const ToggleGroupRootPrimitive = BaseToggleGroup;
export default ToggleGroup;
