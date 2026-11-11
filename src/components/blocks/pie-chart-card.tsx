/**
 * PieChartCard block.
 *
 * Controlled presentational card for category distributions, status proportions,
 * and caseload composition breakdowns.
 * Composes Card, Chart, and Legend primitives with a centered aggregate KPI and accessible tooltips.
 */
import * as React from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorShapeProps } from 'recharts/types/polar/Pie';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

// Used when a slice has no ill and no usable config entry
const FALLBACK_SLICE_COLORS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'].map(
  (token) => `var(--color-${token})`
);

export interface PieChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  dataKey?: string;
  nameKey?: string;
  config: ChartConfig;
  centerLabel?: {
    value?: string | number;
    label?: string;
  };
  interactive?: boolean;
  /** Controlled active slice. Pass 
ull to control with no active slice; leave undefined for internal hover state. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | undefined) => void;
  showLegend?: boolean;
  footer?: React.ReactNode;
  action?: React.ReactNode;
}

export const PieChartCard = React.forwardRef<HTMLDivElement, PieChartCardProps>(
  (
    {
      title,
      description,
      data,
      dataKey = 'value',
      nameKey = 'name',
      config,
      centerLabel,
      interactive = true,
      activeIndex,
      onActiveIndexChange,
      showLegend = true,
      footer,
      action,
      className,
      ...props
    },
    ref
  ) => {
    const [internalActiveIndex, setInternalActiveIndex] = React.useState<number | undefined>(undefined);
    const isControlled = activeIndex !== undefined;
    const currentActiveIndex = isControlled ? (activeIndex ?? undefined) : internalActiveIndex;

    // Normalize data so each slice defaults to var(--color-key) if item.fill is omitted
    const normalizedData = React.useMemo<Array<Record<string, unknown>>>(() => {
      return data.map((item, index) => {
        const key = String(item[nameKey] ?? '');
        // Only config keys that are valid CSS identifiers resolve to a chart color variable
        const hasConfigColor = /^[\w-]+$/.test(key) && key in config;
        return {
          fill: hasConfigColor ? `var(--color-${key})` : FALLBACK_SLICE_COLORS[index % FALLBACK_SLICE_COLORS.length],
          ...item,
        };
      });
    }, [data, nameKey, config]);

    // Calculate total sum across data items
    const totalSum = React.useMemo(() => {
      return normalizedData.reduce((acc, curr) => {
        const val = Number(curr[dataKey]) || 0;
        return acc + val;
      }, 0);
    }, [normalizedData, dataKey]);

    // Active item details for dynamic center label
    const activeItem = currentActiveIndex !== undefined ? normalizedData[currentActiveIndex] : undefined;
    const activeValue = activeItem ? Number(activeItem[dataKey]) || 0 : undefined;
    const activePercentage = activeValue !== undefined && totalSum > 0
      ? `${Math.round((activeValue / totalSum) * 100)}%`
      : undefined;

    const displayValue = activeValue !== undefined
      ? activeValue.toLocaleString()
      : centerLabel?.value !== undefined
      ? centerLabel.value
      : totalSum.toLocaleString();

    const displayLabel = activeItem
      ? `${String(activeItem[nameKey])}${activePercentage ? ` (${activePercentage})` : ''}`
      : centerLabel?.label || 'Total';

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
            config={config}
            className="mx-auto aspect-square max-h-64 w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={normalizedData}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={60}
                outerRadius={85}
                strokeWidth={2}
                stroke="var(--color-surface)"
                shape={(props: PieSectorShapeProps) => {
                  const isHovered = props.index === currentActiveIndex;
                  return (
                    <Sector
                      {...props}
                      outerRadius={(props.outerRadius || 85) + (isHovered ? 6 : 0)}
                      className={cn(interactive && 'transition-all duration-150 cursor-pointer')}
                    />
                  );
                }}
                onMouseEnter={
                  interactive
                    ? (_, index) => {
                        if (!isControlled) setInternalActiveIndex(index);
                        onActiveIndexChange?.(index);
                      }
                    : undefined
                }
                onMouseLeave={
                  interactive
                    ? () => {
                        if (!isControlled) setInternalActiveIndex(undefined);
                        onActiveIndexChange?.(undefined);
                      }
                    : undefined
                }
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-on-surface text-2xl font-bold font-mono tracking-tight"
                          >
                            {displayValue}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-on-surface-variant text-xs font-sans font-medium"
                          >
                            {displayLabel}
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
              {showLegend && (
                <ChartLegend
                  content={
                    <ChartLegendContent
                      nameKey={nameKey}
                      className="-translate-y-2 flex-wrap [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  }
                />
              )}
            </PieChart>
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
PieChartCard.displayName = 'PieChartCard';
