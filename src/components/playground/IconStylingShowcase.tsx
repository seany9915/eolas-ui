import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';

export const IconStylingShowcase: React.FC = () => {
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  const [togglePressed, setTogglePressed] = React.useState(true);

  return (
    <div className="space-y-12">
      {/* Overview Header */}
      <div className="rounded-[1rem] bg-surface border border-outline-variant p-6 space-y-3">
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
      </div>

      {/* 0. Accessible <Icon /> Primitive Component & Size Matrix */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">0. Accessible &lt;Icon /&gt; Primitive & Optical Size Matrix</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Built-in Base UI system primitive (<code className="font-mono text-primary">src/components/ui/icon.tsx</code>) enforcing automated <code className="font-mono text-primary">aria-hidden</code> handling and standardized scale tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-[1rem] bg-surface border border-outline-variant p-4 space-y-2 text-center">
            <div className="h-12 flex items-center justify-center text-primary">
              <Icon name="verified" size="sm" />
            </div>
            <span className="font-label text-xs font-bold text-on-surface block">sm (16px)</span>
            <span className="font-sans text-[11px] text-on-surface-variant block">Compact chips, metadata badges</span>
          </div>

          <div className="rounded-[1rem] bg-surface border border-outline-variant p-4 space-y-2 text-center">
            <div className="h-12 flex items-center justify-center text-primary">
              <Icon name="verified" size="md" />
            </div>
            <span className="font-label text-xs font-bold text-on-surface block">md (20px)</span>
            <span className="font-sans text-[11px] text-on-surface-variant block">Buttons, input leading icons</span>
          </div>

          <div className="rounded-[1rem] bg-surface border border-outline-variant p-4 space-y-2 text-center">
            <div className="h-12 flex items-center justify-center text-primary">
              <Icon name="verified" size="lg" />
            </div>
            <span className="font-label text-xs font-bold text-on-surface block">lg (24px)</span>
            <span className="font-sans text-[11px] text-on-surface-variant block">Default callout headers, toasts</span>
          </div>

          <div className="rounded-[1rem] bg-surface border border-outline-variant p-4 space-y-2 text-center">
            <div className="h-12 flex items-center justify-center text-primary">
              <Icon name="verified" size="xl" />
            </div>
            <span className="font-label text-xs font-bold text-on-surface block">xl (32px)</span>
            <span className="font-sans text-[11px] text-on-surface-variant block">Hero milestones, victory cards</span>
          </div>
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
          <div className="rounded-[1rem] bg-surface border border-outline-variant p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
              <span className="font-label text-xs font-bold text-on-surface">Decorative Icon Pattern</span>
              <span className="bg-success-container text-on-success-container font-label text-[10px] font-bold px-2 py-0.5 rounded-full">
                aria-hidden="true"
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-[0.5rem]">
              <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">
                medical_services
              </span>
              <div>
                <p className="font-sans text-sm font-semibold text-on-surface">Speech Therapy Guide</p>
                <p className="font-sans text-xs text-on-surface-variant">Decorative icon paired with explicit text label.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1rem] bg-surface border border-outline-variant p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
              <span className="font-label text-xs font-bold text-on-surface">Standalone Interactive Icon Pattern</span>
              <span className="bg-primary-container text-on-primary-container font-label text-[10px] font-bold px-2 py-0.5 rounded-full">
                aria-label / sr-only
              </span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-surface-container rounded-[0.5rem]">
              <Tooltip content="Print therapy summary">
                <button
                  type="button"
                  aria-label="Print summary"
                  className="h-11 w-11 rounded-[0.5rem] bg-surface border border-outline hover:bg-surface-variant text-on-surface flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">print</span>
                  <span className="sr-only">Print therapy summary</span>
                </button>
              </Tooltip>
              <div>
                <p className="font-sans text-sm font-semibold text-on-surface">Standalone Icon Control</p>
                <p className="font-sans text-xs text-on-surface-variant">Min 44x44px touch target + Tooltip hint + Screen-reader text.</p>
              </div>
            </div>
          </div>
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
          <span className="bg-primary-container text-on-primary-container font-label text-xs font-bold px-3 py-1 rounded-full">
            Common Row/Card Pattern
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Primary Soft Container Tile */}
          <div className="p-4 bg-surface border border-outline-variant rounded-[1rem] flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-[0.75rem] bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">graphic_eq</span>
            </div>
            <div>
              <p className="font-sans text-sm font-bold text-on-surface">Audio Wave Analysis</p>
              <p className="font-sans text-xs text-on-surface-variant"><code className="font-mono text-xs">primary-container</code> wash</p>
            </div>
          </div>

          {/* Surface-Variant Soft Tile */}
          <div className="p-4 bg-surface border border-outline-variant rounded-[1rem] flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-[0.75rem] bg-surface-variant text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">record_voice_over</span>
            </div>
            <div>
              <p className="font-sans text-sm font-bold text-on-surface">Phoneme Speech Drill</p>
              <p className="font-sans text-xs text-on-surface-variant"><code className="font-mono text-xs">surface-variant</code> wash</p>
            </div>
          </div>

          {/* Tertiary Soft Tile */}
          <div className="p-4 bg-surface border border-outline-variant rounded-[1rem] flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-[0.75rem] bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">tune</span>
            </div>
            <div>
              <p className="font-sans text-sm font-bold text-on-surface">Pitch Calibration</p>
              <p className="font-sans text-xs text-on-surface-variant"><code className="font-mono text-xs">tertiary-container</code> wash</p>
            </div>
          </div>
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
          <span className="bg-tertiary-container text-on-tertiary-container font-label text-xs font-bold px-3 py-1 rounded-full">
            8.66:1 AA Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliant Pattern */}
          <div className="rounded-[1rem] bg-surface border-2 border-success p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-success flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                DESIGN.md Compliant: Solid Tertiary Badge
              </span>
              <span className="font-mono text-xs font-bold text-success">8.66:1 Contrast</span>
            </div>
            <div className="p-4 bg-surface-container rounded-[0.5rem] flex items-center gap-4">
              {/* Solid Amber Badge */}
              <div className="h-10 w-10 rounded-[0.5rem] bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-xs font-bold">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">emoji_events</span>
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Milestone Unlocked Badge</p>
                <p className="font-sans text-xs text-on-surface-variant">Solid <code className="font-mono text-tertiary">tertiary</code> fill + <code className="font-mono">#1a1c1e</code> charcoal glyph inside.</p>
              </div>
            </div>
          </div>

          {/* Banned Anti-Pattern */}
          <div className="rounded-[1rem] bg-surface border-2 border-error p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-base">cancel</span>
                Banned Anti-Pattern: Bare Amber Glyph on White
              </span>
              <span className="font-mono text-xs font-bold text-error">1.99:1 FAIL</span>
            </div>
            <div className="p-4 bg-surface-container rounded-[0.5rem] flex items-center gap-4">
              {/* Bare Amber Icon (FAILS CONTRAST) */}
              <div className="h-10 w-10 rounded-[0.5rem] bg-surface border border-outline-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl text-[#F9A825]" aria-hidden="true">emoji_events</span>
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
          <div className="rounded-[1rem] bg-on-surface p-5 text-surface space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-tertiary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">stars</span>
                Amber Accent Icon
              </span>
              <span className="font-mono text-[10px] bg-tertiary/20 text-tertiary px-2 py-0.5 rounded font-bold">8.66:1 AA</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-10 w-10 rounded-[0.5rem] bg-white/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">workspace_premium</span>
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-white">Milestone Highlight</p>
                <p className="font-sans text-xs text-white/70">Tertiary amber icon glyph on charcoal card.</p>
              </div>
            </div>
          </div>

          {/* Spotlight Secondary Emerald Icon */}
          <div className="rounded-[1rem] bg-on-surface p-5 text-surface space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-secondary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">nature</span>
                Emerald Accent Icon
              </span>
              <span className="font-mono text-[10px] bg-secondary/30 text-secondary-container px-2 py-0.5 rounded font-bold">3.2:1+ AA</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-10 w-10 rounded-[0.5rem] bg-white/10 flex items-center justify-center text-[#26a69a]">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">psychology</span>
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-white">Clinical Guidance</p>
                <p className="font-sans text-xs text-white/70">High-contrast emerald icon glyph on charcoal card.</p>
              </div>
            </div>
          </div>

          {/* Excluded Electric Blue Icon */}
          <div className="rounded-[1rem] bg-on-surface p-5 text-surface space-y-3 opacity-80 border border-error/40">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">block</span>
                Primary Blue (Excluded)
              </span>
              <span className="font-mono text-[10px] bg-error/30 text-error px-2 py-0.5 rounded font-bold">2.97:1 FAIL</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-10 w-10 rounded-[0.5rem] bg-white/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">local_hospital</span>
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-white">Electric Blue (Banned)</p>
                <p className="font-sans text-xs text-error font-medium">Excluded from Spotlight cards due to contrast failure on charcoal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Role-Colored Leading Icons in Flat Callout Banners */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">4. Role-Colored Leading Icons (Flat Callout Banners)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Flat white <code className="font-mono text-on-surface">surface</code> background with a 4px left accent bar paired with a role-colored leading icon glyph for instant dual-coded visual recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Callout Icon */}
          <div className="rounded-[0.5rem] bg-surface border border-outline-variant border-l-[4px] border-l-primary p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5" aria-hidden="true">info</span>
            <div>
              <p className="font-label text-xs font-bold text-on-surface">Primary Brand Tip</p>
              <p className="font-sans text-xs text-on-surface-variant">Leading icon colored in Electric Blue (<code className="font-mono">#0052FF</code>).</p>
            </div>
          </div>

          {/* Secondary Emerald Callout Icon */}
          <div className="rounded-[0.5rem] bg-surface border border-outline-variant border-l-[4px] border-l-secondary p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5" aria-hidden="true">lightbulb</span>
            <div>
              <p className="font-label text-xs font-bold text-on-surface">Clinical Strategy Guide</p>
              <p className="font-sans text-xs text-on-surface-variant">Leading icon colored in Rich Emerald (<code className="font-mono">#00796B</code>).</p>
            </div>
          </div>

          {/* Error Callout Icon */}
          <div className="rounded-[0.5rem] bg-surface border border-outline-variant border-l-[4px] border-l-error p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-xl shrink-0 mt-0.5" aria-hidden="true">error</span>
            <div>
              <p className="font-label text-xs font-bold text-on-surface">Critical Notice</p>
              <p className="font-sans text-xs text-on-surface-variant">Leading icon colored in Destructive Red (<code className="font-mono">#ba1a1a</code>).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Functional State Toast Icons */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">5. Functional State Toast Notification Icons</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Tier C floating container (<code className="font-mono">rounded-[0.75rem]</code>, ambient shadow, borderless) with 4px left accent bar and matching state leading icon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Success Toast */}
          <div className="rounded-[0.75rem] bg-surface shadow-ambient border-l-[4px] border-l-success p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-success text-xl shrink-0" aria-hidden="true">check_circle</span>
            <div className="flex-1">
              <p className="font-label text-xs font-bold text-on-surface">Exercise Saved</p>
              <p className="font-sans text-[11px] text-on-surface-variant">Patient score recorded successfully.</p>
            </div>
          </div>

          {/* Warning Toast */}
          <div className="rounded-[0.75rem] bg-surface shadow-ambient border-l-[4px] border-l-warning p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-warning text-xl shrink-0" aria-hidden="true">warning</span>
            <div className="flex-1">
              <p className="font-label text-xs font-bold text-on-surface">Session Expiring</p>
              <p className="font-sans text-[11px] text-on-surface-variant">Inactivity timeout in 2 minutes.</p>
            </div>
          </div>

          {/* Error Toast */}
          <div className="rounded-[0.75rem] bg-surface shadow-ambient border-l-[4px] border-l-error p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-xl shrink-0" aria-hidden="true">report</span>
            <div className="flex-1">
              <p className="font-label text-xs font-bold text-on-surface">Connection Interrupted</p>
              <p className="font-sans text-[11px] text-on-surface-variant">Failed to sync audio recording.</p>
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
          {/* Error Input Validation Icon */}
          <div className="rounded-[1rem] bg-surface border border-outline-variant p-5 space-y-3">
            <span className="font-label text-xs font-bold text-on-surface">Leading Error Validation Icon</span>
            <div className="space-y-1.5">
              <label className="block font-label text-xs font-bold text-on-surface">Patient ID (required)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-error text-lg pointer-events-none" aria-hidden="true">
                  error
                </span>
                <input
                  type="text"
                  readOnly
                  value="INVALID-ID-99"
                  className="w-full pl-9 pr-3 py-2.5 rounded-[0.5rem] border-2 border-error bg-surface font-sans text-sm text-on-surface focus:outline-none"
                />
              </div>
              <p className="font-sans text-xs text-error font-medium flex items-center gap-1">
                Format must be SLT-XXXXX.
              </p>
            </div>
          </div>

          {/* Solid Checked & Pressed Controls */}
          <div className="rounded-[1rem] bg-surface border border-outline-variant p-5 space-y-3">
            <span className="font-label text-xs font-bold text-on-surface">Solid Brand Control Icons</span>
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-[0.5rem] bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-base font-bold" aria-hidden="true">check</span>
                </div>
                <span className="font-sans text-xs font-semibold text-on-surface">Checked Checkbox Icon (<code className="font-mono text-primary">on-primary</code>)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTogglePressed(!togglePressed)}
                  className={`px-3 py-1.5 rounded-[0.5rem] font-label text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors ${
                    togglePressed ? 'bg-primary text-on-primary' : 'bg-surface border border-outline text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden="true">format_bold</span>
                  <span>{togglePressed ? 'Pressed Solid Icon' : 'Unpressed Icon'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Smoothly Rotating Accordion Chevron */}
          <div className="rounded-[1rem] bg-surface border border-outline-variant p-5 space-y-3">
            <span className="font-label text-xs font-bold text-on-surface">Rotating Interactive Chevron Icon</span>
            <button
              type="button"
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full p-3 rounded-[0.5rem] bg-surface-container flex items-center justify-between font-label text-xs font-bold text-on-surface cursor-pointer hover:bg-surface-variant transition-colors"
            >
              <span>{accordionOpen ? 'Collapse Section' : 'Expand Section'}</span>
              <span
                className={`material-symbols-outlined text-on-surface-variant transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  accordionOpen ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              >
                expand_more
              </span>
            </button>
            {accordionOpen && (
              <p className="font-sans text-xs text-on-surface-variant p-2 bg-surface rounded border border-outline-variant">
                Accordion panel content smoothly revealed using Popover/Menu motion tokens (250ms / 150ms).
              </p>
            )}
          </div>
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

        <div className="rounded-[1rem] bg-surface border border-outline-variant p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Filled Button with Icon */}
            <Button colorRole="primary">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">play_arrow</span>
              <span>Start Exercise</span>
            </Button>

            {/* Outlined Button with Icon */}
            <Button variant="outlined" colorRole="primary">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">download</span>
              <span>Export Report</span>
            </Button>

            {/* Text Button with Icon */}
            <Button variant="text" colorRole="tertiary">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">menu_book</span>
              <span>View Guide</span>
            </Button>

            {/* Secondary Amber Filled Button with Icon */}
            <Button colorRole="secondary">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">emoji_events</span>
              <span>Claim Milestone</span>
            </Button>

            {/* Error Destructive Button with Icon */}
            <Button colorRole="error">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">delete</span>
              <span>Delete Session</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Brand Mark Pictorial Icon */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">8. Brand Pictorial Symbol Mark</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Standalone circular phonic brand symbol mark (<code className="font-mono text-primary">/logos/pictorial-mark.svg</code>). Display min size 2rem (32px) for favicons and 2.5rem (40px) in general UI grids.
          </p>
        </div>

        <div className="rounded-[1rem] bg-surface border border-outline-variant p-6 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/logos/pictorial-mark.svg" alt="Eolas Symbol 32px" className="h-8 w-8 object-contain" />
            <div>
              <p className="font-label text-xs font-bold text-on-surface">32px Favicon / Header Grid</p>
              <p className="font-sans text-xs text-on-surface-variant">2rem x 2rem compact size</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src="/logos/pictorial-mark.svg" alt="Eolas Symbol 40px" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-label text-xs font-bold text-on-surface">40px General UI Grid</p>
              <p className="font-sans text-xs text-on-surface-variant">2.5rem x 2.5rem standard size</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Comprehensive Design System Icon Audit & Gaps Analysis */}
      <section className="rounded-[1rem] bg-surface-container border border-outline-variant p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl" aria-hidden="true">verified</span>
          <h3 className="font-heading text-lg font-bold text-on-surface">Design System Icon Rules & Gaps Audit</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-on-surface-variant">
          <div className="p-4 rounded-[0.5rem] bg-surface border border-outline-variant space-y-2">
            <p className="font-label font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-success text-base">check_circle</span>
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

          <div className="p-4 rounded-[0.5rem] bg-surface border border-outline-variant space-y-2">
            <p className="font-label font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-warning text-base">warning</span>
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
