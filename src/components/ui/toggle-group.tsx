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
 * - Outer track uses `bg-surface-container` with `border-outline-variant`. Pressed items adapt by mode:
 *   single-select uses `bg-surface text-on-surface border-outline`, multi-select uses `bg-primary-container text-on-primary-container border-primary`.
 * - Enforces WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets on interactive items.
 */
import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

/**
 * @deprecated `'outline'` and `'segmented'` are deprecated aliases of `'default'`.
 * ToggleGroup now uses one unified container shell and adapts pressed styling automatically from single vs. multiple selection mode.
 */
export type ToggleGroupVariant = 'default' | 'outline' | 'segmented';
export type ToggleGroupSize = 'sm' | 'md' | 'lg';

interface ToggleGroupContextValue {
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
  orientation: 'horizontal' | 'vertical';
  multiple: boolean;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: 'default',
  size: 'md',
  orientation: 'horizontal',
  multiple: false,
});

export interface ToggleGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'children' | 'value'> {
  value: string;
  ariaLabel?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
  icon?: string;
  /** @deprecated Deprecated alias retained for backward compatibility; styling follows selection mode automatically. */
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
    void variant; // Destructured to avoid forwarding deprecated prop to the DOM button
    const groupContext = React.useContext(ToggleGroupContext);
    const effectiveSize = size ?? groupContext.size;
    const label = ariaLabel ?? ariaLabelProp;

    const sizeClasses = {
      sm: 'h-11 px-3.5 min-w-[44px] min-h-[44px] text-xs gap-1.5',
      md: 'h-12 px-4.5 min-w-[48px] min-h-[48px] text-sm gap-2',
      lg: 'h-14 px-6 min-w-[56px] min-h-[56px] text-base gap-2.5',
    }[effectiveSize];

    const baseItemClasses = cn(
      'inline-flex items-center justify-center rounded-sm font-label font-semibold cursor-pointer select-none',
      'transition-[color,background-color,border-color,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
      'active:scale-[var(--scale-tiny)] motion-reduce:transform-none motion-reduce:transition-none',
      sizeClasses,
      'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40 border border-transparent',
      groupContext.multiple
        ? 'data-[pressed]:bg-primary-container data-[pressed]:text-on-primary-container data-[pressed]:border-primary'
        : 'data-[pressed]:bg-surface data-[pressed]:text-on-surface data-[pressed]:border-outline',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
    );

    return (
      <BaseToggle
        ref={ref}
        value={value}
        aria-label={label}
        disabled={disabled}
        className={(state) =>
          cn(baseItemClasses, typeof className === 'function' ? className(state) : className)
        }
        {...props}
      >
        {icon && <Icon name={icon} size="sm" className="shrink-0" />}
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
    React.ComponentPropsWithoutRef<typeof BaseToggleGroup>,
    'defaultValue' | 'value' | 'onValueChange'
  > {
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  disabled?: boolean;
  mandatory?: boolean;
  /** @deprecated `'outline'` and `'segmented'` are deprecated aliases of `'default'`. */
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  ariaLabel?: string;
  'aria-label'?: string;
  items?: ToggleGroupItemData[];
  children?: React.ReactNode;
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
      mandatory = type === 'single',
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
    const isMultipleMode = multiple ?? (type === 'multiple');
    const label =
      ariaLabel ?? ariaLabelProp ?? (domProps['aria-labelledby'] ? undefined : 'Toggle selection group');

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

    // Track active selection internally for uncontrolled fallback
    const [internalValue, setInternalValue] = React.useState<string[]>(
      normalizedValue ?? normalizedDefaultValue ?? []
    );

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
      <ToggleGroupContext.Provider value={{ variant, size, orientation, multiple: isMultipleMode }}>
        <BaseToggleGroup
          ref={ref}
          value={effectiveValue}
          onValueChange={handleValueChange}
          multiple={isMultipleMode}
          orientation={orientation}
          loopFocus={loopFocus}
          disabled={disabled}
          aria-label={label}
          className={(state) =>
            cn(
              'inline-flex w-fit max-w-full flex-wrap p-1 rounded gap-1 select-none bg-surface-container border border-outline-variant',
              orientation === 'vertical' ? 'flex-col items-stretch w-max' : 'flex-row items-center',
              typeof className === 'function' ? className(state) : className
            )
          }
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
  Root: ToggleGroupComponent,
  Item: ToggleGroupItem,
});

export { BaseToggleGroup };
export const ToggleGroupRoot = ToggleGroupComponent;
export const ToggleGroupPrimitive = BaseToggleGroup;
export default ToggleGroup;
