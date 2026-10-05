import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('@container relative w-full', className)}
      {...props}
    />
  )
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 font-sans text-sm text-on-surface-variant break-words',
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5 min-w-0', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm truncate max-w-[200px] @sm:max-w-none',
        className
      )}
      {...props}
    />
  )
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-medium text-on-surface truncate max-w-[200px] @sm:max-w-none', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('text-outline opacity-60 flex items-center select-none', className)}
    {...props}
  >
    {children ?? <Icon name="chevron_right" size="sm" className="text-base" />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<'button'> {}

export const BreadcrumbEllipsis = React.forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="More links"
      className={cn(
        'inline-flex min-h-[44px] min-w-[44px] size-11 items-center justify-center rounded-sm text-outline hover:text-on-surface hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 select-none cursor-pointer',
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <Icon name="more_horiz" size="sm" className="text-base" aria-hidden="true" />
          <span className="sr-only">More links</span>
        </>
      )}
    </button>
  )
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
