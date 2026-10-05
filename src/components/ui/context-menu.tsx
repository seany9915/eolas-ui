import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { cn } from '@/lib/utils';

export interface ContextMenuItemData {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  shortcut?: string;
  action?: () => void;
  onClick?: () => void;
}

export interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.Item> {
  destructive?: boolean;
  icon?: string;
  shortcut?: string;
}

export const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, destructive, icon, shortcut, children, ...props }, ref) => (
    <BaseContextMenu.Item
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
      {shortcut && (
        <span className="font-mono text-xs text-on-surface-variant font-medium tracking-wider ml-auto">
          {shortcut}
        </span>
      )}
    </BaseContextMenu.Item>
  )
);
ContextMenuItem.displayName = 'ContextMenuItem';

export interface ContextMenuContentProps extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup> {
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  containerClassName?: string;
}

export const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  (
    {
      className,
      children,
      sideOffset = 4,
      alignOffset,
      collisionPadding = 8,
      containerClassName,
      ...props
    },
    ref
  ) => (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn('z-50 outline-none', containerClassName)}
      >
        <BaseContextMenu.Popup
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
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  )
);
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Separator
    ref={ref}
    className={cn('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Trigger ref={ref} className={className} {...props} />
));
ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.CheckboxItem> {
  icon?: string;
}

export const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, ContextMenuCheckboxItemProps>(
  ({ className, children, icon, ...props }, ref) => (
    <BaseContextMenu.CheckboxItem
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
      <BaseContextMenu.CheckboxItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-base font-bold" aria-hidden="true">
          check
        </span>
      </BaseContextMenu.CheckboxItemIndicator>
    </BaseContextMenu.CheckboxItem>
  )
);
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.RadioItem> {
  icon?: string;
}

export const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, ContextMenuRadioItemProps>(
  ({ className, children, icon, ...props }, ref) => (
    <BaseContextMenu.RadioItem
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
      <BaseContextMenu.RadioItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-base font-bold" aria-hidden="true">
          radio_button_checked
        </span>
      </BaseContextMenu.RadioItemIndicator>
    </BaseContextMenu.RadioItem>
  )
);
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

export interface ContextMenuSubmenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.SubmenuTrigger> {
  icon?: string;
}

export const ContextMenuSubmenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuSubmenuTriggerProps>(
  ({ className, children, icon, ...props }, ref) => (
    <BaseContextMenu.SubmenuTrigger
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
    </BaseContextMenu.SubmenuTrigger>
  )
);
ContextMenuSubmenuTrigger.displayName = 'ContextMenuSubmenuTrigger';

export const ContextMenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.GroupLabel
    ref={ref}
    className={cn('px-3 py-1.5 font-label text-xs font-bold text-on-surface-variant select-none', className)}
    {...props}
  />
));
ContextMenuGroupLabel.displayName = 'ContextMenuGroupLabel';

export const ContextMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Group ref={ref} className={cn('py-1', className)} {...props} />
));
ContextMenuGroup.displayName = 'ContextMenuGroup';

export const ContextMenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioGroup ref={ref} className={cn('py-1', className)} {...props} />
));
ContextMenuRadioGroup.displayName = 'ContextMenuRadioGroup';

export const ContextMenuLinkItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.LinkItem>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.LinkItem
    ref={ref}
    className={cn(
      'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none text-on-surface hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
      className
    )}
    {...props}
  />
));
ContextMenuLinkItem.displayName = 'ContextMenuLinkItem';

export interface ContextMenuProps {
  children?: React.ReactNode;
  items?: ContextMenuItemData[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseContextMenu.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  disabled?: boolean;
  loopFocus?: boolean;
  actionsRef?: React.RefObject<BaseContextMenu.Root.Actions | null>;
  className?: string;
}

const ContextMenuComponent = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  (
    {
      children,
      items,
      open,
      defaultOpen,
      onOpenChange,
      onOpenChangeComplete,
      disabled = false,
      loopFocus = true,
      actionsRef,
      className,
      ...props
    },
    ref
  ) => {
    // If used as composable compound root (<ContextMenu><ContextMenuTrigger>...</ContextMenuTrigger><ContextMenuContent>...</ContextMenuContent></ContextMenu>)
    if (!items) {
      return (
        <BaseContextMenu.Root
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          disabled={disabled}
          loopFocus={loopFocus}
          actionsRef={actionsRef}
        >
          {children}
        </BaseContextMenu.Root>
      );
    }

    return (
      <BaseContextMenu.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        disabled={disabled}
        loopFocus={loopFocus}
        actionsRef={actionsRef}
      >
        <BaseContextMenu.Trigger ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </BaseContextMenu.Trigger>
        <BaseContextMenu.Portal>
          <BaseContextMenu.Positioner sideOffset={4} collisionPadding={8} className="z-50 outline-none">
            <BaseContextMenu.Popup className="min-w-[200px] p-1 rounded-lg bg-surface border border-outline-variant shadow-ambient outline-none transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none">
              {items.map((item) => (
                <ContextMenuItem
                  key={item.id}
                  onClick={item.onClick ?? item.action}
                  disabled={item.disabled}
                  destructive={item.destructive}
                  icon={item.icon}
                  shortcut={item.shortcut}
                >
                  {item.label}
                </ContextMenuItem>
              ))}
            </BaseContextMenu.Popup>
          </BaseContextMenu.Positioner>
        </BaseContextMenu.Portal>
      </BaseContextMenu.Root>
    );
  }
);

ContextMenuComponent.displayName = 'ContextMenu';

// Compound export mapping Base UI primitives
export const ContextMenu = Object.assign(ContextMenuComponent, {
  Root: BaseContextMenu.Root,
  Trigger: ContextMenuTrigger,
  Portal: BaseContextMenu.Portal,
  Positioner: BaseContextMenu.Positioner,
  Popup: BaseContextMenu.Popup,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  Separator: ContextMenuSeparator,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  CheckboxItem: ContextMenuCheckboxItem,
  CheckboxItemIndicator: BaseContextMenu.CheckboxItemIndicator,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  RadioItemIndicator: BaseContextMenu.RadioItemIndicator,
  SubmenuRoot: BaseContextMenu.SubmenuRoot,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  Backdrop: BaseContextMenu.Backdrop,
  Arrow: BaseContextMenu.Arrow,
});

// Re-export Base UI primitives for compound composition
export { BaseContextMenu };
export const ContextMenuRoot = BaseContextMenu.Root;
export const ContextMenuTriggerPrimitive = BaseContextMenu.Trigger;
export const ContextMenuPositioner = BaseContextMenu.Positioner;
export const ContextMenuPopup = BaseContextMenu.Popup;
export const ContextMenuItemPrimitive = BaseContextMenu.Item;
export const ContextMenuPortal = BaseContextMenu.Portal;
export const ContextMenuBackdrop = BaseContextMenu.Backdrop;
export const ContextMenuArrow = BaseContextMenu.Arrow;
export const ContextMenuGroupPrimitive = BaseContextMenu.Group;
export const ContextMenuGroupLabelPrimitive = BaseContextMenu.GroupLabel;
export const ContextMenuCheckboxItemIndicator = BaseContextMenu.CheckboxItemIndicator;
export const ContextMenuRadioItemIndicator = BaseContextMenu.RadioItemIndicator;
export const ContextMenuSubmenuRoot = BaseContextMenu.SubmenuRoot;
export const ContextMenuLinkItemPrimitive = BaseContextMenu.LinkItem;

export default ContextMenu;
