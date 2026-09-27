import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { Icon } from './icon';

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {}

export const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="Pagination"
    className={cn('@container mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1 @sm:gap-2', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('list-none', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentPropsWithoutRef<'a'>;

export const PaginationLink = ({
  className,
  isActive,
  size = 'md',
  children,
  ...props
}: PaginationLinkProps) => (
  <Button
    render={<a aria-current={isActive ? 'page' : undefined} {...props} />}
    variant={isActive ? 'filled' : 'outlined'}
    size={size}
    className={cn(
      'min-w-[44px] min-h-[44px] tabular-nums font-sans text-sm',
      isActive && 'pointer-events-none font-semibold border-primary',
      className
    )}
  >
    {children}
  </Button>
);
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = ({
  className,
  children = 'Previous',
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn('gap-1 pl-2.5 pr-3.5', className)}
    {...props}
  >
    <Icon name="chevron_left" size="sm" className="text-base" />
    <span className="hidden @sm:inline">{children}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = ({
  className,
  children = 'Next',
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn('gap-1 pl-3.5 pr-2.5', className)}
    {...props}
  >
    <span className="hidden @sm:inline">{children}</span>
    <Icon name="chevron_right" size="sm" className="text-base" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    className={cn(
      'flex size-11 items-center justify-center font-sans text-on-surface-variant select-none',
      className
    )}
    {...props}
  >
    <Icon name="more_horiz" size="md" aria-hidden="true" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
