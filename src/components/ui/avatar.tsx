import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  fallback: React.ReactNode;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  keepMounted?: boolean;
  className?: string;
}

const AvatarComponent = React.forwardRef<HTMLSpanElement, AvatarProps>(({
  src,
  alt = 'User Avatar',
  fallback,
  delay,
  size = 'md',
  keepMounted,
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm', // 2.5rem minimum floor
    lg: 'w-14 h-14 text-base',
  };

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
          className="w-full h-full object-cover transition-opacity duration-quick data-[loading]:opacity-0"
        />
      )}
      <BaseAvatar.Fallback
        delay={delay}
        className="flex items-center justify-center w-full h-full uppercase tracking-wider"
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
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'transition-transform active:scale-95 hover:opacity-90',
        className
      )}
      {...props}
    >
      <Avatar {...avatar} />
    </button>
  );
});

AvatarButton.displayName = 'AvatarButton';

// Compound export mapping Base UI primitives
export const Avatar = Object.assign(AvatarComponent, {
  Root: BaseAvatar.Root,
  Image: BaseAvatar.Image,
  Fallback: BaseAvatar.Fallback,
});

// Re-export Base UI primitives for compound composition
export { BaseAvatar };
export const AvatarRoot = BaseAvatar.Root;
export const AvatarImage = BaseAvatar.Image;
export const AvatarFallback = BaseAvatar.Fallback;

