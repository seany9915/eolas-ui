import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { assetUrl } from '@/lib/utils';

export const BrandAssetsShowcase: React.FC = () => {
  const brandAssets = [
    { name: 'Primary Mark (Stacked)', file: assetUrl('/logos/primary-mark.svg'), bg: 'bg-surface', text: 'Standalone hero blocks, splash screens, welcome portals. Min 3rem padding.' },
    { name: 'Horizontal Lockup (Primary)', file: assetUrl('/logos/horizontal-lockup.svg'), bg: 'bg-surface', text: 'Main desktop navigation top bar (top-left alignment).' },
    { name: 'Horizontal Lockup (Amber)', file: assetUrl('/logos/horizontal-lockup-amber.svg'), bg: 'bg-surface', text: 'Interactive highlights, themed clinic dashboards.' },
    { name: 'Horizontal Lockup (Black)', file: assetUrl('/logos/horizontal-lockup-black.svg'), bg: 'bg-surface', text: 'Print media, legal utility docs, high-contrast monochrome.' },
    { name: 'Horizontal Lockup (White)', file: assetUrl('/logos/horizontal-lockup-white.svg'), bg: 'bg-on-surface', text: 'Inverted surfaces (Electric Blue or Charcoal containers).' },
    { name: 'Pictorial Mark (Symbol)', file: assetUrl('/logos/pictorial-mark.svg'), bg: 'bg-surface', text: 'High-density screen headers, favicons, account avatars (Min 32px).' },
    { name: 'Pictorial Mark (White)', file: assetUrl('/logos/pictorial-mark-white.svg'), bg: 'bg-on-surface', text: 'Inverted surfaces (Dark Charcoal / Electric Blue background containers).' },
    { name: 'Pictorial Mark (Pure White)', file: assetUrl('/logos/pictorial-mark-pure-white.svg'), bg: 'bg-on-surface', text: 'High-contrast monochrome inverted surfaces and dark mode favicons.' },
    { name: 'Pictorial Mark (Amber)', file: assetUrl('/logos/pictorial-mark-amber.svg'), bg: 'bg-on-surface', text: 'Inverted surface highlights, milestone avatars, streak badges on dark containers.' },
    { name: 'Pictorial Mark (Sunny Amber)', file: assetUrl('/logos/pictorial-mark-sunny-amber.svg'), bg: 'bg-on-surface', text: 'Warm high-saturation accent symbol for clinical achievement dashboards.' },
    { name: 'Pictorial Mark (Amber & White Blend)', file: assetUrl('/logos/pictorial-mark-amber-white.svg'), bg: 'bg-on-surface', text: 'Dynamic inverted surfaces combining Sunny Amber highlight and Pure White luminance gradient.' },
    { name: 'Pictorial Mark (Amber & White Bitone)', file: assetUrl('/logos/pictorial-mark-amber-white-bitone.svg'), bg: 'bg-on-surface', text: 'Dual-tone inverted mark pairing pure white phonic waves with amber core accent.' },
    { name: 'Wordmark (Logotype Only)', file: assetUrl('/logos/wordmark.svg'), bg: 'bg-surface', text: 'Internal widget footers, clean editorial headers.' },
    { name: 'Wordmark (Primary)', file: assetUrl('/logos/wordmark-primary.svg'), bg: 'bg-surface', text: 'Brand anchor editorial titles.' },
    { name: 'Wordmark (Amber)', file: assetUrl('/logos/wordmark-amber.svg'), bg: 'bg-surface', text: 'Accent editorial headers.' },
    { name: 'Wordmark (Black)', file: assetUrl('/logos/wordmark-black.svg'), bg: 'bg-surface', text: 'Monochrome footer branding.' },
    { name: 'Wordmark (White)', file: assetUrl('/logos/wordmark-white.svg'), bg: 'bg-on-surface', text: 'Inverted panel logotype lockups.' },
  ];

  return (
    <div className="space-y-10">
      {/* Guidance Callout */}
      <InlineAlert title="Eolas Brand Assets & Tonal Guidelines" role="neutral" icon="branding_watermark">
        Mark type (Stacked, Horizontal, Pictorial, Wordmark) and tonal variant (Primary, White, Black, Amber) are independent choices. Pick a mark type based on layout, then pick a tonal variant based on the background luminance.
      </InlineAlert>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandAssets.map((asset) => (
          <Card key={asset.name} variant="default" className="h-full">
            <div className="h-full flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <h4 className="font-heading text-sm font-bold text-on-surface truncate pr-2">{asset.name}</h4>
                  <span className="font-mono text-xs text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded shrink-0">SVG</span>
                </div>
                <div className={`p-4 rounded-md ${asset.bg} border border-outline-variant flex items-center justify-center h-32`}>
                  <img
                    src={asset.file}
                    alt={asset.name}
                    className="max-h-20 max-w-full object-contain"
                  />
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {asset.text}
                </p>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs font-label text-on-surface-variant shrink-0">
                <span>Vector Scalable</span>
                <span className="text-primary font-semibold">1:1 Vector Standard</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Contextual UI Showcase Section */}
      <div className="space-y-4 border-t border-outline-variant pt-8">
        <h3 className="font-heading text-xl font-bold text-on-surface">Integrated Real-World UI Lockups</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Hero Portal Block */}
          <Card variant="default" className="h-full">
            <div className="h-full flex flex-col items-center justify-between text-center space-y-4">
              <div className="space-y-4 flex flex-col items-center">
                <img src={assetUrl('/logos/primary-mark.svg')} alt="Stacked Mark" className="h-28 w-auto object-contain" />
                <h4 className="font-heading text-2xl font-bold text-on-surface">Welcome to Eolas Speech Therapy</h4>
                <p className="font-sans text-sm text-on-surface-variant max-w-md">
                  An accessible clinical speech therapy platform engineered for cognitive ease and WCAG 2.2 AA compliance.
                </p>
              </div>
              <Button colorRole="primary" size="md" className="mt-4">Start Daily Exercises</Button>
            </div>
          </Card>

          {/* Dark Charcoal Footer Lockup via Inverted Card Primitive */}
          <Card variant="inverted" className="h-full">
            <div className="flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <img src={assetUrl('/logos/horizontal-lockup-white.svg')} alt="White Lockup" className="h-8 w-auto object-contain" />
                <img src={assetUrl('/logos/wordmark-amber.svg')} alt="Amber Wordmark" className="h-5 w-auto object-contain" />
              </div>
              <p className="font-sans text-xs text-surface/80 leading-relaxed">
                Eolas Clinical Platform. Certified accessible healthcare technology built with Base UI primitives and Material Symbols.
              </p>
              <div className="border-t border-surface/20 pt-4 flex items-center justify-between text-xs text-surface/60 font-label">
                <span>© 2026 Eolas Healthcare Ltd.</span>
                <span>WCAG 2.2 AA Compliant</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
