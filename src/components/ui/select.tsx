import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
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
  required?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;
}

const SelectComponent: React.FC<SelectProps> = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
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
  required,
  side,
  align = 'start',
  sideOffset = 6,
  alignOffset,
  collisionPadding = 8,
  className,
}) => {
  const generatedId = React.useId();
  const selectId = `select-${generatedId}`;
  const descriptionId = description ? `${selectId}-desc` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <BaseSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
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
            error && 'border-error'
          )}
        >
          <BaseSelect.Value placeholder={placeholder} />
          <BaseSelect.Icon className="ml-2">
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
                {options.map((opt) => (
                  <BaseSelect.Item
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium text-on-surface cursor-pointer select-none',
                      'hover:bg-surface-variant hover:text-primary data-[highlighted]:bg-surface-variant data-[highlighted]:text-primary data-[selected]:bg-surface-variant data-[selected]:text-primary data-[selected]:font-semibold',
                      'focus:bg-surface-variant focus:text-primary outline-none transition-colors'
                    )}
                  >
                    <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator>
                      <span className="material-symbols-outlined text-sm text-primary font-bold" aria-hidden="true">check</span>
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </div>
    </BaseSelect.Root>
  );
};

// Compound export mapping Base UI primitives
export const Select = Object.assign(SelectComponent, {
  Root: BaseSelect.Root,
  Label: BaseSelect.Label,
  Trigger: BaseSelect.Trigger,
  Value: BaseSelect.Value,
  Icon: BaseSelect.Icon,
  Portal: BaseSelect.Portal,
  Backdrop: BaseSelect.Backdrop,
  Positioner: BaseSelect.Positioner,
  Popup: BaseSelect.Popup,
  List: BaseSelect.List,
  Item: BaseSelect.Item,
  ItemIndicator: BaseSelect.ItemIndicator,
  ItemText: BaseSelect.ItemText,
  Arrow: BaseSelect.Arrow,
  ScrollDownArrow: BaseSelect.ScrollDownArrow,
  ScrollUpArrow: BaseSelect.ScrollUpArrow,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
  Separator: BaseSelect.Separator,
});

// Re-export Base UI primitives for compound composition
export { BaseSelect };
export const SelectRoot = BaseSelect.Root;
export const SelectLabel = BaseSelect.Label;
export const SelectTrigger = BaseSelect.Trigger;
export const SelectValue = BaseSelect.Value;
export const SelectIcon = BaseSelect.Icon;
export const SelectPortal = BaseSelect.Portal;
export const SelectPositioner = BaseSelect.Positioner;
export const SelectPopup = BaseSelect.Popup;
export const SelectItem = BaseSelect.Item;
export const SelectItemText = BaseSelect.ItemText;
export const SelectItemIndicator = BaseSelect.ItemIndicator;
export const SelectGroup = BaseSelect.Group;
export const SelectGroupLabel = BaseSelect.GroupLabel;
export const SelectSeparator = BaseSelect.Separator;
export const SelectArrow = BaseSelect.Arrow;
export const SelectScrollUpArrow = BaseSelect.ScrollUpArrow;
export const SelectScrollDownArrow = BaseSelect.ScrollDownArrow;
export const SelectBackdrop = BaseSelect.Backdrop;
export const SelectList = BaseSelect.List;

