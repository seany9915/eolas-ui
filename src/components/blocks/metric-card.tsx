/**
 * MetricCard block.
 *
 * Presentational metric card for clinical analytics, caseload overviews, and progress monitoring.
 * Composes Card, Badge, and Icon primitives with tabular numbers, ambient elevation,
 * and high-contrast clinical status tokens.
 */
import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  badge?: React.ReactNode;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      icon,
      change,
      changeType = 'neutral',
      description,
      badge,
      className,
      ...props
    },
    ref
  ) => {
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
      <Card ref={ref} className={cn('w-full', className)} {...props}>
        <Card.Header>
          <span className="font-label text-xs font-semibold text-on-surface-variant truncate self-center">
            {title}
          </span>
          {icon && (
            <div
              data-slot="card-action"
              className="col-start-2 row-start-1 self-center justify-self-end flex items-center justify-center w-8 h-8 rounded-md bg-surface-container text-on-surface-variant shrink-0"
            >
              <Icon name={icon} size="md" aria-hidden="true" />
            </div>
          )}
        </Card.Header>

        <Card.Content className="space-y-2 mt-3.5 pt-0">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-heading font-bold text-3xl text-on-surface tabular-nums tracking-tight">
              {value}
            </span>
            {change && (
              <Badge
                variant="outline"
                colorRole={roleMap[changeType]}
                size="sm"
              >
                <Icon
                  name={trendIconMap[changeType]}
                  size="xs"
                  aria-hidden="true"
                />
                <span>{change}</span>
              </Badge>
            )}
            {badge}
          </div>

          {description && (
            <Card.Description>
              {description}
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';

export default MetricCard;
