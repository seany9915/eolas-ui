'use client';

/**
 * Table primitive.
 *
 * Platform Reference:
 * - Modern Web Guidance (MWG: responsive-table)
 * - Shadcn UI Table: https://ui.shadcn.com/docs/components/base/table
 *
 * TAXONOMY & USAGE:
 * - Dual-mode data table primitive supporting:
 *   1. Atomic compound composition (<Table>, <Table.Header>, <Table.Body>, <Table.Row>, <Table.Head>, <Table.Cell>, <Table.Footer>, <Table.Caption>).
 *   2. Declarative data-driven mode (<Table columns={...} data={...} keyExtractor={...} responsive="stack" />)
 *      with automatic container-query card stacking (@container).
 * - Implements explicit column header semantics (scope="col"), 56px minimum row heights for OS text zoom adaptability,
 *   and automatic tabular-nums on numeric columns.
 * - Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useHorizontalScrollFade } from '@/lib/use-horizontal-scroll-fade';

export type TableDensity = 'compact' | 'comfortable' | 'spacious';

/* -------------------------------------------------------------------------------------------------
 * Data-Driven Types
 * -----------------------------------------------------------------------------------------------*/
export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Text alignment for the column header and cells. Defaults to 'right' if numeric is true, else 'left'. */
  align?: 'left' | 'right' | 'center';
  /** Whether the column represents numeric data (scores, timestamps, percentages, metrics). Automatically enables tabular-nums and right alignment. */
  numeric?: boolean;
  /** Optional class name overrides for the column header and cell */
  className?: string;
}

export interface DataDrivenTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  className?: string;
  containerClassName?: string;
  /** Responsive layout behavior. 'scroll' preserves tabular overflow-x; 'stack' wraps into cards on narrow screens */
  responsive?: 'scroll' | 'stack';
  /** Density mode ('compact' | 'comfortable' | 'spacious'). Also inherits `--density` via CSS container style queries. */
  density?: TableDensity;
  /** Applies ambient elevation shadow to the outer table container. */
  elevated?: boolean;
  /** Optional accessible table caption. When provided, enables role="region" on the scroll container. */
  caption?: string;
  /** Optional accessible label. When provided, enables role="region" on the scroll container. */
  'aria-label'?: string;
  /** Optional accessible labelledby ID. When provided, enables role="region" on the scroll container. */
  'aria-labelledby'?: string;
}

export type TableProps<T = unknown> =
  | (React.HTMLAttributes<HTMLTableElement> & {
      columns?: never;
      data?: never;
      containerClassName?: string;
      responsive?: 'scroll' | 'stack';
      density?: TableDensity;
      elevated?: boolean;
      caption?: string;
    })
  | DataDrivenTableProps<T>;

/* -------------------------------------------------------------------------------------------------
 * Atomic Subcomponents (Compound Architecture)
 * -----------------------------------------------------------------------------------------------*/
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn('[&_tr]:border-b border-outline-variant bg-surface-container-high/50 text-on-surface font-label font-bold text-sm', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn('divide-y divide-outline-variant [&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      'border-t border-outline-variant bg-surface-container-high/50 font-medium font-sans text-on-surface [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot="table-row"
    className={cn(
      'border-b border-outline-variant transition-colors hover:bg-state-hover data-[state=selected]:bg-surface-container-low data-[state=selected]:hover:bg-surface-container-high min-h-[var(--density-table-row-min-h,3.5rem)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, scope = 'col', ...props }, ref) => (
  <th
    ref={ref}
    scope={scope}
    data-slot="table-head"
    className={cn(
      'h-12 px-[var(--density-table-cell-px,1rem)] py-[var(--density-table-cell-py,0.75rem)] text-start align-middle font-semibold text-on-surface font-label [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn(
      'px-[var(--density-table-cell-px,1rem)] py-[var(--density-table-cell-py,0.875rem)] align-middle text-on-surface font-sans text-sm [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn('mt-4 text-xs font-sans text-on-surface-variant', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

/* -------------------------------------------------------------------------------------------------
 * Root Table Component (Supports both compound children and declarative data mode)
 * -----------------------------------------------------------------------------------------------*/
export const TableComponent = React.forwardRef<HTMLTableElement, TableProps<any>>(
  (props, ref) => {
    const isDataDriven = 'columns' in props && Array.isArray(props.columns) && Array.isArray(props.data);
    const responsive = props.responsive ?? 'scroll';
    const density = props.density;
    const isStack = responsive === 'stack';
    const captionId = React.useId();
    const { ref: scrollFadeRef, isScrollable } = useHorizontalScrollFade<HTMLDivElement>(undefined, {
      disabled: isStack,
    });

    // Declarative data-driven mode
    if (isDataDriven) {
      const {
        columns,
        data,
        keyExtractor,
        className,
        containerClassName,
        elevated,
        caption,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
      } = props as DataDrivenTableProps<any>;

      const regionAriaLabel = ariaLabel;
      const regionAriaLabelledBy = ariaLabelledBy ?? (caption ? captionId : undefined);
      const hasAccessibleName = Boolean(regionAriaLabel || regionAriaLabelledBy);

      return (
        <div
          ref={scrollFadeRef}
          data-slot="table-container"
          data-density={density}
          role={hasAccessibleName ? 'region' : undefined}
          aria-label={hasAccessibleName ? regionAriaLabel : undefined}
          aria-labelledby={hasAccessibleName ? regionAriaLabelledBy : undefined}
          tabIndex={isScrollable ? 0 : undefined}
          style={density ? ({ '--density': density } as React.CSSProperties) : undefined}
          className={cn(
            'w-full overflow-x-auto rounded-md border border-outline-variant bg-surface',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            elevated && 'shadow-ambient',
            !isStack && 'scroll-shadow-x',
            isStack && '@container',
            containerClassName
          )}
        >
          <table
            ref={ref}
            data-slot="table"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn('w-full caption-bottom text-start border-collapse font-sans text-sm', className)}
          >
            {caption && (
              <TableCaption id={captionId}>{caption}</TableCaption>
            )}
            <thead className={cn(isStack && '@max-sm:hidden')}>
              <tr data-slot="table-row" className="border-b border-outline-variant bg-surface-container-high/50 text-on-surface font-label font-bold text-sm">
                {columns.map((col, idx) => {
                  const effectiveAlign = col.align ?? (col.numeric ? 'right' : 'left');
                  const alignClass =
                    effectiveAlign === 'right'
                      ? 'text-end'
                      : effectiveAlign === 'center'
                        ? 'text-center'
                        : 'text-start';
                  const numericClass = col.numeric ? 'font-mono tabular-nums' : '';

                  return (
                    <th
                      key={idx}
                      scope="col"
                      data-slot="table-head"
                      className={cn('h-12 px-4 py-3.5 font-semibold', alignClass, numericClass, col.className)}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody
              className={cn(
                'divide-y divide-outline-variant',
                isStack && '@max-sm:divide-y-0 @max-sm:flex @max-sm:flex-col @max-sm:gap-3 @max-sm:p-3'
              )}
            >
              {data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  data-slot="table-row"
                  className={cn(
                    'min-h-14 hover:bg-state-hover transition-colors',
                    isStack &&
                      '@max-sm:block @max-sm:p-4 @max-sm:rounded-lg @max-sm:border @max-sm:border-outline-variant @max-sm:bg-surface'
                  )}
                >
                  {columns.map((col, cIdx) => {
                    const effectiveAlign = col.align ?? (col.numeric ? 'right' : 'left');
                    const alignClass =
                      effectiveAlign === 'right'
                        ? 'text-end'
                        : effectiveAlign === 'center'
                          ? 'text-center'
                          : 'text-start';
                    const numericClass = col.numeric ? 'font-mono tabular-nums' : '';

                    return (
                      <td
                        key={cIdx}
                        data-slot="table-cell"
                        className={cn(
                          'px-4 py-3.5 text-on-surface',
                          alignClass,
                          numericClass,
                          col.className,
                          isStack &&
                            '@max-sm:flex @max-sm:items-center @max-sm:justify-between @max-sm:px-0 @max-sm:py-2 @max-sm:border-b @max-sm:border-outline-variant/40 @max-sm:last:border-b-0'
                        )}
                      >
                        {isStack && (
                          <span className="hidden @max-sm:inline-block font-label text-xs font-semibold text-on-surface-variant me-3 select-none">
                            {col.header}
                          </span>
                        )}
                        <span className={cn(effectiveAlign === 'right' && isStack && '@max-sm:text-end')}>
                          {typeof col.accessor === 'function'
                            ? col.accessor(row)
                            : (row[col.accessor] as React.ReactNode)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Composable compound mode (shadcn standard anatomy)
    const {
      className,
      containerClassName,
      children,
      responsive: _responsive,
      density: _density,
      elevated,
      caption,
      ...tableProps
    } = props as React.HTMLAttributes<HTMLTableElement> & {
      containerClassName?: string;
      responsive?: 'scroll' | 'stack';
      density?: TableDensity;
      elevated?: boolean;
      caption?: string;
    };

    let inferredCaptionLabel: string | undefined;
    let inferredCaptionId: string | undefined;
    if (!tableProps['aria-label'] && !tableProps['aria-labelledby'] && !caption) {
      React.Children.forEach(children, (child) => {
        if (
          React.isValidElement<{ id?: string; children?: React.ReactNode }>(child) &&
          (child.type === TableCaption || child.type === 'caption')
        ) {
          if (child.props.id) {
            inferredCaptionId = child.props.id;
          } else if (typeof child.props.children === 'string' && child.props.children.trim()) {
            inferredCaptionLabel = child.props.children.trim();
          }
        }
      });
    }

    const regionAriaLabel = tableProps['aria-label'] ?? inferredCaptionLabel;
    const regionAriaLabelledBy =
      tableProps['aria-labelledby'] ?? (caption ? captionId : inferredCaptionId);
    const hasAccessibleName = Boolean(regionAriaLabel || regionAriaLabelledBy);

    return (
      <div
        ref={scrollFadeRef}
        data-slot="table-container"
        data-density={density}
        role={hasAccessibleName ? 'region' : undefined}
        aria-label={hasAccessibleName ? regionAriaLabel : undefined}
        aria-labelledby={hasAccessibleName ? regionAriaLabelledBy : undefined}
        tabIndex={isScrollable ? 0 : undefined}
        style={density ? ({ '--density': density } as React.CSSProperties) : undefined}
        className={cn(
          'relative w-full overflow-x-auto rounded-md border border-outline-variant bg-surface',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          elevated && 'shadow-ambient',
          !isStack && 'scroll-shadow-x',
          isStack && '@container',
          containerClassName
        )}
      >
        <table
          ref={ref}
          data-slot="table"
          className={cn('w-full caption-bottom text-start border-collapse font-sans text-sm', className)}
          {...tableProps}
        >
          {caption && <TableCaption id={captionId}>{caption}</TableCaption>}
          {children}
        </table>
      </div>
    );
  }
);
TableComponent.displayName = 'Table';

/* -------------------------------------------------------------------------------------------------
 * Compound Object Export
 * -----------------------------------------------------------------------------------------------*/
export const Table = Object.assign(TableComponent, {
  Root: TableComponent,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});

export default Table;
