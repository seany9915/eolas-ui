'use client';

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
import { ScrollArea } from './scroll-area';
import { cn, composeClassName } from '@/lib/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export type AutocompleteItem = AutocompleteOption;

export interface AutocompleteGroupOption<Item = AutocompleteOption> {
  label: string;
  items: readonly Item[];
  options?: readonly Item[];
  [key: string]: unknown;
}

export type AutocompleteGroupItem = AutocompleteGroupOption;

function isAutocompleteGroupedArray<ItemValue>(
  val:
    | readonly ItemValue[]
    | readonly { items: readonly ItemValue[]; [key: string]: unknown }[]
): val is readonly { items: readonly ItemValue[]; [key: string]: unknown }[] {
  if (!Array.isArray(val) || val.length === 0) return false;
  const first = val[0];
  return (
    typeof first === 'object' &&
    first !== null &&
    'items' in first &&
    Array.isArray((first as { items?: unknown }).items)
  );
}

function isAutocompleteGroupInput<ItemValue>(
  val: readonly unknown[] | undefined
): val is readonly AutocompleteGroupOption<ItemValue>[] {
  if (!Array.isArray(val) || val.length === 0) return false;
  const first = val[0];
  return (
    typeof first === 'object' &&
    first !== null &&
    (('items' in first && Array.isArray((first as { items?: unknown }).items)) ||
      ('options' in first && Array.isArray((first as { options?: unknown }).options)))
  );
}

function normalizeAutocompleteEntry<ItemValue>(
  entry: ItemValue,
  index: number,
  itemToStringValue?: (itemValue: ItemValue) => string
): AutocompleteOption {
  if (typeof entry === 'string' || typeof entry === 'number') {
    const s = String(entry);
    return { value: s, label: s, disabled: false };
  }
  if (entry && typeof entry === 'object') {
    const obj = entry as Record<string, unknown>;
    const fallback = itemToStringValue ? itemToStringValue(entry) : undefined;
    const resolvedValue = obj.value ?? obj.label ?? fallback ?? index;
    const resolvedLabel = obj.label ?? obj.value ?? fallback ?? index;
    return {
      ...obj,
      value: String(resolvedValue),
      label: String(resolvedLabel),
      disabled: Boolean(obj.disabled),
    };
  }
  const fallback = itemToStringValue ? itemToStringValue(entry) : String(index);
  return { value: fallback, label: fallback, disabled: false };
}

function normalizeAutocompleteGroupList<ItemValue>(
  rawGroups: readonly AutocompleteGroupOption<ItemValue>[] | undefined,
  itemToStringValue?: (itemValue: ItemValue) => string
): AutocompleteGroupOption[] | undefined {
  if (!rawGroups || rawGroups.length === 0) return undefined;
  return rawGroups.map((g) => {
    const { options: _rawOptions, items: _rawItems, ...restGroup } = g;
    const list = (_rawItems ?? _rawOptions ?? []) as readonly ItemValue[];
    return {
      ...restGroup,
      label: String(g.label || ''),
      items: list.map((opt, idx) => normalizeAutocompleteEntry(opt, idx, itemToStringValue)),
    };
  });
}

export interface AutocompleteProps<ItemValue = AutocompleteOption>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'onSelect' | 'defaultValue' | 'children'
  > {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options?: AutocompleteOption[];
  groups?: AutocompleteGroupOption<ItemValue>[];
  items?: BaseAutocomplete.Root.Props<ItemValue>['items'];
  filteredItems?: BaseAutocomplete.Root.Props<ItemValue>['filteredItems'];
  filter?: BaseAutocomplete.Root.Props<ItemValue>['filter'];
  mode?: 'list' | 'both' | 'inline' | 'none';
  inline?: boolean;
  autoHighlight?: boolean | 'always';
  keepHighlight?: boolean;
  highlightItemOnHover?: boolean;
  openOnInputClick?: boolean;
  submitOnItemClick?: boolean;
  itemToStringValue?: (itemValue: ItemValue) => string;
  actionsRef?: React.RefObject<BaseAutocomplete.Root.Actions | null>;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (val: string, eventDetails: BaseAutocomplete.Root.ChangeEventDetails) => void;
  onChange?: (val: string) => void;
  onSelect?: (option: AutocompleteOption | string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseAutocomplete.Root.ChangeEventDetails) => void;
  onItemHighlighted?: (item: ItemValue | undefined, eventDetails: BaseAutocomplete.Root.HighlightEventDetails) => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  clearable?: boolean;
  showTrigger?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  form?: string;
  autoComplete?: string;
  error?: boolean | string;
  container?: BaseAutocomplete.Portal.Props['container'];
  anchor?: BaseAutocomplete.Positioner.Props['anchor'];
  side?: BaseAutocomplete.Positioner.Props['side'];
  align?: BaseAutocomplete.Positioner.Props['align'];
  sideOffset?: BaseAutocomplete.Positioner.Props['sideOffset'];
  alignOffset?: BaseAutocomplete.Positioner.Props['alignOffset'];
  collisionPadding?: BaseAutocomplete.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseAutocomplete.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseAutocomplete.Positioner.Props['collisionAvoidance'];
  positionerClassName?: BaseAutocomplete.Positioner.Props['className'];
  popupClassName?: BaseAutocomplete.Popup.Props['className'];
  listClassName?: BaseAutocomplete.List.Props['className'];
  inputGroupClassName?: BaseAutocomplete.InputGroup.Props['className'];
  inputClassName?: BaseAutocomplete.Input.Props['className'];
  emptyMessage?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  inputRef?: React.Ref<HTMLInputElement>;
  children?: React.ReactNode;
  className?: string;
}

function AutocompleteComponentInner<ItemValue = AutocompleteOption>(
  {
    label,
    description,
    placeholder = 'Type to search...',
    options,
    groups,
    items,
    filteredItems,
    filter,
    mode = 'list',
    inline = false,
    autoHighlight,
    keepHighlight,
    highlightItemOnHover = true,
    openOnInputClick = true,
    submitOnItemClick = false,
    itemToStringValue,
    actionsRef,
    value,
    defaultValue,
    onValueChange,
    onChange,
    onSelect,
    open,
    defaultOpen,
    onOpenChange,
    onItemHighlighted,
    leadingIcon = (
      <span className="material-symbols-outlined text-lg select-none" aria-hidden="true">
        search
      </span>
    ),
    trailingIcon,
    clearable = true,
    showTrigger = false,
    disabled = false,
    readOnly = false,
    required = false,
    name,
    id,
    form,
    autoComplete,
    error,
    container,
    anchor,
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    alignOffset = 0,
    collisionPadding = 8,
    collisionBoundary,
    collisionAvoidance,
    positionerClassName,
    popupClassName,
    listClassName,
    inputGroupClassName,
    inputClassName,
    emptyMessage = 'No matching suggestions found',
    size = 'md',
    inputRef,
    children,
    className,
    ...props
  }: AutocompleteProps<ItemValue>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
    const generatedId = React.useId();
    const autocompleteId = id || `autocomplete-${generatedId}`;
    const descriptionId = description ? `${autocompleteId}-desc` : undefined;
    const errorId = typeof error === 'string' && error ? `${autocompleteId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    // Normalize flat options while preserving any caller metadata fields
    const normalizedOptions = React.useMemo<readonly AutocompleteOption[]>(() => {
      const list = options ?? (items && !isAutocompleteGroupedArray(items) ? items : undefined);
      if (list && list.length > 0) {
        return list.map((opt, index) =>
          normalizeAutocompleteEntry(opt as ItemValue, index, itemToStringValue)
        );
      }
      return [];
    }, [options, items, itemToStringValue]);

    // Normalize grouped options while preserving custom group/item fields
    const normalizedGroups = React.useMemo<readonly AutocompleteGroupOption[] | null>(() => {
      const normalized = normalizeAutocompleteGroupList(groups, itemToStringValue);
      return normalized ?? null;
    }, [groups, itemToStringValue]);

    const normalizedFilteredGroups = React.useMemo(() => {
      if (!filteredItems || !isAutocompleteGroupInput<ItemValue>(filteredItems)) return undefined;
      return normalizeAutocompleteGroupList(filteredItems, itemToStringValue);
    }, [filteredItems, itemToStringValue]);

    // Default itemToStringValue handles both string and object shapes
    const defaultItemToStringValue = React.useCallback(
      (item: unknown) => {
        if (typeof item === 'string' || typeof item === 'number') return String(item);
        if (item && typeof item === 'object') {
          const obj = item as { label?: unknown; value?: unknown };
          return String(obj.label ?? obj.value ?? '');
        }
        return '';
      },
      []
    );

    // Unify onValueChange and onChange without suppressing eventDetails
    const handleValueChange = (
      val: string,
      eventDetails: BaseAutocomplete.Root.ChangeEventDetails
    ) => {
      onValueChange?.(val, eventDetails);
      onChange?.(val);

      // Typing is not a selection; only commits (item press, clear, etc.) report through onSelect.
      if (onSelect && eventDetails.reason !== 'input-change') {
        const trimmed = (val ?? '').trim();
        if (!trimmed) {
          onSelect(null);
          return;
        }
        const candidates = normalizedGroups?.length
          ? normalizedGroups.flatMap((g) => g.items)
          : normalizedOptions;
        const matched = candidates.find(
          (opt) =>
            opt.label.toLowerCase() === trimmed.toLowerCase() ||
            opt.value.toLowerCase() === trimmed.toLowerCase()
        );
        onSelect(matched ?? val);
      }
    };

    const wrapCompoundRoot = (rootNode: React.JSX.Element) => {
      if (ref != null || className !== undefined || Object.keys(props).length > 0) {
        return (
          <div ref={ref} className={className} {...props}>
            {rootNode}
          </div>
        );
      }
      return rootNode;
    };

    // If children are provided, this is a compositional/compound Autocomplete
    if (children) {
      if (normalizedGroups && normalizedGroups.length > 0) {
        return wrapCompoundRoot(
          <BaseAutocomplete.Root
            items={normalizedGroups}
            filteredItems={
              normalizedFilteredGroups ??
              (filteredItems as readonly AutocompleteGroupOption[] | undefined)
            }
            value={value === null ? '' : value}
            defaultValue={defaultValue === null ? undefined : defaultValue}
            onValueChange={handleValueChange}
            mode={mode}
            inline={inline}
            autoHighlight={autoHighlight}
            keepHighlight={keepHighlight}
            highlightItemOnHover={highlightItemOnHover}
            openOnInputClick={openOnInputClick}
            submitOnItemClick={submitOnItemClick}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            id={id}
            form={form}
            actionsRef={actionsRef}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            onItemHighlighted={
              onItemHighlighted as BaseAutocomplete.Root.Props<AutocompleteOption>['onItemHighlighted']
            }
            itemToStringValue={
              (itemToStringValue as ((itemValue: AutocompleteOption) => string) | undefined) ??
              defaultItemToStringValue
            }
            filter={filter as BaseAutocomplete.Root.Props<AutocompleteOption>['filter']}
          >
            {children}
          </BaseAutocomplete.Root>
        );
      }

      if (items !== undefined && !options) {
        if (isAutocompleteGroupedArray(items)) {
          return wrapCompoundRoot(
            <BaseAutocomplete.Root
              items={items}
              filteredItems={filteredItems}
              value={value === null ? '' : value}
              defaultValue={defaultValue === null ? undefined : defaultValue}
              onValueChange={handleValueChange}
              mode={mode}
              inline={inline}
              autoHighlight={autoHighlight}
              keepHighlight={keepHighlight}
              highlightItemOnHover={highlightItemOnHover}
              openOnInputClick={openOnInputClick}
              submitOnItemClick={submitOnItemClick}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              name={name}
              id={id}
              form={form}
              actionsRef={actionsRef}
              open={open}
              defaultOpen={defaultOpen}
              onOpenChange={onOpenChange}
              onItemHighlighted={onItemHighlighted}
              itemToStringValue={itemToStringValue}
              filter={filter}
            >
              {children}
            </BaseAutocomplete.Root>
          );
        }

        return wrapCompoundRoot(
          <BaseAutocomplete.Root
            items={items}
            filteredItems={filteredItems as readonly ItemValue[] | undefined}
            value={value === null ? '' : value}
            defaultValue={defaultValue === null ? undefined : defaultValue}
            onValueChange={handleValueChange}
            mode={mode}
            inline={inline}
            autoHighlight={autoHighlight}
            keepHighlight={keepHighlight}
            highlightItemOnHover={highlightItemOnHover}
            openOnInputClick={openOnInputClick}
            submitOnItemClick={submitOnItemClick}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            id={id}
            form={form}
            actionsRef={actionsRef}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            onItemHighlighted={onItemHighlighted}
            itemToStringValue={itemToStringValue}
            filter={filter}
          >
            {children}
          </BaseAutocomplete.Root>
        );
      }

      return wrapCompoundRoot(
        <BaseAutocomplete.Root
          items={normalizedOptions}
          filteredItems={filteredItems as readonly AutocompleteOption[] | undefined}
          value={value === null ? '' : value}
          defaultValue={defaultValue === null ? undefined : defaultValue}
          onValueChange={handleValueChange}
          mode={mode}
          inline={inline}
          autoHighlight={autoHighlight}
          keepHighlight={keepHighlight}
          highlightItemOnHover={highlightItemOnHover}
          openOnInputClick={openOnInputClick}
          submitOnItemClick={submitOnItemClick}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          id={id}
          form={form}
          actionsRef={actionsRef}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onItemHighlighted={
            onItemHighlighted as BaseAutocomplete.Root.Props<AutocompleteOption>['onItemHighlighted']
          }
          itemToStringValue={
            (itemToStringValue as ((itemValue: AutocompleteOption) => string) | undefined) ??
            defaultItemToStringValue
          }
          filter={filter as BaseAutocomplete.Root.Props<AutocompleteOption>['filter']}
        >
          {children}
        </BaseAutocomplete.Root>
      );
    }

    const hasLeading = Boolean(leadingIcon);
    const hasTrailing = Boolean(trailingIcon);


    const listContent = (
      <AutocompleteList className={listClassName}>
        {normalizedGroups && normalizedGroups.length > 0 ? (
          (group: AutocompleteGroupOption) => (
            <AutocompleteGroup key={group.label} items={group.items}>
              {group.label && <AutocompleteGroupLabel>{group.label}</AutocompleteGroupLabel>}
              <BaseAutocomplete.Collection>
                {(opt: AutocompleteOption) => (
                  <AutocompleteItem
                    key={opt.value}
                    value={opt}
                    disabled={opt.disabled}
                  >
                    <span className="truncate">{opt.label}</span>
                  </AutocompleteItem>
                )}
              </BaseAutocomplete.Collection>
            </AutocompleteGroup>
          )
        ) : (
          (opt: AutocompleteOption) => (
            <AutocompleteItem
              key={opt.value}
              value={opt}
              disabled={opt.disabled}
            >
              <span className="truncate">{opt.label}</span>
            </AutocompleteItem>
          )
        )}
      </AutocompleteList>
    );

    const inputGroupElement = (
      <AutocompleteInputGroup
        size={size}
        className={composeClassName(
          [
            error && 'border-error focus-within:border-error focus-within:outline-error',
            disabled && 'bg-surface-container-low border-outline-variant text-on-surface-variant/60 cursor-not-allowed',
          ],
          inputGroupClassName
        )}
      >
        {hasLeading && (
          <span
            className="text-on-surface-variant ps-3 pe-1 flex items-center pointer-events-none select-none z-10 shrink-0"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}

        <BaseAutocomplete.Input
          data-slot="autocomplete-input"
          ref={inputRef}
          id={autocompleteId}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          enterKeyHint="search"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={composeClassName(
            [
              'w-full rounded border border-outline bg-surface text-on-surface font-sans text-sm placeholder:text-on-surface-variant/80 outline-none transition-[border-color,box-shadow] motion-reduce:transition-none',
              'hover:border-on-surface-variant/80 px-3.5 focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
              '[[data-slot=autocomplete-input-group]_&]:border-0 [[data-slot=autocomplete-input-group]_&]:bg-transparent [[data-slot=autocomplete-input-group]_&]:rounded-none [[data-slot=autocomplete-input-group]_&]:focus-visible:outline-none [[data-slot=autocomplete-input-group]_&]:hover:border-0 [[data-slot=autocomplete-input-group]_&]:flex-1 [[data-slot=autocomplete-input-group]_&]:min-w-0 [[data-slot=autocomplete-input-group]_&]:h-auto [[data-slot=autocomplete-input-group]_&]:min-h-0 [[data-slot=autocomplete-input-group]_&]:self-stretch',
              size === 'sm' && 'py-1.5 text-base sm:text-sm',
              size === 'md' && 'py-2 text-sm',
              size === 'lg' && 'py-2.5 text-base',
              hasLeading ? 'ps-1' : 'ps-3.5',
              clearable || showTrigger || hasTrailing ? 'pe-2' : 'pe-3.5',
              'disabled:cursor-not-allowed',
            ],
            inputClassName
          )}
        />

        <div className="flex items-center gap-1.5 pe-2 shrink-0">
          {clearable && <AutocompleteClear />}
          {showTrigger && <AutocompleteTrigger />}
          {hasTrailing && (
            <span className="text-on-surface-variant flex items-center select-none" aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </div>

        {!inline && (
          <BaseAutocomplete.Portal container={container}>
            <BaseAutocomplete.Positioner
              anchor={anchor}
              side={side}
              align={align}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              collisionPadding={collisionPadding}
              collisionBoundary={collisionBoundary}
              collisionAvoidance={collisionAvoidance}
              className={composeClassName('z-50 outline-none', positionerClassName)}
            >
              <AutocompletePopup className={popupClassName}>
                <AutocompleteEmpty>{emptyMessage}</AutocompleteEmpty>
                {listContent}
              </AutocompletePopup>
            </BaseAutocomplete.Positioner>
          </BaseAutocomplete.Portal>
        )}
      </AutocompleteInputGroup>
    );

    const inlineListElement = inline && (
      <div
        className={cn(
          'mt-1.5 flex flex-col overflow-hidden p-1 rounded bg-surface border border-outline-variant shadow-card',
          typeof popupClassName === 'string' ? popupClassName : undefined
        )}
      >
        <AutocompleteEmpty>{emptyMessage}</AutocompleteEmpty>
        {listContent}
      </div>
    );

    const errorElement = typeof error === 'string' && error && (
      <div
        id={errorId}
        className="flex items-center gap-1.5 font-sans text-xs font-semibold text-error select-none mt-1"
        role="alert"
      >
        <span className="material-symbols-outlined text-base select-none shrink-0" aria-hidden="true">
          error
        </span>
        <span>{error}</span>
      </div>
    );

    if (normalizedGroups && normalizedGroups.length > 0) {
      return (
        <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
          <BaseAutocomplete.Root
            items={normalizedGroups}
            filteredItems={
              normalizedFilteredGroups ??
              (filteredItems as readonly AutocompleteGroupOption[] | undefined)
            }
            itemToStringValue={
              (itemToStringValue as ((itemValue: AutocompleteOption) => string) | undefined) ??
              defaultItemToStringValue
            }
            value={value === null ? '' : value}
            defaultValue={defaultValue === null ? undefined : defaultValue}
            onValueChange={handleValueChange}
            filter={filter as BaseAutocomplete.Root.Props<AutocompleteOption>['filter']}
            mode={mode}
            inline={inline}
            autoHighlight={autoHighlight}
            keepHighlight={keepHighlight}
            highlightItemOnHover={highlightItemOnHover}
            openOnInputClick={openOnInputClick}
            submitOnItemClick={submitOnItemClick}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            id={autocompleteId}
            form={form}
            actionsRef={actionsRef}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            onItemHighlighted={
              onItemHighlighted as BaseAutocomplete.Root.Props<AutocompleteOption>['onItemHighlighted']
            }
          >
            <AutocompleteStatus />
            {label && (
              <AutocompleteLabel htmlFor={autocompleteId}>
                {label}
              </AutocompleteLabel>
            )}
            {description && (
              <p id={descriptionId} className="text-sm text-on-surface-variant font-sans">
                {description}
              </p>
            )}
            {inputGroupElement}
            {inlineListElement}
          </BaseAutocomplete.Root>
          {errorElement}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
        <BaseAutocomplete.Root
          items={normalizedOptions}
          filteredItems={filteredItems as readonly AutocompleteOption[] | undefined}
          itemToStringValue={
            (itemToStringValue as ((itemValue: AutocompleteOption) => string) | undefined) ??
            defaultItemToStringValue
          }
          value={value === null ? '' : value}
          defaultValue={defaultValue === null ? undefined : defaultValue}
          onValueChange={handleValueChange}
          filter={filter as BaseAutocomplete.Root.Props<AutocompleteOption>['filter']}
          mode={mode}
          inline={inline}
          autoHighlight={autoHighlight}
          keepHighlight={keepHighlight}
          highlightItemOnHover={highlightItemOnHover}
          openOnInputClick={openOnInputClick}
          submitOnItemClick={submitOnItemClick}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          id={autocompleteId}
          form={form}
          actionsRef={actionsRef}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onItemHighlighted={
            onItemHighlighted as BaseAutocomplete.Root.Props<AutocompleteOption>['onItemHighlighted']
          }
        >
          <AutocompleteStatus />
          {label && (
            <AutocompleteLabel htmlFor={autocompleteId}>
              {label}
            </AutocompleteLabel>
          )}
          {description && (
            <p id={descriptionId} className="text-xs text-on-surface-variant font-sans">
              {description}
            </p>
          )}
          {inputGroupElement}
          {inlineListElement}
        </BaseAutocomplete.Root>
        {errorElement}
      </div>
    );
}

export const AutocompleteComponent = React.forwardRef(AutocompleteComponentInner) as (<
  ItemValue = AutocompleteOption
>(
  props: AutocompleteProps<ItemValue> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };

AutocompleteComponent.displayName = 'Autocomplete';

// --- STYLED SUBCOMPONENTS ---

export interface AutocompleteLabelProps extends React.ComponentPropsWithoutRef<'label'> {}

export const AutocompleteLabel = React.forwardRef<HTMLLabelElement, AutocompleteLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block font-label text-sm font-semibold text-on-surface select-none', className)}
      {...props}
    />
  )
);
AutocompleteLabel.displayName = 'AutocompleteLabel';

export interface AutocompleteInputGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseAutocomplete.InputGroup> {
  size?: 'sm' | 'md' | 'lg';
}

export const AutocompleteInputGroup = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.InputGroup>,
  AutocompleteInputGroupProps
>(({ className, size = 'md', ...props }, ref) => (
  <BaseAutocomplete.InputGroup
    data-slot="autocomplete-input-group"
    ref={ref}
    className={composeClassName(
      [
        'relative flex items-stretch w-full rounded border border-outline bg-surface transition-[border-color,outline-color] [&:has(>[data-slot=autocomplete-trigger],>[data-slot=autocomplete-clear])]:gap-1.5 [&:has(>[data-slot=autocomplete-trigger],>[data-slot=autocomplete-clear])]:pe-1.5',
        size === 'sm' && 'min-h-11',
        size === 'md' && 'min-h-12',
        size === 'lg' && 'min-h-14',
        'hover:border-on-surface-variant/80 data-[popup-open]:border-primary data-[popup-open]:outline-2 data-[popup-open]:-outline-offset-1 data-[popup-open]:outline-primary',
        'focus-within:border-primary focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary',
        'data-[disabled]:bg-surface-container-low data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
        'data-[invalid]:border-error data-[invalid]:focus-within:border-error data-[invalid]:focus-within:outline-error',
      ],
      className
    )}
    {...props}
  />
));
AutocompleteInputGroup.displayName = 'AutocompleteInputGroup';

export interface AutocompleteInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Input>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
}

export const AutocompleteInput = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Input>,
  AutocompleteInputProps
>(({ className, size = 'md', enterKeyHint = 'search', ...props }, ref) => (
  <BaseAutocomplete.Input
    data-slot="autocomplete-input"
    ref={ref}
    enterKeyHint={enterKeyHint}
    className={composeClassName(
      [
        'w-full rounded border border-outline bg-surface text-on-surface font-sans text-sm placeholder:text-on-surface-variant/80 transition-[border-color,box-shadow] motion-reduce:transition-none',
        'hover:border-on-surface-variant/80 px-3.5 focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
        '[[data-slot=autocomplete-input-group]_&]:border-0 [[data-slot=autocomplete-input-group]_&]:bg-transparent [[data-slot=autocomplete-input-group]_&]:rounded-none [[data-slot=autocomplete-input-group]_&]:focus-visible:outline-none [[data-slot=autocomplete-input-group]_&]:hover:border-0 [[data-slot=autocomplete-input-group]_&]:flex-1 [[data-slot=autocomplete-input-group]_&]:min-w-0 [[data-slot=autocomplete-input-group]_&]:h-auto [[data-slot=autocomplete-input-group]_&]:min-h-0 [[data-slot=autocomplete-input-group]_&]:self-stretch',
        size === 'sm' && 'h-11 min-h-[44px] text-base sm:text-sm',
        size === 'md' && 'h-12 min-h-[48px] text-sm',
        size === 'lg' && 'h-14 min-h-[56px] text-base',
        'disabled:cursor-not-allowed',
      ],
      className
    )}
    {...props}
  />
));
AutocompleteInput.displayName = 'AutocompleteInput';

export const AutocompleteTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseAutocomplete.Trigger
    ref={ref}
    data-slot="autocomplete-trigger"
    className={composeClassName(
      [
        'relative self-center shrink-0 size-8 min-w-[32px] min-h-[32px] rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer flex items-center justify-center after:absolute after:-inset-y-1.5 after:-inset-x-0.5 after:content-[\'\']',
        'data-[popup-open]:rotate-180 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
        'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
      ],
      className
    )}
    aria-label="Show suggestions"
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-lg leading-none select-none" aria-hidden="true">
        arrow_drop_down
      </span>
    )}
  </BaseAutocomplete.Trigger>
));
AutocompleteTrigger.displayName = 'AutocompleteTrigger';

export const AutocompleteIcon = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Icon>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Icon>
>(({ className, children, ...props }, ref) => (
  <BaseAutocomplete.Icon
    ref={ref}
    className={composeClassName('shrink-0 text-on-surface-variant flex items-center justify-center select-none', className)}
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        search
      </span>
    )}
  </BaseAutocomplete.Icon>
));
AutocompleteIcon.displayName = 'AutocompleteIcon';

export const AutocompleteClear = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Clear>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Clear>
>(({ className, children, ...props }, ref) => (
  <BaseAutocomplete.Clear
    ref={ref}
    data-slot="autocomplete-clear"
    className={composeClassName(
      [
        'relative self-center shrink-0 size-8 min-w-[32px] min-h-[32px] rounded-full text-on-surface-variant hover:text-on-surface hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer flex items-center justify-center after:absolute after:-inset-y-1.5 after:-inset-x-0.5 after:content-[\'\']',
        'transition-opacity duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
        'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
        'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
      ],
      className
    )}
    aria-label="Clear input"
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-lg leading-none select-none" aria-hidden="true">
        close
      </span>
    )}
  </BaseAutocomplete.Clear>
));
AutocompleteClear.displayName = 'AutocompleteClear';

export const AutocompletePositioner = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Positioner>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Positioner>
>(({ className, sideOffset = 4, collisionPadding = 8, ...props }, ref) => (
  <BaseAutocomplete.Positioner
    ref={ref}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={composeClassName('z-50 outline-none', className)}
    {...props}
  />
));
AutocompletePositioner.displayName = 'AutocompletePositioner';

export const AutocompletePopup = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Popup>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Popup
    ref={ref}
    className={composeClassName(
      [
        'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] flex flex-col overflow-hidden p-1 rounded bg-surface border border-outline-variant shadow-ambient',
        'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
        'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
        'motion-reduce:transition-none motion-reduce:transform-none z-50',
      ],
      className
    )}
    {...props}
  />
));
AutocompletePopup.displayName = 'AutocompletePopup';

export const AutocompleteArrow = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Arrow>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Arrow>
>(({ className, children, ...props }, ref) => (
  <BaseAutocomplete.Arrow
    ref={ref}
    className={composeClassName(
      [
        'z-10 data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-7.5px] data-[side=right]:left-[-7.5px]',
        'data-[side=inline-start]:end-[-7.5px] data-[side=inline-end]:start-[-7.5px]',
        'data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90',
        'data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90',
      ],
      className
    )}
    {...props}
  >
    {children ?? (
      <svg
        width="10"
        height="5"
        viewBox="0 0 10 5"
        className="block fill-surface stroke-outline-variant"
        aria-hidden="true"
      >
        <path d="M0 5 L5 0 L10 5" />
      </svg>
    )}
  </BaseAutocomplete.Arrow>
));
AutocompleteArrow.displayName = 'AutocompleteArrow';

export const AutocompleteBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Backdrop
    ref={ref}
    className={composeClassName(
      'fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-[2px] transition-opacity duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none',
      className
    )}
    {...props}
  />
));
AutocompleteBackdrop.displayName = 'AutocompleteBackdrop';

export const AutocompleteEmpty = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Empty>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Empty>
>(({ className, children, ...props }, ref) => (
  <BaseAutocomplete.Empty
    ref={ref}
    className={composeClassName(
      [
        'px-3 py-2.5 font-sans text-sm text-on-surface-variant select-none',
        'empty:p-0 empty:m-0 empty:h-0 empty:min-h-0 empty:border-0 overflow-hidden',
      ],
      className
    )}
    {...props}
  >
    {children ?? 'No matching suggestions found'}
  </BaseAutocomplete.Empty>
));
AutocompleteEmpty.displayName = 'AutocompleteEmpty';

export interface AutocompleteListProps
  extends React.ComponentPropsWithoutRef<typeof BaseAutocomplete.List> {
  /** Wraps the list in `ScrollArea` for custom scrollbars. Set to `false` when using an external virtualizer. Defaults to `true`. */
  scrollable?: boolean;
}

export const AutocompleteList = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.List>,
  AutocompleteListProps
>(({ className, scrollable = true, ...props }, ref) => {
  if (!scrollable) {
    return (
      <BaseAutocomplete.List
        ref={ref}
        data-slot="autocomplete-list"
        className={composeClassName(
          'min-h-0 flex-1 max-h-[min(20rem,calc(var(--available-height)-0.75rem))] overflow-y-auto overscroll-contain p-0.5 scroll-py-1 flex flex-col gap-1 outline-none [scrollbar-width:thin] data-[empty]:p-0',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <ScrollArea
      className="min-h-0 flex-[0_1_auto] max-h-[min(20rem,calc(var(--available-height)-0.75rem))]"
      viewportClassName="overscroll-contain scroll-py-1"
      viewportProps={{
        tabIndex: -1,
        onMouseDown: (e) => e.preventDefault(),
      }}
    >
      <BaseAutocomplete.List
        ref={ref}
        data-slot="autocomplete-list"
        className={composeClassName(
          'p-0.5 pe-1.5 flex flex-col gap-1 outline-none data-[empty]:p-0',
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
});
AutocompleteList.displayName = 'AutocompleteList';

export const AutocompleteItem = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Item>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>
>(({ className, children, ...props }, ref) => {
  const itemValue = props.value;
  return (
    <BaseAutocomplete.Item
      ref={ref}
      className={composeClassName(
        [
          'relative flex items-center justify-between px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium text-on-surface cursor-pointer select-none outline-none transition-colors motion-reduce:transition-none',
          'hover:bg-state-hover hover:text-on-surface',
          'data-[highlighted]:bg-surface-container-low data-[highlighted]:text-primary',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
        ],
        className
      )}
      {...props}
    >
      {children ??
        (typeof itemValue === 'object' && itemValue !== null && 'label' in itemValue ? (
          <span className="truncate">{String(itemValue.label)}</span>
        ) : typeof itemValue === 'string' ? (
          <span className="truncate">{itemValue}</span>
        ) : null)}
    </BaseAutocomplete.Item>
  );
});
AutocompleteItem.displayName = 'AutocompleteItem';

export const AutocompleteGroup = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Group>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Group>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Group ref={ref} className={composeClassName('flex flex-col gap-1 py-1', className)} {...props} />
));
AutocompleteGroup.displayName = 'AutocompleteGroup';

export const AutocompleteGroupLabel = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.GroupLabel
    ref={ref}
    className={composeClassName(
      'sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-semibold text-on-surface-variant border-b border-outline-variant/40 select-none',
      className
    )}
    {...props}
  />
));
AutocompleteGroupLabel.displayName = 'AutocompleteGroupLabel';

export const AutocompleteSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Separator
    ref={ref}
    className={composeClassName('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
AutocompleteSeparator.displayName = 'AutocompleteSeparator';

export const AutocompleteRow = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Row>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Row>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Row ref={ref} className={composeClassName('flex items-center gap-1', className)} {...props} />
));
AutocompleteRow.displayName = 'AutocompleteRow';

export const AutocompleteStatus = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Status>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Status>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Status ref={ref} className={composeClassName('sr-only', className)} {...props} />
));
AutocompleteStatus.displayName = 'AutocompleteStatus';

export interface AutocompleteContentProps extends React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Popup> {
  container?: BaseAutocomplete.Portal.Props['container'];
  keepMounted?: boolean;
  anchor?: BaseAutocomplete.Positioner.Props['anchor'];
  side?: BaseAutocomplete.Positioner.Props['side'];
  align?: BaseAutocomplete.Positioner.Props['align'];
  sideOffset?: BaseAutocomplete.Positioner.Props['sideOffset'];
  alignOffset?: BaseAutocomplete.Positioner.Props['alignOffset'];
  collisionPadding?: BaseAutocomplete.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseAutocomplete.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseAutocomplete.Positioner.Props['collisionAvoidance'];
  positionerClassName?: BaseAutocomplete.Positioner.Props['className'];
  hasArrow?: boolean;
}

export const AutocompleteContent = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Popup>,
  AutocompleteContentProps
>(
  (
    {
      container,
      keepMounted,
      anchor,
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset = 0,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      positionerClassName,
      hasArrow = false,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <BaseAutocomplete.Portal container={container} keepMounted={keepMounted}>
      <BaseAutocomplete.Positioner
        anchor={anchor}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        collisionAvoidance={collisionAvoidance}
        className={composeClassName('z-50 outline-none', positionerClassName)}
      >
        <AutocompletePopup ref={ref} className={className} {...props}>
          {hasArrow && <AutocompleteArrow />}
          {children}
        </AutocompletePopup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  )
);
AutocompleteContent.displayName = 'AutocompleteContent';

// Compound Base UI exports
export const Autocomplete = Object.assign(AutocompleteComponent, {
  Root: BaseAutocomplete.Root,
  Label: AutocompleteLabel,
  Input: AutocompleteInput,
  InputGroup: AutocompleteInputGroup,
  Trigger: AutocompleteTrigger,
  Icon: AutocompleteIcon,
  Clear: AutocompleteClear,
  Value: BaseAutocomplete.Value,
  Portal: BaseAutocomplete.Portal,
  Backdrop: AutocompleteBackdrop,
  Positioner: AutocompletePositioner,
  Popup: AutocompletePopup,
  Arrow: AutocompleteArrow,
  Status: AutocompleteStatus,
  Empty: AutocompleteEmpty,
  List: AutocompleteList,
  Row: AutocompleteRow,
  Item: AutocompleteItem,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Separator: AutocompleteSeparator,
  Collection: BaseAutocomplete.Collection,
  Content: AutocompleteContent,
  useFilter: BaseAutocomplete.useFilter,
  useFilteredItems: BaseAutocomplete.useFilteredItems,
});

export { BaseAutocomplete };
export const AutocompleteRoot = BaseAutocomplete.Root;
export const AutocompletePortal = BaseAutocomplete.Portal;
export const AutocompleteValue = BaseAutocomplete.Value;
export const AutocompleteCollection = BaseAutocomplete.Collection;
export const useAutocompleteFilter = BaseAutocomplete.useFilter;
export const useAutocompleteFilteredItems = BaseAutocomplete.useFilteredItems;

export default Autocomplete;
