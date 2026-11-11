/**
 * ChartCard block.
 *
 * Shared presentational shell for data visualization cards.
 * Composes Card, Badge, Skeleton, and Empty primitives with container-query
 * responsiveness (@container), loading skeletons, zero-data empty states,
 * subgrid row alignment, and trend badges.
 */
import * as React from 'react';
import { Card, type CardProps } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { cn } from '@/lib/utils';

export interface ChartCardTrend {
  value: string;
  positive?: boolean;
  label?: string;
}

export interface ChartCardProps
  extends Omit<
    CardProps,
    | 'title'
    | 'children'
    | 'prominence'
    | 'affordance'
    | 'variant'
    | 'selected'
    | 'colorRole'
    | 'invertedAccent'
    | 'spotlightAccent'
  > {
  title: React.ReactNode;
  titleBadge?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  trend?: ChartCardTrend;
  footer?: React.ReactNode;
  loading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  /** Accessible chart container sizing shared across chart and loading skeleton states. */
  contentClassName?: string;
  /** Visual shape of the loading Skeleton placeholder. */
  skeletonShape?: 'rect' | 'circle' | 'gauge';
  children?: React.ReactNode;
}

export const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  (
    {
      title,
      titleBadge,
      description,
      action,
      trend,
      footer,
      loading = false,
      isEmpty = false,
      emptyTitle = 'No chart data',
      emptyDescription = 'Data will appear here once recorded.',
      emptyIcon = 'monitoring',
      size = 'default',
      subgrid = false,
      lift = false,
      contentClassName,
      skeletonShape = 'rect',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasFooter = Boolean(trend || footer);

    return (
      <Card
        ref={ref}
        size={size}
        subgrid={subgrid}
        lift={lift}
        className={cn('@container w-full', className)}
        {...props}
      >
        <Card.Header>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <Card.Title className="min-w-0">{title}</Card.Title>
              {titleBadge}
            </div>
            {description && <Card.Description>{description}</Card.Description>}
          </div>
          {action && <Card.Action>{action}</Card.Action>}
        </Card.Header>

        <Card.Content className="pt-2">
          <div
            className={cn(
              'w-full',
              isEmpty && !loading
                ? skeletonShape === 'gauge'
                  ? 'flex min-h-56 items-center justify-center'
                  : 'flex min-h-64 items-center justify-center'
                : contentClassName
            )}
            aria-busy={loading ? 'true' : undefined}
          >
            {loading ? (
              <div
                role="status"
                aria-live="polite"
                className="flex h-full w-full items-center justify-center"
              >
                <span className="sr-only">Loading chart data</span>
                {skeletonShape === 'circle' ? (
                  <Skeleton className="size-48 @xs:size-56 rounded-full" />
                ) : skeletonShape === 'gauge' ? (
                  <Skeleton className="size-40 @xs:size-48 rounded-full" />
                ) : (
                  <Skeleton className="h-full w-full rounded-none" />
                )}
              </div>
            ) : isEmpty ? (
              <Empty
                variant="unboxed"
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                className="my-0"
              />
            ) : (
              children
            )}
          </div>
        </Card.Content>

        {hasFooter ? (
          <Card.Footer>
            <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-outline-variant/30 pt-3 text-xs text-on-surface-variant">
              {trend && (
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <Badge
                    variant="outline"
                    colorRole={trend.positive !== false ? 'success' : 'error'}
                    size="sm"
                    icon={trend.positive !== false ? 'trending_up' : 'trending_down'}
                  >
                    {trend.value}
                  </Badge>
                  {trend.label && <span>{trend.label}</span>}
                </div>
              )}
              {footer && <div className="min-w-0">{footer}</div>}
            </div>
          </Card.Footer>
        ) : subgrid ? (
          // Keep a 3rd grid child in CSS Subgrid row flow without visual dead space.
          <div aria-hidden="true" data-slot="card-footer-spacer" className="h-0 overflow-hidden" />
        ) : null}
      </Card>
    );
  }
);

ChartCard.displayName = 'ChartCard';

export default ChartCard;
