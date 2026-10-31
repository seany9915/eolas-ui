import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
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

  // Sync hash changes from browser back/forward
  React.useEffect(() => {
    const handleHashChange = () => {
      const hashId = getHashComponentId();
      if (hashId !== selectedId) {
        setSelectedId(hashId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedId]);

  // Handle selection and update URL hash
  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    if (id) {
      window.location.hash = `components/${id}`;
    } else {
      window.location.hash = 'components';
    }
    // On mobile screens, close sidebar when a component is picked
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  const selectedEntry = selectedId ? REGISTRY_MAP[selectedId] : null;
  const DemoComponent = selectedId ? REGISTRY_DEMOS[selectedId] : undefined;

  return (
    <SidebarProvider
      embedded
      className={cn('w-full flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-4.5rem)] relative', className)}
      style={{ '--sidebar-width': '18.5rem', '--sidebar-width-mobile': '20rem' } as React.CSSProperties}
    >
      {/* Mobile Topbar for Sidebar Toggle (< lg screens) */}
      <div className="lg:hidden w-full flex items-center justify-between p-3.5 border-b border-outline-variant bg-surface sticky top-0 z-30">
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-xs h-8 font-medium"
        >
          <Icon name={isSidebarOpen ? 'close' : 'menu'} size="xs" className="mr-1.5" />
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

      {/* Canonical Sidebar Component - Docked to left edge */}
      <RegistrySidebar
        selectedId={selectedId}
        onSelect={handleSelect}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        tierFilter={tierFilter}
        onTierFilterChange={setTierFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        className={cn(!isSidebarOpen && 'hidden lg:flex')}
      />

      {/* Main Sandbox Canvas or Catalog Overview in SidebarInset */}
      <SidebarInset className="flex-1 min-w-0 bg-background flex flex-col overflow-y-auto">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 xl:p-12 w-full max-w-[1600px] mx-auto">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default ComponentRegistry;
