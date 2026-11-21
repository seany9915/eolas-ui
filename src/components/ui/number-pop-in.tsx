'use client';

/**
 * NumberPopIn
 *
 * Digit pop-in animation primitive based strictly on transitions.dev (02-number-pop-in.md).
 * Platform Reference: https://transitions.dev/detail.html?t=number-pop-in
 *
 * Decomposes numeric strings into individual character spans. When updated,
 * each digit pops into place with 8px vertical travel, 2px micro-blur, and spring overshoot
 * (cubic-bezier(0.34, 1.45, 0.64, 1)). Trailing decimal digits stagger by 70ms so updates feel
 * alive without looking chaotic.
 *
 * Tabular numerals prevent layout jitter.
 * Complies with WCAG 2.2 and motion-reduce:animate-none.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NumberPopInProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (value: number) => string;
  /** Whether to announce value updates via a polite live region. Defaults to false. */
  announce?: boolean;
  className?: string;
}

export const NumberPopIn = React.forwardRef<HTMLSpanElement, NumberPopInProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
      format,
      announce = false,
      role,
      'aria-live': ariaLive,
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

    // Decompose into characters and anchor stagger cleanly to numeric digits (never the '.' separator).
    const charItems = React.useMemo(() => {
      const chars = formattedText.split('');
      const decimalIdx = formattedText.lastIndexOf('.');

      if (decimalIdx !== -1) {
        let fractionalDigitCount = 0;
        return chars.map((char, idx) => {
          let staggerIndex = 0;
          if (idx > decimalIdx && /[0-9]/.test(char)) {
            fractionalDigitCount += 1;
            staggerIndex = Math.min(fractionalDigitCount, 2);
          }
          return { char, idx, staggerIndex };
        });
      }

      const digitIndices: number[] = [];
      for (let i = 0; i < chars.length; i += 1) {
        if (/[0-9]/.test(chars[i])) {
          digitIndices.push(i);
        }
      }

      const staggerByIndex = new Map<number, number>();
      if (digitIndices.length > 1) {
        const trailingCount = Math.min(2, digitIndices.length - 1);
        const startPos = digitIndices.length - trailingCount;
        for (let i = 0; i < trailingCount; i += 1) {
          staggerByIndex.set(digitIndices[startPos + i], i + 1);
        }
      }

      return chars.map((char, idx) => ({
        char,
        idx,
        staggerIndex: staggerByIndex.get(idx) ?? 0,
      }));
    }, [formattedText]);

    const fullText = `${prefix}${formattedText}${suffix}`;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-baseline font-mono text-inherit tabular-nums overflow-visible',
          className
        )}
        role={role ?? (announce ? 'status' : undefined)}
        aria-live={ariaLive ?? (announce ? 'polite' : undefined)}
        {...props}
      >
        <span className="sr-only select-none">{fullText}</span>

        {prefix && (
          <span aria-hidden="true" className="me-0.5">
            {prefix}
          </span>
        )}

        <span key={formattedText} aria-hidden="true" className="inline-flex items-baseline">
          {charItems.map(({ char, idx, staggerIndex }) => {
            const delayMs = staggerIndex * 70; // 70ms per digit (--digit-stagger)

            return (
              <span
                key={`${idx}-${char}`}
                style={{
                  animationDelay: `${delayMs}ms`,
                }}
                className={cn(
                  'inline-block animate-digit-pop',
                  'motion-reduce:animate-none motion-reduce:transform-none motion-reduce:filter-none'
                )}
              >
                {char}
              </span>
            );
          })}
        </span>

        {suffix && (
          <span aria-hidden="true" className="ms-0.5">
            {suffix}
          </span>
        )}
      </span>
    );
  }
);

NumberPopIn.displayName = 'NumberPopIn';

export default NumberPopIn;
