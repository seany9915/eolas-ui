import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/utils';

export interface MenuItemData {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface MenuItemProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Item> {
  destructive?: boolean;
  icon?: string;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, destructive, icon, children, ...props }, ref) => (
    <BaseMenu.Item
      ref={ref}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none',
        destructive
          ? 'text-error hover:bg-error/10 focus:bg-error/10 data-[highlighted]:bg-error/10 data-[highlighted]:text-error'
          : 'text-on-surface hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
        'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="truncate flex-1">{children}</span>
    </BaseMenu.Item>
  )
);
MenuItem.displayName = 'MenuItem';

export interface MenuContentProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  containerClassName?: string;
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  (
    {
      className,
      children,
      side,
      align,
      sideOffset = 4,
      alignOffset,
      collisionPadding = 8,
      containerClassName,
      ...props
    },
    ref
  ) => (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn('z-50 outline-none', containerClassName)}
      >
        <BaseMenu.Popup
          ref={ref}
          className={cn(
            'min-w-[200px] p-1 rounded-lg bg-surface border border-outline-variant shadow-ambient outline-none',
            'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
            'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
            className
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
);
MenuContent.displayName = 'MenuContent';

export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
MenuSeparator.displayName = 'MenuSeparator';

export interface MenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger> {}

export const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <BaseMenu.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-between gap-2 h-11 px-4 min-h-[44px] rounded-md border border-outline bg-surface text-on-surface font-label text-sm font-semibold hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </BaseMenu.Trigger>
  )
);
MenuTrigger.displayName = 'MenuTrigger';

export interface MenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem> {
  icon?: string;
}

export const MenuCheckboxItem = React.forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  ({ className, children, icon, ...props }, ref) => (
    <BaseMenu.CheckboxItem
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none text-on-surface',
        'hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
        'data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 truncate">
        {icon && (
          <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </div>
      <BaseMenu.CheckboxItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-base font-bold" aria-hidden="true">
          check
        </span>
      </BaseMenu.CheckboxItemIndicator>
    </BaseMenu.CheckboxItem>
  )
);
MenuCheckboxItem.displayName = 'MenuCheckboxItem';

export interface MenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem> {
  icon?: string;
}

export const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>(
  ({ className, children, icon, ...props }, ref) => (
    <BaseMenu.RadioItem
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none text-on-surface',
        'hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
        'data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 truncate">
        {icon && (
          <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </div>
      <BaseMenu.RadioItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-base font-bold" aria-hidden="true">
          radio_button_checked
        </span>
      </BaseMenu.RadioItemIndicator>
    </BaseMenu.RadioItem>
  )
);
MenuRadioItem.displayName = 'MenuRadioItem';

export interface MenuSubmenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> {
  icon?: string;
}

export const MenuSubmenuTrigger = React.forwardRef<HTMLDivElement, MenuSubmenuTriggerProps>(
  ({ className, children, icon, ...props }, ref) => (
    <BaseMenu.SubmenuTrigger
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none text-on-surface',
        'hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
        'data-[popup-open]:bg-surface-container data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 truncate">
        {icon && (
          <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </div>
      <span className="material-symbols-outlined text-base text-on-surface-variant shrink-0" aria-hidden="true">
        chevron_right
      </span>
    </BaseMenu.SubmenuTrigger>
  )
);
MenuSubmenuTrigger.displayName = 'MenuSubmenuTrigger';

export const MenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseMenu.GroupLabel
    ref={ref}
    className={cn('px-3 py-1.5 font-label text-xs font-bold text-on-surface-variant select-none', className)}
    {...props}
  />
));
MenuGroupLabel.displayName = 'MenuGroupLabel';

export const MenuGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseMenu.Group ref={ref} className={cn('py-1', className)} {...props} />
));
MenuGroup.displayName = 'MenuGroup';

export const MenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseMenu.RadioGroup ref={ref} className={cn('py-1', className)} {...props} />
));
MenuRadioGroup.displayName = 'MenuRadioGroup';

export const MenuLinkItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>
>(({ className, ...props }, ref) => (
  <BaseMenu.LinkItem
    ref={ref}
    className={cn(
      'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none text-on-surface hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
      className
    )}
    {...props}
  />
));
MenuLinkItem.displayName = 'MenuLinkItem';

export interface MenuProps<Payload = unknown> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  triggerLabel?: string;
  trigger?: React.ReactNode;
  items?: MenuItemData[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseMenu.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  modal?: boolean;
  loopFocus?: boolean;
  highlightItemOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  closeParentOnEsc?: boolean;
  actionsRef?: React.RefObject<BaseMenu.Root.Actions | null>;
  handle?: BaseMenu.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  fullWidth?: boolean;
  className?: string;
  children?: BaseMenu.Root.Props<Payload>['children'];
}

function MenuComponent<Payload = unknown>({
  label,
  description,
  triggerLabel = 'Menu',
  trigger,
  items,
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  modal = true,
  loopFocus = true,
  highlightItemOnHover = true,
  orientation = 'vertical',
  disabled = false,
  closeParentOnEsc = false,
  actionsRef,
  handle,
  triggerId,
  defaultTriggerId,
  side,
  align,
  sideOffset = 4,
  alignOffset,
  collisionPadding = 8,
  fullWidth = true,
  className,
  children,
}: MenuProps<Payload>): React.JSX.Element {
  const generatedId = React.useId();
  const menuId = `menu-${generatedId}`;

  // If used as composable compound root (<Menu open={...}><MenuTrigger /><MenuContent /></Menu>)
  if (!trigger && !items && !label && !description) {
    return (
      <BaseMenu.Root<Payload>
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        modal={modal}
        loopFocus={loopFocus}
        highlightItemOnHover={highlightItemOnHover}
        orientation={orientation}
        disabled={disabled}
        closeParentOnEsc={closeParentOnEsc}
        actionsRef={actionsRef}
        handle={handle}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
      >
        {children}
      </BaseMenu.Root>
    );
  }

  const renderChildren = (renderProps: { payload: Payload | undefined }) => {
    if (typeof children === 'function') {
      return children(renderProps);
    }
    return children;
  };

  const menuTree = (
    <BaseMenu.Root<Payload>
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      modal={modal}
      loopFocus={loopFocus}
      highlightItemOnHover={highlightItemOnHover}
      orientation={orientation}
      disabled={disabled}
      closeParentOnEsc={closeParentOnEsc}
      actionsRef={actionsRef}
      handle={handle}
      triggerId={triggerId}
      defaultTriggerId={defaultTriggerId}
    >
      {(renderProps) => (
        <>
          {trigger ? (
            <BaseMenu.Trigger
              id={menuId}
              render={React.isValidElement(trigger) ? trigger : undefined}
            >
              {!React.isValidElement(trigger) ? trigger : undefined}
            </BaseMenu.Trigger>
          ) : (
            <BaseMenu.Trigger
              id={menuId}
              className={cn(
                'inline-flex items-center justify-between gap-2 h-11 px-4 min-h-[44px] rounded-md border border-outline bg-surface text-on-surface font-label text-sm font-semibold hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
                fullWidth ? 'w-full' : 'w-max',
                className
              )}
            >
              <span>{triggerLabel}</span>
              <span className="material-symbols-outlined text-lg text-on-surface-variant" aria-hidden="true">
                arrow_drop_down
              </span>
            </BaseMenu.Trigger>
          )}
          <BaseMenu.Portal>
            <BaseMenu.Positioner
              side={side}
              align={align}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              collisionPadding={collisionPadding}
              className="z-50 outline-none"
            >
              <BaseMenu.Popup
                className={cn(
                  'min-w-[200px] p-1 rounded-lg bg-surface border border-outline-variant shadow-ambient outline-none',
                  'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
                  'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
                  'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
                  'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
                  className
                )}
              >
                {children
                  ? renderChildren(renderProps)
                  : items?.map((item) => (
                      <MenuItem
                        key={item.id}
                        onClick={item.onClick}
                        disabled={item.disabled}
                        destructive={item.destructive}
                        icon={item.icon}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </BaseMenu.Portal>
        </>
      )}
    </BaseMenu.Root>
  );

  if (label || description) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={menuId} className="font-label text-xs font-semibold text-on-surface-variant cursor-pointer select-none">
            {label}
          </label>
        )}
        {description && (
          <span className="font-sans text-sm text-on-surface-variant">
            {description}
          </span>
        )}
        {menuTree}
      </div>
    );
  }

  return menuTree;
}

// Compound export mapping Base UI primitives and styled composites
export const Menu = Object.assign(MenuComponent, {
  Root: BaseMenu.Root,
  Trigger: MenuTrigger,
  Portal: BaseMenu.Portal,
  Positioner: BaseMenu.Positioner,
  Popup: BaseMenu.Popup,
  Content: MenuContent,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  SubmenuRoot: BaseMenu.SubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: BaseMenu.CheckboxItemIndicator,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: BaseMenu.RadioItemIndicator,
  Arrow: BaseMenu.Arrow,
  Backdrop: BaseMenu.Backdrop,
  Viewport: BaseMenu.Viewport,
  createHandle: BaseMenu.createHandle,
  Handle: BaseMenu.Handle,
});

// Re-export Base UI primitives and styled components for composition
export { BaseMenu };
export const MenuRoot = BaseMenu.Root;
export const MenuPortal = BaseMenu.Portal;
export const MenuPositioner = BaseMenu.Positioner;
export const MenuPopup = BaseMenu.Popup;
export const MenuItemPrimitive = BaseMenu.Item;
export const MenuSubmenuRoot = BaseMenu.SubmenuRoot;
export const MenuCheckboxItemIndicator = BaseMenu.CheckboxItemIndicator;
export const MenuRadioItemIndicator = BaseMenu.RadioItemIndicator;
export const MenuArrow = BaseMenu.Arrow;
export const MenuBackdrop = BaseMenu.Backdrop;
export const MenuViewport = BaseMenu.Viewport;
export const createMenuHandle = BaseMenu.createHandle;
export const MenuHandle = BaseMenu.Handle;

export default Menu;
