/**
 * Imperative screen-reader live-region announcer.
 *
 * - Uses explicit `[aria-live]` attributes so Base UI's `markOthers()` (Dialog/Drawer/Sheet)
 *   exempts the region from `aria-hidden="true"`.
 * - Uses `popover="manual"` (when supported) and re-promotes via `hidePopover()` -> `showPopover()`
 *   so announcements remain reachable when a native `<dialog>.showModal()` is open.
 * - Alternates a trailing non-breaking space on consecutive identical messages so VoiceOver/NVDA
 *   reliably announce repeated actions (e.g. "Copied to clipboard").
 */

export type AnnouncePriority = 'polite' | 'assertive';

const regions: Partial<Record<AnnouncePriority, HTMLElement>> = {};
let clearTimer: ReturnType<typeof setTimeout> | null = null;
let announceTimer: ReturnType<typeof setTimeout> | null = null;
let lastMessage = '';
let useNbspToggle = false;

function getOrCreateRegion(priority: AnnouncePriority): {
  node: HTMLElement;
  isNew: boolean;
} {
  const existing = regions[priority];
  if (existing && document.body.contains(existing)) {
    return { node: existing, isNew: false };
  }

  const node = document.createElement('div');
  node.setAttribute('aria-live', priority);
  node.setAttribute('aria-atomic', 'true');
  node.setAttribute('data-live-announcer', 'true');

  if ('popover' in HTMLElement.prototype) {
    node.setAttribute('popover', 'manual');
  }

  Object.assign(node.style, {
    position: 'fixed',
    inset: '0',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
    background: 'transparent',
    pointerEvents: 'none',
  });

  document.body.appendChild(node);
  regions[priority] = node;
  return { node, isNew: true };
}

function promoteToTopLayer(node: HTMLElement): void {
  if (typeof node.showPopover !== 'function') return;
  try {
    if (node.matches(':popover-open')) {
      node.hidePopover?.();
    }
    node.showPopover();
  } catch {
    // Ignore when Popover API is unsupported or blocked.
  }
}

export function announce(
  message: string,
  priority: AnnouncePriority = 'polite'
): void {
  if (typeof document === 'undefined' || !document.body || !message.trim()) return;

  if (announceTimer) clearTimeout(announceTimer);
  if (clearTimer) clearTimeout(clearTimer);

  const { node, isNew } = getOrCreateRegion(priority);
  promoteToTopLayer(node);

  const otherPriority: AnnouncePriority =
    priority === 'assertive' ? 'polite' : 'assertive';
  if (regions[otherPriority]) {
    regions[otherPriority]!.textContent = '';
  }

  if (message === lastMessage) {
    useNbspToggle = !useNbspToggle;
  } else {
    useNbspToggle = false;
    lastMessage = message;
  }
  const payload = useNbspToggle ? `${message}\u00A0` : message;

  // Newly mounted live regions need ~60ms for AT tree registration;
  // existing regions only need a brief clear-then-set gap.
  // Do NOT call hidePopover()/showPopover() inside the timeout or VoiceOver/NVDA
  // will drop the synchronous textContent mutation on display:none -> block.
  node.textContent = '';
  const delay = isNew ? 60 : 16;

  announceTimer = setTimeout(() => {
    node.textContent = payload;

    clearTimer = setTimeout(() => {
      node.textContent = '';
      lastMessage = '';
    }, 3000);
  }, delay);
}
