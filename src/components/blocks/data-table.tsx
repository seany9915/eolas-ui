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
  type Column,
  type ColumnDef,
  type Row,
  type Cell,
  type Header,
  type HeaderGroup,
  type FilterFn,
  type SortingFn,
  type OnChangeFn,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  type Table as TanStackTable,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Menu } from '@/components/ui/menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

/* -------------------------------------------------------------------------------------------------
 * Re-export TanStack Table Types & Utilities
 * -----------------------------------------------------------------------------------------------*/
export type {
  ColumnDef,
  Column,
  Row,
  Cell,
  Header,
  HeaderGroup,
  TanStackTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  FilterFn,
  SortingFn,
  OnChangeFn,
};

export { flexRender };

/* -------------------------------------------------------------------------------------------------
 * Helper: Row Selection Column Generator
 * -----------------------------------------------------------------------------------------------*/
export function createSelectColumn<TData>(): ColumnDef<TData, any> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
          aria-label="Select all rows on current page"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label="Select row"
        />
      </div>
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

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: DataTableRowAction<TData>[];
  children?: React.ReactNode;
  className?: string;
}

export function DataTableRowActions<TData>({
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
                      <span className="font-mono text-xs text-on-surface-variant ml-2">
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

export function createActionsColumn<TData>(
  actions:
    | DataTableRowAction<TData>[]
    | ((row: TData) => React.ReactNode)
): ColumnDef<TData, any> {
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
export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
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
          'text-xs font-semibold text-on-surface',
          isNumeric && 'text-right font-mono tabular-nums',
          isCentered && 'text-center',
          className
        )}
        {...props}
      >
        {title}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        isNumeric ? 'justify-end' : isCentered ? 'justify-center' : 'justify-start',
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
            <span className={cn(isNumeric && 'font-mono tabular-nums')}>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <Icon name="arrow_downward" size="xs" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <Icon name="arrow_upward" size="xs" aria-hidden="true" />
            ) : (
              <Icon name="unfold_more" size="xs" aria-hidden="true" />
            )}
          </Button>
        }
      >
        <Menu.Item onClick={() => column.toggleSorting(false)}>
          <Icon name="arrow_upward" size="xs" className="mr-2" aria-hidden="true" />
          <span>Asc</span>
        </Menu.Item>
        <Menu.Item onClick={() => column.toggleSorting(true)}>
          <Icon name="arrow_downward" size="xs" className="mr-2" aria-hidden="true" />
          <span>Desc</span>
        </Menu.Item>
        {column.getIsSorted() && (
          <Menu.Item onClick={() => column.clearSorting()}>
            <Icon name="clear" size="xs" className="mr-2" aria-hidden="true" />
            <span>Clear sort</span>
          </Menu.Item>
        )}
        {column.getCanHide() && (
          <>
            <Menu.Separator />
            <Menu.Item onClick={() => column.toggleVisibility(false)}>
              <Icon name="visibility_off" size="xs" className="mr-2" aria-hidden="true" />
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
export interface DataTableViewOptionsProps<TData> {
  table: TanStackTable<TData>;
  className?: string;
}

export function DataTableViewOptions<TData>({
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
 * DataTableFacetedFilter
 * -----------------------------------------------------------------------------------------------*/
export interface DataTableFacetedFilterOption {
  label: string;
  value: string;
  icon?: string;
}

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: DataTableFacetedFilterOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Menu
      side="bottom"
      align="start"
      trigger={
        <Button variant="outline" size="sm" colorRole="neutral">
          <Icon name="filter_list" size="xs" aria-hidden="true" />
          <span>{title}</span>
          {selectedValues?.size > 0 && (
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
          return (
            <Menu.CheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={() => {
                if (isSelected) {
                  selectedValues.delete(option.value);
                } else {
                  selectedValues.add(option.value);
                }
                const filterValues = Array.from(selectedValues);
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
                {facets?.get(option.value) && (
                  <span className="font-mono text-xs text-on-surface-variant tabular-nums">
                    {facets.get(option.value)}
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
export interface DataTableToolbarProps<TData> {
  table: TanStackTable<TData>;
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

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Filter records…',
  facetedFilters,
  showColumnVisibility = true,
  enableGlobalFilter = true,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter);
  const targetColumn = searchKey ? table.getColumn(searchKey) : undefined;
  const searchVal = (targetColumn?.getFilterValue() as string) ?? '';
  const globalVal = (table.getState().globalFilter as string) ?? '';

  return (
    <div className="flex flex-col @sm:flex-row items-stretch @sm:items-center justify-between gap-3 w-full">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchKey && targetColumn ? (
          <Input
            size="sm"
            type="search"
            enterKeyHint="search"
            clearable
            placeholder={searchPlaceholder}
            value={searchVal}
            onChange={(event) => targetColumn.setFilterValue(event.target.value)}
            onClear={() => targetColumn.setFilterValue('')}
            leadingIcon={<Icon name="search" size="xs" aria-hidden="true" />}
            className="w-full @sm:max-w-xs"
          />
        ) : enableGlobalFilter ? (
          <Input
            size="sm"
            type="search"
            enterKeyHint="search"
            clearable
            placeholder={searchPlaceholder}
            value={globalVal}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            onClear={() => table.setGlobalFilter('')}
            leadingIcon={<Icon name="search" size="xs" aria-hidden="true" />}
            className="w-full @sm:max-w-xs"
          />
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
export interface DataTablePaginationProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: TanStackTable<TData>;
  pageSizeOptions?: number[];
  showSelectedCount?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showSelectedCount = true,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

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
      <div className="flex flex-wrap items-center gap-4 @lg:gap-8 ml-auto">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-on-surface-variant select-none">
            Rows per page
          </span>
          <Select
            options={pageSizeOptions.map((size) => ({
              label: String(size),
              value: String(size),
            }))}
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(val) => {
              if (val) table.setPageSize(Number(val));
            }}
            size="sm"
          />
        </div>
        <div className="flex items-center justify-center font-sans text-xs text-on-surface font-medium min-w-24 select-none">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {Math.max(1, table.getPageCount())}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            colorRole="neutral"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <Icon name="first_page" size="xs" aria-hidden="true" />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="outline"
            colorRole="neutral"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Icon name="chevron_left" size="xs" aria-hidden="true" />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="outline"
            colorRole="neutral"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Icon name="chevron_right" size="xs" aria-hidden="true" />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="outline"
            colorRole="neutral"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <Icon name="last_page" size="xs" aria-hidden="true" />
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
export interface DataTableProps<TData, TValue = unknown> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  /** Optional external TanStack table instance if managing table state externally */
  table?: TanStackTable<TData>;
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
  /** Callback emitted whenever selected rows change */
  onSelectionChange?: (selectedRows: TData[]) => void;
  /** Callback emitted when clicking a table row */
  onRowClick?: (row: TData) => void;
  /** Displays a loading state with spinner in the table body */
  loading?: boolean;
  /** Custom message rendered when no records match the criteria */
  emptyMessage?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function DataTable<TData, TValue>({
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
  onRowClick,
  loading = false,
  emptyMessage = 'No records found.',
  className,
  containerClassName,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>({});
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

  const setSorting = onSortingChangeProp ?? setInternalSorting;
  const setColumnFilters = onColumnFiltersChangeProp ?? setInternalColumnFilters;
  const setPagination = onPaginationChangeProp ?? setInternalPagination;
  const setGlobalFilter = onGlobalFilterChangeProp ?? setInternalGlobalFilter;

  const internalTable = useReactTable({
    data,
    columns,
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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const table = propTable ?? internalTable;
  const colSpanCount = table.getAllColumns()?.length || columns.length || 1;

  // Emit row selection callback
  React.useEffect(() => {
    if (onSelectionChange) {
      const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.original);
      onSelectionChange(selected);
    }
  }, [internalRowSelection, table, onSelectionChange]);

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

      <div
        className={cn(
          'relative w-full overflow-x-auto rounded-md border border-outline-variant bg-surface shadow-ambient',
          containerClassName
        )}
      >
        <Table>
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
                      className={cn(
                        isNumeric && 'text-right',
                        isCentered && 'text-center'
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <span className="inline-flex animate-spin">
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
                    onClick={() => onRowClick?.(row.original)}
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
                            isNumeric && 'text-right font-mono tabular-nums',
                            isCentered && 'text-center'
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      </div>

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
