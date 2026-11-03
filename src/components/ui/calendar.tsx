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
 *   primary brand selection, surface-container range fills, and WCAG 2.2 AA contrast.
 */
import * as React from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

export type { DateRange };

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

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
      className={cn('material-symbols-outlined text-lg leading-none select-none', className)}
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
      showOutsideDays={showOutsideDays}
      className={cn('p-3 bg-surface text-on-surface rounded-lg border border-outline-variant', className)}
      classNames={{
        root: 'p-1',
        months: 'relative flex flex-col sm:flex-row gap-4',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center items-center h-9 relative',
        caption_label: 'text-sm font-semibold font-label text-on-surface',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between h-9 px-1 pointer-events-none z-10',
        button_previous:
          'pointer-events-auto h-8 w-8 min-h-0 min-w-0 p-0 rounded-md inline-flex items-center justify-center bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none',
        button_next:
          'pointer-events-auto h-8 w-8 min-h-0 min-w-0 p-0 rounded-md inline-flex items-center justify-center bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-on-surface-variant rounded-md w-9 font-normal text-xs text-center font-sans select-none',
        weeks: 'flex flex-col gap-1',
        week: 'flex w-full mt-1',
        day: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 font-sans',
        day_button:
          'h-9 w-9 p-0 font-normal rounded-md inline-flex items-center justify-center font-sans text-sm text-on-surface hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer select-none',
        selected:
          'bg-primary text-on-primary rounded-md [&>button]:bg-primary [&>button]:text-on-primary [&>button]:font-semibold [&>button]:hover:bg-primary/90 [&>button]:hover:text-on-primary [&>button]:border-transparent [&>button]:after:hidden',
        range_start:
          'rounded-l-md bg-primary text-on-primary [&>button]:bg-primary [&>button]:text-on-primary [&>button]:font-semibold [&>button]:hover:bg-primary/90 [&>button]:hover:text-on-primary [&>button]:border-transparent [&>button]:after:hidden',
        range_end:
          'rounded-r-md bg-primary text-on-primary [&>button]:bg-primary [&>button]:text-on-primary [&>button]:font-semibold [&>button]:hover:bg-primary/90 [&>button]:hover:text-on-primary [&>button]:border-transparent [&>button]:after:hidden',
        range_middle:
          'bg-surface-container text-on-surface rounded-none [&>button]:bg-transparent [&>button]:text-on-surface [&>button]:hover:bg-surface-container-high',
        today:
          '[&>button]:font-bold [&>button]:relative [&>button]:after:content-[""] [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:size-1 [&>button]:after:rounded-full [&>button]:after:bg-primary',
        outside:
          'text-on-surface-variant/40 opacity-50 [&>button]:text-on-surface-variant/40',
        disabled:
          'text-on-surface-variant/30 opacity-30 cursor-not-allowed pointer-events-none [&>button]:cursor-not-allowed [&>button]:pointer-events-none',
        hidden: 'invisible',
        dropdowns: 'flex items-center gap-2 justify-center',
        dropdown:
          'text-sm font-label font-semibold text-on-surface bg-surface border border-outline-variant rounded-md px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary',
        dropdown_root: 'relative inline-flex items-center',
        months_dropdown:
          'text-sm font-label text-on-surface bg-surface border border-outline-variant rounded-md px-2 py-1',
        years_dropdown:
          'text-sm font-label text-on-surface bg-surface border border-outline-variant rounded-md px-2 py-1',
        ...classNames,
      }}
      components={{
        Chevron: DefaultChevron,
        ...components,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export default Calendar;
