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
  items?: ComboboxOption[];
  options?: ComboboxOption[];
}

export type ComboboxGroupItem = ComboboxGroupOption;

type ComboboxValueType<Value, Multiple extends boolean | undefined> = Multiple extends true ? Value[] : Value;

export interface ComboboxProps<Item = ComboboxOption, Value = string, Multiple extends boolean | undefined = false> {
  label?: React.ReactNode;
  placeholder?: string;
  options?: ComboboxOption[];
  items?: readonly any[] | BaseCombobox.Root.Props<Value, Multiple, Item>['items'];
  groups?: ComboboxGroupOption[];
  value?: ComboboxValueType<Value, Multiple> | null;
  defaultValue?: ComboboxValueType<Value, Multiple> | null;
  inputValue?: string;
  defaultInputValue?: string;
  onValueChange?: (value: ComboboxValueType<Value, Multiple> | (Multiple extends true ? never : null), eventDetails: BaseCombobox.Root.ChangeEventDetails) => void;
  onChange?: (value: ComboboxValueType<Value, Multiple> | (Multiple extends true ? never : null)) => void;
  onInputValueChange?: (inputValue: string, eventDetails: BaseCombobox.Root.ChangeEventDetails) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseCombobox.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  multiple?: Multiple;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  form?: string;
  autoComplete?: string;
  autoHighlight?: boolean;
  highlightItemOnHover?: boolean;
  loopFocus?: boolean;
  openOnInputClick?: boolean;
  modal?: boolean;
  actionsRef?: React.RefObject<BaseCombobox.Root.Actions | null>;
  inputRef?: React.Ref<HTMLInputElement>;
  itemToStringLabel?: (itemValue: any) => string;
  itemToStringValue?: (itemValue: any) => string;
  isItemEqualToValue?: (itemValue: any, value: any) => boolean;
  filter?: BaseCombobox.Root.Props<Value, Multiple, Item>['filter'];
  filteredItems?: BaseCombobox.Root.Props<Value, Multiple, Item>['filteredItems'];
  limit?: number;
  error?: boolean | string;
  description?: React.ReactNode;
  container?: BaseCombobox.Portal.Props['container'];
  anchor?: BaseCombobox.Positioner.Props['anchor'];
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  collisionBoundary?: BaseCombobox.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseCombobox.Positioner.Props['collisionAvoidance'];
  positionerClassName?: string;
  popupClassName?: string;
  listClassName?: string;
  inputGroupClassName?: string;
  inputClassName?: string;
  emptyMessage?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

const ComboboxComponent = React.forwardRef<HTMLDivElement, ComboboxProps<any, any, any>>(
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
      onChange,
      onInputValueChange,
      open,
      defaultOpen,
      onOpenChange,
      onOpenChangeComplete,
      multiple = false,
      clearable = true,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      id,
      form,
      autoComplete,
      autoHighlight,
      highlightItemOnHover = true,
      loopFocus = true,
      openOnInputClick = true,
      modal = false,
      actionsRef,
      inputRef,
      itemToStringLabel,
      itemToStringValue,
      isItemEqualToValue,
      filter,
      filteredItems,
      limit,
      error,
      description,
      container,
      anchor,
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      positionerClassName,
      popupClassName,
      listClassName,
      inputGroupClassName,
      inputClassName,
      emptyMessage = 'No matching options found',
      size = 'md',
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Unify onValueChange and onChange without suppressing eventDetails
    const handleValueChange = (
      val: any,
      eventDetails: BaseCombobox.Root.ChangeEventDetails
    ) => {
      onValueChange?.(val, eventDetails);
      onChange?.(val);
    };

    // If children are provided, this is a compositional/compound Combobox
    if (children) {
      return (
        <BaseCombobox.Root
          items={items}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          inputValue={inputValue}
          defaultInputValue={defaultInputValue}
          onInputValueChange={onInputValueChange}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          multiple={multiple}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          id={id}
          form={form}
          autoComplete={autoComplete}
          autoHighlight={autoHighlight}
          highlightItemOnHover={highlightItemOnHover}
          loopFocus={loopFocus}
          openOnInputClick={openOnInputClick}
          modal={modal}
          actionsRef={actionsRef}
          inputRef={inputRef}
          itemToStringLabel={itemToStringLabel}
          itemToStringValue={itemToStringValue}
          isItemEqualToValue={isItemEqualToValue}
          filter={filter}
          filteredItems={filteredItems}
          limit={limit}
        >
          {children}
        </BaseCombobox.Root>
      );
    }

    const generatedId = React.useId();
    const comboboxId = id || `combobox-${generatedId}`;
    const descriptionId = description ? `${comboboxId}-desc` : undefined;
    const errorId = error ? `${comboboxId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    // Normalize flat options
    const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
      const list = options ?? (items as ComboboxOption[] | undefined);
      if (list && Array.isArray(list) && list.length > 0) {
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
      return [];
    }, [options, items]);

    // Normalize grouped options (Base UI expects groups with an `items` array)
    const normalizedGroups = React.useMemo(() => {
      if (!groups || groups.length === 0) return null;
      return groups.map((g) => ({
        label: String(g.label || ''),
        items: (g.items || g.options || []).map((opt, index) => {
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

    // Build memoized createItems collection so Base UI handles string IDs and labels seamlessly
    const itemCollection = React.useMemo(() => {
      if (normalizedGroups && normalizedGroups.length > 0) {
        return BaseCombobox.createItems(normalizedGroups, {
          getValue: (item: ComboboxOption) => item.value,
          getLabel: (item: ComboboxOption) => item.label,
        });
      }
      if (normalizedOptions && normalizedOptions.length > 0) {
        return BaseCombobox.createItems(normalizedOptions, {
          getValue: (item: ComboboxOption) => item.value,
          getLabel: (item: ComboboxOption) => item.label,
        });
      }
      return items;
    }, [normalizedOptions, normalizedGroups, items]);

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
        <BaseCombobox.Root
          items={itemCollection}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          inputValue={inputValue}
          defaultInputValue={defaultInputValue}
          onInputValueChange={onInputValueChange}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          multiple={multiple}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name || comboboxId}
          id={comboboxId}
          form={form}
          autoComplete={autoComplete}
          autoHighlight={autoHighlight}
          highlightItemOnHover={highlightItemOnHover}
          loopFocus={loopFocus}
          openOnInputClick={openOnInputClick}
          modal={modal}
          actionsRef={actionsRef}
          inputRef={inputRef}
          itemToStringLabel={itemToStringLabel}
          itemToStringValue={itemToStringValue}
          isItemEqualToValue={isItemEqualToValue}
          filter={filter}
          filteredItems={filteredItems}
          limit={limit}
        >
          <ComboboxStatus />
          {label && (
            <ComboboxLabel>
              {label}
            </ComboboxLabel>
          )}
          {description && (
            <p id={descriptionId} className="text-xs text-on-surface-variant font-sans">
              {description}
            </p>
          )}

          <ComboboxInputGroup
            className={cn(
              error && 'border-error focus-within:outline-error',
              disabled && 'bg-surface-variant/30 border-outline-variant text-on-surface-variant/60 cursor-not-allowed',
              inputGroupClassName
            )}
          >
            <BaseCombobox.Input
              id={comboboxId}
              name={name || comboboxId}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              className={cn(
                'w-full bg-transparent border-0 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 outline-none',
                size === 'sm' && 'h-9 px-3 pr-16 min-h-[44px] text-xs',
                size === 'md' && 'h-11 px-3.5 pr-16 min-h-[44px] text-sm',
                size === 'lg' && 'h-14 px-5 pr-20 min-h-[56px] text-base',
                'disabled:cursor-not-allowed',
                inputClassName
              )}
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              {clearable && (
                <ComboboxClear disabled={disabled || readOnly} />
              )}
              <ComboboxTrigger disabled={disabled} />
            </div>

            <BaseCombobox.Portal container={container}>
              <ComboboxPositioner
                anchor={anchor}
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                collisionPadding={collisionPadding}
                collisionBoundary={collisionBoundary}
                collisionAvoidance={collisionAvoidance}
                className={positionerClassName}
              >
                <ComboboxPopup className={popupClassName}>
                  <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

                  <ComboboxList className={listClassName}>
                    {normalizedGroups ? (
                      (group: { label: string; items: ComboboxOption[] }) => (
                        <ComboboxGroup key={group.label} items={group.items}>
                          {group.label && (
                            <ComboboxGroupLabel>
                              {group.label}
                            </ComboboxGroupLabel>
                          )}
                          <BaseCombobox.Collection>
                            {(opt: ComboboxOption) => (
                              <ComboboxItem
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.disabled}
                              >
                                {opt.label}
                              </ComboboxItem>
                            )}
                          </BaseCombobox.Collection>
                        </ComboboxGroup>
                      )
                    ) : (
                      (opt: ComboboxOption) => (
                        <ComboboxItem
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                        >
                          {opt.label}
                        </ComboboxItem>
                      )
                    )}
                  </ComboboxList>
                </ComboboxPopup>
              </ComboboxPositioner>
            </BaseCombobox.Portal>
          </ComboboxInputGroup>
        </BaseCombobox.Root>
        {typeof error === 'string' && error && (
          <p id={errorId} className="text-xs text-error font-sans font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ComboboxComponent.displayName = 'Combobox';

// Compound Subcomponents for Compositional API

export interface ComboboxInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>, 'size'> {
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ComboboxInput = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Input>,
  ComboboxInputProps
>(({ className, size = 'md', error, ...props }, ref) => (
  <BaseCombobox.Input
    ref={ref}
    className={cn(
      'w-full rounded-md border border-outline bg-surface text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 outline-none transition-colors',
      size === 'sm' && 'h-9 px-3 min-h-[44px] text-xs',
      size === 'md' && 'h-11 px-3.5 min-h-[44px] text-sm',
      size === 'lg' && 'h-14 px-5 min-h-[56px] text-base',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
      error && 'border-error focus-visible:outline-error',
      className
    )}
    {...props}
  />
));
ComboboxInput.displayName = 'ComboboxInput';

export interface ComboboxTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Trigger> {
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export const ComboboxTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Trigger>,
  ComboboxTriggerProps
>(({ className, children, showIcon = true, icon, ...props }, ref) => (
  <BaseCombobox.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-between rounded-md border border-outline bg-surface text-on-surface font-sans text-sm hover:bg-surface-container transition-colors cursor-pointer',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  >
    {children}
    {showIcon && (
      <BaseCombobox.Icon className="ml-2 shrink-0 text-on-surface-variant">
        {icon ?? (
          <span className="material-symbols-outlined text-lg" aria-hidden="true">
            unfold_more
          </span>
        )}
      </BaseCombobox.Icon>
    )}
  </BaseCombobox.Trigger>
));
ComboboxTrigger.displayName = 'ComboboxTrigger';

export interface ComboboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Item> {
  indicatorPosition?: 'start' | 'end';
  showIndicator?: boolean;
  indicator?: React.ReactNode;
}

export const ComboboxItem = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Item>,
  ComboboxItemProps
>(({ className, children, indicatorPosition = 'end', showIndicator, indicator, ...props }, ref) => {
  const isSimpleChild = typeof children === 'string' || typeof children === 'number';
  const shouldRenderIndicator = showIndicator ?? isSimpleChild;

  return (
    <BaseCombobox.Item
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
      {isSimpleChild ? (
        <span className="truncate flex-1">{children}</span>
      ) : (
        children
      )}
      {shouldRenderIndicator && (
        <ComboboxItemIndicator>
          {indicator}
        </ComboboxItemIndicator>
      )}
    </BaseCombobox.Item>
  );
});
ComboboxItem.displayName = 'ComboboxItem';

export interface ComboboxItemIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.ItemIndicator> {}

export const ComboboxItemIndicator = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.ItemIndicator>,
  ComboboxItemIndicatorProps
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.ItemIndicator
    ref={ref}
    className={cn('shrink-0 text-on-primary-container flex items-center justify-center', className)}
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-sm font-bold" aria-hidden="true">
        check
      </span>
    )}
  </BaseCombobox.ItemIndicator>
));
ComboboxItemIndicator.displayName = 'ComboboxItemIndicator';

export interface ComboboxContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup> {
  container?: BaseCombobox.Portal.Props['container'];
  anchor?: BaseCombobox.Positioner.Props['anchor'];
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  collisionBoundary?: BaseCombobox.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseCombobox.Positioner.Props['collisionAvoidance'];
  positionerClassName?: string;
  listClassName?: string;
}

export const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Popup>,
  ComboboxContentProps
>(
  (
    {
      className,
      container,
      anchor,
      side = 'bottom',
      sideOffset = 4,
      align = 'start',
      alignOffset,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      positionerClassName,
      listClassName,
      children,
      ...props
    },
    ref
  ) => (
    <BaseCombobox.Portal container={container}>
      <ComboboxPositioner
        anchor={anchor}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        collisionAvoidance={collisionAvoidance}
        className={positionerClassName}
      >
        <ComboboxPopup className={className} ref={ref} {...props}>
          {children}
        </ComboboxPopup>
      </ComboboxPositioner>
    </BaseCombobox.Portal>
  )
);
ComboboxContent.displayName = 'ComboboxContent';

export const ComboboxClear = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Clear>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Clear>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Clear
    ref={ref}
    className={cn(
      'size-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
      className
    )}
    aria-label="Clear selection"
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        close
      </span>
    )}
  </BaseCombobox.Clear>
));
ComboboxClear.displayName = 'ComboboxClear';

export const ComboboxEmpty = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Empty>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Empty
    ref={ref}
    className={cn('px-3 py-2.5 text-xs font-sans text-on-surface-variant text-center select-none', className)}
    {...props}
  >
    {children ?? 'No matching options found'}
  </BaseCombobox.Empty>
));
ComboboxEmpty.displayName = 'ComboboxEmpty';

export const ComboboxList = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.List>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.List>
>(({ className, ...props }, ref) => (
  <BaseCombobox.List
    ref={ref}
    className={cn(
      'max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 space-y-0.5 outline-none data-[empty]:p-0',
      className
    )}
    {...props}
  />
));
ComboboxList.displayName = 'ComboboxList';

export const ComboboxPopup = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Popup
    ref={ref}
    className={cn(
      'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1 rounded-lg bg-surface border border-outline-variant shadow-ambient transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none flex flex-col',
      className
    )}
    {...props}
  />
));
ComboboxPopup.displayName = 'ComboboxPopup';

export const ComboboxPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Positioner>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Positioner ref={ref} className={cn('z-50 outline-none', className)} {...props} />
));
ComboboxPositioner.displayName = 'ComboboxPositioner';

export const ComboboxInputGroup = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.InputGroup>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.InputGroup>
>(({ className, ...props }, ref) => (
  <BaseCombobox.InputGroup
    ref={ref}
    className={cn(
      'relative w-full rounded-md border border-outline bg-surface text-on-surface focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary transition-[border-color,box-shadow]',
      className
    )}
    {...props}
  />
));
ComboboxInputGroup.displayName = 'ComboboxInputGroup';

export const ComboboxLabel = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Label>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Label>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Label
    ref={ref}
    className={cn('block font-label text-xs font-semibold text-on-surface-variant cursor-pointer select-none', className)}
    {...props}
  />
));
ComboboxLabel.displayName = 'ComboboxLabel';

export const ComboboxGroup = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Group>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Group ref={ref} className={cn('py-1', className)} {...props} />
));
ComboboxGroup.displayName = 'ComboboxGroup';

export const ComboboxGroupLabel = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseCombobox.GroupLabel
    ref={ref}
    className={cn(
      'sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/40 select-none',
      className
    )}
    {...props}
  />
));
ComboboxGroupLabel.displayName = 'ComboboxGroupLabel';

export const ComboboxSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Separator>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Separator
    ref={ref}
    className={cn('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
ComboboxSeparator.displayName = 'ComboboxSeparator';

export const ComboboxChips = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Chips>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Chips
    ref={ref}
    className={cn('flex flex-wrap items-center gap-1.5 p-1', className)}
    {...props}
  />
));
ComboboxChips.displayName = 'ComboboxChips';

export const ComboboxChip = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Chip>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chip>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Chip
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-surface-container text-on-surface border border-outline-variant select-none data-[disabled]:opacity-40',
      className
    )}
    {...props}
  />
));
ComboboxChip.displayName = 'ComboboxChip';

export const ComboboxChipRemove = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.ChipRemove>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.ChipRemove>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.ChipRemove
    ref={ref}
    className={cn(
      'size-4 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer transition-colors',
      className
    )}
    aria-label="Remove"
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-xs" aria-hidden="true">
        close
      </span>
    )}
  </BaseCombobox.ChipRemove>
));
ComboboxChipRemove.displayName = 'ComboboxChipRemove';

export const ComboboxBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-[2px] transition-opacity duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none',
      className
    )}
    {...props}
  />
));
ComboboxBackdrop.displayName = 'ComboboxBackdrop';

export const ComboboxArrow = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Arrow>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Arrow>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Arrow
    ref={ref}
    className={cn('fill-surface stroke-outline-variant', className)}
    {...props}
  />
));
ComboboxArrow.displayName = 'ComboboxArrow';

export const ComboboxIcon = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Icon>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Icon>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Icon
    ref={ref}
    className={cn('shrink-0 text-on-surface-variant', className)}
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        unfold_more
      </span>
    )}
  </BaseCombobox.Icon>
));
ComboboxIcon.displayName = 'ComboboxIcon';

export const ComboboxRow = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Row>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Row>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Row ref={ref} className={cn('flex items-center gap-1', className)} {...props} />
));
ComboboxRow.displayName = 'ComboboxRow';

export const ComboboxStatus = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Status>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Status>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Status ref={ref} className={cn('sr-only', className)} {...props} />
));
ComboboxStatus.displayName = 'ComboboxStatus';

// Compound Base UI exports
export const Combobox = Object.assign(ComboboxComponent, {
  Root: BaseCombobox.Root,
  Label: ComboboxLabel,
  Input: ComboboxInput,
  InputGroup: ComboboxInputGroup,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Icon: ComboboxIcon,
  Value: BaseCombobox.Value,
  Status: ComboboxStatus,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  Portal: BaseCombobox.Portal,
  Backdrop: ComboboxBackdrop,
  Positioner: ComboboxPositioner,
  Popup: ComboboxPopup,
  Arrow: ComboboxArrow,
  Empty: ComboboxEmpty,
  List: ComboboxList,
  Row: ComboboxRow,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
  Collection: BaseCombobox.Collection,
  Content: ComboboxContent,
  useFilter: BaseCombobox.useFilter,
  useFilteredItems: BaseCombobox.useFilteredItems,
  createItems: BaseCombobox.createItems,
});

export { BaseCombobox };
export const ComboboxRoot = BaseCombobox.Root;
export const ComboboxPortal = BaseCombobox.Portal;
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxCollection = BaseCombobox.Collection;
export const useComboboxFilter = BaseCombobox.useFilter;
export const useComboboxFilteredItems = BaseCombobox.useFilteredItems;
export const createComboboxItems = BaseCombobox.createItems;

export default Combobox;
