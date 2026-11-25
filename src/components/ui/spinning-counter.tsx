'use client';

/**
 * SpinningCounter
 *
 * Slot-machine reel counter based strictly on transitions.dev (26-spinning-counter.md).
 * Platform Reference: https://transitions.dev/detail.html?t=spinning-counter
 *
 * Each numeric character is a clipped vertical reel column that smoothly spins
 * to the target digit with a 90ms per-column stagger and vertical edge soft-masks
 * so numbers never hard-crop at bounding edges.
 *
 * Perfect for celebration milestones, dashboard KPIs, and gamified progress.
 * Complies with WCAG 2.2 and motion-reduce:transition-none.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinningCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: Intl.LocalesArgument;
  format?: (value: number) => string;
  /** Cell height as a CSS length (e.g. '1.4em') or pixel number. Defaults to '1.4em' for zoom safety. */
  cellHeight?: number | string;
  /** Duration of reel roll in ms. Defaults to 1200ms (--reel-dur). */
  duration?: number;
  /** Whether to announce value updates via a polite live region. Defaults to false. */
  announce?: boolean;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const counterFormatterCache = new Map<string, Intl.NumberFormat>();

function getCachedCounterFormatter(
  locale: Intl.LocalesArgument | undefined,
  decimals: number
): Intl.NumberFormat {
  const localeKey = Array.isArray(locale) ? locale.join(',') : (locale ?? 'default');
  const cacheKey = `${localeKey}|${decimals}`;
  let formatter = counterFormatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      numberingSystem: 'latn',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    counterFormatterCache.set(cacheKey, formatter);
  }
  return formatter;
}

interface ReelColumnProps {
  char: string;
  columnIndex: number;
  cellHeight: string;
  duration: number;
}

const ReelColumn: React.FC<ReelColumnProps> = ({ char, columnIndex, cellHeight, duration }) => {
  const isDigit = /^[0-9]$/.test(char);

  if (!isDigit) {
    return (
      <span
        style={{ height: cellHeight, lineHeight: cellHeight }}
        className="inline-flex items-center justify-center font-mono tabular-nums px-0.5"
      >
        {char}
      </span>
    );
  }

  const targetDigit = parseInt(char, 10);
  const staggerDelay = Math.min(columnIndex, 4) * 40; // capped at 5 items / 200ms per DESIGN.md Motion Rule 5

  return (
    <span
      style={{
        height: cellHeight,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
      }}
      className="relative inline-block overflow-hidden font-mono tabular-nums"
    >
      <span
        style={{
          transform: `translateY(calc(-${targetDigit} * ${cellHeight}))`,
          transition: `transform ${duration}ms var(--ease-standard) ${staggerDelay}ms`,
        }}
        className="flex flex-col motion-reduce:transition-none!"
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            style={{ height: cellHeight, lineHeight: cellHeight }}
            className="flex items-center justify-center text-center"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

interface KeyedColumn {
  key: string;
  char: string;
}

function buildAnchoredColumns(formattedText: string): KeyedColumn[] {
  const chars = formattedText.split('');
  const decimalIdx = formattedText.lastIndexOf('.');
  const intEnd = decimalIdx === -1 ? chars.length : decimalIdx;

  const columns: KeyedColumn[] = Array.from({ length: chars.length });

  // Anchor integer digits leftward from the decimal point (int-0 = ones, int-1 = tens, ...).
  let intDigitPos = 0;
  let intSepPos = 0;
  for (let i = intEnd - 1; i >= 0; i -= 1) {
    const char = chars[i];
    if (/^[0-9]$/.test(char)) {
      columns[i] = { key: `int-${intDigitPos}`, char };
      intDigitPos += 1;
    } else {
      columns[i] = { key: `sep-int-${intSepPos}`, char };
      intSepPos += 1;
    }
  }

  // Anchor decimal point and fractional digits rightward from the decimal point (dec-0, dec-1, ...).
  if (decimalIdx !== -1) {
    columns[decimalIdx] = { key: 'sep-decimal', char: chars[decimalIdx] };
    let decDigitPos = 0;
    let decSepPos = 0;
    for (let i = decimalIdx + 1; i < chars.length; i += 1) {
      const char = chars[i];
      if (/^[0-9]$/.test(char)) {
        columns[i] = { key: `dec-${decDigitPos}`, char };
        decDigitPos += 1;
      } else {
        columns[i] = { key: `sep-dec-${decSepPos}`, char };
        decSepPos += 1;
      }
    }
  }

  return columns;
}

function buildColumnsFromParts(parts: Intl.NumberFormatPart[]): KeyedColumn[] {
  const decimalIdx = parts.findIndex((p) => p.type === 'decimal');
  const intParts = decimalIdx === -1 ? parts : parts.slice(0, decimalIdx);
  const fracParts = decimalIdx === -1 ? [] : parts.slice(decimalIdx + 1);

  const intColumns: KeyedColumn[] = [];
  let intDigitPos = 0;
  let intSepPos = 0;
  for (let p = intParts.length - 1; p >= 0; p -= 1) {
    const part = intParts[p];
    const chars = Array.from(part.value);
    for (let c = chars.length - 1; c >= 0; c -= 1) {
      const char = chars[c];
      if (part.type === 'integer' && /^[0-9]$/.test(char)) {
        intColumns.unshift({ key: `int-${intDigitPos}`, char });
        intDigitPos += 1;
      } else {
        intColumns.unshift({ key: `sep-int-${intSepPos}`, char });
        intSepPos += 1;
      }
    }
  }

  const fracColumns: KeyedColumn[] = [];
  if (decimalIdx !== -1) {
    fracColumns.push({ key: 'sep-decimal', char: parts[decimalIdx].value });
    let decDigitPos = 0;
    let decSepPos = 0;
    for (const part of fracParts) {
      for (const char of part.value) {
        if (part.type === 'fraction' && /^[0-9]$/.test(char)) {
          fracColumns.push({ key: `dec-${decDigitPos}`, char });
          decDigitPos += 1;
        } else {
          fracColumns.push({ key: `sep-dec-${decSepPos}`, char });
          decSepPos += 1;
        }
      }
    }
  }

  return [...intColumns, ...fracColumns];
}

export const SpinningCounter = React.forwardRef<HTMLSpanElement, SpinningCounterProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
      locale,
      format,
      cellHeight = '1.4em',
      duration = 1200,
      announce = false,
      role,
      'aria-live': ariaLive,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const safeValue = Number.isFinite(value) ? value : 0;

    const { formattedText, columns } = React.useMemo(() => {
      if (format) {
        const text = format(safeValue);
        return { formattedText: text, columns: buildAnchoredColumns(text) };
      }
      const normalizedDecimals = Math.max(0, Math.floor(decimals));
      const parts = getCachedCounterFormatter(locale, normalizedDecimals).formatToParts(safeValue);
      const cols = buildColumnsFromParts(parts);
      return { formattedText: cols.map((c) => c.char).join(''), columns: cols };
    }, [safeValue, format, decimals, locale]);

    const resolvedCellHeight = typeof cellHeight === 'number' ? `${cellHeight}px` : cellHeight;

    return (
      <span
        ref={ref}
        style={{ height: resolvedCellHeight, ...style }}
        className={cn(
          'inline-flex items-center font-mono text-inherit tabular-nums overflow-hidden',
          className
        )}
        role={role ?? (announce ? 'status' : undefined)}
        aria-live={ariaLive ?? (announce ? 'polite' : undefined)}
        {...props}
      >
        <span className="sr-only">{`${prefix}${formattedText}${suffix}`}</span>
        {prefix && (
          <span
            aria-hidden="true"
            style={{ height: resolvedCellHeight, lineHeight: resolvedCellHeight }}
            className="me-0.5 inline-flex items-center"
          >
            {prefix}
          </span>
        )}

        <span aria-hidden="true" className="inline-flex items-center">
          {columns.map((col, idx) => (
            <ReelColumn
              key={col.key}
              char={col.char}
              columnIndex={idx}
              cellHeight={resolvedCellHeight}
              duration={duration}
            />
          ))}
        </span>

        {suffix && (
          <span
            aria-hidden="true"
            style={{ height: resolvedCellHeight, lineHeight: resolvedCellHeight }}
            className="ms-0.5 inline-flex items-center"
          >
            {suffix}
          </span>
        )}
      </span>
    );
  }
);

SpinningCounter.displayName = 'SpinningCounter';

export default SpinningCounter;
