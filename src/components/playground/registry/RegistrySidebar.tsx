import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { REGISTRY_CATEGORIES } from './registry-categories';
import { REGISTRY_ENTRIES } from './registry-manifest';
import { ComponentCategory, ComponentTier, RegistryEntry } from './types';

export interface RegistrySidebarProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  activeCategory: ComponentCategory | 'all';
  onCategoryChange: (category: ComponentCategory | 'all') => void;
  tierFilter: ComponentTier | 'all';
  onTierFilterChange: (tier: ComponentTier | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export const RegistrySidebar: React.FC<RegistrySidebarProps> = ({
  selectedId,
  onSelect,
  activeCategory,
  onCategoryChange,
  tierFilter,
  onTierFilterChange,
  searchQuery,
  onSearchChange,
  className,
}) => {
  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    // Expand all by default
    const map: Record<string, boolean> = {};
    for (const cat of REGISTRY_CATEGORIES) {
      map[cat.id] = true;
    }
    return map;
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter entries based on search and tier
  const filteredEntries = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return REGISTRY_ENTRIES.filter((entry) => {
      // Tier filter
      if (tierFilter !== 'all') {
        if (tierFilter === 'primitive' && entry.tier !== 'primitive') return false;
        if (tierFilter === 'block' && entry.tier !== 'block') return false;
        if (tierFilter === 'utility' && entry.tier !== 'utility') return false;
      }

      // Category filter (if not 'all')
      if (activeCategory !== 'all' && entry.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.basePrimitive.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, tierFilter, activeCategory]);

  // Group filtered entries by category
  const entriesByCategory = React.useMemo(() => {
    const map: Record<ComponentCategory, RegistryEntry[]> = {
      'inputs': [],
      'overlays': [],
      'feedback': [],
      'navigation': [],
      'layout': [],
      'clinical-ai': [],
      'blocks': [],
      'motion': [],
      'system': [],
    };

    for (const entry of filteredEntries) {
      if (map[entry.category]) {
        map[entry.category].push(entry);
      }
    }

    return map;
  }, [filteredEntries]);

  // Counts for quick badges
  const totalCount = REGISTRY_ENTRIES.length;
  const primitiveCount = REGISTRY_ENTRIES.filter((e) => e.tier === 'primitive').length;
  const blockCount = REGISTRY_ENTRIES.filter((e) => e.tier === 'block').length;

  return (
    <aside
      aria-label="Component Registry Navigation"
      className={cn(
        'w-full bg-surface rounded-xl border border-outline-variant shadow-xs p-3 sm:p-4 flex flex-col gap-3',
        'lg:sticky lg:top-24 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto',
        className
      )}
    >
      {/* Sidebar Header & Search */}
      <div className="pb-3 border-b border-outline-variant/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-bold text-on-surface">Registry Components</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-semibold">
              {totalCount}
            </span>
          </div>
          <Button
            size="sm"
            variant={selectedId === null ? 'tonal' : 'ghost'}
            onClick={() => onSelect(null)}
            className="text-xs h-7 px-2.5 font-medium"
          >
            <Icon name="grid_view" size="xs" className="mr-1" />
            Overview
          </Button>
        </div>

        {/* Search Input */}
        <Input
          type="search"
          size="sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter components..."
          leadingIcon={<Icon name="search" size="xs" className="text-on-surface-variant" />}
          clearable={!!searchQuery}
          onClear={() => onSearchChange('')}
          className="w-full text-xs"
        />

        {/* Tier filter pill buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <Button
            size="sm"
            variant={tierFilter === 'all' ? 'filled' : 'outlined'}
            onClick={() => onTierFilterChange('all')}
            className={cn('text-xs h-6 px-2 shrink-0', tierFilter !== 'all' && 'border-outline-variant text-on-surface-variant')}
          >
            All ({totalCount})
          </Button>
          <Button
            size="sm"
            variant={tierFilter === 'primitive' ? 'filled' : 'outlined'}
            onClick={() => onTierFilterChange('primitive')}
            className={cn('text-xs h-6 px-2 shrink-0', tierFilter !== 'primitive' && 'border-outline-variant text-on-surface-variant')}
          >
            Primitives ({primitiveCount})
          </Button>
          <Button
            size="sm"
            variant={tierFilter === 'block' ? 'filled' : 'outlined'}
            onClick={() => onTierFilterChange('block')}
            className={cn('text-xs h-6 px-2 shrink-0', tierFilter !== 'block' && 'border-outline-variant text-on-surface-variant')}
          >
            Blocks ({blockCount})
          </Button>
        </div>
      </div>

      {/* Category List & Items */}
      <nav aria-label="Component categories" className="space-y-2">
        {REGISTRY_CATEGORIES.map((category) => {
          const categoryEntries = entriesByCategory[category.id] || [];
          if (categoryEntries.length === 0 && searchQuery) {
            // Hide empty category when searching
            return null;
          }

          const isExpanded = expandedCategories[category.id] !== false;

          return (
            <div key={category.id} className="border-b border-outline-variant/40 pb-2 last:border-b-0">
              {/* Category Header Accordion Trigger */}
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 h-auto text-left rounded-lg hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon
                    name={category.icon}
                    size="xs"
                    className="text-primary shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-heading text-xs font-bold text-on-surface truncate">
                    {category.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                    {categoryEntries.length}
                  </span>
                  <Icon
                    name={isExpanded ? 'expand_less' : 'expand_more'}
                    size="xs"
                    className="text-on-surface-variant"
                    aria-hidden="true"
                  />
                </div>
              </Button>

              {/* Category Entries List */}
              {isExpanded && (
                <div className="mt-1 space-y-0.5 pl-1.5">
                  {categoryEntries.length === 0 ? (
                    <div className="py-2 px-3 text-center text-xs text-on-surface-variant">
                      No components match filters
                    </div>
                  ) : (
                    categoryEntries.map((entry) => {
                      const isSelected = selectedId === entry.id;

                      return (
                        <Button
                          key={entry.id}
                          variant={isSelected ? 'tonal' : 'ghost'}
                          onClick={() => onSelect(entry.id)}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 h-auto text-left rounded-md text-xs font-sans transition-colors',
                            isSelected
                              ? 'bg-primary-container text-on-primary-container font-semibold border-l-2 border-primary'
                              : 'text-on-surface hover:bg-surface-container'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate">{entry.title}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {entry.isDeprecated && (
                              <span
                                title="Legacy re-export - see modern primitives"
                                className="inline-block w-1.5 h-1.5 rounded-full bg-warning"
                              />
                            )}
                            {entry.tier === 'block' && (
                              <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
                                block
                              </span>
                            )}
                          </div>
                        </Button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
