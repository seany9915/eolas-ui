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
  locale?: Intl.LocalesArgument;
  format?: (value: number) => string;
  /** Whether to announce value updates via a polite live region. Defaults to false. */
  announce?: boolean;
  className?: string;
}

const popInFormatterCache = new Map<string, Intl.NumberFormat>();

function getCachedPopInFormatter(
  locale: Intl.LocalesArgument | undefined,
  decimals: number
): Intl.NumberFormat {
  const localeKey = Array.isArray(locale) ? locale.join(',') : (locale ?? 'default');
  const cacheKey = `${localeKey}|${decimals}`;
  let formatter = popInFormatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      numberingSystem: 'latn',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    popInFormatterCache.set(cacheKey, formatter);
  }
  return formatter;
}

export const NumberPopIn = React.forwardRef<HTMLSpanElement, NumberPopInProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
      locale,
      format,
      announce = false,
      role,
      'aria-live': ariaLive,
      className,
      ...props
    },
    ref
  ) => {
    const safeValue = Number.isFinite(value) ? value : 0;

    const { formattedText, charItems } = React.useMemo(() => {
      if (format) {
        const text = format(safeValue);
        const chars = text.split('');
        const decimalIdx = text.lastIndexOf('.');
        if (decimalIdx !== -1) {
          let fracCount = 0;
          return {
            formattedText: text,
            charItems: chars.map((char, idx) => {
              let staggerIndex = 0;
              if (idx > decimalIdx && /^[0-9]$/.test(char)) {
                fracCount += 1;
                staggerIndex = Math.min(fracCount, 2);
              }
              return { char, idx, staggerIndex };
            }),
          };
        }
        const digitIndices: number[] = [];
        for (let i = 0; i < chars.length; i += 1) {
          if (/^[0-9]$/.test(chars[i])) digitIndices.push(i);
        }
        const staggerByIdx = new Map<number, number>();
        if (digitIndices.length > 1) {
          const trailingCount = Math.min(2, digitIndices.length - 1);
          const startPos = digitIndices.length - trailingCount;
          for (let i = 0; i < trailingCount; i += 1) {
            staggerByIdx.set(digitIndices[startPos + i], i + 1);
          }
        }
        return {
          formattedText: text,
          charItems: chars.map((char, idx) => ({
            char,
            idx,
            staggerIndex: staggerByIdx.get(idx) ?? 0,
          })),
        };
      }

      const normalizedDecimals = Math.max(0, Math.floor(decimals));
      const formatter = getCachedPopInFormatter(locale, normalizedDecimals);
      const parts = formatter.formatToParts(safeValue);
      const hasDecimal = parts.some((p) => p.type === 'decimal');
      const items: Array<{ char: string; idx: number; staggerIndex: number; isDigit: boolean }> = [];
      let fracCount = 0;
      let idx = 0;

      for (const part of parts) {
        if (part.type === 'integer') {
          for (const char of part.value) {
            items.push({ char, idx, staggerIndex: 0, isDigit: /^[0-9]$/.test(char) });
            idx += 1;
          }
        } else if (part.type === 'fraction') {
          for (const char of part.value) {
            const isDigit = /^[0-9]$/.test(char);
            if (isDigit) fracCount += 1;
            items.push({
              char,
              idx,
              staggerIndex: isDigit ? Math.min(fracCount, 2) : 0,
              isDigit,
            });
            idx += 1;
          }
        } else {
          for (const char of part.value) {
            items.push({ char, idx, staggerIndex: 0, isDigit: false });
            idx += 1;
          }
        }
      }

      if (!hasDecimal) {
        const digitPositions = items.filter((item) => item.isDigit);
        if (digitPositions.length > 1) {
          const trailingCount = Math.min(2, digitPositions.length - 1);
          const startPos = digitPositions.length - trailingCount;
          for (let i = 0; i < trailingCount; i += 1) {
            digitPositions[startPos + i].staggerIndex = i + 1;
          }
        }
      }

      return {
        formattedText: items.map((i) => i.char).join(''),
        charItems: items,
      };
    }, [safeValue, format, decimals, locale]);

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
