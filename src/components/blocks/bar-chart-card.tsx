/**
 * BarChartCard block.
 *
 * Controlled presentational card for categorical throughput, comparative performance,
 * and multi-metric distribution.
 * Composes Card, Badge, Icon, and Chart primitives with rounded bars, accessible tooltips, and legends.
 */
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

export interface BarChartSeries {
  dataKey: string;
  label?: string;
  stackId?: string;
}

export interface BarChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: BarChartSeries[];
  config: ChartConfig;
  layout?: 'horizontal' | 'vertical';
  yAxisWidth?: number;
  showLegend?: boolean;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  footer?: React.ReactNode;
  action?: React.ReactNode;
}

export const BarChartCard = React.forwardRef<HTMLDivElement, BarChartCardProps>(
  (
    {
      title,
      description,
      data,
      xAxisKey,
      series,
      config,
      layout = 'horizontal',
      yAxisWidth = 80,
      showLegend = true,
      trend,
      footer,
      action,
      className,
      ...props
    },
    ref
  ) => {
    const isVerticalLayout = layout === 'vertical';

    return (
      <Card ref={ref} className={cn('w-full', className)} {...props}>
        <Card.Header>
          <div className="flex flex-col gap-1">
            <Card.Title className="text-base font-semibold text-on-surface">
              {title}
            </Card.Title>
            {description && (
              <Card.Description className="text-xs text-on-surface-variant">
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
          <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
            <BarChart
              data={data}
              layout={isVerticalLayout ? 'vertical' : 'horizontal'}
              margin={
                isVerticalLayout
                  ? { left: 0, right: 16, top: 12, bottom: 0 }
                  : { left: 12, right: 12, top: 12, bottom: 0 }
              }
            >
              <CartesianGrid vertical={isVerticalLayout} horizontal={!isVerticalLayout} />
              {isVerticalLayout ? (
                <>
                  <YAxis
                    dataKey={xAxisKey}
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={yAxisWidth}
                    className="text-xs text-on-surface-variant"
                  />
                  <XAxis type="number" hide />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={xAxisKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    className="text-xs text-on-surface-variant"
                  />
                  <YAxis hide />
                </>
              )}
              <ChartTooltip
                cursor={{ fill: 'var(--color-surface-container)' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {showLegend && series.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {series.map((item, index) => {
                const isLast = index === series.length - 1;
                const radius: [number, number, number, number] = isVerticalLayout
                  ? [0, 4, 4, 0]
                  : item.stackId && !isLast
                  ? [0, 0, 0, 0]
                  : [4, 4, 0, 0];

                return (
                  <Bar
                    key={item.dataKey}
                    dataKey={item.dataKey}
                    fill={`var(--color-${item.dataKey})`}
                    stackId={item.stackId}
                    radius={radius}
                  />
                );
              })}
            </BarChart>
          </ChartContainer>
        </Card.Content>

        {(trend || footer) && (
          <Card.Footer className="flex items-center justify-between gap-3 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-3">
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
          </Card.Footer>
        )}
      </Card>
    );
  }
);
BarChartCard.displayName = 'BarChartCard';
