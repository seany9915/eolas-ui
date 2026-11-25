import * as React from 'react';

export type ComponentCategory =
  | 'inputs'
  | 'overlays'
  | 'feedback'
  | 'navigation'
  | 'layout'
  | 'clinical-ai'
  | 'blocks'
  | 'motion'
  | 'system';

export interface CategoryMeta {
  id: ComponentCategory;
  title: string;
  description: string;
  icon: string;
}

export type ComponentTier = 'primitive' | 'block' | 'utility';

export interface RegistryEntry {
  id: string;
  name: string;
  title: string;
  description: string;
  category: ComponentCategory;
  tier: ComponentTier;
  basePrimitive: string;
  platformReference?: string;
  sourcePath: string;
  taxonomy?: string[];
  dependencies?: string[];
  importStatement?: string;
  shadcnCommand?: string;
  eolasCommand?: string;
  codeSnippet?: string;
  wcagNotes?: string;
}

export type ViewportMode = 'mobile' | 'tablet' | 'desktop' | 'full';

export interface ComponentDemoProps {
  viewport: ViewportMode;
  direction: 'ltr' | 'rtl';
}

export type ComponentDemoMap = Record<string, React.ComponentType<ComponentDemoProps>>;
