'use client';

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
import { Button as BaseButton } from '@base-ui/react/button';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '@/lib/utils';

const ItemGroupContext = React.createContext(false);

// ============================================================================
// Types & Styles
// ============================================================================

export type ItemVariant = 'default' | 'outline' | 'muted' | 'ghost' | 'selected';
export type ItemSize = 'default' | 'xs' | 'sm' | 'md' | 'lg';

export interface ItemVariantsProps {
  variant?: ItemVariant;
  size?: ItemSize;
  interactive?: boolean;
  className?: string;
}

const variantStyles: Record<ItemVariant, string> = {
  default: 'bg-transparent text-on-surface border-2 border-transparent',
  outline: 'bg-surface text-on-surface border-2 border-outline-variant',
  muted: 'bg-surface-container-low text-on-surface border-2 border-transparent',
  ghost: 'bg-transparent text-on-surface border-2 border-transparent hover:bg-state-hover',
  selected: 'bg-primary-container text-on-primary-container border-2 border-primary hover:bg-primary-container/90',
};

const sizeStyles: Record<ItemSize, string> = {
  xs: 'py-1 px-2 gap-2 min-h-[32px] text-xs',
  sm: 'py-2 px-2.5 gap-2.5 min-h-[36px]',
  default: 'py-3 px-3 gap-3 min-h-[44px]',
  md: 'py-3 px-3 gap-3 min-h-[44px]',
  lg: 'py-4 px-4 gap-4 min-h-14',
};

export function itemVariants({
  variant = 'default',
  size = 'default',
  interactive = false,
  className,
}: ItemVariantsProps = {}): string {
  const isPassiveDefault = variant === 'default' && !interactive;
  return cn(
    'group/item relative flex items-center has-[[data-slot=item-description]]:items-start rounded-md text-start transition-[background-color,border-color,color,transform] duration-[var(--duration-micro)] ease-[var(--ease-standard)]',
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.default,
    isPassiveDefault && 'px-0 border-0 has-[[data-item-trigger]]:px-3 has-[[data-item-trigger]]:border-2',
    'aria-disabled:opacity-50 aria-disabled:pointer-events-none',
    'has-[[data-item-trigger]]:cursor-pointer has-[[data-item-trigger]]:select-none has-[[data-item-trigger]:focus-visible]:outline has-[[data-item-trigger]:focus-visible]:outline-2 has-[[data-item-trigger]:focus-visible]:outline-offset-2 has-[[data-item-trigger]:focus-visible]:outline-primary',
    variant !== 'selected' && 'has-[[data-item-trigger]]:hover:bg-state-hover',
    interactive &&
      cn(
        'cursor-pointer select-none active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:active:scale-100 motion-reduce:transition-none',
        (size === 'xs' || size === 'sm') && 'min-h-11',
        variant !== 'selected' && 'hover:bg-state-hover'
      ),
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
    const inGroup = React.useContext(ItemGroupContext);
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

    const implicitA11yProps =
      isInteractive && !render
        ? { tabIndex: 0, role: 'button' }
        : inGroup
          ? { role: 'listitem' }
          : {};

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item',
        'data-variant': variant,
        'data-size': size,
        className: computedClass,
        children,
        onClick,
        onKeyDown: handleKeyDown,
        ...implicitA11yProps,
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
    const content = (
      <ItemGroupContext.Provider value={true}>{children}</ItemGroupContext.Provider>
    );
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-group',
        role: 'list',
        className: cn(
          'flex flex-col w-full',
          divided ? 'divide-y divide-outline-variant/60' : 'gap-1.5',
          className
        ),
        children: content,
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
  ({ className, orientation = 'horizontal', role, ...props }, ref) => {
    const inGroup = React.useContext(ItemGroupContext);
    return (
      <BaseSeparator
        ref={ref}
        data-slot="item-separator"
        orientation={orientation}
        role={role ?? (inGroup ? 'none' : 'separator')}
        className={cn(
          'bg-outline-variant/60 shrink-0 select-none',
          orientation === 'horizontal' ? 'h-[1px] w-full my-0' : 'w-[1px] h-full mx-0 self-stretch',
          className
        )}
        {...props}
      />
    );
  }
);
ItemSeparator.displayName = 'ItemSeparator';

// ============================================================================
// ItemMedia
// ============================================================================

export type ItemMediaVariant = 'default' | 'icon' | 'avatar' | 'image';

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  variant?: ItemMediaVariant;
}

const mediaVariantStyles: Record<ItemMediaVariant, string> = {
  default: 'bg-transparent flex items-center justify-center shrink-0 [&_svg]:size-4 [&_.material-symbols-outlined]:text-base',
  icon: 'size-9 rounded-md bg-surface-container-high text-on-surface-variant group-data-[variant=selected]/item:bg-surface group-data-[variant=selected]/item:text-primary flex items-center justify-center [&_svg]:size-5 [&_.material-symbols-outlined]:text-xl transition-colors duration-[var(--duration-micro)] ease-[var(--ease-standard)]',
  avatar: 'size-10 rounded-full overflow-hidden flex items-center justify-center shrink-0',
  image: 'size-12 rounded-md overflow-hidden object-cover flex items-center justify-center shrink-0',
};

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant = 'default', render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'item-media',
        'data-variant': variant,
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
          'font-label text-sm group-data-[size=lg]/item:text-base font-semibold text-on-surface truncate leading-snug',
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
          'font-sans text-sm group-data-[size=lg]/item:text-base text-on-surface-variant group-data-[variant=selected]/item:text-on-primary-container leading-relaxed text-pretty',
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
        className: cn('card-interactive-child flex items-center gap-2 shrink-0 ms-auto', className),
        children,
        ...props,
      },
    });
  }
);
ItemActions.displayName = 'ItemActions';

// ============================================================================
// ItemTrigger & ItemLink (Stretched-overlay row triggers without nested interactive controls)
// ============================================================================

export interface ItemTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  children: React.ReactNode;
}

/**
 * Stretches a Base UI button hit area across the entire `<Item>` via `card-link` (::after),
 * allowing sibling buttons in `<Item.Actions>` without nesting interactive controls.
 */
export const ItemTrigger = React.forwardRef<HTMLButtonElement, ItemTriggerProps>(
  ({ className, ...props }, ref) => (
    <BaseButton
      ref={ref}
      data-slot="item-trigger"
      data-item-trigger=""
      className={cn(
        'card-link text-start cursor-pointer transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] hover:text-primary motion-reduce:transition-none focus:outline-none',
        className
      )}
      {...props}
    />
  )
);
ItemTrigger.displayName = 'ItemTrigger';

export interface ItemLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

/**
 * Stretches an anchor link hit area across the entire `<Item>` via `card-link` (::after),
 * allowing sibling buttons in `<Item.Actions>` without nesting interactive controls.
 */
export const ItemLink = React.forwardRef<HTMLAnchorElement, ItemLinkProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      data-slot="item-link"
      data-item-trigger=""
      className={cn(
        'card-link transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] hover:text-primary motion-reduce:transition-none focus:outline-none',
        className
      )}
      {...props}
    />
  )
);
ItemLink.displayName = 'ItemLink';

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
          'flex items-center justify-between text-sm font-sans text-on-surface-variant mt-1 w-full',
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
  Trigger: ItemTrigger,
  Link: ItemLink,
  Footer: ItemFooter,
  Separator: ItemSeparator,
});

export default Item;
