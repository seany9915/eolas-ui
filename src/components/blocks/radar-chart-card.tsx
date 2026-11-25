'use client';

/**
 * RadarChartCard block.
 *
 * Controlled presentational radar / spider card for multi-factor profile assessments,
 * clinical competency pillars, and benchmark polygon overlays.
 * Composes ChartCard and Chart primitives with polar grids, high-contrast polygons, and accessible tooltips.
 */
import * as React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { ChartCard, type ChartCardProps } from '@/components/blocks/chart-card';
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

export interface RadarChartSeries {
  dataKey: string;
  label?: string;
  fillOpacity?: number;
}

export interface RadarChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'trend' | 'skeletonShape'
  > {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  angleKey: string;
  series: RadarChartSeries[];
  config: ChartConfig;
  showLegend?: boolean;
  /** Accessible chart summary announced to screen readers. Defaults to `title`. */
  chartLabel?: string;
}

export const RadarChartCard = React.forwardRef<HTMLDivElement, RadarChartCardProps>(
  (
    {
      title,
      description,
      data,
      angleKey,
      series,
      config,
      showLegend,
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
      contentClassName ?? (shouldShowLegend ? 'h-72 @xs:h-80 w-full' : 'h-56 @xs:h-64 w-full');
    const resolvedConfig = React.useMemo(() => applySeriesOverrides(config, series), [config, series]);
    const resolvedEmpty = isEmpty ?? (!data || data.length === 0 || series.length === 0);

    return (
      <ChartCard
        ref={ref}
        title={title}
        description={description}
        action={action}
        footer={footer}
        loading={loading}
        isEmpty={resolvedEmpty}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        contentClassName={resolvedContentClassName}
        skeletonShape="circle"
        className={className}
        {...props}
      >
        <ChartContainer
          role="figure"
          aria-label={chartLabel ?? title}
          config={resolvedConfig}
          className="aspect-auto size-full"
        >
          <RadarChart
            data={data}
            outerRadius="58%"
            margin={{ top: 16, right: 40, bottom: 16, left: 40 }}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey={angleKey}
              tickFormatter={(value) => {
                const str = String(value ?? '');
                return str.length > 14 ? `${str.slice(0, 13).trimEnd()}…` : str;
              }}
              className="text-xs font-sans font-medium text-on-surface-variant"
            />
            <PolarGrid className="stroke-outline-variant/40" />
            {series.map((item, index) => {
              const { fill, stroke } = resolveChartSeriesColor(resolvedConfig, item.dataKey, index);
              return (
                <Radar
                  key={item.dataKey}
                  dataKey={item.dataKey}
                  stroke={stroke}
                  fill={fill}
                  fillOpacity={item.fillOpacity ?? 0.3}
                  strokeWidth={2}
                  isAnimationActive={!prefersReducedMotion}
                />
              );
            })}
            {(showLegend ?? series.length > 1) && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
          </RadarChart>
        </ChartContainer>
      </ChartCard>
    );
  }
);
RadarChartCard.displayName = 'RadarChartCard';
