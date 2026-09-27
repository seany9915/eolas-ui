import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NumberRollProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (value: number) => string;
}

/**
 * NumberRoll
 *
 * Tabular number counter based on transitions.dev / Emil Kowalski polish rules.
 * Transitions updating numbers (accuracy percentages, decibel levels, therapy durations)
 * with a subtle vertical slide and 2px micro-blur rather than an abrupt visual snap.
 *
 * Strictly adheres to Atkinson/Roboto Mono typography and prefers-reduced-motion.
 */
export const NumberRoll: React.FC<NumberRollProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  format,
  className,
  ...props
}) => {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [animating, setAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState<'up' | 'down'>('up');
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (value !== prevValueRef.current) {
      setDirection(value > prevValueRef.current ? 'up' : 'down');
      prevValueRef.current = value;
      setAnimating(true);
      setDisplayValue(value);

      const timer = setTimeout(() => {
        setAnimating(false);
      }, 250); // Matches --duration-fast

      return () => clearTimeout(timer);
    }
  }, [value]);

  const formattedText = format
    ? format(displayValue)
    : decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span
      className={cn(
        'inline-flex items-baseline font-mono text-inherit tabular-nums select-none overflow-hidden',
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {prefix && <span className="mr-0.5">{prefix}</span>}

      <span
        className={cn(
          'inline-block transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none',
          animating && direction === 'up' && 'animate-in fade-in slide-in-from-bottom-2 blur-[1px]',
          animating && direction === 'down' && 'animate-in fade-in slide-in-from-top-2 blur-[1px]'
        )}
      >
        {formattedText}
      </span>

      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};

NumberRoll.displayName = 'NumberRoll';
