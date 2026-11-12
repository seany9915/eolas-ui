/**
 * BarChartCard block.
 *
 * Controlled presentational card for categorical throughput, comparative performance,
 * and multi-metric distribution.
 * Composes ChartCard and Chart primitives with rounded bars, accessible tooltips, and legends.
 */
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

export interface BarChartSeries {
  dataKey: string;
  label?: string;
  stackId?: string;
}

export interface BarChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'skeletonShape'
  > {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: BarChartSeries[];
  config: ChartConfig;
  layout?: 'horizontal' | 'vertical';
  yAxisWidth?: number;
  showLegend?: boolean;
  trend?: ChartCardTrend;
  /** Accessible chart summary announced to screen readers. Defaults to `title`. */
  chartLabel?: string;
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
    const isVerticalLayout = layout === 'vertical';
    const resolvedConfig = React.useMemo(() => applySeriesOverrides(config, series), [config, series]);
    const lastIndexByStack = React.useMemo(() => {
      const map = new Map<string, number>();
      series.forEach((item, index) => item.stackId && map.set(item.stackId, index));
      return map;
    }, [series]);
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
                  minTickGap={16}
                  className="text-xs text-on-surface-variant"
                />
                <YAxis hide />
              </>
            )}
            <ChartTooltip
              cursor={{ fill: 'var(--color-surface-container)' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {(showLegend ?? series.length > 1) && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {series.map((item, index) => {
              // Only the last series of each stack gets rounded corners
              const isStacked = !!item.stackId && lastIndexByStack.get(item.stackId) !== index;
              const radius: [number, number, number, number] = isStacked
                ? [0, 0, 0, 0]
                : isVerticalLayout
                ? [0, 4, 4, 0]
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
      </ChartCard>
    );
  }
);
BarChartCard.displayName = 'BarChartCard';
