import * as React from 'react';
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { cn } from '@/lib/utils';

export interface NavigationSubItem {
  id: string;
  label: string;
  href?: string;
  description?: string;
  icon?: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  href?: string;
  description?: string;
  icon?: string;
  active?: boolean;
  children?: NavigationSubItem[];
}

export interface NavigationMenuProps {
  items?: NavigationMenuItem[];
  activeId?: string;
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  delay?: number;
  closeDelay?: number;
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
  className?: string;
}

const NavigationMenuComponent: React.FC<NavigationMenuProps> = ({
  items,
  activeId,
  value,
  defaultValue,
  onValueChange,
  delay,
  closeDelay,
  orientation = 'horizontal',
  children,
  className,
}) => {
  return (
    <BaseNavigationMenu.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      delay={delay}
      closeDelay={closeDelay}
      orientation={orientation}
      className={cn('relative z-10 flex w-full items-center', className)}
    >
      {children ? (
        children
      ) : (
        <>
          <BaseNavigationMenu.List className="flex flex-1 list-none items-center gap-1.5 p-1 bg-surface border-b-[1px] border-outline-variant w-full">
            {items?.map((item) => {
              const isActive = item.active || activeId === item.id;
              const hasChildren = item.children && item.children.length > 0;

              if (hasChildren) {
                return (
                  <BaseNavigationMenu.Item key={item.id} value={item.id} className="relative">
                    <BaseNavigationMenu.Trigger
                      className={cn(
                        'group inline-flex min-h-[44px] h-11 w-max items-center justify-center px-4 py-2.5 font-label text-sm font-semibold transition-colors outline-none cursor-pointer border-b-2',
                        isActive
                          ? 'border-primary text-primary font-bold'
                          : 'border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-variant/50',
                        'data-[popup-open]:text-primary data-[popup-open]:bg-surface-variant/40',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary'
                      )}
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-lg mr-2" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                      <BaseNavigationMenu.Icon className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-data-[popup-open]:rotate-180">
                        <span className="material-symbols-outlined text-lg ml-1" aria-hidden="true">
                          expand_more
                        </span>
                      </BaseNavigationMenu.Icon>
                    </BaseNavigationMenu.Trigger>

                    <BaseNavigationMenu.Content
                      className={cn(
                        'h-full w-[calc(100vw-40px)] p-2 min-[500px]:w-max min-[500px]:min-w-[260px] min-[500px]:max-w-[420px]',
                        'transition-[opacity,transform,translate] duration-[0.25s] ease-[var(--ease-standard)]',
                        'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
                        'data-[starting-style]:data-[activation-direction=left]:translate-x-[-20%]',
                        'data-[starting-style]:data-[activation-direction=right]:translate-x-[20%]',
                        'data-[ending-style]:data-[activation-direction=left]:translate-x-[20%]',
                        'data-[ending-style]:data-[activation-direction=right]:translate-x-[-20%]'
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        {item.children?.map((sub) => (
                          <BaseNavigationMenu.Link
                            key={sub.id}
                            href={sub.href || '#'}
                            className={cn(
                              'flex flex-col gap-0.5 px-3 py-2.5 min-h-[44px] rounded-md transition-colors cursor-pointer outline-none select-none',
                              'text-on-surface hover:bg-surface-variant hover:text-primary focus:bg-surface-variant focus:text-primary',
                              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary'
                            )}
                          >
                            <div className="flex items-center gap-2 font-sans text-sm font-semibold">
                              {sub.icon && (
                                <span className="material-symbols-outlined text-base" aria-hidden="true">
                                  {sub.icon}
                                </span>
                              )}
                              <span>{sub.label}</span>
                            </div>
                            {sub.description && (
                              <span className="font-sans text-xs text-on-surface-variant">
                                {sub.description}
                              </span>
                            )}
                          </BaseNavigationMenu.Link>
                        ))}
                      </div>
                    </BaseNavigationMenu.Content>
                  </BaseNavigationMenu.Item>
                );
              }

              return (
                <BaseNavigationMenu.Item key={item.id} value={item.id}>
                  <BaseNavigationMenu.Link
                    href={item.href || '#'}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-[44px] h-11 w-max items-center justify-center px-4 py-2.5 font-label text-sm font-semibold transition-colors outline-none cursor-pointer border-b-2',
                      isActive
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-variant/50',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary'
                    )}
                  >
                    {item.icon && (
                      <span className="material-symbols-outlined text-lg mr-2" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </BaseNavigationMenu.Link>
                </BaseNavigationMenu.Item>
              );
            })}
          </BaseNavigationMenu.List>

          <BaseNavigationMenu.Portal>
            <BaseNavigationMenu.Positioner
              sideOffset={8}
              className="h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[0.25s] ease-[var(--ease-standard)] data-instant:transition-none"
            >
              <BaseNavigationMenu.Popup
                className={cn(
                  'relative h-[var(--popup-height)] w-[var(--popup-width)] origin-[var(--transform-origin)]',
                  'rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating outline-none',
                  'transition-[opacity,transform,width,height] duration-[0.25s] ease-[var(--ease-standard)]',
                  'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
                  'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-tiny)]'
                )}
              >
                <BaseNavigationMenu.Arrow className="fill-surface" />
                <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
              </BaseNavigationMenu.Popup>
            </BaseNavigationMenu.Positioner>
          </BaseNavigationMenu.Portal>
        </>
      )}
    </BaseNavigationMenu.Root>
  );
};

// Compound export mapping Base UI primitives
export const NavigationMenu = Object.assign(NavigationMenuComponent, {
  Root: BaseNavigationMenu.Root,
  List: BaseNavigationMenu.List,
  Item: BaseNavigationMenu.Item,
  Trigger: BaseNavigationMenu.Trigger,
  Portal: BaseNavigationMenu.Portal,
  Positioner: BaseNavigationMenu.Positioner,
  Popup: BaseNavigationMenu.Popup,
  Content: BaseNavigationMenu.Content,
  Link: BaseNavigationMenu.Link,
  Viewport: BaseNavigationMenu.Viewport,
  Backdrop: BaseNavigationMenu.Backdrop,
  Arrow: BaseNavigationMenu.Arrow,
  Icon: BaseNavigationMenu.Icon,
});

// Re-export Base UI primitives for compound composition
export { BaseNavigationMenu };
export const NavigationMenuRoot = BaseNavigationMenu.Root;
export const NavigationMenuList = BaseNavigationMenu.List;
export const NavigationMenuItemPrimitive = BaseNavigationMenu.Item;
export const NavigationMenuTrigger = BaseNavigationMenu.Trigger;
export const NavigationMenuPortal = BaseNavigationMenu.Portal;
export const NavigationMenuPositioner = BaseNavigationMenu.Positioner;
export const NavigationMenuPopup = BaseNavigationMenu.Popup;
export const NavigationMenuContent = BaseNavigationMenu.Content;
export const NavigationMenuLink = BaseNavigationMenu.Link;
export const NavigationMenuViewport = BaseNavigationMenu.Viewport;
export const NavigationMenuBackdrop = BaseNavigationMenu.Backdrop;
export const NavigationMenuArrow = BaseNavigationMenu.Arrow;
export const NavigationMenuIcon = BaseNavigationMenu.Icon;

