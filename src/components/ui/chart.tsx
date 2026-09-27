import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

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
          "@container flex aspect-video justify-center text-xs font-sans [&_.recharts-cartesian-axis-tick_text]:fill-on-surface-variant [&_.recharts-cartesian-grid_line]:stroke-outline-variant/40 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-outline-variant [&_.recharts-dot]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_line]:stroke-outline-variant/40 [&_.recharts-radial-bar-background-sector]:fill-surface-variant [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-variant/40 [&_.recharts-reference-line_line]:stroke-outline-variant [&_.recharts-sector]:stroke-transparent [&_.recharts-surface]:outline-none",
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
${prefix} [data-chart=${id}] {
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

export const ChartTooltip = RechartsPrimitive.Tooltip;

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
      formatter,
      color,
      nameKey,
      labelKey,
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

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-md border border-outline-variant bg-surface px-3 py-2 text-xs shadow-ambient text-on-surface',
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
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
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
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

export const ChartLegend = RechartsPrimitive.Legend;

export interface ChartLegendContentProps
  extends React.ComponentProps<'div'> {
  payload?: any[];
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
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
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

// ---------------------------------------------------------------------------
// Backwards-Compatible Therapy Data Visualisation Demo Component
// ---------------------------------------------------------------------------

export interface ChartBarProps {
  label: string;
  value: number; // 0-100
  colorRole: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';
}

export const DataVisChart: React.FC = () => {
  const outcomeData = [
    { label: 'Correct responses', value: 85, fill: 'var(--color-correct)' },
    { label: 'Incorrect responses', value: 15, fill: 'var(--color-incorrect)' },
  ];

  const outcomeConfig: ChartConfig = {
    value: { label: 'Responses' },
    correct: {
      label: 'Correct responses',
      color: 'var(--color-success)',
    },
    incorrect: {
      label: 'Incorrect responses',
      color: 'var(--color-error)',
    },
  };

  const categoricalData = [
    { category: 'Phoneme practice', minutes: 72, fill: 'var(--color-phoneme)' },
    { category: 'Vocal fluency', minutes: 54, fill: 'var(--color-fluency)' },
    { category: 'Articulation drills', minutes: 38, fill: 'var(--color-articulation)' },
  ];

  const categoricalConfig: ChartConfig = {
    minutes: { label: 'Minutes' },
    phoneme: {
      label: 'Phoneme practice',
      color: 'var(--color-primary)',
    },
    fluency: {
      label: 'Vocal fluency',
      color: 'var(--color-secondary)',
    },
    articulation: {
      label: 'Articulation drills',
      color: 'var(--color-tertiary)',
    },
  };

  return (
    <div className="@container grid grid-cols-1 @md:grid-cols-2 gap-6 w-full">
      {/* Outcome Feedback Chart */}
      <div className="p-6 rounded-lg bg-surface border-none shadow-ambient">
        <h4
          className="font-heading text-headline-sm font-semibold text-on-surface mb-1"
          style={{ textWrap: 'balance' }}
        >
          Therapy Exercise Outcome Feedback
        </h4>
        <p
          className="font-sans text-sm text-on-surface-variant mb-6"
          style={{ textWrap: 'pretty' }}
        >
          Uses semantic <span className="font-semibold text-success">success</span> and{' '}
          <span className="font-semibold text-error">error</span> tokens specifically for domain outcome feedback.
        </p>

        <ChartContainer
          role="img"
          aria-label="Therapy exercise outcome feedback bar chart showing correct and incorrect response percentages"
          config={outcomeConfig}
          className="h-64 w-full aspect-auto"
        >
          <RechartsPrimitive.BarChart
            data={outcomeData}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
          >
            <RechartsPrimitive.CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <RechartsPrimitive.XAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              className="font-mono text-xs tabular-nums"
            />
            <RechartsPrimitive.YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={130}
              className="font-sans text-xs font-medium"
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-surface-container)' }}
              content={<ChartTooltipContent hideLabel indicator="dot" formatter={(val) => `${val}%`} />}
            />
            <RechartsPrimitive.Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
              {outcomeData.map((entry, index) => (
                <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RechartsPrimitive.Bar>
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      </div>

      {/* Categorical Progress Chart */}
      <div className="p-6 rounded-lg bg-surface border-none shadow-ambient">
        <h4
          className="font-heading text-headline-sm font-semibold text-on-surface mb-1"
          style={{ textWrap: 'balance' }}
        >
          Neutral Categorical Progress (Fixed Order)
        </h4>
        <p
          className="font-sans text-sm text-on-surface-variant mb-6"
          style={{ textWrap: 'pretty' }}
        >
          Order: <span className="font-semibold text-primary">Primary</span> →{' '}
          <span className="font-semibold text-secondary">Secondary</span> →{' '}
          <span className="font-semibold text-on-surface">Tertiary</span> (capped at 3 series).
        </p>

        <ChartContainer
          role="img"
          aria-label="Neutral categorical progress bar chart showing phoneme practice, vocal fluency, and articulation drill minutes"
          config={categoricalConfig}
          className="h-64 w-full aspect-auto"
        >
          <RechartsPrimitive.BarChart
            data={categoricalData}
            margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
          >
            <RechartsPrimitive.CartesianGrid vertical={false} strokeDasharray="3 3" />
            <RechartsPrimitive.XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              className="font-sans text-xs font-medium"
            />
            <RechartsPrimitive.YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}m`}
              className="font-mono text-xs tabular-nums"
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-surface-container)' }}
              content={<ChartTooltipContent hideLabel indicator="dot" formatter={(val) => `${val} mins`} />}
            />
            <RechartsPrimitive.Bar dataKey="minutes" radius={[6, 6, 0, 0]} barSize={36}>
              {categoricalData.map((entry, index) => (
                <RechartsPrimitive.Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  stroke={entry.category === 'Articulation drills' ? 'var(--color-outline)' : undefined}
                  strokeWidth={entry.category === 'Articulation drills' ? 1 : 0}
                />
              ))}
            </RechartsPrimitive.Bar>
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
