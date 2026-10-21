import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { assetUrl, cn } from '@/lib/utils';

export interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const guidelineTabs = [
    {
      id: 'icons',
      label: 'Icon Styling Rules',
      shortLabel: 'Icon Rules',
      description: 'Material Symbols optical sizing, stroke weights, and tint rules',
      icon: 'category',
    },
    {
      id: 'brand',
      label: 'Brand Assets Integration',
      shortLabel: 'Brand Assets',
      description: 'Logo variants, brand marks, and horizontal lockup tokens',
      icon: 'branding_watermark',
    },
    {
      id: 'audit',
      label: 'Anti-Pattern & A11y Audit',
      shortLabel: 'Audit & A11y',
      description: 'Live WCAG AA compliance, contrast checks, and design law verification',
      icon: 'verified',
    },
  ];

  const isGuidelinesActive = ['icons', 'brand', 'audit'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant transition-colors">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 min-h-18 py-2 sm:py-0 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Horizontal Lockup Integration */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={assetUrl('/logos/horizontal-lockup.svg')}
            alt="Eolas Brand Logo"
            className="h-8 sm:h-9 w-auto object-contain max-h-10"
          />
          <div className="hidden md:block h-5 w-px bg-outline-variant" />
          <span className="hidden md:inline-block font-sans text-xs font-semibold text-on-surface-variant whitespace-nowrap">
            Playground & Component Library
          </span>
        </div>

        {/* Global Navigation Menu via Shared Base UI NavigationMenu Primitive */}
        <nav aria-label="Main Navigation" className="flex items-stretch justify-end min-w-0 self-stretch">
          <NavigationMenu.Root className="w-auto flex items-stretch">
            <NavigationMenu.List className="border-b-0 bg-transparent gap-1 sm:gap-2 p-0 min-w-0 flex items-stretch">
              {/* Tab 1: Color Tokens */}
              <NavigationMenu.Item value="tokens" className="flex items-stretch">
                <NavigationMenu.Link
                  href="#tokens"
                  variant="bar"
                  active={activeTab === 'tokens'}
                  onClick={(e) => {
                    e.preventDefault();
                    onTabChange('tokens');
                  }}
                  className="flex items-center"
                >
                  <Icon
                    name="palette"
                    size="sm"
                    className={cn(
                      'mr-1.5 sm:mr-2 shrink-0 transition-colors',
                      activeTab === 'tokens' ? 'text-primary' : 'text-on-surface-variant'
                    )}
                    aria-hidden="true"
                  />
                  <span className="hidden xl:inline whitespace-nowrap">Color Tokens & Color Law</span>
                  <span className="inline xl:hidden whitespace-nowrap">Color Tokens</span>
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {/* Tab 2: Components */}
              <NavigationMenu.Item value="components" className="flex items-stretch">
                <NavigationMenu.Link
                  href="#components"
                  variant="bar"
                  active={activeTab === 'components'}
                  onClick={(e) => {
                    e.preventDefault();
                    onTabChange('components');
                  }}
                  className="flex items-center"
                >
                  <Icon
                    name="widgets"
                    size="sm"
                    className={cn(
                      'mr-1.5 sm:mr-2 shrink-0 transition-colors',
                      activeTab === 'components' ? 'text-primary' : 'text-on-surface-variant'
                    )}
                    aria-hidden="true"
                  />
                  <span className="hidden xl:inline whitespace-nowrap">Base UI Component Library</span>
                  <span className="inline xl:hidden whitespace-nowrap">Components</span>
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {/* Tab 3: Guidelines & Audits Submenu */}
              <NavigationMenu.Item value="guidelines" className="relative flex items-stretch">
                <NavigationMenu.Trigger active={isGuidelinesActive} className="flex items-center">
                  <Icon
                    name="menu_book"
                    size="sm"
                    className={cn(
                      'mr-1.5 sm:mr-2 shrink-0 transition-colors',
                      isGuidelinesActive ? 'text-primary' : 'text-on-surface-variant'
                    )}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline whitespace-nowrap">Guidelines & Audits</span>
                  <span className="inline sm:hidden whitespace-nowrap">Guidelines</span>
                  <NavigationMenu.Icon />
                </NavigationMenu.Trigger>

                <NavigationMenu.Content>
                  <div className="flex flex-col gap-1 p-1">
                    {guidelineTabs.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <NavigationMenu.Link
                          key={item.id}
                          href={`#${item.id}`}
                          active={isActive}
                          onClick={(e) => {
                            e.preventDefault();
                            onTabChange(item.id);
                          }}
                          className={cn(
                            'flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer outline-none select-none text-left',
                            isActive
                              ? 'bg-primary-container text-on-primary-container font-semibold'
                              : 'text-on-surface hover:bg-surface-container focus:bg-surface-container'
                          )}
                        >
                          <div className="flex items-center gap-2 font-sans text-sm font-semibold">
                            <Icon
                              name={item.icon}
                              size="sm"
                              className={cn(
                                'shrink-0',
                                isActive ? 'text-primary' : 'text-on-surface-variant'
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.label}</span>
                            {isActive && (
                              <span
                                className="material-symbols-outlined text-base ml-auto text-primary leading-none"
                                aria-hidden="true"
                              >
                                check
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <span
                              className={cn(
                                'font-sans text-xs leading-relaxed pl-6',
                                isActive ? 'text-on-primary-container/85' : 'text-on-surface-variant'
                              )}
                            >
                              {item.description}
                            </span>
                          )}
                        </NavigationMenu.Link>
                      );
                    })}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Portal>
              <NavigationMenu.Positioner>
                <NavigationMenu.Popup>
                  <NavigationMenu.Arrow />
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>
        </nav>
      </div>
    </header>
  );
};
