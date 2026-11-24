'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
}

export const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator: _separator, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      className={cn('@container relative w-full', className)}
      {...props}
    />
  )
);
BreadcrumbRoot.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    data-slot="breadcrumb-list"
    className={cn(
      'flex flex-wrap items-center gap-x-1.5 gap-y-2 font-sans text-sm text-on-surface-variant break-words',
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
    data-slot="breadcrumb-item"
    className={cn('inline-flex items-center gap-1.5 min-w-0', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  render?: useRender.RenderProp;
}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, render, children, ...props }, ref) => {
    const wrappedChildren =
      children !== undefined ? (
        <span className="truncate max-w-[200px] @sm:max-w-none">{children}</span>
      ) : undefined;

    return useRender({
      render,
      ref,
      defaultTagName: 'a',
      props: {
        'data-slot': 'breadcrumb-link',
        className: cn(
          'relative inline-flex items-center max-w-full transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm after:absolute after:inset-x-0 after:-inset-y-3 after:content-[\'\']',
          children === undefined && 'truncate max-w-[200px] @sm:max-w-none',
          className
        ),
        ...props,
        ...(wrappedChildren !== undefined ? { children: wrappedChildren } : {}),
      },
    });
  }
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
    data-slot="breadcrumb-page"
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
    data-slot="breadcrumb-separator"
    className={cn('text-outline opacity-60 flex items-center select-none', className)}
    {...props}
  >
    {children ?? <Icon name="chevron_right" size="sm" directional className="text-base" />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {}

export const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      className={cn('inline-flex size-9 items-center justify-center', className)}
      {...props}
    >
      {children ?? (
        <>
          <Icon name="more_horiz" size="sm" aria-hidden="true" />
          <span className="sr-only">More</span>
        </>
      )}
    </span>
  )
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

// Compound export mapping shadcn / Base UI style conventions
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});

export default Breadcrumb;
