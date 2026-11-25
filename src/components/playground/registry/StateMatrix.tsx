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
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 gap-3 min-w-0"
        >
          <span className="font-heading text-xs font-semibold text-on-surface-variant text-center">
            {item.label}
          </span>
          <div className="flex items-center justify-center min-h-[48px] w-full min-w-0">
            {item.element}
          </div>
          {item.note && (
            <span className="font-mono text-xs font-semibold text-on-surface-variant text-center">
              {item.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
