import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { cn } from '@/lib/utils';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  action?: () => void;
}

export interface ContextMenuProps {
  children: React.ReactNode;
  items: ContextMenuItem[];
}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({ children, items }) => {
  return (
    <BaseContextMenu.Root>
      <BaseContextMenu.Trigger className="w-full">
        {children}
      </BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner sideOffset={4}>
          <BaseContextMenu.Popup className="min-w-[200px] p-1.5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating z-50 space-y-1 transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]">
            {items.map((item) => (
              <BaseContextMenu.Item
                key={item.id}
                onClick={item.action}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-[0.375rem] font-sans text-xs font-medium cursor-pointer transition-colors select-none outline-none',
                  item.destructive
                    ? 'text-error hover:bg-error/10 data-[highlighted]:bg-error/10'
                    : 'text-on-surface hover:bg-primary/10 hover:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary'
                )}
              >
                {item.icon && (
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </BaseContextMenu.Item>
            ))}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
};

// Compound export mapping Base UI primitives
export const ContextMenu = Object.assign(ContextMenuComponent, {
  Root: BaseContextMenu.Root,
  Trigger: BaseContextMenu.Trigger,
  Portal: BaseContextMenu.Portal,
  Positioner: BaseContextMenu.Positioner,
  Popup: BaseContextMenu.Popup,
  Item: BaseContextMenu.Item,
  Backdrop: BaseContextMenu.Backdrop,
  Arrow: BaseContextMenu.Arrow,
  Group: BaseContextMenu.Group,
  GroupLabel: BaseContextMenu.GroupLabel,
  Separator: BaseContextMenu.Separator,
  CheckboxItem: BaseContextMenu.CheckboxItem,
  CheckboxItemIndicator: BaseContextMenu.CheckboxItemIndicator,
  RadioGroup: BaseContextMenu.RadioGroup,
  RadioItem: BaseContextMenu.RadioItem,
  RadioItemIndicator: BaseContextMenu.RadioItemIndicator,
  SubmenuRoot: BaseContextMenu.SubmenuRoot,
  SubmenuTrigger: BaseContextMenu.SubmenuTrigger,
  LinkItem: BaseContextMenu.LinkItem,
});

// Re-export Base UI primitives for compound composition
export { BaseContextMenu };
export const ContextMenuRoot = BaseContextMenu.Root;
export const ContextMenuTrigger = BaseContextMenu.Trigger;
export const ContextMenuPositioner = BaseContextMenu.Positioner;
export const ContextMenuPopup = BaseContextMenu.Popup;
export const ContextMenuItemPrimitive = BaseContextMenu.Item;
export const ContextMenuPortal = BaseContextMenu.Portal;
export const ContextMenuBackdrop = BaseContextMenu.Backdrop;
export const ContextMenuArrow = BaseContextMenu.Arrow;
export const ContextMenuGroup = BaseContextMenu.Group;
export const ContextMenuGroupLabel = BaseContextMenu.GroupLabel;
export const ContextMenuSeparator = BaseContextMenu.Separator;
export const ContextMenuCheckboxItem = BaseContextMenu.CheckboxItem;
export const ContextMenuCheckboxItemIndicator = BaseContextMenu.CheckboxItemIndicator;
export const ContextMenuRadioGroup = BaseContextMenu.RadioGroup;
export const ContextMenuRadioItem = BaseContextMenu.RadioItem;
export const ContextMenuRadioItemIndicator = BaseContextMenu.RadioItemIndicator;
export const ContextMenuSubmenuRoot = BaseContextMenu.SubmenuRoot;
export const ContextMenuSubmenuTrigger = BaseContextMenu.SubmenuTrigger;
export const ContextMenuLinkItem = BaseContextMenu.LinkItem;


