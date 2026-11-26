'use client';

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
import { Button as BaseButton } from '@base-ui/react/button';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';
import { getContrastInk } from '@/lib/contrast';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarContextValue {
  size: AvatarSize;
}

const AvatarContext = React.createContext<AvatarContextValue>({ size: 'md' });
export const useAvatarContext = () => React.useContext(AvatarContext);

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
};

function takeTwoGraphemes(text: string): string {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    let out = '';
    let count = 0;
    for (const part of segmenter.segment(text)) {
      if (count >= 2) break;
      out += part.segment;
      count += 1;
    }
    return out;
  }
  return Array.from(text).slice(0, 2).join('');
}

export interface AvatarRootProps extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> {
  size?: AvatarSize;
  /** Optional user-supplied background color for initials/fallback avatars; computes accessible foreground contrast automatically. */
  customColor?: string;
  children?: React.ReactNode;
}

export const AvatarRoot = React.forwardRef<HTMLSpanElement, AvatarRootProps>(({
  size = 'md',
  customColor,
  className,
  style,
  children,
  ...props
}, ref) => {
  const dynamicStyle: AvatarRootProps['style'] = customColor
    ? (() => {
        const baseDynamic: React.CSSProperties & { '--dynamic-bg'?: string; '--chip-ink'?: string } = {
          '--dynamic-bg': customColor,
          '--chip-ink': getContrastInk(customColor),
          backgroundColor: customColor,
          borderColor: 'transparent',
        };
        return typeof style === 'function'
          ? (state) => ({ ...baseDynamic, ...style(state) })
          : { ...baseDynamic, ...style };
      })()
    : style;

  const avatarContextValue = React.useMemo(() => ({ size }), [size]);

  return (
    <AvatarContext.Provider value={avatarContextValue}>
      <BaseAvatar.Root
        ref={ref}
        data-slot="avatar"
        data-size={size}
        style={dynamicStyle}
        className={composeClassName(
          cn(
            'group/avatar relative inline-flex items-center justify-center rounded-full select-none shrink-0',
            'bg-surface-container-high text-on-surface font-label font-semibold border border-outline-variant',
            customColor && 'contrast-auto',
            sizeClasses[size]
          ),
          className
        )}
        {...props}
      >
        {children}
      </BaseAvatar.Root>
    </AvatarContext.Provider>
  );
});
AvatarRoot.displayName = 'AvatarRoot';

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Image> {}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(({
  className,
  ...props
}, ref) => {
  return (
    <BaseAvatar.Image
      ref={ref}
      data-slot="avatar-image"
      className={composeClassName(
        'size-full rounded-full object-cover transition-opacity duration-[var(--duration-quick)] data-[loading]:opacity-0 data-[error]:hidden motion-reduce:transition-none',
        className
      )}
      {...props}
    />
  );
});
AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback> {
  children?: React.ReactNode;
}

export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(({
  delay = 300,
  className,
  children,
  ...props
}, ref) => {
  return (
    <BaseAvatar.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      delay={delay}
      className={composeClassName(
        'flex items-center justify-center size-full rounded-full font-label font-semibold overflow-hidden',
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? takeTwoGraphemes(children) : children}
    </BaseAvatar.Fallback>
  );
});
AvatarFallback.displayName = 'AvatarFallback';

export interface AvatarBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(({
  className,
  ...props
}, ref) => (
  <span
    ref={ref}
    data-slot="avatar-badge"
    className={cn(
      'absolute bottom-0 end-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-on-primary border-2 border-surface select-none',
      'size-3 group-data-[size=sm]/avatar:size-2.5 group-data-[size=md]/avatar:size-3 group-data-[size=lg]/avatar:size-4',
      '[&>svg]:size-2 group-data-[size=lg]/avatar:[&>svg]:size-2.5',
      className
    )}
    {...props}
  />
));
AvatarBadge.displayName = 'AvatarBadge';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    data-slot="avatar-group"
    className={cn(
      'group/avatar-group flex items-center [&>*:not(:first-child)]:-ms-2 [&>[data-slot=avatar]]:border-2 [&>[data-slot=avatar]]:border-surface',
      className
    )}
    {...props}
  />
));
AvatarGroup.displayName = 'AvatarGroup';

export interface AvatarGroupCountProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
}

export const AvatarGroupCount = React.forwardRef<HTMLDivElement, AvatarGroupCountProps>(({
  size = 'md',
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    data-slot="avatar-group-count"
    data-size={size}
    className={cn(
      'relative flex shrink-0 items-center justify-center rounded-full bg-surface-container-high font-label font-semibold text-on-surface border-2 border-surface select-none',
      sizeClasses[size],
      className
    )}
    {...props}
  />
));
AvatarGroupCount.displayName = 'AvatarGroupCount';

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  delay?: number;
  size?: AvatarSize;
  keepMounted?: boolean;
  /** Browser fetch priority hint for Largest Contentful Paint (LCP) optimization */
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
  onLoadingStatusChange?: (status: BaseAvatar.Root.State['imageLoadingStatus']) => void;
  /** Optional user-supplied background color for initials/fallback avatars; computes accessible foreground contrast automatically. */
  customColor?: string;
  children?: React.ReactNode;
}

const AvatarComponent = React.forwardRef<HTMLSpanElement, AvatarProps>(({
  src,
  alt = '',
  fallback,
  delay = 300,
  size = 'md',
  keepMounted,
  fetchPriority,
  loading,
  onLoadingStatusChange,
  customColor,
  children,
  className,
  ...props
}, ref) => {
  if (children) {
    return (
      <AvatarRoot ref={ref} size={size} customColor={customColor} className={className} {...props}>
        {children}
      </AvatarRoot>
    );
  }

  const hasSrc = Boolean(src?.trim());

  return (
    <AvatarRoot ref={ref} size={size} customColor={customColor} className={className} {...props}>
      {hasSrc && (
        <AvatarImage
          src={src}
          alt={alt}
          keepMounted={keepMounted}
          fetchPriority={fetchPriority}
          loading={loading}
          onLoadingStatusChange={onLoadingStatusChange}
        />
      )}
      <AvatarFallback delay={hasSrc ? delay : 0}>
        {fallback}
      </AvatarFallback>
    </AvatarRoot>
  );
});
AvatarComponent.displayName = 'Avatar';

export interface AvatarButtonProps extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  avatar: AvatarProps;
  label?: string;
}

export const AvatarButton = React.forwardRef<HTMLButtonElement, AvatarButtonProps>(({
  avatar,
  label = 'User profile',
  render,
  nativeButton,
  type,
  className,
  ...props
}, ref) => {
  const resolvedNativeButton = resolveNativeButton(render, nativeButton);
  const resolvedType = type ?? (resolvedNativeButton === false ? undefined : 'button');

  return (
    <BaseButton
      ref={ref}
      {...(resolvedType !== undefined ? { type: resolvedType } : {})}
      render={render}
      nativeButton={resolvedNativeButton}
      aria-label={label}
      className={composeClassName(
        cn(
          'min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-1 rounded-full cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-transform active:scale-95 hover:opacity-90 motion-reduce:active:scale-100 motion-reduce:transition-none'
        ),
        className
      )}
      {...props}
    >
      <AvatarComponent {...avatar} />
    </BaseButton>
  );
});
AvatarButton.displayName = 'AvatarButton';

// Compound export mapping Base UI primitives with default design tokens
export const Avatar = Object.assign(AvatarComponent, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Badge: AvatarBadge,
  Group: AvatarGroup,
  GroupCount: AvatarGroupCount,
  Button: AvatarButton,
});

export { BaseAvatar };
export const AvatarPrimitive = BaseAvatar.Root;
export const AvatarImagePrimitive = BaseAvatar.Image;
export const AvatarFallbackPrimitive = BaseAvatar.Fallback;

export default Avatar;
