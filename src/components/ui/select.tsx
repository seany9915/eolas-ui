import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { cn } from '@/lib/utils';

interface SelectContextType {
  registerItem: (value: any, label: React.ReactNode) => void;
  getItemLabel: (value: any) => React.ReactNode;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

export interface SelectProps {
  label?: string;
  options?: SelectOption[];
  items?: SelectOption[];
  groups?: SelectGroupOption[];
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  onChange?: (value: any) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  modal?: boolean;
  actionsRef?: React.RefObject<any>;
  placeholder?: string;
  error?: string;
  description?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  children?: React.ReactNode;
  className?: string;
}

const SelectComponent: React.FC<SelectProps> = ({
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
  multiple,
  modal = false,
  actionsRef,
  placeholder = 'Select an option',
  error,
  description,
  disabled,
  name,
  id,
  required,
  side,
  align = 'start',
  sideOffset = 6,
  alignOffset,
  collisionPadding = 8,
  children,
  className,
}) => {
  const [itemsMap, setItemsMap] = React.useState<Map<any, React.ReactNode>>(() => new Map());

  const registerItem = React.useCallback((val: any, itemLabel: React.ReactNode) => {
    setItemsMap((prev) => {
      if (prev.get(val) === itemLabel) return prev;
      const next = new Map(prev);
      next.set(val, itemLabel);
      return next;
    });
  }, []);

  const getItemLabel = React.useCallback(
    (val: any) => {
      return itemsMap.get(val);
    },
    [itemsMap]
  );

  const handleValueChange = (newVal: any) => {
    onValueChange?.(newVal);
    if (newVal !== undefined && newVal !== null) {
      onChange?.(newVal);
    }
  };

  // If children are provided, this is a compound Select (e.g. <Select><SelectTrigger/><SelectContent/></Select>)
  if (children) {
    return (
      <SelectContext.Provider value={{ registerItem, getItemLabel }}>
        <BaseSelect.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          multiple={multiple}
          disabled={disabled}
          name={name}
          required={required}
          modal={modal}
          actionsRef={actionsRef}
        >
          {children}
        </BaseSelect.Root>
      </SelectContext.Provider>
    );
  }

  const generatedId = React.useId();
  const selectId = id || `select-${generatedId}`;
  const descriptionId = description ? `${selectId}-desc` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const normalizedOptions = React.useMemo(() => {
    const list = options ?? items;
    if (!list) return [];
    return list.map((opt: any, index: number) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { value: String(opt), label: String(opt), disabled: false };
      }
      if (opt && typeof opt === 'object') {
        const rawVal = opt.value !== undefined ? opt.value : opt.label;
        const safeVal = typeof rawVal === 'object' && rawVal !== null
          ? String(rawVal.value || rawVal.label || index)
          : String(rawVal ?? index);

        const rawLab = opt.label !== undefined ? opt.label : opt.value;
        const safeLab = typeof rawLab === 'object' && rawLab !== null
          ? String(rawLab.label || rawLab.value || safeVal)
          : String(rawLab ?? safeVal);

        return {
          value: safeVal,
          label: safeLab,
          disabled: !!opt.disabled
        };
      }
      return { value: String(opt ?? index), label: String(opt ?? index), disabled: false };
    });
  }, [options, items]);

  const normalizedGroups = React.useMemo(() => {
    if (!groups) return null;
    return groups.map((group) => ({
      label: String(group.label || ''),
      options: (group.options || []).map((opt: any, index: number) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
          return { value: String(opt), label: String(opt), disabled: false };
        }
        const rawVal = opt?.value !== undefined ? opt.value : opt?.label;
        const safeVal = typeof rawVal === 'object' && rawVal !== null
          ? String(rawVal.value || rawVal.label || index)
          : String(rawVal ?? index);

        const rawLab = opt?.label !== undefined ? opt.label : opt?.value;
        const safeLab = typeof rawLab === 'object' && rawLab !== null
          ? String(rawLab.label || rawLab.value || safeVal)
          : String(rawLab ?? safeVal);

        return {
          value: safeVal,
          label: safeLab,
          disabled: !!opt?.disabled
        };
      })
    }));
  }, [groups]);

  return (
    <BaseSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      multiple={multiple}
      disabled={disabled}
      name={name || selectId}
      required={required}
      modal={modal}
      actionsRef={actionsRef}
    >
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <BaseSelect.Label className="font-label text-xs font-semibold text-on-surface-variant cursor-pointer">
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
            'inline-flex items-center justify-between w-full h-12 px-4 rounded-md border-[1px] border-outline bg-surface text-on-surface font-sans text-sm hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer min-h-[48px]',
            'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
            error && 'border-error'
          )}
        >
          <BaseSelect.Value placeholder={placeholder} />
          <BaseSelect.Icon className="ml-2 shrink-0">
            <span className="material-symbols-outlined text-lg text-on-surface-variant" aria-hidden="true">
              unfold_more
            </span>
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
            className="z-50 outline-none"
          >
            <BaseSelect.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]">
              <BaseSelect.List className="relative max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none">
                {normalizedGroups ? (
                  normalizedGroups.map((group) => (
                    <BaseSelect.Group key={group.label} className="py-1">
                      {group.label && (
                        <BaseSelect.GroupLabel className="sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/40 select-none">
                          {group.label}
                        </BaseSelect.GroupLabel>
                      )}
                      {group.options.map((opt) => (
                        <BaseSelect.Item
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium text-on-surface cursor-pointer select-none',
                            'hover:bg-surface-variant hover:text-primary data-[highlighted]:bg-surface-variant data-[highlighted]:text-primary data-[selected]:bg-surface-variant data-[selected]:text-primary data-[selected]:font-semibold',
                            'focus:bg-surface-variant focus:text-primary outline-none transition-colors',
                            'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed'
                          )}
                        >
                          <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                          <BaseSelect.ItemIndicator>
                            <span className="material-symbols-outlined text-sm text-primary font-bold" aria-hidden="true">check</span>
                          </BaseSelect.ItemIndicator>
                        </BaseSelect.Item>
                      ))}
                    </BaseSelect.Group>
                  ))
                ) : (
                  normalizedOptions.map((opt) => (
                    <BaseSelect.Item
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium text-on-surface cursor-pointer select-none',
                        'hover:bg-surface-variant hover:text-primary data-[highlighted]:bg-surface-variant data-[highlighted]:text-primary data-[selected]:bg-surface-variant data-[selected]:text-primary data-[selected]:font-semibold',
                        'focus:bg-surface-variant focus:text-primary outline-none transition-colors',
                        'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed'
                      )}
                    >
                      <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator>
                        <span className="material-symbols-outlined text-sm text-primary font-bold" aria-hidden="true">check</span>
                      </BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))
                )}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </div>
    </BaseSelect.Root>
  );
};

// Compound Subcomponents for Compositional API
export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger> {}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Trigger>,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-between w-full h-12 px-4 rounded-md border-[1px] border-outline bg-surface text-on-surface font-sans text-sm hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer min-h-[48px]',
      'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  >
    {children}
    <BaseSelect.Icon className="ml-2 shrink-0">
      <span className="material-symbols-outlined text-lg text-on-surface-variant" aria-hidden="true">
        unfold_more
      </span>
    </BaseSelect.Icon>
  </BaseSelect.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Value> {}

export const SelectValue = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Value>,
  SelectValueProps
>(({ className, placeholder, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  return (
    <BaseSelect.Value
      ref={ref}
      placeholder={placeholder}
      className={cn('truncate', className)}
      {...props}
    >
      {(value) => {
        if (typeof children === 'function') {
          return (children as any)(value);
        }
        if (value === undefined || value === null || value === '') {
          return placeholder ?? null;
        }
        if (context) {
          const registered = context.getItemLabel(value);
          if (registered !== undefined) return registered;
        }
        return String(value);
      }}
    </BaseSelect.Value>
  );
});
SelectValue.displayName = 'SelectValue';

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  position?: 'popper' | 'item-aligned';
}

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Popup>,
  SelectContentProps
>(({ className, side, sideOffset = 6, align = 'start', alignOffset, children, ...props }, ref) => (
  <BaseSelect.Portal>
    <BaseSelect.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      className="z-50 outline-none"
    >
      <BaseSelect.Popup
        ref={ref}
        className={cn(
          'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
          className
        )}
        {...props}
      >
        <BaseSelect.List className="relative max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none">
          {children}
        </BaseSelect.List>
      </BaseSelect.Popup>
    </BaseSelect.Positioner>
  </BaseSelect.Portal>
));
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Item> {
  value: any;
}

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Item>,
  SelectItemProps
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  React.useEffect(() => {
    if (context && value !== undefined) {
      context.registerItem(value, children);
    }
  }, [context, value, children]);

  return (
    <BaseSelect.Item
      ref={ref}
      value={value}
      className={cn(
        'relative flex items-center justify-between px-3 py-2 text-sm text-on-surface rounded-md cursor-pointer select-none outline-none transition-colors hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container-high data-[selected]:font-semibold data-[selected]:text-primary data-[disabled]:text-on-surface-variant/40 data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator>
        <span className="material-symbols-outlined text-sm text-primary font-bold" aria-hidden="true">
          check
        </span>
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
});
SelectItem.displayName = 'SelectItem';

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    className={cn('px-3 py-1.5 text-xs font-semibold font-label text-on-surface-variant/80', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

// Compound export mapping Base UI primitives & composite wrappers
export const Select = Object.assign(SelectComponent, {
  Root: BaseSelect.Root,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: BaseSelect.Icon,
  Portal: BaseSelect.Portal,
  Backdrop: BaseSelect.Backdrop,
  Positioner: BaseSelect.Positioner,
  Popup: BaseSelect.Popup,
  List: BaseSelect.List,
  Item: SelectItem,
  ItemIndicator: BaseSelect.ItemIndicator,
  ItemText: BaseSelect.ItemText,
  Arrow: BaseSelect.Arrow,
  ScrollDownArrow: BaseSelect.ScrollDownArrow,
  ScrollUpArrow: BaseSelect.ScrollUpArrow,
  Group: BaseSelect.Group,
  GroupLabel: SelectLabel,
  Separator: BaseSelect.Separator,
  Content: SelectContent,
});

// Re-export Base UI primitives and compound components for composition
export { BaseSelect };
export const SelectRoot = BaseSelect.Root;
export const SelectIcon = BaseSelect.Icon;
export const SelectPortal = BaseSelect.Portal;
export const SelectPositioner = BaseSelect.Positioner;
export const SelectPopup = BaseSelect.Popup;
export const SelectItemText = BaseSelect.ItemText;
export const SelectItemIndicator = BaseSelect.ItemIndicator;
export const SelectGroup = BaseSelect.Group;
export const SelectGroupLabel = SelectLabel;
export const SelectSeparator = BaseSelect.Separator;
export const SelectArrow = BaseSelect.Arrow;
export const SelectScrollUpArrow = BaseSelect.ScrollUpArrow;
export const SelectScrollDownArrow = BaseSelect.ScrollDownArrow;
export const SelectBackdrop = BaseSelect.Backdrop;
export const SelectList = BaseSelect.List;



