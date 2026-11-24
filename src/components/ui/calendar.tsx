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
 *   primary brand selection, surface-container-high range fills, and WCAG 2.2 AA contrast.
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
        'size-9 p-0 font-normal rounded inline-flex items-center justify-center font-sans text-sm text-on-surface hover:bg-state-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none',
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

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps): React.JSX.Element {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn('w-fit max-w-full overflow-x-auto p-3 bg-surface text-on-surface rounded-lg border border-outline-variant', className)}
      classNames={{
        root: 'p-1',
        months: 'relative flex flex-col sm:flex-row sm:flex-wrap gap-4',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center items-center h-9 px-9 relative',
        caption_label: 'inline-flex items-center gap-0.5 text-sm font-semibold font-label text-on-surface whitespace-nowrap select-none pointer-events-none',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between h-9 px-1 pointer-events-none z-10',
        button_previous:
          'pointer-events-auto relative after:absolute after:-inset-1.5 after:content-[\'\'] size-8 min-h-0 min-w-0 p-0 rounded inline-flex items-center justify-center bg-surface text-on-surface-variant border border-outline-variant hover:bg-state-hover hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none',
        button_next:
          'pointer-events-auto relative after:absolute after:-inset-1.5 after:content-[\'\'] size-8 min-h-0 min-w-0 p-0 rounded inline-flex items-center justify-center bg-surface text-on-surface-variant border border-outline-variant hover:bg-state-hover hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-on-surface-variant rounded w-9 font-normal text-xs text-center font-sans select-none',
        weeks: 'flex flex-col gap-1',
        week: 'flex w-full mt-1',
        day: 'size-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 font-sans',
        day_button:
          'size-9 p-0 font-normal rounded inline-flex items-center justify-center font-sans text-sm text-on-surface hover:bg-state-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none',
        selected:
          'bg-primary text-on-primary rounded [&>button]:bg-primary [&>button]:text-on-primary [&>button]:font-semibold [&>button]:hover:bg-primary/90 [&>button]:hover:text-on-primary [&>button]:border-transparent [&>button]:after:hidden',
        range_start:
          'rounded-s bg-primary text-on-primary [&>button]:bg-primary [&>button]:text-on-primary [&>button]:font-semibold [&>button]:hover:bg-primary/90 [&>button]:hover:text-on-primary [&>button]:border-transparent [&>button]:after:hidden',
        range_end:
          'rounded-e bg-primary text-on-primary [&>button]:bg-primary [&>button]:text-on-primary [&>button]:font-semibold [&>button]:hover:bg-primary/90 [&>button]:hover:text-on-primary [&>button]:border-transparent [&>button]:after:hidden',
        range_middle:
          'bg-surface-container-high text-on-surface rounded-none [&>button]:bg-transparent [&>button]:text-on-surface [&>button]:hover:bg-state-hover',
        today:
          '[&>button]:font-bold [&>button]:relative [&>button]:after:content-[""] [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:size-1 [&>button]:after:rounded-full [&>button]:after:bg-primary',
        outside:
          'text-on-surface-variant/60 [&>button]:text-on-surface-variant/60',
        disabled:
          'text-on-surface-variant/30 opacity-30 cursor-not-allowed pointer-events-none [&>button]:cursor-not-allowed [&>button]:pointer-events-none',
        hidden: 'invisible',
        dropdowns: 'flex items-center gap-1.5 justify-center text-sm font-semibold font-label text-on-surface',
        dropdown:
          'absolute inset-0 size-full opacity-0 cursor-pointer appearance-none z-[5] focus-visible:outline-none',
        dropdown_root:
          'relative inline-flex items-center rounded border border-outline bg-surface px-1.5 h-9 hover:bg-state-hover transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:border-primary',
        months_dropdown: '',
        years_dropdown: '',
        ...classNames,
      }}
      components={{
        Chevron: DefaultChevron,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export default Calendar;
