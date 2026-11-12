/**
 * LineChartCard block.
 *
 * Controlled presentational card for multi-series trajectories, baseline targets,
 * and historical benchmark tracking.
 * Composes ChartCard and Chart primitives with high-contrast lines, accessible tooltips, and legends.
 */
import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartCard, type ChartCardProps, type ChartCardTrend } from '@/components/blocks/chart-card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  applySeriesOverrides,
  type ChartConfig,
} from '@/components/ui/chart';

export interface LineChartSeries {
  dataKey: string;
  label?: string;
  strokeDasharray?: string;
  showDots?: boolean;
}

export interface LineChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'skeletonShape'
  > {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: LineChartSeries[];
  config: ChartConfig;
  showLegend?: boolean;
  trend?: ChartCardTrend;
  /** Accessible chart summary announced to screen readers. Defaults to `title`. */
  chartLabel?: string;
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
      showLegend,
      trend,
      footer,
      action,
      loading,
      isEmpty,
      emptyTitle,
      emptyDescription,
      chartLabel,
      contentClassName = 'h-64 w-full',
      className,
      ...props
    },
    ref
  ) => {
    const resolvedConfig = React.useMemo(() => applySeriesOverrides(config, series), [config, series]);
    const resolvedEmpty = isEmpty ?? (!data || data.length === 0 || series.length === 0);

    return (
      <ChartCard
        ref={ref}
        title={title}
        description={description}
        action={action}
        trend={trend}
        footer={footer}
        loading={loading}
        isEmpty={resolvedEmpty}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        contentClassName={contentClassName}
        className={className}
        {...props}
      >
        <ChartContainer
          role="img"
          aria-label={chartLabel ?? title}
          config={resolvedConfig}
          className="aspect-auto h-full w-full"
        >
          <LineChart data={data} margin={{ left: 16, right: 16, top: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 16, right: 16 }}
              minTickGap={16}
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
            {(showLegend ?? series.length > 1) && (
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
      </ChartCard>
    );
  }
);
LineChartCard.displayName = 'LineChartCard';
