import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NumberPopInProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (value: number) => string;
  className?: string;
}

/**
 * NumberPopIn
 *
 * Digit pop-in animation primitive based strictly on transitions.dev
 * (https://transitions.dev/detail.html?t=number-pop-in / 02-number-pop-in.md).
 *
 * Decomposes numeric strings into individual character spans. When updated,
 * each digit pops into place with 8px vertical travel, 2px micro-blur, and spring overshoot
 * (cubic-bezier(0.34, 1.45, 0.64, 1)). Trailing decimal digits stagger by 70ms so updates feel
 * alive without looking chaotic.
 *
 * Tabular numerals prevent layout jitter.
 * Complies with WCAG 2.2 and motion-reduce:animate-none.
 */
export const NumberPopIn = React.forwardRef<HTMLSpanElement, NumberPopInProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
      format,
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

    // Decompose into characters
    const chars = formattedText.split('');
    const totalChars = chars.length;

    return (
      <span
        ref={ref}
        key={formattedText}
        className={cn(
          'inline-flex items-baseline font-mono text-inherit tabular-nums select-none overflow-hidden',
          className
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        {prefix && <span className="mr-0.5">{prefix}</span>}

        <span className="inline-flex items-baseline">
          {chars.map((char, idx) => {
            // Transitions.dev rule: The last two characters stagger (stagger=1, stagger=2)
            // so decimals feel alive.
            let staggerIndex = 0;
            if (idx === totalChars - 2) staggerIndex = 1;
            if (idx === totalChars - 1) staggerIndex = 2;

            const delayMs = staggerIndex * 70; // 70ms per digit (--digit-stagger)

            return (
              <span
                key={`${idx}-${char}`}
                style={{
                  animationDelay: `${delayMs}ms`,
                }}
                className={cn(
                  'inline-block animate-digit-pop will-change-[transform,opacity,filter]',
                  'motion-reduce:animate-none motion-reduce:transform-none motion-reduce:filter-none'
                )}
              >
                {char}
              </span>
            );
          })}
        </span>

        {suffix && <span className="ml-0.5">{suffix}</span>}
      </span>
    );
  }
);

NumberPopIn.displayName = 'NumberPopIn';

export default NumberPopIn;
