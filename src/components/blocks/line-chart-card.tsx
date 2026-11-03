/**
 * LineChartCard block.
 *
 * Controlled presentational card for multi-series trajectories, baseline targets,
 * and historical benchmark tracking.
 * Composes Card, Badge, Icon, and Chart primitives with high-contrast lines, accessible tooltips, and legends.
 */
import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
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

export interface LineChartSeries {
  dataKey: string;
  label?: string;
  strokeDasharray?: string;
  showDots?: boolean;
}

export interface LineChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: LineChartSeries[];
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

export const LineChartCard = React.forwardRef<HTMLDivElement, LineChartCardProps>(
  (
    {
      title,
      description,
      data,
      xAxisKey,
      series,
      config,
      showLegend = true,
      trend,
      footer,
      action,
      className,
      ...props
    },
    ref
  ) => {
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
            <LineChart data={data} margin={{ left: 16, right: 16, top: 12, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                padding={{ left: 16, right: 16 }}
                interval={0}
                className="text-xs text-on-surface-variant"
              />
              <YAxis hide />
              <ChartTooltip
                cursor={{
                  stroke: 'var(--color-outline-variant)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
                content={<ChartTooltipContent indicator="line" />}
              />
              {showLegend && series.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {series.map((item) => (
                <Line
                  key={item.dataKey}
                  type="monotone"
                  dataKey={item.dataKey}
                  stroke={`var(--color-${item.dataKey})`}
                  strokeWidth={2}
                  strokeDasharray={item.strokeDasharray}
                  dot={
                    item.showDots !== false
                      ? {
                          fill: `var(--color-${item.dataKey})`,
                          r: 3,
                          strokeWidth: 0,
                        }
                      : false
                  }
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: 'var(--color-surface)',
                  }}
                />
              ))}
            </LineChart>
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
LineChartCard.displayName = 'LineChartCard';
