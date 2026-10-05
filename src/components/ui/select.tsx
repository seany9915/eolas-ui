import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

type SelectValueType<Value, Multiple extends boolean | undefined> = Multiple extends true ? Value[] : Value;

export interface SelectProps<Value = string, Multiple extends boolean | undefined = false> {
  label?: React.ReactNode;
  options?: SelectOption[];
  items?: BaseSelect.Root.Props<Value, Multiple>['items'];
  groups?: SelectGroupOption[];
  value?: SelectValueType<Value, Multiple> | null;
  defaultValue?: SelectValueType<Value, Multiple> | null;
  onValueChange?: (value: SelectValueType<Value, Multiple> | (Multiple extends true ? never : null), eventDetails: BaseSelect.Root.ChangeEventDetails) => void;
  onChange?: (value: SelectValueType<Value, Multiple>) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseSelect.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  multiple?: Multiple;
  modal?: boolean;
  actionsRef?: React.RefObject<BaseSelect.Root.Actions | null>;
  inputRef?: React.Ref<HTMLInputElement>;
  form?: string;
  autoComplete?: string;
  readOnly?: boolean;
  highlightItemOnHover?: boolean;
  itemToStringLabel?: (itemValue: Value) => string;
  itemToStringValue?: (itemValue: Value) => string;
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean;
  placeholder?: React.ReactNode;
  error?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
  position?: 'popper' | 'item-aligned';
  alignItemWithTrigger?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  withScrollArrows?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function SelectComponent<Value = string, Multiple extends boolean | undefined = false>({
  label,
  options,
  items,
  groups,
  value,
  defaultValue,
  onValueChange,
  onChange,
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  multiple,
  modal = true,
  actionsRef,
  inputRef,
  form,
  autoComplete,
  readOnly,
  highlightItemOnHover = true,
  itemToStringLabel,
  itemToStringValue,
  isItemEqualToValue,
  placeholder = 'Select an option',
  error,
  description,
  disabled,
  name,
  id,
  required,
  position = 'item-aligned',
  alignItemWithTrigger,
  side,
  align = 'start',
  sideOffset = 4,
  alignOffset,
  collisionPadding = 8,
  withScrollArrows = true,
  children,
  className,
}: SelectProps<Value, Multiple>): React.JSX.Element {
  // If children are provided, this is a compound Select (e.g. <Select><SelectTrigger/><SelectContent/></Select>)
  if (children) {
    return (
      <BaseSelect.Root<Value, Multiple>
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        multiple={multiple}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        form={form}
        autoComplete={autoComplete}
        required={required}
        modal={modal}
        actionsRef={actionsRef}
        inputRef={inputRef}
        items={items}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        isItemEqualToValue={isItemEqualToValue}
        highlightItemOnHover={highlightItemOnHover}
      >
        {children}
      </BaseSelect.Root>
    );
  }

  const generatedId = React.useId();
  const selectId = id || `select-${generatedId}`;
  const descriptionId = description ? `${selectId}-desc` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const resolvedItems = React.useMemo(() => {
    if (options) {
      return options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        disabled: opt.disabled,
      }));
    }
    return items;
  }, [options, items]);

  const handleValueChange = (
    newVal: SelectValueType<Value, Multiple> | (Multiple extends true ? never : null),
    details: BaseSelect.Root.ChangeEventDetails
  ) => {
    onValueChange?.(newVal, details);
    if (newVal !== undefined && newVal !== null) {
      onChange?.(newVal as SelectValueType<Value, Multiple>);
    }
  };

  const isItemAligned = alignItemWithTrigger ?? (position !== 'popper');

  return (
    <BaseSelect.Root<Value, Multiple>
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      multiple={multiple}
      disabled={disabled}
      readOnly={readOnly}
      name={name || selectId}
      form={form}
      autoComplete={autoComplete}
      required={required}
      modal={modal}
      actionsRef={actionsRef}
      inputRef={inputRef}
      items={resolvedItems}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      isItemEqualToValue={isItemEqualToValue}
      highlightItemOnHover={highlightItemOnHover}
    >
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <BaseSelect.Label className="font-label text-xs font-semibold text-on-surface-variant cursor-pointer select-none">
            {label}
          </BaseSelect.Label>
        )}
        {description && (
          <p id={descriptionId} className="text-xs text-on-surface-variant font-sans">
            {description}
          </p>
        )}
        <BaseSelect.Trigger
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'inline-flex items-center justify-between w-full h-11 px-3.5 rounded-md border border-outline bg-surface text-on-surface font-sans text-sm hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer min-h-[44px]',
            'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
            error && 'border-error focus-visible:outline-error'
          )}
        >
          <BaseSelect.Value placeholder={placeholder} className="truncate font-sans text-sm" />
          <BaseSelect.Icon className="ml-2 shrink-0 text-on-surface-variant">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              unfold_more
            </span>
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        {error && (
          <p id={errorId} className="text-xs text-error font-sans font-medium">
            {error}
          </p>
        )}
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
            alignItemWithTrigger={isItemAligned}
            className="z-50 outline-none"
          >
            <BaseSelect.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1 rounded-lg bg-surface border border-outline-variant shadow-modal transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none flex flex-col">
              {withScrollArrows && <SelectScrollUpArrow />}
              <BaseSelect.List className="relative max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none">
                {groups ? (
                  groups.map((group) => (
                    <BaseSelect.Group key={group.label} className="py-1">
                      {group.label && (
                        <BaseSelect.GroupLabel className="sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/40 select-none">
                          {group.label}
                        </BaseSelect.GroupLabel>
                      )}
                      {group.options.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </BaseSelect.Group>
                  ))
                ) : options ? (
                  options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </SelectItem>
                  ))
                ) : null}
              </BaseSelect.List>
              {withScrollArrows && <SelectScrollDownArrow />}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </div>
    </BaseSelect.Root>
  );
}

// Compound Subcomponents for Compositional API
export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger> {
  error?: boolean;
}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Trigger>,
  SelectTriggerProps
>(({ className, children, error, ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-between w-full h-11 px-3.5 rounded-md border border-outline bg-surface text-on-surface font-sans text-sm hover:bg-surface-container transition-colors cursor-pointer min-h-[44px]',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'data-[popup-open]:border-primary data-[open]:border-primary',
      'data-[disabled]:bg-surface-variant/30 data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
      error && 'border-error focus-visible:outline-error',
      className
    )}
    {...props}
  >
    {children}
    <BaseSelect.Icon className="ml-2 shrink-0 text-on-surface-variant">
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        unfold_more
      </span>
    </BaseSelect.Icon>
  </BaseSelect.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseSelect.Value>, 'children'> {
  children?: React.ReactNode | ((value: unknown) => React.ReactNode);
  placeholder?: React.ReactNode;
}

export const SelectValue = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Value>,
  SelectValueProps
>(({ className, placeholder, children, ...props }, ref) => (
  <BaseSelect.Value
    ref={ref}
    placeholder={placeholder}
    className={cn('truncate font-sans text-sm', className)}
    {...props}
  >
    {children}
  </BaseSelect.Value>
));
SelectValue.displayName = 'SelectValue';

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  position?: 'popper' | 'item-aligned';
  alignItemWithTrigger?: boolean;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  containerClassName?: string;
  withScrollArrows?: boolean;
}

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Popup>,
  SelectContentProps
>(
  (
    {
      className,
      side,
      sideOffset = 4,
      align = 'start',
      alignOffset,
      position = 'item-aligned',
      alignItemWithTrigger,
      collisionPadding = 8,
      containerClassName,
      withScrollArrows = true,
      children,
      ...props
    },
    ref
  ) => {
    const isItemAligned = alignItemWithTrigger ?? (position !== 'popper');

    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          alignItemWithTrigger={isItemAligned}
          className={cn('z-50 outline-none', containerClassName)}
        >
          <BaseSelect.Popup
            ref={ref}
            className={cn(
              'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1 rounded-lg bg-surface border border-outline-variant shadow-modal transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none flex flex-col',
              className
            )}
            {...props}
          >
            {withScrollArrows && <SelectScrollUpArrow />}
            <BaseSelect.List className="relative max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none">
              {children}
            </BaseSelect.List>
            {withScrollArrows && <SelectScrollDownArrow />}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  }
);
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Item> {
  indicatorPosition?: 'start' | 'end';
  showIndicator?: boolean;
}

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Item>,
  SelectItemProps
>(({ className, children, indicatorPosition = 'end', showIndicator = true, ...props }, ref) => (
  <BaseSelect.Item
    ref={ref}
    className={cn(
      'relative flex items-center justify-between px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium text-on-surface cursor-pointer select-none outline-none transition-colors',
      'hover:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
      'data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:font-semibold',
      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
      indicatorPosition === 'start' && 'flex-row-reverse justify-end gap-2.5',
      className
    )}
    {...props}
  >
    <BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
    {showIndicator && (
      <BaseSelect.ItemIndicator className="shrink-0 text-on-primary-container flex items-center justify-center">
        <span className="material-symbols-outlined text-sm font-bold" aria-hidden="true">
          check
        </span>
      </BaseSelect.ItemIndicator>
    )}
  </BaseSelect.Item>
));
SelectItem.displayName = 'SelectItem';

export const SelectBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseSelect.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-[2px] transition-opacity duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none',
      className
    )}
    {...props}
  />
));
SelectBackdrop.displayName = 'SelectBackdrop';

export const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Label>
>(({ className, ...props }, ref) => (
  <BaseSelect.Label
    ref={ref}
    className={cn('font-label text-xs font-semibold text-on-surface-variant cursor-pointer select-none', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

export const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Group>
>(({ className, ...props }, ref) => (
  <BaseSelect.Group ref={ref} className={cn('py-1', className)} {...props} />
));
SelectGroup.displayName = 'SelectGroup';

export const SelectGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    className={cn(
      'px-3 py-1 font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/40 select-none sticky top-0 bg-surface/95 backdrop-blur-sm z-10',
      className
    )}
    {...props}
  />
));
SelectGroupLabel.displayName = 'SelectGroupLabel';

export const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Separator>
>(({ className, ...props }, ref) => (
  <BaseSelect.Separator
    ref={ref}
    className={cn('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';

export const SelectArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Arrow>
>(({ className, ...props }, ref) => (
  <BaseSelect.Arrow
    ref={ref}
    className={cn('fill-surface stroke-outline-variant', className)}
    {...props}
  />
));
SelectArrow.displayName = 'SelectArrow';

export const SelectScrollUpArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.ScrollUpArrow>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.ScrollUpArrow
    ref={ref}
    className={cn(
      'flex h-6 w-full items-center justify-center cursor-default text-on-surface-variant bg-surface select-none z-10 shrink-0 border-b border-outline-variant/30',
      className
    )}
    {...props}
  >
    {children ?? <span className="material-symbols-outlined text-sm" aria-hidden="true">keyboard_arrow_up</span>}
  </BaseSelect.ScrollUpArrow>
));
SelectScrollUpArrow.displayName = 'SelectScrollUpArrow';

export const SelectScrollDownArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.ScrollDownArrow>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.ScrollDownArrow
    ref={ref}
    className={cn(
      'flex h-6 w-full items-center justify-center cursor-default text-on-surface-variant bg-surface select-none z-10 shrink-0 border-t border-outline-variant/30',
      className
    )}
    {...props}
  >
    {children ?? <span className="material-symbols-outlined text-sm" aria-hidden="true">keyboard_arrow_down</span>}
  </BaseSelect.ScrollDownArrow>
));
SelectScrollDownArrow.displayName = 'SelectScrollDownArrow';

export const SelectIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Icon>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Icon
    ref={ref}
    className={cn('shrink-0 text-on-surface-variant', className)}
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        unfold_more
      </span>
    )}
  </BaseSelect.Icon>
));
SelectIcon.displayName = 'SelectIcon';

// Compound export mapping Base UI primitives & composite wrappers
export const Select = Object.assign(SelectComponent, {
  Root: BaseSelect.Root,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: BaseSelect.Portal,
  Backdrop: SelectBackdrop,
  Positioner: BaseSelect.Positioner,
  Popup: BaseSelect.Popup,
  List: BaseSelect.List,
  Item: SelectItem,
  ItemIndicator: BaseSelect.ItemIndicator,
  ItemText: BaseSelect.ItemText,
  Arrow: SelectArrow,
  ScrollDownArrow: SelectScrollDownArrow,
  ScrollUpArrow: SelectScrollUpArrow,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  Content: SelectContent,
});

// Re-export Base UI primitives and compound components for composition
export { BaseSelect };
export const SelectRoot = BaseSelect.Root;
export const SelectPortal = BaseSelect.Portal;
export const SelectPositioner = BaseSelect.Positioner;
export const SelectPopup = BaseSelect.Popup;
export const SelectItemText = BaseSelect.ItemText;
export const SelectItemIndicator = BaseSelect.ItemIndicator;
export const SelectList = BaseSelect.List;

export default Select;

