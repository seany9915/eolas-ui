'use client';

/**
 * DataTable composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from Base UI primitives, TanStack Table, and design tokens:
 *             - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (`src/components/ui/table.tsx`)
 *             - `Button` (`src/components/ui/button.tsx`)
 *             - `InputGroup` (`src/components/ui/input-group.tsx`)
 *             - `Select` (`src/components/ui/select.tsx`)
 *             - `Menu` (`src/components/ui/menu.tsx`)
 *             - `Checkbox` (`src/components/ui/checkbox.tsx`)
 *             - `Badge` (`src/components/ui/badge.tsx`)
 *             - `Spinner` (`src/components/ui/spinner.tsx`)
 *             - `Empty` (`src/components/ui/empty.tsx`)
 *             - `Icon` (`src/components/ui/icon.tsx`)
 *             - `@tanstack/react-table`
 *
 * TAXONOMY & USAGE:
 * - Enterprise-grade, accessible data table composite block conforming to shadcn/ui Data Table specification.
 * - Powers complex data exploration with column sorting, global & column text filtering, faceted category filtering,
 *   row selection, dynamic column visibility toggling, loading/empty states, and accessible pagination.
 * - Conforms to DESIGN.md Table rules: 56px minimum row height, right-aligned numeric columns with tabular-nums
 *   and font-mono, concentric geometry, floating focus rings, and container-query responsiveness (@container).
 * - Exports both all-in-one <DataTable /> and composable subcomponents:
 *   DataTableColumnHeader, DataTablePagination, DataTableViewOptions, DataTableFacetedFilter, DataTableToolbar,
 *   DataTableRowActions, createSelectColumn, createActionsColumn.
 */
import * as React from 'react';
import {
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type FilterFn,
  type Header,
  type HeaderGroup,
  type OnChangeFn,
  type PaginationState,
  type ReactTable as TanStackTable,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortFn,
  type SortingState,
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_weakEquals,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type TableDensity,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Select } from '@/components/ui/select';
import { Menu } from '@/components/ui/menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';

/* -------------------------------------------------------------------------------------------------
 * TanStack Table v9 Feature Registry & Types
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableColumnMeta {
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

function facetedFilterFnImpl(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: string[]
): boolean {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  return filterValue.includes(String(row.getValue(columnId)));
}
facetedFilterFnImpl.autoRemove = (value: unknown) => !Array.isArray(value) || value.length === 0;

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  columnMeta: {} as DataTableColumnMeta,
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    equals: filterFn_equals,
    arrIncludes: filterFn_arrIncludes,
    arrIncludesSome: filterFn_arrIncludesSome,
    inDateRange: filterFn_inDateRange,
    weakEquals: filterFn_weakEquals,
    faceted: facetedFilterFnImpl,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
});

/** Alias matching shadcn/ui `data-table-features` convention */
export const features = dataTableFeatures;
export type DataTableFeatures = typeof dataTableFeatures;

export type {
  ColumnDef,
  Column,
  Row,
  RowData,
  Cell,
  Header,
  HeaderGroup,
  TanStackTable,
  SortingState,
  ColumnFiltersState,
  ColumnVisibilityState,
  ColumnVisibilityState as VisibilityState,
  RowSelectionState,
  PaginationState,
  FilterFn,
  SortFn,
  SortFn as SortingFn,
  OnChangeFn,
};

export { createColumnHelper, flexRender };

/* -------------------------------------------------------------------------------------------------
 * Helper: Row Selection Column Generator
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableRowColumnOptions<TData> {
  /** Returns a human-readable identifier for the row (used in select checkbox and action menu labels). */
  getRowLabel?: (row: TData) => string;
}

export function createSelectColumn<TData extends RowData>(
  options?: DataTableRowColumnOptions<TData>
): ColumnDef<DataTableFeatures, TData, unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
        aria-label="Select all rows on current page"
      />
    ),
    cell: ({ row }) => {
      const rowLabel = options?.getRowLabel?.(row.original);
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label={rowLabel ? `Select ${rowLabel}` : 'Select row'}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
}

/* -------------------------------------------------------------------------------------------------
 * DataTableRowActions & Actions Column Helper
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableRowAction<TData> {
  id?: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  shortcut?: string;
  disabled?: boolean;
  onClick: (data: TData) => void;
}

export interface DataTableRowActionsProps<TData extends RowData> {
  row: Row<DataTableFeatures, TData>;
  actions?: DataTableRowAction<TData>[];
  /** Accessible label for the row actions menu trigger. Defaults to 'Open row actions'. */
  menuLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DataTableRowActions<TData extends RowData>({
  row,
  actions,
  menuLabel = 'Open row actions',
  children,
  className,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className={cn('flex items-center justify-end', className)}>
      <Menu
        side="bottom"
        align="end"
        trigger={
          <Button
            variant="text"
            size="icon"
            colorRole="neutral"
            aria-label={menuLabel}
          >
            <Icon name="more_horiz" size="xs" aria-hidden="true" />
          </Button>
        }
      >
        {children ? (
          children
        ) : actions && actions.length > 0 ? (
          <Menu.Group>
            {actions.map((action, idx) => (
              <React.Fragment key={action.id || action.label || idx}>
                {action.destructive && idx > 0 && <Menu.Separator />}
                <Menu.Item
                  destructive={action.destructive}
                  disabled={action.disabled}
                  icon={action.icon}
                  onClick={() => action.onClick(row.original)}
                >
                  <span>{action.label}</span>
                  {action.shortcut && <Menu.Shortcut>{action.shortcut}</Menu.Shortcut>}
                </Menu.Item>
              </React.Fragment>
            ))}
          </Menu.Group>
        ) : null}
      </Menu>
    </div>
  );
}

export function createActionsColumn<TData extends RowData>(
  actions:
    | DataTableRowAction<TData>[]
    | ((row: TData) => React.ReactNode),
  options?: DataTableRowColumnOptions<TData>
): ColumnDef<DataTableFeatures, TData, unknown> {
  return {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      if (typeof actions === 'function') {
        return (
          <div className="flex items-center justify-end">
            {actions(row.original)}
          </div>
        );
      }
      const rowLabel = options?.getRowLabel?.(row.original);
      return (
        <DataTableRowActions
          row={row}
          actions={actions}
          menuLabel={rowLabel ? `Actions for ${rowLabel}` : undefined}
        />
      );
    },
  };
}

/* -------------------------------------------------------------------------------------------------
 * DataTableColumnHeader
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableColumnHeaderProps<TData extends RowData, TValue = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export function DataTableColumnHeader<TData extends RowData, TValue = unknown>({
  column,
  title,
  align,
  numeric,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isNumeric = numeric || align === 'right';
  const isCentered = align === 'center';

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          'text-sm font-semibold text-on-surface font-label',
          isNumeric && 'text-end font-mono tabular-nums',
          isCentered && 'text-center',
          className
        )}
        {...props}
      >
        {title}
      </div>
    );
  }

  const sortIcon =
    column.getIsSorted() === 'desc' ? (
      <Icon name="arrow_downward" size="xs" aria-hidden="true" />
    ) : column.getIsSorted() === 'asc' ? (
      <Icon name="arrow_upward" size="xs" aria-hidden="true" />
    ) : (
      <Icon name="unfold_more" size="xs" aria-hidden="true" />
    );

  const currentSort = column.getIsSorted();
  const handleSortClick = () => {
    if (currentSort === 'asc') {
      column.toggleSorting(true);
    } else if (currentSort === 'desc') {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        isNumeric ? 'justify-end -me-3.5' : isCentered ? 'justify-center' : 'justify-start -ms-3.5',
        className
      )}
      {...props}
    >
      <Button
        variant="text"
        size="sm"
        colorRole="neutral"
        onClick={handleSortClick}
        aria-label={
          currentSort === 'asc'
            ? `Sort by ${title} descending`
            : currentSort === 'desc'
              ? `Clear sort on ${title}`
              : `Sort by ${title} ascending`
        }
      >
        {isNumeric && sortIcon}
        <span className={cn(isNumeric && 'font-mono tabular-nums')}>{title}</span>
        {!isNumeric && sortIcon}
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DataTableViewOptions
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableViewOptionsProps<TData extends RowData> {
  table: TanStackTable<DataTableFeatures, TData>;
  className?: string;
}

export function DataTableViewOptions<TData extends RowData>({
  table,
  className,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide()
    );

  return (
    <div className={className}>
      <Menu
        side="bottom"
        align="end"
        trigger={
          <Button variant="outline" size="sm" colorRole="neutral">
            <Icon name="tune" size="xs" aria-hidden="true" />
            <span>Columns</span>
          </Button>
        }
      >
        <Menu.Group>
          <Menu.GroupLabel>Toggle columns</Menu.GroupLabel>
          <Menu.Separator />
          {columns.map((column) => {
            const isVisible = column.getIsVisible();
            const colTitle =
              typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id;

            return (
              <Menu.CheckboxItem
                key={column.id}
                checked={isVisible}
                onCheckedChange={(val) => column.toggleVisibility(Boolean(val))}
              >
                <span className="truncate">{colTitle}</span>
              </Menu.CheckboxItem>
            );
          })}
        </Menu.Group>
      </Menu>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Faceted filter function
 * -----------------------------------------------------------------------------------------------*/
/**
 * Membership filter for multi-select facets: a row matches when its cell value is one of the selected values.
 * `DataTable` applies it automatically to columns listed in `facetedFilters` that have no `filterFn` of their own;
 * set it manually (`filterFn: facetedFilterFn`) when composing the table yourself.
 */
export function facetedFilterFn<TData extends RowData>(
  row: Row<DataTableFeatures, TData>,
  columnId: string,
  filterValue: string[]
): boolean {
  return facetedFilterFnImpl(row, columnId, filterValue);
}
facetedFilterFn.autoRemove = facetedFilterFnImpl.autoRemove;

/* -------------------------------------------------------------------------------------------------
 * DataTableFacetedFilter
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableFacetedFilterOption {
  label: string;
  value: string;
  icon?: string;
}

export interface DataTableFacetedFilterProps<TData extends RowData, TValue = unknown> {
  column?: Column<DataTableFeatures, TData, TValue>;
  title?: string;
  options: DataTableFacetedFilterOption[];
}

export function DataTableFacetedFilter<TData extends RowData, TValue = unknown>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const normalizedFacetCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    if (!facets) return counts;
    facets.forEach((count, key) => {
      const strKey = String(key);
      counts.set(strKey, (counts.get(strKey) ?? 0) + count);
    });
    return counts;
  }, [facets]);

  const rawFilterValue = column?.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(rawFilterValue) ? rawFilterValue.map(String) : []
  );

  return (
    <Menu
      side="bottom"
      align="start"
      trigger={
        <Button variant="outline" size="sm" colorRole="neutral">
          <Icon name="filter_list" size="xs" aria-hidden="true" />
          <span>{title}</span>
          {selectedValues.size > 0 && (
            <>
              <span className="w-px h-4 bg-outline-variant mx-1" aria-hidden="true" />
              <Badge variant="soft" colorRole="neutral" size="sm">
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      }
    >
      <Menu.Group>
        <Menu.GroupLabel>{title}</Menu.GroupLabel>
        <Menu.Separator />
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
          const facetCount = normalizedFacetCounts.get(option.value) ?? 0;
          return (
            <Menu.CheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={() => {
                const nextValues = new Set(selectedValues);
                if (isSelected) {
                  nextValues.delete(option.value);
                } else {
                  nextValues.add(option.value);
                }
                const filterValues = Array.from(nextValues);
                column?.setFilterValue(filterValues.length ? filterValues : undefined);
              }}
            >
              <span className="flex items-center justify-between gap-3 w-full">
                <span className="flex items-center gap-2 min-w-0">
                  {option.icon && (
                    <Icon name={option.icon} size="xs" aria-hidden="true" />
                  )}
                  <span className="truncate">{option.label}</span>
                </span>
                {facetCount > 0 && (
                  <span className="font-mono text-xs text-on-surface-variant tabular-nums shrink-0">
                    {facetCount}
                  </span>
                )}
              </span>
            </Menu.CheckboxItem>
          );
        })}
        {selectedValues.size > 0 && (
          <>
            <Menu.Separator />
            <Menu.Item onClick={() => column?.setFilterValue(undefined)}>
              <span className="w-full text-center font-medium">Clear filters</span>
            </Menu.Item>
          </>
        )}
      </Menu.Group>
    </Menu>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DataTableToolbar
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableToolbarProps<TData extends RowData> {
  table: TanStackTable<DataTableFeatures, TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  facetedFilters?: {
    columnId: string;
    title: string;
    options: DataTableFacetedFilterOption[];
  }[];
  showColumnVisibility?: boolean;
  enableGlobalFilter?: boolean;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData extends RowData>({
  table,
  searchKey,
  searchPlaceholder = 'Filter records…',
  facetedFilters,
  showColumnVisibility = true,
  enableGlobalFilter = true,
  children,
}: DataTableToolbarProps<TData>) {
  const searchInputId = React.useId();
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const isFiltered =
    table.state.columnFilters.length > 0 ||
    Boolean(table.state.globalFilter);
  const targetColumn = searchKey ? table.getColumn(searchKey) : undefined;
  const searchVal = (targetColumn?.getFilterValue() as string) ?? '';
  const globalVal = (table.state.globalFilter as string) ?? '';
  const isColumnSearch = Boolean(searchKey && targetColumn);
  const showSearch = isColumnSearch || enableGlobalFilter;
  const activeSearchValue = isColumnSearch ? searchVal : globalVal;

  const handleSearchChange = (value: string) => {
    if (isColumnSearch && targetColumn) {
      targetColumn.setFilterValue(value);
    } else {
      table.setGlobalFilter(value);
    }
  };

  const handleClearSearch = () => {
    handleSearchChange('');
    searchInputRef.current?.focus();
  };

  return (
    <div data-slot="data-table-toolbar" className="@container w-full">
      <div className="flex flex-col @xl:flex-row items-stretch @xl:items-center justify-between gap-3 w-full">
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          {showSearch ? (
            <Field.Root className="w-full min-w-0 @xl:max-w-xs">
              <Field.Label htmlFor={searchInputId} className="sr-only">
                {searchPlaceholder}
              </Field.Label>
              <InputGroup size="sm">
                <InputGroupAddon align="inline-start">
                  <Icon name="search" size="xs" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  ref={searchInputRef}
                  id={searchInputId}
                  enterKeyHint="search"
                  placeholder={searchPlaceholder}
                  value={activeSearchValue}
                  onChange={(event) => handleSearchChange(event.target.value)}
                />
                {activeSearchValue && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      colorRole="neutral"
                      aria-label="Clear search"
                      onClick={handleClearSearch}
                    >
                      <Icon name="close" size="xs" aria-hidden="true" />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </Field.Root>
          ) : null}
          {facetedFilters?.map((filter) => {
            const col = table.getColumn(filter.columnId);
            if (!col) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={col}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
          {isFiltered && (
            <Button
              variant="text"
              colorRole="neutral"
              size="sm"
              className="shrink-0"
              onClick={() => {
                table.resetColumnFilters();
                table.resetGlobalFilter();
              }}
            >
              <span>Reset</span>
              <Icon name="close" size="xs" aria-hidden="true" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end @xl:self-auto shrink-0">
          {children}
          {showColumnVisibility && <DataTableViewOptions table={table} />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DataTablePagination
 * -----------------------------------------------------------------------------------------------*/
export interface DataTablePaginationProps<TData extends RowData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: TanStackTable<DataTableFeatures, TData>;
  pageSizeOptions?: number[];
  showSelectedCount?: boolean;
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showSelectedCount = true,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const pageSizeId = React.useId();
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;
  const rawPageCount = table.getPageCount();
  const hasKnownPageCount = rawPageCount >= 0;

  return (
    <div
      data-slot="data-table-pagination"
      className={cn('@container w-full', className)}
      {...props}
    >
      <div className="flex flex-col @2xl:flex-row items-center justify-between gap-4 py-2 px-1 w-full">
        {showSelectedCount && (
          <div className="font-sans text-sm text-on-surface-variant tabular-nums flex-1 select-none">
            {selectedCount} of {totalCount} {totalCount === 1 ? 'row' : 'rows'} selected.
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center @2xl:justify-end gap-4 @3xl:gap-8 @2xl:ms-auto">
          <Field.Root orientation="horizontal" className="w-auto gap-2">
            <Field.Label
              htmlFor={pageSizeId}
              className="whitespace-nowrap"
            >
              Rows per page
            </Field.Label>
            <Select
              id={pageSizeId}
              options={pageSizeOptions.map((size) => ({
                label: String(size),
                value: String(size),
              }))}
              value={String(table.state.pagination.pageSize)}
              onValueChange={(val) => {
                if (val) table.setPageSize(Number(val));
              }}
              size="sm"
            />
          </Field.Root>
          <div className="flex items-center justify-center font-sans text-sm text-on-surface font-medium tabular-nums min-w-24 select-none">
            Page {table.state.pagination.pageIndex + 1}
            {hasKnownPageCount ? ` of ${Math.max(1, rawPageCount)}` : ''}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              colorRole="neutral"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <Icon name="first_page" size="xs" directional aria-hidden="true" />
              <span className="sr-only">Go to first page</span>
            </Button>
            <Button
              variant="outline"
              colorRole="neutral"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Icon name="chevron_left" size="xs" directional aria-hidden="true" />
              <span className="sr-only">Go to previous page</span>
            </Button>
            <Button
              variant="outline"
              colorRole="neutral"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Icon name="chevron_right" size="xs" directional aria-hidden="true" />
              <span className="sr-only">Go to next page</span>
            </Button>
            <Button
              variant="outline"
              colorRole="neutral"
              size="icon"
              onClick={() => hasKnownPageCount && table.setPageIndex(Math.max(0, rawPageCount - 1))}
              disabled={!hasKnownPageCount || !table.getCanNextPage()}
            >
              <Icon name="last_page" size="xs" directional aria-hidden="true" />
              <span className="sr-only">Go to last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Master Composite Block: DataTable
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableProps<TData extends RowData> {
  columns?: ColumnDef<DataTableFeatures, TData, unknown>[];
  data?: TData[];
  /** Optional external TanStack table instance if managing table state externally */
  table?: TanStackTable<DataTableFeatures, TData>;
  /** Column ID to bind the toolbar text search input to (e.g. 'title' or 'email') */
  searchKey?: string;
  /** Custom placeholder for the search input */
  searchPlaceholder?: string;
  /** Whether global search filtering across all columns is enabled if searchKey is omitted */
  enableGlobalFilter?: boolean;
  /** Faceted category filter configurations to display in the toolbar */
  facetedFilters?: {
    columnId: string;
    title: string;
    options: DataTableFacetedFilterOption[];
  }[];
  /** Extra toolbar actions or buttons rendered on the right side of the toolbar */
  toolbarActions?: React.ReactNode;
  /** Whether to render the toolbar with search, filters, and column options. Defaults to true. */
  showToolbar?: boolean;
  /** Whether to render the pagination controls footer. Defaults to true. */
  showPagination?: boolean;
  /** Whether to display the column visibility options button in the toolbar. Defaults to true. */
  showColumnVisibility?: boolean;
  /** Whether to show the row selection count in the pagination footer. Defaults to true. */
  showSelectedCount?: boolean;
  /** Initial page size. Defaults to 10. */
  pageSize?: number;
  /** Available page size choices. Defaults to [10, 20, 30, 40, 50]. */
  pageSizeOptions?: number[];
  /** Total page count for manual or server-side pagination */
  pageCount?: number;
  /** Whether pagination is handled manually (server-side) */
  manualPagination?: boolean;
  /** Whether sorting is handled manually (server-side) */
  manualSorting?: boolean;
  /** Whether filtering is handled manually (server-side) */
  manualFiltering?: boolean;
  /** Controlled sorting state */
  sorting?: SortingState;
  /** Controlled sorting change callback */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Controlled column filters state */
  columnFilters?: ColumnFiltersState;
  /** Controlled column filters change callback */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  /** Controlled pagination state */
  pagination?: PaginationState;
  /** Controlled pagination change callback */
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Controlled global filter state */
  globalFilter?: string;
  /** Controlled global filter change callback */
  onGlobalFilterChange?: OnChangeFn<string>;
  /** Callback emitted whenever selected rows change. Includes selected rows hidden by active filters. */
  onSelectionChange?: (selectedRows: TData[]) => void;
  /** Stable unique id per row. Set it for server-paginated or reordered data so selection follows records, not indices. */
  getRowId?: (originalRow: TData, index: number, parent?: Row<DataTableFeatures, TData>) => string;
  /** Callback emitted when activating a table row by click, or Enter/Space when the row itself has focus. For primary row navigation, prefer a link or button inside the primary cell. */
  onRowClick?: (row: TData) => void;
  /** Optional accessible label applied to clickable rows (`onRowClick`) while preserving native `<tr>` row semantics. */
  getRowAriaLabel?: (row: TData) => string;
  /** Displays a loading state with spinner in the table body */
  loading?: boolean;
  /** Accessible status text displayed and announced while `loading` is true. Defaults to 'Loading records…'. */
  loadingLabel?: string;
  /** Custom message rendered when no records match the criteria */
  emptyMessage?: React.ReactNode;
  /** Accessible table caption forwarded to `<Table>`. */
  caption?: string;
  /** Density preset forwarded to `<Table>`. */
  density?: TableDensity;
  /** Accessible name for the table region when `caption` / `aria-labelledby` are omitted. */
  'aria-label'?: string;
  /** Accessible labelledby ID forwarded to `<Table>`. */
  'aria-labelledby'?: string;
  className?: string;
  containerClassName?: string;
}

function useTableStateHandler<T>(
  currentValue: T,
  isControlled: boolean,
  setInternal: React.Dispatch<React.SetStateAction<T>>,
  onChange?: OnChangeFn<T>
): OnChangeFn<T> {
  const latestValueRef = React.useRef(currentValue);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    latestValueRef.current = currentValue;
    onChangeRef.current = onChange;
  });

  return React.useCallback(
    (updater) => {
      const nextValue = updater instanceof Function ? updater(latestValueRef.current) : updater;
      latestValueRef.current = nextValue;
      if (!isControlled) {
        setInternal(nextValue);
      }
      onChangeRef.current?.(nextValue);
    },
    [isControlled, setInternal]
  );
}

interface DataTableViewProps<TData extends RowData>
  extends Pick<
    DataTableProps<TData>,
    | 'searchKey'
    | 'searchPlaceholder'
    | 'enableGlobalFilter'
    | 'facetedFilters'
    | 'toolbarActions'
    | 'showToolbar'
    | 'showPagination'
    | 'showColumnVisibility'
    | 'showSelectedCount'
    | 'pageSizeOptions'
    | 'onSelectionChange'
    | 'onRowClick'
    | 'getRowAriaLabel'
    | 'loading'
    | 'loadingLabel'
    | 'emptyMessage'
    | 'caption'
    | 'density'
    | 'aria-label'
    | 'aria-labelledby'
    | 'className'
    | 'containerClassName'
  > {
  table: TanStackTable<DataTableFeatures, TData>;
  fallbackColumnCount?: number;
}

function DataTableView<TData extends RowData>({
  table,
  fallbackColumnCount = 1,
  searchKey,
  searchPlaceholder,
  enableGlobalFilter = true,
  facetedFilters,
  toolbarActions,
  showToolbar = true,
  showPagination = true,
  showColumnVisibility = true,
  showSelectedCount = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onSelectionChange,
  onRowClick,
  getRowAriaLabel,
  loading = false,
  loadingLabel = 'Loading records…',
  emptyMessage = 'No records found.',
  caption,
  density,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  containerClassName,
}: DataTableViewProps<TData>) {
  const colSpanCount = table.getVisibleLeafColumns().length || fallbackColumnCount;

  // Deduplicate selection notifications by resolved row objects so filtered inline data does not loop
  const rowSelectionState = table.state.rowSelection;
  const tableData = table.options.data;
  const tableRef = React.useRef(table);
  const prevSelectedOriginalsRef = React.useRef<TData[] | null>(null);
  const onSelectionChangeRef = React.useRef(onSelectionChange);
  React.useEffect(() => {
    tableRef.current = table;
    onSelectionChangeRef.current = onSelectionChange;
  });

  React.useEffect(() => {
    const nextSelected = tableRef.current.getSelectedRowModel().rows.map((r) => r.original);
    const prevSelected = prevSelectedOriginalsRef.current;
    if (prevSelected === null) {
      prevSelectedOriginalsRef.current = nextSelected;
      if (nextSelected.length > 0) {
        onSelectionChangeRef.current?.(nextSelected);
      }
      return;
    }
    const unchanged =
      prevSelected.length === nextSelected.length &&
      prevSelected.every((item, idx) => Object.is(item, nextSelected[idx]));
    if (!unchanged) {
      prevSelectedOriginalsRef.current = nextSelected;
      onSelectionChangeRef.current?.(nextSelected);
    }
  }, [rowSelectionState, tableData]);

  return (
    <div data-slot="data-table" className={cn('w-full flex flex-col gap-4 @container', className)}>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          enableGlobalFilter={enableGlobalFilter}
          facetedFilters={facetedFilters}
          showColumnVisibility={showColumnVisibility}
        >
          {toolbarActions}
        </DataTableToolbar>
      )}

      <Table
        elevated
        caption={caption}
        density={density}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        containerClassName={containerClassName}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | { align?: 'left' | 'center' | 'right'; numeric?: boolean }
                  | undefined;
                const isNumeric = meta?.numeric || meta?.align === 'right';
                const isCentered = meta?.align === 'center';

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={
                      header.column.getCanSort()
                        ? header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                    className={cn(
                      isNumeric && 'text-end',
                      isCentered && 'text-center'
                    )}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={colSpanCount}
                className="text-center"
              >
                <div
                  role="status"
                  aria-live="polite"
                  className="h-32 flex items-center justify-center gap-2 text-on-surface-variant font-sans text-sm"
                >
                  <Spinner size="sm" aria-hidden="true" />
                  <span>{loadingLabel}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isSelected = row.getIsSelected();

              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? 'selected' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-label={onRowClick && getRowAriaLabel ? getRowAriaLabel(row.original) : undefined}
                  onClick={
                    onRowClick
                      ? (event) => {
                          if (event.defaultPrevented) return;
                          // Ignore clicks from controls inside the row and events bubbling out of portals (menus)
                          const target = event.target as HTMLElement;
                          if (!event.currentTarget.contains(target)) return;
                          if (
                            target.closest(
                              'button, a, input, select, textarea, label, [role="checkbox"], [role="menuitem"], [role="switch"], [role="combobox"], [role="radio"], [role="slider"], [role="button"], [role="option"], [contenteditable="true"]'
                            )
                          ) {
                            return;
                          }
                          if (window.getSelection()?.toString().trim()) return;
                          onRowClick(row.original);
                        }
                      : undefined
                  }
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.target !== event.currentTarget) return;
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { align?: 'left' | 'center' | 'right'; numeric?: boolean }
                      | undefined;
                    const isNumeric = meta?.numeric || meta?.align === 'right';
                    const isCentered = meta?.align === 'center';

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          isNumeric && 'text-end font-mono tabular-nums',
                          isCentered && 'text-center'
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={colSpanCount}
                className="text-center"
              >
                <Empty variant="flush" className="my-0">
                  <EmptyHeader>
                    {typeof emptyMessage === 'string' ? (
                      <EmptyTitle>{emptyMessage}</EmptyTitle>
                    ) : (
                      <EmptyDescription className="mb-0">{emptyMessage}</EmptyDescription>
                    )}
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          showSelectedCount={showSelectedCount}
        />
      )}
    </div>
  );
}

function applyFacetedFilterFn<TData extends RowData>(
  cols: ColumnDef<DataTableFeatures, TData, unknown>[],
  facetedColumnIds: ReadonlySet<string>
): ColumnDef<DataTableFeatures, TData, unknown>[] {
  return cols.map((col) => {
    if ('columns' in col && Array.isArray(col.columns)) {
      return { ...col, columns: applyFacetedFilterFn(col.columns, facetedColumnIds) };
    }
    const accessorKey =
      'accessorKey' in col && typeof col.accessorKey === 'string' ? col.accessorKey : undefined;
    const resolvedId = col.id ?? accessorKey;
    const normalizedAccessorId = accessorKey?.replace(/\./g, '_');
    const matches =
      (resolvedId && facetedColumnIds.has(resolvedId)) ||
      (normalizedAccessorId && facetedColumnIds.has(normalizedAccessorId));
    if (matches && !('filterFn' in col && col.filterFn)) {
      return { ...col, filterFn: 'faceted' };
    }
    return col;
  });
}

function ManagedDataTable<TData extends RowData>({
  columns = [],
  data = [],
  facetedFilters,
  pageSize = 10,
  pageCount,
  manualPagination,
  manualSorting,
  manualFiltering,
  sorting: sortingProp,
  onSortingChange: onSortingChangeProp,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange: onColumnFiltersChangeProp,
  pagination: paginationProp,
  onPaginationChange: onPaginationChangeProp,
  globalFilter: globalFilterProp,
  onGlobalFilterChange: onGlobalFilterChangeProp,
  getRowId,
  ...viewProps
}: Omit<DataTableProps<TData>, 'table'>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState<string>('');

  React.useEffect(() => {
    if (paginationProp !== undefined) return;
    setInternalPagination((prev) =>
      prev.pageSize === pageSize ? prev : { ...prev, pageIndex: 0, pageSize }
    );
  }, [pageSize, paginationProp]);

  const sorting = sortingProp ?? internalSorting;
  const columnFilters = columnFiltersProp ?? internalColumnFilters;
  const pagination = paginationProp ?? internalPagination;
  const globalFilter = globalFilterProp ?? internalGlobalFilter;

  const setSorting = useTableStateHandler(
    sorting,
    sortingProp !== undefined,
    setInternalSorting,
    onSortingChangeProp
  );
  const setColumnFilters = useTableStateHandler(
    columnFilters,
    columnFiltersProp !== undefined,
    setInternalColumnFilters,
    onColumnFiltersChangeProp
  );
  const setPagination = useTableStateHandler(
    pagination,
    paginationProp !== undefined,
    setInternalPagination,
    onPaginationChangeProp
  );
  const setGlobalFilter = useTableStateHandler(
    globalFilter,
    globalFilterProp !== undefined,
    setInternalGlobalFilter,
    onGlobalFilterChangeProp
  );

  const facetedColumnIds = React.useMemo(
    () => new Set(facetedFilters?.map((f) => f.columnId)),
    [facetedFilters]
  );

  const resolvedColumns = React.useMemo<ColumnDef<DataTableFeatures, TData, unknown>[]>(
    () => (facetedColumnIds.size === 0 ? columns : applyFacetedFilterFn(columns, facetedColumnIds)),
    [columns, facetedColumnIds]
  );

  const internalTable = useTable({
    features: dataTableFeatures,
    data,
    columns: resolvedColumns,
    getRowId,
    pageCount,
    manualPagination,
    manualSorting,
    manualFiltering,
    state: {
      sorting,
      columnFilters,
      columnVisibility: internalColumnVisibility,
      rowSelection: internalRowSelection,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setInternalColumnVisibility,
    onRowSelectionChange: setInternalRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <DataTableView
      {...viewProps}
      facetedFilters={facetedFilters}
      table={internalTable}
      fallbackColumnCount={columns.length || 1}
    />
  );
}

export function DataTable<TData extends RowData>({
  table: propTable,
  ...props
}: DataTableProps<TData>) {
  if (propTable) {
    return (
      <DataTableView
        {...props}
        table={propTable}
        fallbackColumnCount={props.columns?.length || 1}
      />
    );
  }
  return <ManagedDataTable {...props} />;
}

export default DataTable;
