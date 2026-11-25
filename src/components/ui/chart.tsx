'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark', inverted: '[data-surface="inverted"]' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    avatar?: string;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<'light' | 'dark', string> & Partial<Record<'inverted', string>> }
  );
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

const FALLBACK_SERIES_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-tertiary)',
  'var(--color-outline)',
] as const;

export function isTertiaryChartColor(color?: string): boolean {
  return Boolean(color && (/tertiary/i.test(color) || /#f9a825/i.test(color)));
}

export function resolveChartSeriesColor(
  config: ChartConfig,
  key: string,
  fallbackIndex = 0
): { fill: string; stroke: string; isTertiary: boolean } {
  const fallback = FALLBACK_SERIES_COLORS[fallbackIndex % FALLBACK_SERIES_COLORS.length];
  const entry = config[key];
  const rawColor =
    entry && 'color' in entry
      ? entry.color
      : entry && 'theme' in entry
        ? entry.theme?.light
        : undefined;
  const hasConfigColor = Boolean(SAFE_CSS_KEY_RE.test(key) && entry && (entry.color || entry.theme));
  const fill = hasConfigColor ? `var(--color-${key}, ${fallback})` : fallback;
  const isTertiary = isTertiaryChartColor(rawColor ?? (!hasConfigColor ? fallback : undefined));
  const stroke = isTertiary
    ? 'color-mix(in oklch, var(--color-tertiary) 68%, var(--color-on-surface))'
    : fill;
  return { fill, stroke, isTertiary };
}

/** Merges per-series `label` / `strokeColor` overrides into a chart config so block series props are honored. */
export function applySeriesOverrides(
  config: ChartConfig,
  series: ReadonlyArray<{ dataKey: string; label?: string; strokeColor?: string }>
): ChartConfig {
  const next: ChartConfig = { ...config };
  for (const { dataKey, label, strokeColor } of series) {
    if (!label && !strokeColor) continue;
    const base = next[dataKey] ?? {};
    next[dataKey] = {
      ...base,
      ...(label ? { label } : {}),
      ...(strokeColor ? { color: strokeColor, theme: undefined } : {}),
    } as ChartConfig[string];
  }
  return next;
}

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
  }
>(({ id, className, children, config, role, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
  const resolvedRole =
    role ?? (props['aria-label'] || props['aria-labelledby'] ? 'figure' : undefined);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        ref={ref}
        role={resolvedRole}
        className={cn(
          "@container flex w-full min-w-0 aspect-video justify-center text-xs font-sans [&_.recharts-cartesian-axis-tick_text]:fill-on-surface-variant [&_.recharts-cartesian-grid_line]:stroke-outline-variant/40 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-outline-variant [&_.recharts-dot]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_line]:stroke-outline-variant/40 [&_.recharts-radial-bar-background-sector]:fill-surface-container-high [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-container-high/40 [&_.recharts-reference-line_line]:stroke-outline-variant [&_.recharts-sector:not([stroke])]:stroke-transparent [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

const SAFE_CSS_KEY_RE = /^[a-zA-Z0-9_-]+$/;
const SAFE_CSS_COLOR_RE = /^[a-zA-Z0-9#(),.%+/\s_-]+$/;

function isSafeCssColor(color: string): boolean {
  const trimmed = color.trim();
  return (
    trimmed.length > 0 &&
    SAFE_CSS_COLOR_RE.test(trimmed) &&
    !/url\s*\(|expression\s*\(|@import|\/\*/i.test(trimmed)
  );
}

const escapeSelectorValue = (value: string) =>
  value.replace(/[^a-zA-Z0-9_-]/g, '');

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const safeId = escapeSelectorValue(id);
  const colorConfig = Object.entries(config).filter(
    ([key, itemConfig]) => SAFE_CSS_KEY_RE.test(key) && (itemConfig.theme || itemConfig.color)
  );

  if (!safeId || !colorConfig.length) {
    return null;
  }

  const cssRules = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const declarations = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color;
          return color && isSafeCssColor(color) ? `  --color-${key}: ${color.trim()};` : null;
        })
        .filter(Boolean);
      if (declarations.length === 0) return '';
      return `\n${prefix} [data-chart="${safeId}"] {\n${declarations.join('\n')}\n}\n`;
    })
    .filter(Boolean)
    .join('');

  if (!cssRules) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: cssRules,
      }}
    />
  );
};

/**
 * Refined Recharts Tooltip with smooth tracking, jitter-free cursor following,
 * and mouse-collision prevention (pointerEvents: none).
 */
export const ChartTooltip = ({
  animationDuration = 150,
  animationEasing = 'ease-out',
  isAnimationActive = true,
  allowEscapeViewBox = { x: false, y: true },
  offset = 12,
  wrapperStyle,
  cursor = {
    stroke: 'var(--color-outline-variant)',
    strokeWidth: 1,
    strokeDasharray: '4 4',
  },
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <RechartsPrimitive.Tooltip
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      isAnimationActive={prefersReducedMotion ? false : isAnimationActive}
      allowEscapeViewBox={allowEscapeViewBox}
      offset={offset}
      cursor={cursor}
      wrapperStyle={{
        outline: 'none',
        pointerEvents: 'none', // Prevents hover collisions and tracking flutter
        zIndex: 50,
        ...wrapperStyle,
      }}
      {...props}
    />
  );
};

export type ChartTooltipPayloadItem = {
  name?: string | number;
  value?: string | number | Array<string | number>;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
  color?: string;
  fill?: string;
  [key: string]: unknown;
};

export interface ChartTooltipContentProps
  extends React.ComponentProps<'div'> {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  indicator?: 'line' | 'dot' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  labelFormatter?: (label: React.ReactNode, payload: ChartTooltipPayloadItem[]) => React.ReactNode;
  labelClassName?: string;
  valueFormatter?: (value: number | string | Array<number | string>) => React.ReactNode;
  formatter?: (
    value: unknown,
    name: unknown,
    item: ChartTooltipPayloadItem,
    index: number,
    payload: unknown
  ) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
  showTotal?: boolean;
  totalLabel?: string;
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      valueFormatter,
      formatter,
      color,
      nameKey,
      labelKey,
      showTotal = false,
      totalLabel = 'Total',
      ...props
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-sans font-medium text-on-surface-variant', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn('font-sans font-medium text-on-surface-variant', labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    const totalValue = React.useMemo(() => {
      if (!showTotal || !payload?.length) return 0;
      return payload.reduce((acc, curr) => {
        const val = typeof curr.value === 'number' ? curr.value : Number(curr.value) || 0;
        return acc + val;
      }, 0);
    }, [showTotal, payload]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        data-slot="chart-tooltip"
        className={cn(
          'pointer-events-none select-none grid min-w-[8rem] max-w-[calc(100vw-2rem)] items-start gap-1.5 rounded-[0.75rem] border border-outline-variant/60 bg-surface/95 backdrop-blur-sm px-3 py-2 text-xs shadow-ambient text-on-surface',
          className
        )}
        {...props}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey || index}
                className={cn(
                  'flex w-full items-center gap-2 font-sans',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name != null && item.name !== '' ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.avatar ? (
                      <img
                        src={itemConfig.avatar}
                        alt=""
                        className="size-4 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/40"
                      />
                    ) : itemConfig?.icon ? (
                      <div className="shrink-0 [&>svg]:size-3.5 [&>svg]:text-on-surface-variant flex items-center justify-center">
                        <itemConfig.icon />
                      </div>
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[var(--color-border)] bg-[var(--color-bg)] ring-1 ring-outline/60',
                            {
                              'size-2.5 rounded-full': indicator === 'dot',
                              'w-1 h-3 rounded-full': indicator === 'line',
                              'w-0 border-s border-dashed h-3': indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between items-center leading-none gap-2',
                        nestLabel ? 'items-end' : 'items-center'
                      )}
                    >
                      <div className="grid gap-1">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-on-surface-variant font-medium">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value !== undefined && (
                        <span className="font-mono text-on-surface font-semibold tabular-nums">
                          {valueFormatter
                            ? valueFormatter(item.value)
                            : typeof item.value === 'number'
                            ? item.value.toLocaleString()
                            : item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {showTotal && payload.length > 1 && (
            <div className="flex w-full items-center justify-between gap-2 border-t border-outline-variant/40 pt-1.5 mt-0.5 text-xs font-sans font-semibold text-on-surface">
              <span className="text-on-surface-variant font-medium">{totalLabel}</span>
              <span className="font-mono tabular-nums">
                {valueFormatter
                  ? valueFormatter(totalValue)
                  : totalValue.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

export const ChartLegend = RechartsPrimitive.Legend;

export interface ChartLegendContentProps
  extends React.ComponentProps<'div'> {
  payload?: RechartsPrimitive.LegendPayload[];
  verticalAlign?: 'top' | 'bottom';
  hideIcon?: boolean;
  nameKey?: string;
  activeIndex?: number;
  onItemClick?: (index: number) => void;
}

// Internal props cloned onto custom Legend content by Recharts LegendImpl
const RECHARTS_LEGEND_INTERNAL_PROPS = new Set([
  'align',
  'chartHeight',
  'chartWidth',
  'content',
  'height',
  'iconSize',
  'iconType',
  'inactiveColor',
  'itemSorter',
  'labelStyle',
  'layout',
  'margin',
  'offset',
  'onBBoxUpdate',
  'payloadUniqBy',
  'portal',
  'position',
  'width',
  'wrapperStyle',
]);

function pickLegendDivProps(props: Record<string, unknown>): React.HTMLAttributes<HTMLDivElement> {
  const domProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!RECHARTS_LEGEND_INTERNAL_PROPS.has(key)) {
      domProps[key] = value;
    }
  }
  return domProps as React.HTMLAttributes<HTMLDivElement>;
}

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = 'bottom',
      nameKey,
      activeIndex,
      onItemClick,
      role = 'list',
      'aria-label': ariaLabel = 'Chart legend',
      ...props
    },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        data-slot="chart-legend"
        role={role}
        aria-label={ariaLabel}
        className={cn(
          'flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-on-surface-variant',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className
        )}
        {...pickLegendDivProps(props as Record<string, unknown>)}
      >
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const iconNode = !hideIcon && (
            itemConfig?.avatar ? (
              <img
                src={itemConfig.avatar}
                alt=""
                aria-hidden="true"
                className="size-3.5 rounded-full object-cover shrink-0 border border-outline-variant/40"
              />
            ) : itemConfig?.icon ? (
              <span
                aria-hidden="true"
                className="shrink-0 [&>svg]:size-3.5 [&>svg]:text-on-surface-variant inline-flex items-center justify-center"
              >
                <itemConfig.icon />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="inline-block size-2 rounded-full shrink-0 border border-outline/60"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )
          );

          if (onItemClick) {
            const isSelected = activeIndex === index;
            return (
              <div key={item.value ?? index} role="listitem">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onItemClick(index)}
                  className={cn(
                    'relative inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-sans transition-colors duration-quick ease-standard motion-reduce:transition-none cursor-pointer touch-target-expanded [&>svg]:size-3 [&>svg]:text-on-surface-variant',
                    'hover:bg-state-hover hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isSelected
                      ? 'bg-surface-container-high text-on-surface font-semibold'
                      : 'text-on-surface-variant font-medium'
                  )}
                >
                  {iconNode}
                  <span>{itemConfig?.label || item.value}</span>
                </button>
              </div>
            );
          }

          return (
            <div
              key={item.value ?? index}
              role="listitem"
              className={cn(
                'flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-on-surface-variant'
              )}
            >
              {iconNode}
              <span className="font-medium text-on-surface">{itemConfig?.label || item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegend';

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

/* -------------------------------------------------------------------------------------------------
 * Compound Object Export
 * -----------------------------------------------------------------------------------------------*/
export const Chart = Object.assign(ChartContainer, {
  Container: ChartContainer,
  Tooltip: ChartTooltip,
  TooltipContent: ChartTooltipContent,
  Legend: ChartLegend,
  LegendContent: ChartLegendContent,
  Style: ChartStyle,
});

export default Chart;
