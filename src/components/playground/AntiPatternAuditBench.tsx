import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';

interface DoDontCheck {
  id: string;
  title: string;
  ruleSummary: string;
  category: string;
  bannedDescription: string;
  requiredDescription: string;
  dontExample: React.ReactNode;
  doExample: React.ReactNode;
}

export const AntiPatternAuditBench: React.FC = () => {
  const auditChecks: DoDontCheck[] = [
    {
      id: 'emerald-cancel',
      title: '1. Emerald Accent vs. Neutral Exit Action',
      category: 'Button Action Hierarchy',
      ruleSummary: 'Secondary actions ("Cancel", "Back", "Discard") must use neutral emphasis (variant="outline" colorRole="neutral"). Emerald (#00796B) is a brand accent, never an exit tier.',
      bannedDescription: 'Emerald CTA for Cancel causes false-positive chromatic urgency, confusing users about which action is destructive or confirmatory.',
      requiredDescription: 'Neutral outline provides a clear, subdued secondary action tier without stealing visual priority from the primary CTA.',
      dontExample: (
        <div className="flex flex-wrap items-center gap-3">
          <Button colorRole="primary">Save Session</Button>
          {/* Banned: Emerald on exit/cancel action */}
          <Button colorRole="secondary">Cancel</Button>
        </div>
      ),
      doExample: (
        <div className="flex flex-wrap items-center gap-3">
          <Button colorRole="primary">Save Session</Button>
          {/* Required: Neutral outline on exit/cancel action */}
          <Button variant="outline" colorRole="neutral">Cancel</Button>
        </div>
      ),
    },
    {
      id: 'triple-tint-monochrome',
      title: '2. Triple-Tint Monochrome vs. High-Contrast Rotation',
      category: 'Chips & Badges',
      ruleSummary: 'Banned: light tint fill + matching border + matching text of the same hue family (e.g. green fill + green border + green text). Enforce the 3-pattern rotation.',
      bannedDescription: 'Pastel monochrome chips look washed out, fail WCAG contrast ratios on tinted surfaces, and lack visual authority.',
      requiredDescription: 'Rotate between high-contrast filled, colored outline on clean neutral surface, and soft container wash with dark charcoal ink (#1a1c1e).',
      dontExample: (
        <div className="flex flex-wrap items-center gap-2">
          {/* Banned: Single hue family tint + border + text */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] border border-[#a8dab5] text-[#137333]">
            Active Plan
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] border border-[#aecbfa] text-[#1a73e8]">
            In Progress
          </span>
        </div>
      ),
      doExample: (
        <div className="flex flex-wrap items-center gap-2">
          {/* Required 3-Pattern Rotation */}
          <Badge variant="filled" colorRole="primary">Filled Active</Badge>
          <Badge variant="outline" colorRole="primary">Outline Neutral Fill</Badge>
          <Badge variant="soft" colorRole="primary">Soft Container + Charcoal</Badge>
        </div>
      ),
    },
    {
      id: 'focus-vs-selection',
      title: '3. Focus vs. Selection Ambiguity (Floating 2px Ring)',
      category: 'Accessibility & Keyboard Navigation',
      ruleSummary: 'Focus rings and active selection must never look identical (WCAG 2.2 SC 2.4.7). Focus uses floating outline-offset: 2px; active selection uses flush 2px border.',
      bannedDescription: 'Using flush outline-offset: 0 on interactive cards or buttons makes it impossible to distinguish keyboard navigation cursor from toggled selection state.',
      requiredDescription: 'Floating 2px focus ring clearly indicates keyboard cursor, while flush 2px border + internal surface wash communicates active selection.',
      dontExample: (
        <div className="flex flex-wrap items-center gap-3">
          {/* Banned: Flush outline ambiguous with border */}
          <div className="p-3 rounded-lg border-2 border-primary bg-surface font-sans text-xs font-semibold select-none">
            Selected or Focused? (Ambiguous)
          </div>
        </div>
      ),
      doExample: (
        <div className="flex flex-wrap items-center gap-4">
          {/* Pinned Focus via data-preview */}
          <Button
            variant="outlined"
            colorRole="primary"
            data-preview="focus"
            className="pointer-events-none"
          >
            Floating Focus Ring
          </Button>

          {/* Active Selection State */}
          <div className="px-4 py-2.5 rounded-lg border-2 border-primary bg-primary-container text-on-primary-container font-sans text-xs font-bold flex items-center gap-2">
            <Icon name="check_circle" size="xs" />
            <span>Active Selection (Flush Border)</span>
          </div>
        </div>
      ),
    },
    {
      id: 'icon-margins',
      title: '4. Manual Icon Margins vs. Native Flex Gaps',
      category: 'Iconography & Layout',
      ruleSummary: 'Never add mr-* or ml-* margin classes on <Icon> inside buttons or menu items. Buttons already declare gap-2; manual margins create an asymmetrical 16px gap.',
      bannedDescription: 'Adding className="mr-2" injects 8px margin onto the button\'s 8px flex gap, producing an unbalanced 16px gap against 16px outer padding.',
      requiredDescription: 'Omit manual margin classes and let the button container\'s native gap-2 govern symmetrical, optically centered spacing.',
      dontExample: (
        <div className="flex items-center gap-3">
          <Button colorRole="primary">
            {/* Banned: mr-2 adds 8px margin on top of gap-2 */}
            <span className="flex items-center">
              <Icon name="event" size="xs" className="mr-2" />
              <span>Schedule Drill (16px gap)</span>
            </span>
          </Button>
        </div>
      ),
      doExample: (
        <div className="flex items-center gap-3">
          <Button colorRole="primary">
            {/* Required: Clean icon without margin classes */}
            <Icon name="event" size="xs" />
            <span>Schedule Drill (8px gap)</span>
          </Button>
        </div>
      ),
    },
    {
      id: 'raw-form-inputs',
      title: '5. Raw Form <div>s vs. <FieldGroup> + <Field>',
      category: 'Form Accessibility (WCAG 1.3.1 & 3.3.2)',
      ruleSummary: 'Never render raw <Input> elements relying on placeholder text alone. Wrap inputs in <Field> + <FieldLabel> and stacks in <FieldGroup>.',
      bannedDescription: 'Placeholders disappear upon typing and are ignored by screen readers, failing basic accessible label requirements.',
      requiredDescription: 'Explicit <FieldLabel> and <FieldGroup> ensure screen reader association, visible persistence, and consistent vertical spacing.',
      dontExample: (
        <div className="w-full max-w-xs flex flex-col gap-2">
          {/* Banned: Raw unlabelled inputs */}
          <Input placeholder="Full Name (No Label)" />
          <Input placeholder="Email Address (No Label)" type="email" />
        </div>
      ),
      doExample: (
        <div className="w-full max-w-xs flex flex-col gap-3">
          {/* Required: FieldGroup + Field + FieldLabel */}
          <Field>
            <FieldLabel>Full Name</FieldLabel>
            <Input placeholder="e.g. Eleanor Vance" />
          </Field>
          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <Input placeholder="eleanor@example.com" type="email" />
          </Field>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Intro Banner */}
      <InlineAlert
        title="Anti-Pattern & Accessibility Visual Audit Bench"
        titleAs="h2"
        role="success"
        icon="verified"
      >
        <p>
          Side-by-side visual comparisons of banned &quot;AI slop&quot; patterns versus approved Eolas Design System implementations.
          Every component in this catalog is verified against <code>.agents/rules/anti-patterns.md</code> to guarantee strict WCAG 2.2 AA compliance.
        </p>
      </InlineAlert>

      {/* Visual Comparison Cards */}
      <div className="flex flex-col gap-6">
        {auditChecks.map((check) => (
          <Card key={check.id} variant="default" className="overflow-hidden">
            <Card.Header className="flex flex-row items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="soft" colorRole="primary" size="sm">
                    {check.category}
                  </Badge>
                  <Card.Title>{check.title}</Card.Title>
                </div>
                <Card.Description>{check.ruleSummary}</Card.Description>
              </div>
            </Card.Header>

            <Card.Content className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DON'T Column */}
                <div className="p-4 rounded-xl border border-error/40 bg-error-container/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-error/20 pb-2">
                    <span className="font-heading text-xs font-bold text-error flex items-center gap-1.5 uppercase tracking-wider">
                      <Icon name="cancel" size="xs" />
                      Don&apos;t (Banned Pattern)
                    </span>
                    <Badge variant="filled" colorRole="error" size="sm">Banned</Badge>
                  </div>
                  <div className="min-h-16 flex items-center justify-center p-3 rounded-lg bg-surface border border-outline-variant/40">
                    {check.dontExample}
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {check.bannedDescription}
                  </p>
                </div>

                {/* DO Column */}
                <div className="p-4 rounded-xl border border-success/40 bg-success-container/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-success/20 pb-2">
                    <span className="font-heading text-xs font-bold text-success flex items-center gap-1.5 uppercase tracking-wider">
                      <Icon name="check_circle" size="xs" />
                      Do (Required Implementation)
                    </span>
                    <Badge variant="filled" colorRole="success" size="sm">Compliant</Badge>
                  </div>
                  <div className="min-h-16 flex items-center justify-center p-3 rounded-lg bg-surface border border-outline-variant/40">
                    {check.doExample}
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {check.requiredDescription}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
};
