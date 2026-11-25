'use client';

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
  resolveChartSeriesColor,
  usePrefersReducedMotion,
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
  yAxisWidth?: number | 'auto';
  showLegend?: boolean;
  /** Whether to render the numeric Y-axis scale in horizontal layout. Defaults to `true`. */
  showYAxis?: boolean;
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
      yAxisWidth = 'auto',
      showLegend,
      showYAxis = true,
      trend,
      footer,
      action,
      loading,
      isEmpty,
      emptyTitle,
      emptyDescription,
      chartLabel,
      contentClassName,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isVerticalLayout = layout === 'vertical';
    const shouldShowLegend = showLegend ?? series.length > 1;
    const resolvedContentClassName =
      contentClassName ?? (shouldShowLegend ? 'h-72 w-full' : 'h-64 w-full');
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
        contentClassName={resolvedContentClassName}
        className={className}
        {...props}
      >
        <ChartContainer
          role="figure"
          aria-label={chartLabel ?? title}
          config={resolvedConfig}
          className="aspect-auto size-full"
        >
          <BarChart
            data={data}
            layout={isVerticalLayout ? 'vertical' : 'horizontal'}
            margin={
              isVerticalLayout
                ? { left: 0, right: 16, top: 12, bottom: 0 }
                : { left: showYAxis ? 0 : 12, right: 12, top: 12, bottom: 0 }
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
                  tickFormatter={(value) => {
                    const str = String(value ?? '');
                    return str.length > 14 ? `${str.slice(0, 13).trimEnd()}…` : str;
                  }}
                  className="text-xs text-on-surface-variant"
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  className="text-xs text-on-surface-variant"
                />
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
                <YAxis
                  hide={!showYAxis}
                  width={showYAxis ? 'auto' : 0}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  className="text-xs text-on-surface-variant"
                />
              </>
            )}
            <ChartTooltip
              cursor={{ fill: 'var(--color-surface-container-low)' }}
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
              const { fill, isTertiary } = resolveChartSeriesColor(resolvedConfig, item.dataKey, index);

              return (
                <Bar
                  key={item.dataKey}
                  dataKey={item.dataKey}
                  fill={fill}
                  stroke={isTertiary ? 'var(--color-outline)' : undefined}
                  strokeWidth={isTertiary ? 1 : undefined}
                  stackId={item.stackId}
                  radius={radius}
                  isAnimationActive={!prefersReducedMotion}
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
