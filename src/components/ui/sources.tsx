'use client';

/**
 * Sources primitive.
 *
 * Base UI Integration: Works with Base UI Collapsible and Tooltip primitives.
 *
 * Conforms to shadcn AI Elements specification:
 * https://ui.shadcn.com/docs/ai-elements/base/sources
 *
 * TAXONOMY & USAGE:
 * - Use Sources to render grounded clinical citations, evidence base references, and trial literature.
 * - Follows DESIGN.md:
 *   - Pattern 2 chip styling (neutral surface fill, outline-variant border, high-contrast text).
 *   - Never uses triple-tint monochrome styling.
 *   - Prevents Overcontainment & Card-within-card: supports `variant="ghost"` for clean, unbordered
 *     display within chat message bubbles, preventing "pill rain" or nested boxes.
 *   - Never uses hand-rolled native browser tooltips (`title` attribute); all citations
 *     and inline footnote markers consume the Base UI Tooltip primitive for full keyboard
 *     and touch accessibility.
 *   - All clickable citations maintain WCAG 2.2 SC 2.5.8 compliant 44px touch targets.
 *   - Floating focus rings on links and triggers.
 */
import * as React from 'react';
import { Icon } from './icon';
import { Skeleton } from './skeleton';
import { Tooltip } from './tooltip';
import { UnstyledButton } from './button';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
} from './trace';
import { useChatMessageContext } from './chat-message-context';
import { cn, sanitizeUrl } from '@/lib/utils';
import {
  InlineCitation,
  InlineCitationRoot,
  InlineCitationText,
  InlineCitationCardTrigger,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationSource,
  InlineCitationQuote,
  InlineCitationBadge,
} from './inline-citation';

export type SourcesVariant = 'card' | 'ghost' | 'inline';

export interface SourceCitation {
  id?: string | number;
  title: string;
  url: string;
  domain?: string;
  authorOrDate?: string;
  snippet?: string;
  icon?: string;
  favicon?: string;
}

interface SourcesContextValue {
  variant: SourcesVariant;
}

const SourcesContext = React.createContext<SourcesContextValue>({ variant: 'card' });

export function useSourcesContext() {
  return React.useContext(SourcesContext);
}

export interface SourcesRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: SourcesVariant;
  className?: string;
}

export const SourcesRoot = React.forwardRef<HTMLDivElement, SourcesRootProps>(
  ({ children, variant, className, ...props }, ref) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'card');

    return (
      <SourcesContext.Provider value={{ variant: resolvedVariant }}>
        <div
          ref={ref}
          data-slot="sources-root"
          className={cn('@container flex flex-col gap-2 w-full', className)}
          {...props}
        >
          {children}
        </div>
      </SourcesContext.Provider>
    );
  }
);
SourcesRoot.displayName = 'Sources.Root';

export interface SourcesTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const SourcesTitle = React.forwardRef<HTMLSpanElement, SourcesTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="sources-title"
        className={cn('font-label text-xs font-semibold text-on-surface-variant flex items-center gap-1.5', className)}
        {...props}
      >
        <Icon
          name="menu_book"
          size="xs"
          className="text-secondary shrink-0"
          aria-hidden="true"
        />
        <span>{children}</span>
      </span>
    );
  }
);
SourcesTitle.displayName = 'Sources.Title';

export interface SourcesCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number;
  children?: React.ReactNode;
  className?: string;
}

export const SourcesCount = React.forwardRef<HTMLSpanElement, SourcesCountProps>(
  ({ count, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="sources-count"
        className={cn('font-mono text-xs tabular-nums px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium', className)}
        {...props}
      >
        {children ?? count}
      </span>
    );
  }
);
SourcesCount.displayName = 'Sources.Count';

export interface SourcesTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleTrigger>, 'children'> {
  count?: number;
  label?: string;
  children?: React.ReactNode;
}

const SourcesTrigger = React.forwardRef<HTMLButtonElement, SourcesTriggerProps>(
  (
    {
      count,
      label = 'Sources',
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <TraceCollapsibleTrigger
        ref={ref}
        data-slot="sources-trigger"
        className={className}
        {...props}
      >
        {children ? (
          children
        ) : (
          <TraceLine>
            <TraceIcon name="menu_book" className="text-secondary" />
            <TraceTitle>{label}</TraceTitle>
            {typeof count === 'number' && (
              <TraceDescription>
                <SourcesCount count={count} />
              </TraceDescription>
            )}
          </TraceLine>
        )}
      </TraceCollapsibleTrigger>
    );
  }
);
SourcesTrigger.displayName = 'Sources.Trigger';

export interface SourcesListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

// Set when the list is composed inside a compound collapsible Sources tree so it renders as the disclosure panel.
const SourcesPanelContext = React.createContext(false);

const SourcesList = React.forwardRef<HTMLDivElement, SourcesListProps>(
  ({ children, className, ...props }, ref) => {
    const inPanel = React.useContext(SourcesPanelContext);
    const { variant } = useSourcesContext();

    if (!inPanel) {
      return (
        <Trace
          ref={ref}
          variant={variant === 'card' ? 'default' : 'ghost'}
          data-slot="sources-content"
          className={className}
          {...props}
        >
          {children}
        </Trace>
      );
    }

    return (
      <SourcesPanelContext.Provider value={false}>
        <TraceCollapsibleContent ref={ref} variant="flush">
          <Trace
            variant="ghost"
            data-slot="sources-content"
            className={className}
            {...props}
          >
            {children}
          </Trace>
        </TraceCollapsibleContent>
      </SourcesPanelContext.Provider>
    );
  }
);
SourcesList.displayName = 'Sources.List';

/* -------------------------------------------------------------------------------------------------
 * SourceIcon / SourceFavicon
 * -----------------------------------------------------------------------------------------------*/
export interface SourceIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string;
  alt?: string;
  className?: string;
}

const SourceIcon: React.FC<SourceIconProps> = ({
  name = 'menu_book',
  src,
  alt = 'Source favicon',
  className,
  ...props
}) => {
  if (src) {
    return (
      <span className={cn('size-4 inline-flex items-center justify-center shrink-0 rounded-sm overflow-hidden', className)} {...props}>
        <img src={src} alt={alt} className="size-full object-contain" />
      </span>
    );
  }

  return (
    <Icon name={name} size="xs" className={cn('shrink-0 text-secondary', className)} aria-hidden="true" {...props} />
  );
};
SourceIcon.displayName = 'Sources.Icon';

export interface SourcesItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  citation?: SourceCitation;
  href?: string;
  title?: string;
  domain?: string;
  icon?: string;
  favicon?: string;
  index?: number;
  description?: string;
  variant?: SourcesVariant;
  className?: string;
  children?: React.ReactNode;
}

const SourcesItem: React.FC<SourcesItemProps> = ({
  citation,
  href,
  title,
  domain,
  icon,
  favicon,
  index,
  description,
  variant: propVariant,
  className,
  children,
  ...props
}) => {
  const context = useSourcesContext();
  const activeVariant = propVariant || context.variant || 'card';

  const itemUrl = sanitizeUrl(href || citation?.url);
  const itemTitle = title || citation?.title || 'Referenced Source';
  const itemDescription = description ?? citation?.snippet;
  const itemIcon = icon || citation?.icon;
  const itemFavicon = sanitizeUrl(favicon || citation?.favicon);
  const displayDomain =
    domain ||
    citation?.domain ||
    (() => {
      if (!itemUrl) return undefined;
      try {
        return new URL(itemUrl).hostname.replace(/^www\./, '');
      } catch {
        return undefined;
      }
    })();

  const tooltipLabel = `${itemTitle}${displayDomain ? ` (${displayDomain})` : ''}`;

  if (children) {
    return (
      <a
        href={itemUrl}
        target={itemUrl ? '_blank' : undefined}
        rel={itemUrl ? 'noopener noreferrer' : undefined}
        aria-label={`Source: ${itemTitle}`}
        className={cn(
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (activeVariant === 'inline') {
    return (
      <Tooltip content={tooltipLabel}>
        <a
          href={itemUrl}
          target={itemUrl ? '_blank' : undefined}
          rel={itemUrl ? 'noopener noreferrer' : undefined}
          className={cn(
            'group relative inline-flex max-w-full items-center gap-1.5 text-sm font-sans font-medium text-on-surface underline underline-offset-2 hover:text-secondary',
            'after:absolute after:inset-x-0 after:-inset-y-3 after:content-[\'\']',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded',
            className
          )}
          {...props}
        >
          <SourceIcon src={itemFavicon} name={itemIcon || 'menu_book'} />
          <span className="min-w-0 truncate">
            {itemTitle}
            {itemUrl && <span className="sr-only"> (opens in a new tab)</span>}
          </span>
          <Icon
            name="open_in_new"
            size="xs"
            directional
            className="text-on-surface-variant/70 group-hover:text-secondary shrink-0 transition-colors"
            aria-hidden="true"
          />
        </a>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={tooltipLabel}>
      <a
        href={itemUrl}
        target={itemUrl ? '_blank' : undefined}
        rel={itemUrl ? 'noopener noreferrer' : undefined}
        className={cn(
          'group block w-full text-start transition-colors duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
          'hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className
        )}
        {...props}
      >
        <TraceLine>
          {itemFavicon ? (
            <TraceIcon>
              <SourceIcon src={itemFavicon} />
            </TraceIcon>
          ) : typeof index === 'number' ? (
            <TraceIcon stepNumber={index + 1} />
          ) : (
            <TraceIcon name={itemIcon || 'menu_book'} className="text-secondary" />
          )}
          <TraceTitle className="font-medium group-hover:text-secondary transition-colors">
            {itemTitle}
            {itemUrl && <span className="sr-only"> (opens in a new tab)</span>}
          </TraceTitle>
          {displayDomain && (
            <TraceDescription className="hidden @sm:flex font-mono max-w-[160px] truncate">
              {displayDomain}
            </TraceDescription>
          )}
          <TraceIcon className="text-on-surface-variant/70 group-hover:text-secondary">
            <Icon name="open_in_new" size="xs" directional aria-hidden="true" />
          </TraceIcon>
        </TraceLine>
        {itemDescription && (
          <p className="px-3.5 pb-2.5 -mt-1 text-xs font-sans text-on-surface-variant line-clamp-2">
            {itemDescription}
          </p>
        )}
      </a>
    </Tooltip>
  );
};
SourcesItem.displayName = 'Sources.Item';

export interface SourcesCitationRefProps {
  index: number;
  title?: string;
  href?: string;
  className?: string;
}

export const SourcesCitationRef: React.FC<SourcesCitationRefProps> = ({
  index,
  title,
  href,
  className,
}) => {
  const tooltipText = title ? `[${index}] ${title}` : `Citation [${index}]`;

  const badgeContent = (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded font-mono text-xs tabular-nums font-semibold',
        'bg-surface text-secondary border border-secondary group-hover:bg-secondary-container/40',
        'transition-[color,background-color] duration-micro motion-reduce:transition-none',
        className
      )}
    >
      [{index}]
    </span>
  );

  const safeHref = sanitizeUrl(href);

  return (
    <Tooltip content={tooltipText}>
      {safeHref ? (
        <UnstyledButton
          nativeButton={false}
          expandedTouchTarget
          render={
            <a
              href={safeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Citation [${index}]: ${title || safeHref}`}
            />
          }
          className="group relative inline-flex items-center align-super p-0.5 rounded cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {badgeContent}
        </UnstyledButton>
      ) : (
        <UnstyledButton
          expandedTouchTarget
          aria-label={`Citation [${index}]: ${title || index}`}
          className="group relative inline-flex items-center align-super p-0.5 rounded cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {badgeContent}
        </UnstyledButton>
      )}
    </Tooltip>
  );
};
SourcesCitationRef.displayName = 'Sources.CitationRef';

export interface SourcesProps {
  sources?: SourceCitation[];
  children?: React.ReactNode;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  variant?: SourcesVariant;
  dedupe?: boolean;
  className?: string;
}

const SourcesComponent: React.FC<SourcesProps> = ({
  sources,
  children,
  collapsible = true,
  open,
  defaultOpen = false,
  onOpenChange,
  label = 'Sources',
  variant,
  dedupe = true,
  className,
}) => {
  const chatContext = useChatMessageContext();
  const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'card');
  const traceVariant = resolvedVariant === 'card' ? 'default' : 'ghost';

  const normalizedSources = React.useMemo(() => {
    if (!sources || !dedupe) return sources;
    const seen = new Set<string>();
    return sources.filter((item) => {
      const key = item.url || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [sources, dedupe]);

  const count = normalizedSources ? normalizedSources.length : React.Children.count(children);
  if (count === 0 && !children) return null;

  const isCompound = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SourcesTrigger
  );
  if (isCompound) {
    return (
      <SourcesRoot variant={resolvedVariant} className={cn('gap-0', className)}>
        <Trace variant={traceVariant}>
          <TraceCollapsible open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <SourcesPanelContext.Provider value>{children}</SourcesPanelContext.Provider>
          </TraceCollapsible>
        </Trace>
      </SourcesRoot>
    );
  }

  if (collapsible) {
    return (
      <SourcesRoot variant={resolvedVariant} className={cn('gap-0', className)}>
        <Trace variant={traceVariant}>
          <TraceCollapsible open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <SourcesTrigger count={count} label={label} />
            <TraceCollapsibleContent variant="flush">
              <Trace variant="ghost">
                {children ||
                  normalizedSources?.map((item, idx) => (
                    <SourcesItem key={item.id || item.url || idx} citation={item} index={idx} />
                  ))}
              </Trace>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </SourcesRoot>
    );
  }

  return (
    <SourcesRoot variant={resolvedVariant} className={className}>
      <Trace variant={traceVariant}>
        <TraceLine>
          <TraceIcon name="menu_book" className="text-secondary" />
          <TraceTitle>{label}</TraceTitle>
          <TraceDescription>
            <SourcesCount count={count} />
          </TraceDescription>
        </TraceLine>
        {children ||
          normalizedSources?.map((item, idx) => (
            <SourcesItem key={item.id || item.url || idx} citation={item} index={idx} />
          ))}
      </Trace>
    </SourcesRoot>
  );
};
SourcesComponent.displayName = 'Sources';

export interface SourcesSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SourcesSkeleton: React.FC<SourcesSkeletonProps> = ({ className, ...props }) => (
  <div className={cn('flex items-center gap-2 py-1', className)} {...props}>
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-5 w-6 rounded-full" />
  </div>
);
SourcesSkeleton.displayName = 'SourcesSkeleton';

export const Sources = Object.assign(SourcesComponent, {
  Root: SourcesRoot,
  Trigger: SourcesTrigger,
  Title: SourcesTitle,
  Count: SourcesCount,
  Content: SourcesList,
  List: SourcesList,
  Item: SourcesItem,
  Icon: SourceIcon,
  Favicon: SourceIcon,
  CitationRef: SourcesCitationRef,
  Badge: InlineCitationBadge,
  Skeleton: SourcesSkeleton,
});

export {
  SourcesSkeleton,
  SourceIcon,
  SourceIcon as SourceFavicon,
  // shadcn AI Elements direct aliases
  SourcesList as SourcesContent,
  SourcesItem as Source,
  // Re-export InlineCitation primitives
  InlineCitation,
  InlineCitationRoot,
  InlineCitationText,
  InlineCitationCardTrigger,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationSource,
  InlineCitationQuote,
  InlineCitationBadge,
};
