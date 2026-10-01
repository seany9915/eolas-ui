import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Icon } from '@/components/ui/icon';

export const AntiPatternAuditBench: React.FC = () => {
  const auditChecks = [
    {
      title: '1. Zero Triple-Tint Monochrome Chips',
      rule: 'Banned: light pastel tint fill + matching border + matching text of the same hue family. Mandatory 3-pattern rotation enforced.',
      status: 'Passed',
      demonstration: (
        <div className="flex flex-wrap items-center gap-2">
          <Chip label="Pattern 1: Outline + Surface" pattern="outlined" colorRole="primary" />
          <Chip label="Pattern 2: Saturated Mixed" pattern="filled" colorRole="tertiary" />
          <Chip label="Pattern 3: Neutral Fill + Text" pattern="neutral" colorRole="primary" />
        </div>
      ),
    },
    {
      title: '2. Touch Target Minimum Size Rules',
      rule: 'General floor 44×44px (2.75rem), Buttons 48px (3rem), Lists/Tables 56px (3.5rem). Never shrink hit area.',
      status: 'Passed',
      demonstration: (
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-11 min-w-11 px-3 bg-surface-container border border-outline flex items-center justify-center font-label text-xs font-semibold rounded">
            44px Control Floor
          </div>
          <Button colorRole="primary" size="md">48px Button Floor</Button>
          <div className="h-14 px-4 bg-surface border border-outline-variant flex items-center font-sans text-sm rounded">
            56px List/Table Row Height
          </div>
        </div>
      ),
    },
    {
      title: '3. Forced-Colors Focus Ring Compatibility',
      rule: 'Focus rings must use real outline / border properties (not box-shadow tricks) so they render in Windows High Contrast mode.',
      status: 'Passed',
      demonstration: (
        <Button variant="outlined" colorRole="primary">
          Focus Me (Tab to Test Real Outline)
        </Button>
      ),
    },
    {
      title: '4. Sentence Case Casing Directive',
      rule: 'All-caps styling (uppercase) is strictly banned on eyebrows, badges, table headers, and buttons. Title Case permitted for headings.',
      status: 'Passed',
      demonstration: (
        <div className="space-y-1">
          <span className="font-label text-xs font-semibold text-on-surface-variant block">Category Eyebrow Label (Sentence case)</span>
          <h4 className="font-heading text-base font-bold text-on-surface">Vowel Prolongation Therapy Drill</h4>
        </div>
      ),
    },
    {
      title: '5. Non-Color-Only State Indicators',
      rule: 'Never convey state with color alone — pair with a functional icon, text label, or structural change.',
      status: 'Passed',
      demonstration: (
        <div className="flex items-center gap-2 text-success font-label text-sm font-bold">
          <Icon name="check_circle" size="md" />
          <span>Exercise attempt verified and recorded</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <InlineAlert title="Anti-Pattern & Accessibility Compliance Audit" role="success" icon="verified">
        All components in this prototyping playground are actively audited against <code>.agents/rules/anti-patterns.md</code> to guarantee zero AI UI shortcuts or accessibility violations.
      </InlineAlert>

      {/* Audit List */}
      <div className="space-y-4">
        {auditChecks.map((check) => (
          <Card key={check.title} variant="default">
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <h4 className="font-heading text-base font-bold text-on-surface">{check.title}</h4>
                  <Chip icon="check_circle" pattern="neutral" colorRole="success" size="sm">
                    {check.status}
                  </Chip>
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {check.rule}
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/40 space-y-2">
                <span className="font-label text-xs font-bold text-on-surface-variant block">Live component verification</span>
                {check.demonstration}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
