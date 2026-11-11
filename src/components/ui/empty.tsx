/**
 * Empty primitive.
 *
 * Base UI Integration: Pure design token & Base UI companion primitive.
 * Specification & Reference: https://ui.shadcn.com/docs/components/base/empty
 *
 * TAXONOMY & USAGE:
 * - Use Empty to display empty states when collections, search results, or tables have no items.
 * - Composable compound architecture:
 *   - Empty (Root container)
 *   - EmptyHeader (Group wrapper for media, title, and description)
 *   - EmptyMedia (Icon / Avatar / Graphic tile with variant="default" | "icon")
 *   - EmptyTitle (Headline typography in Atkinson Hyperlegible Next)
 *   - EmptyDescription (Body typography in Lexend with accessible link styling)
 *   - EmptyContent (Actions and button container)
 * - Also supports monolithic convenience props (icon, title, description, action) for backward compatibility.
 * - Follows DESIGN.md: concentric border radius, semantic high-contrast colors, and text-balance / text-pretty.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconProps } from './icon';

/* -------------------------------------------------------------------------------------------------
 * Empty (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dashed' | 'flush' | 'unboxed';
  icon?: string;
  iconProps?: Partial<IconProps>;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyComponent = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      variant = 'default',
      icon,
      iconProps,
      title,
      description,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const isFlush = variant === 'flush' || variant === 'unboxed';
    const isDashed = variant === 'default' || variant === 'dashed';

    // If compound children are provided, render children inside the styled container
    if (children) {
      return (
        <div
          ref={ref}
          data-slot="empty"
          className={cn(
            'flex w-full min-w-0 flex-1 flex-col items-center justify-center p-8 @sm:p-12 text-center text-balance my-4',
            isDashed && 'rounded-lg bg-surface border border-dashed border-outline-variant',
            isFlush && 'border-none bg-transparent shadow-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    // Convenience shorthand rendering when children are omitted
    return (
      <div
        ref={ref}
        data-slot="empty"
        className={cn(
          'flex w-full min-w-0 flex-1 flex-col items-center justify-center p-8 @sm:p-12 text-center text-balance my-4',
          isDashed && 'rounded-lg bg-surface border border-dashed border-outline-variant',
          isFlush && 'border-none bg-transparent shadow-none',
          className
        )}
        {...props}
      >
        <EmptyHeader>
          {icon && (
            <EmptyMedia variant="icon">
              <Icon name={icon} size="xl" {...iconProps} />
            </EmptyMedia>
          )}
          {title && <EmptyTitle>{title}</EmptyTitle>}
          {description && <EmptyDescription>{description}</EmptyDescription>}
        </EmptyHeader>
        {action && <EmptyContent>{action}</EmptyContent>}
      </div>
    );
  }
);
EmptyComponent.displayName = 'Empty';

/* -------------------------------------------------------------------------------------------------
 * EmptyHeader
 * -----------------------------------------------------------------------------------------------*/
export interface EmptyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const EmptyHeader = React.forwardRef<HTMLDivElement, EmptyHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-header"
        className={cn('flex max-w-md flex-col items-center', className)}
        {...props}
      />
    );
  }
);
EmptyHeader.displayName = 'EmptyHeader';

/* -------------------------------------------------------------------------------------------------
 * EmptyMedia
 * -----------------------------------------------------------------------------------------------*/
export interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'icon';
}

export const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-media"
        data-variant={variant}
        className={cn(
          'flex shrink-0 items-center justify-center mb-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
          variant === 'icon' && 'size-14 rounded-full bg-surface-container text-on-surface-variant',
          className
        )}
        {...props}
      />
    );
  }
);
EmptyMedia.displayName = 'EmptyMedia';

/* -------------------------------------------------------------------------------------------------
 * EmptyTitle
 * -----------------------------------------------------------------------------------------------*/
export interface EmptyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        data-slot="empty-title"
        className={cn(
          'font-heading text-headline-sm font-semibold text-on-surface mb-2 text-balance',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
EmptyTitle.displayName = 'EmptyTitle';

/* -------------------------------------------------------------------------------------------------
 * EmptyDescription
 * -----------------------------------------------------------------------------------------------*/
export interface EmptyDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const EmptyDescription = React.forwardRef<HTMLParagraphElement, EmptyDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="empty-description"
        className={cn(
          'font-sans text-body-md text-on-surface-variant max-w-md mb-6 text-pretty [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
EmptyDescription.displayName = 'EmptyDescription';

/* -------------------------------------------------------------------------------------------------
 * EmptyContent
 * -----------------------------------------------------------------------------------------------*/
export interface EmptyContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const EmptyContent = React.forwardRef<HTMLDivElement, EmptyContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-content"
        className={cn('flex flex-wrap items-center justify-center gap-3', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EmptyContent.displayName = 'EmptyContent';

/* -------------------------------------------------------------------------------------------------
 * Compound Object Export
 * -----------------------------------------------------------------------------------------------*/
export const Empty = Object.assign(EmptyComponent, {
  Header: EmptyHeader,
  Media: EmptyMedia,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
});

export default Empty;
