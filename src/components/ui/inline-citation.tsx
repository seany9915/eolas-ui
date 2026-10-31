/**
 * Inline Citation primitive.
 *
 * Base UI Integration: Built on Base UI PreviewCard (@base-ui/react/preview-card),
 * Button (UnstyledButton), and Carousel primitives.
 *
 * Conforms to shadcn AI Elements specification:
 * https://ui.shadcn.com/docs/ai-elements/base/inline-citation
 *
 * TAXONOMY & USAGE:
 * - Use InlineCitation to embed source references, RAG grounding passages, and web search
 *   literature directly inside prose or assistant messages.
 * - Conforms to DESIGN.md:
 *   - Pattern 2 high-contrast citation pill (neutral surface fill, outline-secondary border, Rich Emerald text).
 *   - WCAG 2.2 SC 2.5.8 compliant 44x44px touch target on interactive triggers.
 *   - Floating 2px focus ring with 2px offset (outline-primary).
 *   - Single-source preview or multi-source Carousel with tabular navigation.
 *   - Full keyboard accessibility and prefers-reduced-motion safety.
 */
import * as React from 'react';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { UnstyledButton, Button } from './button';
import { Icon } from './icon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from './carousel';
import { cn } from '@/lib/utils';

export interface CitationSourceItem {
  id?: string | number;
  title: string;
  url: string;
  domain?: string;
  quote?: string;
  snippet?: string;
  authorOrDate?: string;
  icon?: string;
  favicon?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
interface InlineCitationContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  delay?: number;
  closeDelay?: number;
}

const InlineCitationContext = React.createContext<InlineCitationContextValue | null>(null);

function useInlineCitation() {
  const ctx = React.useContext(InlineCitationContext);
  return ctx;
}

/* -------------------------------------------------------------------------------------------------
 * InlineCitation (Root)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationProps extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Root> {
  children?: React.ReactNode;
  delay?: number;
  closeDelay?: number;
}

const InlineCitationRoot: React.FC<InlineCitationProps> = ({
  children,
  delay = 200,
  closeDelay = 150,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <InlineCitationContext.Provider value={{ activeIndex, setActiveIndex, delay, closeDelay }}>
      <BasePreviewCard.Root {...props}>
        {children}
      </BasePreviewCard.Root>
    </InlineCitationContext.Provider>
  );
};
InlineCitationRoot.displayName = 'InlineCitation';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationText (Cited text / claim wrapper)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

const InlineCitationText = React.forwardRef<HTMLSpanElement, InlineCitationTextProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'underline decoration-secondary/40 decoration-dotted underline-offset-4 hover:decoration-secondary transition-colors duration-micro',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
InlineCitationText.displayName = 'InlineCitationText';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationCardTrigger (Interactive citation pill)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationCardTriggerProps {
  children?: React.ReactNode;
  index?: number | string;
  label?: string;
  delay?: number;
  closeDelay?: number;
  className?: string;
}

const InlineCitationCardTrigger = React.forwardRef<
  HTMLButtonElement,
  InlineCitationCardTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, index, label, delay: propDelay, closeDelay: propCloseDelay, className, ...props }, ref) => {
  const context = useInlineCitation();
  const delay = propDelay ?? context?.delay ?? 200;
  const closeDelay = propCloseDelay ?? context?.closeDelay ?? 150;
  const defaultLabel = label || (index !== undefined ? `Citation [${index}]` : 'Citation');

  return (
    <BasePreviewCard.Trigger
      delay={delay}
      closeDelay={closeDelay}
      render={
        <UnstyledButton
          ref={ref}
          expandedTouchTarget
          aria-label={defaultLabel}
          className={cn(
            'group relative inline-flex items-center align-baseline -top-[0.25em] p-0.5 rounded cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            className
          )}
          {...props}
        />
      }
    >
      {children || (
        <span
          className={cn(
            'inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded font-mono text-xs tabular-nums font-semibold',
            'bg-surface text-secondary border border-secondary group-hover:bg-secondary-container/40',
            'transition-[color,background-color] duration-micro motion-reduce:transition-none'
          )}
        >
          {index !== undefined ? `[${index}]` : '[*]'}
        </span>
      )}
    </BasePreviewCard.Trigger>
  );
});
InlineCitationCardTrigger.displayName = 'InlineCitationCardTrigger';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationCard (Popup container)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationCardProps {
  children?: React.ReactNode;
  className?: string;
  sideOffset?: number;
}

const InlineCitationCard: React.FC<InlineCitationCardProps> = ({
  children,
  className,
  sideOffset = 8,
}) => {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner sideOffset={sideOffset} className="z-50 outline-none">
        <BasePreviewCard.Popup
          className={cn(
            'w-80 max-w-[calc(100vw-2rem)] p-3.5 rounded bg-surface border border-outline-variant shadow-ambient text-on-surface',
            'transition-[opacity,transform] duration-quick ease-standard origin-[var(--transform-origin)]',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98]',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98]',
            'motion-reduce:transition-none',
            className
          )}
        >
          {children}
        </BasePreviewCard.Popup>
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
};
InlineCitationCard.displayName = 'InlineCitationCard';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationCardBody
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const InlineCitationCardBody = React.forwardRef<HTMLDivElement, InlineCitationCardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-2.5 text-xs', className)} {...props}>
        {children}
      </div>
    );
  }
);
InlineCitationCardBody.displayName = 'InlineCitationCardBody';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationIcon / InlineCitationFavicon
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string;
  alt?: string;
  className?: string;
}

const InlineCitationIcon: React.FC<InlineCitationIconProps> = ({
  name = 'menu_book',
  src,
  alt = 'Source favicon',
  className,
  ...props
}) => {
  if (src) {
    return (
      <span className={cn('size-3.5 inline-flex items-center justify-center shrink-0 rounded-xs overflow-hidden', className)} {...props}>
        <img src={src} alt={alt} className="size-full object-contain" />
      </span>
    );
  }

  return (
    <Icon name={name} size="xs" className={cn('shrink-0 text-secondary', className)} aria-hidden="true" {...props} />
  );
};
InlineCitationIcon.displayName = 'InlineCitation.Icon';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationSource (Title, domain, link)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  url: string;
  domain?: string;
  authorOrDate?: string;
  icon?: string;
  favicon?: string;
  className?: string;
}

const InlineCitationSource: React.FC<InlineCitationSourceProps> = ({
  title,
  url,
  domain,
  authorOrDate,
  icon,
  favicon,
  className,
  ...props
}) => {
  const displayDomain =
    domain ||
    (() => {
      try {
        return new URL(url).hostname.replace(/^www\./, '');
      } catch {
        return undefined;
      }
    })();

  return (
    <div className={cn('flex flex-col gap-1 min-w-0', className)} {...props}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open source: ${title}`}
        className="group/link flex items-start justify-between gap-2 text-on-surface hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
      >
        <span className="font-heading font-semibold text-sm leading-snug line-clamp-2">
          {title}
        </span>
        <Icon
          name="open_in_new"
          size="xs"
          className="text-on-surface-variant/70 group-hover/link:text-secondary shrink-0 mt-0.5 transition-colors"
          aria-hidden="true"
        />
      </a>
      {(displayDomain || authorOrDate || icon || favicon) && (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant">
          {(favicon || icon) && <InlineCitationIcon src={favicon} name={icon} />}
          {displayDomain && <span>{displayDomain}</span>}
          {displayDomain && authorOrDate && <span>•</span>}
          {authorOrDate && <span>{authorOrDate}</span>}
        </div>
      )}
    </div>
  );
};
InlineCitationSource.displayName = 'InlineCitationSource';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationQuote (Highlighted citation excerpt)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children?: React.ReactNode;
  className?: string;
}

const InlineCitationQuote = React.forwardRef<HTMLQuoteElement, InlineCitationQuoteProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          'border-l-2 border-secondary pl-2.5 py-1 text-xs font-normal text-on-surface-variant bg-surface-container/40 rounded-none leading-relaxed',
          className
        )}
        {...props}
      >
        &ldquo;{children}&rdquo;
      </blockquote>
    );
  }
);
InlineCitationQuote.displayName = 'InlineCitationQuote';

/* -------------------------------------------------------------------------------------------------
 * InlineCitationSkeleton (Loading state placeholder)
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const InlineCitationSkeleton: React.FC<InlineCitationSkeletonProps> = ({ className, ...props }) => (
  <div className={cn('animate-pulse space-y-2 p-1', className)} {...props}>
    <div className="h-4 w-3/4 rounded bg-surface-variant" />
    <div className="h-3 w-1/2 rounded bg-surface-variant/70" />
    <div className="h-10 w-full rounded bg-surface-container" />
  </div>
);
InlineCitationSkeleton.displayName = 'InlineCitationSkeleton';

/* -------------------------------------------------------------------------------------------------
 * Carousel for multi-source citations
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationCarouselProps {
  children?: React.ReactNode;
  className?: string;
}

const InlineCitationCarousel: React.FC<InlineCitationCarouselProps> = ({ children, className }) => {
  return (
    <Carousel opts={{ loop: false }} className={cn('w-full', className)}>
      {children}
    </Carousel>
  );
};
InlineCitationCarousel.displayName = 'InlineCitationCarousel';

const InlineCitationCarouselContent = CarouselContent;
const InlineCitationCarouselItem = CarouselItem;

export interface InlineCitationCarouselHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const InlineCitationCarouselHeader = React.forwardRef<HTMLDivElement, InlineCitationCarouselHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between gap-2 pb-2 mb-2 border-b border-outline-variant/60', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InlineCitationCarouselHeader.displayName = 'InlineCitationCarouselHeader';

export interface InlineCitationCarouselIndexProps extends React.HTMLAttributes<HTMLSpanElement> {
  total: number;
  className?: string;
}

const InlineCitationCarouselIndex: React.FC<InlineCitationCarouselIndexProps> = ({
  total,
  className,
  ...props
}) => {
  const { selectedIndex } = useCarousel();

  return (
    <span
      className={cn('font-mono text-xs tabular-nums text-on-surface-variant font-medium', className)}
      {...props}
    >
      Source {selectedIndex + 1} of {total}
    </span>
  );
};
InlineCitationCarouselIndex.displayName = 'InlineCitationCarouselIndex';

export interface InlineCitationCarouselNavProps {
  className?: string;
}

const InlineCitationCarouselPrev: React.FC<InlineCitationCarouselNavProps> = ({ className }) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      variant="ghost"
      colorRole="neutral"
      size="sm"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      expandedTouchTarget
      aria-label="Previous citation"
      className={cn('h-6 w-6 p-0 rounded-full', className)}
    >
      <Icon name="chevron_left" size="xs" aria-hidden="true" />
    </Button>
  );
};
InlineCitationCarouselPrev.displayName = 'InlineCitationCarouselPrev';

const InlineCitationCarouselNext: React.FC<InlineCitationCarouselNavProps> = ({ className }) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      variant="ghost"
      colorRole="neutral"
      size="sm"
      disabled={!canScrollNext}
      onClick={scrollNext}
      expandedTouchTarget
      aria-label="Next citation"
      className={cn('h-6 w-6 p-0 rounded-full', className)}
    >
      <Icon name="chevron_right" size="xs" aria-hidden="true" />
    </Button>
  );
};
InlineCitationCarouselNext.displayName = 'InlineCitationCarouselNext';

/* -------------------------------------------------------------------------------------------------
 * Convenient all-in-one component: InlineCitationBadge
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationBadgeProps {
  index?: number | string;
  source?: CitationSourceItem;
  sources?: CitationSourceItem[];
  label?: string;
  className?: string;
}

export const InlineCitationBadge: React.FC<InlineCitationBadgeProps> = ({
  index,
  source,
  sources,
  label,
  className,
}) => {
  const items = sources && sources.length > 0 ? sources : source ? [source] : [];

  if (items.length === 0) return null;

  if (items.length === 1) {
    const single = items[0];
    return (
      <InlineCitationRoot>
        <InlineCitationCardTrigger index={index} label={label || single.title} className={className} />
        <InlineCitationCard>
          <InlineCitationCardBody>
            <InlineCitationSource
              title={single.title}
              url={single.url}
              domain={single.domain}
              authorOrDate={single.authorOrDate}
            />
            {single.quote && <InlineCitationQuote>{single.quote}</InlineCitationQuote>}
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitationRoot>
    );
  }

  return (
    <InlineCitationRoot>
      <InlineCitationCardTrigger index={index} label={label || `${items.length} citations`} className={className} />
      <InlineCitationCard>
        <InlineCitationCarousel>
          <InlineCitationCarouselHeader>
            <InlineCitationCarouselIndex total={items.length} />
            <div className="flex items-center gap-1">
              <InlineCitationCarouselPrev />
              <InlineCitationCarouselNext />
            </div>
          </InlineCitationCarouselHeader>
          <InlineCitationCarouselContent>
            {items.map((item, idx) => (
              <InlineCitationCarouselItem key={item.id || item.url || idx}>
                <InlineCitationCardBody>
                  <InlineCitationSource
                    title={item.title}
                    url={item.url}
                    domain={item.domain}
                    authorOrDate={item.authorOrDate}
                  />
                  {item.quote && <InlineCitationQuote>{item.quote}</InlineCitationQuote>}
                </InlineCitationCardBody>
              </InlineCitationCarouselItem>
            ))}
          </InlineCitationCarouselContent>
        </InlineCitationCarousel>
      </InlineCitationCard>
    </InlineCitationRoot>
  );
};
InlineCitationBadge.displayName = 'InlineCitationBadge';

/* -------------------------------------------------------------------------------------------------
 * Compound Object and Named Exports
 * -----------------------------------------------------------------------------------------------*/
export const InlineCitation = Object.assign(InlineCitationRoot, {
  Text: InlineCitationText,
  Trigger: InlineCitationCardTrigger,
  CardTrigger: InlineCitationCardTrigger,
  Card: InlineCitationCard,
  Body: InlineCitationCardBody,
  Content: InlineCitationCardBody,
  Source: InlineCitationSource,
  Icon: InlineCitationIcon,
  Favicon: InlineCitationIcon,
  Quote: InlineCitationQuote,
  Carousel: InlineCitationCarousel,
  CarouselContent: InlineCitationCarouselContent,
  CarouselItem: InlineCitationCarouselItem,
  CarouselHeader: InlineCitationCarouselHeader,
  CarouselIndex: InlineCitationCarouselIndex,
  CarouselPrev: InlineCitationCarouselPrev,
  CarouselNext: InlineCitationCarouselNext,
  Badge: InlineCitationBadge,
  Skeleton: InlineCitationSkeleton,
});

export {
  InlineCitationRoot,
  InlineCitationText,
  InlineCitationCardTrigger,
  InlineCitationCardTrigger as InlineCitationTrigger,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardBody as InlineCitationContent,
  InlineCitationSource,
  InlineCitationIcon,
  InlineCitationIcon as InlineCitationFavicon,
  InlineCitationQuote,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSkeleton,
};
