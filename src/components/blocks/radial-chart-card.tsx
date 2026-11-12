/**
 * RadialChartCard block.
 *
 * Controlled presentational semicircle gauge card for capacity monitoring,
 * threshold alerts, and target achievement.
 * The arc color comes from the `value` entry in `config`; without one it falls back to the primary color.
 * Composes ChartCard, Badge, and Chart primitives with a 180° radial arc and high-contrast status tokens.
 */
import * as React from 'react';
import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartCard, type ChartCardProps } from '@/components/blocks/chart-card';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export type RadialChartStatus = 'normal' | 'warning' | 'critical';

export interface RadialChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'trend' | 'skeletonShape'
  > {
  title: string;
  description?: string;
  value: number;
  total?: number;
  unit?: string;
  /** Text under the value. Defaults to `of <total><unit>`, e.g. "of 100%" or "of 40 sessions". */
  caption?: string;
  status?: RadialChartStatus;
  statusLabel?: string;
  config: ChartConfig;
  /** Accessible chart summary announced to screen readers. Defaults to title + reading. */
  chartLabel?: string;
}

const statusRoleMap: Record<RadialChartStatus, 'success' | 'warning' | 'error'> = {
  normal: 'success',
  warning: 'warning',
  critical: 'error',
};

const statusIconMap: Record<RadialChartStatus, string> = {
  normal: 'check_circle',
  warning: 'warning',
  critical: 'error',
};

const defaultStatusLabelMap: Record<RadialChartStatus, string> = {
  normal: 'On track',
  warning: 'Near limit',
  critical: 'Needs attention',
};

export const RadialChartCard = React.forwardRef<HTMLDivElement, RadialChartCardProps>(
  (
    {
      title,
      description,
      value,
      total = 100,
      unit = '%',
      caption,
      status = 'normal',
      statusLabel,
      config,
      footer,
      action,
      loading,
      isEmpty,
      emptyTitle,
      emptyDescription,
      chartLabel,
      contentClassName = 'h-48 @xs:h-56 w-full',
      className,
      ...props
    },
    ref
  ) => {
    const arcColor = 'value' in config ? 'var(--color-value)' : 'var(--color-primary)';
    const chartData = React.useMemo(() => [{ value, fill: arcColor }], [value, arcColor]);
    const displayValue = `${value}${unit}`;
    const resolvedStatusLabel = statusLabel ?? defaultStatusLabelMap[status];
    const resolvedEmpty =
      isEmpty ?? (value === undefined || value === null || Number.isNaN(value) || total <= 0);

    return (
      <ChartCard
        ref={ref}
        title={title}
        titleBadge={
          <Badge
            variant="outline"
            colorRole={statusRoleMap[status]}
            size="sm"
            icon={statusIconMap[status]}
          >
            {resolvedStatusLabel}
          </Badge>
        }
        description={description}
        action={action}
        footer={footer}
        loading={loading}
        isEmpty={resolvedEmpty}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        contentClassName={contentClassName}
        skeletonShape="gauge"
        className={className}
        {...props}
      >
        <ChartContainer
          role="img"
          aria-label={chartLabel ?? `${title}: ${displayValue} of ${total}${unit}`}
          config={config}
          className="aspect-auto h-full w-full"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            cy="70%"
            innerRadius={70}
            outerRadius={105}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarAngleAxis
              type="number"
              domain={[0, total]}
              angleAxisId={0}
              tick={false}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-on-surface text-3xl font-bold font-mono tracking-tight"
                        >
                          {displayValue}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          className="fill-on-surface-variant text-xs font-sans font-medium"
                        >
                          {caption ?? `of ${total}${unit}`}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="value"
              angleAxisId={0}
              fill={arcColor}
              background={{ fill: 'var(--color-surface-container)' }}
              cornerRadius={6}
            />
          </RadialBarChart>
        </ChartContainer>
      </ChartCard>
    );
  }
);
RadialChartCard.displayName = 'RadialChartCard';
