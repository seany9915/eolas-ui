import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Icon } from './icon';

type EmblaCarouselType = UseEmblaCarouselType[1];
type EmblaOptionsType = Parameters<typeof useEmblaCarousel>[0];
type EmblaPluginType = Parameters<typeof useEmblaCarousel>[1];

export type CarouselProps = {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: EmblaCarouselType) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

export const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
      if (!emblaApi) return;

      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, []);

    const scrollTo = React.useCallback(
      (index: number) => {
        api?.scrollTo(index);
      },
      [api]
    );

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Guard: Do not intercept arrow keys if focus is within an interactive form control
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable ||
            target.getAttribute('role') === 'slider' ||
            target.getAttribute('role') === 'radio')
        ) {
          return;
        }

        if (orientation === 'horizontal') {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollNext();
          }
        } else {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            scrollNext();
          }
        }
      },
      [orientation, scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;

      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api.off('select', onSelect);
        api.off('reInit', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
          scrollTo,
        }}
      >
        <div
          ref={ref}
          onKeyDown={handleKeyDown}
          className={cn('@container relative', className)}
          role="region"
          aria-roledescription="carousel"
          aria-label={props['aria-label'] || 'Carousel'}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outlined', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute z-10 rounded-full border-2 border-outline-variant bg-surface text-on-surface hover:bg-surface-container active:scale-95 motion-reduce:active:scale-100',
        orientation === 'horizontal'
          ? '-left-5 top-1/2 -translate-y-1/2'
          : '-top-5 left-1/2 -translate-x-1/2',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <Icon
        name={orientation === 'horizontal' ? 'chevron_left' : 'keyboard_arrow_up'}
        size="sm"
        className="text-lg"
        aria-hidden="true"
      />
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outlined', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute z-10 rounded-full border-2 border-outline-variant bg-surface text-on-surface hover:bg-surface-container active:scale-95 motion-reduce:active:scale-100',
        orientation === 'horizontal'
          ? '-right-5 top-1/2 -translate-y-1/2'
          : '-bottom-5 left-1/2 -translate-x-1/2',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <Icon
        name={orientation === 'horizontal' ? 'chevron_right' : 'keyboard_arrow_down'}
        size="sm"
        className="text-lg"
        aria-hidden="true"
      />
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

export const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

  if (scrollSnaps.length <= 1) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Slide navigation"
      className={cn('flex flex-wrap max-w-full items-center justify-center gap-1 pt-4 select-none', className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={index}
            type="button"
            aria-current={isSelected ? 'true' : undefined}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className="flex min-w-[44px] min-h-[44px] items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer"
          >
            <span
              className={cn(
                'size-2.5 rounded-full transition-all duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
                isSelected
                  ? 'w-6 bg-primary'
                  : 'bg-outline-variant hover:bg-outline'
              )}
            />
          </button>
        );
      })}
    </div>
  );
});
CarouselDots.displayName = 'CarouselDots';
