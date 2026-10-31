import * as React from 'react';
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

export interface NavigationSubItem {
  id: string;
  label: string;
  href?: string;
  description?: string;
  icon?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface NavigationMenuItemData {
  id: string;
  label: string;
  shortLabel?: string;
  href?: string;
  description?: string;
  icon?: string;
  active?: boolean;
  children?: NavigationSubItem[];
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type NavigationMenuItem = NavigationMenuItemData;

export const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.List
    ref={ref}
    className={cn('flex flex-1 list-none items-center gap-2 px-1 bg-surface border-b border-outline-variant w-full', className)}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItemPrimitive = BaseNavigationMenu.Item;

export interface NavigationMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Trigger> {
  active?: boolean;
}

export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(({ className, children, active = false, ...props }, ref) => (
  <BaseNavigationMenu.Trigger
    ref={ref}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'group relative inline-flex min-h-[44px] h-full w-max items-center justify-center px-4 py-2 font-sans text-sm font-semibold transition-colors outline-none cursor-pointer rounded-none text-on-surface-variant',
      'hover:text-on-surface hover:bg-surface-container/60',
      'data-[popup-open]:text-primary data-[popup-open]:bg-surface-container/40',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      active
        ? 'text-primary font-bold after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-primary after:rounded-none'
        : 'after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-transparent after:rounded-none',
      className
    )}
    {...props}
  >
    {children}
  </BaseNavigationMenu.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Content
    ref={ref}
    className={cn(
      'h-full w-[calc(100vw-40px)] p-2 min-[500px]:w-max min-[500px]:min-w-[260px] min-[500px]:max-w-[420px]',
      'transition-[opacity,transform,translate] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
      'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
      'data-[starting-style]:data-[activation-direction=left]:translate-x-[-20%]',
      'data-[starting-style]:data-[activation-direction=right]:translate-x-[20%]',
      'data-[ending-style]:data-[activation-direction=left]:translate-x-[20%]',
      'data-[ending-style]:data-[activation-direction=right]:translate-x-[-20%]',
      'motion-reduce:transition-none motion-reduce:transform-none',
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

export interface NavigationMenuLinkProps
  extends React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Link> {
  active?: boolean;
  variant?: 'default' | 'bar';
}

export const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, active = false, variant = 'default', ...props }, ref) => {
  const isBar = variant === 'bar';

  return (
    <BaseNavigationMenu.Link
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        isBar
          ? cn(
              'group relative inline-flex min-h-[44px] h-full w-max items-center justify-center px-3 sm:px-4 py-2 font-sans text-sm font-semibold transition-colors outline-none cursor-pointer rounded-none',
              active
                ? 'text-primary font-bold after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-primary after:rounded-none'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-transparent after:rounded-none',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            )
          : cn(
              'flex flex-col gap-0.5 px-3 py-2 min-h-[44px] rounded-md transition-colors cursor-pointer outline-none select-none',
              active
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface hover:bg-surface-container focus:bg-surface-container',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            ),
        className
      )}
      {...props}
    />
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Positioner
    ref={ref}
    sideOffset={8}
    className={cn(
      'h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-instant:transition-none z-50',
      className
    )}
    {...props}
  />
));
NavigationMenuPositioner.displayName = 'NavigationMenuPositioner';

export const NavigationMenuPopup = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Popup
    ref={ref}
    className={cn(
      'relative h-[var(--popup-height)] w-[var(--popup-width)] origin-[var(--transform-origin)]',
      'rounded-xl bg-surface border border-outline-variant shadow-modal outline-none',
      'transition-[opacity,transform,width,height] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-tiny)]',
      'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
      className
    )}
    {...props}
  />
));
NavigationMenuPopup.displayName = 'NavigationMenuPopup';

export const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Viewport
    ref={ref}
    className={cn('relative h-full w-full overflow-hidden', className)}
    {...props}
  />
));
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export const NavigationMenuArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Arrow>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Arrow
    ref={ref}
    className={cn('fill-surface stroke-outline-variant', className)}
    {...props}
  />
));
NavigationMenuArrow.displayName = 'NavigationMenuArrow';

export const NavigationMenuIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Icon>
>(({ className, children, ...props }, ref) => (
  <BaseNavigationMenu.Icon
    ref={ref}
    className={cn(
      'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-data-[popup-open]:rotate-180 text-on-surface-variant',
      className
    )}
    {...props}
  >
    {children ?? <Icon name="expand_more" size="sm" className="ml-1" />}
  </BaseNavigationMenu.Icon>
));
NavigationMenuIcon.displayName = 'NavigationMenuIcon';

export interface NavigationMenuProps<Value = string> {
  items?: NavigationMenuItemData[];
  activeId?: string;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null, eventDetails: BaseNavigationMenu.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  actionsRef?: React.RefObject<BaseNavigationMenu.Root.Actions | null>;
  delay?: number;
  closeDelay?: number;
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
  className?: string;
}

function NavigationMenuComponent<Value = string>({
  items,
  activeId,
  value,
  defaultValue,
  onValueChange,
  onOpenChangeComplete,
  actionsRef,
  delay = 50,
  closeDelay = 50,
  orientation = 'horizontal',
  children,
  className,
}: NavigationMenuProps<Value>): React.JSX.Element {
  return (
    <BaseNavigationMenu.Root<Value>
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onOpenChangeComplete={onOpenChangeComplete}
      actionsRef={actionsRef}
      delay={delay}
      closeDelay={closeDelay}
      orientation={orientation}
      className={cn('relative z-10 flex w-full items-center', className)}
    >
      {children ? (
        children
      ) : (
        <>
          <NavigationMenuList>
            {items?.map((item) => {
              const isChildActive = item.children?.some((child) => child.id === activeId);
              const isActive = Boolean(item.active || activeId === item.id || isChildActive);
              const hasChildren = item.children && item.children.length > 0;

              if (hasChildren) {
                return (
                  <BaseNavigationMenu.Item key={item.id} value={item.id as Value} className="relative">
                    <NavigationMenuTrigger active={isActive}>
                      {item.icon && (
                        <Icon name={item.icon} size="sm" className="mr-2 leading-none" />
                      )}
                      <span className={cn(item.shortLabel && 'hidden xl:inline')}>{item.label}</span>
                      {item.shortLabel && (
                        <span className="inline xl:hidden whitespace-nowrap">{item.shortLabel}</span>
                      )}
                      <NavigationMenuIcon />
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                      <div className="flex flex-col gap-1 p-1">
                        {item.children?.map((sub) => {
                          const isSubActive = activeId === sub.id;
                          return (
                            <NavigationMenuLink
                              key={sub.id}
                              href={sub.href || `#${sub.id}`}
                              active={isSubActive}
                              onClick={(e) => {
                                if (sub.onClick) {
                                  if (!sub.href || sub.href === '#' || sub.href.startsWith('#')) {
                                    e.preventDefault();
                                  }
                                  sub.onClick(e);
                                }
                              }}
                              className={cn(
                                'flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer outline-none select-none text-left',
                                isSubActive
                                  ? 'bg-primary-container text-on-primary-container font-semibold'
                                  : 'text-on-surface hover:bg-surface-container focus:bg-surface-container'
                              )}
                            >
                              <div className="flex items-center gap-2 font-sans text-sm font-semibold">
                                {sub.icon && (
                                  <Icon
                                    name={sub.icon}
                                    size="sm"
                                    className={cn(
                                      'leading-none',
                                      isSubActive ? 'text-primary' : 'text-on-surface-variant'
                                    )}
                                  />
                                )}
                                <span>{sub.label}</span>
                                {isSubActive && (
                                  <Icon name="check" size="sm" className="ml-auto text-primary leading-none" />
                                )}
                              </div>
                              {sub.description && (
                                <span
                                  className={cn(
                                    'font-sans text-xs leading-relaxed',
                                    sub.icon ? 'pl-6' : '',
                                    isSubActive ? 'text-on-primary-container/85' : 'text-on-surface-variant'
                                  )}
                                >
                                  {sub.description}
                                </span>
                              )}
                            </NavigationMenuLink>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </BaseNavigationMenu.Item>
                );
              }

              return (
                <BaseNavigationMenu.Item key={item.id} value={item.id as Value}>
                  <NavigationMenuLink
                    href={item.href || `#${item.id}`}
                    variant="bar"
                    active={isActive}
                    onClick={(e) => {
                      if (item.onClick) {
                        if (!item.href || item.href === '#' || item.href.startsWith('#')) {
                          e.preventDefault();
                        }
                        item.onClick(e);
                      }
                    }}
                  >
                    {item.icon && (
                      <Icon name={item.icon} size="sm" className="mr-2 leading-none" />
                    )}
                    <span className={cn(item.shortLabel && 'hidden xl:inline')}>{item.label}</span>
                    {item.shortLabel && (
                      <span className="inline xl:hidden whitespace-nowrap">{item.shortLabel}</span>
                    )}
                  </NavigationMenuLink>
                </BaseNavigationMenu.Item>
              );
            })}
          </NavigationMenuList>

          <BaseNavigationMenu.Portal>
            <NavigationMenuPositioner>
              <NavigationMenuPopup>
                <NavigationMenuArrow />
                <NavigationMenuViewport />
              </NavigationMenuPopup>
            </NavigationMenuPositioner>
          </BaseNavigationMenu.Portal>
        </>
      )}
    </BaseNavigationMenu.Root>
  );
}

// Compound export mapping Base UI primitives
export const NavigationMenu = Object.assign(NavigationMenuComponent, {
  Root: BaseNavigationMenu.Root,
  List: NavigationMenuList,
  Item: BaseNavigationMenu.Item,
  Trigger: NavigationMenuTrigger,
  Portal: BaseNavigationMenu.Portal,
  Positioner: NavigationMenuPositioner,
  Popup: NavigationMenuPopup,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Viewport: NavigationMenuViewport,
  Backdrop: BaseNavigationMenu.Backdrop,
  Arrow: NavigationMenuArrow,
  Icon: NavigationMenuIcon,
});

// Re-export Base UI primitives for compound composition
export { BaseNavigationMenu };
export const NavigationMenuRoot = BaseNavigationMenu.Root;
export const NavigationMenuItem = BaseNavigationMenu.Item;
export const NavigationMenuPortal = BaseNavigationMenu.Portal;
export const NavigationMenuBackdrop = BaseNavigationMenu.Backdrop;

export default NavigationMenu;
