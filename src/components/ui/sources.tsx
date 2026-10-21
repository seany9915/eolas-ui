/**
 * Sources primitive.
 *
 * Base UI Integration: Works with Base UI Collapsible and Tooltip primitives.
 *
 * TAXONOMY & USAGE:
 * - Use Sources to render grounded clinical citations, evidence base references, and trial literature.
 * - Follows DESIGN.md:
 *   - Pattern 2 chip styling (neutral surface fill, outline-variant border, high-contrast text).
 *   - Never uses triple-tint monochrome styling.
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
import { cn } from '@/lib/utils';

export interface SourceCitation {
  id?: string | number;
  title: string;
  url: string;
  domain?: string;
  authorOrDate?: string;
}

export interface SourcesRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const SourcesRoot = React.forwardRef<HTMLDivElement, SourcesRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('@container flex flex-col gap-2 w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SourcesRoot.displayName = 'Sources.Root';

export interface SourcesTriggerProps {
  count?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  className?: string;
}

const SourcesTrigger: React.FC<SourcesTriggerProps> = ({
  count,
  label = 'Evidence Base & Sources',
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
        <Icon
          name="menu_book"
          size="xs"
          className="text-secondary shrink-0"
          aria-hidden="true"
        />
        <span>{label}</span>
        {typeof count === 'number' && (
          <span className="font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
            {count}
          </span>
        )}
      </div>
      <Icon
        name="expand_more"
        size="xs"
        className="text-on-surface-variant transition-transform duration-quick group-data-[open]:rotate-180 motion-reduce:transition-none shrink-0"
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
        className={cn('flex flex-wrap items-center gap-2 pt-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SourcesList.displayName = 'Sources.List';

export interface SourcesItemProps {
  citation: SourceCitation;
  index?: number;
  className?: string;
}

const SourcesItem: React.FC<SourcesItemProps> = ({ citation, index, className }) => {
  const displayDomain =
    citation.domain ||
    (() => {
      try {
        return new URL(citation.url).hostname.replace(/^www\./, '');
      } catch {
        return undefined;
      }
    })();

  const tooltipLabel = `${citation.title}${displayDomain ? ` (${displayDomain})` : ''}`;

  return (
    <Tooltip content={tooltipLabel}>
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source: ${citation.title}`}
        className={cn(
          'group inline-flex items-center gap-2 px-3 py-1.5 min-h-[44px] max-w-full rounded-md',
          'bg-surface border border-outline-variant hover:border-secondary hover:bg-surface-container/50',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          className
        )}
      >
        {typeof index === 'number' && (
          <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[11px] tabular-nums font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
        )}
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-xs font-sans font-medium text-on-surface truncate group-hover:text-secondary transition-colors">
            {citation.title}
          </span>
          {displayDomain && (
            <span className="text-[10px] font-mono text-on-surface-variant/80 truncate">
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

const SourcesCitationRef: React.FC<SourcesCitationRefProps> = ({
  index,
  title,
  href,
  className,
}) => {
  const tooltipText = title ? `[${index}] ${title}` : `Citation [${index}]`;

  const badge = (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded font-mono text-[11px] tabular-nums font-semibold',
        'bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary border border-outline-variant',
        'align-super cursor-pointer transition-[color,background-color] duration-micro motion-reduce:transition-none',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
        className
      )}
    >
      [{index}]
    </span>
  );

  return (
    <Tooltip content={tooltipText}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Citation [${index}]: ${title || href}`}
          className="inline-block p-1 -m-1 focus-visible:outline-none"
        >
          {badge}
        </a>
      ) : (
        badge
      )}
    </Tooltip>
  );
};
SourcesCitationRef.displayName = 'Sources.CitationRef';

export interface SourcesProps {
  sources: SourceCitation[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  label?: string;
  className?: string;
}

export const Sources: React.FC<SourcesProps> = ({
  sources,
  collapsible = true,
  defaultOpen = false,
  label = 'Evidence Base & Sources',
  className,
}) => {
  if (!sources || sources.length === 0) return null;

  if (collapsible) {
    return (
      <Collapsible.Root defaultOpen={defaultOpen} className={cn('w-full', className)}>
        <SourcesRoot>
          <SourcesTrigger count={sources.length} label={label} />
          <Collapsible.Panel className="overflow-hidden transition-[height] duration-quick ease-standard motion-reduce:transition-none">
            <SourcesList>
              {sources.map((item, idx) => (
                <SourcesItem key={item.id || item.url || idx} citation={item} index={idx} />
              ))}
            </SourcesList>
          </Collapsible.Panel>
        </SourcesRoot>
      </Collapsible.Root>
    );
  }

  return (
    <SourcesRoot className={className}>
      <div className="flex items-center gap-1.5 text-xs font-label font-semibold text-on-surface-variant">
        <Icon name="menu_book" size="xs" className="text-secondary shrink-0" aria-hidden="true" />
        <span>{label}</span>
        <span className="font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
          {sources.length}
        </span>
      </div>
      <SourcesList>
        {sources.map((item, idx) => (
          <SourcesItem key={item.id || item.url || idx} citation={item} index={idx} />
        ))}
      </SourcesList>
    </SourcesRoot>
  );
};
Sources.displayName = 'Sources';

export {
  SourcesRoot,
  SourcesTrigger,
  SourcesList,
  SourcesItem,
  SourcesCitationRef,
  // shadcn AI Elements direct aliases
  SourcesList as SourcesContent,
  SourcesItem as Source,
};
