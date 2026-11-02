import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { Icon } from './icon';

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {}

export const PaginationRoot = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
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
    className={cn('flex flex-row flex-wrap items-center justify-center gap-1.5 @sm:gap-2', className)}
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
  const isLink = Boolean(href);
  return (
    <Button
      ref={ref}
      render={isLink ? <a href={href} aria-current={isActive ? 'page' : undefined} /> : undefined}
      aria-current={!isLink && isActive ? 'page' : undefined}
      variant={isActive ? 'filled' : 'outlined'}
      colorRole={isActive ? 'primary' : 'neutral'}
      size={size}
      className={cn(
        'min-w-[44px] min-h-[44px] h-11 px-3.5 tabular-nums font-sans text-sm rounded-md transition-colors',
        isActive
          ? 'pointer-events-none font-semibold shadow-ambient'
          : 'text-on-surface hover:bg-surface-container border-outline-variant hover:border-outline',
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
    aria-label="Go to previous page"
    className={cn('gap-1 pl-2.5 pr-3.5', className)}
    {...props}
  >
    <Icon name="chevron_left" size="sm" className="text-base" />
    <span className="hidden @sm:inline">{children}</span>
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
    aria-label="Go to next page"
    className={cn('gap-1 pl-3.5 pr-2.5', className)}
    {...props}
  >
    <span className="hidden @sm:inline">{children}</span>
    <Icon name="chevron_right" size="sm" className="text-base" />
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
