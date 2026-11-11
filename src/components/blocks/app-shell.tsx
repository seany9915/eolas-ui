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
import { Sidebar } from '@/components/ui/sidebar';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

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
  className?: string;
}

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
      className,
      ...props
    },
    ref
  ) => {
    const [internalActiveId, setInternalActiveId] = React.useState<string>(
      destinations[0]?.id || ''
    );
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const assignRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const getWindowBreakpoint = React.useCallback((): 'mobile' | 'tablet' | 'desktop' => {
      if (typeof window === 'undefined') return 'desktop';
      if (window.innerWidth < 640) return 'mobile';
      if (window.innerWidth < 1024) return 'tablet';
      return 'desktop';
    }, []);

    const [sizeClass, setSizeClass] = React.useState<'mobile' | 'tablet' | 'desktop'>(
      embedded ? 'desktop' : getWindowBreakpoint
    );

    React.useEffect(() => {
      if (embedded) {
        const node = rootRef.current;
        if (!node) return;
        const updateFromWidth = (width: number) => {
          setSizeClass(width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');
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
      }

      const handleResize = () => setSizeClass(getWindowBreakpoint());
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [embedded, getWindowBreakpoint]);

    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(() =>
      defaultOpen !== undefined ? defaultOpen : sizeClass === 'desktop'
    );

    React.useEffect(() => {
      if (defaultOpen === undefined) {
        setSidebarOpen(sizeClass === 'desktop');
      }
    }, [defaultOpen, sizeClass]);

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
      onDestinationChange?.(id);
    };

    const hasCustomSidebarDrawer = Boolean(
      showSidebarTriggerOnMobile || sidebarContent || sidebarFooter
    );
    const showSidebar =
      collapsible === 'none' && sizeClass === 'mobile' && destinations.length > 0
        ? false
        : !embedded || sizeClass !== 'mobile' || hasCustomSidebarDrawer;
    const effectiveCollapsible =
      embedded && sizeClass === 'mobile' && collapsible === 'icon' ? 'offcanvas' : collapsible;
    const showMobileBar = destinations.length > 0 && (!embedded || sizeClass === 'mobile');
    const shouldShowMobileTrigger =
      showSidebarTriggerOnMobile ??
      Boolean(sidebarContent || sidebarFooter || destinations.length === 0);

    return (
      <Sidebar.Provider
        ref={assignRefs}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        mobileBreakpoint={640}
        embedded={embedded}
        className={cn(
          embedded ? 'relative overflow-hidden h-full min-h-0' : 'w-full min-h-screen',
          className
        )}
        {...props}
      >
        {!embedded && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:items-center focus:min-h-11 focus:px-4 focus:rounded focus:bg-primary focus:text-on-primary focus:font-label focus:text-sm focus:font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            Skip to content
          </a>
        )}

        {/* Desktop & Tablet Collapsible Navigation Sidebar */}
        {showSidebar && (
          <Sidebar collapsible={effectiveCollapsible} embedded={embedded}>
            {sidebarHeader && (
              <Sidebar.Header className="min-h-16 h-16 short:min-h-14 short:h-14 justify-center">
                {sidebarHeader}
              </Sidebar.Header>
            )}
            <Sidebar.Content>
              {sidebarContent ? (
                sidebarContent
              ) : (
                <Sidebar.Group>
                  <Sidebar.GroupContent>
                    <Sidebar.Menu>
                      {destinations.map((dest) => {
                        const isActive = activeId === dest.id;
                        return (
                          <Sidebar.MenuItem key={dest.id}>
                            <Sidebar.MenuButton
                              isActive={isActive}
                              onClick={() => handleSelectDestination(dest.id)}
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
              )}
            </Sidebar.Content>
            {sidebarFooter && <Sidebar.Footer>{sidebarFooter}</Sidebar.Footer>}
            <Sidebar.Rail />
          </Sidebar>
        )}

        {/* Main Content Area Inset */}
        <Sidebar.Inset render={<div />} embedded={embedded} className="flex flex-col flex-1 min-w-0">
          {/* Top App Bar */}
          <header
            data-slot="app-shell-header"
            className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 min-h-16 h-16 short:min-h-14 short:h-14 bg-surface border-b border-outline-variant transition-colors duration-quick ease-standard motion-reduce:transition-none shrink-0"
          >
            <div
              className={cn(
                'flex items-center gap-2 min-w-0',
                topBarNav && 'shrink-0 max-w-44 sm:max-w-72'
              )}
            >
              {showSidebar && collapsible !== 'none' && (
                <div className={cn(!shouldShowMobileTrigger && 'hidden sm:block short:block')}>
                  <Sidebar.Trigger />
                </div>
              )}
              {title && (
                <span className="font-heading text-base font-semibold text-on-surface truncate">
                  {title}
                </span>
              )}
            </div>

            {topBarNav && (
              <div
                data-slot="app-shell-top-nav"
                className={cn(
                  'items-stretch h-full min-w-0 flex-1',
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
                className="flex items-center gap-2 shrink-0 h-full"
              >
                {topBarActions}
              </div>
            )}
          </header>

          {/* Main Workspace Body */}
          <main
            id="main-content"
            data-slot="app-shell-main"
            className={cn(
              '@container flex-1 flex flex-col min-h-0 overflow-y-auto p-4 @md:p-6',
              // Safe bottom padding on mobile over the fixed navigation bar
              destinations.length > 0 && (embedded ? 'pb-4' : 'pb-28 sm:pb-6 short:pb-6')
            )}
          >
            {children}
          </main>

          {/* Mobile Bottom Navigation Bar (Hidden on >=640px and on compact height) */}
          {showMobileBar && (
            <div className={cn('short:hidden', !embedded && 'block sm:hidden')}>
              <NavigationBar
                value={activeId}
                onValueChange={handleSelectDestination}
                fixed={!embedded}
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
