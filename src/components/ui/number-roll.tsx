import * as React from 'react';
import { NumberPopIn, NumberPopInProps } from '@/components/ui/number-pop-in';
import { SpinningCounter, SpinningCounterProps } from '@/components/ui/spinning-counter';

export interface NumberRollProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (value: number) => string;
  /** Transition style: 'pop-in' (default from transitions.dev) or 'spinning' (slot-machine reels) */
  variant?: 'pop-in' | 'spinning';
  /** Cell height for spinning reel variant. Defaults to 28px. */
  cellHeight?: number;
  className?: string;
}

/**
 * NumberRoll
 *
 * Tabular number transition primitive based strictly on transitions.dev.
 * Supports:
 * - 'pop-in' (default): Individual digit pop-in with spring overshoot and decimal stagger (02-number-pop-in.md).
 * - 'spinning': Slot-machine vertical reel roll with soft edge masks (26-spinning-counter.md).
 *
 * Tabular numerals prevent layout jitter across all variants.
 * Strictly adheres to Roboto Mono typography and prefers-reduced-motion.
 */
export const NumberRoll = React.forwardRef<HTMLSpanElement, NumberRollProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      decimals = 0,
      format,
      variant = 'pop-in',
      cellHeight,
      className,
      ...props
    },
    ref
  ) => {
    if (variant === 'spinning') {
      return (
        <SpinningCounter
          ref={ref}
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          format={format}
          cellHeight={cellHeight}
          className={className}
          {...props}
        />
      );
    }

    return (
      <NumberPopIn
        ref={ref}
        value={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        format={format}
        className={className}
        {...props}
      />
    );
  }
);

NumberRoll.displayName = 'NumberRoll';

// Re-export underlying transitions.dev primitives
export { NumberPopIn, SpinningCounter };
export default NumberRoll;
