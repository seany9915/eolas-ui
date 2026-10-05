/**
 * ToggleGroup primitive (@base-ui/react/toggle-group).
 *
 * Base UI Documentation: https://base-ui.com/react/components/toggle-group
 *
 * TAXONOMY & USAGE:
 * - Use ToggleGroup for mutually exclusive or multi-select option switches (e.g. text align, view mode grid/list, filter tags)
 *   where selection updates state/data in-place without switching or hiding full views or panels.
 * - Do NOT use ToggleGroup for switching tabs/panels (use Tabs instead, role="tablist").
 * - Do NOT use ToggleGroup for persistent command action bars (use Toolbar instead, role="toolbar").
 * - Inner items use `rounded-sm` (0.25rem / 4px) and outer container uses `rounded` (0.5rem / 8px) per concentric radius law ($R_{outer} = R_{inner} + padding = 4px + 4px = 8px$).
 * - Enforces WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets on interactive items.
 */
import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';

export type ToggleGroupVariant = 'default' | 'outline' | 'segmented';
export type ToggleGroupSize = 'sm' | 'md' | 'lg';

interface ToggleGroupContextValue {
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
  orientation: 'horizontal' | 'vertical';
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: 'default',
  size: 'md',
  orientation: 'horizontal',
});

export interface ToggleGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'children'> {
  value: string;
  ariaLabel?: string;
  'aria-label'?: string;
  children: React.ReactNode;
  icon?: string;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  (
    {
      value,
      ariaLabel,
      'aria-label': ariaLabelProp,
      children,
      icon,
      disabled,
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const groupContext = React.useContext(ToggleGroupContext);
    const effectiveVariant = variant ?? groupContext.variant;
    const effectiveSize = size ?? groupContext.size;
    const label = ariaLabel ?? ariaLabelProp;

    const sizeClasses = {
      sm: 'h-9 px-2.5 min-w-[36px] text-xs gap-1.5',
      md: 'h-11 px-3.5 min-w-[44px] min-h-[44px] text-sm gap-2',
      lg: 'h-12 px-4.5 min-w-[48px] min-h-[48px] text-base gap-2.5',
    }[effectiveSize];

    return (
      <BaseToggle
        ref={ref}
        value={value}
        aria-label={label}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-label font-semibold cursor-pointer select-none',
          'transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
          'active:scale-[var(--scale-tiny)] motion-reduce:transform-none motion-reduce:transition-none',
          sizeClasses,
          effectiveVariant === 'outline'
            ? cn(
                'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 border border-transparent',
                'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary data-[pressed]:shadow-ambient'
              )
            : cn(
                'text-on-surface-variant hover:text-on-surface hover:bg-surface/50',
                'data-[pressed]:bg-primary data-[pressed]:text-on-primary data-[pressed]:shadow-ambient'
              ),
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </BaseToggle>
    );
  }
);
ToggleGroupItem.displayName = 'ToggleGroupItem';

export interface ToggleGroupItemData {
  value: string;
  label: React.ReactNode;
  icon?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

interface BaseToggleGroupCommonProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'defaultValue' | 'value' | 'onChange'
  > {
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  disabled?: boolean;
  mandatory?: boolean;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  ariaLabel?: string;
  'aria-label'?: string;
  items?: ToggleGroupItemData[];
  children?: React.ReactNode;
  className?: string;
}

export interface ToggleGroupSingleProps extends BaseToggleGroupCommonProps {
  type: 'single';
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails: BaseToggleGroup.ChangeEventDetails) => void;
}

export interface ToggleGroupMultipleProps extends BaseToggleGroupCommonProps {
  type?: 'multiple';
  multiple?: boolean;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[], eventDetails: BaseToggleGroup.ChangeEventDetails) => void;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroupComponent = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const {
      type,
      value,
      defaultValue,
      onValueChange,
      ariaLabel,
      'aria-label': ariaLabelProp,
      items,
      multiple,
      mandatory = type === 'single' || multiple === false,
      orientation = 'horizontal',
      loopFocus = true,
      disabled = false,
      variant = 'default',
      size = 'md',
      children,
      className,
      ...domProps
    } = props;

    const isSingleStringMode = type === 'single';
    const isMultipleMode = multiple === true || type === 'multiple';
    const label = ariaLabel ?? ariaLabelProp ?? 'Toggle selection group';

    // Normalize value into Base UI array contract
    const normalizedValue = React.useMemo(() => {
      if (value === undefined) return undefined;
      if (Array.isArray(value)) return value;
      return typeof value === 'string' && value ? [value] : [];
    }, [value]);

    const normalizedDefaultValue = React.useMemo(() => {
      if (defaultValue === undefined) return undefined;
      if (Array.isArray(defaultValue)) return defaultValue;
      return typeof defaultValue === 'string' && defaultValue ? [defaultValue] : [];
    }, [defaultValue]);

    // Track active selection internally for uncontrolled / value retention fallback
    const [internalValue, setInternalValue] = React.useState<string[]>(
      normalizedValue ?? normalizedDefaultValue ?? []
    );

    // Keep internal tracking synchronized with controlled value when present
    React.useEffect(() => {
      if (normalizedValue !== undefined) {
        setInternalValue(normalizedValue);
      }
    }, [normalizedValue]);

    const effectiveValue = normalizedValue !== undefined ? normalizedValue : internalValue;

    const handleValueChange = (
      val: string[],
      eventDetails: BaseToggleGroup.ChangeEventDetails
    ) => {
      // If mandatory is true and user tries to deselect the last item, retain previous selection
      if (mandatory && val.length === 0 && effectiveValue.length > 0) {
        return;
      }

      if (normalizedValue === undefined) {
        setInternalValue(val);
      }

      if (!onValueChange) return;

      if (isSingleStringMode) {
        // Unpack array to single string value for single-mode listeners
        const singleVal = val.length > 0 ? val[val.length - 1] : '';
        (onValueChange as (v: string, d: BaseToggleGroup.ChangeEventDetails) => void)(
          singleVal,
          eventDetails
        );
      } else {
        // Multiple mode listeners receive array of strings
        (onValueChange as (v: string[], d: BaseToggleGroup.ChangeEventDetails) => void)(
          val,
          eventDetails
        );
      }
    };

    return (
      <ToggleGroupContext.Provider value={{ variant, size, orientation }}>
        <BaseToggleGroup
          ref={ref}
          value={effectiveValue}
          onValueChange={handleValueChange}
          multiple={isMultipleMode}
          orientation={orientation}
          loopFocus={loopFocus}
          disabled={disabled}
          aria-label={label}
          className={cn(
            'inline-flex p-1 rounded bg-surface-container border border-outline-variant gap-1 select-none',
            orientation === 'vertical' ? 'flex-col items-stretch w-max' : 'flex-row items-center',
            className
          )}
          {...domProps}
        >
          {children
            ? children
            : items?.map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  icon={item.icon}
                  disabled={item.disabled}
                  aria-label={item.ariaLabel}
                  variant={variant}
                  size={size}
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
        </BaseToggleGroup>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroupComponent.displayName = 'ToggleGroup';

// Compound export mapping Base UI primitives
export const ToggleGroup = Object.assign(ToggleGroupComponent, {
  Root: BaseToggleGroup,
  Item: ToggleGroupItem,
});

export { BaseToggleGroup };
export const ToggleGroupRoot = BaseToggleGroup;
export default ToggleGroup;
