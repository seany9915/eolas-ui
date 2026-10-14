import * as React from 'react';
import { Header } from '@/components/playground/Header';
import { ColorTokensExplorer } from '@/components/playground/ColorTokensExplorer';
import { ComponentLibraryShowcase } from '@/components/playground/ComponentLibraryShowcase';
import { BrandAssetsShowcase } from '@/components/playground/BrandAssetsShowcase';
import { AntiPatternAuditBench } from '@/components/playground/AntiPatternAuditBench';
import { IconStylingShowcase } from '@/components/playground/IconStylingShowcase';
import { assetUrl } from '@/lib/utils';

export function App() {
  const [activeTab, setActiveTab] = React.useState('tokens');

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans transition-colors duration-200">
      {/* Skip Navigation Bypass Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-primary focus:border-2 focus:border-primary focus:rounded-md focus:shadow-ambient focus:font-label focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Playground Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        <h1 className="sr-only">Eolas Clinical Design System & Component Library</h1>
        <div key={activeTab}>
          {activeTab === 'tokens' && <ColorTokensExplorer />}
          {activeTab === 'components' && <ComponentLibraryShowcase />}
          {activeTab === 'icons' && <IconStylingShowcase />}
          {activeTab === 'brand' && <BrandAssetsShowcase />}
          {activeTab === 'audit' && <AntiPatternAuditBench />}
        </div>
      </main>

      {/* Clinical Playground Footer */}
      <footer className="bg-surface border-t border-outline-variant py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={assetUrl('/logos/pictorial-mark.svg')} alt="Eolas Symbol" className="h-7 w-7 object-contain" />
            <span className="font-label text-sm font-bold text-on-surface">Eolas Design System & Playground</span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant text-center sm:text-right">
            Engineered with Base UI primitives (<code className="bg-surface-variant px-1.5 py-0.5 rounded text-primary font-mono">@base-ui/react</code>), WCAG 2.2 AA contrast compliance, and Material Symbols.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
