/**
 * FilterToolbar block.
 *
 * Controlled composite toolbar for data tables, caseload lists, and exercise libraries.
 * Composes Field, Input, Select, Button, and Chip primitives with responsive container queries (@container),
 * 44px minimum touch targets, and accessible filter clearing.
 */
import * as React from 'react';
import { Field } from '@/components/ui/field';
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
  /** Value meaning "no filter" (for example an "all" option). Defaults to an empty string. */
  defaultValue?: string;
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
  searchLabel?: string;
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
  searchLabel = 'Search',
  searchPlaceholder = 'Search...',
  filterGroups = [],
  onFilterChange,
  activeFilters = [],
  onRemoveFilter,
  onReset,
  actions,
  className,
}: FilterToolbarProps) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeFilters.length > 0 ||
    filterGroups.some((group) => group.value !== (group.defaultValue ?? ''));

  return (
    <div className={cn('@container flex w-full flex-col gap-3', className)}>
      <div className="flex flex-col @md:flex-row items-stretch @md:items-center justify-between gap-3">
        {/* Search input with accessible Field label and native-safe clear trigger */}
        <Field.Root className="w-full min-w-0 @md:flex-1 @md:min-w-48">
          <Field.Label className="sr-only">{searchLabel}</Field.Label>
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            leadingIcon={<Icon name="search" size="md" aria-hidden="true" />}
            clearable
            onClear={() => onSearchChange('')}
            className="w-full"
          />
        </Field.Root>

        {/* Filter dropdowns and actions */}
        <div className="flex flex-wrap items-center gap-2 w-full @md:w-auto">
          {filterGroups.map((group) => (
            <div key={group.id} className="w-full @xs:w-auto @xs:min-w-36">
              <Select
                value={group.value}
                onValueChange={(val) => {
                  if (val != null && onFilterChange) {
                    onFilterChange(group.id, val);
                  }
                }}
                options={group.options}
                placeholder={group.label}
                aria-label={group.label}
              />
            </div>
          ))}

          {hasActiveFilters && onReset && (
            <Button
              variant="outline"
              colorRole="neutral"
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
          <span className="font-sans text-label-sm text-on-surface-variant">
            Active filters:
          </span>
          {activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              variant="outline"
              colorRole="primary"
              onRemove={onRemoveFilter ? () => onRemoveFilter(filter.id) : undefined}
              removeLabel={`Remove ${filter.label} filter: ${filter.valueLabel}`}
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
