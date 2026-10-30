/**
 * Sidebar primitive (@base-ui/react/drawer + Base UI compound architecture).
 *
 * Base UI Documentation: https://base-ui.com/react/components/drawer
 * Shadcn UI Reference: https://ui.shadcn.com/docs/components/base/sidebar
 *
 * TAXONOMY & USAGE:
 * - Composable, mobile-responsive application navigation shell and collapsible rail.
 * - On desktop viewports (>= md), renders a stationary or collapsible `<aside>` navigation bar
 *   (supporting icon-rail, off-canvas, floating, and inset variants).
 * - On mobile/tablet viewports (< md), automatically delegates to a touch-friendly Base UI modal
 *   Drawer with swipe dismissal and backdrop blur.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant touch targets (min 44x44px), and calibrated motion restraint.
 */
import * as React from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { Button as BaseButton } from '@base-ui/react/button';
import { Tooltip, TooltipProvider, type TooltipProps } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type SidebarButtonClassName = React.ComponentPropsWithoutRef<typeof BaseButton>['className'];
type ClonedChildProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<unknown> };

/** Merges sidebar classes, ref and props onto the single child used by the `asChild` pattern. */
function cloneAsChild(
  child: React.ReactElement,
  classes: string,
  ref: React.Ref<unknown>,
  props: object
) {
  const element = child as React.ReactElement<ClonedChildProps>;
  return React.cloneElement(element, {
    ref,
    className: cn(classes, element.props.className),
    ...props,
  } as ClonedChildProps);
}

// Constants exported for SSR hydration and custom layout sizing
export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3.5rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export interface SidebarContext {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  isEmbedded: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar(): SidebarContext {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}

/* -------------------------------------------------------------------------------------------------
 * SidebarProvider
 * -----------------------------------------------------------------------------------------------*/
export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  embedded?: boolean;
}

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      embedded = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const isEmbedded = embedded;

    // Uncontrolled state fallback initialized from localStorage or defaultOpen
    const [_open, _setOpen] = React.useState<boolean>(() => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(SIDEBAR_COOKIE_NAME);
          if (stored !== null) return stored === 'true';
        } catch {
          // ignore
        }
      }
      return defaultOpen;
    });

    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const nextOpen = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(nextOpen);
        } else {
          _setOpen(nextOpen);
        }

        try {
          localStorage.setItem(SIDEBAR_COOKIE_NAME, String(nextOpen));
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        } catch {
          // ignore
        }
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((prev) => !prev)
        : setOpen((prev) => !prev);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        isEmbedded,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, isEmbedded, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delay={100} closeDelay={100}>
          <div
            data-slot="sidebar-wrapper"
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                '--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              'group/sidebar-wrapper flex w-full has-[[data-variant=inset]]:bg-surface',
              isEmbedded ? 'h-full min-h-0' : 'min-h-svh',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

/* -------------------------------------------------------------------------------------------------
 * Sidebar
 * -----------------------------------------------------------------------------------------------*/
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  embedded?: boolean;
}

export const SidebarComponent = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      embedded,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile, isEmbedded: contextEmbedded } = useSidebar();
    const isEmbedded =
      embedded ??
      contextEmbedded ??
      className?.includes('h-full') ??
      className?.includes('relative') ??
      className?.includes('absolute') ??
      false;

    if (collapsible === 'none') {
      return (
        <aside
          ref={ref}
          data-slot="sidebar"
          data-sidebar="sidebar"
          className={cn(
            'flex w-[var(--sidebar-width)] flex-col bg-surface border-r border-outline-variant text-on-surface',
            isEmbedded ? 'h-full' : 'h-svh',
            side === 'right' && 'border-r-0 border-l',
            className
          )}
          {...props}
        >
          {children}
        </aside>
      );
    }

    if (isMobile && !isEmbedded) {
      return (
        <BaseDrawer.Root
          open={openMobile}
          onOpenChange={setOpenMobile}
          swipeDirection={side === 'right' ? 'right' : 'left'}
        >
          <BaseDrawer.Portal>
            <BaseDrawer.Backdrop
              data-slot="sidebar-backdrop"
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-[2px] z-50 transition-opacity duration-[var(--duration-slow)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]"
            />
            <BaseDrawer.Viewport
              data-slot="sidebar-viewport"
              className={cn(
                'fixed inset-y-0 z-50 flex max-w-full',
                side === 'right' ? 'right-0 justify-end' : 'left-0 justify-start'
              )}
            >
              <BaseDrawer.Popup
                data-slot="sidebar-popup"
                className={cn(
                  'w-[var(--sidebar-width-mobile)] max-w-[85vw] h-full rounded-none bg-surface shadow-modal flex flex-col justify-between overflow-y-auto outline-none transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none',
                  side === 'right'
                    ? 'border-l-2 border-outline-variant data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full'
                    : 'border-r-2 border-outline-variant data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
                  className
                )}
              >
                <BaseDrawer.Content className="h-full flex flex-col justify-between">
                  <BaseDrawer.Title className="sr-only">Sidebar Navigation</BaseDrawer.Title>
                  <BaseDrawer.Description className="sr-only">
                    Application navigation sidebar
                  </BaseDrawer.Description>
                  <div
                    data-slot="sidebar"
                    data-sidebar="sidebar"
                    data-mobile="true"
                    className="flex h-full w-full flex-col bg-surface"
                  >
                    {children}
                  </div>
                </BaseDrawer.Content>
              </BaseDrawer.Popup>
            </BaseDrawer.Viewport>
          </BaseDrawer.Portal>
        </BaseDrawer.Root>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="sidebar-container"
        className={cn(
          'group peer text-on-surface select-none',
          isEmbedded ? 'relative h-full shrink-0 block' : 'hidden md:block'
        )}
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        {/* Layout gap spacer to keep document flow steady during transitions */}
        <div
          data-slot="sidebar-gap"
          className={cn(
            'duration-[var(--duration-slow)] relative w-[var(--sidebar-width)] bg-transparent transition-[width] ease-[var(--ease-standard)] motion-reduce:transition-none',
            isEmbedded ? 'h-full' : 'h-svh',
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]'
          )}
        />
        {/* Aside element */}
        <aside
          data-slot="sidebar"
          data-sidebar="sidebar"
          className={cn(
            'duration-[var(--duration-slow)] transition-[left,right,width] ease-[var(--ease-standard)] motion-reduce:transition-none bg-surface',
            side === 'left'
              ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] border-r border-outline-variant'
              : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] border-l border-outline-variant',
            variant === 'floating'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4)+2px)]'
              : variant === 'inset'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4)+2px)]'
              : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
            className,
            // Positioning placed after className so that isEmbedded absolute overrides any relative/static in className
            isEmbedded
              ? 'absolute inset-y-0 left-0 z-20 h-full w-[var(--sidebar-width)] flex flex-col'
              : 'fixed inset-y-0 z-20 hidden md:flex flex-col h-svh w-[var(--sidebar-width)]'
          )}
          {...props}
        >
          <div
            data-slot="sidebar-inner"
            data-sidebar="sidebar"
            className={cn(
              'flex h-full w-full flex-col bg-surface',
              variant === 'floating' && 'rounded-lg border border-outline-variant shadow-ambient',
              variant === 'inset' && 'rounded-lg border border-outline-variant'
            )}
          >
            {children}
          </div>
        </aside>
      </div>
    );
  }
);
SidebarComponent.displayName = 'Sidebar';

/* -------------------------------------------------------------------------------------------------
 * SidebarTrigger
 * -----------------------------------------------------------------------------------------------*/
export interface SidebarTriggerProps extends React.ComponentPropsWithoutRef<typeof Button> {
  icon?: React.ReactNode;
}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, icon, children, ...props }, ref) => {
    const { toggleSidebar, state, isMobile, openMobile } = useSidebar();
    const isOpen = isMobile ? openMobile : state === 'expanded';

    return (
      <Tooltip content="Toggle Sidebar (Ctrl+B)">
        <Button
          ref={ref}
          data-slot="sidebar-trigger"
          data-sidebar="trigger"
          variant="text"
          size="icon"
          aria-label="Toggle Sidebar"
          className={cn(
            'size-11 min-h-[44px] min-w-[44px] rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
            className
          )}
          onClick={(event) => {
            onClick?.(event);
            toggleSidebar();
          }}
          {...props}
        >
          {children ?? icon ?? <Icon name={isOpen ? 'menu_open' : 'menu'} size="md" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </Tooltip>
    );
  }
);
SidebarTrigger.displayName = 'SidebarTrigger';

/* -------------------------------------------------------------------------------------------------
 * SidebarRail
 * -----------------------------------------------------------------------------------------------*/
export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip content="Toggle Sidebar">
      <BaseButton
        ref={ref}
        data-slot="sidebar-rail"
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        className={cn(
          'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-[background-color,transform,left,right] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-outline group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex cursor-ew-resize',
          '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
          '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
          'hover:group-data-[collapsible=offcanvas]:bg-surface group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
          '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
          '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
          className
        )}
        {...props}
      />
    </Tooltip>
  );
});
SidebarRail.displayName = 'SidebarRail';

/* -------------------------------------------------------------------------------------------------
 * SidebarInset
 * -----------------------------------------------------------------------------------------------*/
export interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
  embedded?: boolean;
}

export const SidebarInset = React.forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ className, embedded, ...props }, ref) => {
    const context = React.useContext(SidebarContext);
    const isEmbedded = embedded ?? context?.isEmbedded ?? className?.includes('h-full') ?? false;

    return (
      <main
        ref={ref}
        data-slot="sidebar-inset"
        className={cn(
          'relative flex flex-1 flex-col bg-surface',
          isEmbedded ? 'min-h-0 h-full' : 'min-h-svh',
          'peer-data-[variant=inset]:min-h-[calc(100svh-1rem)] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-outline-variant',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = 'SidebarInset';

/* -------------------------------------------------------------------------------------------------
 * SidebarInput
 * -----------------------------------------------------------------------------------------------*/
export const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        'h-10 w-full bg-surface-container/60 border-outline-variant shadow-none focus-visible:outline-2 focus-visible:outline-primary',
        className
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = 'SidebarInput';

/* -------------------------------------------------------------------------------------------------
 * SidebarHeader & SidebarFooter
 * -----------------------------------------------------------------------------------------------*/
export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        'flex flex-col gap-2 p-2 shrink-0 border-b border-outline-variant/60 bg-surface group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        'flex flex-col gap-2 p-2 shrink-0 border-t border-outline-variant/60 bg-surface group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

/* -------------------------------------------------------------------------------------------------
 * SidebarSeparator
 * -----------------------------------------------------------------------------------------------*/
export const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('mx-2 w-auto bg-outline-variant/60', className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = 'SidebarSeparator';

/* -------------------------------------------------------------------------------------------------
 * SidebarContent
 * -----------------------------------------------------------------------------------------------*/
export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2 scrollbar-thin',
        'group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

/* -------------------------------------------------------------------------------------------------
 * SidebarGroup, GroupLabel, GroupAction, GroupContent
 * -----------------------------------------------------------------------------------------------*/
export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(
        'relative flex w-full min-w-0 flex-col p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const classes = cn(
      'duration-[var(--duration-fast)] flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-bold font-label text-on-surface-variant select-none outline-none transition-[margin,opacity] ease-[var(--ease-standard)] motion-reduce:transition-none',
      '[&>svg]:size-4 [&>svg]:shrink-0 [&>.material-symbols-outlined]:text-base [&>.material-symbols-outlined]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 pointer-events-none group-data-[collapsible=icon]:pointer-events-none',
      className
    );

    if (asChild && React.isValidElement(children)) {
      return cloneAsChild(children, classes, ref, props);
    }

    return (
      <div
        ref={ref}
        data-slot="sidebar-group-label"
        data-sidebar="group-label"
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export interface SidebarGroupActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SidebarGroupAction = React.forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const classes = cn(
      'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-on-surface-variant outline-none transition-transform hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary',
      'group-data-[collapsible=icon]:hidden',
      className
    );

    if (asChild && React.isValidElement(children)) {
      return cloneAsChild(children, classes, ref, props);
    }

    return (
      <BaseButton
        ref={ref}
        data-slot="sidebar-group-action"
        data-sidebar="group-action"
        className={classes}
        {...props}
      >
        {children}
      </BaseButton>
    );
  }
);
SidebarGroupAction.displayName = 'SidebarGroupAction';

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn(
        'w-full text-sm group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarGroupContent.displayName = 'SidebarGroupContent';

/* -------------------------------------------------------------------------------------------------
 * SidebarMenu, MenuItem, MenuButton, MenuAction, MenuBadge, MenuSkeleton
 * -----------------------------------------------------------------------------------------------*/
export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        'flex w-full min-w-0 flex-col gap-1 list-none p-0 m-0 group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarMenu.displayName = 'SidebarMenu';

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn(
        'group/menu-item relative list-none group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuItem.displayName = 'SidebarMenuItem';

export interface SidebarMenuButtonVariantsOptions {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function sidebarMenuButtonVariants({
  variant = 'default',
  size = 'default',
  className,
}: SidebarMenuButtonVariantsOptions = {}): string {
  const sizeClasses = {
    default: 'h-11 min-h-[44px] text-sm gap-2.5 px-3',
    sm: 'h-9 min-h-[36px] text-xs gap-2 px-2.5',
    lg: 'h-12 min-h-[48px] text-base gap-3 px-3.5',
  }[size];

  const variantClasses = {
    default:
      'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium data-[active=true]:bg-primary-container data-[active=true]:text-on-primary-container data-[active=true]:font-semibold',
    outline:
      'bg-surface border border-outline-variant hover:bg-surface-container hover:text-on-surface text-on-surface-variant font-medium data-[active=true]:border-primary/40 data-[active=true]:bg-primary-container data-[active=true]:text-on-primary-container data-[active=true]:font-semibold',
  }[variant];

  return cn(
    'peer/menu-button relative flex w-full items-center rounded-md font-label transition-[background-color,color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] outline-none select-none cursor-pointer',
    // Focus indicator: Floating 2px outer outline (WCAG 2.2 SC 2.4.7)
    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    // Leading icon tokens: Inactive uses on-surface-variant; Active lights up in Electric Blue (primary)
    '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:transition-colors [&>.material-symbols-outlined]:text-xl [&>.material-symbols-outlined]:shrink-0 [&>.material-symbols-outlined]:transition-colors',
    'data-[active=true]:[&>svg]:text-primary data-[active=true]:[&>.material-symbols-outlined]:text-primary hover:[&>svg]:text-on-surface hover:[&>.material-symbols-outlined]:text-on-surface',
    'group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:min-h-[44px] group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center',
    '[&>span:last-child]:truncate [&>span:last-child]:group-data-[collapsible=icon]:hidden',
    sizeClasses,
    variantClasses,
    className
  );
}

export interface SidebarMenuButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'size' | 'className'> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | (Omit<Partial<TooltipProps>, 'children'> & { children?: React.ReactNode });
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: SidebarButtonClassName;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state } = useSidebar();

    const baseVariantClasses = sidebarMenuButtonVariants({
      variant,
      size,
    });

    const computedClassName =
      typeof className === 'function'
        ? (buttonState: Parameters<typeof className>[0]) => cn(baseVariantClasses, className(buttonState))
        : cn(baseVariantClasses, className);

    // Support both asChild and polymorphic Base UI render prop
    const effectiveRender = asChild && React.isValidElement(children) ? children : render;

    const buttonElement = (
      <BaseButton
        ref={ref}
        data-slot="sidebar-menu-button"
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        render={effectiveRender}
        className={computedClassName}
        {...props}
      >
        {!asChild ? children : undefined}
      </BaseButton>
    );

    // Only wrap with Tooltip when in collapsed icon rail on desktop to avoid controlled/uncontrolled state switching
    if (!tooltip || isMobile || state !== 'collapsed') {
      return buttonElement;
    }

    const tooltipConfig = typeof tooltip === 'string' ? { children: tooltip } : tooltip;

    return (
      <Tooltip
        side="right"
        align="center"
        sideOffset={12}
        content={tooltipConfig.children}
        {...tooltipConfig}
      >
        {buttonElement}
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export interface SidebarMenuActionProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  asChild?: boolean;
  showOnHover?: boolean;
}

export const SidebarMenuAction = React.forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
  ({ className, asChild = false, showOnHover = false, children, ...props }, ref) => {
    const classes = cn(
      'absolute right-1 top-2 flex aspect-square w-7 items-center justify-center rounded-md p-0 text-on-surface-variant outline-none transition-transform hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary',
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2',
      'group-data-[collapsible=icon]:hidden',
      showOnHover &&
        'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0 transition-opacity',
      className
    );

    if (asChild && React.isValidElement(children)) {
      return cloneAsChild(children, classes, ref, props);
    }

    return (
      <BaseButton
        ref={ref}
        data-slot="sidebar-menu-action"
        data-sidebar="menu-action"
        className={classes}
        {...props}
      >
        {children}
      </BaseButton>
    );
  }
);
SidebarMenuAction.displayName = 'SidebarMenuAction';

export const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'pointer-events-none absolute right-2 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1.5 text-xs font-semibold font-mono tabular-nums bg-surface-container text-on-surface-variant peer-hover/menu-button:text-on-surface peer-data-[active=true]/menu-button:bg-primary peer-data-[active=true]/menu-button:text-on-primary',
        'peer-data-[size=sm]/menu-button:top-2',
        'peer-data-[size=default]/menu-button:top-3',
        'peer-data-[size=lg]/menu-button:top-3.5',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

export interface SidebarMenuSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
}

export const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuSkeletonProps
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('flex h-11 items-center gap-2 rounded-md px-2', className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-5 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={{ '--skeleton-width': width } as React.CSSProperties}
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

/* -------------------------------------------------------------------------------------------------
 * SidebarMenuSub, MenuSubItem, MenuSubButton
 * -----------------------------------------------------------------------------------------------*/
export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-outline-variant px-2.5 py-0.5 group-data-[collapsible=icon]:hidden list-none m-0',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = 'SidebarMenuSub';

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ ...props }, ref) => <li ref={ref} data-slot="sidebar-menu-sub-item" className="list-none" {...props} />);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export interface SidebarMenuSubButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'size' | 'className'> {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
  className?: SidebarButtonClassName;
}

export const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(
  (
    {
      asChild = false,
      size = 'md',
      isActive = false,
      className,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 min-h-[32px] text-xs px-2',
      md: 'h-9 min-h-[36px] text-sm px-2.5',
    }[size];

    const baseClasses = cn(
      'flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md font-label text-left outline-none transition-[background-color,color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] select-none cursor-pointer',
      'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
      '[&>span:last-child]:truncate',
      isActive
        ? 'bg-primary-container text-on-primary-container font-semibold'
        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium',
      sizeClasses
    );

    const computedClassName =
      typeof className === 'function'
        ? (buttonState: Parameters<typeof className>[0]) => cn(baseClasses, className(buttonState))
        : cn(baseClasses, className);

    const effectiveRender = asChild && React.isValidElement(children) ? children : render;

    return (
      <BaseButton
        ref={ref}
        data-slot="sidebar-menu-sub-button"
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        render={effectiveRender}
        className={computedClassName}
        {...props}
      >
        {!asChild ? children : undefined}
      </BaseButton>
    );
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

/* -------------------------------------------------------------------------------------------------
 * Compound Object Export
 * -----------------------------------------------------------------------------------------------*/
export const Sidebar = Object.assign(SidebarComponent, {
  Provider: SidebarProvider,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Inset: SidebarInset,
  Input: SidebarInput,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Separator: SidebarSeparator,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
});
