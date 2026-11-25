import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { Icon } from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { RegistrySidebar } from './RegistrySidebar';
import { RegistryCanvas } from './RegistryCanvas';
import { CatalogOverview } from './CatalogOverview';
import { REGISTRY_MAP } from './registry-manifest';
import { REGISTRY_DEMOS } from './demos';
import { ComponentCategory, ComponentTier, ViewportMode } from './types';

export interface ComponentRegistryProps {
  className?: string;
  initialComponentId?: string | null;
}

export const ComponentRegistry: React.FC<ComponentRegistryProps> = ({
  className,
  initialComponentId,
}) => {
  // Parse initial selected ID from hash or prop
  const getHashComponentId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('components/')) {
      const id = hash.replace(/^components\//, '').trim();
      return REGISTRY_MAP[id] ? id : null;
    }
    return null;
  };

  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialComponentId || getHashComponentId() || null
  );

  const [viewport, setViewport] = React.useState<ViewportMode>('full');
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<ComponentCategory | 'all'>('all');
  const [tierFilter, setTierFilter] = React.useState<ComponentTier | 'all'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Sync hash changes from browser back/forward (ignore #main-content skip link)
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#main-content') return;
      const hashId = getHashComponentId();
      if (hashId !== selectedId) {
        setSelectedId(hashId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedId]);

  const selectedEntry = selectedId ? REGISTRY_MAP[selectedId] : null;
  const DemoComponent = selectedId ? REGISTRY_DEMOS[selectedId] : undefined;

  React.useEffect(() => {
    document.title = selectedEntry
      ? `${selectedEntry.title} — Eolas Components`
      : 'Components — Eolas Design System';
  }, [selectedEntry]);

  // Handle selection and update URL hash
  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    if (id) {
      window.location.hash = `components/${id}`;
    } else {
      window.location.hash = 'components';
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 });
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  return (
    <SidebarProvider
      embedded
      className={cn('w-full flex-1 flex flex-col lg:flex-row min-h-[calc(100dvh-4.5rem)] relative', className)}
      style={{ '--sidebar-width': '18.5rem', '--sidebar-width-mobile': '20rem' } as React.CSSProperties}
    >
      {/* Mobile Topbar for Sidebar Toggle (< lg screens) */}
      <div className="lg:hidden w-full flex items-center justify-between gap-2 px-4 py-2.5 border-b border-outline-variant bg-surface sticky top-18 z-30">
        <Button
          size="sm"
          variant="outline"
          colorRole="neutral"
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-xs font-medium"
        >
          <Icon name={isSidebarOpen ? 'close' : 'menu'} size="xs" />
          {isSidebarOpen ? 'Close Menu' : 'Browse Components'}
        </Button>
        {selectedEntry ? (
          <span className="font-heading text-xs font-bold text-on-surface truncate max-w-[200px]">
            {selectedEntry.title}
          </span>
        ) : (
          <span className="font-heading text-xs font-bold text-on-surface truncate">
            Component Catalog
          </span>
        )}
      </div>

      {/* Mobile Drawer Sidebar (< lg) */}
      <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen} swipeDirection="left">
        <Drawer.Panel className="p-0 w-80 max-w-full lg:hidden" showHandle={false}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant bg-surface shrink-0">
            <Drawer.Title className="font-heading text-base font-bold text-on-surface">
              Browse Components
            </Drawer.Title>
            <Drawer.Close
              render={
                <Button
                  size="icon"
                  variant="text"
                  colorRole="neutral"
                  aria-label="Close component menu"
                />
              }
            >
              <Icon name="close" size="sm" />
            </Drawer.Close>
          </div>
          <Drawer.Description className="sr-only">
            Filter and select a component from the Eolas UI registry.
          </Drawer.Description>
          <RegistrySidebar
            selectedId={selectedId}
            onSelect={handleSelect}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            tierFilter={tierFilter}
            onTierFilterChange={setTierFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            className="flex flex-1 min-h-0"
          />
        </Drawer.Panel>
      </Drawer>

      {/* Desktop Sticky Sidebar (lg+) */}
      <RegistrySidebar
        selectedId={selectedId}
        onSelect={handleSelect}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        tierFilter={tierFilter}
        onTierFilterChange={setTierFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        className="hidden lg:flex"
      />

      {/* Main Sandbox Canvas or Catalog Overview (div avoids nested <main> inside App's <main>) */}
      <SidebarInset render={<div />} className="flex-1 min-w-0 min-h-0 bg-background flex flex-col overflow-hidden">
        <ScrollArea
          className="flex-1 min-h-0"
          contentClassName="p-4 sm:p-8 lg:p-10 xl:p-12 w-full max-w-[1600px] mx-auto"
        >
          {selectedEntry ? (
            <RegistryCanvas
              entry={selectedEntry}
              viewport={viewport}
              onViewportChange={setViewport}
              direction={direction}
              onDirectionToggle={toggleDirection}
              demoComponent={DemoComponent}
              onBackToCatalog={() => handleSelect(null)}
            />
          ) : (
            <CatalogOverview
              onSelect={handleSelect}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              tierFilter={tierFilter}
              onTierFilterChange={setTierFilter}
            />
          )}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default ComponentRegistry;
