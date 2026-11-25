'use client';

import * as React from 'react';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';

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

export type MenubarVariant = 'default' | 'flush';

export interface MenubarProps extends React.ComponentPropsWithoutRef<typeof BaseMenubar> {
  menus?: MenubarMenuData[];
  variant?: MenubarVariant;
}

export const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger>
>(({ className, children, render, nativeButton, ...props }, ref) => (
  <BaseMenu.Trigger
    ref={ref}
    data-slot="menubar-trigger"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    className={
      render
        ? className
        : composeClassName(
            'relative inline-flex shrink-0 whitespace-nowrap items-center justify-center gap-1.5 px-3 py-1.5 min-h-[36px] min-w-[44px] rounded font-label text-sm font-semibold transition-colors motion-reduce:transition-none cursor-pointer select-none outline-none after:absolute after:-inset-y-1 after:inset-x-0 after:content-[\'\'] text-on-surface-variant hover:text-on-surface hover:bg-state-hover data-[popup-open]:bg-state-hover data-[popup-open]:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  >
    {children}
  </BaseMenu.Trigger>
));
MenubarTrigger.displayName = 'MenubarTrigger';

export interface MenubarContentProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> {
  side?: BaseMenu.Positioner.Props['side'];
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  containerClassName?: BaseMenu.Positioner.Props['className'];
  container?: BaseMenu.Portal.Props['container'];
  keepMounted?: boolean;
}

export const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  (
    {
      className,
      children,
      side = 'bottom',
      sideOffset = 4,
      align = 'start',
      alignOffset,
      collisionPadding = 8,
      containerClassName,
      container,
      keepMounted,
      ...props
    },
    ref
  ) => (
    <BaseMenu.Portal container={container} keepMounted={keepMounted}>
      <BaseMenu.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={composeClassName('z-50 max-w-[min(var(--available-width),calc(100vw-1rem))] outline-none', containerClassName)}
      >
        <BaseMenu.Popup
          ref={ref}
          data-slot="menubar-content"
          className={composeClassName(
            'flex flex-col min-w-[220px] max-w-[min(var(--available-width),calc(100vw-1rem))] max-h-[min(24rem,var(--available-height))] rounded bg-surface border border-outline-variant shadow-ambient outline-none transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-tiny)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
            className
          )}
          {...props}
        >
          <ScrollArea
            className="min-h-0 flex-[0_1_auto]"
            viewportClassName="overscroll-contain scroll-py-1"
            viewportProps={{
              tabIndex: -1,
              onMouseDown: (e) => e.preventDefault(),
            }}
            contentClassName="p-1"
          >
            {children}
          </ScrollArea>
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
      data-slot="menubar-item"
      className={composeClassName(
        cn(
          'flex items-center justify-between gap-3 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none',
          'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
          destructive
            ? 'text-error hover:bg-error/10 focus:bg-error/10 data-[highlighted]:bg-error/10 data-[highlighted]:text-error'
            : 'text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface'
        ),
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && (
          <Icon name={icon} size="sm" className="shrink-0" />
        )}
        <span className="truncate">{children}</span>
      </div>
      {shortcut && (
        <span data-slot="menubar-shortcut" className="font-mono text-xs text-on-surface-variant font-medium tracking-wider ms-auto">
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
      data-slot="menubar-checkbox-item"
      className={composeClassName(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && (
          <Icon name={icon} size="sm" className="shrink-0" />
        )}
        <span className="truncate">{children}</span>
      </div>
      <BaseMenu.CheckboxItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <Icon name="check" size="xs" className="font-bold" />
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
      data-slot="menubar-radio-item"
      className={composeClassName(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && (
          <Icon name={icon} size="sm" className="shrink-0" />
        )}
        <span className="truncate">{children}</span>
      </div>
      <BaseMenu.RadioItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <Icon name="radio_button_checked" size="xs" className="font-bold" />
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
      data-slot="menubar-sub-trigger"
      className={composeClassName(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[popup-open]:bg-surface-container-low data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && (
          <Icon name={icon} size="sm" className="shrink-0" />
        )}
        <span className="truncate">{children}</span>
      </div>
      <Icon name="chevron_right" size="xs" directional className="text-on-surface-variant shrink-0" />
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
    data-slot="menubar-separator"
    className={composeClassName('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarLinkItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>
>(({ className, ...props }, ref) => (
  <BaseMenu.LinkItem
    ref={ref}
    data-slot="menubar-link-item"
    className={composeClassName(
      'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
      className
    )}
    {...props}
  />
));
MenubarLinkItem.displayName = 'MenubarLinkItem';

export const MenubarArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Arrow>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.Arrow
    ref={ref}
    data-slot="menubar-arrow"
    className={composeClassName(
      cn(
        'z-10 data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-7.5px] data-[side=right]:left-[-7.5px] data-[side=inline-start]:end-[-7.5px] data-[side=inline-end]:start-[-7.5px]',
        'data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90'
      ),
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
  </BaseMenu.Arrow>
));
MenubarArrow.displayName = 'MenubarArrow';

export const MenubarViewport = BaseMenu.Viewport;

export const MenubarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Group>
>((props, ref) => <BaseMenu.Group ref={ref} data-slot="menubar-group" {...props} />);
MenubarGroup.displayName = 'MenubarGroup';

export const MenubarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseMenu.GroupLabel
    ref={ref}
    data-slot="menubar-label"
    className={composeClassName('px-3 py-1.5 font-label text-xs font-semibold text-on-surface-variant select-none', className)}
    {...props}
  />
));
MenubarGroupLabel.displayName = 'MenubarGroupLabel';

export const MenubarRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.RadioGroup>
>((props, ref) => <BaseMenu.RadioGroup ref={ref} data-slot="menubar-radio-group" {...props} />);
MenubarRadioGroup.displayName = 'MenubarRadioGroup';

export const MenubarSubmenu = BaseMenu.SubmenuRoot;

export interface MenubarMenuProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Root> {
  triggerLabel?: string;
  items?: MenubarMenuItem[];
  children?: React.ReactNode;
}

export const MenubarMenu = React.forwardRef<HTMLButtonElement, MenubarMenuProps>(
  ({ triggerLabel, items, children, ...menuRootProps }, ref) => {
    if (triggerLabel) {
      return (
        <BaseMenu.Root {...menuRootProps}>
          <MenubarTrigger ref={ref}>
            <span>{triggerLabel}</span>
          </MenubarTrigger>
          <MenubarContent>
            {children ? (
              children
            ) : items ? (
              <MenubarGroup>
                {items.map((item) => (
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
              </MenubarGroup>
            ) : null}
          </MenubarContent>
        </BaseMenu.Root>
      );
    }

    return <BaseMenu.Root {...menuRootProps}>{children}</BaseMenu.Root>;
  }
);
MenubarMenu.displayName = 'MenubarMenu';

export const MenubarShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="menubar-shortcut"
    className={cn('font-mono text-xs text-on-surface-variant font-medium tracking-wider ms-auto', className)}
    {...props}
  />
));
MenubarShortcut.displayName = 'MenubarShortcut';

const MenubarComponent = React.forwardRef<HTMLDivElement, MenubarProps>(
  (
    {
      menus,
      variant = 'default',
      loopFocus = true,
      orientation = 'horizontal',
      modal = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses =
      variant === 'flush'
        ? 'rounded-none border-0 border-b border-outline-variant'
        : 'rounded border border-outline-variant';

    return (
      <BaseMenubar
        ref={ref}
        data-slot="menubar"
        loopFocus={loopFocus}
        orientation={orientation}
        modal={modal}
        className={composeClassName(
          cn(
            'flex items-center gap-1 p-1 bg-surface w-full max-w-full overflow-x-auto scrollbar-none data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
            variantClasses
          ),
          className
        )}
        {...props}
      >
        {children
          ? children
          : menus?.map((menu, i) => (
              <MenubarMenu key={`${menu.triggerLabel}-${i}`} triggerLabel={menu.triggerLabel} items={menu.items} />
            ))}
      </BaseMenubar>
    );
  }
);

MenubarComponent.displayName = 'Menubar';

export const Menubar = Object.assign(MenubarComponent, {
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Item: MenubarItem,
  LinkItem: MenubarLinkItem,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Submenu: MenubarSubmenu,
  SubmenuTrigger: MenubarSubmenuTrigger,
  Separator: MenubarSeparator,
  Group: MenubarGroup,
  GroupLabel: MenubarGroupLabel,
  Arrow: MenubarArrow,
  Viewport: MenubarViewport,
  Shortcut: MenubarShortcut,
});

export { BaseMenubar };
export default Menubar;
