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
 * - Touch targets: All list items maintain >=56px height (`Item size="lg"`, WCAG 2.2 SC 2.5.8).
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
import { cn } from '@/lib/utils';

export interface ListDetailItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  badgeColorRole?: BadgeColorRole;
  icon?: string;
  disabled?: boolean;
}

export type ListDetailDensity = 'compact' | 'comfortable' | 'spacious';

export interface ListDetailBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ListDetailItem[];
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectId?: (id: string | null) => void;
  title?: string;
  headerAction?: React.ReactNode;
  detailActions?: React.ReactNode;
  searchable?: boolean;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  renderDetail?: (item: ListDetailItem) => React.ReactNode;
  emptyDetailTitle?: string;
  emptyDetailDescription?: string;
  emptyListTitle?: string;
  emptyListDescription?: string;
  /** Density mode ('compact' | 'comfortable' | 'spacious'). Also inherits `--density` via CSS container style queries. */
  density?: ListDetailDensity;
  className?: string;
  listWidthClassName?: string;
  children?: React.ReactNode;
}

export const ListDetailBlock = React.forwardRef<HTMLDivElement, ListDetailBlockProps>(
  (
    {
      items,
      selectedId,
      defaultSelectedId = null,
      onSelectId,
      title = 'Items',
      headerAction,
      detailActions,
      searchable = true,
      searchQuery,
      defaultSearchQuery = '',
      onSearchChange,
      searchPlaceholder = 'Search...',
      renderDetail,
      emptyDetailTitle = 'No item selected',
      emptyDetailDescription = 'Choose an item from the list to view its details.',
      emptyListTitle,
      emptyListDescription,
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
    const searchInputId = React.useId();
    const listPaneRef = React.useRef<HTMLDivElement | null>(null);
    const detailPaneRef = React.useRef<HTMLDivElement | null>(null);
    const backButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    const isControlledSelect = selectedId !== undefined;
    const currentSelectedId = isControlledSelect ? selectedId : internalSelectedId;

    const isControlledSearch = searchQuery !== undefined;
    const currentSearch = isControlledSearch ? searchQuery : internalSearch;

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
      // On compact single-pane widths, detail-pane is hidden before selection; move focus into it on open.
      const isCompactView = detailPaneRef.current?.offsetParent === null;
      setFocusedItemId(id);
      handleSelect(id);
      if (isCompactView) {
        window.requestAnimationFrame(() => {
          if (backButtonRef.current && backButtonRef.current.offsetParent !== null) {
            backButtonRef.current.focus();
          }
        });
      }
    };

    const filteredItems = React.useMemo(() => {
      if (!currentSearch.trim()) return items;
      const query = currentSearch.toLowerCase();
      return items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query) ||
          item.meta?.toLowerCase().includes(query)
      );
    }, [items, currentSearch]);

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
      window.requestAnimationFrame(() => {
        const targetNode = targetId ? findItemNode(targetId) : null;
        if (targetNode && targetNode.offsetParent !== null) {
          targetNode.focus();
        } else if (searchInputRef.current && searchInputRef.current.offsetParent !== null) {
          searchInputRef.current.focus();
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
      // Only navigate back on Escape in compact view where the list pane is hidden.
      const isCompactView = listPaneRef.current?.offsetParent === null;
      if (isCompactView) {
        e.preventDefault();
        handleBackToList(selectedItem.id);
      }
    };

    const hasSearchQuery = Boolean(currentSearch.trim());
    const resolvedEmptyListTitle =
      emptyListTitle ?? (hasSearchQuery ? 'No items found' : 'No items yet');
    const resolvedEmptyListDescription =
      emptyListDescription ??
      (hasSearchQuery
        ? 'Try adjusting your search query.'
        : 'Items added to this list will appear here.');

    return (
      <div
        ref={ref}
        data-slot="list-detail-block"
        data-density={density}
        className={cn(
          '@container size-full min-h-120 short:min-h-0 bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col',
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
          data-slot="list-pane"
          className={cn(
            listWidthClassName,
            'w-full flex-1 @2xl:flex-initial flex-col bg-surface border-e-0 @2xl:border-e border-outline-variant shrink-0 min-h-0',
            selectedItem ? 'hidden @2xl:flex' : 'flex'
          )}
        >
          {/* List Header */}
          <div className="flex flex-col shrink-0 bg-surface">
            <div className="min-h-16 short:min-h-14 py-2 px-4 border-b border-outline-variant flex items-center justify-between gap-2">
              <h2 className="font-heading text-base font-semibold text-on-surface truncate">
                {title}
              </h2>
              {headerAction && (
                <div className="flex items-center gap-1.5 shrink-0">{headerAction}</div>
              )}
            </div>

            {searchable && (
              <div className="px-3 py-2 border-b border-outline-variant bg-surface shrink-0">
                <Field.Root>
                  <Field.Label htmlFor={searchInputId} className="sr-only">
                    Filter {title}
                  </Field.Label>
                  <InputGroup size="sm">
                    <InputGroup.Addon align="inline-start">
                      <Icon name="search" size="sm" />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      ref={searchInputRef}
                      id={searchInputId}
                      value={currentSearch}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                    />
                    {currentSearch && (
                      <InputGroup.Addon align="inline-end">
                        <InputGroup.Button
                          size="icon-xs"
                          colorRole="neutral"
                          aria-label="Clear search"
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
          <div data-slot="list-items" className="flex-1 overflow-y-auto flex flex-col">
            {searchable && hasSearchQuery && (
              <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {filteredItems.length === 0
                  ? 'No results found'
                  : `${filteredItems.length} ${filteredItems.length === 1 ? 'result' : 'results'} found`}
              </div>
            )}
            {filteredItems.length === 0 ? (
              <Empty
                variant="unboxed"
                icon={hasSearchQuery ? 'search_off' : 'inbox'}
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
                      Clear search
                    </Button>
                  ) : undefined
                }
                className="my-0"
              />
            ) : (
              <Item.Group role="listbox" aria-label={title}>
                {filteredItems.map((item) => {
                  const isSelected = item.id === currentSelectedId;
                  const isRovingTarget = !item.disabled && item.id === rovingTargetId;
                  const hasBadgeAndMeta = Boolean(item.badge && item.meta);
                  return (
                    <Item
                      key={item.id}
                      data-item-id={item.id}
                      role="option"
                      variant={isSelected ? 'selected' : 'default'}
                      interactive={!item.disabled}
                      size="lg"
                      tabIndex={item.disabled ? -1 : isRovingTarget ? 0 : -1}
                      aria-disabled={item.disabled || undefined}
                      aria-selected={isSelected}
                      onFocus={() => !item.disabled && setFocusedItemId(item.id)}
                      onClick={() => !item.disabled && handleActivateItem(item.id)}
                      onKeyDown={(e) => handleItemKeyDown(e, item)}
                    >
                      {item.icon && (
                        <Item.Media variant="icon">
                          <Icon name={item.icon} size="sm" />
                        </Item.Media>
                      )}
                      <Item.Content>
                        <Item.Title>{item.title}</Item.Title>
                        {item.subtitle && (
                          <Item.Description>{item.subtitle}</Item.Description>
                        )}
                      </Item.Content>
                      {(item.badge || item.meta) && (
                        <Item.Actions>
                          <div
                            className={cn(
                              'flex shrink-0',
                              hasBadgeAndMeta
                                ? 'flex-col items-end gap-1'
                                : 'items-center gap-2'
                            )}
                          >
                            {item.badge && (
                              <Badge
                                variant={isSelected ? 'filled' : 'soft'}
                                colorRole={
                                  item.badgeColorRole || (isSelected ? 'primary' : 'neutral')
                                }
                                size="sm"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {item.meta && (
                              <span
                                className={cn(
                                  'text-sm font-mono',
                                  isSelected
                                    ? 'text-on-primary-container'
                                    : 'text-on-surface-variant'
                                )}
                              >
                                {item.meta}
                              </span>
                            )}
                          </div>
                        </Item.Actions>
                      )}
                    </Item>
                  );
                })}
              </Item.Group>
            )}
          </div>
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
                className="min-h-16 short:min-h-14 py-2 px-3 @md:px-4 @2xl:px-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-2 @2xl:gap-3 bg-surface shrink-0"
              >
                <div className="flex items-center gap-1.5 @2xl:gap-2.5 min-w-0 flex-1">
                  <Button
                    ref={backButtonRef}
                    variant="text"
                    colorRole="neutral"
                    size="sm"
                    onClick={() => handleBackToList(selectedItem.id)}
                    aria-label={title ? `Back to ${title}` : 'Back to list'}
                    className="@2xl:hidden"
                  >
                    <Icon name="arrow_back" size="sm" directional />
                    <span>Back</span>
                  </Button>
                  <h3 className="font-heading text-base font-semibold text-on-surface truncate min-w-0">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.badge && (
                    <Badge
                      variant="soft"
                      colorRole={selectedItem.badgeColorRole || 'primary'}
                      size="sm"
                      className="hidden @2xl:inline-flex"
                    >
                      {selectedItem.badge}
                    </Badge>
                  )}
                </div>
                {detailActions && (
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 max-w-full">{detailActions}</div>
                )}
              </div>

              {(selectedItem.subtitle || selectedItem.meta || selectedItem.badge) && (
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
                    <span className="font-mono text-sm text-on-surface-variant shrink-0">
                      {selectedItem.meta}
                    </span>
                  )}
                </div>
              )}

              {/* Detail Body */}
              <div data-slot="detail-body" className="flex-1 overflow-y-auto">
                <div className="@container w-full">
                  {renderDetail ? (
                    renderDetail(selectedItem)
                  ) : children ? (
                    children
                  ) : (
                    <p className="font-sans text-base text-on-surface-variant">
                      {selectedItem.subtitle || 'No additional details.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full min-h-0">
              <div className="min-h-16 h-16 short:min-h-14 short:h-14 px-4 @md:px-6 border-b border-outline-variant hidden @2xl:flex items-center bg-surface shrink-0">
                <span className="font-heading text-base font-semibold text-on-surface-variant">
                  Details
                </span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col">
                <Empty
                  variant="unboxed"
                  icon="touch_app"
                  title={emptyDetailTitle}
                  description={emptyDetailDescription}
                  className="my-0"
                />
              </div>
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
