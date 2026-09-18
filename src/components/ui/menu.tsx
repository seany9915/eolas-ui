import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/utils';

/**
 * Menu Component (Single-Button Action Dropdown)
 *
 * WAI-ARIA Role: role="menu" / role="menuitem"
 * Primary Purpose: Command execution triggered from a single button (e.g., "..." overflow actions, export menus).
 *
 * TAXONOMY & USAGE GUIDELINES:
 * - USE THIS: For standalone dropdown action buttons or overflow menus triggering immediate callbacks (onClick).
 * - DO NOT USE:
 *   - For desktop multi-menu command bars (File, Edit, View) -> Use <Menubar>.
 *   - For global site or application URL routing links -> Use <NavigationMenu>.
 *   - For secondary pointer/right-click actions -> Use <ContextMenu>.
 *   - For switching content views/panels on the same page -> Use <Tabs>.
 */

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface MenuProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  triggerLabel?: string;
  trigger?: React.ReactElement;
  items?: MenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const MenuComponent = React.forwardRef<HTMLDivElement, MenuProps>(({
  label,
  description,
  triggerLabel = 'Menu',
  trigger,
  items,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  className,
  fullWidth = true,
  children,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const menuId = `menu-${generatedId}`;

  return (
    <div ref={ref} className="flex flex-col gap-1.5 w-full" {...props}>
      {label && (
        <label htmlFor={menuId} className="font-label text-sm font-semibold text-on-surface cursor-pointer">
          {label}
        </label>
      )}
      {description && (
        <span className="font-sans text-sm text-on-surface-variant">
          {description}
        </span>
      )}
      <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
        {trigger ? (
          <BaseMenu.Trigger id={menuId} render={trigger} />
        ) : (
          <BaseMenu.Trigger
            id={menuId}
            className={cn(
              'inline-flex items-center justify-between gap-2 h-12 px-4 min-h-[48px] rounded border-[1px] border-outline bg-surface text-on-surface font-label text-sm font-semibold hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer',
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
          <BaseMenu.Positioner sideOffset={6}>
            <BaseMenu.Popup
              className="z-50 min-w-[220px] p-1.5 rounded bg-surface border-[1px] border-outline-variant shadow-floating transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]"
            >
              {children
                ? children
                : items?.map((item) => (
                    <BaseMenu.Item
                      key={item.id}
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors select-none',
                        item.destructive
                          ? 'text-error hover:bg-error-container/30 focus:bg-error-container/30 data-[highlighted]:bg-error-container/30'
                          : 'text-on-surface hover:bg-surface-container hover:text-on-surface focus:bg-surface-container focus:text-on-surface data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </BaseMenu.Item>
                  ))}
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    </div>
  );
});

MenuComponent.displayName = 'Menu';

// Compound export mapping Base UI primitives
export const Menu = Object.assign(MenuComponent, {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Portal: BaseMenu.Portal,
  Positioner: BaseMenu.Positioner,
  Popup: BaseMenu.Popup,
  Item: BaseMenu.Item,
  LinkItem: BaseMenu.LinkItem,
  Separator: BaseMenu.Separator,
  Group: BaseMenu.Group,
  GroupLabel: BaseMenu.GroupLabel,
  SubmenuRoot: BaseMenu.SubmenuRoot,
  SubmenuTrigger: BaseMenu.SubmenuTrigger,
  CheckboxItem: BaseMenu.CheckboxItem,
  CheckboxItemIndicator: BaseMenu.CheckboxItemIndicator,
  RadioGroup: BaseMenu.RadioGroup,
  RadioItem: BaseMenu.RadioItem,
  RadioItemIndicator: BaseMenu.RadioItemIndicator,
  Arrow: BaseMenu.Arrow,
  Backdrop: BaseMenu.Backdrop,
  Viewport: BaseMenu.Viewport,
  createHandle: BaseMenu.createHandle,
  Handle: BaseMenu.Handle,
});

// Re-export Base UI primitives for compound composition
export { BaseMenu };
export const MenuRoot = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;
export const MenuPortal = BaseMenu.Portal;
export const MenuPositioner = BaseMenu.Positioner;
export const MenuPopup = BaseMenu.Popup;
export const MenuItemPrimitive = BaseMenu.Item;
export const MenuLinkItem = BaseMenu.LinkItem;
export const MenuSeparator = BaseMenu.Separator;
export const MenuGroup = BaseMenu.Group;
export const MenuGroupLabel = BaseMenu.GroupLabel;
export const MenuSubmenuRoot = BaseMenu.SubmenuRoot;
export const MenuSubmenuTrigger = BaseMenu.SubmenuTrigger;
export const MenuCheckboxItem = BaseMenu.CheckboxItem;
export const MenuCheckboxItemIndicator = BaseMenu.CheckboxItemIndicator;
export const MenuRadioGroup = BaseMenu.RadioGroup;
export const MenuRadioItem = BaseMenu.RadioItem;
export const MenuRadioItemIndicator = BaseMenu.RadioItemIndicator;
export const MenuArrow = BaseMenu.Arrow;
export const MenuBackdrop = BaseMenu.Backdrop;
export const MenuViewport = BaseMenu.Viewport;
export const createMenuHandle = BaseMenu.createHandle;
export const MenuHandle = BaseMenu.Handle;

