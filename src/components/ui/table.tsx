/**
 * Table primitive.
 *
 * Platform Reference: Modern Web Guidance (MWG: responsive-table)
 *
 * TAXONOMY & USAGE:
 * - A data table primitive supporting standard horizontal scroll or responsive container-query card stacking.
 * - When responsive="stack", transforms rows into accessible stacked cards on narrow container widths (@container width < 600px).
 * - Implements explicit column header semantics (scope="col") and 56px minimum row heights for OS text zoom adaptability.
 * - Supports column-level alignment ('left' | 'right' | 'center') and automatic tabular number formatting (numeric: true).
 * - Numerical columns (percentages, scores, durations, metrics) right-align both headers and cells with tabular-nums.
 * - Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

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

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  className?: string;
  /** Responsive layout behavior. 'scroll' preserves tabular overflow-x; 'stack' wraps into cards on narrow screens */
  responsive?: 'scroll' | 'stack';
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className,
  responsive = 'scroll',
}: TableProps<T>) {
  const isStack = responsive === 'stack';

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-md border border-outline-variant bg-surface',
        isStack && '@container',
        className
      )}
    >
      <table className="w-full text-left border-collapse font-sans text-sm">
        <thead className={cn(isStack && '@max-sm:hidden')}>
          <tr className="border-b border-outline-variant bg-surface-container/50 text-on-surface font-label font-bold text-sm">
            {columns.map((col, idx) => {
              const effectiveAlign = col.align ?? (col.numeric ? 'right' : 'left');
              const alignClass =
                effectiveAlign === 'right'
                  ? 'text-right'
                  : effectiveAlign === 'center'
                    ? 'text-center'
                    : 'text-left';
              const numericClass = col.numeric ? 'font-mono tabular-nums' : '';

              return (
                <th
                  key={idx}
                  scope="col"
                  className={cn('px-6 py-4 font-semibold', alignClass, numericClass, col.className)}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={cn('divide-y divide-outline-variant', isStack && '@max-sm:divide-y-0 @max-sm:space-y-3 @max-sm:block @max-sm:p-3')}>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={cn(
                'min-h-[56px] hover:bg-surface-container/30 transition-colors',
                isStack && '@max-sm:block @max-sm:p-4 @max-sm:rounded-lg @max-sm:border @max-sm:border-outline-variant @max-sm:bg-surface'
              )}
            >
              {columns.map((col, cIdx) => {
                const effectiveAlign = col.align ?? (col.numeric ? 'right' : 'left');
                const alignClass =
                  effectiveAlign === 'right'
                    ? 'text-right'
                    : effectiveAlign === 'center'
                      ? 'text-center'
                      : 'text-left';
                const numericClass = col.numeric ? 'font-mono tabular-nums' : '';

                return (
                  <td
                    key={cIdx}
                    className={cn(
                      'px-6 py-4 text-on-surface',
                      alignClass,
                      numericClass,
                      col.className,
                      isStack && '@max-sm:flex @max-sm:items-center @max-sm:justify-between @max-sm:px-0 @max-sm:py-2 @max-sm:border-b @max-sm:border-outline-variant/40 @max-sm:last:border-b-0'
                    )}
                  >
                    {isStack && (
                      <span className="hidden @max-sm:inline-block font-label text-xs font-semibold text-on-surface-variant mr-3 select-none">
                        {col.header}
                      </span>
                    )}
                    <span className={cn(effectiveAlign === 'right' && isStack && '@max-sm:text-right')}>
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
