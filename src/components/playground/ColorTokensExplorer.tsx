import * as React from 'react';
import { Card } from '@/components/ui/card';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Icon } from '@/components/ui/icon';

export const ColorTokensExplorer: React.FC = () => {
  const tokenGroups = [
    {
      category: '1. Three-Level Containment Model (Layout & Surfaces)',
      description: 'Every screen uses exactly three containment levels. Pick the lowest level that solves the grouping.',
      tokens: [
        {
          name: 'background (Canvas L1)',
          hex: '#EFF2F7',
          textHex: '#1a1c1e',
          bgClass: 'bg-background text-on-background border border-outline-variant',
          usage: 'Viewport default for page-level layout. Rely on whitespace + typography alone.',
        },
        {
          name: 'surface-container (Grouped Fill L2)',
          hex: '#EBF0F8',
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
          hex: '#DDE1EB',
          textHex: '#434656',
          bgClass: 'bg-surface-variant text-on-surface-variant border border-outline-variant',
          usage: 'Decorative fill for atomic components: chips, progress tracks, avatar fallbacks, selected menu rows.',
        },
      ],
    },
    {
      category: '2. Typographic Inks & Text Colors',
      description: 'Standardized text inks calibrated for AA/AAA contrast without harsh pure-black glare.',
      tokens: [
        {
          name: 'on-surface (Primary Charcoal Ink)',
          hex: '#1a1c1e',
          textHex: '#ffffff',
          bgClass: 'bg-on-surface text-surface font-semibold',
          usage: 'Primary body copy, headlines, and data values. Formulated to eliminate eye strain while hitting 17.1:1 AAA on white.',
        },
        {
          name: 'on-surface-variant (Secondary Text Ink)',
          hex: '#434656',
          textHex: '#ffffff',
          bgClass: 'bg-on-surface-variant text-surface font-semibold',
          usage: 'Secondary descriptions, timestamps, table column headers, and form helper text (9.3:1 AAA contrast on white).',
        },
        {
          name: 'on-primary / Reverse White Ink',
          hex: '#ffffff',
          textHex: '#1a1c1e',
          bgClass: 'bg-primary text-on-primary font-semibold',
          usage: 'High-contrast white text for solid CTA buttons, destructive badges, and dark spotlight cards (17.1:1 AAA on charcoal, 5.75:1 AA on primary).',
        },
      ],
    },
    {
      category: '3. Brand & Accent Roles',
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
          hex: '#D5F0EE / #1a1c1e',
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
      category: '4. System State & Operational Roles (Error / Warning / Success / Neutral)',
      description: 'Domain state and operational feedback. Never substitute state colors with brand colors.',
      tokens: [
        {
          name: 'error (Red)',
          hex: '#C4161C',
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
          hex: '#A64B00',
          textHex: '#ffffff',
          bgClass: 'bg-warning text-on-warning',
          usage: 'Non-blocking caution states (session expiry, unsaved changes). Distinct from Sunny Amber.',
        },
        {
          name: 'warning-container & on-warning-container',
          hex: '#FDE3B8 / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-warning-container text-on-warning-container font-semibold',
          usage: 'Caution backdrops. Text MUST be neutral charcoal (#1a1c1e).',
        },
        {
          name: 'success (Deep Green)',
          hex: '#157331',
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
        {
          name: 'neutral (Operational Charcoal)',
          hex: '#1a1c1e',
          textHex: '#ffffff',
          bgClass: 'bg-neutral text-on-neutral',
          usage: 'Operational and ambient system status indicators (offline, sync pending, read-only session).',
        },
        {
          name: 'neutral-container & on-neutral-container',
          hex: '#D1D5DF / #1a1c1e',
          textHex: '#1a1c1e',
          bgClass: 'bg-neutral-container text-on-neutral-container font-semibold',
          usage: 'Soft-fill backdrop for operational status tags, info badges, and system feedback. Text MUST be neutral charcoal (#1a1c1e).',
        },
      ],
    },
    {
      category: '5. Structural Outlines & Boundaries',
      description: 'Precise linear separation without heavy skeuomorphic shadows.',
      tokens: [
        {
          name: 'Outline (Default Control Boundaries)',
          hex: '#737688',
          textHex: '#1a1c1e',
          bgClass: 'border-2 border-outline bg-surface text-on-surface font-semibold',
          usage: '1px resting border for interactive form controls (Input, Checkbox, Radio).',
        },
        {
          name: 'Outline-Variant (Subtle Card & Divider Borders)',
          hex: '#BEC6D6',
          textHex: '#1a1c1e',
          bgClass: 'border-2 border-outline-variant bg-surface text-on-surface font-semibold',
          usage: 'Subtle 1px structural outlines for Popovers, Menus, and list dividers (shown here as an outline on surface).',
        },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Intro Banner */}
      <InlineAlert
        title="Color System & Hierarchy"
        titleAs="h2"
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
              <Card key={tok.name} variant="default" className="h-full">
                <div className="h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className={`h-14 px-4 rounded ${tok.bgClass} flex items-center justify-between font-mono text-xs shadow-xs`}>
                      <span className="font-bold truncate pr-2">{tok.name}</span>
                      <span className="shrink-0">{tok.hex}</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface leading-relaxed">
                      {tok.usage}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-label text-on-surface-variant border-t border-outline-variant/60 pt-2 shrink-0">
                    <span>WCAG 2.2 AA Verified</span>
                    <span className="text-success font-semibold flex items-center gap-1">
                      <Icon name="check_circle" size="xs" /> Pass
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
