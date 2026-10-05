import * as React from 'react';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/utils';

export interface MenubarMenuItem {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  shortcut?: string;
  onClick?: () => void;
}

export interface MenubarMenuData {
  triggerLabel: string;
  items: MenubarMenuItem[];
}

export interface MenubarProps extends React.ComponentPropsWithoutRef<typeof BaseMenubar> {
  menus?: MenubarMenuData[];
}

export const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-md font-label text-sm font-semibold transition-colors cursor-pointer select-none outline-none',
      'text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
      'data-[popup-open]:bg-surface-container data-[popup-open]:text-primary',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  >
    {children}
  </BaseMenu.Trigger>
));
MenubarTrigger.displayName = 'MenubarTrigger';

export interface MenubarContentProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> {
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  containerClassName?: string;
}

export const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  (
    {
      className,
      children,
      sideOffset = 4,
      align = 'start',
      alignOffset,
      collisionPadding = 8,
      containerClassName,
      ...props
    },
    ref
  ) => (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn('z-50 outline-none', containerClassName)}
      >
        <BaseMenu.Popup
          ref={ref}
          className={cn(
            'min-w-[220px] p-1 rounded-lg bg-surface border border-outline-variant shadow-modal outline-none',
            'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-tiny)] ease-[var(--ease-standard)]',
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
MenubarContent.displayName = 'MenubarContent';

export interface MenubarItemProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Item> {
  destructive?: boolean;
  icon?: string;
  shortcut?: string;
}

export const MenubarItem = React.forwardRef<HTMLDivElement, MenubarItemProps>(
  ({ className, destructive, icon, shortcut, children, ...props }, ref) => (
    <BaseMenu.Item
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-3 px-3 py-2 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none',
        'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
        destructive
          ? 'text-error hover:bg-error/10 focus:bg-error/10 data-[highlighted]:bg-error/10 data-[highlighted]:text-error'
          : 'text-on-surface hover:bg-surface-container focus:bg-surface-container data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
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
      {shortcut && (
        <span className="font-mono text-xs text-on-surface-variant font-medium tracking-wider ml-auto">
          {shortcut}
        </span>
      )}
    </BaseMenu.Item>
  )
);
MenubarItem.displayName = 'MenubarItem';

export interface MenubarCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem> {
  icon?: string;
}

export const MenubarCheckboxItem = React.forwardRef<HTMLDivElement, MenubarCheckboxItemProps>(
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
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export interface MenubarRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem> {
  icon?: string;
}

export const MenubarRadioItem = React.forwardRef<HTMLDivElement, MenubarRadioItemProps>(
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
MenubarRadioItem.displayName = 'MenubarRadioItem';

export interface MenubarSubmenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> {
  icon?: string;
}

export const MenubarSubmenuTrigger = React.forwardRef<HTMLDivElement, MenubarSubmenuTriggerProps>(
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
MenubarSubmenuTrigger.displayName = 'MenubarSubmenuTrigger';

export const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarGroup = BaseMenu.Group;
export const MenubarGroupLabel = BaseMenu.GroupLabel;
export const MenubarRadioGroup = BaseMenu.RadioGroup;
export const MenubarSubmenu = BaseMenu.SubmenuRoot;

export interface MenubarMenuProps {
  triggerLabel: string;
  items?: MenubarMenuItem[];
  children?: React.ReactNode;
}

export const MenubarMenu = React.forwardRef<HTMLButtonElement, MenubarMenuProps>(
  ({ triggerLabel, items, children }, ref) => (
    <BaseMenu.Root>
      <MenubarTrigger ref={ref}>
        <span>{triggerLabel}</span>
      </MenubarTrigger>
      <MenubarContent>
        {children
          ? children
          : items?.map((item) => (
              <MenubarItem
                key={item.id}
                disabled={item.disabled}
                destructive={item.destructive}
                icon={item.icon}
                shortcut={item.shortcut}
                onClick={item.onClick}
              >
                {item.label}
              </MenubarItem>
            ))}
      </MenubarContent>
    </BaseMenu.Root>
  )
);
MenubarMenu.displayName = 'MenubarMenu';

export const MenubarShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <span
    className={cn('font-mono text-xs text-on-surface-variant font-medium tracking-wider ml-auto', className)}
    {...props}
  />
);
MenubarShortcut.displayName = 'MenubarShortcut';

const MenubarComponent = React.forwardRef<HTMLDivElement, MenubarProps>(
  (
    {
      menus,
      loopFocus = true,
      orientation = 'horizontal',
      modal = true,
      children,
      className,
      ...props
    },
    ref
  ) => (
    <BaseMenubar
      ref={ref}
      loopFocus={loopFocus}
      orientation={orientation}
      modal={modal}
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-lg bg-surface border border-outline-variant w-full shadow-ambient',
        className
      )}
      {...props}
    >
      {children
        ? children
        : menus?.map((menu, i) => (
            <MenubarMenu key={i} triggerLabel={menu.triggerLabel} items={menu.items} />
          ))}
    </BaseMenubar>
  )
);

MenubarComponent.displayName = 'Menubar';

export const Menubar = Object.assign(MenubarComponent, {
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Item: MenubarItem,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Submenu: MenubarSubmenu,
  SubmenuTrigger: MenubarSubmenuTrigger,
  Separator: MenubarSeparator,
  Group: MenubarGroup,
  GroupLabel: MenubarGroupLabel,
  Shortcut: MenubarShortcut,
});

export { BaseMenubar };
export default Menubar;
