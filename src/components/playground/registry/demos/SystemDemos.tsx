import * as React from 'react';
import { DirectionProvider } from '@/components/ui/direction-provider';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const DirectionProviderDemo: React.FC<ComponentDemoProps> = () => {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('rtl');
  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs font-bold text-on-surface">Direction Context Provider</span>
        <Button size="sm" variant="outlined" onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
          Toggle ({dir.toUpperCase()})
        </Button>
      </div>
      <DirectionProvider direction={dir}>
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2 text-xs font-sans">
          <p className="font-bold text-on-surface">مستشفى رويال فيكتوريا للأطفال (Royal Victoria Paediatric Hospital)</p>
          <p className="text-on-surface-variant">DirectionProvider sets the CSS `dir` context for bidirectional Base UI primitives.</p>
        </div>
      </DirectionProvider>
    </div>
  );
};

export const CspProviderDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-3">
      <div className="p-4 rounded-xl bg-surface border border-outline-variant space-y-2">
        <div className="flex items-center gap-2">
          <Icon name="security" size="sm" className="text-primary" />
          <span className="font-heading text-xs font-bold text-on-surface">CSP Provider (@base-ui/react/csp-provider)</span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Provides Content Security Policy nonce context to child Base UI popups, positioners, and portals for strict zero-eval zero-inline-script compliance.
        </p>
      </div>
    </div>
  );
};
