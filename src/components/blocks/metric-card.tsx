/**
 * MetricCard block.
 *
 * Presentational metric card for clinical analytics, caseload overviews, and progress monitoring.
 * Composes Card, Chip, and Icon primitives with tabular numbers, ambient elevation,
 * and high-contrast clinical status tokens.
 */
import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  badge?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  description,
  badge,
  className,
}: MetricCardProps) {
  const roleMap: Record<NonNullable<MetricCardProps['changeType']>, 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'neutral'> = {
    positive: 'success',
    negative: 'error',
    neutral: 'neutral',
  };

  const trendIconMap: Record<NonNullable<MetricCardProps['changeType']>, string> = {
    positive: 'trending_up',
    negative: 'trending_down',
    neutral: 'trending_flat',
  };

  return (
    <Card className={cn('w-full', className)}>
      <div className="flex flex-row items-center justify-between">
        <span className="font-label text-xs font-semibold text-on-surface-variant truncate">
          {title}
        </span>
        {icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-container text-on-surface-variant shrink-0">
            <Icon name={icon} size="md" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="space-y-2 mt-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-heading font-bold text-3xl text-on-surface tabular-nums tracking-tight">
            {value}
          </span>
          {change && (
            <Chip
              variant="outline"
              colorRole={roleMap[changeType]}
            >
              <Icon
                name={trendIconMap[changeType]}
                size="sm"
                aria-hidden="true"
              />
              {change}
            </Chip>
          )}
          {badge}
        </div>

        {description && (
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}

export default MetricCard;
