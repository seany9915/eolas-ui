import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { REGISTRY_CATEGORIES } from './registry-categories';
import { REGISTRY_ENTRIES } from './registry-manifest';
import { ComponentCategory, ComponentTier } from './types';

export interface CatalogOverviewProps {
  onSelect: (id: string) => void;
  activeCategory?: ComponentCategory | 'all';
  onCategoryChange?: (category: ComponentCategory | 'all') => void;
  tierFilter?: ComponentTier | 'all';
  onTierFilterChange?: (tier: ComponentTier | 'all') => void;
  className?: string;
}

export const CatalogOverview: React.FC<CatalogOverviewProps> = ({
  onSelect,
  activeCategory: controlledCategory,
  onCategoryChange,
  tierFilter: controlledTier,
  onTierFilterChange,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [internalCategory, setInternalCategory] = React.useState<ComponentCategory | 'all'>('all');
  const [internalTier, setInternalTier] = React.useState<ComponentTier | 'all'>('all');

  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;
  const selectedTier = controlledTier !== undefined ? controlledTier : internalTier;

  const handleCategorySelect = (cat: ComponentCategory | 'all') => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const handleTierSelect = (tier: ComponentTier | 'all') => {
    if (onTierFilterChange) {
      onTierFilterChange(tier);
    } else {
      setInternalTier(tier);
    }
  };

  // Filter entries based on search, category and tier
  const filteredEntries = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return REGISTRY_ENTRIES.filter((entry) => {
      if (selectedTier !== 'all' && entry.tier !== selectedTier) return false;
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.basePrimitive.toLowerCase().includes(q)
      );
    });
  }, [search, selectedCategory, selectedTier]);

  const totalCount = REGISTRY_ENTRIES.length;
  const primitivesCount = REGISTRY_ENTRIES.filter((e) => e.tier === 'primitive').length;
  const blocksCount = REGISTRY_ENTRIES.filter((e) => e.tier === 'block').length;
  const utilitiesCount = REGISTRY_ENTRIES.filter((e) => e.tier === 'utility').length;

  const getCategoryCount = (catId: ComponentCategory) => {
    return REGISTRY_ENTRIES.filter((e) => e.category === catId).length;
  };

  return (
    <section aria-labelledby="catalog-overview-title" className={cn('w-full flex flex-col gap-8', className)}>
      {/* Low Prominence Canvas Hero Header with Typographic Stats */}
      <div className="flex flex-col gap-6 pb-6 border-b border-outline-variant">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="soft"
                colorRole="primary"
                size="sm"
              >Registry v6.0</Badge>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-surface text-on-surface-variant font-medium border border-outline-variant">
                Base UI (@base-ui/react)
              </span>
            </div>
            <h2 id="catalog-overview-title" className="font-heading text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
              Eolas Component Registry
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Explore 100+ accessible primitives and composite blocks. Select any component to inspect interactive previews, responsive viewports, Base UI properties, and copyable install commands.
            </p>
          </div>

          {/* Typographic Stats Lockup - Wraps cleanly on 320px/390px viewports */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 bg-surface px-5 sm:px-6 py-4 rounded-xl shadow-ambient shrink-0 max-w-full">
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-on-surface block leading-none mb-1 tabular-nums">
                {totalCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Total</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-outline-variant" />
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-primary block leading-none mb-1 tabular-nums">
                {primitivesCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Primitives</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-outline-variant" />
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-secondary block leading-none mb-1 tabular-nums">
                {blocksCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Blocks</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-outline-variant" />
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-on-surface-variant block leading-none mb-1 tabular-nums">
                {utilitiesCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Utilities</span>
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="pt-2 overflow-x-auto max-w-full">
          <ToggleGroup
            type="single"
            value={selectedCategory}
            onValueChange={(val) => {
              if (val) handleCategorySelect(val as ComponentCategory | 'all');
            }}
            size="sm"
            aria-label="Filter by category"
            className="w-max min-w-full"
          >
            <ToggleGroupItem value="all" className="whitespace-nowrap shrink-0 text-xs sm:text-sm px-3">
              All Categories ({totalCount})
            </ToggleGroupItem>
            {REGISTRY_CATEGORIES.map((cat) => (
              <ToggleGroupItem key={cat.id} value={cat.id} className="whitespace-nowrap shrink-0 text-xs sm:text-sm px-3">
                <Icon name={cat.icon} size="xs" />
                {cat.title} ({getCategoryCount(cat.id)})
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Filter Toolbar: Search Input + Tier ToggleGroup */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1 flex-wrap">
          <Input
            type="search"
            enterKeyHint="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all components..."
            leadingIcon={<Icon name="search" size="sm" className="text-on-surface-variant" />}
            clearable={!!search}
            onClear={() => setSearch('')}
            className="w-full lg:w-96 text-base md:text-sm bg-surface"
            aria-label="Search across components"
          />

          <div className="flex items-center justify-start lg:justify-end gap-3 max-w-full overflow-x-auto">
            <ToggleGroup
              type="single"
              value={selectedTier}
              onValueChange={(val) => {
                if (val) handleTierSelect(val as ComponentTier | 'all');
              }}
              size="sm"
              aria-label="Filter by component tier"
              className="w-max"
            >
              <ToggleGroupItem value="all" className="text-xs px-3 whitespace-nowrap">
                All ({totalCount})
              </ToggleGroupItem>
              <ToggleGroupItem value="primitive" className="text-xs px-3 whitespace-nowrap">
                Primitives ({primitivesCount})
              </ToggleGroupItem>
              <ToggleGroupItem value="block" className="text-xs px-3 whitespace-nowrap">
                Blocks ({blocksCount})
              </ToggleGroupItem>
              <ToggleGroupItem value="utility" className="text-xs px-3 whitespace-nowrap">
                Utilities ({utilitiesCount})
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Grid of Components with Accessible Stretched-Link Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-on-surface">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'component' : 'components'}
            {selectedCategory !== 'all' && (
              <span className="text-on-surface-variant font-normal">
                {' '}in {REGISTRY_CATEGORIES.find((c) => c.id === selectedCategory)?.title}
              </span>
            )}
          </span>
          {search && (
            <Button
              size="sm"
              variant="text"
              colorRole="primary"
              onClick={() => setSearch('')}
              className="px-3 text-xs"
            >
              Clear search
            </Button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col gap-3 bg-surface rounded-xl shadow-ambient">
            <div className="size-12 rounded-full bg-surface-container-high flex items-center justify-center mx-auto text-on-surface-variant">
              <Icon name="search_off" size="md" />
            </div>
            <h3 className="font-heading text-base font-bold text-on-surface">No components found</h3>
            <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
              {search.trim()
                ? `No components match "${search.trim()}" in the selected filter. Try adjusting your search query or selecting a different category.`
                : 'No components match the selected filter. Try selecting a different tier or category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                affordance="actionable"
                className="group p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-on-surface group-hover:text-primary transition-colors motion-reduce:transition-none min-w-0">
                      <Card.Trigger
                        onClick={() => onSelect(entry.id)}
                        className="truncate block max-w-full"
                      >
                        {entry.title}
                      </Card.Trigger>
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant="soft"
                        colorRole={entry.tier === 'block' ? 'secondary' : entry.tier === 'utility' ? 'neutral' : 'primary'}
                        size="sm"
                      >{entry.tier === 'block' ? 'Block' : entry.tier === 'utility' ? 'Utility' : 'Primitive'}</Badge>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant flex items-center justify-between text-xs font-mono text-on-surface-variant w-full">
                  <span className="truncate max-w-[150px]">{entry.basePrimitive}</span>
                  <span className="text-primary font-heading font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" aria-hidden="true">
                    Inspect
                    <Icon name="chevron_right" size="xs" directional />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
