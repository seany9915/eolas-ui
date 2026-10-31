import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { InlineAlert } from '@/components/ui/inline-alert';
import { TabsRoot, TabsList, Tab, TabsPanel } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DirectionProvider } from '@/components/ui/direction-provider';
import { RegistryEntry, ViewportMode, ComponentDemoProps } from './types';

export interface RegistryCanvasProps {
  entry: RegistryEntry;
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
  direction: 'ltr' | 'rtl';
  onDirectionToggle: () => void;
  demoComponent?: React.ComponentType<ComponentDemoProps>;
  onBackToCatalog: () => void;
  className?: string;
}

export const RegistryCanvas: React.FC<RegistryCanvasProps> = ({
  entry,
  viewport,
  onViewportChange,
  direction,
  onDirectionToggle,
  demoComponent: DemoComponent,
  onBackToCatalog,
  className,
}) => {
  const [copiedType, setCopiedType] = React.useState<'import' | 'cli' | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>('preview');

  const copyToClipboard = async (text: string, type: 'import' | 'cli') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const importStatement = entry.tier === 'block'
    ? `import { ${entry.title.replace(/\s+/g, '')} } from '@/components/blocks/${entry.name}';`
    : `import { ${entry.title.replace(/\s+/g, '')} } from '@/components/ui/${entry.name}';`;

  const viewportWidthClass = {
    mobile: 'max-w-[375px] mx-auto',
    tablet: 'max-w-[768px] mx-auto',
    desktop: 'max-w-[1024px] mx-auto',
    full: 'w-full',
  }[viewport];

  const viewportLabel = {
    mobile: 'Mobile (375px)',
    tablet: 'Tablet (768px)',
    desktop: 'Desktop (1024px)',
    full: 'Full Width',
  }[viewport];

  return (
    <section
      aria-labelledby="component-canvas-heading"
      className={cn('w-full space-y-6', className)}
    >
      {/* Component Header Bar */}
      <div className="bg-surface rounded-xl border border-outline-variant p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToCatalog}
                className="text-xs px-2.5 h-7 -ml-2 text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="arrow_back" size="xs" className="mr-1" />
                Registry
              </Button>
              <span className="text-outline-variant">/</span>
              <span className="font-mono text-xs text-on-surface-variant capitalize">{entry.category}</span>
              <span className="text-outline-variant">/</span>
              <h2 id="component-canvas-heading" className="font-heading text-lg sm:text-xl font-bold text-on-surface">
                {entry.title}
              </h2>

              {/* Badges - Following DESIGN.md chips */}
              <Chip
                label={entry.tier === 'block' ? 'Composite Block' : 'Primitive'}
                pattern={entry.tier === 'block' ? 'secondary-container' : 'primary-container'}
                colorRole={entry.tier === 'block' ? 'secondary' : 'primary'}
                size="sm"
              />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface text-on-surface-variant font-medium border border-outline-variant">
                {entry.basePrimitive}
              </span>
              {entry.isDeprecated && (
                <Chip
                  label="Legacy Re-export"
                  pattern="warning-container"
                  colorRole="warning"
                  size="sm"
                  icon="warning"
                />
              )}
            </div>

            <p className="font-sans text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              {entry.description}
            </p>
          </div>

          {/* Quick Copy Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outlined"
              onClick={() => copyToClipboard(importStatement, 'import')}
              className="text-xs font-mono h-9 px-3"
              title="Copy React import statement"
            >
              <Icon name={copiedType === 'import' ? 'check' : 'content_copy'} size="xs" className="mr-1.5" />
              {copiedType === 'import' ? 'Copied Import' : 'Copy Import'}
            </Button>
            <Button
              size="sm"
              variant="tonal"
              onClick={() => copyToClipboard(entry.shadcnCommand || `npx shadcn add @seany9915/eolas-ui/${entry.name}`, 'cli')}
              className="text-xs font-mono h-9 px-3"
              title="Copy shadcn CLI command"
            >
              <Icon name={copiedType === 'cli' ? 'check' : 'terminal'} size="xs" className="mr-1.5" />
              {copiedType === 'cli' ? 'Copied CLI' : 'shadcn add'}
            </Button>
          </div>
        </div>

        {/* Deprecation Notice if applicable */}
        {entry.isDeprecated && (
          <div className="mt-4">
            <InlineAlert
              role="warning"
              title="Legacy Drift & Retirement Notice"
            >
              {entry.deprecatedNote || 'This omnibus re-export exists for backward compatibility. Please migrate to direct primitives.'}
            </InlineAlert>
          </div>
        )}

        {/* Canvas Toolbar & Tabs via Base UI Tabs and ToggleGroup */}
        <div className="mt-5 pt-4 border-t border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Base UI Tabs List */}
          <TabsRoot
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as string)}
            variant="segmented"
            size="sm"
          >
            <TabsList>
              <Tab value="preview">
                <Icon name="visibility" size="xs" className="mr-1.5" />
                Preview & Sandbox
              </Tab>
              <Tab value="code">
                <Icon name="code" size="xs" className="mr-1.5" />
                Code & Usage
              </Tab>
              <Tab value="contract">
                <Icon name="verified" size="xs" className="mr-1.5" />
                Contract & A11y
              </Tab>
            </TabsList>
          </TabsRoot>

          {/* Viewport & Direction Controls via Base UI ToggleGroup */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Viewport Switcher */}
            <ToggleGroup
              type="single"
              value={viewport}
              onValueChange={(val) => {
                if (val) onViewportChange(val as ViewportMode);
              }}
              variant="segmented"
              size="sm"
              aria-label="Responsive viewport mode"
            >
              <ToggleGroupItem value="mobile" aria-label="Mobile viewport (375px)" title="Mobile (375px)">
                <Icon name="smartphone" size="xs" />
              </ToggleGroupItem>
              <ToggleGroupItem value="tablet" aria-label="Tablet viewport (768px)" title="Tablet (768px)">
                <Icon name="tablet_mac" size="xs" />
              </ToggleGroupItem>
              <ToggleGroupItem value="desktop" aria-label="Desktop viewport (1024px)" title="Desktop (1024px)">
                <Icon name="desktop_windows" size="xs" />
              </ToggleGroupItem>
              <ToggleGroupItem value="full" aria-label="Full width viewport" title="Full Width">
                <Icon name="fullscreen" size="xs" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Direction Toggle */}
            <Button
              size="sm"
              variant="outlined"
              onClick={onDirectionToggle}
              className="h-8 px-2.5 text-xs font-mono"
              title="Toggle LTR / RTL text direction"
            >
              <Icon name="swap_horiz" size="xs" className="mr-1" />
              {direction.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area via Base UI TabsPanels */}
      <TabsRoot value={activeTab} onValueChange={(val) => setActiveTab(val as string)}>
        <TabsPanel value="preview">
          <div className="space-y-3">
            {/* Sandbox Ruler & Semantic Viewport Indicator - NO static status dots */}
            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant px-1">
              <span className="flex items-center gap-1.5">
                <Icon name="crop_free" size="xs" className="text-primary" />
                <span>Preview: <strong>{viewportLabel}</strong></span>
              </span>
              <span>Direction: <strong>{direction.toUpperCase()}</strong></span>
            </div>

            {/* Preview Canvas */}
            <div className="border border-outline-variant rounded-xl bg-surface p-4 sm:p-8 shadow-xs overflow-hidden min-h-[420px] flex items-center justify-center">
              <div className={cn('transition-[max-width] duration-200 ease-in-out w-full', viewportWidthClass)}>
                <DirectionProvider direction={direction}>
                  {DemoComponent ? (
                    <DemoComponent viewport={viewport} direction={direction} />
                  ) : (
                    <div className="py-12 px-4 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center mx-auto">
                        <Icon name="widgets" size="md" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-heading text-base font-bold text-on-surface">
                          {entry.title} Component
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant max-w-md mx-auto">
                          Ready for clinical workflows. Defined at <code className="font-mono text-primary">{entry.sourcePath}</code>.
                        </p>
                      </div>
                      <div className="bg-surface-container rounded-lg p-3 max-w-md mx-auto font-mono text-xs text-left border border-outline-variant">
                        {importStatement}
                      </div>
                    </div>
                  )}
                </DirectionProvider>
              </div>
            </div>
          </div>
        </TabsPanel>

        <TabsPanel value="code">
          <div className="max-w-4xl mx-auto space-y-6 pt-2">
            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
                <Icon name="download" size="sm" className="text-primary" />
                Installation via CLI
              </h3>
              <p className="font-sans text-xs text-on-surface-variant">
                Install this component into your project with the shadcn CLI registry:
              </p>
              <div className="bg-neutral text-on-neutral p-3.5 rounded-lg font-mono text-xs flex items-center justify-between">
                <span>{entry.shadcnCommand || `npx shadcn add @seany9915/eolas-ui/${entry.name}`}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(entry.shadcnCommand || `npx shadcn add @seany9915/eolas-ui/${entry.name}`, 'cli')}
                  className="text-on-neutral hover:bg-neutral-container/20 h-7 px-2 text-xs"
                >
                  <Icon name={copiedType === 'cli' ? 'check' : 'content_copy'} size="xs" />
                </Button>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
                <Icon name="code" size="sm" className="text-primary" />
                Import & Usage
              </h3>
              <div className="bg-surface-container p-3.5 rounded-lg font-mono text-xs border border-outline-variant">
                {importStatement}
              </div>
              <div className="font-sans text-xs text-on-surface-variant space-y-2">
                <p>Source file location:</p>
                <code className="block bg-surface-container px-2.5 py-1.5 rounded text-primary font-mono text-xs border border-outline-variant">
                  {entry.sourcePath}
                </code>
              </div>
            </div>

            {entry.dependencies && entry.dependencies.length > 0 && (
              <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-3">
                <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
                  <Icon name="extension" size="sm" className="text-primary" />
                  Package Dependencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {entry.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="font-mono text-xs px-2.5 py-1 rounded-md bg-surface-container text-on-surface border border-outline-variant"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsPanel>

        <TabsPanel value="contract">
          <div className="max-w-4xl mx-auto space-y-6 pt-2">
            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
                <Icon name="gavel" size="sm" className="text-primary" />
                Core Contract & Taxonomy
              </h3>
              {entry.taxonomy && entry.taxonomy.length > 0 ? (
                <ul className="space-y-2 font-sans text-xs text-on-surface-variant list-disc pl-5">
                  {entry.taxonomy.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-xs text-on-surface-variant">
                  Follows DESIGN.md tokens, Base UI polymorphic render/slot architecture, and zero-business-logic primitive isolation.
                </p>
              )}
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-3">
              <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
                <Icon name="accessibility_new" size="sm" className="text-primary" />
                Accessibility & Design Law
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 rounded-lg bg-surface-container border border-outline-variant">
                  <span className="font-bold text-on-surface block mb-1">WCAG 2.2 AA Contrast:</span>
                  <span className="text-on-surface-variant">
                    All text and interactive borders meet 4.5:1 / 3:1 contrast ratios across clinical lighting conditions.
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-surface-container border border-outline-variant">
                  <span className="font-bold text-on-surface block mb-1">Touch Target Compliance:</span>
                  <span className="text-on-surface-variant">
                    Complies with WCAG 2.2 SC 2.5.8 Target Size with minimum 44x44px touch envelopes for clinical tablets and mobile devices.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsPanel>
      </TabsRoot>
    </section>
  );
};
