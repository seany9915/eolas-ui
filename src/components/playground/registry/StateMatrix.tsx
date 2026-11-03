import * as React from 'react';

export interface StateItem {
  label: string;
  element: React.ReactNode;
  note?: string;
}

export interface StateMatrixProps {
  items: StateItem[];
}

export const StateMatrix: React.FC<StateMatrixProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-between p-3 rounded-lg bg-surface-container/30 border border-outline-variant/40 gap-3"
        >
          <span className="font-heading text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
            {item.label}
          </span>
          <div className="flex items-center justify-center min-h-[48px] w-full">
            {item.element}
          </div>
          {item.note && (
            <span className="font-mono text-[10px] text-on-surface-variant text-center">
              {item.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
