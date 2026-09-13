import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChartBarProps {
  label: string;
  value: number; // 0-100
  colorRole: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';
}

export const DataVisChart: React.FC = () => {
  const outcomeData: ChartBarProps[] = [
    { label: 'Correct responses', value: 85, colorRole: 'success' },
    { label: 'Incorrect responses', value: 15, colorRole: 'error' },
  ];

  const categoricalData: ChartBarProps[] = [
    { label: 'Phoneme practice', value: 72, colorRole: 'primary' },
    { label: 'Vocal fluency', value: 54, colorRole: 'secondary' },
    { label: 'Articulation drills', value: 38, colorRole: 'tertiary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Outcome Chart */}
      <div className="p-6 rounded-lg bg-surface border-none shadow-ambient">
        <h4 className="font-heading text-base font-bold text-on-surface mb-1">
          Therapy Exercise Outcome Feedback
        </h4>
        <p className="font-sans text-xs text-on-surface-variant mb-6">
          Uses semantic <span className="font-semibold text-success">success</span> and <span className="font-semibold text-error">error</span> tokens specifically for domain outcome feedback.
        </p>
        <div className="flex flex-col gap-4">
          {outcomeData.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label text-xs font-semibold text-on-surface">
                <span className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${item.colorRole === 'success' ? 'bg-success' : 'bg-error'}`}
                    aria-hidden="true"
                  />
                  {item.label}
                </span>
                <span className="font-mono text-on-surface-variant">{item.value}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30">
                <div
                  className={`h-full ${item.colorRole === 'success' ? 'bg-success' : 'bg-error'}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorical Chart */}
      <div className="p-6 rounded-lg bg-surface border-none shadow-ambient">
        <h4 className="font-heading text-base font-bold text-on-surface mb-1">
          Neutral Categorical Progress (Fixed Order)
        </h4>
        <p className="font-sans text-xs text-on-surface-variant mb-6">
          Order: <span className="font-semibold text-primary">Primary</span> → <span className="font-semibold text-secondary">Secondary</span> → <span className="font-semibold text-on-surface">Tertiary</span> (capped at 3 series).
        </p>
        <div className="flex flex-col gap-4">
          {categoricalData.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label text-xs font-semibold text-on-surface">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'w-3 h-3 rounded-full',
                      item.colorRole === 'primary' && 'bg-primary',
                      item.colorRole === 'secondary' && 'bg-secondary',
                      item.colorRole === 'tertiary' && 'bg-tertiary border-[1px] border-outline'
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </span>
                <span className="font-mono text-on-surface-variant">{item.value} mins</span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30">
                <div
                  className={cn(
                    'h-full',
                    item.colorRole === 'primary' && 'bg-primary',
                    item.colorRole === 'secondary' && 'bg-secondary',
                    item.colorRole === 'tertiary' && 'bg-tertiary border-r-[2px] border-outline'
                  )}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
