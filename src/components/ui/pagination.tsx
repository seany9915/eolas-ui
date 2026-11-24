'use client';

import * as React from 'react';
import { cn, sanitizeUrl } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { Icon } from './icon';

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {}

export const PaginationRoot = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      data-slot="pagination"
      role="navigation"
      aria-label="Pagination"
      className={cn('@container mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
);
PaginationRoot.displayName = 'Pagination';

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="pagination-content"
    className={cn('flex flex-row flex-wrap items-center justify-center gap-1.5 @sm:gap-2', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} data-slot="pagination-item" className={cn('list-none', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

export type PaginationLinkProps = {
  isActive?: boolean;
  href?: string;
} & ButtonProps;

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({
  className,
  isActive,
  size = 'sm',
  children,
  href,
  ...props
}, ref) => {
  const safeHref = sanitizeUrl(href);
  const isLink = Boolean(safeHref);
  return (
    <Button
      ref={ref}
      data-slot="pagination-link"
      data-active={isActive ? 'true' : undefined}
      nativeButton={isLink ? false : undefined}
      render={isLink ? <a href={safeHref} aria-current={isActive ? 'page' : undefined} /> : undefined}
      aria-current={!isLink && isActive ? 'page' : undefined}
      variant={isActive ? 'filled' : 'outline'}
      colorRole={isActive ? 'primary' : 'neutral'}
      size={size}
      className={cn(
        'min-w-[44px] min-h-[44px] h-11 px-3.5 tabular-nums font-sans text-sm rounded transition-colors',
        isActive
          ? 'pointer-events-none font-semibold shadow-ambient'
          : 'text-on-surface hover:bg-state-hover border-outline-variant hover:border-outline',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink>
>(({
  className,
  children = 'Previous',
  ...props
}, ref) => (
  <PaginationLink
    ref={ref}
    data-slot="pagination-previous"
    aria-label="Go to previous page"
    className={cn('gap-1 ps-2.5 pe-3.5', className)}
    {...props}
  >
    <Icon name="chevron_left" size="sm" directional className="text-base" />
    <span className="hidden @md:inline">{children}</span>
  </PaginationLink>
));
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink>
>(({
  className,
  children = 'Next',
  ...props
}, ref) => (
  <PaginationLink
    ref={ref}
    data-slot="pagination-next"
    aria-label="Go to next page"
    className={cn('gap-1 ps-3.5 pe-2.5', className)}
    {...props}
  >
    <span className="hidden @md:inline">{children}</span>
    <Icon name="chevron_right" size="sm" directional className="text-base" />
  </PaginationLink>
));
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({
  className,
  ...props
}, ref) => (
  <span
    ref={ref}
    data-slot="pagination-ellipsis"
    className={cn(
      'flex size-11 items-center justify-center font-sans text-on-surface-variant select-none',
      className
    )}
    {...props}
  >
    <Icon name="more_horiz" size="md" aria-hidden="true" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = 'PaginationEllipsis';

// Compound export mapping shadcn / Base UI style conventions
export const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  Content: PaginationContent,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
});

export default Pagination;
