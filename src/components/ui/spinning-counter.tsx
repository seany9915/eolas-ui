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
  const staggerDelay = columnIndex * 90; // 90ms per column (--reel-stagger)

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
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms`,
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

export const SpinningCounter = React.forwardRef<HTMLSpanElement, SpinningCounterProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
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
    const formattedText = React.useMemo(() => {
      if (format) return format(value);
      if (decimals > 0) return value.toFixed(decimals);
      return Math.round(value).toLocaleString();
    }, [value, format, decimals]);

    const resolvedCellHeight = typeof cellHeight === 'number' ? `${cellHeight}px` : cellHeight;
    const columns = React.useMemo(() => buildAnchoredColumns(formattedText), [formattedText]);

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
