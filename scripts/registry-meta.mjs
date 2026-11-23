/**
 * Single source of truth for Eolas UI registry metadata shared across
 * build-registry.mjs, generate-manifest.mjs, and validate-registry.mjs.
 */

export const CATEGORY_MAP = {
  // Inputs
  button: 'inputs',
  'button-group': 'inputs',
  input: 'inputs',
  'input-group': 'inputs',
  textarea: 'inputs',
  field: 'inputs',
  fieldset: 'inputs',
  form: 'inputs',
  select: 'inputs',
  combobox: 'inputs',
  autocomplete: 'inputs',
  checkbox: 'inputs',
  'checkbox-group': 'inputs',
  radio: 'inputs',
  switch: 'inputs',
  toggle: 'inputs',
  'toggle-group': 'inputs',
  slider: 'inputs',
  'number-field': 'inputs',
  'otp-field': 'inputs',
  calendar: 'inputs',
  'selection-controls': 'inputs',
  toggles: 'inputs',

  // Overlays
  dialog: 'overlays',
  'alert-dialog': 'overlays',
  drawer: 'overlays',
  popover: 'overlays',
  menu: 'overlays',
  menubar: 'overlays',
  'context-menu': 'overlays',
  tooltip: 'overlays',
  'preview-card': 'overlays',
  command: 'overlays',
  confirmation: 'overlays',

  // Feedback
  badge: 'feedback',
  'inline-alert': 'feedback',
  toast: 'feedback',
  chip: 'feedback',
  'notification-badge': 'feedback',
  meter: 'feedback',
  progress: 'feedback',
  'progress-ring': 'feedback',
  empty: 'feedback',
  'empty-state': 'feedback',
  spinner: 'feedback',
  skeleton: 'feedback',
  'reading-progress': 'feedback',

  // Navigation
  tabs: 'navigation',
  accordion: 'navigation',
  breadcrumb: 'navigation',
  pagination: 'navigation',
  'navigation-menu': 'navigation',
  sidebar: 'navigation',
  'navigation-bar': 'navigation',
  steppers: 'navigation',
  'scroll-area': 'navigation',
  scrollspy: 'navigation',

  // Data & Layout
  card: 'layout',
  item: 'layout',
  kbd: 'layout',
  table: 'layout',
  chart: 'layout',
  separator: 'layout',
  resizable: 'layout',
  collapsible: 'layout',
  toolbar: 'layout',
  carousel: 'layout',
  avatar: 'layout',
  icon: 'layout',
  attachment: 'layout',
  'sticky-container': 'layout',
  'deferred-view': 'layout',
  'swipe-reveal': 'layout',
  sortable: 'layout',
  'text-highlight': 'layout',

  // AI & Clinical Workflows
  'chain-of-thought': 'clinical-ai',
  task: 'clinical-ai',
  plan: 'clinical-ai',
  queue: 'clinical-ai',
  'clinician-tip': 'clinical-ai',
  'chat-message': 'clinical-ai',
  'chat-message-context': 'clinical-ai',
  'prompt-input': 'clinical-ai',
  'message-scroller': 'clinical-ai',
  'code-block': 'clinical-ai',
  sources: 'clinical-ai',
  'inline-citation': 'clinical-ai',
  'suggestion-chips': 'clinical-ai',
  'model-selector': 'clinical-ai',
  tool: 'clinical-ai',
  checkpoint: 'clinical-ai',
  reasoning: 'clinical-ai',
  trace: 'clinical-ai',
  'bot-avatar': 'clinical-ai',
  'thinking-orb': 'clinical-ai',

  // Composite Blocks
  'app-shell': 'blocks',
  'approval-card': 'blocks',
  'chart-card': 'blocks',
  chat: 'blocks',
  'data-table': 'blocks',
  'delete-confirmation-dialog': 'blocks',
  'filter-toolbar': 'blocks',
  'list-detail-block': 'blocks',
  'metric-card': 'blocks',
  questionnaire: 'blocks',
  'step-wizard': 'blocks',
  'supporting-pane-block': 'blocks',
  'area-chart-card': 'blocks',
  'bar-chart-card': 'blocks',
  'line-chart-card': 'blocks',
  'pie-chart-card': 'blocks',
  'radial-chart-card': 'blocks',
  'radar-chart-card': 'blocks',

  // Motion
  'number-roll': 'motion',
  'spinning-counter': 'motion',
  'number-pop-in': 'motion',
  'text-swap': 'motion',
  'texts-reveal': 'motion',
  'shimmer-text': 'motion',
  'success-check': 'motion',
  'error-shake': 'motion',
  'view-transition': 'motion',

  // System, Utilities & Presets
  'direction-provider': 'system',
  'csp-provider': 'system',
  utils: 'system',
  sanitize: 'system',
  scheduler: 'system',
  'built-in-ai': 'system',
  'scroll-completion': 'system',
  'format-duration': 'system',
  announce: 'system',
  contrast: 'system',
  'use-horizontal-scroll-fade': 'system',
  'use-text-highlight': 'system',
  'use-web-otp': 'system',
  'view-transitions': 'system',
  theme: 'system',
  'design-md': 'system',
  'agent-rules': 'system',
  lint: 'system',
  logos: 'system',
};

export const DEPRECATED_ITEMS = {
  'selection-controls': {
    deprecatedNote:
      'Legacy re-export barrel. Prefer importing individual primitives: @/components/ui/checkbox, radio, switch.',
    replacedBy: 'checkbox, radio, switch',
  },
  toggles: {
    deprecatedNote:
      'Legacy re-export barrel. Prefer importing individual primitives: @/components/ui/toggle, toggle-group.',
    replacedBy: 'toggle, toggle-group',
  },
  steppers: {
    deprecatedNote:
      'Legacy re-export barrel. Prefer importing canonical primitive: @/components/ui/number-field.',
    replacedBy: 'number-field',
  },
  'empty-state': {
    deprecatedNote:
      'Legacy re-export barrel. Prefer importing canonical primitive: @/components/ui/empty.',
    replacedBy: 'empty',
  },
  'number-roll': {
    deprecatedNote:
      'Deprecated facade over NumberPopIn and SpinningCounter. Prefer importing @/components/ui/number-pop-in or @/components/ui/spinning-counter directly.',
    replacedBy: 'number-pop-in, spinning-counter',
  },
  'approval-card': {
    deprecatedNote:
      'Deprecated block. Use Confirmation (@/components/ui/confirmation) for [Approve] / [Deny] AI tool approval gates, or Questionnaire (@/components/blocks/questionnaire) with declarative items for choice and clarification prompts.',
    replacedBy: 'confirmation, questionnaire',
  },
  'metric-card': {
    deprecatedNote:
      'Deprecated block. Compose Card (divided <dl> stat strip), Item.Group, RadialChartCard, or Table (numeric) directly instead of metric card grids.',
    replacedBy: 'card, item, radial-chart-card, table',
  },
  'delete-confirmation-dialog': {
    deprecatedNote:
      'Deprecated wrapper block. Use AlertDialog (@/components/ui/alert-dialog) directly with controlled open state and closeOnConfirm={false} for async flows.',
    replacedBy: 'alert-dialog',
  },
};

export const PUBLIC_SYSTEM_LIBS = new Set([
  'utils',
  'sanitize',
  'scheduler',
  'built-in-ai',
  'scroll-completion',
  'format-duration',
]);

export const TRANSITIONS_DEV_MAP = {
  'error-shake':
    'Horizontal form micro-shake wrapper based on transitions.dev (12-error-state-shake.md).',
  'number-pop-in':
    'Digit pop-in animation primitive with spring overshoot and decimal stagger based on transitions.dev (02-number-pop-in.md).',
  'spinning-counter':
    'Slot-machine vertical reel roll counter with soft edge masks based on transitions.dev (26-spinning-counter.md).',
  'number-roll':
    'Tabular number transition primitive combining pop-in and spinning reels based on transitions.dev.',
  'text-swap':
    'Text state swap with directional slide and micro-blur based on transitions.dev (04-text-states-swap.md).',
  'texts-reveal':
    'Staggered text reveal with decoupled quiet fade exit based on transitions.dev (18-texts-reveal.md).',
  'shimmer-text':
    'Continuous sweeping highlight text shimmer based on transitions.dev (15-shimmer-text.md).',
  'success-check':
    'Five-layer success checkmark animation based on transitions.dev (10-success-check.md).',
  'notification-badge':
    'Popping notification badge dot and pill based on transitions.dev (03-notification-badge.md).',
};

export const DESCRIPTION_OVERRIDES = {
  // Crisp descriptions replacing generic boilerplate fallbacks (24 UI primitives)
  'alert-dialog':
    'Modal confirmation dialog requiring explicit user acknowledgment for destructive or irreversible actions, built on Base UI AlertDialog.',
  'bot-avatar':
    'Animated geometric avatar primitive for clinical AI assistants, supporting calm and active states with reduced-motion fallbacks.',
  breadcrumb:
    'Hierarchical trail navigation primitive showing current location with accessible landmarks and responsive separators.',
  card:
    'Elevated containment primitive with Header, Title, Description, Action, Content, and Footer slots following DESIGN.md surface hierarchy.',
  chart:
    'Recharts wrapper providing responsive containers, design-token color scales, accessible tooltips, and formatted legends.',
  'chat-message-context':
    'React context provider sharing message role, alignment, and display metadata across ChatMessage subcomponents.',
  'clinician-tip':
    'Clinical guidance callout displaying contextual tips and practice notes with subtle elevation and accessible high-contrast typography.',
  'context-menu':
    'Pointer-anchored secondary action menu triggered by right-click or long-press, built on Base UI ContextMenu.',
  'csp-provider':
    'Content Security Policy provider forwarding a cryptographic nonce to Base UI portals and dynamic style elements.',
  dialog:
    'Accessible modal overlay with backdrop blur, focus trapping, scroll locking, and required DialogTitle semantics on Base UI Dialog.',
  'direction-provider':
    'Reading direction (LTR/RTL) context provider synchronizing Base UI layout and keyboard behavior across descendant controls.',
  icon:
    'Material Symbols Outlined icon wrapper with standardized size tokens, fill control, ToggleIcon, and CrossFadeIcon helpers.',
  menu:
    'Single-button dropdown action menu with grouped items, radio/checkbox choices, submenus, and keyboard navigation on Base UI Menu.',
  menubar:
    'Horizontal desktop command bar grouping multiple menus with left/right arrow roving focus on Base UI Menubar.',
  'navigation-menu':
    'Top-level site and application navigation bar supporting rich flyout viewports and accessible landmarks on Base UI NavigationMenu.',
  pagination:
    'Multi-page navigation control with previous/next buttons, numbered page links, and ellipsis indicators meeting 44px touch floors.',
  popover:
    'Non-modal anchored floating panel for contextual forms, filters, or rich details, built on Base UI Popover.',
  'preview-card':
    'Hover- and focus-triggered floating card previewing linked content without navigating away, built on Base UI PreviewCard.',
  select:
    'Accessible dropdown selector with grouped items, scroll arrows, and 44px/48px touch floors on Base UI Select.',
  skeleton:
    'Loading placeholder with reduced-motion-safe shimmer and SkeletonReveal cross-fade into hydrated content.',
  sortable:
    'Accessible drag-and-drop and keyboard-reorderable list primitive powered by @dnd-kit/react with focus preservation.',
  'thinking-orb':
    'Animated visual indicator representing active AI reasoning and streaming state, with accessible reduced-motion fallback.',
  toast:
    'Transient notification banner with 4px semantic accent bar, 44x44px dismiss button, and imperative toast queue on Base UI Toast.',
  tooltip:
    'Accessible hover- and focus-triggered label explaining icon buttons or truncated controls, built on Base UI Tooltip.',

  // Complete non-truncated descriptions replacing mid-sentence "..." cuts (8 items)
  'number-roll':
    'Deprecated facade over NumberPopIn and SpinningCounter for tabular number transitions. Prefer importing NumberPopIn or SpinningCounter directly.',
  'approval-card':
    'Deprecated block. Use Confirmation for [Approve] / [Deny] AI tool approval gates, or Questionnaire for structured choice and clarification prompts.',
  'chart-card':
    'Presentational shell for data visualization cards composing Card, Badge, Skeleton, and Empty with container-query responsiveness and loading/empty states.',
  'delete-confirmation-dialog':
    'Deprecated wrapper block. Use AlertDialog directly with controlled open state and closeOnConfirm={false} for async destructive confirmations.',
  'filter-toolbar':
    'Controlled composite toolbar for tables and caseload lists composing Field, Input, Select, Button, and Chip with container queries and 44px touch targets.',
  'metric-card':
    'Deprecated block. Compose Card with a divided stat strip, Item.Group, RadialChartCard, or numeric Table directly instead of metric card grids.',
  'radar-chart-card':
    'Controlled radar chart card for multi-factor profile assessments and benchmark overlays, composing ChartCard and Chart with polar grids and legends.',
  'radial-chart-card':
    'Controlled semicircle gauge card for capacity monitoring and target achievement, composing ChartCard and Chart with semantic arc colors.',

  // Clarified descriptions for plan, queue, input-group, and item
  plan:
    'Structured multi-step clinical or agent plan primitive with collapsible overview, step status indicators, and action footer.',
  queue:
    'Ordered task and review queue primitive displaying pending, active, and completed items with keyboard-accessible row actions.',
  'input-group':
    'Compound input container uniting text fields with leading or trailing addons, icons, badges, and inline action buttons without absolute positioning.',
  item:
    'Flexible content row and media object primitive composing leading media, title, description, metadata, and trailing actions in lists and cards.',
};

const REGEX_PRECEDING_KEYWORDS = new Set([
  'return',
  'case',
  'throw',
  'in',
  'of',
  'typeof',
  'void',
  'delete',
  'await',
  'yield',
  'new',
  'else',
  'do',
]);

/**
 * Strip JS/TS line and block comments while preserving string literals,
 * template literals (including nested ${...} expressions), and regex literals.
 */
export function stripComments(src) {
  let out = '';
  let i = 0;
  const len = src.length;
  // Stack tracks template literal interpolation brace nesting depths
  const templateBraceStack = [];
  let lastNonWsChar = '';
  let lastWord = '';
  let prevWasWordChar = false;

  const recordToken = (ch) => {
    if (/[A-Za-z0-9_$]/.test(ch)) {
      lastWord = prevWasWordChar ? lastWord + ch : ch;
      prevWasWordChar = true;
      lastNonWsChar = ch;
    } else if (/\s/.test(ch)) {
      prevWasWordChar = false;
    } else {
      lastWord = '';
      prevWasWordChar = false;
      lastNonWsChar = ch;
    }
  };

  const canStartRegex = () => {
    if (!lastNonWsChar) return true;
    if (lastNonWsChar === '<') return false; // JSX closing tag </tag>
    if (REGEX_PRECEDING_KEYWORDS.has(lastWord)) return true;
    return !/[A-Za-z0-9_$)\]}]/.test(lastNonWsChar);
  };

  while (i < len) {
    const ch = src[i];
    const next = src[i + 1];

    // Single-quoted or double-quoted string literal
    if (ch === "'" || ch === '"') {
      const quote = ch;
      out += ch;
      i += 1;
      while (i < len) {
        const c = src[i];
        out += c;
        if (c === '\\' && i + 1 < len) {
          out += src[i + 1];
          i += 2;
          continue;
        }
        i += 1;
        if (c === quote) break;
      }
      lastNonWsChar = quote;
      lastWord = '';
      prevWasWordChar = false;
      continue;
    }

    // Template literal start
    if (ch === '`') {
      out += ch;
      i += 1;
      while (i < len) {
        const c = src[i];
        if (c === '\\' && i + 1 < len) {
          out += c + src[i + 1];
          i += 2;
          continue;
        }
        if (c === '$' && src[i + 1] === '{') {
          out += '${';
          i += 2;
          templateBraceStack.push(0);
          lastNonWsChar = '{';
          lastWord = '';
          prevWasWordChar = false;
          break;
        }
        out += c;
        i += 1;
        if (c === '`') {
          lastNonWsChar = '`';
          lastWord = '';
          prevWasWordChar = false;
          break;
        }
      }
      continue;
    }

    // Track braces inside template literal ${...} expressions
    if (templateBraceStack.length > 0) {
      if (ch === '{') {
        templateBraceStack[templateBraceStack.length - 1] += 1;
      } else if (ch === '}') {
        if (templateBraceStack[templateBraceStack.length - 1] === 0) {
          templateBraceStack.pop();
          out += '}';
          i += 1;
          // Resume scanning the outer template literal
          while (i < len) {
            const c = src[i];
            if (c === '\\' && i + 1 < len) {
              out += c + src[i + 1];
              i += 2;
              continue;
            }
            if (c === '$' && src[i + 1] === '{') {
              out += '${';
              i += 2;
              templateBraceStack.push(0);
              lastNonWsChar = '{';
              lastWord = '';
              prevWasWordChar = false;
              break;
            }
            out += c;
            i += 1;
            if (c === '`') {
              lastNonWsChar = '`';
              lastWord = '';
              prevWasWordChar = false;
              break;
            }
          }
          continue;
        }
        templateBraceStack[templateBraceStack.length - 1] -= 1;
      }
    }

    // Line comment
    if (ch === '/' && next === '/') {
      i += 2;
      while (i < len && src[i] !== '\n') {
        i += 1;
      }
      prevWasWordChar = false;
      continue;
    }

    // Block comment
    if (ch === '/' && next === '*') {
      i += 2;
      out += ' ';
      while (i < len) {
        if (src[i] === '*' && src[i + 1] === '/') {
          i += 2;
          break;
        }
        if (src[i] === '\n') out += '\n';
        i += 1;
      }
      prevWasWordChar = false;
      continue;
    }

    // Potential regex literal (single-line only)
    if (ch === '/' && next !== '/' && next !== '*' && canStartRegex()) {
      let j = i + 1;
      let inCharClass = false;
      let closed = false;
      while (j < len && src[j] !== '\n' && src[j] !== '\r') {
        if (src[j] === '\\' && j + 1 < len) {
          j += 2;
          continue;
        }
        if (src[j] === '[') inCharClass = true;
        else if (src[j] === ']') inCharClass = false;
        else if (src[j] === '/' && !inCharClass) {
          closed = true;
          j += 1;
          break;
        }
        j += 1;
      }
      if (closed) {
        out += src.slice(i, j);
        i = j;
        lastNonWsChar = '/';
        lastWord = '';
        prevWasWordChar = false;
        continue;
      }
    }

    out += ch;
    recordToken(ch);
    i += 1;
  }

  return out;
}
