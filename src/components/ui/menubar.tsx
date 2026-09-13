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

export interface MenubarProps {
  menus?: MenubarMenuData[];
  loopFocus?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
  className?: string;
}

const MenubarComponent: React.FC<MenubarProps> = ({
  menus,
  loopFocus,
  orientation = 'horizontal',
  children,
  className,
}) => {
  return (
    <BaseMenubar
      loopFocus={loopFocus}
      orientation={orientation}
      className={cn(
        'inline-flex items-center gap-1 p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant w-full shadow-sm',
        className
      )}
    >
      {children
        ? children
        : menus?.map((menu, i) => (
            <MenubarMenu key={i} triggerLabel={menu.triggerLabel} items={menu.items} />
          ))}
    </BaseMenubar>
  );
};

export interface MenubarMenuProps {
  triggerLabel: string;
  items?: MenubarMenuItem[];
  children?: React.ReactNode;
}

export const MenubarMenu: React.FC<MenubarMenuProps> = ({ triggerLabel, items, children }) => {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        className={cn(
          'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-md font-label text-sm font-semibold transition-colors cursor-pointer select-none outline-none',
          'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/80',
          'data-[popup-open]:bg-surface-variant data-[popup-open]:text-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary'
        )}
      >
        <span>{triggerLabel}</span>
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner sideOffset={6} align="start">
          <BaseMenu.Popup
            className={cn(
              'z-50 min-w-[220px] p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating outline-none',
              'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
              'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
              'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-tiny)] ease-[var(--ease-standard)]'
            )}
          >
            {children
              ? children
              : items?.map((item) => (
                  <BaseMenu.Item
                    key={item.id}
                    disabled={item.disabled}
                    onClick={item.onClick}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2.5 min-h-[44px] rounded-md font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none',
                      'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
                      item.destructive
                        ? 'text-error hover:bg-error-container/30 focus:bg-error-container/30 data-[highlighted]:bg-error-container/30'
                        : 'text-on-surface hover:bg-surface-variant hover:text-primary focus:bg-surface-variant focus:text-primary data-[highlighted]:bg-surface-variant data-[highlighted]:text-primary'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon && (
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <span className="font-mono text-xs text-on-surface-variant/70 tracking-wider">
                        {item.shortcut}
                      </span>
                    )}
                  </BaseMenu.Item>
                ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
};

export const MenubarSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <BaseMenu.Separator className={cn('h-[1px] bg-outline-variant my-1 -mx-1', className)} />
);

// Compound export mapping Base UI primitives & wrappers
export const Menubar = Object.assign(MenubarComponent, {
  Root: BaseMenubar,
  Menu: MenubarMenu,
  Separator: MenubarSeparator,
});

export { BaseMenubar };
export const MenubarRoot = BaseMenubar;

