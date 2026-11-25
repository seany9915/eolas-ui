'use client';

/**
 * Duration Formatting Utility and Hook
 *
 * Platform Reference: Modern Web Guidance (MWG: calculate-event-differentials)
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
  /** Locale identifier (e.g. 'en-US', 'en-GB', 'fr-FR'). Defaults to the browser/runtime locale (`undefined`). */
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

const MAX_FORMATTER_CACHE = 32;
const durationFormatterCache = new Map<string, IntlDurationFormatInstance>();

function getCachedDurationFormat(
  locale: string | undefined,
  style: 'long' | 'short' | 'narrow' | 'digital'
): IntlDurationFormatInstance | null {
  if (typeof Intl === 'undefined' || !Intl.DurationFormat) return null;
  const cacheKey = `${locale ?? ''}|${style}`;
  const cached = durationFormatterCache.get(cacheKey);
  if (cached) return cached;
  const formatter = new Intl.DurationFormat(locale, { style });
  if (durationFormatterCache.size >= MAX_FORMATTER_CACHE) {
    const oldestKey = durationFormatterCache.keys().next().value;
    if (oldestKey !== undefined) durationFormatterCache.delete(oldestKey);
  }
  durationFormatterCache.set(cacheKey, formatter);
  return formatter;
}

/**
 * Fallback duration formatter for environments without Intl.DurationFormat
 */
function manualFormatDuration(duration: DurationUnits, style: 'long' | 'short' | 'narrow' | 'digital'): string {
  const rawUnits = [
    duration.years ?? 0,
    duration.months ?? 0,
    duration.weeks ?? 0,
    duration.days ?? 0,
    duration.hours ?? 0,
    duration.minutes ?? 0,
    duration.seconds ?? 0,
    duration.milliseconds ?? 0,
  ];
  const nonZeroUnits = rawUnits.filter((n) => n !== 0);
  const allNegative = nonZeroUnits.length > 0 && nonZeroUnits.every((n) => n < 0);

  const normalize = (n: number) => (allNegative ? Math.abs(n) : n);
  const years = normalize(rawUnits[0]);
  const months = normalize(rawUnits[1]);
  const weeks = normalize(rawUnits[2]);
  const days = normalize(rawUnits[3]);
  const hours = normalize(rawUnits[4]);
  const minutes = normalize(rawUnits[5]);
  const seconds = normalize(rawUnits[6]);
  const milliseconds = normalize(rawUnits[7]);
  const signPrefix = allNegative ? '-' : '';

  if (style === 'digital') {
    const pad2 = (n: number) => String(Math.abs(n)).padStart(2, '0');
    const pad3 = (n: number) => String(Math.abs(n)).padStart(3, '0');
    const prefix: string[] = [];
    if (years !== 0) prefix.push(`${years} yr${Math.abs(years) === 1 ? '' : 's'}`);
    if (months !== 0) prefix.push(`${months} mo${Math.abs(months) === 1 ? '' : 's'}`);
    if (weeks !== 0) prefix.push(`${weeks} wk${Math.abs(weeks) === 1 ? '' : 's'}`);
    if (days !== 0) prefix.push(`${days} day${Math.abs(days) === 1 ? '' : 's'}`);

    const msSuffix = milliseconds !== 0 ? `.${pad3(milliseconds)}` : '';
    const clock =
      hours !== 0
        ? `${hours}:${pad2(minutes)}:${pad2(seconds)}${msSuffix}`
        : `${minutes}:${pad2(seconds)}${msSuffix}`;

    const body = prefix.length > 0 ? `${prefix.join(', ')}, ${clock}` : clock;
    return `${signPrefix}${body}`;
  }

  const parts: string[] = [];

  if (years !== 0) {
    if (style === 'narrow') parts.push(`${years}y`);
    else if (style === 'short') parts.push(`${years} yr${Math.abs(years) === 1 ? '' : 's'}`);
    else parts.push(`${years} year${Math.abs(years) === 1 ? '' : 's'}`);
  }

  if (months !== 0) {
    if (style === 'narrow') parts.push(`${months}mo`);
    else if (style === 'short') parts.push(`${months} mo${Math.abs(months) === 1 ? '' : 's'}`);
    else parts.push(`${months} month${Math.abs(months) === 1 ? '' : 's'}`);
  }

  if (weeks !== 0) {
    if (style === 'narrow') parts.push(`${weeks}w`);
    else if (style === 'short') parts.push(`${weeks} wk${Math.abs(weeks) === 1 ? '' : 's'}`);
    else parts.push(`${weeks} week${Math.abs(weeks) === 1 ? '' : 's'}`);
  }

  if (days !== 0) {
    if (style === 'narrow') parts.push(`${days}d`);
    else parts.push(`${days} day${Math.abs(days) === 1 ? '' : 's'}`);
  }

  if (hours !== 0) {
    if (style === 'narrow') parts.push(`${hours}h`);
    else if (style === 'short') parts.push(`${hours} hr${Math.abs(hours) === 1 ? '' : 's'}`);
    else parts.push(`${hours} hour${Math.abs(hours) === 1 ? '' : 's'}`);
  }

  if (minutes !== 0) {
    if (style === 'narrow') parts.push(`${minutes}m`);
    else if (style === 'short') parts.push(`${minutes} min`);
    else parts.push(`${minutes} minute${Math.abs(minutes) === 1 ? '' : 's'}`);
  }

  if (seconds !== 0) {
    if (style === 'narrow') parts.push(`${seconds}s`);
    else if (style === 'short') parts.push(`${seconds} sec`);
    else parts.push(`${seconds} second${Math.abs(seconds) === 1 ? '' : 's'}`);
  }

  if (milliseconds !== 0) {
    if (style === 'narrow' || style === 'short') parts.push(`${milliseconds} ms`);
    else parts.push(`${milliseconds} millisecond${Math.abs(milliseconds) === 1 ? '' : 's'}`);
  }

  if (parts.length === 0) {
    if (style === 'narrow') parts.push('0s');
    else if (style === 'short') parts.push('0 sec');
    else parts.push('0 seconds');
  }

  if (style === 'long' && parts.length > 1) {
    const last = parts.pop();
    return `${signPrefix}${parts.join(', ')} and ${last}`;
  }

  return `${signPrefix}${parts.join(style === 'narrow' ? ' ' : ', ')}`;
}

/**
 * Formats a duration object into a localized human-readable string.
 */
export function formatDuration(
  duration: DurationUnits,
  options: DurationFormatOptions = {}
): string {
  const { locale = undefined, style = 'long' } = options;

  try {
    const formatter = getCachedDurationFormat(locale, style);
    if (formatter) {
      return formatter.format(duration);
    }
  } catch {
    // Fallback on error (e.g. mixed-sign duration objects or invalid locale)
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
  const {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  } = duration;

  return React.useMemo(() => {
    return formatDuration(
      { years, months, weeks, days, hours, minutes, seconds, milliseconds },
      { locale, style }
    );
  }, [
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    locale,
    style,
  ]);
}
