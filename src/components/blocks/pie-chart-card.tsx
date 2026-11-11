/**
 * PieChartCard block.
 *
 * Controlled presentational card for category distributions, status proportions,
 * and caseload composition breakdowns.
 * Composes ChartCard and Chart primitives with a centered aggregate KPI and accessible tooltips.
 */
import * as React from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorShapeProps } from 'recharts/types/polar/Pie';
import { ChartCard, type ChartCardProps } from '@/components/blocks/chart-card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

// Categorical fallback tokens per DESIGN.md (primary -> secondary -> tertiary -> neutral outline).
// Avoids mixing state colors (success/warning/error) into non-outcome categories.
const FALLBACK_SLICE_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-tertiary)',
  'var(--color-outline)',
] as const;

export interface PieChartCardProps
  extends Omit<
    ChartCardProps,
    'children' | 'title' | 'titleBadge' | 'trend' | 'contentClassName' | 'skeletonShape'
  > {
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
  /** Controlled active slice. Pass null to control with no active slice; leave undefined for internal hover state. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | undefined) => void;
  showLegend?: boolean;
  /** Optional slice cap; extra slices collapse into an "Other" category. */
  maxSlices?: number;
  /** Accessible chart summary announced to screen readers. Defaults to `title`. */
  chartLabel?: string;
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
      maxSlices,
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
    const [internalActiveIndex, setInternalActiveIndex] = React.useState<number | undefined>(undefined);
    const isControlled = activeIndex !== undefined;
    const currentActiveIndex = isControlled ? (activeIndex ?? undefined) : internalActiveIndex;

    const slicedData = React.useMemo<Array<Record<string, unknown>>>(() => {
      if (!maxSlices || maxSlices < 2 || data.length <= maxSlices) {
        return data;
      }
      const head = data.slice(0, maxSlices - 1);
      const otherValue = data.slice(maxSlices - 1).reduce((sum, item) => {
        return sum + (Number(item[dataKey]) || 0);
      }, 0);
      if (otherValue <= 0) {
        return head;
      }
      return [
        ...head,
        {
          [nameKey]: 'Other',
          [dataKey]: otherValue,
        },
      ];
    }, [data, dataKey, nameKey, maxSlices]);

    const resolvedConfig = React.useMemo<ChartConfig>(() => {
      if (!maxSlices || maxSlices < 2 || data.length <= maxSlices || 'Other' in config) {
        return config;
      }
      return {
        ...config,
        Other: {
          label: 'Other',
          color: 'var(--color-outline)',
        },
      };
    }, [config, data.length, maxSlices]);

    // Normalize data so each slice defaults to var(--color-key) if item.fill is omitted
    const normalizedData = React.useMemo<Array<Record<string, unknown>>>(() => {
      return slicedData.map((item, index) => {
        const key = String(item[nameKey] ?? '');
        // Only config keys that are valid CSS identifiers resolve to a chart color variable
        const hasConfigColor = /^[\w-]+$/.test(key) && key in resolvedConfig;
        return {
          fill: hasConfigColor
            ? `var(--color-${key})`
            : FALLBACK_SLICE_COLORS[index % FALLBACK_SLICE_COLORS.length],
          ...item,
        };
      });
    }, [slicedData, nameKey, resolvedConfig]);

    // Track slices using Sunny Amber (`tertiary`) so we can enforce a >= 3:1 outline stroke on white
    const tertiaryIndices = React.useMemo(() => {
      const indices = new Set<number>();
      normalizedData.forEach((item, index) => {
        const key = String(item[nameKey] ?? '');
        const configEntry = resolvedConfig[key];
        const configColor =
          configEntry && 'color' in configEntry
            ? String(configEntry.color ?? '')
            : configEntry && 'theme' in configEntry
            ? String(configEntry.theme?.light ?? '')
            : '';
        const fillStr = String(item.fill ?? '');
        if (fillStr.includes('tertiary') || configColor.includes('tertiary')) {
          indices.add(index);
        }
      });
      return indices;
    }, [normalizedData, nameKey, resolvedConfig]);

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
    const activePercentage =
      activeValue !== undefined && totalSum > 0
        ? `${Math.round((activeValue / totalSum) * 100)}%`
        : undefined;

    const displayValue =
      activeValue !== undefined
        ? activeValue.toLocaleString()
        : centerLabel?.value !== undefined
        ? centerLabel.value
        : totalSum.toLocaleString();

    const displayLabel = activeItem
      ? `${String(activeItem[nameKey])}${activePercentage ? ` (${activePercentage})` : ''}`
      : centerLabel?.label || 'Total';

    const resolvedEmpty = isEmpty ?? (normalizedData.length === 0 || totalSum <= 0);

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
        contentClassName="h-56 @xs:h-64 w-full"
        skeletonShape="circle"
        className={className}
        {...props}
      >
        <ChartContainer
          role="img"
          aria-label={chartLabel ?? title}
          config={resolvedConfig}
          className="aspect-auto h-full w-full"
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
              shape={(shapeProps: PieSectorShapeProps) => {
                const isHovered = shapeProps.index === currentActiveIndex;
                const isTertiary = tertiaryIndices.has(shapeProps.index);
                return (
                  <Sector
                    {...shapeProps}
                    stroke={isTertiary ? 'var(--color-outline)' : shapeProps.stroke}
                    strokeWidth={isTertiary ? 1 : shapeProps.strokeWidth}
                    outerRadius={(shapeProps.outerRadius || 85) + (isHovered ? 6 : 0)}
                    className={cn(
                      interactive &&
                        'transition-opacity duration-quick ease-out motion-reduce:transition-none cursor-pointer'
                    )}
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
                    className="-translate-y-2 flex-wrap"
                  />
                }
              />
            )}
          </PieChart>
        </ChartContainer>
      </ChartCard>
    );
  }
);
PieChartCard.displayName = 'PieChartCard';
