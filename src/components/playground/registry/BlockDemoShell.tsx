import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

export interface BlockDemoShellProps {
  name: string;
  description: string;
  whenToUse: string;
  badge?: string;
  typicalExample: React.ReactNode;
  variantsSection?: React.ReactNode;
  sizeLadderSection?: React.ReactNode;
  iconPermutationsSection?: React.ReactNode;
  pinnedStatesSection?: React.ReactNode;
  edgeCasesSection?: React.ReactNode;
}

export const BlockDemoShell: React.FC<BlockDemoShellProps> = ({
  name,
  description,
  whenToUse,
  badge = 'Tier A Primitive',
  typicalExample,
  variantsSection,
  sizeLadderSection,
  iconPermutationsSection,
  pinnedStatesSection,
  edgeCasesSection,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-4 text-left">
      {/* 1. Identity & When to Use */}
      <div className="flex flex-col gap-2 border-b border-outline-variant/60 pb-4">
        <div className="flex items-center gap-2.5">
          <Badge variant="soft" colorRole="primary" size="sm">
            {badge}
          </Badge>
          <h2 className="font-heading text-xl font-bold text-on-surface">{name}</h2>
        </div>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>
        <div className="mt-1 flex items-start gap-2 p-3 rounded-lg bg-surface-container/60 border border-outline-variant/40 text-xs font-sans text-on-surface">
          <Icon name="info" size="xs" className="text-primary mt-0.5 shrink-0" />
          <span>
            <strong className="font-bold">When to use:</strong> {whenToUse}
          </span>
        </div>
      </div>

      {/* 2. Typical Real-World Example */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">1</span>
            Typical Real-World Example
          </h3>
          <span className="font-mono text-[11px] text-on-surface-variant">Recommended default composition</span>
        </div>
        <Card className="p-6 bg-surface border border-outline-variant shadow-ambient flex items-center justify-center min-h-[120px]">
          {typicalExample}
        </Card>
      </section>

      {/* 3. Variants in Priority Order */}
      {variantsSection && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">2</span>
              Visual Variants
            </h3>
            <span className="font-mono text-[11px] text-on-surface-variant">Ranked in priority order</span>
          </div>
          <Card className="p-6 bg-surface border border-outline-variant shadow-ambient flex flex-wrap items-center justify-center gap-4">
            {variantsSection}
          </Card>
        </section>
      )}

      {/* 4. Size Ladder */}
      {sizeLadderSection && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">3</span>
              Size Ladder
            </h3>
            <span className="font-mono text-[11px] text-on-surface-variant">sm (44px) &rarr; md (48px floor) &rarr; lg (56px)</span>
          </div>
          <Card className="p-6 bg-surface border border-outline-variant shadow-ambient flex flex-wrap items-end justify-center gap-6">
            {sizeLadderSection}
          </Card>
        </section>
      )}

      {/* 5. Icon Permutations */}
      {iconPermutationsSection && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">4</span>
              Icon Permutations
            </h3>
            <span className="font-mono text-[11px] text-on-surface-variant">Leading, trailing, and icon-only</span>
          </div>
          <Card className="p-6 bg-surface border border-outline-variant shadow-ambient flex flex-wrap items-center justify-center gap-4">
            {iconPermutationsSection}
          </Card>
        </section>
      )}

      {/* 6. Pinned State Matrix */}
      {pinnedStatesSection && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">5</span>
              Interactive State Matrix
            </h3>
            <span className="font-mono text-[11px] text-on-surface-variant">Static data-preview simulation</span>
          </div>
          <Card className="p-6 bg-surface border border-outline-variant shadow-ambient">
            {pinnedStatesSection}
          </Card>
        </section>
      )}

      {/* 7. Edge Cases */}
      {edgeCasesSection && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">6</span>
              Edge Cases &amp; Extremes
            </h3>
            <span className="font-mono text-[11px] text-on-surface-variant">Text overflow, full width, and boundary constraints</span>
          </div>
          <Card className="p-6 bg-surface border border-outline-variant shadow-ambient flex flex-col gap-4">
            {edgeCasesSection}
          </Card>
        </section>
      )}
    </div>
  );
};
