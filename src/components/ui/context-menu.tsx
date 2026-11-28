'use client';

import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';
import { cn, composeClassName, sanitizeUrl } from '@/lib/utils';

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
      data-slot="context-menu-item"
      className={composeClassName(
        cn(
          'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none',
          destructive
            ? 'text-error hover:bg-error/10 focus:bg-error/10 data-[highlighted]:bg-error/10 data-[highlighted]:text-error'
            : 'text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
        ),
        className
      )}
      {...props}
    >
      {icon && <Icon name={icon} size="md" className="shrink-0" aria-hidden="true" />}
      <span className="truncate flex-1">{children}</span>
      {shortcut && (
        <span data-slot="context-menu-shortcut" className="font-mono text-xs text-on-surface-variant font-medium tracking-wider ms-auto">
          {shortcut}
        </span>
      )}
    </BaseContextMenu.Item>
  )
);
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="context-menu-shortcut"
    className={cn('font-mono text-xs text-on-surface-variant font-medium tracking-wider ms-auto', className)}
    {...props}
  />
));
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export interface ContextMenuArrowProps
  extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.Arrow> {}

export const ContextMenuArrow = React.forwardRef<HTMLDivElement, ContextMenuArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BaseContextMenu.Arrow
      ref={ref}
      data-slot="context-menu-arrow"
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
    </BaseContextMenu.Arrow>
  )
);
ContextMenuArrow.displayName = 'ContextMenuArrow';

const basePositionerClasses =
  'z-50 max-w-[min(var(--available-width),calc(100vw-1rem))] outline-none';

const basePopupClasses =
  'relative flex flex-col min-w-[200px] max-w-[min(var(--available-width),calc(100vw-1rem))] max-h-[min(24rem,var(--available-height))] rounded bg-surface border border-outline-variant shadow-ambient outline-none transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none';

export const ContextMenuPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Positioner>
>(({ className, collisionPadding = 8, ...props }, ref) => (
  <BaseContextMenu.Positioner
    ref={ref}
    data-slot="context-menu-positioner"
    collisionPadding={collisionPadding}
    className={composeClassName(basePositionerClasses, className)}
    {...props}
  />
));
ContextMenuPositioner.displayName = 'ContextMenuPositioner';

export const ContextMenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Popup
    ref={ref}
    data-slot="context-menu-content"
    className={composeClassName(basePopupClasses, className)}
    {...props}
  />
));
ContextMenuPopup.displayName = 'ContextMenuPopup';

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup> {
  side?: BaseContextMenu.Positioner.Props['side'];
  align?: BaseContextMenu.Positioner.Props['align'];
  sideOffset?: BaseContextMenu.Positioner.Props['sideOffset'];
  alignOffset?: BaseContextMenu.Positioner.Props['alignOffset'];
  anchor?: BaseContextMenu.Positioner.Props['anchor'];
  arrowPadding?: BaseContextMenu.Positioner.Props['arrowPadding'];
  sticky?: BaseContextMenu.Positioner.Props['sticky'];
  collisionPadding?: BaseContextMenu.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseContextMenu.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseContextMenu.Positioner.Props['collisionAvoidance'];
  disableAnchorTracking?: BaseContextMenu.Positioner.Props['disableAnchorTracking'];
  containerClassName?: BaseContextMenu.Positioner.Props['className'];
  container?: BaseContextMenu.Portal.Props['container'];
  keepMounted?: boolean;
  showArrow?: boolean;
  scrollable?: boolean;
}

export const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  (
    {
      className,
      children,
      side,
      align,
      sideOffset,
      alignOffset,
      anchor,
      arrowPadding,
      sticky,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      disableAnchorTracking,
      containerClassName,
      container,
      keepMounted,
      showArrow = false,
      scrollable = true,
      ...props
    },
    ref
  ) => {
    const childList = React.Children.toArray(children);
    const arrowChildren: React.ReactNode[] = [];
    const bodyChildren: React.ReactNode[] = [];

    for (const child of childList) {
      if (React.isValidElement(child) && (child.type === ContextMenuArrow || child.type === BaseContextMenu.Arrow)) {
        arrowChildren.push(child);
      } else {
        bodyChildren.push(child);
      }
    }

    return (
      <BaseContextMenu.Portal container={container} keepMounted={keepMounted}>
        <ContextMenuPositioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          anchor={anchor}
          arrowPadding={arrowPadding}
          sticky={sticky}
          collisionPadding={collisionPadding}
          collisionBoundary={collisionBoundary}
          collisionAvoidance={collisionAvoidance}
          disableAnchorTracking={disableAnchorTracking}
          className={containerClassName}
        >
          <ContextMenuPopup ref={ref} className={className} {...props}>
            {arrowChildren.length > 0 ? arrowChildren : showArrow ? <ContextMenuArrow /> : null}
            {scrollable ? (
              <ScrollArea
                className="min-h-0 flex-[0_1_auto]"
                viewportClassName="overscroll-contain scroll-py-1"
                viewportProps={{
                  tabIndex: -1,
                  onMouseDown: (e) => {
                    const target = e.target as HTMLElement | null;
                    if (target?.closest('input, textarea, [contenteditable]')) return;
                    e.preventDefault();
                  },
                }}
                contentClassName="p-1"
              >
                {bodyChildren}
              </ScrollArea>
            ) : (
              bodyChildren
            )}
          </ContextMenuPopup>
        </ContextMenuPositioner>
      </BaseContextMenu.Portal>
    );
  }
);
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Separator
    ref={ref}
    data-slot="context-menu-separator"
    className={composeClassName('h-px my-1 bg-outline-variant/60 -mx-1', className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Trigger ref={ref} data-slot="context-menu-trigger" className={className} {...props} />
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
      data-slot="context-menu-checkbox-item"
      className={composeClassName(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && <Icon name={icon} size="md" className="shrink-0" aria-hidden="true" />}
        <span className="truncate">{children}</span>
      </div>
      <BaseContextMenu.CheckboxItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <Icon name="check" size="sm" aria-hidden="true" />
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
      data-slot="context-menu-radio-item"
      className={composeClassName(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && <Icon name={icon} size="md" className="shrink-0" aria-hidden="true" />}
        <span className="truncate">{children}</span>
      </div>
      <BaseContextMenu.RadioItemIndicator className="shrink-0 text-primary flex items-center justify-center">
        <Icon name="radio_button_checked" size="sm" aria-hidden="true" />
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
      data-slot="context-menu-sub-trigger"
      className={composeClassName(
        'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[popup-open]:bg-state-hover data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 min-w-0 items-center gap-2.5 truncate">
        {icon && <Icon name={icon} size="md" className="shrink-0" aria-hidden="true" />}
        <span className="truncate">{children}</span>
      </div>
      <Icon name="chevron_right" size="sm" directional className="text-on-surface-variant shrink-0" aria-hidden="true" />
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
    data-slot="context-menu-label"
    className={composeClassName('px-3 py-1.5 font-label text-xs font-semibold text-on-surface-variant select-none', className)}
    {...props}
  />
));
ContextMenuGroupLabel.displayName = 'ContextMenuGroupLabel';

export const ContextMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Group ref={ref} data-slot="context-menu-group" className={composeClassName('py-1', className)} {...props} />
));
ContextMenuGroup.displayName = 'ContextMenuGroup';

export const ContextMenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioGroup ref={ref} data-slot="context-menu-radio-group" className={composeClassName('py-1', className)} {...props} />
));
ContextMenuRadioGroup.displayName = 'ContextMenuRadioGroup';

export const ContextMenuLinkItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.LinkItem>
>(({ className, href, ...props }, ref) => (
  <BaseContextMenu.LinkItem
    ref={ref}
    data-slot="context-menu-link-item"
    href={href === undefined ? undefined : sanitizeUrl(href)}
    className={composeClassName(
      'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
      className
    )}
    {...props}
  />
));
ContextMenuLinkItem.displayName = 'ContextMenuLinkItem';

export interface ContextMenuProps
  extends React.ComponentPropsWithoutRef<typeof BaseContextMenu.Root> {
  items?: ContextMenuItemData[];
  container?: BaseContextMenu.Portal.Props['container'];
  side?: BaseContextMenu.Positioner.Props['side'];
  align?: BaseContextMenu.Positioner.Props['align'];
  sideOffset?: BaseContextMenu.Positioner.Props['sideOffset'];
  alignOffset?: BaseContextMenu.Positioner.Props['alignOffset'];
  collisionPadding?: BaseContextMenu.Positioner.Props['collisionPadding'];
  keepMounted?: boolean;
  finalFocus?: BaseContextMenu.Popup.Props['finalFocus'];
  showArrow?: boolean;
  popupClassName?: BaseContextMenu.Popup.Props['className'];
  className?: BaseContextMenu.Trigger.Props['className'];
}

const ContextMenuComponent = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  (
    {
      children,
      items,
      container,
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding = 8,
      keepMounted,
      finalFocus,
      showArrow = false,
      popupClassName,
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
          {...props}
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
        {...props}
      >
        <BaseContextMenu.Trigger ref={ref} data-slot="context-menu-trigger" className={composeClassName('w-full', className)}>
          {children}
        </BaseContextMenu.Trigger>
        <BaseContextMenu.Portal container={container} keepMounted={keepMounted}>
          <ContextMenuPositioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
          >
            <ContextMenuPopup finalFocus={finalFocus} className={popupClassName}>
              {showArrow && <ContextMenuArrow />}
              <ScrollArea
                className="min-h-0 flex-[0_1_auto]"
                viewportClassName="overscroll-contain scroll-py-1"
                viewportProps={{
                  tabIndex: -1,
                  onMouseDown: (e) => {
                    const target = e.target as HTMLElement | null;
                    if (target?.closest('input, textarea, [contenteditable]')) return;
                    e.preventDefault();
                  },
                }}
                contentClassName="p-1"
              >
                <ContextMenuGroup>
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
                </ContextMenuGroup>
              </ScrollArea>
            </ContextMenuPopup>
          </ContextMenuPositioner>
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
  Positioner: ContextMenuPositioner,
  Popup: ContextMenuPopup,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
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
  Arrow: ContextMenuArrow,
});

// Re-export Base UI primitives for compound composition
export { BaseContextMenu };
export const ContextMenuRoot = BaseContextMenu.Root;
export const ContextMenuTriggerPrimitive = BaseContextMenu.Trigger;
export const ContextMenuPositionerPrimitive = BaseContextMenu.Positioner;
export const ContextMenuPopupPrimitive = BaseContextMenu.Popup;
export const ContextMenuItemPrimitive = BaseContextMenu.Item;
export const ContextMenuPortal = BaseContextMenu.Portal;
export const ContextMenuBackdrop = BaseContextMenu.Backdrop;
export const ContextMenuArrowPrimitive = BaseContextMenu.Arrow;
export const ContextMenuGroupPrimitive = BaseContextMenu.Group;
export const ContextMenuGroupLabelPrimitive = BaseContextMenu.GroupLabel;
export const ContextMenuCheckboxItemIndicator = BaseContextMenu.CheckboxItemIndicator;
export const ContextMenuRadioItemIndicator = BaseContextMenu.RadioItemIndicator;
export const ContextMenuSubmenuRoot = BaseContextMenu.SubmenuRoot;
export const ContextMenuLinkItemPrimitive = BaseContextMenu.LinkItem;

export default ContextMenu;
