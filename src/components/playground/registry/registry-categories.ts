import { CategoryMeta } from './types';

export const REGISTRY_CATEGORIES: CategoryMeta[] = [
  {
    id: 'inputs',
    title: 'Forms & Inputs',
    description: 'Accessible interactive form controls, buttons, toggles, and selectors built on Base UI',
    icon: 'edit_note',
  },
  {
    id: 'overlays',
    title: 'Overlays & Dialogs',
    description: 'Accessible modal dialogs, drawers, popovers, menus, and context triggers',
    icon: 'layers',
  },
  {
    id: 'feedback',
    title: 'Feedback & Status',
    description: 'High-contrast alerts, toasts, progress indicators, chips, and empty states',
    icon: 'notifications',
  },
  {
    id: 'navigation',
    title: 'Navigation & Wayfinding',
    description: 'Tabs, accordions, breadcrumbs, pagination, nav menus, and clinical sidebars',
    icon: 'explore',
  },
  {
    id: 'layout',
    title: 'Data & Layout',
    description: 'Tables, cards, data visualizations, resizable panes, and layout structures',
    icon: 'dashboard',
  },
  {
    id: 'clinical-ai',
    title: 'AI & Clinical Workflows',
    description: 'Thinking orbs, bot avatars, reasoning trees, trace logs, and clinical assistant UI',
    icon: 'psychology',
  },
  {
    id: 'blocks',
    title: 'Composite Blocks',
    description: 'Pre-assembled domain-specific clinical UI compositions and workflows',
    icon: 'widgets',
  },
  {
    id: 'motion',
    title: 'Motion & Micro-interactions',
    description: 'Accessible motion primitives, counter rolls, shimmer states, and micro-delights',
    icon: 'animation',
  },
  {
    id: 'system',
    title: 'System & Providers',
    description: 'Text direction, CSP compliance, and contextual system providers',
    icon: 'settings',
  },
];
