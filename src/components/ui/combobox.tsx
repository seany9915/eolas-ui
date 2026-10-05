/**
 * Combobox primitive (@base-ui/react/combobox).
 *
 * Base UI Documentation: https://base-ui.com/react/components/combobox
 *
 * TAXONOMY & USAGE:
 * - Use Combobox for selecting one or multiple values from a list of options with text filtering.
 * - Supports multi-selection with inline chips (Combobox.Chips, Combobox.Chip, Combobox.ChipRemove).
 * - For freeform text searches where custom unlisted queries are valid, use Autocomplete instead.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   flush selection indicator, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type ComboboxItem = ComboboxOption;

export interface ComboboxGroupOption {
  label: string;
  options: ComboboxOption[];
}

export type ComboboxGroupItem = ComboboxGroupOption;

export interface ComboboxProps<ItemValue = ComboboxOption> {
  label?: React.ReactNode;
  placeholder?: string;
  options?: ComboboxOption[];
  items?: readonly ItemValue[];
  groups?: ComboboxGroupOption[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  inputValue?: string;
  defaultInputValue?: string;
  onValueChange?: (val: string | null) => void;
  onInputValueChange?: (input: string, eventDetails?: BaseCombobox.Root.ChangeEventDetails) => void;
  onChange?: (val: string | null) => void;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  error?: boolean | string;
  description?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  children?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

const ComboboxComponent = React.forwardRef<HTMLDivElement, ComboboxProps<any>>(
  (
    {
      label,
      placeholder = 'Select option...',
      options,
      items,
      groups,
      value,
      defaultValue,
      inputValue,
      defaultInputValue,
      onValueChange,
      onInputValueChange,
      onChange,
      multiple = false,
      clearable = true,
      disabled = false,
      name,
      id,
      error,
      description,
      side = 'bottom',
      align = 'start',
      sideOffset = 6,
      alignOffset,
      collisionPadding = 8,
      children,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const comboboxId = id || `combobox-${generatedId}`;
    const descriptionId = description ? `${comboboxId}-desc` : undefined;
    const errorId = error ? `${comboboxId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    const isControlled = value !== undefined;

    const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
      const list = options ?? (items as ComboboxOption[] | undefined);
      if (list && list.length > 0) {
        return list.map((opt, index) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: String(opt), label: String(opt), disabled: false };
          }
          return {
            value: String(opt?.value ?? opt?.label ?? index),
            label: String(opt?.label ?? opt?.value ?? index),
            disabled: !!opt?.disabled,
          };
        });
      }
      if (groups && groups.length > 0) {
        return groups.flatMap((group) =>
          (group.options || []).map((opt, index) => {
            if (typeof opt === 'string' || typeof opt === 'number') {
              return { value: String(opt), label: String(opt), disabled: false };
            }
            return {
              value: String(opt?.value ?? opt?.label ?? index),
              label: String(opt?.label ?? opt?.value ?? index),
              disabled: !!opt?.disabled,
            };
          })
        );
      }
      return [];
    }, [options, items, groups]);

    const normalizedGroups = React.useMemo(() => {
      if (!groups) return null;
      return groups.map((g) => ({
        label: String(g.label || ''),
        options: (g.options || []).map((opt, index) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: String(opt), label: String(opt), disabled: false };
          }
          return {
            value: String(opt?.value ?? opt?.label ?? index),
            label: String(opt?.label ?? opt?.value ?? index),
            disabled: !!opt?.disabled,
          };
        }),
      }));
    }, [groups]);

    // Manage uncontrolled state internally so clear actions cleanly reset to null
    const [internalValue, setInternalValue] = React.useState<string | null>(
      typeof defaultValue === 'string' ? defaultValue : null
    );
    const effectiveValue = isControlled ? (typeof value === 'string' ? value : null) : internalValue;

    // Find selected item object
    const selectedItem = React.useMemo(() => {
      if (!effectiveValue) return null;
      return normalizedOptions.find((opt) => opt.value === effectiveValue) ?? null;
    }, [normalizedOptions, effectiveValue]);

    const handleValueChange = (selected: ComboboxOption | null) => {
      const val = selected ? selected.value : null;
      if (!isControlled) {
        setInternalValue(val);
      }
      onValueChange?.(val);
      onChange?.(val);
    };

    const handleInputValueChange = (
      text: string,
      eventDetails?: BaseCombobox.Root.ChangeEventDetails
    ) => {
      onInputValueChange?.(text, eventDetails);
      // When the user clears the input or writes custom text, clear the previous selected state
      if (
        eventDetails?.reason === 'input-change' ||
        eventDetails?.reason === 'input-clear' ||
        eventDetails?.reason === 'clear-press'
      ) {
        const currentLabel = selectedItem?.label ?? '';
        if (text.trim() === '' || text !== currentLabel) {
          if (effectiveValue || selectedItem) {
            if (!isControlled) {
              setInternalValue(null);
            }
            onValueChange?.(null);
            onChange?.(null);
          }
        }
      }
    };

    if (children) {
      return (
        <BaseCombobox.Root
          items={normalizedOptions}
          value={selectedItem}
          onValueChange={handleValueChange}
          onInputValueChange={handleInputValueChange}
          itemToStringLabel={(opt: ComboboxOption | null) => opt?.label ?? ''}
          itemToStringValue={(opt: ComboboxOption | null) => opt?.value ?? ''}
          isItemEqualToValue={(opt: ComboboxOption, val: ComboboxOption) => opt?.value === val?.value}
          disabled={disabled}
        >
          {children}
        </BaseCombobox.Root>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-1.5 w-full', className)} {...props}>
        <BaseCombobox.Root
          items={normalizedOptions}
          value={selectedItem}
          inputValue={inputValue}
          defaultInputValue={defaultInputValue}
          onValueChange={handleValueChange}
          onInputValueChange={handleInputValueChange}
          itemToStringLabel={(opt: ComboboxOption | null) => opt?.label ?? ''}
          itemToStringValue={(opt: ComboboxOption | null) => opt?.value ?? ''}
          isItemEqualToValue={(opt: ComboboxOption, val: ComboboxOption) => opt?.value === val?.value}
          disabled={disabled}
        >
          <BaseCombobox.Status className="sr-only" />
          {label && (
            <BaseCombobox.Label className="block font-label text-xs font-semibold text-on-surface-variant cursor-pointer select-none">
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
              name={name || comboboxId}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              className={cn(
                'w-full h-12 pl-4 pr-16 rounded-md bg-surface border border-outline text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 min-h-[48px]',
                'transition-[border-color,box-shadow]',
                'focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
                error && 'border-error focus-visible:border-error focus-visible:outline-error',
                inputClassName
              )}
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              {clearable && (
                <BaseCombobox.Clear
                  className="size-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                  aria-label="Clear selection"
                >
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    close
                  </span>
                </BaseCombobox.Clear>
              )}
              <BaseCombobox.Trigger
                disabled={disabled}
                className="size-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Open options"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  unfold_more
                </span>
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
                <BaseCombobox.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-lg bg-surface border border-outline-variant shadow-modal transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none">
                  <BaseCombobox.Empty className="px-3 py-2.5 text-xs font-sans text-on-surface-variant">
                    No matching options found
                  </BaseCombobox.Empty>
                  <BaseCombobox.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none data-[empty]:p-0">
                    {normalizedGroups ? (
                      normalizedGroups.map((group) => (
                        <BaseCombobox.Group key={group.label} items={group.options} className="py-1">
                          {group.label && (
                            <BaseCombobox.GroupLabel className="sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/40 select-none">
                              {group.label}
                            </BaseCombobox.GroupLabel>
                          )}
                          <BaseCombobox.Collection>
                            {(opt: ComboboxOption) => (
                              <BaseCombobox.Item
                                key={opt.value}
                                value={opt}
                                disabled={opt.disabled}
                                className="flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm text-on-surface hover:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed cursor-pointer transition-colors select-none outline-none"
                              >
                                <BaseCombobox.ItemIndicator
                                  keepMounted
                                  className="size-5 flex items-center justify-center text-on-primary-container shrink-0 opacity-0 data-[selected]:opacity-100 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-base font-bold">check</span>
                                </BaseCombobox.ItemIndicator>
                                <span className="flex-1 truncate">{opt.label}</span>
                              </BaseCombobox.Item>
                            )}
                          </BaseCombobox.Collection>
                        </BaseCombobox.Group>
                      ))
                    ) : (
                      (opt: ComboboxOption) => (
                        <BaseCombobox.Item
                          key={opt.value}
                          value={opt}
                          disabled={opt.disabled}
                          className="flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm text-on-surface hover:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed cursor-pointer transition-colors select-none outline-none"
                        >
                          <BaseCombobox.ItemIndicator
                            keepMounted
                            className="size-5 flex items-center justify-center text-on-primary-container shrink-0 opacity-0 data-[selected]:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-base font-bold">check</span>
                          </BaseCombobox.ItemIndicator>
                          <span className="flex-1 truncate">{opt.label}</span>
                        </BaseCombobox.Item>
                      )
                    )}
                  </BaseCombobox.List>
                </BaseCombobox.Popup>
              </BaseCombobox.Positioner>
            </BaseCombobox.Portal>
          </BaseCombobox.InputGroup>
        </BaseCombobox.Root>
        {typeof error === 'string' && error && (
          <div className="flex items-center gap-1.5 font-sans text-sm font-semibold text-error select-none mt-1" role="alert">
            <span className="material-symbols-outlined text-base select-none shrink-0" aria-hidden="true">
              error
            </span>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

ComboboxComponent.displayName = 'Combobox';

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

export default Combobox;
