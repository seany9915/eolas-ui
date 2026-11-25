'use client';

/**
 * AreaChartCard block.
 *
 * Controlled presentational card for volume trends and intake velocity over time.
 * Composes ChartCard and Chart primitives with smooth gradient fills and accessible tooltips.
 */
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

export interface AreaChartSeries {
  dataKey: string;
  label?: string;
  strokeColor?: string;
  stackId?: string;
}

export interface AreaChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'skeletonShape'
  > {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: AreaChartSeries[];
  config: ChartConfig;
  showLegend?: boolean;
  /** Whether to render the numeric Y-axis scale. Defaults to `true`. */
  showYAxis?: boolean;
  trend?: ChartCardTrend;
  /** Accessible chart summary announced to screen readers. Defaults to `title`. */
  chartLabel?: string;
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
    const gradientIdPrefix = React.useId().replace(/:/g, '');
    const shouldShowLegend = showLegend ?? (series.length > 1);
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
          <AreaChart
            data={data}
            margin={{ left: showYAxis ? 0 : 12, right: 12, top: 12, bottom: 0 }}
          >
            <defs>
              {series.map((item, index) => {
                const safeKey = item.dataKey.replace(/[^a-zA-Z0-9_-]/g, '_');
                const { fill } = resolveChartSeriesColor(resolvedConfig, item.dataKey, index);
                return (
                  <linearGradient
                    key={item.dataKey}
                    id={`area-gradient-${gradientIdPrefix}-${safeKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={fill}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={fill}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                );
              })}
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
            {showYAxis && (
              <YAxis
                width="auto"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                className="text-xs text-on-surface-variant"
              />
            )}
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
            {series.map((item, index) => {
              const safeKey = item.dataKey.replace(/[^a-zA-Z0-9_-]/g, '_');
              const { stroke } = resolveChartSeriesColor(resolvedConfig, item.dataKey, index);
              return (
                <Area
                  key={item.dataKey}
                  type="monotone"
                  dataKey={item.dataKey}
                  stackId={item.stackId}
                  stroke={stroke}
                  strokeWidth={2}
                  isAnimationActive={!prefersReducedMotion}
                  fill={`url(#area-gradient-${gradientIdPrefix}-${safeKey})`}
                />
              );
            })}
          </AreaChart>
        </ChartContainer>
      </ChartCard>
    );
  }
);
AreaChartCard.displayName = 'AreaChartCard';
