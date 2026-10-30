import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { REGISTRY_CATEGORIES } from './registry-categories';
import { REGISTRY_ENTRIES } from './registry-manifest';
import { ComponentCategory, ComponentTier, RegistryEntry } from './types';

export interface CatalogOverviewProps {
  onSelect: (id: string) => void;
  activeCategory?: ComponentCategory | 'all';
  onCategoryChange?: (category: ComponentCategory | 'all') => void;
  className?: string;
}

export const CatalogOverview: React.FC<CatalogOverviewProps> = ({
  onSelect,
  activeCategory: controlledCategory,
  onCategoryChange,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [internalCategory, setInternalCategory] = React.useState<ComponentCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = React.useState<ComponentTier | 'all'>('all');

  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;
  const handleCategorySelect = (cat: ComponentCategory | 'all') => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

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

  return (
    <section aria-labelledby="catalog-overview-title" className={cn('w-full space-y-6', className)}>
      {/* Low Prominence Canvas Hero Header */}
      <div className="space-y-4 pb-6 border-b border-outline-variant">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-semibold">
                Registry v3.1
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-surface text-on-surface-variant font-medium border border-outline-variant">
                Base UI (@base-ui/react)
              </span>
            </div>
            <h2 id="catalog-overview-title" className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              Eolas Component Registry
            </h2>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Explore 100+ accessible primitives and domain-specific clinical composite blocks. Select any component to inspect its unconstrained sandbox, responsive viewports, Base UI contracts, and copyable install commands.
            </p>
          </div>

          {/* Quick Stats on Canvas */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-surface px-3.5 py-2 rounded-xl border border-outline-variant text-center shadow-xs min-w-18">
              <span className="font-heading text-xl font-bold text-primary block leading-none mb-1">
                {totalCount}
              </span>
              <span className="font-sans text-[11px] font-medium text-on-surface-variant">Total</span>
            </div>
            <div className="bg-surface px-3.5 py-2 rounded-xl border border-outline-variant text-center shadow-xs min-w-18">
              <span className="font-heading text-xl font-bold text-secondary block leading-none mb-1">
                {primitivesCount}
              </span>
              <span className="font-sans text-[11px] font-medium text-on-surface-variant">Primitives</span>
            </div>
            <div className="bg-surface px-3.5 py-2 rounded-xl border border-outline-variant text-center shadow-xs min-w-18">
              <span className="font-heading text-xl font-bold text-tertiary block leading-none mb-1">
                {blocksCount}
              </span>
              <span className="font-sans text-[11px] font-medium text-on-surface-variant">Blocks</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar - Directly on Canvas */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <Input
            type="search"
            size="sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all 102 components..."
            leadingIcon={<Icon name="search" size="xs" className="text-on-surface-variant" />}
            clearable={!!search}
            onClear={() => setSearch('')}
            className="w-full md:w-80 text-xs bg-surface"
          />

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              onClick={() => handleCategorySelect('all')}
              className="text-xs h-7 px-2.5"
            >
              All Categories
            </Button>
            {REGISTRY_CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? 'filled' : 'ghost'}
                onClick={() => handleCategorySelect(cat.id)}
                className="text-xs h-7 px-2.5"
              >
                <Icon name={cat.icon} size="xs" className="mr-1" />
                {cat.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Components */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-on-surface">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'component' : 'components'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className="group p-4 flex flex-col justify-between hover:border-primary transition-all duration-200 cursor-pointer bg-surface border border-outline-variant shadow-xs hover:shadow-ambient"
              onClick={() => onSelect(entry.id)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {entry.title}
                  </h3>
                  <Chip
                    label={entry.tier === 'block' ? 'Block' : 'Primitive'}
                    pattern={entry.tier === 'block' ? 'secondary-container' : 'primary-container'}
                    colorRole={entry.tier === 'block' ? 'secondary' : 'primary'}
                    size="sm"
                  />
                </div>

                <p className="font-sans text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {entry.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-outline-variant/50 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                <span className="truncate max-w-[140px]">{entry.basePrimitive}</span>
                <span className="text-primary font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                  Inspect
                  <Icon name="chevron_right" size="xs" className="ml-0.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
