import * as React from 'react';
import { ThinkingOrb as RawThinkingOrb, type OrbState, type OrbSize } from 'thinking-orbs';
import { cn } from '@/lib/utils';

export type { OrbState, OrbSize };

export type ThinkingOrbSize = 'sm' | 'md' | 'lg' | OrbSize;

const SIZE_MAP: Record<'sm' | 'md' | 'lg', OrbSize> = {
  sm: 20,
  md: 32,
  lg: 64,
};

const DEFAULT_STATE_LABELS: Record<OrbState, string> = {
  working: 'Working...',
  searching: 'Searching knowledge base...',
  solving: 'Calculating clinical recommendation...',
  listening: 'Listening...',
  connecting: 'Connecting to clinical services...',
  weaving: 'Synthesising notes...',
  composing: 'Drafting response...',
  breathing: 'Ready',
  shaping: 'Formatting output...',
};

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

export interface ThinkingOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The current agent activity state */
  state?: OrbState;
  /** Size token ('sm' = 20px inline, 'md' = 32px, 'lg' = 64px) or raw pixel value */
  size?: ThinkingOrbSize;
  /** Optional visible status label to display beside the orb. Never rely on color/motion alone. */
  label?: React.ReactNode;
  /** Custom screen-reader status text. Overrides the default state description. */
  statusText?: string;
  /** Theme mode for ink shading: 'auto', 'light', or 'dark' */
  theme?: 'auto' | 'light' | 'dark';
  /** Optional color tint (#rgb, #rrggbb, rgb()) */
  color?: string;
  /** Freeze animation on current frame */
  paused?: boolean;
  /** Multiplier for animation speed */
  speed?: number;
  /** Whether to pause or dampen animations automatically when prefers-reduced-motion is detected */
  respectReducedMotion?: boolean;
}

/**
 * ThinkingOrb
 *
 * Accessible agent loading and activity indicator. Wraps the canvas-based thinking-orbs
 * package with an explicit `role="status"` live region and visible or screen-reader text,
 * guaranteeing compliance with the Eolas "color is never the only cue" rule.
 */
export const ThinkingOrb = React.forwardRef<HTMLDivElement, ThinkingOrbProps>(
  (
    {
      state = 'working',
      size = 'md',
      label,
      statusText,
      theme = 'auto',
      color,
      paused: explicitPaused,
      speed = 1,
      respectReducedMotion = true,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isPaused = explicitPaused ?? (respectReducedMotion && prefersReducedMotion);

    // Resolve pixel size
    const pixelSize: OrbSize = typeof size === 'string' ? SIZE_MAP[size] : size;

    // Accessible text for assistive tech
    const announcedText = statusText || (typeof label === 'string' ? label : DEFAULT_STATE_LABELS[state]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn('inline-flex items-center gap-2.5 select-none font-sans', className)}
        {...props}
      >
        <RawThinkingOrb
          state={state}
          size={pixelSize}
          theme={theme}
          color={color}
          paused={isPaused}
          speed={isPaused ? 0 : speed}
          aria-hidden="true"
          className="shrink-0"
        />

        {label ? (
          <span className="text-base font-sans text-on-surface leading-snug">
            {label}
          </span>
        ) : (
          <span className="sr-only">{announcedText}</span>
        )}
      </div>
    );
  }
);

ThinkingOrb.displayName = 'ThinkingOrb';
