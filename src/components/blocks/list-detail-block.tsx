'use client';

/**
 * ListDetailBlock composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from primitives and design tokens:
 * - `Button` (`src/components/ui/button.tsx`)
 * - `Field` (`Field.Root`, `Field.Label`) (`src/components/ui/field.tsx`)
 * - `InputGroup` (`InputGroup.Addon`, `InputGroup.Input`, `InputGroup.Button`) (`src/components/ui/input-group.tsx`)
 * - `Item` (`Item.Group`, `Item.Media`, `Item.Content`, `Item.Title`, `Item.Description`, `Item.Actions`) (`src/components/ui/item.tsx`)
 * - `Badge` (`src/components/ui/badge.tsx`)
 * - `Icon` (`src/components/ui/icon.tsx`)
 * - `Empty` (`src/components/ui/empty.tsx`)
 *
 * TAXONOMY & USAGE:
 * - Canonical master-detail multi-pane block for data-dense workflows (caseload, exercises, session notes).
 * - Implements responsive container queries (`@container`):
 *   - On large containers (`@2xl:` / `>=672px`): Side-by-side two-pane split with selectable list and detail view.
 *   - On compact containers (`<672px`): Stack navigation. Renders list full-width; pushes detail view with an accessible back button when an item is selected.
 * - Active selection: 2px flush primary border + primary-container wash (`Item variant="selected"`).
 * - Touch targets: All list items maintain >=56px height (`Item size="md"` + `min-h-14`, WCAG 2.2 SC 2.5.8).
 * - Accessible keyboard navigation: Listbox roving focus via ArrowDown / ArrowUp / Home / End, selection via Enter / Space / click, and Escape to return on compact views.
 * - Zero direct `<button>` or `<input>` tags outside primitives.
 */
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { Item } from '@/components/ui/item';
import { Badge, type BadgeColorRole } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Empty } from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface ListDetailItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  badge?: string;
  badgeColorRole?: BadgeColorRole;
  icon?: string;
  /** Optional custom leading media (e.g. Avatar), rendered instead of `icon` in both list rows and the detail header. */
  media?: React.ReactNode;
  disabled?: boolean;
}

export type ListDetailDensity = 'compact' | 'comfortable' | 'spacious';
export type ListDetailVariant = 'card' | 'flush';
export type ListDetailHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export interface ListDetailLabels {
  back?: string;
  clearSearch?: string;
  detailsHeading?: string;
  noResults?: string;
  noDetails?: string;
  showList?: string;
  hideList?: string;
  filterPrefix?: string;
  resultsCount?: (count: number) => string;
}

const detailHeadingMap: Record<ListDetailHeadingTag, 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  h1: 'h2',
  h2: 'h3',
  h3: 'h4',
  h4: 'h5',
  h5: 'h6',
};

export interface ListDetailBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ListDetailItem[];
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectId?: (id: string | null) => void;
  title?: string;
  /** Heading tag used for the list pane title. Defaults to `'h2'` (detail heading auto-steps down by 1). */
  titleAs?: ListDetailHeadingTag;
  /** Optional Material Symbol name rendered beside the list title. */
  titleIcon?: string;
  /** Optional count badge or status node rendered beside the list title. */
  titleBadge?: React.ReactNode;
  headerAction?: React.ReactNode;
  detailActions?: React.ReactNode;
  searchable?: boolean;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  /** Enables local substring filtering on `items`. Set false when filtering on a server. */
  clientFilter?: boolean;
  /** Optional custom local filter predicate overriding default title/subtitle/meta matching. */
  filterItems?: (items: ListDetailItem[], query: string) => ListDetailItem[];
  renderDetail?: (item: ListDetailItem) => React.ReactNode;
  /** Optional custom renderer for list rows inside the listbox. */
  renderItem?: (item: ListDetailItem, state: { selected: boolean }) => React.ReactNode;
  /** Shows skeleton rows in the list pane while items are loading. */
  loading?: boolean;
  /** Accessible status label announced while `loading` is true. */
  loadingLabel?: string;
  /** Number of skeleton placeholder rows when `loading` is true. */
  skeletonCount?: number;
  emptyDetailTitle?: string;
  emptyDetailDescription?: string;
  emptyDetailIcon?: string;
  /** Optional action rendered inside the detail pane empty state. */
  emptyDetailAction?: React.ReactNode;
  emptyListTitle?: string;
  emptyListDescription?: string;
  emptyListIcon?: string;
  /** Optional action rendered inside the list pane empty state when there is no active search query. */
  emptyListAction?: React.ReactNode;
  /** Enables an opt-in collapse toggle for the list pane on `@2xl+` split layouts. */
  collapsible?: boolean;
  /** Controlled open state for the collapsible list pane on wide layouts. */
  listOpen?: boolean;
  /** Uncontrolled default open state for the collapsible list pane on wide layouts. */
  defaultListOpen?: boolean;
  /** Callback fired when the wide-layout list pane is collapsed or expanded. */
  onListOpenChange?: (open: boolean) => void;
  /** Optional localized strings for built-in controls and empty states. */
  labels?: ListDetailLabels;
  /** Container presentation: `'card'` (default bordered rounded surface) or `'flush'` (edge-to-edge inside `AppShell flush`). */
  variant?: ListDetailVariant;
  /** Skips default detail-body padding and inner scroll wrapper for full-height child layouts (e.g. `Tabs`). */
  detailBodyFlush?: boolean;
  /** Hides the secondary subtitle/meta bar below the detail header and moves subtitle inline into the header. Defaults to `true`. */
  hideDetailMetaBar?: boolean;
  /** Density mode ('compact' | 'comfortable' | 'spacious'). Also inherits `--density` via CSS container style queries. */
  density?: ListDetailDensity;
  className?: string;
  listWidthClassName?: string;
  children?: React.ReactNode;
}

function isElementVisible(el: HTMLElement | null): boolean {
  if (!el) return false;
  if (typeof el.checkVisibility === 'function') {
    return el.checkVisibility();
  }
  return el.getClientRects().length > 0;
}

export const ListDetailBlock = React.forwardRef<HTMLDivElement, ListDetailBlockProps>(
  (
    {
      items,
      selectedId,
      defaultSelectedId = null,
      onSelectId,
      title = 'Items',
      titleAs = 'h2',
      titleIcon,
      titleBadge,
      headerAction,
      detailActions,
      searchable = true,
      searchQuery,
      defaultSearchQuery = '',
      onSearchChange,
      searchPlaceholder = 'Search...',
      clientFilter = true,
      filterItems,
      renderDetail,
      renderItem,
      loading = false,
      loadingLabel = 'Loading items...',
      skeletonCount = 5,
      emptyDetailTitle = 'No item selected',
      emptyDetailDescription = 'Choose an item from the list to view its details.',
      emptyDetailIcon = 'touch_app',
      emptyDetailAction,
      emptyListTitle,
      emptyListDescription,
      emptyListIcon,
      emptyListAction,
      collapsible = false,
      listOpen: controlledListOpen,
      defaultListOpen = true,
      onListOpenChange,
      labels,
      variant = 'card',
      detailBodyFlush = false,
      hideDetailMetaBar = true,
      density,
      className,
      listWidthClassName = '@2xl:w-72 @4xl:w-80',
      children,
      ...props
    },
    ref
  ) => {
    const [internalSelectedId, setInternalSelectedId] = React.useState<string | null>(
      defaultSelectedId
    );
    const [internalSearch, setInternalSearch] = React.useState(defaultSearchQuery);
    const [focusedItemId, setFocusedItemId] = React.useState<string | null>(null);
    const [uncontrolledListOpen, setUncontrolledListOpen] = React.useState(defaultListOpen);
    const searchInputId = React.useId();
    const listPaneId = React.useId();
    const listPaneRef = React.useRef<HTMLDivElement | null>(null);
    const detailPaneRef = React.useRef<HTMLDivElement | null>(null);
    const backButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const collapseButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const emptyCollapseButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const focusRafRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      return () => {
        if (focusRafRef.current !== null) {
          cancelAnimationFrame(focusRafRef.current);
        }
      };
    }, []);

    const isControlledSelect = selectedId !== undefined;
    const currentSelectedId = isControlledSelect ? selectedId : internalSelectedId;

    const isControlledSearch = searchQuery !== undefined;
    const currentSearch = isControlledSearch ? searchQuery : internalSearch;

    const isControlledListOpen = controlledListOpen !== undefined;
    const isListOpen = collapsible ? (isControlledListOpen ? controlledListOpen : uncontrolledListOpen) : true;

    const setListOpen = (next: boolean) => {
      if (!isControlledListOpen) {
        setUncontrolledListOpen(next);
      }
      onListOpenChange?.(next);
    };

    React.useEffect(() => {
      if (isListOpen) return;
      const listPane = listPaneRef.current;
      if (listPane && listPane.contains(document.activeElement)) {
        if (isElementVisible(collapseButtonRef.current)) {
          collapseButtonRef.current?.focus();
        } else if (isElementVisible(emptyCollapseButtonRef.current)) {
          emptyCollapseButtonRef.current?.focus();
        }
      }
    }, [isListOpen]);

    const backLabel = labels?.back ?? 'Back';
    const clearSearchLabel = labels?.clearSearch ?? 'Clear search';
    const detailsHeadingLabel = labels?.detailsHeading ?? 'Details';
    const noResultsLabel = labels?.noResults ?? 'No results found';
    const noDetailsLabel = labels?.noDetails ?? 'No additional details.';
    const showListLabel = labels?.showList ?? `Show ${title.toLowerCase()}`;
    const hideListLabel = labels?.hideList ?? `Hide ${title.toLowerCase()}`;
    const filterPrefixLabel = labels?.filterPrefix ?? 'Filter';

    const findItemNode = React.useCallback((id: string): HTMLElement | null => {
      const nodes = listPaneRef.current?.querySelectorAll<HTMLElement>('[role="option"][data-item-id]');
      if (!nodes) return null;
      for (const node of nodes) {
        if (node.dataset.itemId === id) {
          return node;
        }
      }
      return null;
    }, []);

    const handleSelect = (id: string | null) => {
      if (!isControlledSelect) {
        setInternalSelectedId(id);
      }
      onSelectId?.(id);
    };

    const handleActivateItem = (id: string) => {
      // On compact single-pane widths, list-pane is visible while detail-pane is hidden before selection.
      const isCompactView = isElementVisible(listPaneRef.current) && !isElementVisible(detailPaneRef.current);
      setFocusedItemId(id);
      handleSelect(id);
      if (isCompactView) {
        if (focusRafRef.current !== null) {
          cancelAnimationFrame(focusRafRef.current);
        }
        focusRafRef.current = window.requestAnimationFrame(() => {
          focusRafRef.current = null;
          if (isElementVisible(backButtonRef.current)) {
            backButtonRef.current?.focus();
          }
        });
      }
    };

    const filteredItems = React.useMemo(() => {
      if (!clientFilter || !currentSearch.trim()) return items;
      if (filterItems) return filterItems(items, currentSearch);
      const query = currentSearch.toLowerCase();
      return items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query) ||
          (typeof item.meta === 'string' && item.meta.toLowerCase().includes(query))
      );
    }, [items, currentSearch, clientFilter, filterItems]);

    const enabledItems = React.useMemo(
      () => filteredItems.filter((it) => !it.disabled),
      [filteredItems]
    );

    const selectedItem = React.useMemo(
      () => items.find((item) => item.id === currentSelectedId) || null,
      [items, currentSelectedId]
    );

    const rovingTargetId = React.useMemo(() => {
      if (focusedItemId && enabledItems.some((it) => it.id === focusedItemId)) {
        return focusedItemId;
      }
      if (currentSelectedId && enabledItems.some((it) => it.id === currentSelectedId)) {
        return currentSelectedId;
      }
      return enabledItems[0]?.id ?? null;
    }, [enabledItems, focusedItemId, currentSelectedId]);

    const handleBackToList = (restoreFocusId?: string | null) => {
      const targetId =
        restoreFocusId && enabledItems.some((it) => it.id === restoreFocusId)
          ? restoreFocusId
          : rovingTargetId;
      handleSelect(null);
      if (focusRafRef.current !== null) {
        cancelAnimationFrame(focusRafRef.current);
      }
      focusRafRef.current = window.requestAnimationFrame(() => {
        focusRafRef.current = null;
        const targetNode = targetId ? findItemNode(targetId) : null;
        if (isElementVisible(targetNode)) {
          targetNode?.focus();
        } else if (isElementVisible(searchInputRef.current)) {
          searchInputRef.current?.focus();
        }
      });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!isControlledSearch) {
        setInternalSearch(val);
      }
      onSearchChange?.(val);
    };

    const handleClearSearch = () => {
      if (!isControlledSearch) {
        setInternalSearch('');
      }
      onSearchChange?.('');
      searchInputRef.current?.focus();
    };

    const focusItemById = (id: string) => {
      const target = findItemNode(id);
      if (!target) return;
      setFocusedItemId(id);
      target.focus();
      target.scrollIntoView({ block: 'nearest' });
    };

    const handleItemKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, item: ListDetailItem) => {
      if (enabledItems.length === 0) return;
      const enabledIndex = enabledItems.findIndex((it) => it.id === item.id);
      if (enabledIndex === -1) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = enabledItems[enabledIndex < enabledItems.length - 1 ? enabledIndex + 1 : 0];
        focusItemById(next.id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = enabledItems[enabledIndex > 0 ? enabledIndex - 1 : enabledItems.length - 1];
        focusItemById(prev.id);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusItemById(enabledItems[0].id);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusItemById(enabledItems[enabledItems.length - 1].id);
      }
    };

    const handleDetailKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Escape' || e.defaultPrevented || !selectedItem) return;
      // Only navigate back on Escape in compact view where the Back button is visible.
      if (isElementVisible(backButtonRef.current)) {
        e.preventDefault();
        handleBackToList(selectedItem.id);
      }
    };

    const TitleTag = titleAs;
    const DetailHeadingTag = detailHeadingMap[titleAs];
    const hasSearchQuery = Boolean(currentSearch.trim());
    const resolvedEmptyListTitle =
      emptyListTitle ?? (hasSearchQuery ? 'No items found' : 'No items yet');
    const resolvedEmptyListDescription =
      emptyListDescription ??
      (hasSearchQuery
        ? 'Try adjusting your search query.'
        : 'Items added to this list will appear here.');
    const resolvedEmptyListIcon = emptyListIcon ?? (hasSearchQuery ? 'search_off' : 'inbox');

    return (
      <div
        ref={ref}
        data-slot="list-detail-block"
        data-variant={variant}
        data-density={density}
        className={cn(
          '@container size-full bg-surface overflow-hidden flex flex-col',
          variant === 'flush'
            ? 'min-h-0'
            : 'min-h-80 short:min-h-0 rounded-lg border border-outline-variant',
          className
        )}
        {...props}
      >
        <div
          data-slot="list-detail-layout"
          className="flex-1 min-h-0 w-full flex flex-col @2xl:flex-row"
        >
        {/* List Pane */}
        <div
          ref={listPaneRef}
          id={listPaneId}
          data-slot="list-pane"
          data-state={isListOpen ? 'open' : 'closed'}
          inert={collapsible && !isListOpen}
          className={cn(
            'w-full flex-1 @2xl:flex-initial flex-col bg-surface shrink-0 min-h-0 min-w-0 overflow-hidden ease-standard motion-reduce:transition-none',
            collapsible && '@2xl:transition-[opacity,width,visibility]',
            isListOpen
              ? cn(listWidthClassName, 'border-e-0 @2xl:border-e border-outline-variant opacity-100 visible @2xl:duration-fast')
              : '@2xl:w-0 @2xl:border-e-0 @2xl:opacity-0 @2xl:invisible @2xl:pointer-events-none @2xl:duration-quick',
            selectedItem ? 'hidden @2xl:flex' : 'flex'
          )}
        >
          {/* List Header */}
          <div className="flex flex-col shrink-0 bg-surface">
            <div className="min-h-16 py-2.5 px-4 border-b border-outline-variant flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {titleIcon && (
                  <Icon name={titleIcon} size="md" className="text-on-surface-variant shrink-0" aria-hidden="true" />
                )}
                <TitleTag className="font-heading text-base font-semibold text-on-surface truncate">
                  {title}
                </TitleTag>
                {titleBadge && <div className="shrink-0">{titleBadge}</div>}
              </div>
              {headerAction && (
                <div className="flex items-center gap-1.5 shrink-0">{headerAction}</div>
              )}
            </div>

            {searchable && (
              <div className="px-2 pt-2.5 pb-0.5 bg-surface shrink-0">
                <Field.Root>
                  <Field.Label htmlFor={searchInputId} className="sr-only">
                    {filterPrefixLabel} {title}
                  </Field.Label>
                  <InputGroup size="sm">
                    <InputGroup.Addon align="inline-start">
                      <Icon name="search" size="sm" />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      ref={searchInputRef}
                      id={searchInputId}
                      type="search"
                      enterKeyHint="search"
                      value={currentSearch}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                    />
                    {currentSearch && (
                      <InputGroup.Addon align="inline-end">
                        <InputGroup.Button
                          size="icon-xs"
                          colorRole="neutral"
                          aria-label={clearSearchLabel}
                          onClick={handleClearSearch}
                        >
                          <Icon name="close" size="xs" />
                        </InputGroup.Button>
                      </InputGroup.Addon>
                    )}
                  </InputGroup>
                </Field.Root>
              </div>
            )}
          </div>

          {/* List Items Container with Roving Arrow-Key Focus */}
          <ScrollArea className="flex-1 min-h-0" viewportClassName="overscroll-contain">
            <div data-slot="list-items" className="flex flex-col">
            {searchable && hasSearchQuery && (
              <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {filteredItems.length === 0
                  ? noResultsLabel
                  : labels?.resultsCount
                    ? labels.resultsCount(filteredItems.length)
                    : `${filteredItems.length} ${filteredItems.length === 1 ? 'result' : 'results'} found`}
              </div>
            )}
            {loading ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col gap-1.5"
              >
                <span className="sr-only">{loadingLabel}</span>
                {Array.from({ length: skeletonCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-3 min-h-14 rounded-md"
                  >
                    <Skeleton className="size-9 rounded-md shrink-0" />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3.5 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <Empty
                variant="unboxed"
                icon={resolvedEmptyListIcon}
                title={resolvedEmptyListTitle}
                description={resolvedEmptyListDescription}
                action={
                  hasSearchQuery ? (
                    <Button
                      variant="outline"
                      colorRole="neutral"
                      size="sm"
                      onClick={handleClearSearch}
                    >
                      {clearSearchLabel}
                    </Button>
                  ) : (
                    emptyListAction
                  )
                }
                className="my-0"
              />
            ) : (
              <Item.Group role="listbox" aria-label={title}>
                {filteredItems.map((item) => {
                  const isSelected = item.id === currentSelectedId;
                  const isRovingTarget = !item.disabled && item.id === rovingTargetId;
                  const showMetaInRow1 = Boolean(!item.badge && !item.subtitle && item.meta);
                  const showRow2 = Boolean(item.subtitle || (item.meta && !showMetaInRow1));
                  return (
                    <Item
                      key={item.id}
                      data-item-id={item.id}
                      role="option"
                      variant={isSelected ? 'selected' : 'default'}
                      interactive={!item.disabled}
                      size="md"
                      tabIndex={item.disabled ? -1 : isRovingTarget ? 0 : -1}
                      aria-disabled={item.disabled || undefined}
                      aria-selected={isSelected}
                      onFocus={() => !item.disabled && setFocusedItemId(item.id)}
                      onClick={() => !item.disabled && handleActivateItem(item.id)}
                      onKeyDown={(e) => handleItemKeyDown(e, item)}
                      className="min-h-14"
                    >
                      {renderItem ? (
                        renderItem(item, { selected: isSelected })
                      ) : (
                        <>
                          {item.media ? (
                            <Item.Media variant="default">{item.media}</Item.Media>
                          ) : item.icon ? (
                            <Item.Media variant="icon">
                              <Icon name={item.icon} size="md" />
                            </Item.Media>
                          ) : null}
                          <Item.Content>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <div className="flex items-center justify-between gap-2 min-w-0">
                                <Item.Title>{item.title}</Item.Title>
                                {item.badge ? (
                                  <Badge
                                    variant={isSelected ? 'filled' : 'soft'}
                                    colorRole={
                                      item.badgeColorRole || (isSelected ? 'primary' : 'neutral')
                                    }
                                    size="sm"
                                    className="shrink-0"
                                  >
                                    {item.badge}
                                  </Badge>
                                ) : showMetaInRow1 ? (
                                  <span
                                    className={cn(
                                      'text-sm font-sans tabular-nums shrink-0',
                                      isSelected
                                        ? 'text-on-primary-container'
                                        : 'text-on-surface-variant'
                                    )}
                                  >
                                    {item.meta}
                                  </span>
                                ) : null}
                              </div>
                              {showRow2 && (
                                <div
                                  className={cn(
                                    'flex items-center gap-2 min-w-0',
                                    item.subtitle ? 'justify-between' : 'justify-end'
                                  )}
                                >
                                  {item.subtitle && (
                                    <div className="min-w-0 flex-1">
                                      <Item.Description>
                                        <span className="block truncate">{item.subtitle}</span>
                                      </Item.Description>
                                    </div>
                                  )}
                                  {item.meta && !showMetaInRow1 && (
                                    <span
                                      className={cn(
                                        'text-sm font-sans tabular-nums shrink-0',
                                        isSelected
                                          ? 'text-on-primary-container'
                                          : 'text-on-surface-variant'
                                      )}
                                    >
                                      {item.meta}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </Item.Content>
                        </>
                      )}
                    </Item>
                  );
                })}
              </Item.Group>
            )}
            </div>
          </ScrollArea>
        </div>

        {/* Detail Pane */}
        <div
          ref={detailPaneRef}
          data-slot="detail-pane"
          onKeyDown={handleDetailKeyDown}
          className={cn(
            'flex-1 flex flex-col bg-surface min-w-0 min-h-0',
            selectedItem ? 'flex' : 'hidden @2xl:flex'
          )}
        >
          {selectedItem ? (
            <div className="flex-1 flex flex-col h-full min-h-0">
              {/* Unified Detail Header */}
              <div
                data-slot="detail-header"
                className={cn(
                  'min-h-16 py-2.5 px-3 @md:px-4 border-b border-outline-variant flex flex-wrap items-center justify-between gap-2 @2xl:gap-3 bg-surface shrink-0',
                  collapsible ? '@2xl:ps-3 @2xl:pe-6' : '@2xl:px-6'
                )}
              >
                <div className={cn('flex items-center gap-2 @2xl:gap-3 min-w-0 flex-1', detailActions && 'min-w-44')}>
                  <Button
                    ref={backButtonRef}
                    variant="text"
                    colorRole="neutral"
                    size="sm"
                    onClick={() => handleBackToList(selectedItem.id)}
                    aria-label={title ? `${backLabel} to ${title}` : `${backLabel} to list`}
                    className="@2xl:hidden"
                  >
                    <Icon name="arrow_back" size="sm" directional />
                    <span>{backLabel}</span>
                  </Button>
                  {collapsible && (
                    <Tooltip content={isListOpen ? hideListLabel : showListLabel}>
                      <Button
                        ref={collapseButtonRef}
                        variant="text"
                        colorRole="neutral"
                        size="icon"
                        onClick={() => setListOpen(!isListOpen)}
                        aria-expanded={isListOpen}
                        aria-controls={listPaneId}
                        aria-label={isListOpen ? hideListLabel : showListLabel}
                        className="hidden @2xl:inline-flex shrink-0"
                      >
                        <Icon.Toggle
                          active={isListOpen}
                          onName="left_panel_close"
                          offName="left_panel_open"
                          size="md"
                          directional
                        />
                      </Button>
                    </Tooltip>
                  )}
                  {selectedItem.media ? (
                    <div className="shrink-0">{selectedItem.media}</div>
                  ) : selectedItem.icon ? (
                    <div className="size-9 rounded-md bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0" aria-hidden="true">
                      <Icon name={selectedItem.icon} size="md" />
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <DetailHeadingTag className="font-heading text-base font-semibold text-on-surface truncate min-w-0">
                        {selectedItem.title}
                      </DetailHeadingTag>
                      {selectedItem.badge && (
                        <Badge
                          variant="soft"
                          colorRole={selectedItem.badgeColorRole || 'primary'}
                          size="sm"
                          className={cn(hideDetailMetaBar ? 'inline-flex shrink-0' : 'hidden @2xl:inline-flex shrink-0')}
                        >
                          {selectedItem.badge}
                        </Badge>
                      )}
                    </div>
                    {hideDetailMetaBar && (selectedItem.subtitle || selectedItem.meta) && (
                      <div className="flex items-center gap-1.5 min-w-0 text-sm font-sans text-on-surface-variant">
                        {selectedItem.subtitle && (
                          <span className="truncate">{selectedItem.subtitle}</span>
                        )}
                        {selectedItem.subtitle && selectedItem.meta && (
                          <span aria-hidden="true" className="shrink-0">·</span>
                        )}
                        {selectedItem.meta && (
                          <span className="tabular-nums shrink-0">{selectedItem.meta}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {detailActions && (
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 max-w-full">{detailActions}</div>
                )}
              </div>

              {!hideDetailMetaBar && (selectedItem.subtitle || selectedItem.meta || selectedItem.badge) && (
                <div
                  className={cn(
                    'min-h-11 px-4 @md:px-6 py-2 border-b border-outline-variant flex flex-wrap items-center justify-between gap-2 bg-surface text-sm font-sans text-on-surface-variant shrink-0',
                    !selectedItem.subtitle && !selectedItem.meta && '@2xl:hidden'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {selectedItem.badge && (
                      <span className="shrink-0 @2xl:hidden">
                        <Badge
                          variant="soft"
                          colorRole={selectedItem.badgeColorRole || 'primary'}
                          size="sm"
                        >
                          {selectedItem.badge}
                        </Badge>
                      </span>
                    )}
                    {selectedItem.subtitle && (
                      <span className="truncate">{selectedItem.subtitle}</span>
                    )}
                  </div>
                  {selectedItem.meta && (
                    <span className="font-sans text-sm text-on-surface-variant tabular-nums shrink-0">
                      {selectedItem.meta}
                    </span>
                  )}
                </div>
              )}

              {/* Detail Body */}
              {detailBodyFlush ? (
                <div
                  data-slot="detail-body"
                  data-flush="true"
                  className="flex-1 flex flex-col min-h-0 overflow-hidden p-0"
                >
                  <div className="@container flex-1 flex flex-col min-h-0 w-full">
                    {renderDetail ? (
                      renderDetail(selectedItem)
                    ) : children ? (
                      children
                    ) : (
                      <p className="font-sans text-base text-on-surface-variant p-6">
                        {selectedItem.subtitle || noDetailsLabel}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <ScrollArea className="flex-1 min-h-0" viewportClassName="overscroll-contain">
                  <div
                    data-slot="detail-body"
                    className={cn('@container w-full', !density && '@max-md:p-4')}
                  >
                    {renderDetail ? (
                      renderDetail(selectedItem)
                    ) : children ? (
                      children
                    ) : (
                      <p className="font-sans text-base text-on-surface-variant">
                        {selectedItem.subtitle || noDetailsLabel}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full min-h-0">
              <div
                className={cn(
                  'min-h-16 py-2.5 px-4 border-b border-outline-variant hidden @2xl:flex items-center gap-3 bg-surface shrink-0',
                  collapsible ? '@2xl:ps-3 @2xl:pe-6' : '@2xl:px-6'
                )}
              >
                {collapsible && (
                  <Tooltip content={isListOpen ? hideListLabel : showListLabel}>
                    <Button
                      ref={emptyCollapseButtonRef}
                      variant="text"
                      colorRole="neutral"
                      size="icon"
                      onClick={() => setListOpen(!isListOpen)}
                      aria-expanded={isListOpen}
                      aria-controls={listPaneId}
                      aria-label={isListOpen ? hideListLabel : showListLabel}
                      className="shrink-0"
                    >
                      <Icon.Toggle
                        active={isListOpen}
                        onName="left_panel_close"
                        offName="left_panel_open"
                        size="md"
                        directional
                      />
                    </Button>
                  </Tooltip>
                )}
                <span className="font-heading text-base font-semibold text-on-surface-variant">
                  {detailsHeadingLabel}
                </span>
              </div>
              <ScrollArea
                className="flex-1 min-h-0"
                viewportClassName="overscroll-contain"
                contentClassName="flex flex-col"
              >
                <Empty
                  variant="unboxed"
                  icon={emptyDetailIcon}
                  title={emptyDetailTitle}
                  description={emptyDetailDescription}
                  action={emptyDetailAction}
                  className="my-0"
                />
              </ScrollArea>
            </div>
          )}
        </div>
        </div>
      </div>
    );
  }
);
ListDetailBlock.displayName = 'ListDetailBlock';

export default ListDetailBlock;
