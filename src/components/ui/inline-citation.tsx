'use client';

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
import { ScrollArea } from './scroll-area';
import { Skeleton } from './skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from './carousel';
import { cn, composeClassName, sanitizeUrl, useMergedRefs } from '@/lib/utils';

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
  const contextValue = React.useMemo(() => ({ delay, closeDelay }), [delay, closeDelay]);
  return (
    <InlineCitationContext.Provider value={contextValue}>
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
          'underline decoration-secondary/40 decoration-dotted underline-offset-4 hover:decoration-secondary transition-colors duration-micro motion-reduce:transition-none',
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
export interface InlineCitationCardTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BasePreviewCard.Trigger>, 'children'> {
  children?: React.ReactNode;
  index?: number | string;
  label?: string;
  delay?: number;
  closeDelay?: number;
  /** Source URL. When set, the trigger is a real link so keyboard and screen-reader users can reach the source without the hover card. */
  href?: string;
}

const InlineCitationCardTrigger = React.forwardRef<
  HTMLElement,
  InlineCitationCardTriggerProps
>(({ children, index, label, href, delay: propDelay, closeDelay: propCloseDelay, className, render, ...props }, ref) => {
  const context = useInlineCitation();
  const delay = propDelay ?? context?.delay ?? 200;
  const closeDelay = propCloseDelay ?? context?.closeDelay ?? 150;
  const defaultLabel = label || (index !== undefined ? `Citation [${index}]` : 'Citation');
  const safeHref = sanitizeUrl(href);

  const setTriggerRef = useMergedRefs<HTMLElement>(ref);

  const baseTriggerClassName = cn(
    'group relative inline-flex items-center align-baseline -top-[0.25em] p-0.5 rounded cursor-pointer touch-target-expanded',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  );

  return (
    <BasePreviewCard.Trigger
      ref={setTriggerRef}
      delay={delay}
      closeDelay={closeDelay}
      aria-label={defaultLabel}
      {...(safeHref
        ? { href: safeHref, target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      render={render ?? (safeHref ? undefined : <UnstyledButton />)}
      className={composeClassName(baseTriggerClassName, className)}
      {...props}
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
export interface InlineCitationCardProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup> {
  children?: React.ReactNode;
  container?: BasePreviewCard.Portal.Props['container'];
  side?: BasePreviewCard.Positioner.Props['side'];
  align?: BasePreviewCard.Positioner.Props['align'];
  sideOffset?: number;
}

const InlineCitationCard = React.forwardRef<HTMLDivElement, InlineCitationCardProps>(
  ({ children, className, container, side, align, sideOffset = 8, ...props }, ref) => {
    return (
      <BasePreviewCard.Portal container={container}>
        <BasePreviewCard.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={8}
          className="z-50 outline-none max-w-[min(var(--available-width),calc(100vw-1rem))]"
        >
          <BasePreviewCard.Popup
            ref={ref}
            className={composeClassName(
              cn(
                'flex flex-col w-80 max-w-full max-h-[var(--available-height)] rounded bg-surface border border-outline-variant shadow-ambient text-on-surface',
                'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-standard origin-[var(--transform-origin)]',
                'data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98]',
                'data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98]',
                'motion-reduce:transition-none motion-reduce:transform-none'
              ),
              className
            )}
            {...props}
          >
            <ScrollArea
              className="min-h-0 flex-[0_1_auto]"
              viewportClassName="overscroll-contain"
              contentClassName="p-3.5"
            >
              {children}
            </ScrollArea>
          </BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    );
  }
);
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

const InlineCitationIcon = React.forwardRef<HTMLSpanElement, InlineCitationIconProps>(
  ({ name = 'menu_book', src, alt = '', className, ...props }, ref) => {
    const safeSrc = sanitizeUrl(src);
    if (safeSrc) {
      return (
        <span
          ref={ref}
          className={cn('size-3.5 inline-flex items-center justify-center shrink-0 rounded-sm overflow-hidden', className)}
          {...props}
        >
          <img src={safeSrc} alt={alt} className="size-full object-contain" />
        </span>
      );
    }

    return (
      <Icon
        ref={ref}
        name={name}
        size="xs"
        className={cn('shrink-0 text-secondary', className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
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

const InlineCitationSource = React.forwardRef<HTMLDivElement, InlineCitationSourceProps>(
  ({ title, url, domain, authorOrDate, icon, favicon, className, ...props }, ref) => {
    const safeUrl = sanitizeUrl(url);
    const safeFavicon = sanitizeUrl(favicon);
    const displayDomain =
      domain ||
      (() => {
        if (!safeUrl) return undefined;
        try {
          return new URL(safeUrl).hostname.replace(/^www\./, '');
        } catch {
          return undefined;
        }
      })();

    return (
      <div ref={ref} className={cn('flex flex-col gap-1 min-w-0', className)} {...props}>
        {safeUrl ? (
          <a
            href={safeUrl}
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
              directional
              className="text-on-surface-variant/70 group-hover/link:text-secondary shrink-0 mt-0.5 transition-colors motion-reduce:transition-none"
              aria-hidden="true"
            />
          </a>
        ) : (
          <span className="font-heading font-semibold text-sm leading-snug line-clamp-2 text-on-surface">
            {title}
          </span>
        )}
        {(displayDomain || authorOrDate || icon || safeFavicon) && (
          <div className="flex flex-wrap items-center gap-1.5 min-w-0 font-mono text-xs text-on-surface-variant">
            {(safeFavicon || icon) && <InlineCitationIcon src={safeFavicon} name={icon} />}
            {displayDomain && <span className="truncate max-w-full">{displayDomain}</span>}
            {displayDomain && authorOrDate && <span>•</span>}
            {authorOrDate && <span className="truncate max-w-full">{authorOrDate}</span>}
          </div>
        )}
      </div>
    );
  }
);
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
          'border-s-2 border-secondary ps-2.5 py-1 text-xs font-normal text-on-surface-variant bg-surface-container-low rounded-none leading-relaxed',
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

const InlineCitationSkeleton = React.forwardRef<HTMLDivElement, InlineCitationSkeletonProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 p-1', className)} {...props}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
);
InlineCitationSkeleton.displayName = 'InlineCitationSkeleton';

/* -------------------------------------------------------------------------------------------------
 * Carousel for multi-source citations
 * -----------------------------------------------------------------------------------------------*/
export interface InlineCitationCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const InlineCitationCarousel = React.forwardRef<HTMLDivElement, InlineCitationCarouselProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Carousel ref={ref} opts={{ loop: false }} className={cn('w-full', className)} {...props}>
        {children}
      </Carousel>
    );
  }
);
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

const InlineCitationCarouselIndex = React.forwardRef<HTMLSpanElement, InlineCitationCarouselIndexProps>(
  ({ total, className, ...props }, ref) => {
    const { selectedIndex } = useCarousel();

    return (
      <span
        ref={ref}
        className={cn('font-mono text-xs tabular-nums text-on-surface-variant font-medium', className)}
        {...props}
      >
        Source {selectedIndex + 1} of {total}
      </span>
    );
  }
);
InlineCitationCarouselIndex.displayName = 'InlineCitationCarouselIndex';

export interface InlineCitationCarouselNavProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'size' | 'variant' | 'colorRole'> {
  className?: string;
}

const InlineCitationCarouselPrev = React.forwardRef<HTMLButtonElement, InlineCitationCarouselNavProps>(
  ({ className, onClick, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant="ghost"
        colorRole="neutral"
        size="sm"
        disabled={!canScrollPrev}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) scrollPrev();
        }}
        aria-label="Previous citation"
        className={cn(
          "relative size-6 p-0 min-h-[24px] min-w-[24px] rounded-full after:absolute after:-inset-y-2.5 after:-inset-x-1.5 after:content-['']",
          className
        )}
        {...props}
      >
        <Icon name="chevron_left" size="xs" directional aria-hidden="true" />
      </Button>
    );
  }
);
InlineCitationCarouselPrev.displayName = 'InlineCitationCarouselPrev';

const InlineCitationCarouselNext = React.forwardRef<HTMLButtonElement, InlineCitationCarouselNavProps>(
  ({ className, onClick, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant="ghost"
        colorRole="neutral"
        size="sm"
        disabled={!canScrollNext}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) scrollNext();
        }}
        aria-label="Next citation"
        className={cn(
          "relative size-6 p-0 min-h-[24px] min-w-[24px] rounded-full after:absolute after:-inset-y-2.5 after:-inset-x-1.5 after:content-['']",
          className
        )}
        {...props}
      >
        <Icon name="chevron_right" size="xs" directional aria-hidden="true" />
      </Button>
    );
  }
);
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

export const InlineCitationBadge = React.forwardRef<HTMLElement, InlineCitationBadgeProps>(
  ({ index, source, sources, label, className }, ref) => {
    const items = sources && sources.length > 0 ? sources : source ? [source] : [];

    if (items.length === 0) return null;

    if (items.length === 1) {
      const single = items[0];
      return (
        <InlineCitationRoot>
          <InlineCitationCardTrigger
            ref={ref}
            index={index}
            label={label || single.title}
            href={single.url}
            className={className}
          />
          <InlineCitationCard>
            <InlineCitationCardBody>
              <InlineCitationSource
                title={single.title}
                url={single.url}
                domain={single.domain}
                authorOrDate={single.authorOrDate}
                icon={single.icon}
                favicon={single.favicon}
              />
              {single.quote ? (
                <InlineCitationQuote>{single.quote}</InlineCitationQuote>
              ) : single.snippet ? (
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                  {single.snippet}
                </p>
              ) : null}
            </InlineCitationCardBody>
          </InlineCitationCard>
        </InlineCitationRoot>
      );
    }

    return (
      <InlineCitationRoot>
        <InlineCitationCardTrigger
          ref={ref}
          index={index}
          label={label || `${items.length} citations`}
          className={className}
        />
        <InlineCitationCard>
          <InlineCitationCarousel>
            <InlineCitationCarouselHeader>
              <InlineCitationCarouselIndex total={items.length} />
              <div className="flex items-center gap-4">
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
                      icon={item.icon}
                      favicon={item.favicon}
                    />
                    {item.quote ? (
                      <InlineCitationQuote>{item.quote}</InlineCitationQuote>
                    ) : item.snippet ? (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                        {item.snippet}
                      </p>
                    ) : null}
                  </InlineCitationCardBody>
                </InlineCitationCarouselItem>
              ))}
            </InlineCitationCarouselContent>
          </InlineCitationCarousel>
        </InlineCitationCard>
      </InlineCitationRoot>
    );
  }
);
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
