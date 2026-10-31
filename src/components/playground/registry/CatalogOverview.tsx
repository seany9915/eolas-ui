import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { UnstyledButton } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TabsRoot, TabsList, Tab } from '@/components/ui/tabs';
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

  const getCategoryCount = (catId: ComponentCategory) => {
    return REGISTRY_ENTRIES.filter((e) => e.category === catId).length;
  };

  return (
    <section aria-labelledby="catalog-overview-title" className={cn('w-full space-y-8', className)}>
      {/* Low Prominence Canvas Hero Header with Typographic Stats */}
      <div className="space-y-6 pb-6 border-b border-outline-variant">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Chip
                label="Registry v3.1"
                pattern="primary-container"
                colorRole="primary"
                size="sm"
              />
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-surface text-on-surface-variant font-medium border border-outline-variant">
                Base UI (@base-ui/react)
              </span>
            </div>
            <h2 id="catalog-overview-title" className="font-heading text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
              Eolas Component Registry
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Explore 100+ accessible primitives and clinical composite blocks. Select any component to inspect its unconstrained sandbox, responsive viewports, Base UI contracts, and copyable install commands.
            </p>
          </div>

          {/* Typographic Stats Lockup - No Card Soup, Accessible Contrast */}
          <div className="flex items-center gap-6 sm:gap-8 bg-surface px-6 py-4 rounded-xl border border-outline-variant shrink-0">
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-on-surface block leading-none mb-1 tabular-nums">
                {totalCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Total</span>
            </div>
            <div className="h-8 w-px bg-outline-variant" />
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-primary block leading-none mb-1 tabular-nums">
                {primitivesCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Primitives</span>
            </div>
            <div className="h-8 w-px bg-outline-variant" />
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-secondary block leading-none mb-1 tabular-nums">
                {blocksCount}
              </span>
              <span className="font-sans text-xs font-medium text-on-surface-variant">Blocks</span>
            </div>
          </div>
        </div>

        {/* Category Navigation via Base UI Tabs */}
        <div className="pt-2">
          <TabsRoot
            value={selectedCategory}
            onValueChange={(val) => handleCategorySelect(val as ComponentCategory | 'all')}
            variant="line"
            className="w-full"
          >
            <TabsList className="border-b border-outline-variant flex items-center gap-2 overflow-x-auto w-full pb-0">
              <Tab value="all" className="whitespace-nowrap shrink-0 text-xs sm:text-sm">
                All Categories ({totalCount})
              </Tab>
              {REGISTRY_CATEGORIES.map((cat) => (
                <Tab key={cat.id} value={cat.id} className="whitespace-nowrap shrink-0 text-xs sm:text-sm">
                  <Icon name={cat.icon} size="xs" className="mr-1.5" />
                  {cat.title} ({getCategoryCount(cat.id)})
                </Tab>
              ))}
            </TabsList>
          </TabsRoot>
        </div>

        {/* Filter Toolbar: Search Input + Tier ToggleGroup */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all components..."
            leadingIcon={<Icon name="search" size="sm" className="text-on-surface-variant" />}
            clearable={!!search}
            onClear={() => setSearch('')}
            className="w-full sm:w-80 md:w-96 text-sm bg-surface"
            aria-label="Search across components"
          />

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <ToggleGroup
              type="single"
              value={selectedTier}
              onValueChange={(val) => {
                if (val) handleTierSelect(val as ComponentTier | 'all');
              }}
              variant="segmented"
              size="sm"
            >
              <ToggleGroupItem value="all" className="text-xs px-3">
                All ({totalCount})
              </ToggleGroupItem>
              <ToggleGroupItem value="primitive" className="text-xs px-3">
                Primitives ({primitivesCount})
              </ToggleGroupItem>
              <ToggleGroupItem value="block" className="text-xs px-3">
                Blocks ({blocksCount})
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Grid of Components with Accessible Clickable Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-on-surface">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'component' : 'components'}
            {selectedCategory !== 'all' && (
              <span className="text-on-surface-variant font-normal">
                {' '}in {REGISTRY_CATEGORIES.find((c) => c.id === selectedCategory)?.title}
              </span>
            )}
          </span>
          {search && (
            <UnstyledButton
              onClick={() => setSearch('')}
              className="text-xs text-primary font-medium hover:underline focus-visible:outline-2 focus-visible:outline-primary rounded"
            >
              Clear search
            </UnstyledButton>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3 bg-surface rounded-xl border border-outline-variant">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto text-on-surface-variant">
              <Icon name="search_off" size="md" />
            </div>
            <h3 className="font-heading text-base font-bold text-on-surface">No components found</h3>
            <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
              No components match &ldquo;{search}&rdquo; in the selected filter. Try adjusting your search query or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="group p-5 flex flex-col justify-between hover:border-primary transition-[border-color,box-shadow,transform] duration-200 bg-surface border border-outline-variant shadow-xs hover:shadow-ambient rounded-xl"
              >
                <UnstyledButton
                  onClick={() => onSelect(entry.id)}
                  className="w-full text-left flex flex-col justify-between h-full space-y-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                        {entry.title}
                      </h3>
                      <Chip
                        label={entry.tier === 'block' ? 'Block' : 'Primitive'}
                        pattern={entry.tier === 'block' ? 'secondary-container' : 'primary-container'}
                        colorRole={entry.tier === 'block' ? 'secondary' : 'primary'}
                        size="sm"
                      />
                    </div>

                    <p className="font-sans text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {entry.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-outline-variant flex items-center justify-between text-xs font-mono text-on-surface-variant w-full">
                    <span className="truncate max-w-[150px]">{entry.basePrimitive}</span>
                    <span className="text-primary font-heading font-bold text-xs flex items-center group-hover:translate-x-1 transition-transform">
                      Inspect
                      <Icon name="chevron_right" size="xs" className="ml-0.5" />
                    </span>
                  </div>
                </UnstyledButton>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
