'use client';

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
  resolveChartSeriesColor,
  usePrefersReducedMotion,
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
  /** Whether to render the numeric Y-axis scale. Defaults to `true`. */
  showYAxis?: boolean;
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
    const shouldShowLegend = showLegend ?? series.length > 1;
    const resolvedContentClassName =
      contentClassName ?? (shouldShowLegend ? 'h-72 w-full' : 'h-64 w-full');
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
          <LineChart
            data={data}
            margin={{ left: showYAxis ? 0 : 16, right: 16, top: 12, bottom: 0 }}
          >
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
            <YAxis
              hide={!showYAxis}
              width={showYAxis ? 'auto' : 0}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              className="text-xs text-on-surface-variant"
            />
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
            {series.map((item, index) => {
              const { stroke } = resolveChartSeriesColor(resolvedConfig, item.dataKey, index);
              return (
                <Line
                  key={item.dataKey}
                  type="monotone"
                  dataKey={item.dataKey}
                  stroke={stroke}
                  strokeWidth={2}
                  strokeDasharray={item.strokeDasharray}
                  isAnimationActive={!prefersReducedMotion}
                  dot={
                    item.showDots !== false
                      ? {
                          fill: stroke,
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
              );
            })}
          </LineChart>
        </ChartContainer>
      </ChartCard>
    );
  }
);
LineChartCard.displayName = 'LineChartCard';
