/**
 * FilterToolbar block.
 *
 * Controlled composite toolbar for data tables, caseload lists, and exercise libraries.
 * Composes Input, Select, Button, and Chip primitives with responsive container queries (@container),
 * 44px minimum touch targets, and accessible filter clearing.
 */
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Select, type SelectOption } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface FilterOptionGroup {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
}

export interface ActiveFilterTag {
  id: string;
  label: string;
  valueLabel: string;
}

export interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterOptionGroup[];
  onFilterChange?: (groupId: string, value: string) => void;
  activeFilters?: ActiveFilterTag[];
  onRemoveFilter?: (filterId: string) => void;
  onReset?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function FilterToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterGroups = [],
  onFilterChange,
  activeFilters = [],
  onRemoveFilter,
  onReset,
  actions,
  className,
}: FilterToolbarProps) {
  const hasActiveFilters = searchQuery.trim().length > 0 || activeFilters.length > 0;

  return (
    <div className={cn('@container w-full space-y-3', className)}>
      <div className="flex flex-col @md:flex-row items-stretch @md:items-center justify-between gap-3">
        {/* Search input with functional icon */}
        <div className="flex-1 min-w-50">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            leadingIcon={<Icon name="search" size="md" aria-hidden="true" />}
            className="w-full"
            aria-label={searchPlaceholder}
          />
        </div>

        {/* Filter dropdowns and actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {filterGroups.map((group) => (
            <div key={group.id} className="min-w-36">
              <Select
                value={group.value}
                onValueChange={(val) => {
                  if (val && onFilterChange) {
                    onFilterChange(group.id, val);
                  }
                }}
                options={group.options}
                placeholder={group.label}
              />
            </div>
          ))}

          {hasActiveFilters && onReset && (
            <Button
              variant="outlined"
              colorRole="neutral"
              size="sm"
              onClick={onReset}
            >
              <Icon name="restart_alt" size="sm" aria-hidden="true" />
              Reset
            </Button>
          )}

          {actions}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-label text-xs font-semibold text-on-surface-variant mr-1">
            Active filters:
          </span>
          {activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              variant="outline"
              colorRole="primary"
              onRemove={onRemoveFilter ? () => onRemoveFilter(filter.id) : undefined}
            >
              <span className="font-medium opacity-80">{filter.label}:</span>{' '}
              <span className="font-semibold">{filter.valueLabel}</span>
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterToolbar;
