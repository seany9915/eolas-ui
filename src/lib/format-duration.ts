/**
 * Duration Formatting Utility and Hook
 *
 * Platform Reference: Modern Web Guidance (MWG: format-human-readable-durations)
 *
 * Localizes time durations (e.g. clinical appointment lengths, exercise intervals, rehabilitation timers)
 * using the standard `Intl.DurationFormat` API (Baseline Newly Available since March 2025 across
 * Chrome 129+, Edge 129+, Firefox 136+, and Safari 16.4+).
 *
 * Provides a seamless fallback for older runtimes that manual-constructs localized plural strings.
 */
import * as React from 'react';

export interface DurationUnits {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface DurationFormatOptions {
  /** Locale identifier (e.g. 'en-US', 'en-GB', 'fr-FR'). Defaults to browser locale or 'en-GB' */
  locale?: string;
  /** Visual presentation style. 'long' ("1 hour and 30 minutes"), 'short' ("1 hr, 30 min"), 'narrow' ("1h 30m"), or 'digital' ("1:30:00") */
  style?: 'long' | 'short' | 'narrow' | 'digital';
}

interface IntlDurationFormatInstance {
  format(duration: DurationUnits): string;
}

interface IntlDurationFormatConstructor {
  new (
    locales?: string | string[],
    options?: { style?: 'long' | 'short' | 'narrow' | 'digital' }
  ): IntlDurationFormatInstance;
}

declare global {
  namespace Intl {
    const DurationFormat: IntlDurationFormatConstructor | undefined;
  }
}

/**
 * Fallback duration formatter for environments without Intl.DurationFormat
 */
function manualFormatDuration(duration: DurationUnits, style: 'long' | 'short' | 'narrow' | 'digital'): string {
  const parts: string[] = [];
  const { hours = 0, minutes = 0, seconds = 0, days = 0 } = duration;

  if (style === 'digital') {
    const pad = (n: number) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  }

  if (days > 0) {
    if (style === 'narrow') parts.push(`${days}d`);
    else if (style === 'short') parts.push(`${days} day${days === 1 ? '' : 's'}`);
    else parts.push(`${days} day${days === 1 ? '' : 's'}`);
  }

  if (hours > 0) {
    if (style === 'narrow') parts.push(`${hours}h`);
    else if (style === 'short') parts.push(`${hours} hr${hours === 1 ? '' : 's'}`);
    else parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  }

  if (minutes > 0) {
    if (style === 'narrow') parts.push(`${minutes}m`);
    else if (style === 'short') parts.push(`${minutes} min`);
    else parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  }

  if (seconds > 0 || parts.length === 0) {
    if (style === 'narrow') parts.push(`${seconds}s`);
    else if (style === 'short') parts.push(`${seconds} sec`);
    else parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  }

  if (style === 'long' && parts.length > 1) {
    const last = parts.pop();
    return `${parts.join(', ')} and ${last}`;
  }

  return parts.join(style === 'narrow' ? ' ' : ', ');
}

/**
 * Formats a duration object into a localized human-readable string.
 */
export function formatDuration(
  duration: DurationUnits,
  options: DurationFormatOptions = {}
): string {
  const { locale = 'en-GB', style = 'long' } = options;

  if (typeof Intl !== 'undefined' && Intl.DurationFormat) {
    try {
      const formatter = new Intl.DurationFormat(locale, { style });
      return formatter.format(duration);
    } catch {
      // Fallback on error
    }
  }

  return manualFormatDuration(duration, style);
}

/**
 * React hook for formatting duration objects with automatic memoization.
 */
export function useDurationFormat(
  duration: DurationUnits,
  options: DurationFormatOptions = {}
): string {
  const { locale, style } = options;

  return React.useMemo(() => {
    return formatDuration(duration, { locale, style });
  }, [
    duration.years,
    duration.months,
    duration.weeks,
    duration.days,
    duration.hours,
    duration.minutes,
    duration.seconds,
    duration.milliseconds,
    locale,
    style,
  ]);
}
