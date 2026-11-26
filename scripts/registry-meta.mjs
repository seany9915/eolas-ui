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
  'chart-card': 'blocks',
  chat: 'blocks',
  'data-table': 'blocks',
  'filter-toolbar': 'blocks',
  'list-detail-block': 'blocks',
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
  'use-reduced-motion': 'system',
  'use-text-highlight': 'system',
  'use-web-otp': 'system',
  'view-transitions': 'system',
  theme: 'system',
  'design-md': 'system',
  'agent-rules': 'system',
  lint: 'system',
  logos: 'system',
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

  // Complete non-truncated descriptions replacing mid-sentence "..." cuts (4 items)
  'chart-card':
    'Presentational shell for data visualization cards composing Card, Badge, Skeleton, and Empty with container-query responsiveness and loading/empty states.',
  'filter-toolbar':
    'Controlled composite toolbar for tables and caseload lists composing Field, Input, Select, Button, and Chip with container queries and 44px touch targets.',
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

  // Replaced short stub descriptions across UI primitives, composite blocks, and utilities
  accordion:
    'Expandable and collapsible content sections supporting single or multiple open panels and keyboard navigation on Base UI Accordion.',
  announce:
    'Imperative ARIA live-region announcer utility and component for conveying dynamic status updates to screen readers.',
  attachment:
    'File attachment display and management primitive with file-type metadata, previews, upload progress, and remove actions.',
  autocomplete:
    'Filterable text input with live popup suggestions, clear button, and grouped results built on Base UI Autocomplete.',
  avatar:
    'Circular user or clinician identity badge displaying photography with automatic initials or icon fallback on Base UI Avatar.',
  badge:
    'Compact high-contrast status and category pill enforcing filled, outline, and soft-wash clinical palette rules.',
  button:
    'Interactive push button with filled, soft, outline, and text variants, 44px minimum touch targets, and reduced-motion loading feedback on Base UI Button.',
  'button-group':
    'Segmented horizontal or vertical container joining adjacent buttons, inputs, and addons with shared borders and focus layering.',
  calendar:
    'Single-date and date-range month calendar built on React DayPicker with 44px day cells, month selectors, and keyboard navigation.',
  'chain-of-thought':
    'Collapsible multi-step AI reasoning trace showing step status, search results, sources, and elapsed timings.',
  'chat-message':
    'Structured conversation message row supporting user, assistant, and system alignments, markdown prose, actions, and status metadata.',
  checkbox:
    'Accessible binary and indeterminate selection control with 44px touch target, error state, and keyboard toggle on Base UI Checkbox.',
  checkpoint:
    'Inline conversation milestone divider marking saved thread states with a one-click restore trigger.',
  'code-block':
    'Syntax-styled code viewer supporting language labels, optional line numbers, copy button, and scrollable horizontal overflow.',
  collapsible:
    'Accessible disclosure container with animated panel height and reduced-motion fallback built on Base UI Collapsible.',
  combobox:
    'Searchable single- and multi-select dropdown with chips, grouped options, and clear control built on Base UI Combobox.',
  command:
    'Modal keyboard command palette and fuzzy filter list combining cmdk search with accessible Base UI Dialog focus management.',
  confirmation:
    'Inline clinical or tool approval prompt requesting explicit accept or reject confirmation with outcome feedback.',
  'deferred-view':
    'Progressive rendering wrapper deferring heavy offscreen subtrees until idle or visible in the viewport.',
  drawer:
    'Viewport-edge slide-over panel with backdrop blur, focus trapping, and logical RTL-aware anchoring on Base UI Drawer.',
  empty:
    'Centered empty and zero-data placeholder displaying a functional icon, plain-English heading, guidance text, and optional action.',
  field:
    'Form field wrapper binding accessible labels, descriptions, validation errors, and invalid state via Base UI Field.',
  fieldset:
    'Accessible group container with semantic legend and shared description styling on Base UI Fieldset.',
  form:
    'Client and schema validation form root coordinating field submission state and error summaries via Base UI Form.',
  'format-duration':
    'Locale-safe duration formatter and hook converting seconds or milliseconds into concise human-readable clinical labels.',
  'inline-alert':
    'Rectangular in-flow feedback banner with a 4px semantic start accent bar, functional icon, description, and optional dismiss control.',
  'inline-citation':
    'Superscript inline source marker and hoverable citation card linking generated claims to verified references.',
  input:
    'Single-line text input supporting 44px/48px touch floors, error borders, and clear invalid messaging on Base UI Input.',
  kbd:
    'Compact monospace keycap indicator for displaying keyboard shortcuts inside menus, tooltips, and action buttons.',
  'message-scroller':
    'Auto-pinning conversation scroll viewport with smooth stick-to-bottom behavior and a jump-to-latest button when scrolled up.',
  meter:
    'Accessible scalar measurement bar showing current values within a bounded range and high-contrast fill on Base UI Meter.',
  'model-selector':
    'Popover-backed AI model picker with capability badges, search filtering, and keyboard selection.',
  'number-field':
    'Numeric stepper input with increment/decrement buttons, scrub area, and keyboard step controls on Base UI NumberField.',
  'otp-field':
    'Segmented one-time passcode input supporting paste splitting, arrow navigation, and WebOTP autocomplete on Base UI OTPField.',
  progress:
    'Linear task progress bar supporting determinate percentages and reduced-motion indeterminate sweeps on Base UI Progress.',
  'progress-ring':
    'Circular SVG progress gauge displaying task completion percentage with tabular center numerals on Base UI Progress.',
  'prompt-input':
    'Composer bar for AI prompts with auto-sizing textarea, file attachments, IME-safe Enter submission, character limits, and action controls.',
  'reading-progress':
    'Fixed viewport progress indicator tracking scroll depth through long clinical notes or documents.',
  reasoning:
    'Expandable AI thought-process container displaying streaming durations and collapsible reasoning text.',
  sanitize:
    'DOMParser-based HTML sanitizer utility and React component blocking unsafe scripts, handlers, and dangerous URLs.',
  scheduler:
    'Cooperative task scheduling and yielding helpers keeping main-thread interactions responsive during heavy updates.',
  'scroll-area':
    'Custom-styled scrollable container with unobtrusive auto-hiding scrollbars and focus-safe viewport padding on Base UI ScrollArea.',
  'scroll-completion':
    'Programmatic smooth-scroll helper resolving cleanly when animated scrolling reaches its target or is cancelled.',
  scrollspy:
    'Intersection-driven section tracker highlighting active navigation links and syncing hash navigation.',
  separator:
    'Horizontal or vertical hairline divider with accessible orientation semantics on Base UI Separator.',
  slider:
    'Single-thumb and range value slider with keyboard steps, tick marks, and tabular value readouts on Base UI Slider.',
  sources:
    'Collapsible footnote and reference tray listing retrieved clinical documents, favicons, and external links.',
  spinner:
    'Minimal SVG loading indicator with slowed reduced-motion fallback and screen-reader status text.',
  'sticky-container':
    'IntersectionObserver-backed sticky header wrapper applying ambient elevation once content scrolls beneath it.',
  'suggestion-chips':
    'Keyboard-navigable prompt suggestion list supporting horizontal scrolling, wrapping rows, and single-click submission.',
  'swipe-reveal':
    'Touch swipeable row revealing trailing actions alongside an accessible toggle button for pointer and keyboard users.',
  switch:
    'Accessible two-state toggle switch with 44px hit target, labels, and reduced-motion thumb slide on Base UI Switch.',
  table:
    'Semantic data table primitives with tabular numeric alignment, hover states, selected rows, and responsive horizontal overflow.',
  tabs:
    'Tabbed view switcher in line, pills, and contained styles with animated selection indicator on Base UI Tabs.',
  task:
    'Expandable task execution item displaying step label, completion badge, and nested subtask trace.',
  'text-highlight':
    'Inline text highlighter wrapping matched search terms with accessible <mark> contrast.',
  textarea:
    'Multi-line text input with clean focus rings, error states, and consistent clinical typography tokens.',
  toggle:
    'Stateful two-state pressed button for toolbar formatting and filter switches on Base UI Toggle.',
  'toggle-group':
    'Single- or multi-select grouped toggle control in segmented and outline styles on Base UI ToggleGroup.',
  tool:
    'Collapsible AI tool call inspector showing invocation status, formatted input parameters, output payloads, and errors.',
  toolbar:
    'Roving-focus horizontal action strip grouping buttons, toggles, and separators on Base UI Toolbar.',
  trace:
    'Compact execution trace container summarizing AI agent tool calls, timing, and expandable step details.',
  'use-text-highlight':
    'React hook splitting strings into highlighted and plain segments for live search filtering.',
  'use-web-otp':
    'React hook subscribing to navigator.credentials WebOTP one-time verification codes with abort cleanup.',
  'view-transition':
    'Declarative React 19 view-transition wrapper and trigger applying temporary transition names during updates.',
  'view-transitions':
    'React hook and helper wrapping document.startViewTransition with graceful reduced-motion and fallback handling.',
  'app-shell':
    'Controlled responsive workspace shell composing collapsible sidebar navigation, mobile drawer, header bar, and main viewport.',
  chat:
    'Controlled clinical AI conversation block uniting MessageScroller, ChatMessage, Sources, Trace, Confirmation, and PromptInput.',
  'data-table':
    'Controlled sortable, filterable, and selectable data table block powered by @tanstack/react-table with pagination and bulk actions.',
  'list-detail-block':
    'Controlled two-pane master-detail workspace adapting between side-by-side split panes and mobile drill-down navigation.',
  questionnaire:
    'Controlled multi-question assessment block with choice controls, validation summaries, and conditional step progression.',
  'step-wizard':
    'Controlled multi-step workflow block with step sidebar, validation gates, hidden until-found preservation, and review actions.',
  'supporting-pane-block':
    'Controlled main workspace plus collapsible right-hand context pane for clinical references, notes, or AI assistance.',
};

/**
 * Extract internal registry dependency names (@/components/ui/*, @/components/blocks/*, @/lib/*, relative ./ or ../ui/)
 * from comment-stripped TypeScript/JSX source.
 */
export function extractInternalRegistryImports(
  content,
  itemType,
  { fs: fsImpl = null, libDir = null, excludeName = null } = {}
) {
  const clean = stripComments(content);
  const refs = new Set();
  const patterns = [
    /(?:import|export)\s+(?:type\s+)?(?:[^;'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const re of patterns) {
    for (const match of clean.matchAll(re)) {
      const spec = match[1];
      if (!spec) continue;
      let refName = null;

      if (spec.startsWith('@/components/ui/')) {
        refName = spec.slice('@/components/ui/'.length).replace(/\.(tsx?|jsx?|mjs)$/, '');
      } else if (spec.startsWith('@/components/blocks/')) {
        refName = spec.slice('@/components/blocks/'.length).split('/')[0].replace(/\.(tsx?|jsx?|mjs)$/, '');
      } else if (spec.startsWith('@/lib/')) {
        const libName = spec.slice('@/lib/'.length).replace(/\.(tsx?|jsx?|mjs)$/, '');
        if (!fsImpl || !libDir || fsImpl.existsSync(`${libDir}/${libName}.ts`)) {
          refName = libName;
        }
      } else if (spec.startsWith('../../lib/')) {
        const libName = spec.slice('../../lib/'.length).replace(/\.(tsx?|jsx?|mjs)$/, '');
        if (!fsImpl || !libDir || fsImpl.existsSync(`${libDir}/${libName}.ts`)) {
          refName = libName;
        }
      } else if (spec.startsWith('../ui/')) {
        refName = spec.slice('../ui/'.length).split('/')[0].replace(/\.(tsx?|jsx?|mjs)$/, '');
      } else if (
        spec.startsWith('./') &&
        (itemType === 'registry:ui' || itemType === 'registry:block' || itemType === 'registry:lib')
      ) {
        const base = spec.slice(2).split('/')[0].replace(/\.(tsx?|jsx?|mjs)$/, '');
        if (itemType !== 'registry:lib' || !fsImpl || !libDir || fsImpl.existsSync(`${libDir}/${base}.ts`)) {
          refName = base;
        }
      }

      if (refName && refName !== excludeName) {
        refs.add(refName);
      }
    }
  }

  return refs;
}

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
