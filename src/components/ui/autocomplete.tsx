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

export type AutocompleteItem = AutocompleteOption;

export interface AutocompleteGroupOption<Item = AutocompleteOption> {
  label: string;
  items: readonly Item[];
  options?: readonly Item[];
}

export type AutocompleteGroupItem = AutocompleteGroupOption;

export interface AutocompleteProps<ItemValue = AutocompleteOption> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options?: AutocompleteOption[];
  groups?: AutocompleteGroupOption<ItemValue>[];
  items?: readonly ItemValue[];
  filteredItems?: readonly ItemValue[];
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
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  collisionBoundary?: BaseAutocomplete.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseAutocomplete.Positioner.Props['collisionAvoidance'];
  positionerClassName?: string;
  popupClassName?: string;
  listClassName?: string;
  inputGroupClassName?: string;
  inputClassName?: string;
  emptyMessage?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  inputRef?: React.Ref<HTMLInputElement>;
  children?: React.ReactNode;
  className?: string;
}

const AutocompleteComponent = React.forwardRef<HTMLDivElement, AutocompleteProps>(
  (
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
      sideOffset = 6,
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
    },
    ref
  ) => {
    // Unify onValueChange and onChange without suppressing eventDetails
    const handleValueChange = (
      val: string,
      eventDetails: BaseAutocomplete.Root.ChangeEventDetails
    ) => {
      onValueChange?.(val, eventDetails);
      onChange?.(val);

      if (onSelect) {
        const trimmed = (val ?? '').trim();
        if (!trimmed) {
          onSelect(null);
          return;
        }
        if (normalizedOptions.length > 0) {
          const matched = normalizedOptions.find(
            (opt) =>
              opt.label.toLowerCase() === trimmed.toLowerCase() ||
              opt.value.toLowerCase() === trimmed.toLowerCase()
          );
          onSelect(matched ?? val);
        } else {
          onSelect(val);
        }
      }
    };

    const generatedId = React.useId();
    const autocompleteId = id || `autocomplete-${generatedId}`;
    const descriptionId = description ? `${autocompleteId}-desc` : undefined;
    const errorId = error ? `${autocompleteId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    // Normalize flat options
    const normalizedOptions = React.useMemo<readonly AutocompleteOption[]>(() => {
      const list = options ?? items;
      if (list && list.length > 0) {
        return list.map((opt, index) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: String(opt), label: String(opt), disabled: false };
          }
          return {
            value: String(opt?.value ?? opt?.label ?? index),
            label: String(opt?.label ?? opt?.value ?? index),
            disabled: Boolean(opt?.disabled),
          };
        });
      }
      return [];
    }, [options, items]);

    // Normalize grouped options
    const normalizedGroups = React.useMemo<readonly AutocompleteGroupOption[] | null>(() => {
      if (!groups || groups.length === 0) return null;
      return groups.map((g) => ({
        label: String(g.label || ''),
        items: (g.items ?? g.options ?? []).map((opt, index) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: String(opt), label: String(opt), disabled: false };
          }
          return {
            value: String(opt?.value ?? opt?.label ?? index),
            label: String(opt?.label ?? opt?.value ?? index),
            disabled: Boolean(opt?.disabled),
          };
        }),
      }));
    }, [groups]);

    // Default itemToStringValue handles both string and object shapes
    const defaultItemToStringValue = React.useCallback(
      (item: AutocompleteOption) => {
        if (typeof item === 'string') return item;
        return item?.label ?? item?.value ?? '';
      },
      []
    );

    // If children are provided, this is a compositional/compound Autocomplete
    if (children) {
      if (normalizedGroups && normalizedGroups.length > 0) {
        return (
          <BaseAutocomplete.Root
            items={normalizedGroups}
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
            itemToStringValue={itemToStringValue ?? defaultItemToStringValue}
            filter={filter}
          >
            {children}
          </BaseAutocomplete.Root>
        );
      }

      return (
        <BaseAutocomplete.Root
          items={normalizedOptions}
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
          itemToStringValue={itemToStringValue ?? defaultItemToStringValue}
          filter={filter}
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
            <AutocompleteGroup key={group.label}>
              <AutocompleteGroupLabel>{group.label}</AutocompleteGroupLabel>
              {(group.items || group.options || []).map((opt) => (
                <AutocompleteItem
                  key={opt.value}
                  value={opt}
                  disabled={opt.disabled}
                >
                  <span className="truncate">{opt.label}</span>
                </AutocompleteItem>
              ))}
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
        className={cn(
          error && 'border-error focus-within:border-error focus-within:outline-error',
          disabled && 'bg-surface-variant/30 border-outline-variant text-on-surface-variant/60 cursor-not-allowed',
          inputGroupClassName
        )}
      >
        {hasLeading && (
          <span
            className="text-on-surface-variant pl-3 pr-1 flex items-center pointer-events-none select-none z-10 shrink-0"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}

        <BaseAutocomplete.Input
          ref={inputRef}
          id={autocompleteId}
          name={name || autocompleteId}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full bg-transparent border-0 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 outline-none',
            size === 'sm' && 'h-9 min-h-[44px] text-xs',
            size === 'md' && 'h-11 min-h-[44px] text-sm',
            size === 'lg' && 'h-14 min-h-[56px] text-base',
            hasLeading ? 'pl-1' : 'pl-3.5',
            clearable || showTrigger || hasTrailing ? 'pr-2' : 'pr-3.5',
            'disabled:cursor-not-allowed',
            inputClassName
          )}
        />

        <div className="flex items-center gap-1 pr-2 shrink-0">
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
              className={cn('z-50 outline-none', positionerClassName)}
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
      <div className={cn('mt-1.5 p-1.5 rounded-lg bg-surface border border-outline-variant shadow-sm', popupClassName)}>
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
        <div ref={ref} className={cn('space-y-1.5 w-full', className)} {...props}>
          <BaseAutocomplete.Root
            items={normalizedGroups}
            itemToStringValue={itemToStringValue ?? defaultItemToStringValue}
            value={value === null ? '' : value}
            defaultValue={defaultValue === null ? undefined : defaultValue}
            onValueChange={handleValueChange}
            filter={filter}
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
            name={name || autocompleteId}
            id={autocompleteId}
            form={form}
            actionsRef={actionsRef}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            onItemHighlighted={onItemHighlighted}
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

    return (
      <div ref={ref} className={cn('space-y-1.5 w-full', className)} {...props}>
        <BaseAutocomplete.Root
          items={normalizedOptions}
          filteredItems={filteredItems}
          itemToStringValue={itemToStringValue ?? defaultItemToStringValue}
          value={value === null ? '' : value}
          defaultValue={defaultValue === null ? undefined : defaultValue}
          onValueChange={handleValueChange}
          filter={filter}
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
          name={name || autocompleteId}
          id={autocompleteId}
          form={form}
          actionsRef={actionsRef}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onItemHighlighted={onItemHighlighted}
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
);

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

export const AutocompleteInputGroup = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.InputGroup>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.InputGroup>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.InputGroup
    ref={ref}
    className={cn(
      'relative flex items-center w-full rounded border border-outline bg-surface transition-[border-color,box-shadow]',
      'focus-within:border-primary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary',
      'data-[popup-open]:border-primary',
      'data-[disabled]:bg-surface-variant/30 data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
      'data-[invalid]:border-error data-[invalid]:focus-within:border-error data-[invalid]:focus-within:outline-error',
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
>(({ className, size = 'md', ...props }, ref) => (
  <BaseAutocomplete.Input
    ref={ref}
    className={cn(
      'w-full bg-transparent border-0 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 outline-none',
      size === 'sm' && 'h-9 min-h-[44px] text-xs',
      size === 'md' && 'h-11 min-h-[44px] text-sm',
      size === 'lg' && 'h-14 min-h-[56px] text-base',
      'disabled:cursor-not-allowed',
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
    className={cn(
      'p-1.5 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary cursor-pointer flex items-center justify-center min-w-[28px] min-h-[28px]',
      'data-[popup-open]:rotate-180 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
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
    className={cn('shrink-0 text-on-surface-variant flex items-center justify-center select-none', className)}
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
    className={cn(
      'p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary cursor-pointer flex items-center justify-center min-w-[28px] min-h-[28px]',
      'transition-opacity duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
      'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
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
>(({ className, sideOffset = 6, collisionPadding = 8, ...props }, ref) => (
  <BaseAutocomplete.Positioner
    ref={ref}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={cn('z-50 outline-none', className)}
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
    className={cn(
      'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1.5 rounded-lg bg-surface border border-outline-variant shadow-modal',
      'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
      'motion-reduce:transition-none motion-reduce:transform-none z-50',
      className
    )}
    {...props}
  />
));
AutocompletePopup.displayName = 'AutocompletePopup';

export const AutocompleteArrow = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Arrow>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Arrow>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Arrow
    ref={ref}
    className={cn('fill-surface stroke-outline-variant', className)}
    {...props}
  />
));
AutocompleteArrow.displayName = 'AutocompleteArrow';

export const AutocompleteBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Backdrop
    ref={ref}
    className={cn(
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
    className={cn('px-3 py-2.5 font-sans text-sm text-on-surface-variant select-none', className)}
    {...props}
  >
    {children ?? 'No matching suggestions found'}
  </BaseAutocomplete.Empty>
));
AutocompleteEmpty.displayName = 'AutocompleteEmpty';

export const AutocompleteList = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.List>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.List>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.List
    ref={ref}
    className={cn(
      'max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none data-[empty]:p-0',
      className
    )}
    {...props}
  />
));
AutocompleteList.displayName = 'AutocompleteList';

export const AutocompleteItem = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Item>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>
>(({ className, children, ...props }, ref) => {
  const itemValue = props.value;
  return (
    <BaseAutocomplete.Item
      ref={ref}
      className={cn(
        'relative flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-sm font-sans text-sm font-medium text-on-surface cursor-pointer select-none outline-none transition-colors',
        'hover:bg-surface-container hover:text-on-surface',
        'data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
        'data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:font-semibold',
        'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
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
  <BaseAutocomplete.Group ref={ref} className={cn('py-1', className)} {...props} />
));
AutocompleteGroup.displayName = 'AutocompleteGroup';

export const AutocompleteGroupLabel = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.GroupLabel
    ref={ref}
    className={cn(
      'sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/40 select-none',
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
    className={cn('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
AutocompleteSeparator.displayName = 'AutocompleteSeparator';

export const AutocompleteRow = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Row>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Row>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Row ref={ref} className={cn('flex items-center gap-1', className)} {...props} />
));
AutocompleteRow.displayName = 'AutocompleteRow';

export const AutocompleteStatus = React.forwardRef<
  React.ComponentRef<typeof BaseAutocomplete.Status>,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Status>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Status ref={ref} className={cn('sr-only', className)} {...props} />
));
AutocompleteStatus.displayName = 'AutocompleteStatus';

export interface AutocompleteContentProps extends React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Popup> {
  container?: BaseAutocomplete.Portal.Props['container'];
  keepMounted?: boolean;
  anchor?: BaseAutocomplete.Positioner.Props['anchor'];
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  collisionBoundary?: BaseAutocomplete.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseAutocomplete.Positioner.Props['collisionAvoidance'];
  positionerClassName?: string;
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
      sideOffset = 6,
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
        className={cn('z-50 outline-none', positionerClassName)}
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
