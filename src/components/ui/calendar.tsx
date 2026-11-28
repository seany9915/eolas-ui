'use client';

/**
 * Calendar primitive (React DayPicker).
 *
 * Base UI Ecosystem Documentation: https://ui.shadcn.com/docs/components/base/calendar
 * React DayPicker Documentation: https://daypicker.dev
 *
 * TAXONOMY & USAGE:
 * - Use Calendar for date, multiple date, and date range selections.
 * - Integrates with React DayPicker v9/v10 while maintaining complete shadcn/ui API compatibility.
 * - Commonly paired with Popover and Button to form a DatePicker.
 * - Follows DESIGN.md tokens: Lexend body/cell font (font-sans), Atkinson Hyperlegible Next headings,
 *   primary brand selection, primary-container range fills, and WCAG 2.2 AA contrast.
 */
import * as React from 'react';
import { DayPicker, type DateRange, type DayButtonProps } from 'react-day-picker';
import { cn } from '@/lib/utils';

export type { DateRange, DayButtonProps };

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps): React.JSX.Element {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-slot="calendar-day-button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
          ? true
          : undefined
      }
      data-range-start={modifiers.range_start || undefined}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      data-today={modifiers.today || undefined}
      data-outside={modifiers.outside || undefined}
      className={cn(
        'relative size-9 p-0 font-normal rounded inline-flex items-center justify-center font-sans text-sm text-on-surface hover:bg-state-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors motion-reduce:transition-none cursor-pointer select-none',
        'data-[outside]:text-on-surface-variant/60',
        'data-[today]:font-bold data-[today]:after:content-[""] data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:-translate-x-1/2 data-[today]:after:size-1 data-[today]:after:rounded-full data-[today]:after:bg-primary',
        'data-[range-middle]:rounded-none data-[range-middle]:bg-transparent data-[range-middle]:text-on-primary-container data-[range-middle]:hover:bg-primary/15 data-[range-middle]:hover:text-on-primary-container',
        'data-[selected-single]:bg-primary data-[selected-single]:text-on-primary data-[selected-single]:font-semibold data-[selected-single]:hover:bg-primary/90 data-[selected-single]:hover:text-on-primary data-[selected-single]:data-[today]:after:bg-on-primary',
        'data-[range-start]:rounded data-[range-start]:bg-primary data-[range-start]:text-on-primary data-[range-start]:font-semibold data-[range-start]:hover:bg-primary/90 data-[range-start]:hover:text-on-primary data-[range-start]:data-[today]:after:bg-on-primary',
        'data-[range-end]:rounded data-[range-end]:bg-primary data-[range-end]:text-on-primary data-[range-end]:font-semibold data-[range-end]:hover:bg-primary/90 data-[range-end]:hover:text-on-primary data-[range-end]:data-[today]:after:bg-on-primary',
        className
      )}
      {...props}
    />
  );
}
CalendarDayButton.displayName = 'CalendarDayButton';

function DefaultChevron({
  orientation = 'left',
  className,
  ...props
}: {
  orientation?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}): React.JSX.Element {
  const iconName =
    orientation === 'left'
      ? 'chevron_left'
      : orientation === 'right'
        ? 'chevron_right'
        : orientation === 'up'
          ? 'expand_less'
          : 'expand_more';

  return (
    <span
      className={cn(
        'material-symbols-outlined leading-none select-none',
        orientation === 'down' || orientation === 'up' ? 'text-base' : 'text-lg icon-directional',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {iconName}
    </span>
  );
}

const defaultCalendarClassNames: NonNullable<CalendarProps['classNames']> = {
  root: 'p-1',
  months: 'relative flex flex-col sm:flex-row sm:flex-wrap gap-4',
  month: 'flex flex-col gap-4',
  month_caption: 'flex justify-center items-center h-9 px-9 relative',
  caption_label: 'inline-flex items-center gap-0.5 text-sm font-semibold font-label text-on-surface whitespace-nowrap select-none pointer-events-none',
  nav: 'absolute inset-x-0 top-0 flex items-center justify-between h-9 px-1 pointer-events-none z-10',
  button_previous:
    'pointer-events-auto relative after:absolute after:-inset-1.5 after:content-[\'\'] size-8 min-h-0 min-w-0 p-0 rounded inline-flex items-center justify-center bg-surface text-on-surface-variant border border-outline-variant hover:bg-state-hover hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors motion-reduce:transition-none cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none',
  button_next:
    'pointer-events-auto relative after:absolute after:-inset-1.5 after:content-[\'\'] size-8 min-h-0 min-w-0 p-0 rounded inline-flex items-center justify-center bg-surface text-on-surface-variant border border-outline-variant hover:bg-state-hover hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors motion-reduce:transition-none cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'text-on-surface-variant rounded w-9 font-normal text-xs text-center font-sans select-none',
  weeks: 'flex flex-col gap-1',
  week: 'flex w-full',
  day: 'size-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 font-sans',
  day_button:
    'size-9 p-0 font-normal rounded inline-flex items-center justify-center font-sans text-sm text-on-surface hover:bg-state-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors motion-reduce:transition-none cursor-pointer select-none',
  selected: '',
  range_start: 'bg-primary-container rounded-s',
  range_end: 'bg-primary-container rounded-e',
  range_middle: 'bg-primary-container rounded-none first:rounded-s last:rounded-e',
  today: '',
  outside: 'text-on-surface-variant/60',
  disabled:
    'text-on-surface-variant/30 opacity-40 cursor-not-allowed pointer-events-none [&>button]:cursor-not-allowed [&>button]:pointer-events-none',
  hidden: 'invisible',
  dropdowns: 'flex items-center gap-1.5 justify-center text-sm font-semibold font-label text-on-surface',
  dropdown:
    'absolute inset-0 size-full opacity-0 cursor-pointer appearance-none z-[5] focus-visible:outline-none',
  dropdown_root:
    'relative inline-flex items-center rounded border border-outline bg-surface px-1.5 h-9 hover:bg-state-hover transition-colors motion-reduce:transition-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:border-primary',
  months_dropdown: '',
  years_dropdown: '',
};

function mergeCalendarClassNames(
  defaults: NonNullable<CalendarProps['classNames']>,
  overrides?: CalendarProps['classNames']
): NonNullable<CalendarProps['classNames']> {
  if (!overrides) return defaults;
  const merged: Record<string, string> = { ...(defaults as Record<string, string>) };
  for (const [key, value] of Object.entries(overrides)) {
    merged[key] = cn(merged[key], value);
  }
  return merged as NonNullable<CalendarProps['classNames']>;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, components, ...props }, ref) => {
    const mergedClassNames = React.useMemo(
      () => mergeCalendarClassNames(defaultCalendarClassNames, classNames),
      [classNames]
    );

    return (
      <div
        ref={ref}
        data-slot="calendar"
        className={cn(
          'w-fit max-w-full overflow-x-auto p-3 bg-surface text-on-surface rounded-lg border border-outline-variant',
          className
        )}
      >
        <DayPicker
          showOutsideDays={showOutsideDays}
          className="w-fit"
          classNames={mergedClassNames}
          components={{
            Chevron: DefaultChevron,
            DayButton: CalendarDayButton,
            ...components,
          }}
          {...props}
        />
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export default Calendar;
