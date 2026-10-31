import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarRail,
} from '@/components/ui/sidebar';
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
  onCategoryChange: _onCategoryChange,
  tierFilter,
  onTierFilterChange,
  searchQuery,
  onSearchChange,
  className,
}) => {
  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const cat of REGISTRY_CATEGORIES) {
      map[cat.id] = true;
    }
    return map;
  });

  const toggleCategory = (catId: string, open: boolean) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: open,
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
      inputs: [],
      overlays: [],
      feedback: [],
      navigation: [],
      layout: [],
      'clinical-ai': [],
      blocks: [],
      motion: [],
      system: [],
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
    <Sidebar
      collapsible="none"
      className={cn(
        'w-[var(--sidebar-width)] shrink-0 border-r border-outline-variant bg-surface sticky top-18 h-[calc(100vh-4.5rem)] flex flex-col z-20',
        className
      )}
    >
      {/* Sidebar Header & Search */}
      <SidebarHeader className="p-3.5 border-b border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-bold text-on-surface">Registry</span>
            <Chip
              label={String(totalCount)}
              pattern="primary-container"
              colorRole="primary"
              size="sm"
            />
          </div>
          <Button
            size="sm"
            variant={selectedId === null ? 'tonal' : 'ghost'}
            onClick={() => onSelect(null)}
            className="text-xs h-8 px-2.5 font-medium"
          >
            <Icon name="grid_view" size="xs" className="mr-1.5" />
            Overview
          </Button>
        </div>

        {/* Search Input */}
        <SidebarInput
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter components..."
          leadingIcon={<Icon name="search" size="sm" className="text-on-surface-variant" />}
          clearable={!!searchQuery}
          onClear={() => onSearchChange('')}
          className="w-full text-xs"
        />

        {/* Tier Filter Segments */}
        <ToggleGroup
          type="single"
          value={tierFilter}
          onValueChange={(val) => {
            if (val) onTierFilterChange(val as ComponentTier | 'all');
          }}
          variant="segmented"
          size="sm"
          className="w-full"
        >
          <ToggleGroupItem value="all" className="flex-1 text-xs py-1">
            All ({totalCount})
          </ToggleGroupItem>
          <ToggleGroupItem value="primitive" className="flex-1 text-xs py-1">
            Primitives ({primitiveCount})
          </ToggleGroupItem>
          <ToggleGroupItem value="block" className="flex-1 text-xs py-1">
            Blocks ({blockCount})
          </ToggleGroupItem>
        </ToggleGroup>
      </SidebarHeader>

      {/* Category List & Items */}
      <SidebarContent className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {REGISTRY_CATEGORIES.map((category) => {
          const categoryEntries = entriesByCategory[category.id] || [];
          if (categoryEntries.length === 0 && searchQuery) {
            return null;
          }

          const isExpanded = expandedCategories[category.id] !== false;

          return (
            <Collapsible
              key={category.id}
              open={isExpanded}
              onOpenChange={(open) => toggleCategory(category.id, open)}
              className="w-full"
            >
              <SidebarGroup className="p-0 mb-1">
                <SidebarGroupLabel asChild className="p-0 h-auto">
                  <Collapsible.Trigger
                    hideChevron
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1 group/cat-trigger cursor-pointer select-none min-h-[36px]"
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
                    <div className="flex items-center gap-1.5 shrink-0 text-on-surface-variant">
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container font-medium">
                        {categoryEntries.length}
                      </span>
                      <Icon
                        name={isExpanded ? 'expand_less' : 'expand_more'}
                        size="xs"
                        aria-hidden="true"
                      />
                    </div>
                  </Collapsible.Trigger>
                </SidebarGroupLabel>

                <Collapsible.Panel unstyled className="overflow-hidden">
                  <SidebarGroupContent className="pt-1">
                    <SidebarMenu className="gap-0.5">
                      {categoryEntries.length === 0 ? (
                        <div className="py-2 px-3 text-center text-xs text-on-surface-variant">
                          No matching components
                        </div>
                      ) : (
                        categoryEntries.map((entry) => {
                          const isSelected = selectedId === entry.id;

                          return (
                            <SidebarMenuItem key={entry.id}>
                              <SidebarMenuButton
                                isActive={isSelected}
                                onClick={() => onSelect(entry.id)}
                                size="sm"
                                className="text-xs"
                              >
                                <span className="truncate">{entry.title}</span>
                                {entry.isDeprecated && (
                                  <span
                                    title="Legacy re-export"
                                    className="font-mono text-[10px] px-1 py-0.5 rounded bg-warning-container text-on-warning-container font-medium shrink-0"
                                  >
                                    legacy
                                  </span>
                                )}
                                {entry.tier === 'block' && (
                                  <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold shrink-0">
                                    block
                                  </span>
                                )}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </Collapsible.Panel>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};
