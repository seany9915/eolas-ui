import * as React from 'react';
import {
  BotAvatar as RawBotAvatar,
  botAvatarTypes,
  type BotAvatarType,
  type BotAvatarState,
  type BotAvatarFace,
} from 'bot-avatars';
import { cn } from '@/lib/utils';

export { botAvatarTypes };
export type { BotAvatarType, BotAvatarState, BotAvatarFace };

export type BotAvatarSize = 'sm' | 'md' | 'lg' | 'xl' | number;

const SIZE_MAP: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
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

export interface BotAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The 3D body shape archetype */
  type?: BotAvatarType;
  /** Activity state: 'default' (idle), 'working' (active/processing), or 'sleeping' */
  state?: BotAvatarState;
  /** Facial elements: 'eyes' (default) or 'mouth' (eyes + mouth) */
  face?: BotAvatarFace;
  /**
   * Paediatric tone mode:
   * - 'friendly': standard animation and interactive playful hops
   * - 'calm': dampens speed, removes idle flips/hops, and locks gaze forward.
   *   MANDATORY for acute symptom triage, distress, or sensory-sensitive contexts.
   */
  tone?: 'friendly' | 'calm';
  /** Size preset ('sm' 32px, 'md' 48px, 'lg' 64px, 'xl' 80px) or pixel dimension */
  size?: BotAvatarSize;
  /** Accessible description for screen readers. Defaults to 'Eolas Paediatric Digital Helper' */
  label?: string;
  /** Override body color (#rgb, #rrggbb). Defaults to archetype palette color */
  color?: string;
  /** Speed multiplier (default 1) */
  speed?: number;
  /** Whether the avatar follows pointer glances and responds to clicks */
  interactive?: boolean;
  /** Manual animation freeze */
  paused?: boolean;
  /** Automatically respect OS prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** Optional visual pill badge indicating this is an automated digital assistant, not a clinician */
  showDisclaimerBadge?: boolean;
  /** Custom disclaimer badge text */
  disclaimerText?: string;
}

/**
 * BotAvatar
 *
 * Animated avatar character for paediatric-facing and supportive healthcare AI use cases.
 * Wraps bot-avatars with strict clinical guardrails:
 * - Clear digital assistant ARIA identification (never masquerades as a human doctor).
 * - "Calm" mode to prevent jarring playful motion during acute or distressing moments.
 * - Automatic compliance with prefers-reduced-motion.
 */
export const BotAvatar = React.forwardRef<HTMLDivElement, BotAvatarProps>(
  (
    {
      type = 'clover',
      state = 'default',
      face = 'eyes',
      tone = 'friendly',
      size = 'lg',
      label,
      color,
      speed = 1,
      interactive = true,
      paused: explicitPaused,
      respectReducedMotion = true,
      showDisclaimerBadge = false,
      disclaimerText = 'Digital Assistant',
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isPaused = explicitPaused ?? (respectReducedMotion && prefersReducedMotion);

    // Resolve pixel size
    const pixelSize = typeof size === 'string' ? SIZE_MAP[size] : size;

    // Paediatric tone guardrails:
    // 'calm' restricts frantic hopping and rapid head spinning
    const isCalm = tone === 'calm';
    const effectiveSpeed = isPaused ? 0 : isCalm ? speed * 0.5 : speed;
    const effectiveTurn = isCalm ? 0.3 : 1;
    const effectiveJumpEvery = isCalm ? 0 : 8; // 0 disables spontaneous flips
    const effectiveInteractive = isCalm ? false : interactive;

    const accessibleLabel =
      label || `Eolas Paediatric Digital Helper (${type} character, ${state} state)`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={accessibleLabel}
        className={cn('inline-flex flex-col items-center gap-1.5 select-none', className)}
        {...props}
      >
        <div
          className="relative flex items-center justify-center shrink-0"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <RawBotAvatar
            type={type}
            state={state}
            face={face}
            size={pixelSize}
            color={color}
            speed={effectiveSpeed}
            turn={effectiveTurn}
            jumpEvery={effectiveJumpEvery}
            interactive={effectiveInteractive}
            paused={isPaused}
            className="w-full h-full object-contain"
          />
        </div>

        {showDisclaimerBadge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-label font-semibold bg-surface-container text-on-surface-variant border border-outline-variant">
            {disclaimerText}
          </span>
        )}
      </div>
    );
  }
);

BotAvatar.displayName = 'BotAvatar';
