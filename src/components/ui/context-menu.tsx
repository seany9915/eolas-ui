import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { cn } from '@/lib/utils';

/**
 * ContextMenu Component (Secondary Pointer-Anchored Actions)
 *
 * WAI-ARIA Role: role="menu"
 * Primary Purpose: Secondary action menu triggered by right-click, long-press, or Shift+F10 on a target surface.
 *
 * TAXONOMY & USAGE GUIDELINES:
 * - USE THIS: For power-user shortcuts anchored directly to an item or canvas node.
 * - DO NOT USE:
 *   - As the ONLY way to perform an action. Touch/mobile users cannot right-click reliably; ALWAYS provide a visible primary action button or <Menu>.
 *   - For persistent desktop menus -> Use <Menubar>.
 *   - For primary action dropdowns -> Use <Menu>.
 */

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
  className?: string;
}

const ContextMenuComponent = React.forwardRef<HTMLDivElement, ContextMenuProps>(({
  children,
  items,
  className,
  ...props
}, ref) => {
  return (
    <BaseContextMenu.Root>
      <BaseContextMenu.Trigger ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner sideOffset={4}>
          <BaseContextMenu.Popup className="min-w-[200px] p-1.5 rounded bg-surface border-[1px] border-outline-variant shadow-floating z-50 space-y-1 transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]">
            {items.map((item) => (
              <BaseContextMenu.Item
                key={item.id}
                onClick={item.action}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-sm font-sans text-sm font-medium cursor-pointer transition-colors select-none outline-none',
                  item.destructive
                    ? 'text-error hover:bg-error-container/30 focus:bg-error-container/30 data-[highlighted]:bg-error-container/30'
                    : 'text-on-surface hover:bg-surface-container hover:text-on-surface focus:bg-surface-container focus:text-on-surface data-[highlighted]:bg-surface-container data-[highlighted]:text-on-surface'
                )}
              >
                {item.icon && (
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">
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
});

ContextMenuComponent.displayName = 'ContextMenu';

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


