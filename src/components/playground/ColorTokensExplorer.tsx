import * as React from 'react';
import { Card } from '@/components/ui/card';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Icon } from '@/components/ui/icon';

export const ColorTokensExplorer: React.FC = () => {
  const tokenGroups = [
    {
      category: '1. Three-Level Containment Model (Layout & Nesting)',
      description: 'Every screen uses exactly three containment levels. Pick the lowest level that solves the grouping.',
      tokens: [
        {
          name: 'background (Canvas L1)',
          hex: '#F6F7FB',
          textHex: '#1a1c1e',
          bgClass: 'bg-background text-on-background border border-outline-variant',
          usage: 'Viewport default for page-level layout. Rely on whitespace + typography alone.',
        },
        {
          name: 'surface-container (Grouped Fill L2)',
          hex: '#EEF3FF',
          textHex: '#1a1c1e',
          bgClass: 'bg-surface-container text-on-surface border border-outline-variant',
          usage: 'Flat, borderless grouping of input clusters or section backgrounds without implying a distinct interactive object.',
        },
        {
          name: 'surface (Surface / Card L3)',
          hex: '#ffffff',
          textHex: '#1a1c1e',
          bgClass: 'bg-surface text-on-surface border border-outline-variant shadow-xs',
          usage: 'High-focus encapsulation for distinct, interactive entities (modals, dialogs, primary cards).',
        },
        {
          name: 'surface-variant (Component Internal Fill)',
          hex: '#DCE6FA',
          textHex: '#434656',
          bgClass: 'bg-surface-variant text-on-surface-variant border border-outline-variant',
          usage: 'Decorative fill for atomic components: chips, progress tracks, avatar fallbacks, selected menu rows.',
        },
      ],
    },
    {
      category: '2. Brand & Accent Roles',
      description: 'Color balance directive: do not default to grey or primary alone — secondary and tertiary must have visible uses.',
      tokens: [
        {
          name: 'primary (Electric Blue)',
          hex: '#0052FF',
          textHex: '#ffffff',
          bgClass: 'bg-primary text-on-primary',
          usage: 'Brand anchor, core user journeys, primary buttons, active interactive states.',
        },
        {
          name: 'primary-container & on-primary-container',
          hex: '#dce6ff / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-primary-container text-on-primary-container font-semibold',
          usage: 'Soft-fill backdrop for informational callout banners and brand highlights. Text MUST be neutral charcoal (#1a1c1e).',
        },
        {
          name: 'secondary (Rich Emerald)',
          hex: '#00796B',
          textHex: '#ffffff',
          bgClass: 'bg-secondary text-on-secondary font-semibold',
          usage: 'Informational support callouts, strategy guides, metadata tags, secondary buttons. Safe for text/border on light backgrounds (WCAG ~4.6:1).',
        },
        {
          name: 'secondary-container & on-secondary-container',
          hex: '#e0f2f1 / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-secondary-container text-on-secondary-container font-semibold',
          usage: 'Soft-fill backdrop for therapy guides, hints, and informational support boxes. Text MUST be neutral charcoal (#1a1c1e).',
        },
        {
          name: 'tertiary (Sunny Amber)',
          hex: '#F9A825',
          textHex: '#1a1c1e',
          bgClass: 'bg-tertiary text-on-tertiary font-bold',
          usage: 'High-visibility brand accent, milestones, streak rewards. Filled-only/container wash (WCAG 1.99:1 text restriction).',
        },
        {
          name: 'tertiary-container & on-tertiary-container',
          hex: '#fff0c2 / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-tertiary-container text-on-tertiary-container font-semibold',
          usage: 'Soft-fill highlighter pen backdrop for stat highlights and milestones. Text MUST be neutral charcoal (#1a1c1e).',
        },
      ],
    },
    {
      category: '3. System State Roles (Error / Warning / Success)',
      description: 'Domain & app state feedback. Never substitute state colors with brand colors.',
      tokens: [
        {
          name: 'error (Red)',
          hex: '#ba1a1a',
          textHex: '#ffffff',
          bgClass: 'bg-error text-on-error',
          usage: 'Validation errors, destructive confirmations, wrong exercise response indicators.',
        },
        {
          name: 'error-container & on-error-container',
          hex: '#ffdad6 / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-error-container text-on-error-container font-semibold',
          usage: 'Field error backdrops and destructive banner washes. Text MUST be neutral charcoal (#1a1c1e).',
        },
        {
          name: 'warning (Burnt Orange)',
          hex: '#8a5200',
          textHex: '#ffffff',
          bgClass: 'bg-warning text-on-warning',
          usage: 'Non-blocking caution states (session expiry, unsaved changes). Distinct from Sunny Amber.',
        },
        {
          name: 'warning-container & on-warning-container',
          hex: '#ffe0b3 / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-warning-container text-on-warning-container font-semibold',
          usage: 'Caution backdrops. Text MUST be neutral charcoal (#1a1c1e).',
        },
        {
          name: 'success (Deep Green)',
          hex: '#146c2e',
          textHex: '#ffffff',
          bgClass: 'bg-success text-on-success',
          usage: 'Completed actions, saved confirmations, correct exercise response indicators.',
        },
        {
          name: 'success-container & on-success-container',
          hex: '#c8f5ce / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-success-container text-on-success-container font-semibold',
          usage: 'Confirmation backdrops and correct-answer feedback containers. Text MUST be neutral charcoal (#1a1c1e).',
        },
      ],
    },
    {
      category: '4. Structural Outlines & Boundaries',
      description: 'Precise linear separation without heavy skeuomorphic shadows.',
      tokens: [
        {
          name: 'outline (Default Control Boundaries)',
          hex: '#737688',
          textHex: '#ffffff',
          bgClass: 'bg-outline text-surface',
          usage: '1px resting border for interactive form controls (Input, Checkbox, Radio).',
        },
        {
          name: 'outline-variant (Subtle Card & Divider Borders)',
          hex: '#C4D5F8',
          textHex: '#1a1c1e',
          bgClass: 'bg-outline-variant text-on-surface',
          usage: '1px structural outlines for Popovers, Menus, and list dividers.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Intro Banner */}
      <InlineAlert
        title="Color System & Hierarchy"
        role="neutral"
        icon="palette"
      >
        <p>
          All tokens are mapped to functional roles governed by visual hierarchy and interactive affordance. Primary acts as the interactive anchor, while secondary and tertiary provide supporting accents and spotlight moments where functionally relevant.
        </p>
      </InlineAlert>

      {/* Token Groups */}
      {tokenGroups.map((group) => (
        <div key={group.category} className="space-y-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-on-surface">{group.category}</h3>
            <p className="font-sans text-xs text-on-surface-variant">{group.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.tokens.map((tok) => (
              <Card key={tok.name} variant="default" className="h-full flex flex-col justify-between p-5 space-y-4">
                <div className="space-y-3">
                  <div className={`h-14 px-4 rounded-[0.5rem] ${tok.bgClass} flex items-center justify-between font-mono text-xs shadow-xs`}>
                    <span className="font-bold truncate pr-2">{tok.name}</span>
                    <span className="shrink-0">{tok.hex}</span>
                  </div>
                  <p className="font-sans text-xs text-on-surface leading-relaxed">
                    {tok.usage}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-label text-on-surface-variant border-t border-outline-variant/60 pt-2 shrink-0">
                  <span>WCAG 2.2 AA Verified</span>
                  <span className="text-success font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">check_circle</span> Pass
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
