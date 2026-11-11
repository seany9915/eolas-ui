/**
 * Item layout primitive (Content Row / Media Object).
 *
 * Full API reference and feature parity with shadcn/ui Base Item specification:
 * https://ui.shadcn.com/docs/components/base/item
 *
 * ANATOMY:
 * ItemGroup
 * └── Item
 *     ├── ItemHeader
 *     ├── ItemMedia
 *     ├── ItemContent
 *     │   ├── ItemTitle
 *     │   └── ItemDescription
 *     ├── ItemActions
 *     ├── ItemFooter
 *     └── ItemSeparator
 *
 * TAXONOMY & USAGE:
 * - Use Item and ItemGroup for structured list rows, activity feeds, patient directories,
 *   notification trays, and settings rows.
 * - Composes [Media] + [Content (Title, Description)] + [Actions] without custom flex boilerplate.
 * - Directly eliminates the "Card inside Card" anti-pattern by providing a clean, non-elevated
 *   content row for lists inside cards and dialogs.
 * - Supports polymorphic composition via Base UI's `useRender` hook across ALL subcomponents.
 * - Follows DESIGN.md tokens: Lexend body/description font, Lexend label headers, floating 2px focus ring,
 *   and strict semantic tokens with zero artificial elevation on list rows.
 */

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Styles
// ============================================================================

export type ItemVariant = 'default' | 'outline' | 'muted' | 'ghost';
export type ItemSize = 'default' | 'xs' | 'sm' | 'md' | 'lg';

export interface ItemVariantsProps {
  variant?: ItemVariant;
  size?: ItemSize;
  interactive?: boolean;
  className?: string;
}

const variantStyles: Record<ItemVariant, string> = {
  default: 'bg-transparent text-on-surface',
  outline: 'bg-surface text-on-surface border border-outline-variant',
  muted: 'bg-surface-container text-on-surface border border-transparent',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-container/60',
};

const sizeStyles: Record<ItemSize, string> = {
  xs: 'py-1 px-2 gap-2 min-h-[32px] text-xs',
  sm: 'py-2 px-2.5 gap-2.5 min-h-[36px]',
  default: 'py-3 px-3 gap-3 min-h-[44px]',
  md: 'py-3 px-3 gap-3 min-h-[44px]',
  lg: 'py-4 px-4 gap-4 min-h-[52px]',
};

export function itemVariants({
  variant = 'default',
  size = 'default',
  interactive = false,
  className,
}: ItemVariantsProps = {}): string {
  return cn(
    'relative flex items-center rounded-md text-left transition-colors duration-[var(--duration-micro)] ease-[var(--ease-standard)]',
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.default,
    interactive &&
      'cursor-pointer select-none hover:bg-surface-container/70 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:active:scale-100 motion-reduce:transition-none',
    className
  );
}

// ============================================================================
// Item Root
// ============================================================================

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ItemVariantsProps {
  /**
   * Base UI composition prop. Replaces the HTML element with another tag or component
   * (e.g. `<Item render={<a href="..." />} />` or `<Item render={<button type="button" />} />`).
   */
  render?: useRender.RenderProp;
}

export const ItemRoot = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      interactive,
      render,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // If onClick or render is provided, automatically treat as interactive unless explicitly set to false
    const isInteractive = interactive ?? Boolean(onClick || render);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || e.target !== e.currentTarget) return;
      if (isInteractive && !render && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.currentTarget.click();
      }
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

// ============================================================================
// ItemGroup
// ============================================================================

export interface ItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  /**
   * When true, inserts subtle dividers between child items.
   */
  divided?: boolean;
}

export const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ className, divided = false, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-group',
        role: 'group',
        className: cn(
          'flex flex-col w-full',
          divided ? 'divide-y divide-outline-variant/60' : 'gap-1.5',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
ItemGroup.displayName = 'ItemGroup';

// ============================================================================
// ItemSeparator
// ============================================================================

export interface ItemSeparatorProps extends React.ComponentPropsWithoutRef<typeof BaseSeparator> {
  className?: string;
}

export const ItemSeparator = React.forwardRef<HTMLDivElement, ItemSeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <BaseSeparator
      ref={ref}
      data-slot="item-separator"
      orientation={orientation}
      role="separator"
      className={cn(
        'bg-outline-variant/60 shrink-0 select-none',
        orientation === 'horizontal' ? 'h-[1px] w-full my-0' : 'w-[1px] h-full mx-0 self-stretch',
        className
      )}
      {...props}
    />
  )
);
ItemSeparator.displayName = 'ItemSeparator';

// ============================================================================
// ItemMedia
// ============================================================================

export type ItemMediaVariant = 'icon' | 'avatar' | 'image';

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  variant?: ItemMediaVariant;
}

const mediaVariantStyles: Record<ItemMediaVariant, string> = {
  icon: 'size-9 rounded-md bg-surface-container text-on-surface-variant flex items-center justify-center [&_svg]:size-5 [&_.material-symbols-outlined]:text-xl',
  avatar: 'size-10 rounded-full overflow-hidden flex items-center justify-center shrink-0',
  image: 'size-12 rounded-md overflow-hidden object-cover flex items-center justify-center shrink-0',
};

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant = 'icon', render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-media',
        // Icons are decorative; image and avatar media may carry meaningful alt text.
        'aria-hidden': variant === 'icon' ? 'true' : undefined,
        className: cn('shrink-0 select-none', mediaVariantStyles[variant], className),
        children,
        ...props,
      },
    });
  }
);
ItemMedia.displayName = 'ItemMedia';

// ============================================================================
// ItemContent
// ============================================================================

export interface ItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-content',
        className: cn('flex flex-col flex-1 min-w-0 justify-center', className),
        children,
        ...props,
      },
    });
  }
);
ItemContent.displayName = 'ItemContent';

// ============================================================================
// ItemTitle
// ============================================================================

export interface ItemTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  render?: useRender.RenderProp;
  as?: 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const ItemTitle = React.forwardRef<HTMLHeadingElement, ItemTitleProps>(
  ({ className, as: Tag = 'div', render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: Tag,
      props: {
        'data-slot': 'item-title',
        className: cn(
          'font-label text-sm font-semibold text-on-surface truncate leading-snug',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
ItemTitle.displayName = 'ItemTitle';

// ============================================================================
// ItemDescription
// ============================================================================

export interface ItemDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  render?: useRender.RenderProp;
}

export const ItemDescription = React.forwardRef<HTMLParagraphElement, ItemDescriptionProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'p',
      props: {
        'data-slot': 'item-description',
        className: cn(
          'font-sans text-xs text-on-surface-variant leading-relaxed text-pretty',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
ItemDescription.displayName = 'ItemDescription';

// ============================================================================
// ItemActions
// ============================================================================

export interface ItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-actions',
        className: cn('flex items-center gap-2 shrink-0 ml-auto', className),
        children,
        ...props,
      },
    });
  }
);
ItemActions.displayName = 'ItemActions';

// ============================================================================
// ItemHeader
// ============================================================================

export interface ItemHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-header',
        className: cn(
          'flex items-center justify-between text-xs font-label text-on-surface-variant mb-1 w-full',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
ItemHeader.displayName = 'ItemHeader';

// ============================================================================
// ItemFooter
// ============================================================================

export interface ItemFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-footer',
        className: cn(
          'flex items-center justify-between text-xs font-sans text-on-surface-variant mt-1 w-full',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
ItemFooter.displayName = 'ItemFooter';

// ============================================================================
// Compound Component Namespace Export
// ============================================================================

export const Item = Object.assign(ItemRoot, {
  Group: ItemGroup,
  Header: ItemHeader,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
  Footer: ItemFooter,
  Separator: ItemSeparator,
});

export default Item;
