import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-[0.75rem] border border-outline-variant bg-surface', className)}>
      <table className="w-full text-left border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container/50 text-on-surface font-label font-bold text-sm">
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="h-[56px] hover:bg-surface-container/30 transition-colors">
              {columns.map((col, cIdx) => (
                <td key={cIdx} className="px-6 py-4 text-on-surface">
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
