/**
 * DataTable composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from Base UI primitives, TanStack Table, and design tokens:
 *             - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (`src/components/ui/table.tsx`)
 *             - `Button` (`src/components/ui/button.tsx`)
 *             - `Input` (`src/components/ui/input.tsx`)
 *             - `Select` (`src/components/ui/select.tsx`)
 *             - `Menu` (`src/components/ui/menu.tsx`)
 *             - `Checkbox` (`src/components/ui/checkbox.tsx`)
 *             - `Badge` (`src/components/ui/badge.tsx`)
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
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Menu } from '@/components/ui/menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
export function createSelectColumn<TData extends RowData>(): ColumnDef<DataTableFeatures, TData, unknown> {
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
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label="Select row"
      />
    ),
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
  children?: React.ReactNode;
  className?: string;
}

export function DataTableRowActions<TData extends RowData>({
  row,
  actions,
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
            variant="ghost"
            size="icon"
            colorRole="neutral"
            aria-label="Open menu"
          >
            <Icon name="more_horiz" size="xs" aria-hidden="true" />
          </Button>
        }
      >
        {children ? (
          children
        ) : actions && actions.length > 0 ? (
          <>
            {actions.map((action, idx) => (
              <React.Fragment key={action.id || action.label || idx}>
                {action.destructive && idx > 0 && <Menu.Separator />}
                <Menu.Item
                  destructive={action.destructive}
                  disabled={action.disabled}
                  icon={action.icon}
                  onClick={() => action.onClick(row.original)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{action.label}</span>
                    {action.shortcut && (
                      <span className="font-mono text-xs text-on-surface-variant ms-2">
                        {action.shortcut}
                      </span>
                    )}
                  </div>
                </Menu.Item>
              </React.Fragment>
            ))}
          </>
        ) : null}
      </Menu>
    </div>
  );
}

export function createActionsColumn<TData extends RowData>(
  actions:
    | DataTableRowAction<TData>[]
    | ((row: TData) => React.ReactNode)
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
      return <DataTableRowActions row={row} actions={actions} />;
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

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        isNumeric ? 'justify-end -me-3.5' : isCentered ? 'justify-center' : 'justify-start -ms-3.5',
        className
      )}
      {...props}
    >
      <Menu
        side="bottom"
        align={isNumeric ? 'end' : 'start'}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            colorRole="neutral"
          >
            {isNumeric && sortIcon}
            <span className={cn(isNumeric && 'font-mono tabular-nums')}>{title}</span>
            {!isNumeric && sortIcon}
          </Button>
        }
      >
        <Menu.Item icon="arrow_upward" onClick={() => column.toggleSorting(false)}>
          <span>Asc</span>
        </Menu.Item>
        <Menu.Item icon="arrow_downward" onClick={() => column.toggleSorting(true)}>
          <span>Desc</span>
        </Menu.Item>
        {column.getIsSorted() && (
          <Menu.Item icon="clear" onClick={() => column.clearSorting()}>
            <span>Clear sort</span>
          </Menu.Item>
        )}
        {column.getCanHide() && (
          <>
            <Menu.Separator />
            <Menu.Item icon="visibility_off" onClick={() => column.toggleVisibility(false)}>
              <span>Hide</span>
            </Menu.Item>
          </>
        )}
      </Menu>
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
              <Badge variant="outline" colorRole="neutral" size="sm">
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
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <Icon name={option.icon} size="xs" aria-hidden="true" />
                  )}
                  <span>{option.label}</span>
                </div>
                {facetCount > 0 && (
                  <span className="font-mono text-xs text-on-surface-variant tabular-nums">
                    {facetCount}
                  </span>
                )}
              </div>
            </Menu.CheckboxItem>
          );
        })}
        {selectedValues.size > 0 && (
          <>
            <Menu.Separator />
            <Menu.Item onClick={() => column?.setFilterValue(undefined)}>
              <div className="w-full text-center font-medium">Clear filters</div>
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
  const isFiltered =
    table.state.columnFilters.length > 0 ||
    Boolean(table.state.globalFilter);
  const targetColumn = searchKey ? table.getColumn(searchKey) : undefined;
  const searchVal = (targetColumn?.getFilterValue() as string) ?? '';
  const globalVal = (table.state.globalFilter as string) ?? '';

  return (
    <div className="flex flex-col @sm:flex-row items-stretch @sm:items-center justify-between gap-3 w-full">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchKey && targetColumn ? (
          <Field.Root className="w-full @sm:max-w-xs">
            <Field.Label htmlFor={searchInputId} className="sr-only">
              {searchPlaceholder}
            </Field.Label>
            <Input
              id={searchInputId}
              size="sm"
              type="search"
              enterKeyHint="search"
              clearable
              placeholder={searchPlaceholder}
              value={searchVal}
              onChange={(event) => targetColumn.setFilterValue(event.target.value)}
              onClear={() => targetColumn.setFilterValue('')}
              leadingIcon={<Icon name="search" size="xs" aria-hidden="true" />}
              className="w-full"
            />
          </Field.Root>
        ) : enableGlobalFilter ? (
          <Field.Root className="w-full @sm:max-w-xs">
            <Field.Label htmlFor={searchInputId} className="sr-only">
              {searchPlaceholder}
            </Field.Label>
            <Input
              id={searchInputId}
              size="sm"
              type="search"
              enterKeyHint="search"
              clearable
              placeholder={searchPlaceholder}
              value={globalVal}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              onClear={() => table.setGlobalFilter('')}
              leadingIcon={<Icon name="search" size="xs" aria-hidden="true" />}
              className="w-full"
            />
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
      <div className="flex items-center gap-2 self-end @sm:self-auto">
        {children}
        {showColumnVisibility && <DataTableViewOptions table={table} />}
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
      className={cn(
        'flex flex-col @sm:flex-row items-center justify-between gap-4 py-2 px-1 w-full',
        className
      )}
      {...props}
    >
      {showSelectedCount && (
        <div className="font-sans text-xs text-on-surface-variant flex-1 select-none">
          {selectedCount} of {totalCount} row(s) selected.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 @lg:gap-8 ms-auto">
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
        <div className="flex items-center justify-center font-sans text-xs text-on-surface font-medium min-w-24 select-none">
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
  );
}

/* -------------------------------------------------------------------------------------------------
 * Master Composite Block: DataTable
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableProps<TData extends RowData> {
  columns?: ColumnDef<DataTableFeatures, TData, any>[];
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
  /** Callback emitted when activating a table row by click, or Enter/Space when the row itself has focus */
  onRowClick?: (row: TData) => void;
  /** Displays a loading state with spinner in the table body */
  loading?: boolean;
  /** Custom message rendered when no records match the criteria */
  emptyMessage?: React.ReactNode;
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

export function DataTable<TData extends RowData>({
  columns = [],
  data = [],
  table: propTable,
  searchKey,
  searchPlaceholder,
  enableGlobalFilter = true,
  facetedFilters,
  toolbarActions,
  showToolbar = true,
  showPagination = true,
  showColumnVisibility = true,
  showSelectedCount = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
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
  onSelectionChange,
  getRowId,
  onRowClick,
  loading = false,
  emptyMessage = 'No records found.',
  className,
  containerClassName,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState<string>('');

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

  const applyFacetedFilterFn = React.useCallback(
    (cols: ColumnDef<DataTableFeatures, TData, any>[]): ColumnDef<DataTableFeatures, TData, any>[] =>
      cols.map((col) => {
        if ('columns' in col && Array.isArray(col.columns)) {
          return { ...col, columns: applyFacetedFilterFn(col.columns) };
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
      }),
    [facetedColumnIds]
  );

  const resolvedColumns = React.useMemo<ColumnDef<DataTableFeatures, TData, any>[]>(
    () => (facetedColumnIds.size === 0 ? columns : applyFacetedFilterFn(columns)),
    [columns, facetedColumnIds, applyFacetedFilterFn]
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

  const table = propTable ?? internalTable;
  const colSpanCount = table.getVisibleLeafColumns().length || columns.length || 1;

  // Read selection from the table via ref so changing table identities do not loop selection notifications
  const rowSelectionState = table.state.rowSelection;
  const tableData = table.options.data;
  const tableRef = React.useRef(table);
  const hasMountedSelectionRef = React.useRef(false);
  const onSelectionChangeRef = React.useRef(onSelectionChange);
  React.useEffect(() => {
    tableRef.current = table;
    onSelectionChangeRef.current = onSelectionChange;
  });

  React.useEffect(() => {
    if (!hasMountedSelectionRef.current) {
      hasMountedSelectionRef.current = true;
      if (Object.keys(rowSelectionState).length === 0) {
        return;
      }
    }
    onSelectionChangeRef.current?.(
      tableRef.current.getSelectedRowModel().rows.map((r) => r.original)
    );
  }, [rowSelectionState, tableData]);

  return (
    <div className={cn('w-full flex flex-col gap-4 @container', className)}>
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

      <Table elevated containerClassName={containerClassName}>
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
                  <div className="h-32 flex items-center justify-center gap-2 text-on-surface-variant font-sans text-sm">
                    <span className="inline-flex animate-spin motion-reduce:animate-none">
                      <Icon
                        name="progress_activity"
                        size="sm"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Loading records…</span>
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
                    onClick={
                      onRowClick
                        ? (event) => {
                            // Ignore clicks from controls inside the row and events bubbling out of portals (menus)
                            const target = event.target as HTMLElement;
                            if (!event.currentTarget.contains(target)) return;
                            if (target.closest('button, a, input, select, textarea, label, [role="checkbox"], [role="menuitem"]')) return;
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
                  <div className="h-32 flex items-center justify-center text-on-surface-variant font-sans text-sm">
                    {emptyMessage}
                  </div>
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

export default DataTable;
