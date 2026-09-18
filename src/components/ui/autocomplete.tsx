import * as React from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cn } from '@/lib/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options: AutocompleteOption[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (val: string | null) => void;
  mode?: 'list' | 'both' | 'inline' | 'none';
  autoHighlight?: boolean | 'always';
  keepHighlight?: boolean;
  openOnInputClick?: boolean;
  leadingIcon?: React.ReactNode;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  className?: string;
  inputClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const AutocompleteComponent = React.forwardRef<HTMLDivElement, AutocompleteProps>(({
  label,
  description,
  placeholder = 'Type to search...',
  options,
  value,
  defaultValue,
  onValueChange,
  mode = 'list',
  autoHighlight,
  keepHighlight,
  openOnInputClick,
  leadingIcon = (
    <span className="material-symbols-outlined text-xl select-none" aria-hidden="true">
      search
    </span>
  ),
  clearable = true,
  disabled,
  required,
  error,
  className,
  inputClassName,
  inputRef,
  ...props
}, ref) => {
  const hasLeading = Boolean(leadingIcon);

  return (
    <div ref={ref} className={cn('space-y-1.5 w-full', className)} {...props}>
      {label && (
        <label className="block font-label text-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      {description && (
        <span className="block font-sans text-sm text-on-surface-variant">
          {description}
        </span>
      )}
      <BaseAutocomplete.Root
        items={options}
        itemToStringValue={(item) => (typeof item === 'string' ? item : item?.label ?? '')}
        value={value ?? undefined}
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange?.(val || null)}
        mode={mode}
        autoHighlight={autoHighlight}
        keepHighlight={keepHighlight}
        openOnInputClick={openOnInputClick}
        disabled={disabled}
      >
        <BaseAutocomplete.Status className="sr-only" />
        <BaseAutocomplete.InputGroup className="relative flex items-center w-full">
          {hasLeading && (
            <span
              className="text-on-surface-variant absolute left-3.5 flex items-center pointer-events-none text-xl select-none z-10"
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          )}
          <BaseAutocomplete.Input
            ref={inputRef}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full h-12 rounded bg-surface border-[1px] border-outline text-on-surface font-sans text-base transition-colors placeholder:text-on-surface-variant/60',
              'focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary',
              'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:outline-error',
              hasLeading ? 'pl-11' : 'pl-4',
              clearable ? 'pr-11' : 'pr-4',
              inputClassName
            )}
          />
          {clearable && (
            <BaseAutocomplete.Clear
              aria-label="Clear input"
              className="absolute right-3.5 p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary transition-colors cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg leading-none select-none" aria-hidden="true">
                close
              </span>
            </BaseAutocomplete.Clear>
          )}
          <BaseAutocomplete.Portal>
            <BaseAutocomplete.Positioner sideOffset={6} className="z-50 outline-none">
              <BaseAutocomplete.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded bg-surface border-[1px] border-outline-variant shadow-floating transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]">
                <BaseAutocomplete.Empty className="px-3 py-2 font-sans text-sm text-on-surface-variant">
                  No matching options found
                </BaseAutocomplete.Empty>
                <BaseAutocomplete.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-1 outline-none data-[empty]:p-0">
                  {(opt: AutocompleteOption) => (
                    <BaseAutocomplete.Item
                      key={opt.value}
                      value={opt}
                      className="flex items-center justify-between px-3 py-2 rounded-sm font-sans text-sm text-on-surface hover:bg-surface-container hover:text-on-surface data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface data-[selected]:bg-primary/10 data-[selected]:text-primary cursor-pointer transition-colors"
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
      {typeof error === 'string' && (
        <div className="flex items-center gap-1.5 font-sans text-sm text-error" role="alert">
          <span className="material-symbols-outlined text-base select-none shrink-0" aria-hidden="true">
            error
          </span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

AutocompleteComponent.displayName = 'Autocomplete';

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

