import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { cn } from '@/lib/utils';

export interface ComboboxItem {
  value: string;
  label: string;
}

export interface ComboboxProps {
  label?: string;
  placeholder?: string;
  options: ComboboxItem[];
  value?: string | null;
  onValueChange?: (val: string | null) => void;
  error?: string;
  description?: string;
  clearable?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;
}

const ComboboxComponent: React.FC<ComboboxProps> = ({
  label,
  placeholder = 'Select option...',
  options,
  value,
  onValueChange,
  error,
  description,
  clearable = true,
  side,
  align = 'start',
  sideOffset = 6,
  alignOffset,
  collisionPadding = 8,
  className,
}) => {
  const generatedId = React.useId();
  const comboboxId = `combobox-${generatedId}`;
  const descriptionId = description ? `${comboboxId}-desc` : undefined;
  const errorId = error ? `${comboboxId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  // Find selected item object if value is string
  const selectedItem = React.useMemo(() => {
    if (!value) return null;
    return options.find((opt) => opt.value === value) ?? null;
  }, [options, value]);

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      <BaseCombobox.Root
        items={options}
        value={selectedItem}
        onValueChange={(selected: ComboboxItem | null) => {
          onValueChange?.(selected ? selected.value : null);
        }}
      >
        <BaseCombobox.Status className="sr-only" />
        {label && (
          <BaseCombobox.Label className="block font-label text-xs font-semibold text-on-surface-variant cursor-pointer">
            {label}
          </BaseCombobox.Label>
        )}
        {description && (
          <p id={descriptionId} className="text-xs text-on-surface-variant font-sans">
            {description}
          </p>
        )}
        <BaseCombobox.InputGroup className="relative w-full">
          <BaseCombobox.Input
            id={comboboxId}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'w-full h-12 pl-4 pr-16 rounded-md bg-surface border-[1px] border-outline text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary transition-all min-h-[48px]',
              error && 'border-error'
            )}
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            {clearable && (
              <BaseCombobox.Clear
                className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <span className="material-symbols-outlined text-base" aria-hidden="true">close</span>
              </BaseCombobox.Clear>
            )}
            <BaseCombobox.Trigger
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer rounded"
              aria-label="Open options"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">unfold_more</span>
            </BaseCombobox.Trigger>
          </div>
          <BaseCombobox.Portal>
            <BaseCombobox.Positioner
              side={side}
              align={align}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              collisionPadding={collisionPadding}
              className="z-50 outline-none"
            >
              <BaseCombobox.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]">
                <BaseCombobox.Empty className="px-3 py-2 text-xs font-sans text-on-surface-variant">
                  No matching options
                </BaseCombobox.Empty>
                <BaseCombobox.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none data-[empty]:p-0">
                  {(opt: ComboboxItem) => (
                    <BaseCombobox.Item
                      key={opt.value}
                      value={opt}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md font-sans text-sm text-on-surface hover:bg-surface-variant hover:text-primary data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:font-semibold data-[highlighted]:bg-surface-variant cursor-pointer transition-colors"
                    >
                      <BaseCombobox.ItemIndicator
                        keepMounted
                        className="w-5 h-5 flex items-center justify-center text-primary shrink-0 opacity-0 data-[selected]:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-base font-bold">check</span>
                      </BaseCombobox.ItemIndicator>
                      <span className="flex-1 font-medium">{opt.label}</span>
                    </BaseCombobox.Item>
                  )}
                </BaseCombobox.List>
              </BaseCombobox.Popup>
            </BaseCombobox.Positioner>
          </BaseCombobox.Portal>
        </BaseCombobox.InputGroup>
      </BaseCombobox.Root>
    </div>
  );
};

// Compound Base UI exports
export const Combobox = Object.assign(ComboboxComponent, {
  Root: BaseCombobox.Root,
  Label: BaseCombobox.Label,
  Input: BaseCombobox.Input,
  InputGroup: BaseCombobox.InputGroup,
  Trigger: BaseCombobox.Trigger,
  Clear: BaseCombobox.Clear,
  Icon: BaseCombobox.Icon,
  Value: BaseCombobox.Value,
  Status: BaseCombobox.Status,
  Chips: BaseCombobox.Chips,
  Chip: BaseCombobox.Chip,
  ChipRemove: BaseCombobox.ChipRemove,
  Portal: BaseCombobox.Portal,
  Backdrop: BaseCombobox.Backdrop,
  Positioner: BaseCombobox.Positioner,
  Popup: BaseCombobox.Popup,
  Arrow: BaseCombobox.Arrow,
  Empty: BaseCombobox.Empty,
  List: BaseCombobox.List,
  Row: BaseCombobox.Row,
  Item: BaseCombobox.Item,
  ItemIndicator: BaseCombobox.ItemIndicator,
  Group: BaseCombobox.Group,
  GroupLabel: BaseCombobox.GroupLabel,
  Separator: BaseCombobox.Separator,
  Collection: BaseCombobox.Collection,
  useFilter: BaseCombobox.useFilter,
  useFilteredItems: BaseCombobox.useFilteredItems,
  createItems: BaseCombobox.createItems,
});

export { BaseCombobox };
export const ComboboxRoot = BaseCombobox.Root;
export const ComboboxLabel = BaseCombobox.Label;
export const ComboboxInput = BaseCombobox.Input;
export const ComboboxInputGroup = BaseCombobox.InputGroup;
export const ComboboxTrigger = BaseCombobox.Trigger;
export const ComboboxClear = BaseCombobox.Clear;
export const ComboboxIcon = BaseCombobox.Icon;
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxStatus = BaseCombobox.Status;
export const ComboboxChips = BaseCombobox.Chips;
export const ComboboxChip = BaseCombobox.Chip;
export const ComboboxChipRemove = BaseCombobox.ChipRemove;
export const ComboboxPortal = BaseCombobox.Portal;
export const ComboboxBackdrop = BaseCombobox.Backdrop;
export const ComboboxPositioner = BaseCombobox.Positioner;
export const ComboboxPopup = BaseCombobox.Popup;
export const ComboboxArrow = BaseCombobox.Arrow;
export const ComboboxEmpty = BaseCombobox.Empty;
export const ComboboxList = BaseCombobox.List;
export const ComboboxRow = BaseCombobox.Row;
export const ComboboxItem = BaseCombobox.Item;
export const ComboboxItemIndicator = BaseCombobox.ItemIndicator;
export const ComboboxGroup = BaseCombobox.Group;
export const ComboboxGroupLabel = BaseCombobox.GroupLabel;
export const ComboboxSeparator = BaseCombobox.Separator;
export const ComboboxCollection = BaseCombobox.Collection;
export const useComboboxFilter = BaseCombobox.useFilter;
export const useComboboxFilteredItems = BaseCombobox.useFilteredItems;
export const createComboboxItems = BaseCombobox.createItems;

