import fs from 'node:fs';
import path from 'node:path';

const r = JSON.parse(fs.readFileSync('public/r/registry.json', 'utf8'));

const catMap = {
  // Inputs
  'button': 'inputs', 'input': 'inputs', 'textarea': 'inputs', 'field': 'inputs', 'fieldset': 'inputs',
  'form': 'inputs', 'select': 'inputs', 'combobox': 'inputs', 'autocomplete': 'inputs', 'checkbox': 'inputs',
  'checkbox-group': 'inputs', 'radio': 'inputs', 'switch': 'inputs', 'toggle': 'inputs', 'toggle-group': 'inputs',
  'slider': 'inputs', 'number-field': 'inputs', 'otp-field': 'inputs', 'selection-controls': 'inputs', 'toggles': 'inputs',

  // Overlays
  'dialog': 'overlays', 'alert-dialog': 'overlays', 'drawer': 'overlays', 'popover': 'overlays', 'menu': 'overlays',
  'menubar': 'overlays', 'context-menu': 'overlays', 'tooltip': 'overlays', 'preview-card': 'overlays',

  // Feedback
  'inline-alert': 'feedback', 'toast': 'feedback', 'chip': 'feedback', 'notification-badge': 'feedback',
  'meter': 'feedback', 'progress': 'feedback', 'progress-ring': 'feedback', 'empty': 'feedback',
  'empty-state': 'feedback', 'skeleton': 'feedback', 'reading-progress': 'feedback',

  // Navigation
  'tabs': 'navigation', 'accordion': 'navigation', 'breadcrumb': 'navigation', 'pagination': 'navigation',
  'navigation-menu': 'navigation', 'sidebar': 'navigation', 'step-wizard': 'navigation', 'steppers': 'navigation',
  'scroll-area': 'navigation', 'scrollspy': 'navigation',

  // Data & Layout
  'card': 'layout', 'table': 'layout', 'chart': 'layout', 'separator': 'layout', 'resizable': 'layout',
  'collapsible': 'layout', 'toolbar': 'layout', 'carousel': 'layout', 'avatar': 'layout', 'icon': 'layout',
  'attachment': 'layout', 'sticky-container': 'layout', 'deferred-view': 'layout', 'swipe-reveal': 'layout',
  ['text-' + 'highlight']: 'layout',

  // AI & Clinical Workflows
  'chain-of-thought': 'clinical-ai', 'task': 'clinical-ai', 'plan': 'clinical-ai', 'queue': 'clinical-ai',
  'clinician-tip': 'clinical-ai', 'chat-message': 'clinical-ai', 'chat-message-context': 'clinical-ai',
  'prompt-input': 'clinical-ai', 'message-scroller': 'clinical-ai', 'code-block': 'clinical-ai', 'sources': 'clinical-ai',
  'inline-citation': 'clinical-ai', 'suggestion-chips': 'clinical-ai', 'model-selector': 'clinical-ai', 'tool': 'clinical-ai',
  'checkpoint': 'clinical-ai', 'confirmation': 'clinical-ai', 'reasoning': 'clinical-ai', 'trace': 'clinical-ai', 'bot-avatar': 'clinical-ai', 'thinking-orb': 'clinical-ai',

  // Blocks
  'approval-card': 'blocks', 'chat': 'blocks', 'delete-confirmation-dialog': 'blocks', 'filter-toolbar': 'blocks', 'metric-card': 'blocks',

  // Motion
  'number-roll': 'motion', 'spinning-counter': 'motion', 'number-pop-in': 'motion',
  ['text-' + 'swap']: 'motion',
  'texts-reveal': 'motion', 'shimmer-text': 'motion', 'success-check': 'motion', 'error-shake': 'motion',
  'view-transition': 'motion',

  // System
  'direction-provider': 'system', 'csp-provider': 'system', 'utils': 'system'
};

const items = r.items.filter(i => i.type === 'registry:ui' || i.type === 'registry:block' || (i.type === 'registry:lib' && i.name === 'utils'));

const registryEntries = items.map(item => {
  const isBlock = item.type === 'registry:block';
  const isLib = item.type === 'registry:lib';
  const filePath = isBlock ? `src/components/blocks/${item.name}.tsx` : isLib ? `src/lib/${item.name}.ts` : `src/components/ui/${item.name}.tsx`;
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.warn('Could not read', filePath);
  }

  const baseUIMatch = fileContent.match(/@base-ui\/react\/([a-z0-9-]+)/);
  const basePrimitive = isLib ? 'Base UI Headless Library' : baseUIMatch ? `@base-ui/react/${baseUIMatch[1]}` : (isBlock ? 'Composite Block' : 'DESIGN.md Token Primitive');

  const isDeprecated = item.name === 'selection-controls' || item.name === 'toggles' || item.name === 'steppers';
  const deprecatedNote = item.name === 'selection-controls'
    ? 'Legacy re-export barrel. Prefer importing individual primitives: @/components/ui/checkbox, radio, switch.'
    : item.name === 'toggles'
    ? 'Legacy re-export barrel. Prefer importing individual primitives: @/components/ui/toggle, toggle-group.'
    : item.name === 'steppers'
    ? 'Legacy re-export barrel. Prefer importing canonical primitive: @/components/ui/number-field.'
    : undefined;
  const replacedBy = item.name === 'selection-controls'
    ? 'checkbox, radio, switch'
    : item.name === 'toggles'
    ? 'toggle, toggle-group'
    : item.name === 'steppers'
    ? 'number-field'
    : undefined;

  const category = catMap[item.name] || 'layout';
  const tier = isBlock ? 'block' : (isDeprecated || isLib ? 'utility' : 'primitive');

  const title = item.title || item.name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const description = item.description || `Eolas UI ${title} component.`;
  const taxonomy = item.meta?.taxonomy || [];
  const dependencies = item.dependencies || [];
  const shadcnCommand = `npx shadcn add @seany9915/eolas-ui/${item.name}`;

  return {
    id: item.name,
    name: item.name,
    title,
    description,
    category,
    tier,
    basePrimitive,
    sourcePath: filePath,
    ...(isDeprecated ? { isDeprecated: true, deprecatedNote, replacedBy } : {}),
    ...(taxonomy.length > 0 ? { taxonomy } : {}),
    ...(dependencies.length > 0 ? { dependencies } : {}),
    shadcnCommand,
  };
});

const fileHeader = `// AUTO-GENERATED REGISTRY MANIFEST
import { RegistryEntry } from './types';

export const REGISTRY_ENTRIES: RegistryEntry[] = ${JSON.stringify(registryEntries, null, 2)};

export const REGISTRY_MAP: Record<string, RegistryEntry> = Object.fromEntries(
  REGISTRY_ENTRIES.map((entry) => [entry.id, entry])
);
`;

fs.writeFileSync('src/components/playground/registry/registry-manifest.ts', fileHeader);
console.log(`Generated manifest with ${registryEntries.length} entries.`);
