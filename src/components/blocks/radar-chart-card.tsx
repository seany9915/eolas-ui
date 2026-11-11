/**
 * RadarChartCard block.
 *
 * Controlled presentational radar / spider card for multi-factor profile assessments,
 * clinical competency pillars, and benchmark polygon overlays.
 * Composes Card, Chart, and Legend primitives with polar grids, high-contrast polygons, and accessible tooltips.
 */
import * as React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { Card } from '@/components/ui/card';
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

export interface RadarChartSeries {
  dataKey: string;
  label?: string;
  fillOpacity?: number;
}

export interface RadarChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  angleKey: string;
  series: RadarChartSeries[];
  config: ChartConfig;
  showLegend?: boolean;
  footer?: React.ReactNode;
  action?: React.ReactNode;
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
      className,
      ...props
    },
    ref
  ) => {
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
          <ChartContainer
            config={resolvedConfig}
            className="mx-auto aspect-square max-h-64 w-full"
          >
            <RadarChart
              data={data}
              outerRadius="70%"
              margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis
                dataKey={angleKey}
                className="text-xs font-sans font-medium text-on-surface-variant"
              />
              <PolarGrid className="stroke-outline-variant/40" />
              {series.map((item) => (
                <Radar
                  key={item.dataKey}
                  dataKey={item.dataKey}
                  stroke={`var(--color-${item.dataKey})`}
                  fill={`var(--color-${item.dataKey})`}
                  fillOpacity={item.fillOpacity ?? 0.3}
                  strokeWidth={2}
                />
              ))}
              {(showLegend ?? series.length > 1) && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
            </RadarChart>
          </ChartContainer>
        </Card.Content>

        {footer && (
          <Card.Footer>
            <div className="flex w-full items-center justify-between gap-3 border-t border-outline-variant/30 pt-3 text-xs text-on-surface-variant">
              {footer}
            </div>
          </Card.Footer>
        )}
      </Card>
    );
  }
);
RadarChartCard.displayName = 'RadarChartCard';
