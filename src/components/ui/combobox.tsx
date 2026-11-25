'use client';

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
import { cn, composeClassName } from '@/lib/utils';

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

type ComboboxInputValue<Value, Multiple extends boolean | undefined> = Multiple extends true ? readonly Value[] : Value;
type ComboboxOutputValue<Value, Multiple extends boolean | undefined> = Multiple extends true ? Value[] : Value;

export interface ComboboxProps<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  label?: React.ReactNode;
  placeholder?: string;
  options?: ComboboxOption[];
  items?: BaseCombobox.Root.Props<Value, Multiple, Item>['items'];
  groups?: ComboboxGroupOption[];
  value?: ComboboxInputValue<Value, Multiple> | null;
  defaultValue?: ComboboxInputValue<Value, Multiple> | null;
  inputValue?: string;
  defaultInputValue?: string;
  onValueChange?: BaseCombobox.Root.Props<Value, Multiple, Item>['onValueChange'];
  onChange?: (value: ComboboxOutputValue<Value, Multiple> | (Multiple extends true ? never : null)) => void;
  onInputValueChange?: BaseCombobox.Root.Props<Value, Multiple, Item>['onInputValueChange'];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: BaseCombobox.Root.Props<Value, Multiple, Item>['onOpenChange'];
  onOpenChangeComplete?: BaseCombobox.Root.Props<Value, Multiple, Item>['onOpenChangeComplete'];
  onItemHighlighted?: BaseCombobox.Root.Props<Value, Multiple, Item>['onItemHighlighted'];
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
  inline?: boolean;
  grid?: boolean;
  virtualized?: boolean;
  locale?: Intl.LocalesArgument;
  actionsRef?: React.RefObject<BaseCombobox.Root.Actions | null>;
  inputRef?: React.Ref<HTMLInputElement>;
  itemToStringLabel?: BaseCombobox.Root.Props<Value, Multiple, Item>['itemToStringLabel'];
  itemToStringValue?: BaseCombobox.Root.Props<Value, Multiple, Item>['itemToStringValue'];
  isItemEqualToValue?: BaseCombobox.Root.Props<Value, Multiple, Item>['isItemEqualToValue'];
  filter?: BaseCombobox.Root.Props<Value, Multiple, Item>['filter'];
  filteredItems?: BaseCombobox.Root.Props<Value, Multiple, Item>['filteredItems'];
  limit?: number;
  error?: boolean | string;
  description?: React.ReactNode;
  container?: BaseCombobox.Portal.Props['container'];
  anchor?: BaseCombobox.Positioner.Props['anchor'];
  side?: BaseCombobox.Positioner.Props['side'];
  align?: BaseCombobox.Positioner.Props['align'];
  sideOffset?: BaseCombobox.Positioner.Props['sideOffset'];
  alignOffset?: BaseCombobox.Positioner.Props['alignOffset'];
  collisionPadding?: BaseCombobox.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseCombobox.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseCombobox.Positioner.Props['collisionAvoidance'];
  positionerClassName?: BaseCombobox.Positioner.Props['className'];
  popupClassName?: BaseCombobox.Popup.Props['className'];
  listClassName?: BaseCombobox.List.Props['className'];
  inputGroupClassName?: BaseCombobox.InputGroup.Props['className'];
  inputClassName?: BaseCombobox.Input.Props['className'];
  emptyMessage?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

function ComboboxComponentInner<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
>(
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
    onItemHighlighted,
    multiple,
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
    inline,
    grid,
    virtualized,
    locale,
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
  }: ComboboxProps<Value, Multiple, Item>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
    // Unify onValueChange and onChange without suppressing eventDetails
    const handleValueChange = (
      val: ComboboxOutputValue<Value, Multiple> | (Multiple extends true ? never : null),
      eventDetails: BaseCombobox.Root.ChangeEventDetails
    ) => {
      onValueChange?.(val, eventDetails);
      onChange?.(val);
    };

    const generatedId = React.useId();
    const comboboxId = id || `combobox-${generatedId}`;
    const descriptionId = description ? `${comboboxId}-desc` : undefined;
    const errorId = typeof error === 'string' && error ? `${comboboxId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    // Normalize flat options
    const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
      const list = options ?? (Array.isArray(items) ? (items as unknown[]) : undefined);
      if (list && Array.isArray(list) && list.length > 0) {
        return list.map((opt, index) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: String(opt), label: String(opt), disabled: false };
          }
          const optionObj = opt as Partial<ComboboxOption> | null | undefined;
          return {
            value: String(optionObj?.value ?? optionObj?.label ?? index),
            label: String(optionObj?.label ?? optionObj?.value ?? index),
            disabled: !!optionObj?.disabled,
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

    // If children are provided, this is a compositional/compound Combobox
    if (children) {
      const rootNode = (
        <BaseCombobox.Root<Value, Multiple, Item>
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
          onItemHighlighted={onItemHighlighted}
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
          inline={inline}
          grid={grid}
          virtualized={virtualized}
          locale={locale}
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

      if (ref != null || className !== undefined || Object.keys(props).length > 0) {
        return (
          <div ref={ref} data-slot="combobox" className={className} {...props}>
            {rootNode}
          </div>
        );
      }
      return rootNode;
    }

    return (
      <div ref={ref} data-slot="combobox" className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
        <BaseCombobox.Root<Value, Multiple, Item>
          items={itemCollection as BaseCombobox.Root.Props<Value, Multiple, Item>['items']}
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
          onItemHighlighted={onItemHighlighted}
          multiple={multiple}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          id={comboboxId}
          form={form}
          autoComplete={autoComplete}
          autoHighlight={autoHighlight}
          highlightItemOnHover={highlightItemOnHover}
          loopFocus={loopFocus}
          openOnInputClick={openOnInputClick}
          modal={modal}
          inline={inline}
          grid={grid}
          virtualized={virtualized}
          locale={locale}
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
            <label
              htmlFor={comboboxId}
              id={`${comboboxId}-label`}
              className="block font-label text-sm font-semibold text-on-surface cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <p id={descriptionId} className="text-xs text-on-surface-variant font-sans">
              {description}
            </p>
          )}

          <ComboboxInputGroup
            size={size}
            className={composeClassName(
              [
                error && 'border-error focus-within:outline-error',
                disabled && 'bg-surface-container-low border-outline-variant text-on-surface-variant/60 cursor-not-allowed',
              ],
              inputGroupClassName
            )}
          >
            <BaseCombobox.Input
              data-slot="combobox-input"
              id={comboboxId}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              aria-labelledby={label ? `${comboboxId}-label` : undefined}
              className={composeClassName(
                [
                  'flex-1 min-w-0 self-stretch h-auto bg-transparent border-0 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/80 outline-none',
                  size === 'sm' && 'py-1.5 ps-3 pe-1 text-xs',
                  size === 'md' && 'py-2 ps-3.5 pe-1 text-sm',
                  size === 'lg' && 'py-2.5 ps-5 pe-1 text-base',
                  'disabled:cursor-not-allowed',
                ],
                inputClassName
              )}
            />
            <div className="flex items-center gap-1.5 pe-2 shrink-0">
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

const ComboboxComponent = React.forwardRef(ComboboxComponentInner) as (<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
>(
  props: ComboboxProps<Value, Multiple, Item> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };

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
    data-slot="combobox-input"
    ref={ref}
    className={composeClassName(
      [
        'w-full rounded border border-outline bg-surface text-on-surface font-sans text-sm placeholder:text-on-surface-variant/80 transition-colors',
        size === 'sm' && 'h-11 px-3 min-h-[44px] text-xs',
        size === 'md' && 'h-12 px-3.5 min-h-[48px] text-sm',
        size === 'lg' && 'h-14 px-5 min-h-[56px] text-base',
        'hover:border-on-surface-variant/80',
        'focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
        '[[data-slot=combobox-input-group]_&]:border-0 [[data-slot=combobox-input-group]_&]:bg-transparent [[data-slot=combobox-input-group]_&]:rounded-none [[data-slot=combobox-input-group]_&]:focus-visible:outline-none [[data-slot=combobox-input-group]_&]:hover:border-0 [[data-slot=combobox-input-group]_&]:flex-1 [[data-slot=combobox-input-group]_&]:min-w-0 [[data-slot=combobox-input-group]_&]:h-auto [[data-slot=combobox-input-group]_&]:min-h-0 [[data-slot=combobox-input-group]_&]:self-stretch',
        'disabled:bg-surface-container-low disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        error && 'border-error focus-visible:outline-error',
      ],
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
>(({ className, children, showIcon = true, icon, ...props }, ref) => {
  const hasChildren = Boolean(children);

  return (
    <BaseCombobox.Trigger
      ref={ref}
      data-slot="combobox-trigger"
      tabIndex={hasChildren ? props.tabIndex : (props.tabIndex ?? -1)}
      aria-label={hasChildren ? undefined : 'Toggle options'}
      className={composeClassName(
        hasChildren
          ? 'inline-flex items-center justify-between gap-2 h-12 px-4 min-h-[48px] rounded border border-outline bg-surface text-on-surface font-sans text-sm hover:border-on-surface-variant/80 hover:bg-state-hover focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary transition-colors cursor-pointer disabled:bg-surface-container-low disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed'
          : 'relative size-8 min-w-[32px] min-h-[32px] rounded-sm flex items-center justify-center after:absolute after:-inset-y-1.5 after:-inset-x-0.5 after:content-[\'\'] text-on-surface-variant hover:text-on-surface hover:bg-state-hover transition-colors cursor-pointer border-0 bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    >
      {children}
      {showIcon && (
        <BaseCombobox.Icon data-slot="combobox-icon" className="shrink-0 text-on-surface-variant flex items-center justify-center">
          {icon ?? (
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              unfold_more
            </span>
          )}
        </BaseCombobox.Icon>
      )}
    </BaseCombobox.Trigger>
  );
});
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
      data-slot="combobox-item"
      className={composeClassName(
        [
          'relative flex items-center justify-between px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium text-on-surface cursor-pointer select-none outline-none transition-colors',
          'hover:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface',
          'data-[selected]:bg-surface-container-low data-[selected]:text-primary data-[selected]:font-semibold',
          'data-[selected]:hover:bg-primary-container data-[selected]:hover:text-on-primary-container data-[selected]:data-[highlighted]:bg-primary-container data-[selected]:data-[highlighted]:text-on-primary-container',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          indicatorPosition === 'start' && 'flex-row-reverse justify-end gap-2.5',
        ],
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
    data-slot="combobox-item-indicator"
    className={composeClassName('shrink-0 text-primary flex items-center justify-center', className)}
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
  keepMounted?: boolean;
  anchor?: BaseCombobox.Positioner.Props['anchor'];
  side?: BaseCombobox.Positioner.Props['side'];
  sideOffset?: BaseCombobox.Positioner.Props['sideOffset'];
  align?: BaseCombobox.Positioner.Props['align'];
  alignOffset?: BaseCombobox.Positioner.Props['alignOffset'];
  collisionPadding?: BaseCombobox.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseCombobox.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseCombobox.Positioner.Props['collisionAvoidance'];
  positionerClassName?: BaseCombobox.Positioner.Props['className'];
}

export const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Popup>,
  ComboboxContentProps
>(
  (
    {
      className,
      container,
      keepMounted,
      anchor,
      side = 'bottom',
      sideOffset = 4,
      align = 'start',
      alignOffset,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      positionerClassName,
      children,
      ...props
    },
    ref
  ) => (
    <BaseCombobox.Portal container={container} keepMounted={keepMounted}>
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
    data-slot="combobox-clear"
    className={composeClassName(
      'relative size-8 min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center after:absolute after:-inset-y-1.5 after:-inset-x-0.5 after:content-[\'\'] text-on-surface-variant hover:text-on-surface hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
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
    data-slot="combobox-empty"
    className={composeClassName(
      [
        'px-3 py-2.5 text-xs font-sans text-on-surface-variant text-center select-none',
        'empty:p-0 empty:m-0 empty:h-0 empty:min-h-0 empty:border-0 overflow-hidden',
      ],
      className
    )}
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
    data-slot="combobox-list"
    className={composeClassName(
      'max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 flex flex-col gap-0.5 outline-none data-[empty]:p-0',
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
    data-slot="combobox-content"
    className={composeClassName(
      'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] p-1 rounded bg-surface border border-outline-variant shadow-ambient transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none flex flex-col',
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
  <BaseCombobox.Positioner ref={ref} data-slot="combobox-positioner" className={composeClassName('z-50 outline-none', className)} {...props} />
));
ComboboxPositioner.displayName = 'ComboboxPositioner';

export interface ComboboxInputGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.InputGroup> {
  size?: 'sm' | 'md' | 'lg';
}

export const ComboboxInputGroup = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.InputGroup>,
  ComboboxInputGroupProps
>(({ className, size = 'md', ...props }, ref) => (
  <BaseCombobox.InputGroup
    data-slot="combobox-input-group"
    ref={ref}
    className={composeClassName(
      [
        'relative flex items-stretch w-full rounded border border-outline bg-surface text-on-surface hover:border-on-surface-variant/80 transition-[border-color,outline-color]',
        size === 'sm' && 'min-h-11',
        size === 'md' && 'min-h-12',
        size === 'lg' && 'min-h-14',
        'data-[popup-open]:border-primary data-[popup-open]:outline-2 data-[popup-open]:-outline-offset-1 data-[popup-open]:outline-primary',
        'focus-within:border-primary focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary',
        'data-[disabled]:bg-surface-container-low data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
        'data-[invalid]:border-error data-[invalid]:focus-within:border-error data-[invalid]:focus-within:outline-error',
      ],
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
    data-slot="combobox-label"
    className={composeClassName('block font-label text-sm font-semibold text-on-surface cursor-pointer select-none', className)}
    {...props}
  />
));
ComboboxLabel.displayName = 'ComboboxLabel';

export const ComboboxGroup = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Group>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Group ref={ref} data-slot="combobox-group" className={composeClassName('py-1', className)} {...props} />
));
ComboboxGroup.displayName = 'ComboboxGroup';

export const ComboboxGroupLabel = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseCombobox.GroupLabel
    ref={ref}
    data-slot="combobox-group-label"
    className={composeClassName(
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
    data-slot="combobox-separator"
    className={composeClassName('h-px my-1 bg-outline-variant/60 -mx-1', className)}
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
    data-slot="combobox-chips"
    className={composeClassName('flex flex-wrap items-center gap-2 p-1', className)}
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
    data-slot="combobox-chip"
    className={composeClassName(
      'inline-flex items-center gap-1 ps-2.5 pe-1 py-0.5 min-h-7 max-w-full rounded-sm text-xs font-medium bg-surface-container-high text-on-surface border border-outline-variant select-none data-[disabled]:opacity-40',
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
    data-slot="combobox-chip-remove"
    className={composeClassName(
      'size-6 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer transition-colors',
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
    data-slot="combobox-backdrop"
    className={composeClassName(
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
    data-slot="combobox-arrow"
    className={composeClassName(
      [
        'z-10 fill-surface stroke-outline-variant',
        'data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-7.5px] data-[side=right]:left-[-7.5px]',
        'data-[side=inline-start]:end-[-7.5px] data-[side=inline-end]:start-[-7.5px]',
        'data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90',
        'data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90',
      ],
      className
    )}
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
    data-slot="combobox-icon"
    className={composeClassName('shrink-0 text-on-surface-variant', className)}
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
  <BaseCombobox.Row ref={ref} data-slot="combobox-row" className={composeClassName('flex items-center gap-1', className)} {...props} />
));
ComboboxRow.displayName = 'ComboboxRow';

export const ComboboxStatus = React.forwardRef<
  React.ComponentRef<typeof BaseCombobox.Status>,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Status>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Status ref={ref} data-slot="combobox-status" className={composeClassName('sr-only', className)} {...props} />
));
ComboboxStatus.displayName = 'ComboboxStatus';

export function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

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
  useAnchor: useComboboxAnchor,
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
