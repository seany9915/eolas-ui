import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

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
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  const selectedEntry = selectedId ? REGISTRY_MAP[selectedId] : null;
  const DemoComponent = selectedId ? REGISTRY_DEMOS[selectedId] : undefined;

  return (
    <div className={cn('flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full', className)}>
      {/* Mobile Sidebar Toggle Bar */}
      <div className="lg:hidden w-full flex items-center justify-between p-3 rounded-xl border border-outline-variant bg-surface shadow-xs">
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-xs"
        >
          <Icon name={isSidebarOpen ? 'menu_open' : 'menu'} size="xs" className="mr-1.5" />
          {isSidebarOpen ? 'Hide Component Menu' : 'Browse Components'}
        </Button>
        {selectedEntry && (
          <span className="font-heading text-xs font-bold text-on-surface truncate">
            {selectedEntry.title}
          </span>
        )}
      </div>

      {/* Registry Sidebar */}
      <div className={cn('w-full lg:w-72 xl:w-80 shrink-0', !isSidebarOpen && 'hidden lg:block')}>
        <RegistrySidebar
          selectedId={selectedId}
          onSelect={handleSelect}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          tierFilter={tierFilter}
          onTierFilterChange={setTierFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Sandbox Canvas or Catalog Overview */}
      <main className="flex-1 min-w-0 w-full">
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
          />
        )}
      </main>
    </div>
  );
};
