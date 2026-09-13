import * as React from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cn } from '@/lib/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  options: AutocompleteOption[];
  value?: string | null;
  onValueChange?: (val: string | null) => void;
  mode?: 'list' | 'both' | 'inline' | 'none';
  autoHighlight?: boolean | 'always';
  keepHighlight?: boolean;
  openOnInputClick?: boolean;
  className?: string;
}

const AutocompleteComponent: React.FC<AutocompleteProps> = ({
  label,
  placeholder = 'Type to search...',
  options,
  value,
  onValueChange,
  mode = 'list',
  autoHighlight,
  keepHighlight,
  openOnInputClick,
  className,
}) => {
  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <label className="block font-label text-xs font-semibold text-on-surface-variant">
          {label}
        </label>
      )}
      <BaseAutocomplete.Root
        items={options}
        itemToStringValue={(item) => (typeof item === 'string' ? item : item?.label ?? '')}
        value={value ?? ''}
        onValueChange={(val) => onValueChange?.(val || null)}
        mode={mode}
        autoHighlight={autoHighlight}
        keepHighlight={keepHighlight}
        openOnInputClick={openOnInputClick}
      >
        <BaseAutocomplete.Status className="sr-only" />
        <BaseAutocomplete.InputGroup className="relative w-full">
          <BaseAutocomplete.Input
            placeholder={placeholder}
            className="w-full h-12 px-4 rounded-[0.5rem] bg-surface border-[1px] border-outline text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary transition-all min-h-[48px]"
          />
          <BaseAutocomplete.Portal>
            <BaseAutocomplete.Positioner sideOffset={6} className="z-50 outline-none">
              <BaseAutocomplete.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]">
                <BaseAutocomplete.Empty className="px-3 py-2 text-xs font-sans text-on-surface-variant">
                  No matching options found
                </BaseAutocomplete.Empty>
                <BaseAutocomplete.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-1 outline-none data-[empty]:p-0">
                  {(opt: AutocompleteOption) => (
                    <BaseAutocomplete.Item
                      key={opt.value}
                      value={opt}
                      className="flex items-center justify-between px-3 py-2 rounded-[0.375rem] font-sans text-sm text-on-surface hover:bg-primary/10 hover:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary cursor-pointer transition-colors"
                    >
                      <span>{opt.label}</span>
                    </BaseAutocomplete.Item>
                  )}
                </BaseAutocomplete.List>
              </BaseAutocomplete.Popup>
            </BaseAutocomplete.Positioner>
          </BaseAutocomplete.Portal>
        </BaseAutocomplete.InputGroup>
      </BaseAutocomplete.Root>
    </div>
  );
};

// Compound Base UI exports
export const Autocomplete = Object.assign(AutocompleteComponent, {
  Root: BaseAutocomplete.Root,
  Input: BaseAutocomplete.Input,
  InputGroup: BaseAutocomplete.InputGroup,
  Trigger: BaseAutocomplete.Trigger,
  Icon: BaseAutocomplete.Icon,
  Clear: BaseAutocomplete.Clear,
  Value: BaseAutocomplete.Value,
  Portal: BaseAutocomplete.Portal,
  Backdrop: BaseAutocomplete.Backdrop,
  Positioner: BaseAutocomplete.Positioner,
  Popup: BaseAutocomplete.Popup,
  Arrow: BaseAutocomplete.Arrow,
  Status: BaseAutocomplete.Status,
  Empty: BaseAutocomplete.Empty,
  List: BaseAutocomplete.List,
  Row: BaseAutocomplete.Row,
  Item: BaseAutocomplete.Item,
  Group: BaseAutocomplete.Group,
  GroupLabel: BaseAutocomplete.GroupLabel,
  Separator: BaseAutocomplete.Separator,
  Collection: BaseAutocomplete.Collection,
  useFilter: BaseAutocomplete.useFilter,
  useFilteredItems: BaseAutocomplete.useFilteredItems,
});

export { BaseAutocomplete };
export const AutocompleteRoot = BaseAutocomplete.Root;
export const AutocompleteInput = BaseAutocomplete.Input;
export const AutocompleteInputGroup = BaseAutocomplete.InputGroup;
export const AutocompleteTrigger = BaseAutocomplete.Trigger;
export const AutocompleteIcon = BaseAutocomplete.Icon;
export const AutocompleteClear = BaseAutocomplete.Clear;
export const AutocompleteValue = BaseAutocomplete.Value;
export const AutocompletePortal = BaseAutocomplete.Portal;
export const AutocompleteBackdrop = BaseAutocomplete.Backdrop;
export const AutocompletePositioner = BaseAutocomplete.Positioner;
export const AutocompletePopup = BaseAutocomplete.Popup;
export const AutocompleteArrow = BaseAutocomplete.Arrow;
export const AutocompleteStatus = BaseAutocomplete.Status;
export const AutocompleteEmpty = BaseAutocomplete.Empty;
export const AutocompleteList = BaseAutocomplete.List;
export const AutocompleteRow = BaseAutocomplete.Row;
export const AutocompleteItem = BaseAutocomplete.Item;
export const AutocompleteGroup = BaseAutocomplete.Group;
export const AutocompleteGroupLabel = BaseAutocomplete.GroupLabel;
export const AutocompleteSeparator = BaseAutocomplete.Separator;
export const AutocompleteCollection = BaseAutocomplete.Collection;
export const useAutocompleteFilter = BaseAutocomplete.useFilter;
export const useAutocompleteFilteredItems = BaseAutocomplete.useFilteredItems;

