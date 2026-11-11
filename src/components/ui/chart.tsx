import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    avatar?: string;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

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
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "@container flex w-full min-w-0 aspect-video justify-center text-xs font-sans [&_.recharts-cartesian-axis-tick_text]:fill-on-surface-variant [&_.recharts-cartesian-grid_line]:stroke-outline-variant/40 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-outline-variant [&_.recharts-dot]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_line]:stroke-outline-variant/40 [&_.recharts-radial-bar-background-sector]:fill-surface-variant [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-variant/40 [&_.recharts-reference-line_line]:stroke-outline-variant [&_.recharts-sector]:stroke-transparent [&_.recharts-surface]:outline-none",
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

const escapeSelectorValue = (value: string) =>
  value.replace(/[\\"]/g, '\\$&').replace(/</g, '\\3c ');

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart="${escapeSelectorValue(id)}"] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join('\n')}
}
`
          )
          .join(''),
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
  allowEscapeViewBox = { x: true, y: true },
  offset = 12,
  wrapperStyle,
  cursor = {
    stroke: 'var(--color-outline-variant)',
    strokeWidth: 1,
    strokeDasharray: '4 4',
  },
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
  return (
    <RechartsPrimitive.Tooltip
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      isAnimationActive={isAnimationActive}
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
        className={cn(
          'pointer-events-none select-none grid min-w-[8rem] items-start gap-1.5 rounded-[0.75rem] border border-outline-variant/60 bg-surface/95 backdrop-blur-sm px-3 py-2 text-xs shadow-ambient text-on-surface',
          className
        )}
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
                {formatter && item?.value !== undefined && item.name ? (
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
                            'shrink-0 rounded-[2px] border-[var(--color-border)] bg-[var(--color-bg)] ring-1 ring-outline/25',
                            {
                              'size-2.5 rounded-full': indicator === 'dot',
                              'w-1 h-3 rounded-full': indicator === 'line',
                              'w-0 border-l border-dashed h-3': indicator === 'dashed',
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
}

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(
  (
    { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4 text-xs font-sans text-on-surface-variant',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-on-surface-variant'
              )}
            >
              {itemConfig?.avatar ? (
                <img
                  src={itemConfig.avatar}
                  alt=""
                  className="size-3.5 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/40"
                />
              ) : itemConfig?.icon && !hideIcon ? (
                <div className="shrink-0 [&>svg]:size-3.5 [&>svg]:text-on-surface-variant flex items-center justify-center">
                  <itemConfig.icon />
                </div>
              ) : (
                <div
                  className="size-2 rounded-full shrink-0 border border-outline/30"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
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
