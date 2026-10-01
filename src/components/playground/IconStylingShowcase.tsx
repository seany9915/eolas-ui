import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Tooltip } from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { Accordion } from '@/components/ui/accordion';
import { InlineAlert } from '@/components/ui/inline-alert';
import { assetUrl } from '@/lib/utils';

export const IconStylingShowcase: React.FC = () => {
  const [togglePressed, setTogglePressed] = React.useState(true);

  return (
    <div className="space-y-12">
      {/* Overview Header */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center text-primary">
            <Icon name="category" size="lg" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Design System Icon Styling Showcase</h2>
            <p className="font-sans text-sm text-on-surface-variant">
              Comprehensive reference of every icon styling rule explicitly defined in <code className="bg-surface-variant px-1.5 py-0.5 rounded text-primary font-mono font-bold text-xs">DESIGN.md</code>, including contrast verifications, optical size matrix, state transitions, and accessible <code className="bg-surface-variant px-1.5 py-0.5 rounded text-primary font-mono font-bold text-xs">&lt;Icon /&gt;</code> primitive usage.
            </p>
          </div>
        </div>
      </Card>

      {/* 0. Accessible <Icon /> Primitive Component & Size Matrix */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">0. Accessible &lt;Icon /&gt; Primitive & Optical Size Matrix</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Built-in Base UI system primitive (<code className="font-mono text-primary">src/components/ui/icon.tsx</code>) enforcing automated <code className="font-mono text-primary">aria-hidden</code> handling and standardized scale tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="space-y-2 text-center">
              <div className="h-12 flex items-center justify-center text-primary">
                <Icon name="verified" size="sm" />
              </div>
              <span className="font-label text-xs font-bold text-on-surface block">sm (16px)</span>
              <span className="font-sans text-xs text-on-surface-variant block">Compact chips, metadata badges</span>
            </div>
          </Card>

          <Card>
            <div className="space-y-2 text-center">
              <div className="h-12 flex items-center justify-center text-primary">
                <Icon name="verified" size="md" />
              </div>
              <span className="font-label text-xs font-bold text-on-surface block">md (20px)</span>
              <span className="font-sans text-xs text-on-surface-variant block">Buttons, input leading icons</span>
            </div>
          </Card>

          <Card>
            <div className="space-y-2 text-center">
              <div className="h-12 flex items-center justify-center text-primary">
                <Icon name="verified" size="lg" />
              </div>
              <span className="font-label text-xs font-bold text-on-surface block">lg (24px)</span>
              <span className="font-sans text-xs text-on-surface-variant block">Default callout headers, toasts</span>
            </div>
          </Card>

          <Card>
            <div className="space-y-2 text-center">
              <div className="h-12 flex items-center justify-center text-primary">
                <Icon name="verified" size="xl" />
              </div>
              <span className="font-label text-xs font-bold text-on-surface block">xl (32px)</span>
              <span className="font-sans text-xs text-on-surface-variant block">Hero milestones, victory cards</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 1. Base Material Symbols & Accessibility Rules */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">1. Base Iconography & Accessibility (Material Symbols)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Font class <code className="font-mono text-primary">material-symbols-outlined</code>. Decorative icons use <code className="font-mono text-primary">aria-hidden="true"</code>; standalone/interactive icons require descriptive <code className="font-mono text-primary">.sr-only</code> text or <code className="font-mono text-primary">aria-label</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
                <span className="font-label text-xs font-bold text-on-surface">Decorative Icon Pattern</span>
                <Chip variant="tonal" colorRole="secondary" size="sm">
                  aria-hidden="true"
                </Chip>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container rounded">
                <span className="text-primary">
                  <Icon name="medical_services" size="lg" />
                </span>
                <div>
                  <p className="font-sans text-sm font-semibold text-on-surface">Speech Therapy Guide</p>
                  <p className="font-sans text-xs text-on-surface-variant">Decorative icon paired with explicit text label.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
                <span className="font-label text-xs font-bold text-on-surface">Standalone Interactive Icon Pattern</span>
                <Chip variant="tonal" colorRole="primary" size="sm">
                  aria-label / sr-only
                </Chip>
              </div>
              <div className="flex items-center gap-4 p-3 bg-surface-container rounded">
                <Tooltip content="Print therapy summary">
                  <Button
                    variant="outlined"
                    size="icon"
                    aria-label="Print summary"
                  >
                    <Icon name="print" size="md" />
                    <span className="sr-only">Print therapy summary</span>
                  </Button>
                </Tooltip>
                <div>
                  <p className="font-sans text-sm font-semibold text-on-surface">Standalone Icon Control</p>
                  <p className="font-sans text-xs text-on-surface-variant">Min 44x44px touch target + Tooltip hint + Screen-reader text.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Soft Tonal Icon Containers (Tonal Icon Tiles) */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-on-surface">2. Soft Tonal Icon Containers (Tonal Icon Tiles)</h3>
            <p className="font-sans text-xs text-on-surface-variant">
              Icon glyphs inside soft role-container washes (<code className="font-mono text-primary">primary-container</code>, <code className="font-mono text-primary">surface-variant</code>) with charcoal (<code className="font-mono">#1a1c1e</code>) or brand blue glyphs. Delivers visual weight, clear structural framing, and 8.0:1+ contrast.
            </p>
          </div>
          <Chip variant="tonal" colorRole="primary" size="sm">
            Common Row/Card Pattern
          </Chip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Primary Soft Container Tile */}
          <Card>
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <Icon name="graphic_eq" size="lg" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Audio Wave Analysis</p>
                <p className="font-sans text-xs text-on-surface-variant"><code className="font-mono text-xs">primary-container</code> wash</p>
              </div>
            </div>
          </Card>

          {/* Surface-Variant Soft Tile */}
          <Card>
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-md bg-surface-variant text-on-surface-variant flex items-center justify-center shrink-0">
                <Icon name="record_voice_over" size="lg" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Phoneme Speech Drill</p>
                <p className="font-sans text-xs text-on-surface-variant"><code className="font-mono text-xs">surface-variant</code> wash</p>
              </div>
            </div>
          </Card>

          {/* Tertiary Soft Tile */}
          <Card>
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-md bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                <Icon name="tune" size="lg" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Pitch Calibration</p>
                <p className="font-sans text-xs text-on-surface-variant"><code className="font-mono text-xs">tertiary-container</code> wash</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Solid Amber Badge vs Bare Amber Icon Contrast Rule */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-on-surface">3. Solid Tertiary-Amber Icon Badge (WCAG AA Contrast Solution)</h3>
            <p className="font-sans text-xs text-on-surface-variant">
              Bare Sunny Amber (<code className="font-mono font-bold text-tertiary">#F9A825</code>) icon glyphs fail contrast (1.99:1) on white. <code className="font-mono font-bold">DESIGN.md</code> requires a solid amber badge with charcoal (<code className="font-mono">#1a1c1e</code>) icon inside.
            </p>
          </div>
          <Chip variant="tonal" colorRole="tertiary" size="sm">
            8.66:1 AA Compliant
          </Chip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliant Pattern */}
          <div className="rounded-lg bg-surface border-2 border-success p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-success flex items-center gap-1">
                <Icon name="check_circle" size="xs" />
                DESIGN.md Compliant: Solid Tertiary Badge
              </span>
              <span className="font-mono text-xs font-bold text-success">8.66:1 Contrast</span>
            </div>
            <div className="p-4 bg-surface-container rounded flex items-center gap-4">
              {/* Solid Amber Badge */}
              <div className="h-10 w-10 rounded bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-xs font-bold">
                <Icon name="emoji_events" size="md" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Milestone Unlocked Badge</p>
                <p className="font-sans text-xs text-on-surface-variant">Solid <code className="font-mono text-tertiary">tertiary</code> fill + <code className="font-mono">#1a1c1e</code> charcoal glyph inside.</p>
              </div>
            </div>
          </div>

          {/* Banned Anti-Pattern */}
          <div className="rounded-lg bg-surface border-2 border-error p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-error flex items-center gap-1">
                <Icon name="cancel" size="xs" />
                Banned Anti-Pattern: Bare Amber Glyph on White
              </span>
              <span className="font-mono text-xs font-bold text-error">1.99:1 FAIL</span>
            </div>
            <div className="p-4 bg-surface-container rounded flex items-center gap-4">
              {/* Bare Amber Icon (FAILS CONTRAST) */}
              <div className="h-10 w-10 rounded bg-surface border border-outline-variant flex items-center justify-center shrink-0 text-secondary">
                <Icon name="emoji_events" size="md" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Bare Amber Glyph (Banned)</p>
                <p className="font-sans text-xs text-error font-medium">Fails WCAG AA minimum 3:1 non-text threshold on white background.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Inverted Fill Icons (Spotlight Dark Card Sub-Variant) */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">3. Inverted Fill Accent Icons (Spotlight Charcoal Cards)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Solid charcoal <code className="font-mono text-on-surface">on-surface</code> (<code className="font-mono">#1a1c1e</code>) backdrop paired with <code className="font-mono text-tertiary">tertiary</code> (amber) or <code className="font-mono text-secondary">secondary</code> (emerald) icons. <code className="font-mono text-error">Electric Blue (primary)</code> is explicitly excluded due to ~2.97:1 contrast failure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Spotlight Tertiary Amber Icon */}
          <Card variant="inverted" invertedAccent="tertiary">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-bold text-tertiary flex items-center gap-1">
                  <Icon name="stars" size="xs" />
                  Amber Accent Icon
                </span>
                <span className="font-mono text-xs bg-tertiary/20 text-tertiary px-2 py-0.5 rounded font-bold">8.66:1 AA</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 rounded bg-white/10 flex items-center justify-center text-tertiary">
                  <Icon name="workspace_premium" size="lg" />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-white">Milestone Highlight</p>
                  <p className="font-sans text-xs text-white/70">Tertiary amber icon glyph on charcoal card.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Spotlight Secondary Emerald Icon */}
          <Card variant="inverted">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-bold text-secondary-container flex items-center gap-1">
                  <Icon name="nature" size="xs" />
                  Emerald Accent Icon
                </span>
                <span className="font-mono text-xs bg-secondary/30 text-secondary-container px-2 py-0.5 rounded font-bold">3.2:1+ AA</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 rounded bg-white/10 flex items-center justify-center text-secondary-container">
                  <Icon name="psychology" size="lg" />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-white">Clinical Guidance</p>
                  <p className="font-sans text-xs text-white/70">High-contrast emerald icon glyph on charcoal card.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Excluded Electric Blue Icon */}
          <Card variant="inverted">
            <div className="opacity-80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-bold text-error flex items-center gap-1">
                  <Icon name="block" size="xs" />
                  Primary Blue (Excluded)
                </span>
                <span className="font-mono text-xs bg-error/30 text-error px-2 py-0.5 rounded font-bold">2.97:1 FAIL</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 rounded bg-white/10 flex items-center justify-center text-primary">
                  <Icon name="local_hospital" size="lg" />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-white">Electric Blue (Banned)</p>
                  <p className="font-sans text-xs text-error font-medium">Excluded from Spotlight cards due to contrast failure on charcoal.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Role-Colored Leading Icons in Flat Callout Banners */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">4. Role-Colored Leading Icons (Flat Callout Banners)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Flat white <code className="font-mono text-on-surface">surface</code> background with an accent bar paired with a role-colored leading icon glyph for instant dual-coded visual recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InlineAlert title="Primary Brand Tip" role="neutral" icon="info">
            Leading icon colored in Electric Blue (<code className="font-mono">#0052FF</code>).
          </InlineAlert>

          <InlineAlert title="Clinical Strategy Guide" role="success" icon="lightbulb">
            Leading icon colored in Rich Emerald (<code className="font-mono">#00796B</code>).
          </InlineAlert>

          <InlineAlert title="Critical Notice" role="error" icon="error">
            Leading icon colored in Destructive Red (<code className="font-mono">#ba1a1a</code>).
          </InlineAlert>
        </div>
      </section>

      {/* 5. Functional State Toast Icons */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">5. Functional State Toast Notification Icons</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Tier C floating container (<code className="font-mono">rounded-md</code>, ambient shadow, borderless) with left accent bar and matching state leading icon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md bg-surface shadow-ambient border-l-4 border-l-success p-4 flex items-center gap-3">
            <span className="text-success shrink-0">
              <Icon name="check_circle" size="md" />
            </span>
            <div className="flex-1">
              <p className="font-label text-xs font-bold text-on-surface">Exercise Saved</p>
              <p className="font-sans text-xs text-on-surface-variant">Patient score recorded successfully.</p>
            </div>
          </div>

          <div className="rounded-md bg-surface shadow-ambient border-l-4 border-l-warning p-4 flex items-center gap-3">
            <span className="text-warning shrink-0">
              <Icon name="warning" size="md" />
            </span>
            <div className="flex-1">
              <p className="font-label text-xs font-bold text-on-surface">Session Expiring</p>
              <p className="font-sans text-xs text-on-surface-variant">Inactivity timeout in 2 minutes.</p>
            </div>
          </div>

          <div className="rounded-md bg-surface shadow-ambient border-l-4 border-l-error p-4 flex items-center gap-3">
            <span className="text-error shrink-0">
              <Icon name="report" size="md" />
            </span>
            <div className="flex-1">
              <p className="font-label text-xs font-bold text-on-surface">Connection Interrupted</p>
              <p className="font-sans text-xs text-on-surface-variant">Failed to sync audio recording.</p>
            </div>
          </div>
        </div>
      </section>
      {/* 6. Form Validation & Interactive State Icons */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">6. Form Controls, Validation & Selection State Icons</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Leading validation error icons, solid brand checkmarks in selection controls, and trailing rotating chevron symbols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="space-y-3">
              <span className="font-label text-xs font-bold text-on-surface">Leading Error Validation Icon</span>
              <Field label="Patient ID (required)" error="Format must be SLT-XXXXX.">
                <Input
                  readOnly
                  defaultValue="INVALID-ID-99"
                  leadingIcon={<Icon name="error" size="sm" />}
                  error
                />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <span className="font-label text-xs font-bold text-on-surface">Solid Brand Control Icons</span>
              <div className="space-y-3 pt-1">
                <Checkbox checked readOnly label={<span className="font-sans text-xs font-semibold text-on-surface">Checked Checkbox Icon</span>} />
                <div>
                  <Toggle
                    pressed={togglePressed}
                    onPressedChange={setTogglePressed}
                  >
                    <Icon name="format_bold" size="sm" />
                    <span>{togglePressed ? 'Pressed Solid Icon' : 'Unpressed Icon'}</span>
                  </Toggle>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <span className="font-label text-xs font-bold text-on-surface">Rotating Interactive Chevron Icon</span>
              <Accordion
                items={[
                  {
                    id: 'accordion-sample',
                    title: 'Expandable Clinical Details',
                    content: 'Accordion panel content smoothly revealed using Popover/Menu motion tokens (250ms / 150ms).',
                  },
                ]}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* 7. Icons in Button Tiers */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">7. Icons in Button Emphasis Tiers</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Inline utility grouping rule: icons always sit inline to the left of the button label, never stacked vertically above text.
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button colorRole="primary">
                <Icon name="play_arrow" size="md" />
                <span>Start Exercise</span>
              </Button>

              <Button variant="outlined" colorRole="primary">
                <Icon name="download" size="md" />
                <span>Export Report</span>
              </Button>

              <Button variant="text" colorRole="tertiary">
                <Icon name="menu_book" size="md" />
                <span>View Guide</span>
              </Button>

              <Button colorRole="secondary">
                <Icon name="emoji_events" size="md" />
                <span>Claim Milestone</span>
              </Button>

              <Button colorRole="error">
                <Icon name="delete" size="md" />
                <span>Delete Session</span>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 8. Brand Mark Pictorial Icon */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">8. Brand Pictorial Symbol Mark</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Standalone circular phonic brand symbol mark (<code className="font-mono text-primary">/logos/pictorial-mark.svg</code>). Display min size 2rem (32px) for favicons and 2.5rem (40px) in general UI grids.
          </p>
        </div>

        <Card>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={assetUrl('/logos/pictorial-mark.svg')} alt="Eolas Symbol 32px" className="h-8 w-8 object-contain" />
              <div>
                <p className="font-label text-xs font-bold text-on-surface">32px Favicon / Header Grid</p>
                <p className="font-sans text-xs text-on-surface-variant">2rem x 2rem compact size</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img src={assetUrl('/logos/pictorial-mark.svg')} alt="Eolas Symbol 40px" className="h-10 w-10 object-contain" />
              <div>
                <p className="font-label text-xs font-bold text-on-surface">40px General UI Grid</p>
                <p className="font-sans text-xs text-on-surface-variant">2.5rem x 2.5rem standard size</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 9. Comprehensive Design System Icon Audit & Gaps Analysis */}
      <section className="rounded-lg bg-surface-container border border-outline-variant p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-primary">
            <Icon name="verified" size="md" />
          </span>
          <h3 className="font-heading text-lg font-bold text-on-surface">Design System Icon Rules & Gaps Audit</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-on-surface-variant">
          <div className="p-4 rounded bg-surface border border-outline-variant space-y-2">
            <p className="font-label font-bold text-on-surface flex items-center gap-1.5">
              <span className="text-success">
                <Icon name="check_circle" size="xs" />
              </span>
              Explicitly Sanctioned Icon Rules in DESIGN.md
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Material Symbols Outlined:</strong> Single icon font family across entire application.</li>
              <li><strong>Solid Amber Icon Badge:</strong> Solves 1.99:1 contrast failure of bare amber icon glyphs.</li>
              <li><strong>Spotlight Charcoal Icons:</strong> Restricts accent icons on dark fills to Amber (8.66:1) and Emerald (3.2:1+); bans Primary Blue (2.97:1).</li>
              <li><strong>Dual-Coded Error Indicators:</strong> Pairs error red borders with leading error icons to prevent colorblind accessibility failures.</li>
              <li><strong>Inline Utility Icons:</strong> Icons always sit to the left of labels, never stacked vertically.</li>
            </ul>
          </div>

          <div className="p-4 rounded bg-surface border border-outline-variant space-y-2">
            <p className="font-label font-bold text-on-surface flex items-center gap-1.5">
              <span className="text-warning">
                <Icon name="warning" size="xs" />
              </span>
              Icon Styling Gaps & Banned Fallbacks
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>No Bare Amber Glyphs:</strong> Never use bare <code className="font-mono text-secondary">#F9A825</code> icons on light backgrounds.</li>
              <li><strong>No Multi-Font Icon Mixing:</strong> Banned from mixing Lucide, FontAwesome, or Heroicons with Material Symbols.</li>
              <li><strong>No Sparkle/Magic Icons for AI:</strong> Banned <code className="font-mono">auto_awesome</code> / <code className="font-mono">stars</code> for AI features; use functional task icons (<code className="font-mono">psychology</code>, <code className="font-mono">translate</code>).</li>
              <li><strong>No Touch Target Collapses:</strong> Standalone interactive icons must preserve the 44px (2.75rem) hit target floor even when the glyph is 20-24px.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
