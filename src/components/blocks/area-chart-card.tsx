/**
 * AreaChartCard block.
 *
 * Controlled presentational card for volume trends and intake velocity over time.
 * Composes Card, Badge, Icon, and Chart primitives with smooth gradient fills and accessible tooltips.
 */
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  applySeriesOverrides,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

export interface AreaChartSeries {
  dataKey: string;
  label?: string;
  strokeColor?: string;
  stackId?: string;
}

export interface AreaChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: AreaChartSeries[];
  config: ChartConfig;
  showLegend?: boolean;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  footer?: React.ReactNode;
  action?: React.ReactNode;
}

export const AreaChartCard = React.forwardRef<HTMLDivElement, AreaChartCardProps>(
  (
    {
      title,
      description,
      data,
      xAxisKey,
      series,
      config,
      showLegend,
      trend,
      footer,
      action,
      className,
      ...props
    },
    ref
  ) => {
    const gradientIdPrefix = React.useId().replace(/:/g, '');
    const shouldShowLegend = showLegend ?? (series.length > 1);
    const resolvedConfig = React.useMemo(() => applySeriesOverrides(config, series), [config, series]);

    return (
      <Card ref={ref} className={cn('w-full', className)} {...props}>
        <Card.Header>
          <div className="flex flex-col gap-1">
            <Card.Title>
              {title}
            </Card.Title>
            {description && (
              <Card.Description>
                {description}
              </Card.Description>
            )}
          </div>
          {action && (
            <div data-slot="card-action" className="col-start-2 row-start-1 self-start justify-self-end">
              {action}
            </div>
          )}
        </Card.Header>

        <Card.Content className="pt-2">
          <ChartContainer config={resolvedConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
              <defs>
                {series.map((item) => (
                  <linearGradient
                    key={item.dataKey}
                    id={`area-gradient-${gradientIdPrefix}-${item.dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${item.dataKey})`}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${item.dataKey})`}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                className="text-xs text-on-surface-variant"
              />
              <ChartTooltip
                cursor={{
                  stroke: 'var(--color-outline-variant)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {shouldShowLegend && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {series.map((item) => (
                <Area
                  key={item.dataKey}
                  type="monotone"
                  dataKey={item.dataKey}
                  stackId={item.stackId}
                  stroke={`var(--color-${item.dataKey})`}
                  strokeWidth={2}
                  fill={`url(#area-gradient-${gradientIdPrefix}-${item.dataKey})`}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        </Card.Content>

        {(trend || footer) && (
          <Card.Footer>
            <div className="flex w-full items-center justify-between gap-3 border-t border-outline-variant/30 pt-3 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                {trend && (
                  <Badge
                    variant="outline"
                    colorRole={trend.positive !== false ? 'success' : 'error'}
                    size="sm"
                  >
                    <Icon
                      name={trend.positive !== false ? 'trending_up' : 'trending_down'}
                      size="xs"
                      aria-hidden="true"
                    />
                    <span>{trend.value}</span>
                  </Badge>
                )}
                {trend?.label && <span>{trend.label}</span>}
              </div>
              {footer && <div>{footer}</div>}
            </div>
          </Card.Footer>
        )}
      </Card>
    );
  }
);
AreaChartCard.displayName = 'AreaChartCard';
