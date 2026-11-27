'use client';

/**
 * AppShell composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from primitives and design tokens:
 * - `Sidebar` compound primitives (`Sidebar.Provider`, `Sidebar.Header`, `Sidebar.Content`, `Sidebar.Footer`, `Sidebar.Trigger`, `Sidebar.Rail`, `Sidebar.Inset`, `Sidebar.Menu`, `Sidebar.MenuItem`, `Sidebar.MenuButton`, `Sidebar.MenuBadge`) (`src/components/ui/sidebar.tsx`)
 * - `NavigationBar`, `NavigationBar.Item` (`src/components/ui/navigation-bar.tsx`)
 * - `Icon` (`src/components/ui/icon.tsx`)
 *
 * TAXONOMY & USAGE:
 * - Coordinated application layout shell managing navigation across breakpoints and height classes.
 * - Morphing Navigation Pipeline:
 *   - Mobile (<640px): Thumb-accessible Bottom Navigation Bar + compact top bar.
 *   - Tablet / Foldable (640px–1023px): Automatic icon-rail sidebar (56px) preserving reading width; bottom bar hidden.
 *   - Desktop (1024px+): Full persistent sidebar (256px) with expandable groups and actions.
 *   - Compact Height (`short:` / `<480px`): Top bar compresses to 56px (h-14); bottom bar hides to preserve vertical canvas.
 * - Zero direct `<button>` tags outside primitives.
 */
import * as React from 'react';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button, UnstyledButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn, useMergedRefs } from '@/lib/utils';

export interface AppShellDestination {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
}

export interface AppShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Core navigation destinations for bottom bar and mobile transitions */
  destinations?: AppShellDestination[];
  activeDestinationId?: string;
  onDestinationChange?: (id: string) => void;
  /** Primary sidebar navigation slot (menus, groups, links) */
  sidebarContent?: React.ReactNode;
  /** Header slot inside the sidebar (logo, team switcher) */
  sidebarHeader?: React.ReactNode;
  /** Footer slot inside the sidebar (user profile, settings) */
  sidebarFooter?: React.ReactNode;
  /** Main top app bar title */
  title?: React.ReactNode;
  /** Optional inline navigation bar slot (e.g. NavigationMenu) aligned to the full top app bar height */
  topBarNav?: React.ReactNode;
  /** Main top app bar auxiliary actions (search, notifications, theme toggle) */
  topBarActions?: React.ReactNode;
  /** Main application workspace content */
  children: React.ReactNode;
  /** When true, displays the sidebar drawer trigger in the top bar on mobile. Defaults to true only when custom sidebar content is provided or destinations is empty. */
  showSidebarTriggerOnMobile?: boolean;
  /** Default sidebar collapse behavior on desktop. On tablet (640-1023px), defaults to collapsed icon rail. */
  defaultOpen?: boolean;
  /** Collapsible mode on desktop: 'icon' (rail), 'offcanvas' (closes completely), or 'none' */
  collapsible?: 'icon' | 'offcanvas' | 'none';
  /** When true, confines layout within parent container rather than taking full viewport screen */
  embedded?: boolean;
  /** When true, removes default main workspace padding (`p-4 @md:p-6`) for full-bleed child layouts such as `ListDetailBlock variant="flush"` or chat panes */
  flush?: boolean;
  /** Resets scroll position (and optionally moves focus to `<main>`) whenever the key changes across route transitions */
  scrollResetKey?: string | number;
  /** Moves keyboard focus to `<main>` (`preventScroll: true`) when `scrollResetKey` changes; defaults to `true` (set `false` when binding `scrollResetKey` to tabs, filters, or pagination) */
  focusMainOnReset?: boolean;
  /** Accessible label for the skip-to-content link. Defaults to 'Skip to content'. */
  skipToContentLabel?: string;
  /** Accessible label for the mobile bottom navigation landmark. */
  navigationBarLabel?: string;
  /** Accessible label for closing the embedded mobile sidebar overlay. Defaults to 'Close navigation'. */
  closeSidebarLabel?: string;
  className?: string;
}

type AppShellSizeClass = 'mobile' | 'tablet' | 'desktop';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function getViewportBreakpointSnapshot(): AppShellSizeClass {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 640) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
}

function subscribeViewportResize(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

interface AppShellDestinationMenuProps {
  destinations: AppShellDestination[];
  activeId: string;
  onSelect: (id: string) => void;
}

const AppShellDestinationMenu: React.FC<AppShellDestinationMenuProps> = ({
  destinations,
  activeId,
  onSelect,
}) => {
  const { isMobile, mobileBehavior, setOpenMobile } = useSidebar();

  return (
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {destinations.map((dest) => {
            const isActive = activeId === dest.id;
            return (
              <Sidebar.MenuItem key={dest.id}>
                <Sidebar.MenuButton
                  isActive={isActive}
                  onClick={() => {
                    onSelect(dest.id);
                    if (isMobile && mobileBehavior === 'drawer') {
                      setOpenMobile(false);
                    }
                  }}
                  tooltip={dest.label}
                >
                  <Icon name={dest.icon} size="md" />
                  <span>{dest.label}</span>
                </Sidebar.MenuButton>
                {dest.badge !== undefined && dest.badge !== null && (
                  <Sidebar.MenuBadge>{dest.badge}</Sidebar.MenuBadge>
                )}
              </Sidebar.MenuItem>
            );
          })}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      destinations = [],
      activeDestinationId,
      onDestinationChange,
      sidebarContent,
      sidebarHeader,
      sidebarFooter,
      title,
      topBarNav,
      topBarActions,
      children,
      showSidebarTriggerOnMobile,
      collapsible = 'icon',
      defaultOpen,
      embedded = false,
      flush = false,
      scrollResetKey,
      focusMainOnReset = true,
      skipToContentLabel = 'Skip to content',
      navigationBarLabel,
      closeSidebarLabel = 'Close navigation',
      className,
      ...props
    },
    ref
  ) => {
    const [internalActiveId, setInternalActiveId] = React.useState<string>(
      destinations[0]?.id || ''
    );
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const mainRef = React.useRef<HTMLElement | null>(null);
    const attachMainRef = React.useCallback((node: HTMLElement | null) => {
      mainRef.current = node;
    }, []);
    const prevScrollResetKeyRef = React.useRef(scrollResetKey);
    const sidebarTriggerRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
      if (Object.is(prevScrollResetKeyRef.current, scrollResetKey)) return;
      prevScrollResetKeyRef.current = scrollResetKey;
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
      if (!embedded && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (focusMainOnReset) {
        mainRef.current?.focus({ preventScroll: true });
      }
    }, [scrollResetKey, embedded, focusMainOnReset]);
    const focusRestoreRafRef = React.useRef<number | null>(null);

    const assignRefs = useMergedRefs(rootRef, ref);

    const viewportSizeClass = React.useSyncExternalStore(
      subscribeViewportResize,
      getViewportBreakpointSnapshot,
      () => 'desktop' as const
    );
    const [embeddedSizeClass, setEmbeddedSizeClass] = React.useState<AppShellSizeClass>('desktop');

    useIsomorphicLayoutEffect(() => {
      if (!embedded) return;
      const node = rootRef.current;
      if (!node) return;
      const updateFromWidth = (width: number) => {
        setEmbeddedSizeClass(width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');
      };
      updateFromWidth(node.getBoundingClientRect().width);
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateFromWidth(entry.contentRect.width);
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, [embedded]);

    const sizeClass = embedded ? embeddedSizeClass : viewportSizeClass;

    const [userSidebarOpen, setUserSidebarOpen] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
      if (defaultOpen === undefined) {
        setUserSidebarOpen(undefined);
      }
    }, [defaultOpen, sizeClass]);

    const sidebarOpen =
      userSidebarOpen ?? (defaultOpen !== undefined ? defaultOpen : sizeClass === 'desktop');

    const activeId =
      activeDestinationId !== undefined
        ? activeDestinationId
        : destinations.some((dest) => dest.id === internalActiveId)
        ? internalActiveId
        : destinations[0]?.id ?? '';

    const handleSelectDestination = (id: string) => {
      if (activeDestinationId === undefined) {
        setInternalActiveId(id);
      }
      if (embedded && sizeClass === 'mobile') {
        setUserSidebarOpen(false);
      }
      onDestinationChange?.(id);
    };

    const hasCustomSidebarDrawer = Boolean(
      showSidebarTriggerOnMobile || sidebarContent || sidebarFooter
    );
    const showSidebar =
      collapsible === 'none' && sizeClass === 'mobile' && destinations.length > 0
        ? false
        : !embedded || sizeClass !== 'mobile' || hasCustomSidebarDrawer;
    const isEmbeddedMobileOverlay = embedded && sizeClass === 'mobile' && showSidebar;
    const isOverlayActive = isEmbeddedMobileOverlay && sidebarOpen;
    const effectiveCollapsible =
      embedded && sizeClass === 'mobile' && collapsible === 'icon' ? 'offcanvas' : collapsible;
    const showMobileBar = destinations.length > 0 && (!embedded || sizeClass === 'mobile');
    const canOpenSidebarOnShortMobile = showSidebar && collapsible !== 'none';
    const shouldShowMobileTrigger =
      showSidebarTriggerOnMobile ??
      Boolean(sidebarContent || sidebarFooter || destinations.length === 0);
    const hasDockedSidebar =
      showSidebar &&
      sizeClass !== 'mobile' &&
      !(effectiveCollapsible === 'offcanvas' && !sidebarOpen);

    const closeEmbeddedOverlay = React.useCallback(() => {
      setUserSidebarOpen(false);
      if (focusRestoreRafRef.current !== null) {
        cancelAnimationFrame(focusRestoreRafRef.current);
      }
      focusRestoreRafRef.current = window.requestAnimationFrame(() => {
        focusRestoreRafRef.current = null;
        sidebarTriggerRef.current?.focus();
      });
    }, []);

    React.useEffect(() => {
      return () => {
        if (focusRestoreRafRef.current !== null) {
          cancelAnimationFrame(focusRestoreRafRef.current);
        }
      };
    }, []);

    React.useEffect(() => {
      if (!isOverlayActive) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          closeEmbeddedOverlay();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOverlayActive, closeEmbeddedOverlay]);

    return (
      <Sidebar.Provider
        ref={assignRefs}
        open={sidebarOpen}
        onOpenChange={setUserSidebarOpen}
        mobileBreakpoint={640}
        mobileBehavior={embedded ? 'inline' : 'drawer'}
        embedded={embedded}
        data-app-shell={!embedded ? 'viewport' : undefined}
        className={cn(
          embedded
            ? 'relative overflow-hidden h-full min-h-0'
            : 'w-full h-dvh min-h-0 overflow-hidden',
          className
        )}
        {...props}
      >
        {!embedded && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:inline-flex focus:items-center focus:min-h-11 focus:px-4 focus:rounded focus:bg-primary focus:text-on-primary focus:font-label focus:text-sm focus:font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            {skipToContentLabel}
          </a>
        )}

        {/* Dismissible backdrop for embedded mobile overlays */}
        {isOverlayActive && (
          <UnstyledButton
            type="button"
            tabIndex={-1}
            aria-label={closeSidebarLabel}
            onClick={closeEmbeddedOverlay}
            className="absolute inset-0 z-30 bg-on-surface/40 cursor-default"
          />
        )}

        {/* Desktop & Tablet Collapsible Navigation Sidebar */}
        {showSidebar && (
          <Sidebar
            collapsible={effectiveCollapsible}
            embedded={embedded}
            overlay={isEmbeddedMobileOverlay}
            seamless={hasDockedSidebar}
          >
            {(sidebarHeader || isEmbeddedMobileOverlay) && (
              <Sidebar.Header className="min-h-16 short:min-h-14 justify-center">
                <div className="flex items-center justify-between gap-2 w-full group-data-[collapsible=icon]:justify-center">
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:flex-none">{sidebarHeader}</div>
                  {isEmbeddedMobileOverlay && (
                    <Button
                      type="button"
                      variant="text"
                      size="icon"
                      colorRole="neutral"
                      aria-label={closeSidebarLabel}
                      onClick={closeEmbeddedOverlay}
                    >
                      <Icon name="close" size="sm" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </Sidebar.Header>
            )}
            <Sidebar.Content>
              {sidebarContent ? (
                sidebarContent
              ) : (
                <AppShellDestinationMenu
                  destinations={destinations}
                  activeId={activeId}
                  onSelect={handleSelectDestination}
                />
              )}
            </Sidebar.Content>
            {sidebarFooter && <Sidebar.Footer>{sidebarFooter}</Sidebar.Footer>}
            <Sidebar.Rail />
          </Sidebar>
        )}

        {/* Main Content Area Inset */}
        <Sidebar.Inset
          render={<div />}
          embedded={embedded}
          inert={isOverlayActive}
          className={cn(
            'flex flex-col flex-1 min-w-0',
            !embedded && 'h-full min-h-0'
          )}
        >
          {/* Top App Bar */}
          <header
            data-slot="app-shell-header"
            className={cn(
              'sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-0 min-h-16 short:min-h-14 bg-surface transition-colors duration-quick ease-standard motion-reduce:transition-none shrink-0',
              !hasDockedSidebar && 'border-b border-outline-variant'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2 min-w-0',
                topBarNav &&
                  (embedded
                    ? sizeClass === 'mobile'
                      ? 'shrink max-w-36'
                      : 'shrink max-w-72'
                    : 'shrink max-w-36 sm:max-w-72')
              )}
            >
              {showSidebar && collapsible !== 'none' && (
                <div
                  className={cn(
                    !shouldShowMobileTrigger &&
                      (embedded
                        ? sizeClass === 'mobile' && 'hidden short:block'
                        : 'hidden sm:block short:block')
                  )}
                >
                  <Sidebar.Trigger ref={sidebarTriggerRef} />
                </div>
              )}
              {title && (
                <div className="min-w-0 font-heading text-base font-semibold text-on-surface truncate">
                  {title}
                </div>
              )}
            </div>

            {topBarNav && (
              <div
                data-slot="app-shell-top-nav"
                className={cn(
                  'items-stretch self-stretch -mb-px min-w-0 flex-1',
                  embedded
                    ? destinations.length > 0 && sizeClass === 'mobile'
                      ? 'hidden'
                      : 'flex overflow-x-auto'
                    : destinations.length > 0
                    ? 'hidden sm:flex sm:overflow-x-auto'
                    : 'flex overflow-x-auto'
                )}
              >
                {topBarNav}
              </div>
            )}

            {topBarActions && (
              <div
                data-slot="app-shell-top-actions"
                className="flex items-center gap-2 shrink-0"
              >
                {topBarActions}
              </div>
            )}
          </header>

          {/* Main Workspace Body */}
          {(() => {
            const MainTag = embedded ? 'div' : 'main';
            return (
              <MainTag
                ref={attachMainRef}
                id={!embedded ? 'main-content' : undefined}
                tabIndex={
                  !embedded || (scrollResetKey !== undefined && focusMainOnReset)
                    ? -1
                    : undefined
                }
                data-slot="app-shell-main"
                className={cn(
                  '@container flex-1 flex flex-col min-h-0 overflow-y-auto overscroll-contain bg-background focus:outline-none',
                  hasDockedSidebar && 'rounded-ss-lg border-t border-s border-outline-variant',
                  !embedded &&
                    destinations.length > 0 &&
                    (flush
                      ? canOpenSidebarOnShortMobile
                        ? 'scroll-pb-24 sm:scroll-pb-0 short:scroll-pb-0'
                        : 'scroll-pb-24 sm:scroll-pb-0'
                      : canOpenSidebarOnShortMobile
                        ? 'scroll-pb-28 sm:scroll-pb-0 short:scroll-pb-0'
                        : 'scroll-pb-28 sm:scroll-pb-0')
                )}
              >
                <div
                  className={cn(
                    'flex-1 flex flex-col min-h-0',
                    flush ? 'p-0' : 'p-4 @md:p-6',
                    embedded
                      ? !flush && destinations.length > 0 && 'pb-4 @md:pb-6'
                      : destinations.length > 0 &&
                          (flush
                            ? canOpenSidebarOnShortMobile
                              ? 'pb-24 sm:pb-0 short:pb-0'
                              : 'pb-24 sm:pb-0'
                            : canOpenSidebarOnShortMobile
                              ? 'pb-28 sm:pb-4 @md:pb-6 short:pb-4 @md:short:pb-6'
                              : 'pb-28 sm:pb-4 @md:pb-6')
                  )}
                >
                  {children}
                </div>
              </MainTag>
            );
          })()}

          {/* Mobile Bottom Navigation Bar (Hidden on >=640px; hidden on compact height only when sidebar trigger can take over) */}
          {showMobileBar && (
            <div className={cn(canOpenSidebarOnShortMobile && 'short:hidden', !embedded && 'block sm:hidden')}>
              <NavigationBar
                value={activeId}
                onValueChange={handleSelectDestination}
                fixed={!embedded}
                aria-label={navigationBarLabel ?? (embedded ? 'Section navigation' : 'Primary navigation')}
              >
                {destinations.map((dest) => (
                  <NavigationBar.Item
                    key={dest.id}
                    value={dest.id}
                    icon={<Icon name={dest.icon} size="sm" />}
                    label={dest.label}
                    badge={dest.badge}
                  />
                ))}
              </NavigationBar>
            </div>
          )}
        </Sidebar.Inset>
      </Sidebar.Provider>
    );
  }
);
AppShell.displayName = 'AppShell';

export default AppShell;
