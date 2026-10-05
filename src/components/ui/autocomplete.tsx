/**
 * Autocomplete primitive (@base-ui/react/autocomplete).
 *
 * Base UI Documentation: https://base-ui.com/react/components/autocomplete
 *
 * TAXONOMY & USAGE:
 * - Use Autocomplete for freeform text search inputs with dynamic completion suggestions
 *   where the user can either select a suggestion or type their own custom query.
 * - For selecting one or more values from a closed set where selections submit explicit item keys,
 *   use Combobox or Select instead.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   flush selection indicator, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cn } from '@/lib/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteProps<ItemValue = AutocompleteOption> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options?: AutocompleteOption[];
  items?: readonly ItemValue[];
  filteredItems?: readonly ItemValue[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (val: string | null, eventDetails?: BaseAutocomplete.Root.ChangeEventDetails) => void;
  onSelect?: (val: string | null) => void;
  mode?: 'list' | 'both' | 'inline' | 'none';
  autoHighlight?: boolean | 'always';
  keepHighlight?: boolean;
  highlightItemOnHover?: boolean;
  openOnInputClick?: boolean;
  submitOnItemClick?: boolean;
  leadingIcon?: React.ReactNode;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;
  inputClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  children?: React.ReactNode;
}

const AutocompleteComponent = React.forwardRef<HTMLDivElement, AutocompleteProps<any>>(
  (
    {
      label,
      description,
      placeholder = 'Type to search...',
      options,
      items,
      filteredItems,
      value,
      defaultValue,
      onValueChange,
      onSelect,
      mode = 'list',
      autoHighlight,
      keepHighlight,
      highlightItemOnHover = true,
      openOnInputClick = true,
      submitOnItemClick = false,
      leadingIcon = (
        <span className="material-symbols-outlined text-xl select-none" aria-hidden="true">
          search
        </span>
      ),
      clearable = true,
      disabled = false,
      required = false,
      error,
      side = 'bottom',
      align = 'start',
      sideOffset = 6,
      alignOffset,
      collisionPadding = 8,
      className,
      inputClassName,
      inputRef,
      children,
      ...props
    },
    ref
  ) => {
    // If children are provided, render as composable compound wrapper
    if (children) {
      return (
        <BaseAutocomplete.Root
          items={items ?? options}
          filteredItems={filteredItems}
          value={value === null ? '' : value}
          defaultValue={defaultValue === null ? undefined : defaultValue}
          onValueChange={(val, details) => onValueChange?.(val ? val : null, details)}
          mode={mode}
          autoHighlight={autoHighlight}
          keepHighlight={keepHighlight}
          highlightItemOnHover={highlightItemOnHover}
          openOnInputClick={openOnInputClick}
          submitOnItemClick={submitOnItemClick}
          disabled={disabled}
        >
          {children}
        </BaseAutocomplete.Root>
      );
    }

    const hasLeading = Boolean(leadingIcon);
    const resolvedItems = React.useMemo(() => {
      if (options) return options;
      return items ?? [];
    }, [options, items]);

    const handleValueChange = (
      val: string,
      eventDetails: BaseAutocomplete.Root.ChangeEventDetails
    ) => {
      onValueChange?.(val ? val : null, eventDetails);
      if (onSelect) {
        const trimmed = (val ?? '').trim();
        if (!trimmed) {
          onSelect(null);
          return;
        }
        if (options) {
          const matched = options.find(
            (opt) =>
              opt.label.toLowerCase() === trimmed.toLowerCase() ||
              opt.value.toLowerCase() === trimmed.toLowerCase()
          );
          onSelect(matched ? matched.value : val);
        } else {
          onSelect(val);
        }
      }
    };

    const filterFn = React.useCallback(
      (item: AutocompleteOption, query: string) => {
        if (!query) return true;
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return true;

        const itemLabel = (item?.label ?? '').toLowerCase();
        const itemVal = (item?.value ?? '').toLowerCase();
        return itemLabel.includes(normalizedQuery) || itemVal.includes(normalizedQuery);
      },
      []
    );

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
          items={resolvedItems}
          itemToStringValue={(item) => (typeof item === 'string' ? item : item?.label ?? '')}
          value={value === null ? '' : value}
          defaultValue={defaultValue === null ? undefined : defaultValue}
          onValueChange={handleValueChange}
          filter={filterFn}
          mode={mode}
          autoHighlight={autoHighlight}
          keepHighlight={keepHighlight}
          highlightItemOnHover={highlightItemOnHover}
          openOnInputClick={openOnInputClick}
          submitOnItemClick={submitOnItemClick}
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
                'w-full h-12 rounded bg-surface border border-outline text-on-surface font-sans text-base transition-[border-color,box-shadow] placeholder:text-on-surface-variant/60 min-h-[48px]',
                'focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
                error && 'border-error focus-visible:border-error focus-visible:outline-error',
                hasLeading ? 'pl-11' : 'pl-4',
                clearable ? 'pr-11' : 'pr-4',
                inputClassName
              )}
            />
            {clearable && (
              <BaseAutocomplete.Clear
                aria-label="Clear input"
                className="absolute right-3.5 p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary transition-colors cursor-pointer flex items-center justify-center min-w-[28px] min-h-[28px]"
              >
                <span className="material-symbols-outlined text-lg leading-none select-none" aria-hidden="true">
                  close
                </span>
              </BaseAutocomplete.Clear>
            )}
            <BaseAutocomplete.Portal>
              <BaseAutocomplete.Positioner
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                collisionPadding={collisionPadding}
                className="z-50 outline-none"
              >
                <BaseAutocomplete.Popup className="min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-lg bg-surface border border-outline-variant shadow-modal transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none">
                  <BaseAutocomplete.Empty className="px-3 py-2.5 font-sans text-sm text-on-surface-variant">
                    No matching options found
                  </BaseAutocomplete.Empty>
                  <BaseAutocomplete.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none data-[empty]:p-0">
                    {(opt: AutocompleteOption) => (
                      <BaseAutocomplete.Item
                        key={opt.value}
                        value={opt}
                        disabled={opt.disabled}
                        className="flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-sm font-sans text-sm font-medium text-on-surface hover:bg-surface-container hover:text-on-surface data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed cursor-pointer transition-colors select-none outline-none"
                      >
                        <span className="truncate">{opt.label}</span>
                      </BaseAutocomplete.Item>
                    )}
                  </BaseAutocomplete.List>
                </BaseAutocomplete.Popup>
              </BaseAutocomplete.Positioner>
            </BaseAutocomplete.Portal>
          </BaseAutocomplete.InputGroup>
        </BaseAutocomplete.Root>
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

export default Autocomplete;
