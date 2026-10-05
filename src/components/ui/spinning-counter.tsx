import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinningCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (value: number) => string;
  /** Cell height in pixels. Defaults to 28px. */
  cellHeight?: number;
  /** Duration of reel roll in ms. Defaults to 1200ms (--reel-dur). */
  duration?: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface ReelColumnProps {
  char: string;
  columnIndex: number;
  cellHeight: number;
  duration: number;
}

const ReelColumn: React.FC<ReelColumnProps> = ({ char, columnIndex, cellHeight, duration }) => {
  const isDigit = /^[0-9]$/.test(char);

  if (!isDigit) {
    return (
      <span
        style={{ height: `${cellHeight}px`, lineHeight: `${cellHeight}px` }}
        className="inline-flex items-center justify-center font-mono tabular-nums px-0.5 select-none"
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
        height: `${cellHeight}px`,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
      }}
      className="relative inline-block overflow-hidden font-mono tabular-nums select-none"
    >
      <span
        style={{
          transform: `translateY(-${targetDigit * cellHeight}px)`,
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms`,
        }}
        className="flex flex-col will-change-transform motion-reduce:transition-none motion-reduce:transform-none"
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            style={{ height: `${cellHeight}px`, lineHeight: `${cellHeight}px` }}
            className="flex items-center justify-center text-center select-none"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

/**
 * SpinningCounter
 *
 * Slot-machine reel counter based strictly on transitions.dev
 * (https://transitions.dev/detail.html?t=spinning-counter / 26-spinning-counter.md).
 *
 * Each numeric character is a clipped vertical reel column that smoothly spins
 * to the target digit with a 90ms per-column stagger and vertical edge soft-masks
 * so numbers never hard-crop at bounding edges.
 *
 * Perfect for celebration milestones, dashboard KPIs, and gamified progress.
 * Complies with WCAG 2.2 and motion-reduce:transition-none.
 */
export const SpinningCounter = React.forwardRef<HTMLSpanElement, SpinningCounterProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
      format,
      cellHeight = 28,
      duration = 1200,
      className,
      ...props
    },
    ref
  ) => {
    const formattedText = React.useMemo(() => {
      if (format) return format(value);
      if (decimals > 0) return value.toFixed(decimals);
      return Math.round(value).toLocaleString();
    }, [value, format, decimals]);

    const chars = formattedText.split('');

    return (
      <span
        ref={ref}
        style={{ height: `${cellHeight}px` }}
        className={cn(
          'inline-flex items-center font-mono text-inherit tabular-nums select-none overflow-hidden',
          className
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        {prefix && (
          <span
            style={{ height: `${cellHeight}px`, lineHeight: `${cellHeight}px` }}
            className="mr-0.5 inline-flex items-center"
          >
            {prefix}
          </span>
        )}

        <span className="inline-flex items-center">
          {chars.map((char, idx) => (
            <ReelColumn
              key={idx}
              char={char}
              columnIndex={idx}
              cellHeight={cellHeight}
              duration={duration}
            />
          ))}
        </span>

        {suffix && (
          <span
            style={{ height: `${cellHeight}px`, lineHeight: `${cellHeight}px` }}
            className="ml-0.5 inline-flex items-center"
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
