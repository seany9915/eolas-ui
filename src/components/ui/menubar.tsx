'use client';

import * as React from 'react';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn, composeClassName, resolveNativeButton, sanitizeUrl } from '@/lib/utils';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';

const MenubarPortalScopeContext = React.createContext<boolean>(false);

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

export interface MenubarPortalProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Portal> {}

export const MenubarPortal = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.Portal>,
  MenubarPortalProps
>(({ container, children, ...props }, ref) => (
  <MenubarPortalScopeContext.Provider value={Boolean(container)}>
    <BaseMenu.Portal ref={ref} container={container} {...props}>
      {children}
    </BaseMenu.Portal>
  </MenubarPortalScopeContext.Provider>
));
MenubarPortal.displayName = 'MenubarPortal';

export interface MenubarBackdropProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Backdrop> {}

export const MenubarBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.Backdrop>,
  MenubarBackdropProps
>(({ className, ...props }, ref) => {
  const isScoped = React.useContext(MenubarPortalScopeContext);

  return (
    <BaseMenu.Backdrop
      ref={ref}
      data-slot="menubar-backdrop"
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
MenubarBackdrop.displayName = 'MenubarBackdrop';

const basePositionerClasses =
  'z-50 max-w-[min(var(--available-width),calc(100vw-1rem))] outline-none transition-[top,left,right,bottom] duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[instant]:transition-none motion-reduce:transition-none';

const basePopupClasses =
  'relative flex flex-col min-w-[220px] max-w-[min(var(--available-width),calc(100vw-1rem))] max-h-[min(24rem,var(--available-height))] rounded bg-surface border border-outline-variant shadow-ambient outline-none transition-[opacity,transform,width,height] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-tiny)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none';

export interface MenubarPositionerProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner> {}

export const MenubarPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.Positioner>,
  MenubarPositionerProps
>(({ className, side = 'bottom', sideOffset = 4, align = 'start', collisionPadding = 8, ...props }, ref) => (
  <BaseMenu.Positioner
    ref={ref}
    data-slot="menubar-positioner"
    side={side}
    sideOffset={sideOffset}
    align={align}
    collisionPadding={collisionPadding}
    className={composeClassName(basePositionerClasses, className)}
    {...props}
  />
));
MenubarPositioner.displayName = 'MenubarPositioner';

export interface MenubarPopupProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> {}

export const MenubarPopup = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.Popup>,
  MenubarPopupProps
>(({ className, ...props }, ref) => (
  <BaseMenu.Popup
    ref={ref}
    data-slot="menubar-content"
    className={composeClassName(basePopupClasses, className)}
    {...props}
  />
));
MenubarPopup.displayName = 'MenubarPopup';

export interface MenubarViewportProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Viewport> {}

export const MenubarViewport = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.Viewport>,
  MenubarViewportProps
>(({ className, ...props }, ref) => (
  <BaseMenu.Viewport
    ref={ref}
    data-slot="menubar-viewport"
    className={composeClassName('relative size-full overflow-hidden rounded-[inherit]', className)}
    {...props}
  />
));
MenubarViewport.displayName = 'MenubarViewport';

export interface MenubarTriggerProps<Payload = unknown> extends BaseMenu.Trigger.Props<Payload> {}

export const MenubarTrigger = React.forwardRef(function MenubarTrigger<Payload = unknown>(
  { className, children, render, nativeButton, ...props }: MenubarTriggerProps<Payload>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
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
  );
}) as (<Payload = unknown>(
  props: MenubarTriggerProps<Payload> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element) & { displayName?: string };
MenubarTrigger.displayName = 'MenubarTrigger';

export interface MenubarArrowProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Arrow> {}

export const MenubarArrow = React.forwardRef<HTMLDivElement, MenubarArrowProps>(
  ({ className, children, ...props }, ref) => (
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
  )
);
MenubarArrow.displayName = 'MenubarArrow';

export interface MenubarContentProps extends React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> {
  side?: BaseMenu.Positioner.Props['side'];
  align?: BaseMenu.Positioner.Props['align'];
  sideOffset?: BaseMenu.Positioner.Props['sideOffset'];
  alignOffset?: BaseMenu.Positioner.Props['alignOffset'];
  anchor?: BaseMenu.Positioner.Props['anchor'];
  positionMethod?: BaseMenu.Positioner.Props['positionMethod'];
  sticky?: BaseMenu.Positioner.Props['sticky'];
  collisionPadding?: BaseMenu.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseMenu.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseMenu.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BaseMenu.Positioner.Props['arrowPadding'];
  disableAnchorTracking?: BaseMenu.Positioner.Props['disableAnchorTracking'];
  containerClassName?: BaseMenu.Positioner.Props['className'];
  container?: BaseMenu.Portal.Props['container'];
  keepMounted?: boolean;
  showArrow?: boolean;
  showBackdrop?: boolean;
  backdropClassName?: BaseMenu.Backdrop.Props['className'];
  scrollable?: boolean;
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
      anchor,
      positionMethod,
      sticky,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      arrowPadding,
      disableAnchorTracking,
      containerClassName,
      container,
      keepMounted,
      showArrow = false,
      showBackdrop = false,
      backdropClassName,
      scrollable = true,
      ...props
    },
    ref
  ) => {
    const childList = React.Children.toArray(children);
    const arrowChildren: React.ReactNode[] = [];
    const bodyChildren: React.ReactNode[] = [];
    let hasViewport = false;

    for (const child of childList) {
      if (React.isValidElement(child)) {
        const displayName =
          child.type !== null &&
          (typeof child.type === 'object' || typeof child.type === 'function') &&
          'displayName' in child.type
            ? (child.type as { displayName?: string }).displayName
            : undefined;
        const elementProps =
          typeof child.props === 'object' && child.props !== null
            ? (child.props as Record<string, unknown>)
            : null;

        if (
          child.type === MenubarArrow ||
          child.type === BaseMenu.Arrow ||
          displayName === 'MenubarArrow' ||
          elementProps?.['data-slot'] === 'menubar-arrow'
        ) {
          arrowChildren.push(child);
          continue;
        }

        if (
          child.type === MenubarViewport ||
          child.type === BaseMenu.Viewport ||
          displayName === 'MenubarViewport' ||
          elementProps?.['data-slot'] === 'menubar-viewport'
        ) {
          hasViewport = true;
        }
      }
      bodyChildren.push(child);
    }

    const useOuterScroll = scrollable && !hasViewport;

    return (
      <MenubarPortal container={container} keepMounted={keepMounted}>
        {showBackdrop && <MenubarBackdrop className={backdropClassName} />}
        <MenubarPositioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
          positionMethod={positionMethod}
          sticky={sticky}
          collisionPadding={collisionPadding}
          collisionBoundary={collisionBoundary}
          collisionAvoidance={collisionAvoidance}
          arrowPadding={arrowPadding}
          disableAnchorTracking={disableAnchorTracking}
          className={containerClassName}
        >
          <MenubarPopup ref={ref} className={className} {...props}>
            {arrowChildren.length > 0 ? arrowChildren : showArrow ? <MenubarArrow /> : null}
            {useOuterScroll ? (
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
          </MenubarPopup>
        </MenubarPositioner>
      </MenubarPortal>
    );
  }
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
      <div className="flex flex-1 min-w-0 items-center gap-2.5">
        {icon && (
          <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />
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

export interface MenubarCheckboxItemIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItemIndicator> {}

export const MenubarCheckboxItemIndicator = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.CheckboxItemIndicator>,
  MenubarCheckboxItemIndicatorProps
>(({ className, children, ...props }, ref) => (
  <BaseMenu.CheckboxItemIndicator
    ref={ref}
    data-slot="menubar-checkbox-item-indicator"
    className={composeClassName('shrink-0 text-primary flex items-center justify-center', className)}
    {...props}
  >
    {children ?? <Icon name="check" size="xs" className="font-bold" aria-hidden="true" />}
  </BaseMenu.CheckboxItemIndicator>
));
MenubarCheckboxItemIndicator.displayName = 'MenubarCheckboxItemIndicator';

export interface MenubarCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem> {
  icon?: string;
}

export const MenubarCheckboxItem = React.forwardRef<HTMLDivElement, MenubarCheckboxItemProps>(
  ({ className, children, icon, ...props }, ref) => {
    const hasExplicitIndicator = React.useMemo(() => {
      return React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) return false;
        const type = child.type;
        const displayName =
          type !== null && (typeof type === 'object' || typeof type === 'function') && 'displayName' in type
            ? (type as { displayName?: string }).displayName
            : undefined;
        const elementProps =
          typeof child.props === 'object' && child.props !== null
            ? (child.props as Record<string, unknown>)
            : null;
        return (
          type === MenubarCheckboxItemIndicator ||
          type === BaseMenu.CheckboxItemIndicator ||
          displayName === 'MenubarCheckboxItemIndicator' ||
          elementProps?.['data-slot'] === 'menubar-checkbox-item-indicator'
        );
      });
    }, [children]);

    return (
      <BaseMenu.CheckboxItem
        ref={ref}
        data-slot="menubar-checkbox-item"
        className={composeClassName(
          'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          className
        )}
        {...props}
      >
        {hasExplicitIndicator ? (
          <>
            {icon && <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />}
            {children}
          </>
        ) : (
          <>
            <div className="flex flex-1 min-w-0 items-center gap-2.5">
              {icon && (
                <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{children}</span>
            </div>
            <MenubarCheckboxItemIndicator />
          </>
        )}
      </BaseMenu.CheckboxItem>
    );
  }
);
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export interface MenubarRadioItemIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItemIndicator> {}

export const MenubarRadioItemIndicator = React.forwardRef<
  React.ComponentRef<typeof BaseMenu.RadioItemIndicator>,
  MenubarRadioItemIndicatorProps
>(({ className, children, ...props }, ref) => (
  <BaseMenu.RadioItemIndicator
    ref={ref}
    data-slot="menubar-radio-item-indicator"
    className={composeClassName('shrink-0 text-primary flex items-center justify-center', className)}
    {...props}
  >
    {children ?? <Icon name="radio_button_checked" size="xs" className="font-bold" aria-hidden="true" />}
  </BaseMenu.RadioItemIndicator>
));
MenubarRadioItemIndicator.displayName = 'MenubarRadioItemIndicator';

export interface MenubarRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem> {
  icon?: string;
}

export const MenubarRadioItem = React.forwardRef<HTMLDivElement, MenubarRadioItemProps>(
  ({ className, children, icon, ...props }, ref) => {
    const hasExplicitIndicator = React.useMemo(() => {
      return React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) return false;
        const type = child.type;
        const displayName =
          type !== null && (typeof type === 'object' || typeof type === 'function') && 'displayName' in type
            ? (type as { displayName?: string }).displayName
            : undefined;
        const elementProps =
          typeof child.props === 'object' && child.props !== null
            ? (child.props as Record<string, unknown>)
            : null;
        return (
          type === MenubarRadioItemIndicator ||
          type === BaseMenu.RadioItemIndicator ||
          displayName === 'MenubarRadioItemIndicator' ||
          elementProps?.['data-slot'] === 'menubar-radio-item-indicator'
        );
      });
    }, [children]);

    return (
      <BaseMenu.RadioItem
        ref={ref}
        data-slot="menubar-radio-item"
        className={composeClassName(
          'flex items-center justify-between gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[checked]:font-semibold data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          className
        )}
        {...props}
      >
        {hasExplicitIndicator ? (
          <>
            {icon && <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />}
            {children}
          </>
        ) : (
          <>
            <div className="flex flex-1 min-w-0 items-center gap-2.5">
              {icon && (
                <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{children}</span>
            </div>
            <MenubarRadioItemIndicator />
          </>
        )}
      </BaseMenu.RadioItem>
    );
  }
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
      <div className="flex flex-1 min-w-0 items-center gap-2.5">
        {icon && (
          <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />
        )}
        <span className="truncate">{children}</span>
      </div>
      <Icon name="chevron_right" size="xs" directional className="text-on-surface-variant shrink-0" aria-hidden="true" />
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
>(({ className, href, ...props }, ref) => (
  <BaseMenu.LinkItem
    ref={ref}
    data-slot="menubar-link-item"
    href={href === undefined ? undefined : sanitizeUrl(href)}
    className={composeClassName(
      'flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-sm font-sans text-sm font-medium cursor-pointer outline-none transition-colors motion-reduce:transition-none select-none text-on-surface hover:bg-state-hover focus:bg-state-hover data-[highlighted]:bg-state-hover data-[highlighted]:text-on-surface data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
      className
    )}
    {...props}
  />
));
MenubarLinkItem.displayName = 'MenubarLinkItem';

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
export const MenubarSubmenuRoot = BaseMenu.SubmenuRoot;

export interface MenubarMenuProps<Payload = unknown> extends BaseMenu.Root.Props<Payload> {
  triggerLabel?: string;
  items?: MenubarMenuItem[];
}

export const MenubarMenu = React.forwardRef(function MenubarMenu<Payload = unknown>(
  { triggerLabel, items, children, ...menuRootProps }: MenubarMenuProps<Payload>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  if (triggerLabel) {
    return (
      <BaseMenu.Root<Payload> {...menuRootProps}>
        {(renderProps) => (
          <>
            <MenubarTrigger ref={ref}>
              <span>{triggerLabel}</span>
            </MenubarTrigger>
            <MenubarContent>
              {children ? (
                typeof children === 'function' ? children(renderProps) : children
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
          </>
        )}
      </BaseMenu.Root>
    );
  }

  return <BaseMenu.Root<Payload> {...menuRootProps}>{children}</BaseMenu.Root>;
}) as (<Payload = unknown>(
  props: MenubarMenuProps<Payload> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element) & { displayName?: string };
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
  Portal: MenubarPortal,
  Positioner: MenubarPositioner,
  Popup: MenubarPopup,
  Backdrop: MenubarBackdrop,
  Content: MenubarContent,
  Item: MenubarItem,
  LinkItem: MenubarLinkItem,
  CheckboxItem: MenubarCheckboxItem,
  CheckboxItemIndicator: MenubarCheckboxItemIndicator,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  RadioItemIndicator: MenubarRadioItemIndicator,
  Submenu: MenubarSubmenu,
  SubmenuRoot: MenubarSubmenuRoot,
  SubmenuTrigger: MenubarSubmenuTrigger,
  Separator: MenubarSeparator,
  Group: MenubarGroup,
  GroupLabel: MenubarGroupLabel,
  Arrow: MenubarArrow,
  Viewport: MenubarViewport,
  Shortcut: MenubarShortcut,
  createHandle: BaseMenu.createHandle,
  Handle: BaseMenu.Handle,
});

export { BaseMenubar, BaseMenu };
export const MenubarPortalPrimitive = BaseMenu.Portal;
export const MenubarPositionerPrimitive = BaseMenu.Positioner;
export const MenubarPopupPrimitive = BaseMenu.Popup;
export const MenubarViewportPrimitive = BaseMenu.Viewport;
export const MenubarCheckboxItemIndicatorPrimitive = BaseMenu.CheckboxItemIndicator;
export const MenubarRadioItemIndicatorPrimitive = BaseMenu.RadioItemIndicator;
export const createMenubarHandle = BaseMenu.createHandle;
export const MenubarHandle = BaseMenu.Handle;
export default Menubar;
