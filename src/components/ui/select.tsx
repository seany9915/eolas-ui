'use client';

import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

const SelectPositionerModeContext = React.createContext<boolean>(false);
const SelectPortalScopeContext = React.createContext<boolean>(false);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

type SelectInputValue<Value, Multiple extends boolean | undefined> = Multiple extends true
  ? readonly Value[]
  : Value;
type SelectOutputValue<Value, Multiple extends boolean | undefined> = Multiple extends true
  ? Value[]
  : Value;

export interface SelectProps<Value = string, Multiple extends boolean | undefined = false> {
  label?: React.ReactNode;
  options?: SelectOption[];
  items?: BaseSelect.Root.Props<Value, Multiple>['items'];
  groups?: SelectGroupOption[];
  value?: SelectInputValue<Value, Multiple> | null;
  defaultValue?: SelectInputValue<Value, Multiple> | null;
  onValueChange?: (
    value: SelectOutputValue<Value, Multiple> | (Multiple extends true ? never : null),
    eventDetails: BaseSelect.Root.ChangeEventDetails
  ) => void;
  onChange?: (value: SelectOutputValue<Value, Multiple>) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseSelect.Root.OpenChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  multiple?: Multiple;
  modal?: boolean;
  actionsRef?: React.RefObject<BaseSelect.Root.Actions | null>;
  inputRef?: React.Ref<HTMLInputElement>;
  form?: string;
  autoComplete?: string;
  readOnly?: boolean;
  highlightItemOnHover?: boolean;
  itemToStringLabel?: (itemValue: Value) => string;
  itemToStringValue?: (itemValue: Value) => string;
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean;
  placeholder?: React.ReactNode;
  /** Accessible name for the trigger when no visible label is rendered */
  'aria-label'?: string;
  /** References an external label or heading ID for the trigger */
  'aria-labelledby'?: string;
  error?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
  container?: BaseSelect.Portal.Props['container'];
  showBackdrop?: boolean;
  backdropClassName?: BaseSelect.Backdrop.Props['className'];
  position?: 'popper' | 'item-aligned';
  alignItemWithTrigger?: boolean;
  anchor?: BaseSelect.Positioner.Props['anchor'];
  side?: BaseSelect.Positioner.Props['side'];
  align?: BaseSelect.Positioner.Props['align'];
  sideOffset?: BaseSelect.Positioner.Props['sideOffset'];
  alignOffset?: BaseSelect.Positioner.Props['alignOffset'];
  collisionPadding?: BaseSelect.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseSelect.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseSelect.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BaseSelect.Positioner.Props['arrowPadding'];
  sticky?: BaseSelect.Positioner.Props['sticky'];
  positionMethod?: BaseSelect.Positioner.Props['positionMethod'];
  disableAnchorTracking?: BaseSelect.Positioner.Props['disableAnchorTracking'];
  finalFocus?: BaseSelect.Popup.Props['finalFocus'];
  positionerClassName?: BaseSelect.Positioner.Props['className'];
  popupClassName?: BaseSelect.Popup.Props['className'];
  listClassName?: BaseSelect.List.Props['className'];
  withScrollArrows?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

const SelectTriggerRefContext =
  React.createContext<React.ForwardedRef<HTMLButtonElement> | null>(null);

function mergeSelectRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === 'function') {
        r(node);
      } else if (r && typeof r === 'object') {
        (r as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

function SelectComponentInner<Value = string, Multiple extends boolean | undefined = false>(
  {
    label,
    options,
    items,
    groups,
    value,
    defaultValue,
    onValueChange,
    onChange,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    multiple,
    modal = false,
    actionsRef,
    inputRef,
    form,
    autoComplete,
    readOnly,
    highlightItemOnHover = true,
    itemToStringLabel,
    itemToStringValue,
    isItemEqualToValue,
    placeholder = 'Select an option',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    error,
    description,
    disabled,
    name,
    id,
    required,
    container,
    showBackdrop = false,
    backdropClassName,
    position = 'popper',
    alignItemWithTrigger,
    anchor,
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    alignOffset,
    collisionPadding = 8,
    collisionBoundary,
    collisionAvoidance,
    arrowPadding,
    sticky,
    positionMethod,
    disableAnchorTracking,
    finalFocus,
    positionerClassName,
    popupClassName,
    listClassName,
    withScrollArrows,
    size = 'md',
    children,
    className,
  }: SelectProps<Value, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>
): React.JSX.Element {
  const handleValueChange = (
    newVal: SelectOutputValue<Value, Multiple> | (Multiple extends true ? never : null),
    details: BaseSelect.Root.ChangeEventDetails
  ) => {
    onValueChange?.(newVal, details);
    if (newVal !== undefined && newVal !== null) {
      onChange?.(newVal as SelectOutputValue<Value, Multiple>);
    }
  };

  const generatedId = React.useId();
  const selectId = id || `select-${generatedId}`;
  const descriptionId = description ? `${selectId}-desc` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const resolvedItems = React.useMemo(() => {
    if (groups) {
      return groups.map((group) => ({
        label: group.label,
        items: group.options.map((opt) => ({
          value: opt.value,
          label: opt.label,
          disabled: opt.disabled,
        })),
      }));
    }
    if (options) {
      return options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        disabled: opt.disabled,
      }));
    }
    return items;
  }, [groups, options, items]);

  // If children are provided, this is a compound Select (e.g. <Select><SelectTrigger/><SelectContent/></Select>)
  if (children) {
    return (
      <SelectTriggerRefContext.Provider value={ref}>
        <BaseSelect.Root<Value, Multiple>
          id={id}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          multiple={multiple}
          disabled={disabled}
          readOnly={readOnly}
          name={name}
          form={form}
          autoComplete={autoComplete}
          required={required}
          modal={modal}
          actionsRef={actionsRef}
          inputRef={inputRef}
          items={resolvedItems}
          itemToStringLabel={itemToStringLabel}
          itemToStringValue={itemToStringValue}
          isItemEqualToValue={isItemEqualToValue}
          highlightItemOnHover={highlightItemOnHover}
        >
          {className ? <div className={className}>{children}</div> : children}
        </BaseSelect.Root>
      </SelectTriggerRefContext.Provider>
    );
  }

  const isItemAligned = alignItemWithTrigger ?? (position === 'item-aligned');
  const showScrollArrows = withScrollArrows ?? isItemAligned;

  return (
    <BaseSelect.Root<Value, Multiple>
      id={selectId}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      multiple={multiple}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      form={form}
      autoComplete={autoComplete}
      required={required}
      modal={modal}
      actionsRef={actionsRef}
      inputRef={inputRef}
      items={resolvedItems}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      isItemEqualToValue={isItemEqualToValue}
      highlightItemOnHover={highlightItemOnHover}
    >
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <BaseSelect.Label data-slot="select-label" className="font-label text-sm font-semibold text-on-surface cursor-pointer select-none">
            {label}
          </BaseSelect.Label>
        )}
        {description && (
          <p id={descriptionId} className="text-sm text-on-surface-variant font-sans">
            {description}
          </p>
        )}
        <BaseSelect.Trigger
          ref={ref}
          data-slot="select-trigger"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'inline-flex items-center justify-between gap-2 w-full rounded border bg-surface text-on-surface font-sans text-sm hover:bg-state-hover transition-colors motion-reduce:transition-none cursor-pointer',
            error
              ? 'border-error focus-visible:border-error focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-error data-[popup-open]:border-error data-[popup-open]:outline-2 data-[popup-open]:-outline-offset-1 data-[popup-open]:outline-error'
              : 'border-outline hover:border-on-surface-variant/80 focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary data-[popup-open]:border-primary data-[popup-open]:outline-2 data-[popup-open]:-outline-offset-1 data-[popup-open]:outline-primary',
            size === 'sm' && 'h-11 px-3.5 min-h-[44px] text-base sm:text-sm',
            size === 'md' && 'h-12 px-4 min-h-[48px] text-sm',
            size === 'lg' && 'h-14 px-5 min-h-[56px] text-base',
            'data-[disabled]:bg-surface-container-low data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed'
          )}
        >
          <BaseSelect.Value data-slot="select-value" placeholder={placeholder} className="truncate font-sans text-sm" />
          <BaseSelect.Icon data-slot="select-icon" className="shrink-0 text-on-surface-variant">
            <Icon name="unfold_more" size="sm" aria-hidden="true" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        {error && (
          <p id={errorId} className="flex items-center gap-1.5 text-sm text-error font-sans font-semibold">
            <Icon name="error" size="xs" className="shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        <SelectPortal container={container}>
          {showBackdrop && <SelectBackdrop className={backdropClassName} />}
          <SelectPositioner
            anchor={anchor}
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
            collisionBoundary={collisionBoundary}
            collisionAvoidance={collisionAvoidance}
            arrowPadding={arrowPadding}
            sticky={sticky}
            positionMethod={positionMethod}
            disableAnchorTracking={disableAnchorTracking}
            alignItemWithTrigger={isItemAligned}
            className={positionerClassName}
          >
            <SelectPopup
              finalFocus={finalFocus}
              className={popupClassName}
            >
              {showScrollArrows && <SelectScrollUpArrow />}
              <SelectList
                scrollable={!isItemAligned && !showScrollArrows}
                className={composeClassName(
                  showScrollArrows ? 'scroll-py-6' : 'scroll-py-1',
                  listClassName
                )}
              >
                {groups ? (
                  groups.map((group) => (
                    <BaseSelect.Group key={group.label} data-slot="select-group" className="flex flex-col gap-1 py-1">
                      {group.label && (
                        <BaseSelect.GroupLabel data-slot="select-group-label" className="sticky top-0 bg-surface/95 backdrop-blur-sm z-10 px-3 py-1 font-label text-xs font-semibold text-on-surface-variant border-b border-outline-variant/40 select-none">
                          {group.label}
                        </BaseSelect.GroupLabel>
                      )}
                      {group.options.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </BaseSelect.Group>
                  ))
                ) : options ? (
                  <BaseSelect.Group data-slot="select-group" className="flex flex-col gap-1">
                    {options.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </BaseSelect.Group>
                ) : Array.isArray(items) ? (
                  <BaseSelect.Group data-slot="select-group" className="flex flex-col gap-1">
                    {(items as Array<{ value: Value; label?: React.ReactNode; disabled?: boolean }>).map((item) => (
                      <SelectItem key={String(item.value)} value={item.value} disabled={item.disabled}>
                        {item.label ?? String(item.value)}
                      </SelectItem>
                    ))}
                  </BaseSelect.Group>
                ) : items ? (
                  <BaseSelect.Group data-slot="select-group" className="flex flex-col gap-1">
                    {Object.entries(items as Record<string, React.ReactNode>).map(([itemValue, itemLabel]) => (
                      <SelectItem key={itemValue} value={itemValue as Value}>
                        {itemLabel}
                      </SelectItem>
                    ))}
                  </BaseSelect.Group>
                ) : null}
              </SelectList>
              {showScrollArrows && <SelectScrollDownArrow />}
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </div>
    </BaseSelect.Root>
  );
}

export const SelectComponent = React.forwardRef(SelectComponentInner) as <
  Value = string,
  Multiple extends boolean | undefined = false
>(
  props: SelectProps<Value, Multiple> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element;

export interface SelectPortalProps extends React.ComponentPropsWithoutRef<typeof BaseSelect.Portal> {}

export const SelectPortal = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Portal>,
  SelectPortalProps
>(({ container, children, ...props }, ref) => (
  <SelectPortalScopeContext.Provider value={Boolean(container)}>
    <BaseSelect.Portal ref={ref} container={container} {...props}>
      {children}
    </BaseSelect.Portal>
  </SelectPortalScopeContext.Provider>
));
SelectPortal.displayName = 'SelectPortal';

// Compound Subcomponents for Compositional API
export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger> {
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Trigger>,
  SelectTriggerProps
>(({ className, children, error, size = 'md', showIcon, icon, render, nativeButton, ...props }, ref) => {
  const rootTriggerRef = React.useContext(SelectTriggerRefContext);
  const mergedRef = rootTriggerRef ? mergeSelectRefs(rootTriggerRef, ref) : ref;
  const shouldShowIcon = showIcon ?? !render;

  // Prevent duplicate chevron icon only when caller explicitly renders <Select.Icon /> or BaseSelect.Icon
  const hasIconChild = React.useMemo(() => {
    return React.Children.toArray(children).some((child) => {
      if (!React.isValidElement(child)) return false;
      const type = child.type;
      const elementProps =
        typeof child.props === 'object' && child.props !== null
          ? (child.props as Record<string, unknown>)
          : null;
      const displayName =
        type !== null && (typeof type === 'object' || typeof type === 'function') && 'displayName' in type
          ? (type as { displayName?: string }).displayName
          : undefined;
      return (
        type === BaseSelect.Icon ||
        type === SelectIcon ||
        displayName === 'SelectIcon' ||
        elementProps?.['data-slot'] === 'select-icon'
      );
    });
  }, [children]);

  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      ref={mergedRef}
      render={render}
      nativeButton={resolveNativeButton(render, nativeButton)}
      className={
        render
          ? className
          : composeClassName(
              [
                'inline-flex items-center justify-between gap-2 w-full rounded border bg-surface text-on-surface font-sans text-sm hover:bg-state-hover transition-colors motion-reduce:transition-none cursor-pointer',
                error
                  ? 'border-error focus-visible:border-error focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-error data-[popup-open]:border-error data-[popup-open]:outline-2 data-[popup-open]:-outline-offset-1 data-[popup-open]:outline-error'
                  : 'border-outline hover:border-on-surface-variant/80 focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary data-[popup-open]:border-primary data-[popup-open]:outline-2 data-[popup-open]:-outline-offset-1 data-[popup-open]:outline-primary',
                size === 'sm' && 'h-11 px-3.5 min-h-[44px] text-base sm:text-sm',
                size === 'md' && 'h-12 px-4 min-h-[48px] text-sm',
                size === 'lg' && 'h-14 px-5 min-h-[56px] text-base',
                'data-[disabled]:bg-surface-container-low data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
              ],
              className
            )
      }
      {...props}
    >
      {children}
      {shouldShowIcon && !hasIconChild && (
        <BaseSelect.Icon data-slot="select-icon" className="shrink-0 text-on-surface-variant">
          {icon ?? <Icon name="unfold_more" size="sm" aria-hidden="true" />}
        </BaseSelect.Icon>
      )}
    </BaseSelect.Trigger>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Value> {}

export const SelectValue = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Value>,
  SelectValueProps
>(({ className, placeholder, children, ...props }, ref) => (
  <BaseSelect.Value
    ref={ref}
    data-slot="select-value"
    placeholder={placeholder}
    className={composeClassName('truncate font-sans text-sm', className)}
    {...props}
  >
    {children}
  </BaseSelect.Value>
));
SelectValue.displayName = 'SelectValue';

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> {
  container?: BaseSelect.Portal.Props['container'];
  showBackdrop?: boolean;
  backdropClassName?: BaseSelect.Backdrop.Props['className'];
  anchor?: BaseSelect.Positioner.Props['anchor'];
  side?: BaseSelect.Positioner.Props['side'];
  sideOffset?: BaseSelect.Positioner.Props['sideOffset'];
  align?: BaseSelect.Positioner.Props['align'];
  alignOffset?: BaseSelect.Positioner.Props['alignOffset'];
  position?: 'popper' | 'item-aligned';
  alignItemWithTrigger?: boolean;
  collisionPadding?: BaseSelect.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseSelect.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseSelect.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BaseSelect.Positioner.Props['arrowPadding'];
  sticky?: BaseSelect.Positioner.Props['sticky'];
  positionMethod?: BaseSelect.Positioner.Props['positionMethod'];
  disableAnchorTracking?: BaseSelect.Positioner.Props['disableAnchorTracking'];
  positionerClassName?: BaseSelect.Positioner.Props['className'];
  containerClassName?: BaseSelect.Positioner.Props['className'];
  listClassName?: BaseSelect.List.Props['className'];
  withScrollArrows?: boolean;
  hasArrow?: boolean;
  scrollable?: boolean;
}

export interface SelectPositionerProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Positioner> {}

export const SelectPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Positioner>,
  SelectPositionerProps
>(({ className, side = 'bottom', align = 'start', sideOffset = 4, collisionPadding = 8, alignItemWithTrigger = false, ...props }, ref) => (
  <SelectPositionerModeContext.Provider value={alignItemWithTrigger}>
    <BaseSelect.Positioner
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      alignItemWithTrigger={alignItemWithTrigger}
      className={composeClassName('z-50 outline-none', className)}
      {...props}
    />
  </SelectPositionerModeContext.Provider>
));
SelectPositioner.displayName = 'SelectPositioner';

export interface SelectPopupProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> {}

export const SelectPopup = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Popup>,
  SelectPopupProps
>(({ className, ...props }, ref) => (
  <BaseSelect.Popup
    ref={ref}
    data-slot="select-content"
    className={composeClassName(
      'min-w-[var(--anchor-width,200px)] max-w-[var(--available-width)] max-h-[var(--available-height)] overflow-hidden p-1 rounded bg-surface border border-outline-variant shadow-ambient transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none flex flex-col',
      className
    )}
    {...props}
  />
));
SelectPopup.displayName = 'SelectPopup';

export interface SelectListProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.List> {
  /**
   * Wraps the list in `ScrollArea` when `alignItemWithTrigger` is `false` and scroll arrows are off.
   * Set to `false` if composing `Select.ScrollUpArrow` / `Select.ScrollDownArrow` manually.
   */
  scrollable?: boolean;
  /** Optional class overrides for the outer `ScrollArea` root (e.g. custom `max-h-*`). */
  scrollAreaClassName?: string;
}

export const SelectList = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.List>,
  SelectListProps
>(({ className, scrollable, scrollAreaClassName, ...props }, ref) => {
  const isItemAligned = React.useContext(SelectPositionerModeContext);
  const useScrollArea = scrollable ?? !isItemAligned;

  if (!useScrollArea) {
    return (
      <BaseSelect.List
        ref={ref}
        data-slot="select-list"
        className={composeClassName(
          'relative flex flex-col gap-1 min-h-0 flex-1 max-h-[min(20rem,calc(var(--available-height)-0.75rem))] overflow-y-auto overscroll-contain p-1 outline-none [scrollbar-width:thin]',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <ScrollArea
      className={cn(
        'min-h-0 flex-[0_1_auto] max-h-[min(20rem,calc(var(--available-height)-0.75rem))]',
        scrollAreaClassName
      )}
      viewportClassName="overscroll-contain scroll-py-1"
      viewportProps={{
        tabIndex: -1,
        onMouseDown: (e) => e.preventDefault(),
      }}
    >
      <BaseSelect.List
        ref={ref}
        data-slot="select-list"
        className={composeClassName(
          'relative flex flex-col gap-1 p-1 pe-1.5 outline-none',
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
});
SelectList.displayName = 'SelectList';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Popup>,
  SelectContentProps
>(
  (
    {
      className,
      container,
      showBackdrop = false,
      backdropClassName,
      anchor,
      side = 'bottom',
      sideOffset = 4,
      align = 'start',
      alignOffset,
      position = 'popper',
      alignItemWithTrigger,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      arrowPadding,
      sticky,
      positionMethod,
      disableAnchorTracking,
      positionerClassName,
      containerClassName,
      listClassName,
      withScrollArrows,
      hasArrow = false,
      scrollable,
      children,
      ...props
    },
    ref
  ) => {
    const isItemAligned = alignItemWithTrigger ?? (position === 'item-aligned');
    const showScrollArrows = withScrollArrows ?? isItemAligned;
    const resolvedPositionerClassName =
      typeof containerClassName === 'function' || typeof positionerClassName === 'function'
        ? (state: BaseSelect.Positioner.State) =>
            cn(
              typeof containerClassName === 'function' ? containerClassName(state) : containerClassName,
              typeof positionerClassName === 'function' ? positionerClassName(state) : positionerClassName
            )
        : cn(containerClassName, positionerClassName) || undefined;

    return (
      <SelectPortal container={container}>
        {showBackdrop && <SelectBackdrop className={backdropClassName} />}
        <SelectPositioner
          anchor={anchor}
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          collisionBoundary={collisionBoundary}
          collisionAvoidance={collisionAvoidance}
          arrowPadding={arrowPadding}
          sticky={sticky}
          positionMethod={positionMethod}
          disableAnchorTracking={disableAnchorTracking}
          alignItemWithTrigger={isItemAligned}
          className={resolvedPositionerClassName}
        >
          <SelectPopup
            ref={ref}
            className={className}
            {...props}
          >
            {hasArrow && <SelectArrow />}
            {showScrollArrows && <SelectScrollUpArrow />}
            <SelectList
              scrollable={scrollable ?? (!isItemAligned && !showScrollArrows)}
              className={composeClassName(
                showScrollArrows ? 'scroll-py-6' : 'scroll-py-1',
                listClassName
              )}
            >
              {children}
            </SelectList>
            {showScrollArrows && <SelectScrollDownArrow />}
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    );
  }
);
SelectContent.displayName = 'SelectContent';

export interface SelectItemTextProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.ItemText> {}

export const SelectItemText = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.ItemText>,
  SelectItemTextProps
>(({ className, ...props }, ref) => (
  <BaseSelect.ItemText
    ref={ref}
    data-slot="select-item-text"
    className={composeClassName('truncate', className)}
    {...props}
  />
));
SelectItemText.displayName = 'SelectItemText';

export interface SelectItemIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.ItemIndicator> {}

export const SelectItemIndicator = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.ItemIndicator>,
  SelectItemIndicatorProps
>(({ className, children, ...props }, ref) => (
  <BaseSelect.ItemIndicator
    ref={ref}
    data-slot="select-item-indicator"
    className={composeClassName('shrink-0 text-primary flex items-center justify-center', className)}
    {...props}
  >
    {children ?? <Icon name="check" size="xs" aria-hidden="true" />}
  </BaseSelect.ItemIndicator>
));
SelectItemIndicator.displayName = 'SelectItemIndicator';

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseSelect.Item> {
  indicatorPosition?: 'start' | 'end';
  showIndicator?: boolean;
  indicator?: React.ReactNode;
}

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Item>,
  SelectItemProps
>(({ className, children, indicatorPosition = 'end', showIndicator = true, indicator, ...props }, ref) => {
  const { hasItemText, hasItemIndicator } = React.useMemo(() => {
    let foundText = false;
    let foundIndicator = false;
    for (const child of React.Children.toArray(children)) {
      if (!React.isValidElement(child)) continue;
      const type = child.type;
      const displayName =
        type !== null && (typeof type === 'object' || typeof type === 'function') && 'displayName' in type
          ? (type as { displayName?: string }).displayName
          : undefined;
      const elementProps =
        typeof child.props === 'object' && child.props !== null
          ? (child.props as Record<string, unknown>)
          : null;
      if (
        type === SelectItemText ||
        type === BaseSelect.ItemText ||
        displayName === 'SelectItemText' ||
        elementProps?.['data-slot'] === 'select-item-text'
      ) {
        foundText = true;
      }
      if (
        type === SelectItemIndicator ||
        type === BaseSelect.ItemIndicator ||
        displayName === 'SelectItemIndicator' ||
        elementProps?.['data-slot'] === 'select-item-indicator'
      ) {
        foundIndicator = true;
      }
    }
    return { hasItemText: foundText, hasItemIndicator: foundIndicator };
  }, [children]);

  return (
    <BaseSelect.Item
      ref={ref}
      data-slot="select-item"
      className={composeClassName(
        [
          'relative flex items-center justify-between px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium text-on-surface cursor-pointer select-none outline-none transition-colors motion-reduce:transition-none',
          'hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface',
          'data-[selected]:bg-surface-container-low data-[selected]:text-primary data-[selected]:font-semibold',
          'data-[selected]:hover:bg-primary-container data-[selected]:hover:text-on-primary-container data-[selected]:data-[highlighted]:bg-primary-container data-[selected]:data-[highlighted]:text-on-primary-container',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          indicatorPosition === 'start' && 'flex-row-reverse justify-end gap-2.5',
        ],
        className
      )}
      {...props}
    >
      {hasItemText || hasItemIndicator ? children : <SelectItemText>{children}</SelectItemText>}
      {showIndicator && !hasItemIndicator && (
        <SelectItemIndicator>{indicator}</SelectItemIndicator>
      )}
    </BaseSelect.Item>
  );
});
SelectItem.displayName = 'SelectItem';

export const SelectBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Backdrop>
>(({ className, ...props }, ref) => {
  const isScoped = React.useContext(SelectPortalScopeContext);

  return (
    <BaseSelect.Backdrop
      ref={ref}
      data-slot="select-backdrop"
      className={composeClassName(
        cn(
          isScoped ? 'absolute inset-0' : 'fixed inset-0',
          'z-40 bg-on-surface/40 backdrop-blur-[2px] transition-opacity duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none'
        ),
        className
      )}
      {...props}
    />
  );
});
SelectBackdrop.displayName = 'SelectBackdrop';

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Label>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Label>
>(({ className, ...props }, ref) => (
  <BaseSelect.Label
    ref={ref}
    data-slot="select-label"
    className={composeClassName('font-label text-sm font-semibold text-on-surface cursor-pointer select-none', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

export const SelectGroup = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Group>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Group>
>(({ className, ...props }, ref) => (
  <BaseSelect.Group ref={ref} data-slot="select-group" className={composeClassName('flex flex-col gap-1 py-1', className)} {...props} />
));
SelectGroup.displayName = 'SelectGroup';

export const SelectGroupLabel = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    data-slot="select-group-label"
    className={composeClassName(
      'px-3 py-1 font-label text-xs font-semibold text-on-surface-variant border-b border-outline-variant/40 select-none sticky top-0 bg-surface/95 backdrop-blur-sm z-10',
      className
    )}
    {...props}
  />
));
SelectGroupLabel.displayName = 'SelectGroupLabel';

export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Separator>
>(({ className, ...props }, ref) => (
  <BaseSelect.Separator
    ref={ref}
    data-slot="select-separator"
    className={composeClassName('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';

export const SelectArrow = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Arrow>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Arrow>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Arrow
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
  </BaseSelect.Arrow>
));
SelectArrow.displayName = 'SelectArrow';

export const SelectScrollUpArrow = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.ScrollUpArrow>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.ScrollUpArrow>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.ScrollUpArrow
    ref={ref}
    data-slot="select-scroll-up-button"
    className={composeClassName(
      'top-0 inset-x-0 z-10 flex h-6 w-full items-center justify-center cursor-default text-on-surface-variant bg-surface/95 backdrop-blur-xs select-none border-b border-outline-variant/30',
      className
    )}
    {...props}
  >
    {children ?? <Icon name="keyboard_arrow_up" size="xs" aria-hidden="true" />}
  </BaseSelect.ScrollUpArrow>
));
SelectScrollUpArrow.displayName = 'SelectScrollUpArrow';

export const SelectScrollDownArrow = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.ScrollDownArrow>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.ScrollDownArrow>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.ScrollDownArrow
    ref={ref}
    data-slot="select-scroll-down-button"
    className={composeClassName(
      'bottom-0 inset-x-0 z-10 flex h-6 w-full items-center justify-center cursor-default text-on-surface-variant bg-surface/95 backdrop-blur-xs select-none border-t border-outline-variant/30',
      className
    )}
    {...props}
  >
    {children ?? <Icon name="keyboard_arrow_down" size="xs" aria-hidden="true" />}
  </BaseSelect.ScrollDownArrow>
));
SelectScrollDownArrow.displayName = 'SelectScrollDownArrow';

export const SelectIcon = React.forwardRef<
  React.ComponentRef<typeof BaseSelect.Icon>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Icon>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Icon
    ref={ref}
    data-slot="select-icon"
    className={composeClassName('shrink-0 text-on-surface-variant', className)}
    {...props}
  >
    {children ?? <Icon name="unfold_more" size="sm" aria-hidden="true" />}
  </BaseSelect.Icon>
));
SelectIcon.displayName = 'SelectIcon';

// Compound export mapping Base UI primitives & composite wrappers
export const Select = Object.assign(SelectComponent, {
  Root: BaseSelect.Root,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Arrow: SelectArrow,
  ScrollDownArrow: SelectScrollDownArrow,
  ScrollUpArrow: SelectScrollUpArrow,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  Content: SelectContent,
});

// Re-export Base UI primitives and compound components for composition
export { BaseSelect };
export const SelectRoot = BaseSelect.Root;
export const SelectPortalPrimitive = BaseSelect.Portal;
export const SelectItemTextPrimitive = BaseSelect.ItemText;
export const SelectItemIndicatorPrimitive = BaseSelect.ItemIndicator;

export default Select;
