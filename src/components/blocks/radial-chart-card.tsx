/**
 * RadialChartCard block.
 *
 * Controlled presentational semicircle gauge card for capacity monitoring,
 * threshold alerts, and target achievement.
 * The arc color comes from the `value` entry in `config`; without one it falls back to the primary color.
 * Composes Card, Badge, Icon, and Chart primitives with a 180° radial arc and high-contrast status tokens.
 */
import * as React from 'react';
import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

export type RadialChartStatus = 'normal' | 'warning' | 'critical';

export interface RadialChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  footer?: React.ReactNode;
  action?: React.ReactNode;
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
      className,
      ...props
    },
    ref
  ) => {
    const arcColor = 'value' in config ? 'var(--color-value)' : 'var(--color-primary)';
    const chartData = React.useMemo(() => [{ value, fill: arcColor }], [value, arcColor]);
    const displayValue = `${value}${unit}`;

    return (
      <Card ref={ref} className={cn('w-full', className)} {...props}>
        <Card.Header>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Card.Title>
                {title}
              </Card.Title>
              <Badge
                variant="outline"
                colorRole={statusRoleMap[status]}
                size="sm"
              >
                <Icon
                  name={statusIconMap[status]}
                  size="xs"
                  aria-hidden="true"
                />
                <span>{statusLabel || status}</span>
              </Badge>
            </div>
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
            config={config}
            className="mx-auto aspect-square max-h-56 w-full"
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
RadialChartCard.displayName = 'RadialChartCard';
