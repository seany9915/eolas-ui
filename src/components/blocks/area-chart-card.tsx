/**
 * AreaChartCard block.
 *
 * Controlled presentational card for volume trends and intake velocity over time.
 * Composes ChartCard and Chart primitives with smooth gradient fills and accessible tooltips.
 */
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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

export interface AreaChartSeries {
  dataKey: string;
  label?: string;
  strokeColor?: string;
  stackId?: string;
}

export interface AreaChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'contentClassName' | 'skeletonShape'
  > {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  series: AreaChartSeries[];
  config: ChartConfig;
  showLegend?: boolean;
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
      trend,
      footer,
      action,
      loading,
      isEmpty,
      emptyTitle,
      emptyDescription,
      chartLabel,
      className,
      ...props
    },
    ref
  ) => {
    const gradientIdPrefix = React.useId().replace(/:/g, '');
    const shouldShowLegend = showLegend ?? (series.length > 1);
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
        contentClassName="h-64 w-full"
        className={className}
        {...props}
      >
        <ChartContainer
          role="img"
          aria-label={chartLabel ?? title}
          config={resolvedConfig}
          className="aspect-auto h-full w-full"
        >
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
      </ChartCard>
    );
  }
);
AreaChartCard.displayName = 'AreaChartCard';
