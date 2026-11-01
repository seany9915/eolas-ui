/**
 * Item layout primitive (Content Row / Media Object).
 *
 * Aligned with shadcn/ui and Base UI ecosystem patterns:
 * https://ui.shadcn.com/docs/components/base/item
 *
 * TAXONOMY & USAGE:
 * - Use Item and ItemGroup for structured list rows, activity feeds, patient directories,
 *   notification trays, and settings rows.
 * - Composes [Media] + [Content (Title, Description)] + [Actions] without custom flex boilerplate.
 * - Directly eliminates the "Card inside Card" anti-pattern by providing a clean, non-elevated
 *   content row for lists inside cards and dialogs.
 * - Supports polymorphic composition via Base UI's `useRender` hook (turning the item into a link or button).
 * - Follows DESIGN.md tokens: Lexend body/description font, Lexend label headers, floating 2px focus ring,
 *   and strict semantic tokens.
 */
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';

export type ItemVariant = 'default' | 'outline' | 'muted' | 'ghost';
export type ItemSize = 'sm' | 'md' | 'lg';

export interface ItemVariantsProps {
  variant?: ItemVariant;
  size?: ItemSize;
  interactive?: boolean;
  className?: string;
}

const variantStyles: Record<ItemVariant, string> = {
  default: 'bg-transparent text-on-surface',
  outline: 'bg-surface text-on-surface border border-outline-variant shadow-ambient',
  muted: 'bg-surface-container text-on-surface border border-transparent',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-container/60',
};

const sizeStyles: Record<ItemSize, string> = {
  sm: 'py-2 px-2.5 gap-2.5 min-h-[36px]',
  md: 'py-3 px-3 gap-3 min-h-[44px]',
  lg: 'py-4 px-4 gap-4 min-h-[52px]',
};

export function itemVariants({
  variant = 'default',
  size = 'md',
  interactive = false,
  className,
}: ItemVariantsProps = {}): string {
  return cn(
    'relative flex items-center rounded-md text-left transition-colors duration-[var(--duration-micro)] ease-[var(--ease-standard)]',
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.md,
    interactive &&
      'cursor-pointer select-none hover:bg-surface-container/70 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:active:scale-100 motion-reduce:transition-none',
    className
  );
}

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ItemVariantsProps {
  /**
   * Base UI composition prop. Replaces the HTML element with another tag or component
   * (e.g. `<Item render={<a href="..." />} />` or `<Item render={<button type="button" />} />`).
   */
  render?: useRender.RenderProp;
}

const ItemRoot = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      interactive,
      render,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // If onClick or render is provided, automatically treat as interactive unless explicitly set to false
    const isInteractive = interactive ?? Boolean(onClick || render);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && !render && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.currentTarget.click();
      }
      props.onKeyDown?.(e);
    };

    const computedClass = itemVariants({
      variant,
      size,
      interactive: isInteractive,
      className,
    });

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item',
        className: computedClass,
        children,
        onClick,
        onKeyDown: handleKeyDown,
        ...(isInteractive && !render ? { tabIndex: 0, role: 'button' } : {}),
        ...props,
      },
    });
  }
);
ItemRoot.displayName = 'Item';

export interface ItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * When true, inserts subtle dividers between child items.
   */
  divided?: boolean;
}

export const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ className, divided = false, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-group"
      className={cn(
        'flex flex-col w-full',
        divided ? 'divide-y divide-outline-variant/60' : 'gap-1.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ItemGroup.displayName = 'ItemGroup';

export type ItemMediaVariant = 'icon' | 'avatar' | 'image';

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ItemMediaVariant;
}

const mediaVariantStyles: Record<ItemMediaVariant, string> = {
  icon: 'size-9 rounded-md bg-surface-container text-on-surface-variant flex items-center justify-center [&_svg]:size-5 [&_.material-symbols-outlined]:text-xl',
  avatar: 'size-10 rounded-full overflow-hidden flex items-center justify-center shrink-0',
  image: 'size-12 rounded-md overflow-hidden object-cover flex items-center justify-center shrink-0',
};

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant = 'icon', children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-media"
      className={cn('shrink-0 select-none', mediaVariantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
);
ItemMedia.displayName = 'ItemMedia';

export interface ItemContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-content"
      className={cn('flex flex-col flex-1 min-w-0 justify-center', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ItemContent.displayName = 'ItemContent';

export interface ItemTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const ItemTitle = React.forwardRef<HTMLHeadingElement, ItemTitleProps>(
  ({ className, as: Tag = 'div', children, ...props }, ref) => {
    return React.createElement(
      Tag,
      {
        ref,
        'data-slot': 'item-title',
        className: cn(
          'font-label text-sm font-semibold text-on-surface truncate leading-snug',
          className
        ),
        ...props,
      },
      children
    );
  }
);
ItemTitle.displayName = 'ItemTitle';

export interface ItemDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ItemDescription = React.forwardRef<HTMLParagraphElement, ItemDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="item-description"
      className={cn(
        'font-sans text-xs text-on-surface-variant leading-relaxed text-pretty',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);
ItemDescription.displayName = 'ItemDescription';

export interface ItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-actions"
      className={cn('flex items-center gap-2 shrink-0 ml-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ItemActions.displayName = 'ItemActions';

export interface ItemHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-header"
      className={cn(
        'flex items-center justify-between text-xs font-label text-on-surface-variant mb-1 w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ItemHeader.displayName = 'ItemHeader';

export interface ItemFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-footer"
      className={cn(
        'flex items-center justify-between text-xs font-sans text-on-surface-variant mt-1 w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ItemFooter.displayName = 'ItemFooter';

export const Item = Object.assign(ItemRoot, {
  Group: ItemGroup,
  Header: ItemHeader,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
  Footer: ItemFooter,
});

export default Item;
