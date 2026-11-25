'use client';

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

export interface FilterToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  filterGroups?: FilterOptionGroup[];
  onFilterChange?: (groupId: string, value: string) => void;
  activeFilters?: ActiveFilterTag[];
  onRemoveFilter?: (filterId: string) => void;
  onReset?: () => void;
  resetLabel?: string;
  activeFiltersLabel?: string;
  removeFilterLabel?: (filter: ActiveFilterTag) => string;
  actions?: React.ReactNode;
  className?: string;
}

export const FilterToolbar = React.forwardRef<HTMLDivElement, FilterToolbarProps>(
  (
    {
      searchQuery,
      onSearchChange,
      searchLabel = 'Search',
      searchPlaceholder = 'Search...',
      filterGroups = [],
      onFilterChange,
      activeFilters = [],
      onRemoveFilter,
      onReset,
      resetLabel = 'Reset',
      activeFiltersLabel = 'Active filters:',
      removeFilterLabel,
      actions,
      className,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId();
    const searchInputId = `${baseId}-search`;
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const resetButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const chipNodeRefs = React.useRef<Map<string, HTMLElement | null>>(new Map());
    const focusRafRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      return () => {
        if (focusRafRef.current !== null) {
          cancelAnimationFrame(focusRafRef.current);
        }
      };
    }, []);

    const hasActiveFilters =
      searchQuery.trim().length > 0 ||
      activeFilters.length > 0 ||
      filterGroups.some((group) => group.value !== (group.defaultValue ?? ''));

    const handleRemoveChip = (filterId: string, index: number) => {
      const nextFilterId = activeFilters[index + 1]?.id ?? activeFilters[index - 1]?.id ?? null;
      onRemoveFilter?.(filterId);

      if (focusRafRef.current !== null) {
        cancelAnimationFrame(focusRafRef.current);
      }
      focusRafRef.current = window.requestAnimationFrame(() => {
        focusRafRef.current = null;
        if (nextFilterId) {
          const nextNode = chipNodeRefs.current.get(nextFilterId);
          const focusTarget = nextNode?.querySelector<HTMLElement>('button') ?? nextNode;
          if (focusTarget) {
            focusTarget.focus();
            return;
          }
        }
        if (resetButtonRef.current) {
          resetButtonRef.current.focus();
          return;
        }
        searchInputRef.current?.focus();
      });
    };

    return (
      <div ref={ref} data-slot="filter-toolbar" className={cn('@container flex w-full flex-col gap-3', className)} {...props}>
        <div className="flex flex-col @2xl:flex-row items-stretch @2xl:items-center justify-between gap-3">
          {/* Search input with accessible Field label and native-safe clear trigger */}
          <Field.Root className="w-full min-w-0 @2xl:flex-1 @2xl:min-w-48">
            <Field.Label htmlFor={searchInputId} className="sr-only">
              {searchLabel}
            </Field.Label>
            <Input
              ref={searchInputRef}
              id={searchInputId}
              type="search"
              enterKeyHint="search"
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
          <div className="flex flex-wrap items-center gap-2 w-full @2xl:w-auto min-w-0 max-w-full">
            {filterGroups.map((group, idx) => {
              const selectId = `${baseId}-filter-${idx}`;
              return (
                <Field.Root key={group.id} className="w-full min-w-0 max-w-full @xs:w-auto @xs:min-w-36">
                  <Field.Label htmlFor={selectId} className="sr-only">
                    {group.label}
                  </Field.Label>
                  <Select
                    id={selectId}
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
                </Field.Root>
              );
            })}

            {hasActiveFilters && onReset && (
              <Button
                ref={resetButtonRef}
                variant="outline"
                colorRole="neutral"
                onClick={onReset}
              >
                <Icon name="restart_alt" size="sm" aria-hidden="true" />
                {resetLabel}
              </Button>
            )}

            {actions}
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 pt-1">
            <span className="font-sans text-label-sm text-on-surface-variant">
              {activeFiltersLabel}
            </span>
            {activeFilters.map((filter, idx) => (
              <Chip
                key={filter.id}
                ref={(node) => {
                  if (node) {
                    chipNodeRefs.current.set(filter.id, node);
                  } else {
                    chipNodeRefs.current.delete(filter.id);
                  }
                }}
                variant="outline"
                colorRole="primary"
                onRemove={onRemoveFilter ? () => handleRemoveChip(filter.id, idx) : undefined}
                removeLabel={
                  removeFilterLabel
                    ? removeFilterLabel(filter)
                    : `Remove ${filter.label} filter: ${filter.valueLabel}`
                }
              >
                <span className="font-normal">{filter.label}:</span>{' '}
                <span className="font-semibold">{filter.valueLabel}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>
    );
  }
);
FilterToolbar.displayName = 'FilterToolbar';

export default FilterToolbar;
