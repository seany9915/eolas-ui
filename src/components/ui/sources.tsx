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
import { Collapsible } from '@base-ui/react/collapsible';
import { Icon } from './icon';
import { Tooltip } from './tooltip';
import { UnstyledButton } from './button';
import { useChatMessageContext } from './chat-message-context';
import { cn } from '@/lib/utils';
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
        className={cn('font-mono text-xs tabular-nums px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium', className)}
        {...props}
      >
        {children ?? count}
      </span>
    );
  }
);
SourcesCount.displayName = 'Sources.Count';

export interface SourcesTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

const SourcesTrigger: React.FC<SourcesTriggerProps> = ({
  count,
  label = 'Evidence Base & Sources',
  children,
  className,
}) => {
  return (
    <Collapsible.Trigger
      className={cn(
        'group flex items-center justify-between gap-2 py-1 text-xs font-label font-semibold text-on-surface-variant',
        'hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded',
        'cursor-pointer transition-[color] duration-quick ease-standard motion-reduce:transition-none',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {children ? (
          children
        ) : (
          <>
            <SourcesTitle>{label}</SourcesTitle>
            {typeof count === 'number' && <SourcesCount count={count} />}
          </>
        )}
      </div>
      <Icon
        name="expand_more"
        size="xs"
        className="text-on-surface-variant transition-transform duration-quick group-data-[panel-open]:rotate-180 motion-reduce:transition-none shrink-0"
        aria-hidden="true"
      />
    </Collapsible.Trigger>
  );
};
SourcesTrigger.displayName = 'Sources.Trigger';

export interface SourcesListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const SourcesList = React.forwardRef<HTMLDivElement, SourcesListProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sources-content"
        className={cn('flex flex-wrap items-center gap-2 pt-1', className)}
        {...props}
      >
        {children}
      </div>
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
      <span className={cn('size-4 inline-flex items-center justify-center shrink-0 rounded-xs overflow-hidden', className)} {...props}>
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

  const itemUrl = href || citation?.url || '#';
  const itemTitle = title || citation?.title || 'Referenced Source';
  const itemIcon = icon || citation?.icon;
  const itemFavicon = favicon || citation?.favicon;
  const displayDomain =
    domain ||
    citation?.domain ||
    (() => {
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
        target="_blank"
        rel="noopener noreferrer"
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

  return (
    <Tooltip content={tooltipLabel}>
      <a
        href={itemUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source: ${itemTitle}`}
        className={cn(
          'group inline-flex items-center gap-2 px-3 py-1.5 min-h-[44px] max-w-full rounded-md text-left',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
          // Variant styling: 'card' has border and surface, 'ghost' has zero border for inside bubbles, 'inline' is minimal
          activeVariant === 'card' && 'bg-surface border border-outline-variant hover:border-secondary hover:bg-surface-container/50',
          activeVariant === 'ghost' && 'bg-transparent border-0 hover:bg-surface-container/60 px-2 rounded',
          activeVariant === 'inline' && 'p-0 min-h-0 bg-transparent border-0 underline underline-offset-2 hover:text-secondary',
          className
        )}
        {...props}
      >
        {typeof index === 'number' && (
          <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-xs tabular-nums font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
        )}
        {(itemFavicon || itemIcon) && (
          <SourceIcon src={itemFavicon} name={itemIcon} />
        )}
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-sm font-sans font-medium text-on-surface truncate group-hover:text-secondary transition-colors">
            {itemTitle}
          </span>
          {displayDomain && (
            <span className="text-xs font-mono text-on-surface-variant/80 truncate">
              {displayDomain}
            </span>
          )}
        </div>
        <Icon
          name="open_in_new"
          size="xs"
          className="text-on-surface-variant/70 group-hover:text-secondary shrink-0 transition-colors"
          aria-hidden="true"
        />
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

  return (
    <Tooltip content={tooltipText}>
      {href ? (
        <UnstyledButton
          expandedTouchTarget
          render={
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Citation [${index}]: ${title || href}`}
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
  defaultOpen?: boolean;
  label?: string;
  variant?: SourcesVariant;
  dedupe?: boolean;
  className?: string;
}

const SourcesComponent: React.FC<SourcesProps> = ({
  sources,
  children,
  collapsible = true,
  defaultOpen = false,
  label = 'Evidence Base & Sources',
  variant,
  dedupe = true,
  className,
}) => {
  const chatContext = useChatMessageContext();
  const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'card');

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

  if (collapsible) {
    return (
      <Collapsible.Root defaultOpen={defaultOpen} className={cn('w-full', className)}>
        <SourcesRoot variant={resolvedVariant}>
          <SourcesTrigger count={count} label={label} />
          <Collapsible.Panel
            className="overflow-hidden h-[var(--collapsible-panel-height)] transition-[height] duration-quick ease-standard motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
          >
            <SourcesList>
              {children ||
                normalizedSources?.map((item, idx) => (
                  <SourcesItem key={item.id || item.url || idx} citation={item} index={idx} />
                ))}
            </SourcesList>
          </Collapsible.Panel>
        </SourcesRoot>
      </Collapsible.Root>
    );
  }

  return (
    <SourcesRoot variant={resolvedVariant} className={className}>
      <div className="flex items-center gap-1.5 text-xs font-label font-semibold text-on-surface-variant">
        <Icon name="menu_book" size="xs" className="text-secondary shrink-0" aria-hidden="true" />
        <span>{label}</span>
        <span className="font-mono text-xs tabular-nums px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
          {count}
        </span>
      </div>
      <SourcesList>
        {children ||
          normalizedSources?.map((item, idx) => (
            <SourcesItem key={item.id || item.url || idx} citation={item} index={idx} />
          ))}
      </SourcesList>
    </SourcesRoot>
  );
};
SourcesComponent.displayName = 'Sources';

export interface SourcesSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SourcesSkeleton: React.FC<SourcesSkeletonProps> = ({ className, ...props }) => (
  <div className={cn('animate-pulse flex items-center gap-2 py-1', className)} {...props}>
    <div className="h-4 w-28 rounded bg-surface-variant" />
    <div className="h-5 w-6 rounded-full bg-surface-variant/70" />
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
