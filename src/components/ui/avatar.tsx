/**
 * Avatar primitive (@base-ui/react/avatar).
 *
 * Base UI Documentation: https://base-ui.com/react/components/avatar
 *
 * TAXONOMY & USAGE:
 * - Displays a user's profile picture, initials, or fallback icon.
 * - Supports image loading states (idle, loading, loaded, error) and delayed fallback rendering
 *   to prevent visual flashes during fast network loads.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant touch targets, and sentence case typography.
 */
import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  keepMounted?: boolean;
  onLoadingStatusChange?: (status: BaseAvatar.Root.State['imageLoadingStatus']) => void;
  children?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
};

const AvatarComponent = React.forwardRef<HTMLSpanElement, AvatarProps>(({
  src,
  alt = 'User Avatar',
  fallback,
  delay = 300,
  size = 'md',
  keepMounted,
  onLoadingStatusChange,
  children,
  className,
  ...props
}, ref) => {
  // Composable compound usage
  if (children) {
    return (
      <BaseAvatar.Root
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden select-none',
          'bg-surface-variant text-on-surface-variant font-label font-bold border border-outline-variant',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </BaseAvatar.Root>
    );
  }

  return (
    <BaseAvatar.Root
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden select-none',
        'bg-surface-variant text-on-surface-variant font-label font-bold border border-outline-variant',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && (
        <BaseAvatar.Image
          src={src}
          alt={alt}
          keepMounted={keepMounted}
          onLoadingStatusChange={onLoadingStatusChange}
          className="w-full h-full object-cover transition-opacity duration-[var(--duration-quick)] data-[loading]:opacity-0 motion-reduce:transition-none"
        />
      )}
      <BaseAvatar.Fallback
        delay={delay}
        className="flex items-center justify-center w-full h-full font-label font-semibold"
      >
        {typeof fallback === 'string' ? fallback.slice(0, 2) : fallback}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
});

AvatarComponent.displayName = 'Avatar';

export interface AvatarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  avatar: AvatarProps;
  label?: string;
}

export const AvatarButton = React.forwardRef<HTMLButtonElement, AvatarButtonProps>(({
  avatar,
  label = 'User profile',
  className,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        'min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-1 rounded-full cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'transition-transform active:scale-95 hover:opacity-90 motion-reduce:active:scale-100 motion-reduce:transition-none',
        className
      )}
      {...props}
    >
      <AvatarComponent {...avatar} />
    </button>
  );
});

AvatarButton.displayName = 'AvatarButton';

// Styled compound parts for advanced composition
export const AvatarRoot = BaseAvatar.Root;
export const AvatarImage = BaseAvatar.Image;
export const AvatarFallback = BaseAvatar.Fallback;

// Compound export mapping Base UI primitives
export const Avatar = Object.assign(AvatarComponent, {
  Root: BaseAvatar.Root,
  Image: BaseAvatar.Image,
  Fallback: BaseAvatar.Fallback,
  Button: AvatarButton,
});

export { BaseAvatar };

export default Avatar;
