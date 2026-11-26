'use client';

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
import { useDirection } from '@base-ui/react/direction-provider';
import { useRender } from '@base-ui/react/use-render';
import { Tooltip, TooltipProvider, type TooltipProps } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/components/ui/icon';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

type SidebarButtonClassName = React.ComponentPropsWithoutRef<typeof BaseButton>['className'];

// Constants exported for SSR hydration and custom layout sizing
export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3.5rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export type SidebarMobileBehavior = 'drawer' | 'hidden' | 'inline';

export interface SidebarContext {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  mobileBreakpoint: number;
  mobileBehavior: SidebarMobileBehavior;
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

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function useIsMobile(breakpoint = 768) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => {};
      }
      const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [breakpoint]
  );

  const getSnapshot = React.useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  }, [breakpoint]);

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function getDesktopBreakpointClasses(mobileBreakpoint: number) {
  if (mobileBreakpoint <= 640) {
    return { block: 'hidden sm:block', flex: 'hidden sm:flex', railFlex: 'sm:flex' };
  }
  if (mobileBreakpoint >= 1280) {
    return { block: 'hidden xl:block', flex: 'hidden xl:flex', railFlex: 'xl:flex' };
  }
  if (mobileBreakpoint >= 1024) {
    return { block: 'hidden lg:block', flex: 'hidden lg:flex', railFlex: 'lg:flex' };
  }
  return { block: 'hidden md:block', flex: 'hidden md:flex', railFlex: 'md:flex' };
}

const SidebarSideContext = React.createContext<'left' | 'right'>('left');

/* -------------------------------------------------------------------------------------------------
 * SidebarProvider
 * -----------------------------------------------------------------------------------------------*/
export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Whether sidebar open state persists to localStorage and cookies (ignored when embedded). Defaults to true. */
  persist?: boolean;
  /** Storage key and cookie name used when persist is enabled. Defaults to SIDEBAR_COOKIE_NAME. */
  storageKey?: string;
  /** Viewport pixel breakpoint below which sidebars switch to mobileBehavior. Defaults to 768. */
  mobileBreakpoint?: number;
  /**
   * Controls how the sidebar behaves below `mobileBreakpoint` (works independently of `embedded`):
   * - `'drawer'` (default): collapses into a Base UI slide-over Drawer on mobile and hides inline chrome.
   * - `'hidden'`: hides the sidebar below `mobileBreakpoint` without rendering a mobile Drawer.
   * - `'inline'`: keeps the sidebar rendered inline inside its container at all viewport widths (for contained previews).
   */
  mobileBehavior?: SidebarMobileBehavior;
  /**
   * Confines desktop sidebar height and positioning (`h-full` / `absolute`) to its parent container
   * instead of full-viewport `h-svh` / `fixed` (for example, below a top `<Header>`).
   * Mobile responsiveness is governed separately by `mobileBehavior`.
   */
  embedded?: boolean;
}

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      persist = true,
      storageKey = SIDEBAR_COOKIE_NAME,
      mobileBreakpoint = 768,
      mobileBehavior = 'drawer',
      embedded = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile(mobileBreakpoint);
    const [openMobile, setOpenMobile] = React.useState(false);
    const isEmbedded = embedded;
    const shouldPersist = persist && !isEmbedded;

    // Uncontrolled state initialized deterministically for SSR, then synced with localStorage on mount
    const [_open, _setOpen] = React.useState<boolean>(defaultOpen);

    React.useEffect(() => {
      if (openProp !== undefined || !shouldPersist) return;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          _setOpen(stored === 'true');
        }
      } catch {
        // ignore storage errors
      }
    }, [openProp, shouldPersist, storageKey]);

    const open = openProp ?? _open;
    const isUncontrolled = openProp === undefined;
    const openRef = React.useRef(open);
    useIsomorphicLayoutEffect(() => {
      openRef.current = open;
    }, [open]);

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const nextOpen = typeof value === 'function' ? value(openRef.current) : value;
        if (isUncontrolled) {
          openRef.current = nextOpen;
        }
        if (setOpenProp) {
          setOpenProp(nextOpen);
        } else {
          _setOpen(nextOpen);
        }

        if (shouldPersist) {
          try {
            localStorage.setItem(storageKey, String(nextOpen));
            document.cookie = `${storageKey}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
          } catch {
            // ignore
          }
        }
      },
      [isUncontrolled, setOpenProp, shouldPersist, storageKey]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile && mobileBehavior === 'drawer'
        ? setOpenMobile((prev) => !prev)
        : setOpen((prev) => !prev);
    }, [isMobile, mobileBehavior, setOpen, setOpenMobile]);

    React.useEffect(() => {
      if (isEmbedded) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.defaultPrevented ||
          event.altKey ||
          event.shiftKey ||
          !(event.metaKey || event.ctrlKey) ||
          event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT
        ) {
          return;
        }
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.isContentEditable ||
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT')
        ) {
          return;
        }
        event.preventDefault();
        toggleSidebar();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar, isEmbedded]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        mobileBreakpoint,
        mobileBehavior,
        isEmbedded,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        mobileBreakpoint,
        mobileBehavior,
        isEmbedded,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      ]
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
  /** When true on an embedded sidebar, overlays workspace content without reserving `sidebar-gap` width. */
  overlay?: boolean;
  /** Overrides `SidebarProvider`'s `mobileBehavior` for this sidebar (`'drawer' | 'hidden' | 'inline'`). */
  mobileBehavior?: SidebarMobileBehavior;
}

export const SidebarComponent = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      embedded,
      overlay = false,
      mobileBehavior,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {
      isMobile,
      mobileBreakpoint,
      mobileBehavior: contextMobileBehavior,
      state,
      openMobile,
      setOpenMobile,
      isEmbedded: contextEmbedded,
    } = useSidebar();
    const isEmbedded =
      embedded ??
      contextEmbedded ??
      (className?.includes('h-full') ||
        className?.includes('relative') ||
        className?.includes('absolute') ||
        false);
    const effectiveMobileBehavior = mobileBehavior ?? contextMobileBehavior;
    const { block: desktopVisibleClass, flex: desktopFlexClass } =
      getDesktopBreakpointClasses(mobileBreakpoint);
    const direction = useDirection();
    const isRtl = direction === 'rtl';
    const physicalSide = isRtl ? (side === 'left' ? 'right' : 'left') : side;

    if (collapsible === 'none') {
      return (
        <aside
          ref={ref}
          data-slot="sidebar"
          data-sidebar="sidebar"
          className={cn(
            'flex w-[var(--sidebar-width)] flex-col bg-surface border-e border-outline-variant text-on-surface',
            isEmbedded ? 'h-full' : 'h-svh',
            side === 'right' && 'border-e-0 border-s',
            className
          )}
          {...props}
        >
          <SidebarSideContext.Provider value={side}>{children}</SidebarSideContext.Provider>
        </aside>
      );
    }

    if (isMobile && effectiveMobileBehavior === 'drawer') {
      return (
        <BaseDrawer.Root
          open={openMobile}
          onOpenChange={setOpenMobile}
          swipeDirection={physicalSide === 'right' ? 'right' : 'left'}
        >
          <BaseDrawer.Portal>
            <BaseDrawer.Backdrop
              data-slot="sidebar-backdrop"
              className="fixed inset-0 bg-on-surface/40 z-50 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-[var(--duration-medium)] data-[ending-style]:duration-[var(--duration-fast)] data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none"
            />
            <BaseDrawer.Viewport
              data-slot="sidebar-viewport"
              className={cn(
                'fixed inset-y-0 z-50 flex max-w-full',
                side === 'right' ? 'end-0 justify-end' : 'start-0 justify-start'
              )}
            >
              <BaseDrawer.Popup
                data-slot="sidebar-popup"
                className={composeClassName(
                  [
                    'w-[var(--sidebar-width-mobile)] max-w-[85vw] h-full rounded-none bg-surface shadow-modal flex flex-col justify-between overflow-y-auto outline-none [transform:translateX(var(--drawer-swipe-movement-x,0px))] data-[swiping]:select-none data-[swiping]:duration-0 will-change-transform transition-transform duration-[var(--duration-medium)] data-[ending-style]:duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
                    side === 'right' ? 'border-s-2 border-outline-variant' : 'border-e-2 border-outline-variant',
                    physicalSide === 'right'
                      ? 'data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full'
                      : 'data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
                  ],
                  className
                )}
              >
                <BaseDrawer.Content className="h-full flex flex-col justify-between">
                  <BaseDrawer.Title className="sr-only">Sidebar Navigation</BaseDrawer.Title>
                  <BaseDrawer.Description className="sr-only">
                    Application navigation sidebar
                  </BaseDrawer.Description>
                  <div
                    ref={ref}
                    data-slot="sidebar"
                    data-sidebar="sidebar"
                    data-mobile="true"
                    className="flex size-full flex-col bg-surface"
                    {...props}
                  >
                    <SidebarSideContext.Provider value={side}>{children}</SidebarSideContext.Provider>
                  </div>
                </BaseDrawer.Content>
              </BaseDrawer.Popup>
            </BaseDrawer.Viewport>
          </BaseDrawer.Portal>
        </BaseDrawer.Root>
      );
    }

    const containerVisibilityClass =
      effectiveMobileBehavior === 'inline' ? 'block' : desktopVisibleClass;
    const asideVisibilityClass =
      effectiveMobileBehavior === 'inline' ? 'flex' : desktopFlexClass;

    return (
      <div
        ref={ref}
        data-slot="sidebar-container"
        className={cn(
          'group peer text-on-surface select-none',
          isEmbedded && 'relative h-full shrink-0',
          containerVisibilityClass
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
            overlay && 'w-0',
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]'
              : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]'
          )}
        />
        {/* Aside element */}
        <aside
          data-slot="sidebar"
          data-sidebar="sidebar"
          className={cn(
            'duration-[var(--duration-slow)] transition-[inset-inline-start,inset-inline-end,width] ease-[var(--ease-standard)] motion-reduce:transition-none',
            side === 'left'
              ? 'start-0 group-data-[collapsible=offcanvas]:-start-[var(--sidebar-width)]'
              : 'end-0 group-data-[collapsible=offcanvas]:-end-[var(--sidebar-width)]',
            variant === 'floating' || variant === 'inset'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]'
              : cn(
                  'bg-surface group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
                  side === 'left'
                    ? 'border-e border-outline-variant'
                    : 'border-s border-outline-variant'
                ),
            className,
            // Positioning placed after className so that isEmbedded absolute overrides any relative/static in className
            isEmbedded
              ? cn(
                  'absolute inset-y-0 h-full w-[var(--sidebar-width)] max-w-full flex-col',
                  overlay ? 'z-30 shadow-modal' : 'z-20',
                  asideVisibilityClass
                )
              : cn('fixed inset-y-0 z-20 flex-col h-svh w-[var(--sidebar-width)]', asideVisibilityClass)
          )}
          {...props}
        >
          <div
            data-slot="sidebar-inner"
            data-sidebar="sidebar"
            className={cn(
              'flex size-full flex-col bg-surface',
              variant === 'floating' && 'rounded-lg border border-outline-variant shadow-ambient',
              variant === 'inset' && 'rounded-lg border border-outline-variant'
            )}
          >
            <SidebarSideContext.Provider value={side}>{children}</SidebarSideContext.Provider>
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
    const { toggleSidebar, state, isMobile, mobileBehavior, openMobile } = useSidebar();
    const isOpen = isMobile && mobileBehavior === 'drawer' ? openMobile : state === 'expanded';
    const shortcutLabel =
      typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)
        ? '⌘B'
        : 'Ctrl+B';

    return (
      <Tooltip content={`Toggle Sidebar (${shortcutLabel})`}>
        <Button
          ref={ref}
          data-slot="sidebar-trigger"
          data-sidebar="trigger"
          variant="text"
          size="icon"
          aria-label="Toggle Sidebar"
          aria-expanded={props['aria-expanded'] ?? isOpen}
          aria-keyshortcuts="Control+B Meta+B"
          className={composeClassName(
            'size-11 min-h-[44px] min-w-[44px] rounded text-on-surface-variant hover:bg-state-hover hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
            className
          )}
          onClick={(event) => {
            onClick?.(event);
            toggleSidebar();
          }}
          {...props}
        >
          {children ?? icon ?? <Icon name={isOpen ? 'menu_open' : 'menu'} size="md" directional={isOpen} />}
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
  React.ComponentPropsWithoutRef<typeof BaseButton>
>(({ className, render, nativeButton, ...props }, ref) => {
  const { toggleSidebar, mobileBreakpoint } = useSidebar();
  const { railFlex: desktopFlexClass } = getDesktopBreakpointClasses(mobileBreakpoint);

  return (
    <BaseButton
      ref={ref}
      data-slot="sidebar-rail"
      data-sidebar="rail"
      aria-hidden="true"
      tabIndex={-1}
      onClick={toggleSidebar}
      render={render}
      nativeButton={resolveNativeButton(render, nativeButton)}
      className={composeClassName(
        [
          'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 rtl:translate-x-1/2 transition-[background-color,transform,inset-inline-start,inset-inline-end] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-outline group-data-[side=left]:-end-4 group-data-[side=right]:start-0 cursor-ew-resize',
          desktopFlexClass,
          '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
          '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
          'hover:group-data-[collapsible=offcanvas]:bg-surface group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full',
          '[[data-side=left][data-collapsible=offcanvas]_&]:-end-2',
          '[[data-side=right][data-collapsible=offcanvas]_&]:-start-2',
        ],
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

/* -------------------------------------------------------------------------------------------------
 * SidebarInset
 * -----------------------------------------------------------------------------------------------*/
export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {
  embedded?: boolean;
  /** Polymorphic Base UI render prop (defaults to `<main>`). */
  render?: useRender.RenderProp;
}

export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, embedded, render, ...props }, ref) => {
    const context = React.useContext(SidebarContext);
    const isEmbedded = embedded ?? context?.isEmbedded ?? className?.includes('h-full') ?? false;

    return useRender({
      render,
      ref,
      defaultTagName: 'main',
      props: {
        'data-slot': 'sidebar-inset',
        className: cn(
          'relative flex flex-1 flex-col bg-background',
          isEmbedded ? 'min-h-0 h-full' : 'min-h-svh',
          !isEmbedded && 'peer-data-[variant=inset]:min-h-[calc(100svh-1rem)]',
          'md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ms-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-outline-variant',
          className
        ),
        ...props,
      },
    });
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
      className={composeClassName(
        'h-11 min-h-11 w-full bg-surface border-outline shadow-none focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
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
        'flex flex-col gap-2 px-2 py-1.5 short:py-1 shrink-0 border-b border-outline-variant bg-surface group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:items-center',
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
      className={composeClassName('mx-2 w-auto bg-outline-variant/60', className)}
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
>(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea
      ref={ref}
      data-slot="sidebar-content"
      data-sidebar="content"
      className="min-h-0 flex-1"
      viewportClassName="overscroll-contain"
      contentClassName={cn(
        'flex flex-col gap-2',
        'group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    >
      {children}
    </ScrollArea>
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
        'relative flex w-full min-w-0 flex-col p-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:items-center',
        className
      )}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, render, ...props }, ref) => {
    const classes = cn(
      'duration-[var(--duration-fast)] flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-semibold font-label text-on-surface-variant select-none outline-none transition-[margin,opacity] ease-[var(--ease-standard)] motion-reduce:transition-none',
      '[&>svg]:size-4 [&>svg]:shrink-0 [&>.material-symbols-outlined]:text-base [&>.material-symbols-outlined]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none',
      className
    );

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'sidebar-group-label',
        'data-sidebar': 'group-label',
        className: classes,
        ...props,
      },
    });
  }
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export interface SidebarGroupActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  render?: useRender.RenderProp;
}

export const SidebarGroupAction = React.forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
  ({ className, render, type, ...props }, ref) => {
    const isNativeButton = resolveNativeButton(render);
    const resolvedType = type ?? (isNativeButton !== false ? ('button' as const) : undefined);
    const classes = cn(
      'absolute end-3 top-2.5 flex size-7 items-center justify-center rounded p-0 text-on-surface-variant outline-none transition-transform motion-reduce:transition-none hover:bg-state-hover hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary after:absolute after:-inset-2 after:content-[\'\']',
      'group-data-[collapsible=icon]:hidden',
      className
    );

    return useRender({
      render,
      ref,
      defaultTagName: 'button',
      props: {
        ...(resolvedType !== undefined ? { type: resolvedType } : {}),
        'data-slot': 'sidebar-group-action',
        'data-sidebar': 'group-action',
        className: classes,
        ...props,
      },
    });
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
    sm: 'h-9 min-h-[36px] text-xs gap-2 px-2.5 after:absolute after:inset-x-0 after:-inset-y-1 after:content-[\'\']',
    lg: 'h-12 min-h-[48px] text-base gap-3 px-3.5',
  }[size];

  const variantClasses = {
    default:
      'text-on-surface-variant hover:bg-state-hover hover:text-on-surface font-medium data-[active=true]:bg-primary-container data-[active=true]:text-on-primary-container data-[active=true]:font-semibold data-[active=true]:hover:bg-primary-container data-[active=true]:hover:brightness-95',
    outline:
      'bg-surface border border-outline-variant hover:bg-state-hover hover:text-on-surface text-on-surface-variant font-medium data-[active=true]:border-primary data-[active=true]:bg-primary-container data-[active=true]:text-on-primary-container data-[active=true]:font-semibold data-[active=true]:hover:bg-primary-container data-[active=true]:hover:brightness-95',
  }[variant];

  return cn(
    'peer/menu-button relative flex w-full items-center rounded font-label transition-[background-color,color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none outline-none select-none cursor-pointer',
    // Focus indicator: Floating 2px outer outline (WCAG 2.2 SC 2.4.7)
    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    // Leading icon tokens: Inactive uses on-surface-variant; Active lights up in Electric Blue (primary)
    '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:transition-colors [&>svg]:motion-reduce:transition-none [&>.material-symbols-outlined]:text-xl [&>.material-symbols-outlined]:shrink-0 [&>.material-symbols-outlined]:transition-colors [&>.material-symbols-outlined]:motion-reduce:transition-none',
    'data-[active=true]:[&>svg]:text-primary data-[active=true]:[&>.material-symbols-outlined]:text-primary hover:[&>svg]:text-on-surface hover:[&>.material-symbols-outlined]:text-on-surface',
    sizeClasses,
    'group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:min-h-[44px] group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center',
    '[&>span:not(.material-symbols-outlined):last-child]:truncate [&>span:not(.material-symbols-outlined)]:group-data-[collapsible=icon]:hidden',
    'has-[+[data-slot=sidebar-menu-badge]]:pe-9 group-data-[collapsible=icon]:has-[+[data-slot=sidebar-menu-badge]]:pe-0',
    variantClasses,
    className
  );
}

export interface SidebarMenuButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'size' | 'className'> {
  isActive?: boolean;
  tooltip?: string | (Omit<Partial<TooltipProps>, 'children'> & { children?: React.ReactNode });
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: SidebarButtonClassName;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      render,
      nativeButton,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state } = useSidebar();
    const sidebarSide = React.useContext(SidebarSideContext);

    const baseVariantClasses = sidebarMenuButtonVariants({
      variant,
      size,
    });

    const {
      ['aria-current']: ariaCurrent,
      ...restProps
    } = props;

    const buttonElement = (
      <BaseButton
        ref={ref}
        data-slot="sidebar-menu-button"
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        aria-current={ariaCurrent ?? (isActive ? 'page' : undefined)}
        render={render}
        nativeButton={resolveNativeButton(render, nativeButton)}
        className={composeClassName(baseVariantClasses, className)}
        {...restProps}
      >
        {children}
      </BaseButton>
    );

    // Keep Tooltip mounted whenever `tooltip` is provided and disable it when expanded or on mobile
    // so collapsing/expanding never unmounts the underlying button or drops focus.
    if (!tooltip) {
      return buttonElement;
    }

    const tooltipConfig = typeof tooltip === 'string' ? { children: tooltip } : tooltip;

    return (
      <Tooltip
        side={sidebarSide === 'right' ? 'inline-start' : 'inline-end'}
        align="center"
        sideOffset={12}
        content={tooltipConfig.children}
        {...tooltipConfig}
        disabled={tooltipConfig.disabled || isMobile || state !== 'collapsed'}
      >
        {buttonElement}
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export interface SidebarMenuActionProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  showOnHover?: boolean;
}

export const SidebarMenuAction = React.forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
  ({ className, showOnHover = false, render, nativeButton, children, ...props }, ref) => {
    const baseClasses = cn(
      'absolute end-1 top-2 flex aspect-square w-7 items-center justify-center rounded p-0 text-on-surface-variant outline-none transition-transform motion-reduce:transition-none hover:bg-state-hover hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary',
      'after:absolute after:-inset-2 after:content-[\'\']',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2',
      'group-data-[collapsible=icon]:hidden',
      showOnHover &&
        'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[popup-open]:opacity-100 md:opacity-0 transition-opacity motion-reduce:transition-none'
    );

    return (
      <BaseButton
        ref={ref}
        data-slot="sidebar-menu-action"
        data-sidebar="menu-action"
        render={render}
        nativeButton={resolveNativeButton(render, nativeButton)}
        className={composeClassName(baseClasses, className)}
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
        'pointer-events-none absolute end-2 flex h-5 min-w-5 select-none items-center justify-center rounded-full px-1.5 text-xs font-semibold font-mono tabular-nums bg-surface-container-high text-on-surface peer-hover/menu-button:text-on-surface peer-data-[active=true]/menu-button:bg-primary peer-data-[active=true]/menu-button:text-on-primary',
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
  const seedId = React.useId();
  const width = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seedId.length; i++) {
      hash = (hash * 31 + seedId.charCodeAt(i)) >>> 0;
    }
    return `${50 + (hash % 40)}%`;
  }, [seedId]);

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
        className="h-4 flex-1 max-w-[var(--skeleton-width)]"
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
        'mx-3.5 my-0 flex min-w-0 translate-x-px rtl:-translate-x-px flex-col gap-1 border-s border-outline-variant px-2.5 py-0.5 group-data-[collapsible=icon]:hidden list-none',
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
>(({ className, ...props }, ref) => (
  <li ref={ref} data-slot="sidebar-menu-sub-item" className={cn('list-none', className)} {...props} />
));
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export interface SidebarMenuSubButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'size' | 'className'> {
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
      size = 'md',
      isActive = false,
      className,
      render,
      nativeButton,
      children,
      ...props
    },
    ref
  ) => {
    const {
      ['aria-current']: ariaCurrent,
      ...restProps
    } = props;

    const sizeClasses = {
      sm: 'h-8 min-h-[32px] text-xs px-2 after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[\'\']',
      md: 'h-9 min-h-[36px] text-sm px-2.5 after:absolute after:inset-x-0 after:-inset-y-1 after:content-[\'\']',
    }[size];

    const baseClasses = cn(
      'relative flex w-full min-w-0 items-center gap-2 rounded font-label text-start outline-none transition-[background-color,color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none select-none cursor-pointer',
      'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
      '[&>span:last-child]:truncate',
      isActive
        ? 'bg-primary-container text-on-primary-container font-semibold'
        : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface font-medium',
      sizeClasses
    );

    return (
      <BaseButton
        ref={ref}
        data-slot="sidebar-menu-sub-button"
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        aria-current={ariaCurrent ?? (isActive ? 'page' : undefined)}
        render={render}
        nativeButton={resolveNativeButton(render, nativeButton)}
        className={composeClassName(baseClasses, className)}
        {...restProps}
      >
        {children}
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
