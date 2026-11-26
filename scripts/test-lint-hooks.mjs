#!/usr/bin/env node
/**
 * Automated verification suite for Eolas Oxlint rules and Antigravity agent hooks.
 * Runs real `oxlint` against isolated temp fixtures and executes hook scripts via stdio.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OXLINT_BIN = path.join(REPO_ROOT, 'node_modules', 'oxlint', 'bin', 'oxlint');
const EOLAS_OXLINT_RC = path.join(REPO_ROOT, 'packages', 'eolas-ui', 'lint', 'oxlintrc.json');
const HOOKS_DIR = path.join(REPO_ROOT, '.agents', 'scripts');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL  ${name}`);
    console.error(`        ${err?.stack || err}`);
  }
}

function runHook(scriptName, payload, cwd = REPO_ROOT) {
  const scriptPath = path.join(HOOKS_DIR, scriptName);
  const res = spawnSync(process.execPath, [scriptPath], {
    cwd,
    input: JSON.stringify(payload),
    encoding: 'utf8',
    timeout: 20000,
  });
  if (res.error) throw res.error;
  assert.equal(res.status, 0, `${scriptName} exited with ${res.status}: ${res.stderr}`);
  const out = (res.stdout || '').trim();
  return out ? JSON.parse(out) : {};
}

function runOxlintJson(workDir, files) {
  const res = spawnSync(process.execPath, [OXLINT_BIN, '--format', 'json', ...files], {
    cwd: workDir,
    encoding: 'utf8',
    timeout: 20000,
  });
  if (res.error) throw res.error;
  const raw = (res.stdout || '').trim();
  assert.ok(raw, `oxlint produced empty JSON output. stderr: ${res.stderr}`);
  const parsed = JSON.parse(raw);
  const diagnostics = Array.isArray(parsed) ? parsed : parsed.diagnostics || [];
  return diagnostics;
}

function rulesForFile(diagnostics, fileSuffix) {
  const normSuffix = fileSuffix.replace(/\\/g, '/');
  return diagnostics
    .filter((d) => {
      const f = (d.filename || d.file || '').replace(/\\/g, '/');
      return f.endsWith(normSuffix);
    })
    .map((d) => d.code || d.rule_id || d.ruleId || '');
}

function installOxlintShim(targetDir) {
  const binDir = path.join(targetDir, 'node_modules', 'oxlint', 'bin');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(
    path.join(targetDir, 'node_modules', 'oxlint', 'package.json'),
    JSON.stringify({ name: 'oxlint', type: 'commonjs', bin: { oxlint: 'bin/oxlint' } })
  );
  const shimPath = path.join(binDir, 'oxlint');
  fs.writeFileSync(
    shimPath,
    `const { spawnSync } = require('node:child_process');\n` +
      `const res = spawnSync(process.execPath, [${JSON.stringify(OXLINT_BIN)}, ...process.argv.slice(2)], { stdio: 'inherit' });\n` +
      `process.exit(res.status ?? 1);\n`
  );
  return shimPath;
}

function cleanupTempDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

function git(cwd, args) {
  const res = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    timeout: 10000,
  });
  if (res.error) throw res.error;
  assert.equal(res.status, 0, `git ${args.join(' ')} failed (${res.status}): ${res.stderr}`);
  return res.stdout;
}

// ============================================================================
// 1. OXLINT CUSTOM PLUGIN & CONFIG TESTS
// ============================================================================
console.log('\n[1/5] Oxlint rules (packages/eolas-ui/lint/index.mjs & oxlintrc.json)');

const lintTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eolas-lint-test-'));

try {
  fs.mkdirSync(path.join(lintTmp, 'src', 'components', 'ui'), { recursive: true });
  fs.copyFileSync(path.join(REPO_ROOT, 'src', 'globals.css'), path.join(lintTmp, 'src', 'globals.css'));
  fs.writeFileSync(path.join(lintTmp, 'package.json'), JSON.stringify({ name: 'lint-fixture', private: true }));
  fs.writeFileSync(
    path.join(lintTmp, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } } })
  );
  fs.writeFileSync(
    path.join(lintTmp, 'src', 'components', 'ui', 'context-menu.tsx'),
    'export const ContextMenuContent = (_p: { className?: string }) => null;\n'
  );
  fs.writeFileSync(
    path.join(lintTmp, 'src', 'components', 'ui', 'preview-card.tsx'),
    'export const PreviewCardPopup = (_p: { className?: string }) => null;\n'
  );
  fs.writeFileSync(
    path.join(lintTmp, 'src', 'components', 'ui', 'menubar.tsx'),
    'export const MenubarContent = (_p: { className?: string }) => null;\n'
  );
  fs.writeFileSync(
    path.join(lintTmp, 'src', 'components', 'ui', 'navigation-menu.tsx'),
    'export const NavigationMenuContent = (_p: { className?: string }) => null;\n'
  );
  fs.writeFileSync(
    path.join(lintTmp, 'components.json'),
    JSON.stringify(
      {
        tailwind: {
          css: 'src/globals.css',
        },
        aliases: {
          components: '@/components',
          ui: '@/components/ui',
          utils: '@/lib/utils',
        },
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(lintTmp, '.oxlintrc.json'),
    JSON.stringify(
      {
        extends: [EOLAS_OXLINT_RC.replace(/\\/g, '/')],
      },
      null,
      2
    )
  );

  const fixtures = {
    'src/tw-important-bad.tsx': `
      export function BadImportant() {
        return (
          <div className="uppercase! transition-all! text-tertiary! hover:bg-primary/50!">
            <span className="!uppercase hover:!text-tertiary">Hi</span>
          </div>
        );
      }
    `,
    'src/tw-important-triple-bad.tsx': `
      export function BadImportantTriple() {
        return <div className="hover:bg-primary-container/50! hover:border-primary! hover:text-primary!">Hi</div>;
      }
    `,
    'src/ime-neq-bad.tsx': `
      export function BadImeNeq({ submit }: { submit: () => void }) {
        return (
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              submit();
            }}
          />
        );
      }
    `,
    'src/ime-preceding-guard-ok.tsx': `
      export function GoodImeGuard({ submit }: { submit: () => void }) {
        return (
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key !== 'Enter') return;
              submit();
            }}
          />
        );
      }
    `,
    'src/ime-nested-destructure-ok.tsx': `
      export function GoodImeNested({ submit }: { submit: () => void }) {
        return (
          <input
            type="text"
            onKeyDown={({ key, nativeEvent: { isComposing } }) => {
              if (isComposing || key !== 'Enter') return;
              submit();
            }}
          />
        );
      }
    `,
    'src/ime-ts-as-bad.tsx': `
      import type * as React from 'react';
      export function BadImeCast({ submit }: { submit: () => void }) {
        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') submit();
        };
        return <input type="text" onKeyDown={handleKeyDown as React.KeyboardEventHandler} />;
      }
    `,
    'src/triple-tint-split-bad.tsx': `
      const cn = (...a: unknown[]) => a.filter(Boolean).join(' ');
      export function BadSplitTriple({ active }: { active: boolean }) {
        return <div className={cn('bg-primary-container border-primary', active && 'text-primary')}>Hi</div>;
      }
    `,
    'src/triple-tint-obj-bad.tsx': `
      const cn = (...a: unknown[]) => a.filter(Boolean).join(' ');
      export function BadObjTriple({ a }: { a: boolean }) {
        return <div className={cn({ 'bg-primary-container': a, 'border-primary': a, 'text-primary': a })}>Hi</div>;
      }
    `,
    'src/triple-tint-ternary-ok.tsx': `
      const cn = (...a: unknown[]) => a.filter(Boolean).join(' ');
      export function GoodTernary({ cond }: { cond: boolean }) {
        return <div className={cn(cond ? 'bg-primary-container' : 'border-primary text-primary')}>Hi</div>;
      }
    `,
    'src/triple-tint-var-bad.tsx': `
      export function BadVarTriple() {
        const cls = 'bg-primary-container border-primary text-primary';
        return <div className={cls}>Hi</div>;
      }
    `,
    'src/tertiary-directional-bad.tsx': `
      export function BadDirectionalTertiary() {
        return (
          <div className="border-s-tertiary">
            <span className="ring-tertiary outline-tertiary">Hi</span>
          </div>
        );
      }
    `,
    'src/tertiary-spotlight-ok.tsx': `
      const cn = (...a: unknown[]) => a.filter(Boolean).join(' ');
      const Card = (_p: { variant?: string; prominence?: string; children?: unknown }) => null;
      export function GoodSpotlight() {
        const hoisted = cn('text-tertiary');
        return (
          <div>
            <Card variant="spotlight">
              <span className="text-tertiary border-s-tertiary">Highlight</span>
            </Card>
            <Card prominence="inverted">
              <span className={hoisted}>Hoisted inverted</span>
            </Card>
          </div>
        );
      }
    `,
    'src/tertiary-hoisted-light-bad.tsx': `
      const cn = (...a: unknown[]) => a.filter(Boolean).join(' ');
      export function BadHoistedLight() {
        const hoisted = cn('text-tertiary');
        return <div className={hoisted}>Light surface</div>;
      }
    `,
    'src/tertiary-bg-cn-ok.tsx': `
      const cn = (...a: unknown[]) => a.filter(Boolean).join(' ');
      export function GoodBgTertiaryCn({ active }: { active: boolean }) {
        return <div className={cn('bg-tertiary', active && 'border-tertiary')}>Solid amber</div>;
      }
    `,
    'src/raw-html-fragment-bad.tsx': `
      const Trigger = (_p: { render?: unknown }) => null;
      export function BadFragmentRender() {
        return <Trigger render={<><button type="button">A</button></>} />;
      }
    `,
    'src/raw-html-root-ok.tsx': `
      const Trigger = (_p: { render?: unknown }) => null;
      export function GoodRootRender() {
        return <Trigger render={<button type="button">A</button>} />;
      }
    `,
    'src/static-clickable-bad.tsx': `
      export function BadStaticClickable({ onClick }: { onClick: () => void }) {
        return (
          <div>
            <h2 onClick={onClick}>Heading</h2>
            <div role="region" tabIndex={0} onClick={onClick} onKeyDown={onClick}>
              Landmark
            </div>
          </div>
        );
      }
    `,
    'src/static-clickable-ok.tsx': `
      export function GoodStaticClickable({ onClick }: { onClick: () => void }) {
        return (
          <div role="button" tabIndex={0} onClick={onClick} onKeyDown={onClick}>
            Interactive
          </div>
        );
      }
    `,
    'src/spring-memo-forwardref-ok.tsx': `
      import * as React from 'react';
      export const SuccessCheck = React.memo(
        React.forwardRef<HTMLDivElement>(function SuccessCheckInner(_props, ref) {
          return <div ref={ref} className="ease-spring">Done</div>;
        })
      );
    `,
    'src/spring-standard-panel-bad.tsx': `
      import * as React from 'react';
      export const PlainPanel = React.memo(
        React.forwardRef<HTMLDivElement>(function PlainPanelInner(_props, ref) {
          return <div ref={ref} className="ease-spring">Panel</div>;
        })
      );
    `,
    'src/tier-b-overlay-restyle-bad.tsx': `
      import { ContextMenuContent } from '@/components/ui/context-menu';
      import { PreviewCardPopup } from '@/components/ui/preview-card';
      import { MenubarContent } from '@/components/ui/menubar';
      import { NavigationMenuContent } from '@/components/ui/navigation-menu';
      export function BadOverlays() {
        return (
          <div>
            <ContextMenuContent className="w-72 bg-surface rounded-xl shadow-lg" />
            <PreviewCardPopup className="w-72 bg-surface rounded-xl shadow-lg" />
            <MenubarContent className="w-72 bg-surface rounded-xl shadow-lg" />
            <NavigationMenuContent className="w-72 bg-surface rounded-xl shadow-lg" />
          </div>
        );
      }
    `,
    'src/features/ConsumerShowcase.tsx': `
      export function ConsumerShowcase() {
        return <button type="button">Not exempted in consumer config</button>;
      }
    `,
    'src/uppercase-var-bad.tsx': `
      export function BadVarUppercase() {
        const cls = 'uppercase';
        return <span className={cls}>Title</span>;
      }
    `,
    'src/transition-all-bracket-bad.tsx': `
      export function BadBracketTransition() {
        return (
          <div>
            <div className="transition-[all]" />
            <div className="transition-[all_200ms_ease]" />
            <div className="hover:transition-[opacity,all_150ms]" />
          </div>
        );
      }
    `,
    'src/transition-all-bracket-ok.tsx': `
      export function GoodBracketTransition() {
        return (
          <div>
            <div className="transition-[opacity,transform]" />
            <div className="transition-[--all-props]" />
          </div>
        );
      }
    `,
    'src/tertiary-extended-bad.tsx': `
      export function BadExtendedTertiary() {
        return (
          <div>
            <span className="decoration-tertiary">Deco</span>
            <svg className="stroke-tertiary/80 fill-tertiary" />
          </div>
        );
      }
    `,
    'src/raw-html-block-ok.tsx': `
      const Trigger = (_p: { render?: unknown }) => null;
      export function GoodBlockRender({ active }: { active: boolean }) {
        return (
          <Trigger
            render={(props: Record<string, unknown>) => {
              const cls = active ? 'opacity-100' : 'opacity-50';
              return <button {...props} type="button" className={cls}>Open</button>;
            }}
          />
        );
      }
    `,
    'src/raw-html-block-var-bad.tsx': `
      const Trigger = (_p: { render?: unknown }) => null;
      export function BadBlockVarRender() {
        return (
          <Trigger
            render={(props: Record<string, unknown>) => {
              const rogue = <button type="button">Rogue</button>;
              return <span {...props}>{rogue}</span>;
            }}
          />
        );
      }
    `,
    'src/raw-html-lowercase-render-bad.tsx': `
      export function BadLowercaseRender() {
        return <div data-x="1" {...({ render: <button type="button">A</button> } as Record<string, unknown>)} />;
      }
    `,
    'src/raw-html-lowercase-attr-bad.tsx': `
      export function BadLowercaseAttrRender() {
        return <div render={<button type="button">A</button>} />;
      }
    `,
    'src/components/ui/bad-ui-layer.tsx': `
      import { ChartCard } from '@/components/blocks/chart-card';
      export function BadUiLayer() {
        return <ChartCard />;
      }
    `,
    'src/components/blocks/bad-block-layer.tsx': `
      import { SecretForm } from '@/features/secret-form';
      export function BadBlockLayer() {
        return <SecretForm />;
      }
    `,
    'src/components/blocks/ok-block-layer.tsx': `
      import { ChartCard } from '@/components/blocks/chart-card';
      import { ContextMenuContent } from '@/components/ui/context-menu';
      export function OkBlockLayer() {
        return <ContextMenuContent />;
      }
    `,
    'src/components/blocks/bad-service-layer.tsx': `
      import { fetchPatient } from '@/services/patients';
      import { doc } from 'firebase/firestore';
      export function BadServiceLayer() {
        return String(Boolean(fetchPatient && doc));
      }
    `,
    'src/nested-chart-card-bad.tsx': `
      const ChartCard = ({ children }: { children?: unknown }) => children;
      const Card = ({ children }: { children?: unknown }) => children;
      export function BadNestedChartCard() {
        return (
          <ChartCard>
            <Card>Inner</Card>
          </ChartCard>
        );
      }
    `,
    'src/wrapped-bad.tsx': `
      import { Dialog } from '@base-ui/react/dialog';
      export function BadWrapped() {
        return <Dialog.Root />;
      }
    `,
    'src/wrapped-type-ok.tsx': `
      import type { DialogRootProps } from '@base-ui/react/dialog';
      export type LocalDialogProps = DialogRootProps;
    `,
    'src/lib/utils.ts': `
      export { mergeProps } from '@base-ui/react/merge-props';
      export { useRender } from '@base-ui/react/use-render';
    `,
    'src/reach-in-bad.tsx': `
      const Button = (_p: { className?: string }) => null;
      export function BadReachIn() {
        return <Button className="[&_svg]:text-error [&>span]:font-medium" />;
      }
    `,
    'src/reach-in-self-ok.tsx': `
      export function GoodSelfSelector() {
        return <div className='[&[hidden]:not([hidden="until-found"])]:hidden' />;
      }
    `,
    'src/icon-button-bad.tsx': `
      const Button = (_p: { size?: string; children?: unknown }) => null;
      const Icon = (_p: { name: string }) => null;
      export function BadIconBtn() {
        return (
          <Button size="icon">
            <Icon name="close" />
          </Button>
        );
      }
    `,
    'src/icon-button-ok.tsx': `
      const Button = (_p: { size?: string; 'aria-label'?: string; children?: unknown }) => null;
      const Icon = (_p: { name: string }) => null;
      export function WrappedIconBtn({ ...rest }: Record<string, unknown>) {
        return (
          <Button size="icon" {...rest}>
            <Icon name="close" />
          </Button>
        );
      }
      export function GoodIconBtns() {
        return (
          <div>
            <Button size="icon" aria-label="Close">
              <Icon name="close" />
            </Button>
            <Button size="icon">
              <Icon name="close" />
              <span className="sr-only">Close</span>
            </Button>
            <Button size="icon" {...{ 'aria-label': 'Inspect' }}>
              <Icon name="close" />
            </Button>
          </div>
        );
      }
    `,
    'src/icon-button-spread-bad.tsx': `
      const Button = (_p: { size?: string; children?: unknown }) => null;
      const Icon = (_p: { name: string }) => null;
      export function BadSpreadIconBtn({ extraProps }: { extraProps: Record<string, unknown> }) {
        return (
          <Button size="icon" {...extraProps}>
            <Icon name="close" />
          </Button>
        );
      }
    `,
    'src/prefer-shorthand-bad.tsx': `
      export function BadShorthand() {
        return (
          <div className="space-y-4">
            <div className="w-4 h-4" />
            <div className="h-screen" />
          </div>
        );
      }
    `,
    'src/prefer-shorthand-ok.tsx': `
      export function GoodShorthand({ wide }: { wide: boolean }) {
        return (
          <div className="flex flex-col gap-4">
            <div className="size-4 w-4 h-6 w-auto h-auto h-dvh" />
            <div className={wide ? 'w-4' : 'h-4'} />
          </div>
        );
      }
    `,
    'src/dark-variant-bad.tsx': `
      export function BadDarkVariant() {
        return <div className="dark:bg-surface md:dark:text-on-surface" />;
      }
    `,
    'src/dark-variant-ok.tsx': `
      export function GoodInvertedSurface() {
        return <div className="inverted:text-on-surface" />;
      }
    `,
    'src/important-mod-bad.tsx': `
      export function BadImportantMod() {
        return <div className="!p-0 h-8!" />;
      }
    `,
    'src/rebuilt-overlay-bad.tsx': `
      export function BadRebuiltOverlay() {
        return <div className="fixed inset-0 bg-on-surface/50" />;
      }
    `,
    'src/rebuilt-overlay-ok.tsx': `
      export function GoodBackdrop() {
        return <div className="absolute inset-0 bg-on-surface/40" />;
      }
    `,
  };

  for (const [relPath, content] of Object.entries(fixtures)) {
    const abs = path.join(lintTmp, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content.trimStart());
  }

  const diagnostics = runOxlintJson(lintTmp, Object.keys(fixtures));

  test('Tailwind v4 trailing & leading ! parsed before opacity slash (H1)', () => {
    const codes = rulesForFile(diagnostics, 'src/tw-important-bad.tsx');
    assert.ok(codes.includes('eolas(no-uppercase)'), `expected no-uppercase, got ${codes}`);
    assert.ok(codes.includes('eolas(no-transition-all)'), `expected no-transition-all, got ${codes}`);
    assert.ok(codes.includes('eolas(no-light-surface-tertiary)'), `expected no-light-surface-tertiary, got ${codes}`);

    const tripleCodes = rulesForFile(diagnostics, 'src/tw-important-triple-bad.tsx');
    assert.ok(tripleCodes.includes('eolas(no-triple-tint)'), `expected no-triple-tint with trailing ! + /50, got ${tripleCodes}`);
  });

  test('require-iscomposing-on-enter catches !== Enter & TS cast, allows preceding guard & nested destructuring (H2)', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/ime-neq-bad.tsx').includes('eolas(require-iscomposing-on-enter)'),
      'expected !== Enter to be flagged'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/ime-preceding-guard-ok.tsx').includes('eolas(require-iscomposing-on-enter)'),
      'expected preceding isComposing guard to pass'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/ime-nested-destructure-ok.tsx').includes('eolas(require-iscomposing-on-enter)'),
      'expected nested param destructuring nativeEvent: { isComposing } to pass'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/ime-ts-as-bad.tsx').includes('eolas(require-iscomposing-on-enter)'),
      'expected handler wrapped in TS as expression to be resolved and flagged'
    );
  });

  test('no-triple-tint catches split cn(), object syntax, and local const var, allows mutually exclusive ternary (H3)', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/triple-tint-split-bad.tsx').includes('eolas(no-triple-tint)'),
      'expected split cn() triple-tint to be flagged'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/triple-tint-obj-bad.tsx').includes('eolas(no-triple-tint)'),
      'expected object expression triple-tint to be flagged'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/triple-tint-ternary-ok.tsx').includes('eolas(no-triple-tint)'),
      'expected mutually exclusive ternary to be allowed'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/triple-tint-var-bad.tsx').includes('eolas(no-triple-tint)'),
      'expected local const string variable triple-tint to be flagged'
    );
  });

  test('no-light-surface-tertiary catches directional border/ring/outline & hoisted light var; allows Card variant="spotlight", hoisted inverted var, and bg-tertiary in cn() (H3)', () => {
    const dirCodes = rulesForFile(diagnostics, 'src/tertiary-directional-bad.tsx').filter(
      (c) => c === 'eolas(no-light-surface-tertiary)'
    );
    assert.ok(dirCodes.length >= 2, `expected directional border and ring/outline errors, got ${dirCodes}`);
    assert.ok(
      !rulesForFile(diagnostics, 'src/tertiary-spotlight-ok.tsx').includes('eolas(no-light-surface-tertiary)'),
      'expected Card variant="spotlight" and hoisted cn inside inverted Card to pass'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/tertiary-hoisted-light-bad.tsx').includes('eolas(no-light-surface-tertiary)'),
      'expected hoisted cn("text-tertiary") on light div to be flagged'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/tertiary-bg-cn-ok.tsx').includes('eolas(no-light-surface-tertiary)'),
      'expected cn("bg-tertiary", active && "border-tertiary") to pass'
    );
  });

  test('no-raw-html-controls blocks raw <button> inside JSXFragment render prop, allows root render element (M1)', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/raw-html-fragment-bad.tsx').includes('eolas(no-raw-html-controls)'),
      'expected raw <button> inside JSXFragment render prop to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/raw-html-root-ok.tsx').includes('eolas(no-raw-html-controls)'),
      'expected root render={<button />} to be allowed'
    );
  });

  test('no-static-clickable-elements flags expanded static tags (h2) and non-interactive roles (region), allows interactive roles (M5)', () => {
    const badCodes = rulesForFile(diagnostics, 'src/static-clickable-bad.tsx').filter(
      (c) => c === 'eolas(no-static-clickable-elements)'
    );
    assert.equal(badCodes.length, 2, `expected 2 static-clickable errors (h2 + role=region), got ${badCodes.length}`);
    assert.ok(
      !rulesForFile(diagnostics, 'src/static-clickable-ok.tsx').includes('eolas(no-static-clickable-elements)'),
      'expected role="button" + tabIndex + onKeyDown to pass'
    );
  });

  test('no-spring-easing unwraps nested React.memo(React.forwardRef(...)) wrappers (L2)', () => {
    assert.ok(
      !rulesForFile(diagnostics, 'src/spring-memo-forwardref-ok.tsx').includes('eolas(no-spring-easing)'),
      'expected SuccessCheck wrapped in memo(forwardRef(...)) to allow ease-spring'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/spring-standard-panel-bad.tsx').includes('eolas(no-spring-easing)'),
      'expected non-celebratory component wrapped in memo(forwardRef(...)) to flag ease-spring'
    );
  });

  test('Tier B overlays (ContextMenu, PreviewCard, Menubar, NavigationMenu) enforced by shadcn/no-restyle', () => {
    const restyleDiags = diagnostics.filter((d) => {
      const f = (d.filename || d.file || '').replace(/\\/g, '/');
      return f.endsWith('src/tier-b-overlay-restyle-bad.tsx') && (d.code || d.rule_id || d.ruleId) === 'shadcn(no-restyle)';
    });
    assert.equal(restyleDiags.length, 12, `expected 12 shadcn/no-restyle errors (4 overlays x 3 denied tokens), got ${restyleDiags.length}`);
    assert.ok(
      restyleDiags.every((d) => /Tier B overlay popups/.test(d.message || '')),
      'expected custom Tier B overlay contract message on all 12 diagnostics'
    );
  });

  test('consumer oxlintrc.json does not exempt *Showcase.tsx files', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/features/ConsumerShowcase.tsx').includes('eolas(no-raw-html-controls)'),
      'expected ConsumerShowcase.tsx to still enforce eolas/no-raw-html-controls under consumer config'
    );
  });

  test('local const string variable checked by no-uppercase', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/uppercase-var-bad.tsx').includes('eolas(no-uppercase)'),
      'expected const cls = "uppercase" used in JSX className to be flagged'
    );
  });

  test('no-transition-all catches transition-[all] and underscore/comma arbitrary forms without false-positives', () => {
    const badCodes = rulesForFile(diagnostics, 'src/transition-all-bracket-bad.tsx').filter(
      (c) => c === 'eolas(no-transition-all)'
    );
    assert.equal(badCodes.length, 3, `expected 3 no-transition-all errors for bracket variants, got ${badCodes.length}`);
    assert.ok(
      !rulesForFile(diagnostics, 'src/transition-all-bracket-ok.tsx').includes('eolas(no-transition-all)'),
      'expected transition-[opacity,transform] and transition-[--all-props] to pass'
    );
  });

  test('no-light-surface-tertiary catches decoration, fill, and stroke-tertiary with opacity', () => {
    const codes = rulesForFile(diagnostics, 'src/tertiary-extended-bad.tsx').filter(
      (c) => c === 'eolas(no-light-surface-tertiary)'
    );
    assert.equal(codes.length, 2, `expected 2 no-light-surface-tertiary errors, got ${codes.length}`);
  });

  test('no-raw-html-controls allows block-body render return, blocks rogue block vars and lowercase HTML render props', () => {
    assert.ok(
      !rulesForFile(diagnostics, 'src/raw-html-block-ok.tsx').includes('eolas(no-raw-html-controls)'),
      'expected returned <button> in block-body render callback to be allowed'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/raw-html-block-var-bad.tsx').includes('eolas(no-raw-html-controls)'),
      'expected non-returned const rogue = <button /> inside block-body render to be blocked'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/raw-html-lowercase-attr-bad.tsx').includes('eolas(no-raw-html-controls)'),
      'expected <div render={<button />} /> lowercase HTML render prop to be blocked'
    );
  });

  test('one-way-imports enforces ui -> blocks -> features/views boundary', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/components/ui/bad-ui-layer.tsx').includes('eolas(one-way-imports)'),
      'expected ui primitive importing blocks/ to be blocked'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/components/blocks/bad-block-layer.tsx').includes('eolas(one-way-imports)'),
      'expected block importing features/ to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/components/blocks/ok-block-layer.tsx').includes('eolas(one-way-imports)'),
      'expected block importing blocks/ and ui/ to pass'
    );
    const serviceLayerDiags = rulesForFile(diagnostics, 'src/components/blocks/bad-service-layer.tsx').filter(
      (c) => c === 'eolas(one-way-imports)'
    );
    assert.equal(serviceLayerDiags.length, 2, `expected 2 one-way-imports errors for services/ and firebase/firestore, got ${serviceLayerDiags.length}`);
  });

  test('no-nested-card catches Card nested inside ChartCard', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/nested-chart-card-bad.tsx').includes('eolas(no-nested-card)'),
      'expected <Card> inside <ChartCard> to be flagged by no-nested-card'
    );
  });

  test('wrapped-libraries blocks direct headless UI imports outside ui/ while allowing type-only imports', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/wrapped-bad.tsx').includes('eolas(wrapped-libraries)'),
      'expected runtime @base-ui/react import outside ui/ to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/wrapped-type-ok.tsx').includes('eolas(wrapped-libraries)'),
      'expected import type from @base-ui/react to pass'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/lib/utils.ts').includes('eolas(wrapped-libraries)'),
      'expected src/lib/utils.ts re-exporting @base-ui/react/merge-props and use-render to pass'
    );
  });

  test('no-reach-in-selectors blocks [&_...] on components without flagging self-selectors on elements', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/reach-in-bad.tsx').includes('eolas(no-reach-in-selectors)'),
      'expected [&_svg] on <Button> to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/reach-in-self-ok.tsx').includes('eolas(no-reach-in-selectors)'),
      'expected self-selector [&[hidden]:not([hidden="until-found"])]:hidden to pass'
    );
  });

  test('icon-button-label catches unlabeled icon-only buttons and allows aria-label or sr-only text', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/icon-button-bad.tsx').includes('eolas(icon-button-label)'),
      'expected <Button size="icon"><Icon name="close" /></Button> to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/icon-button-ok.tsx').includes('eolas(icon-button-label)'),
      'expected aria-label, sr-only, wrapper rest spread, and object-literal aria-label to pass'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/icon-button-spread-bad.tsx').includes('eolas(icon-button-label)'),
      'expected arbitrary non-rest spread {...extraProps} without aria-label to be blocked'
    );
  });

  test('prefer-shorthand catches w-X h-X, space-y-*, and h-screen while allowing ternary splits and shorthands', () => {
    const badCodes = rulesForFile(diagnostics, 'src/prefer-shorthand-bad.tsx').filter(
      (c) => c === 'eolas(prefer-shorthand)'
    );
    assert.equal(badCodes.length, 3, `expected 3 prefer-shorthand diagnostics, got ${badCodes.length}`);
    assert.ok(
      !rulesForFile(diagnostics, 'src/prefer-shorthand-ok.tsx').includes('eolas(prefer-shorthand)'),
      'expected size-4, w-4 h-6, w-auto h-auto, h-dvh, and ternary splits to pass'
    );
  });

  test('no-dark-variant, no-important, and no-rebuilt-overlay enforce Eolas surface, override, and overlay rules', () => {
    assert.ok(
      rulesForFile(diagnostics, 'src/dark-variant-bad.tsx').includes('eolas(no-dark-variant)'),
      'expected dark: variant to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/dark-variant-ok.tsx').includes('eolas(no-dark-variant)'),
      'expected inverted: variant to pass'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/important-mod-bad.tsx').includes('eolas(no-important)'),
      'expected ! modifier to be blocked'
    );
    assert.ok(
      rulesForFile(diagnostics, 'src/rebuilt-overlay-bad.tsx').includes('eolas(no-rebuilt-overlay)'),
      'expected fixed inset-0 overlay div to be blocked'
    );
    assert.ok(
      !rulesForFile(diagnostics, 'src/rebuilt-overlay-ok.tsx').includes('eolas(no-rebuilt-overlay)'),
      'expected absolute inset-0 backdrop to pass'
    );
  });
} finally {
  cleanupTempDir(lintTmp);
}

// ============================================================================
// 2. CHECK-OXLINT-ON-STOP HOOK TESTS (ISOLATED TEMP GIT REPO)
// ============================================================================
console.log('\n[2/5] check-oxlint-on-stop.mjs (isolated git repo + monorepo subdir)');

const gitTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eolas-stop-hook-test-'));

try {
  git(gitTmp, ['init']);
  git(gitTmp, ['config', 'user.email', 'test@example.com']);
  git(gitTmp, ['config', 'user.name', 'Test User']);

  installOxlintShim(gitTmp);
  fs.writeFileSync(path.join(gitTmp, '.gitignore'), 'node_modules/\n');
  fs.writeFileSync(
    path.join(gitTmp, '.oxlintrc.json'),
    JSON.stringify({ extends: [EOLAS_OXLINT_RC.replace(/\\/g, '/')] }, null, 2)
  );

  const srcDir = path.join(gitTmp, 'src');
  fs.mkdirSync(srcDir, { recursive: true });
  const cleanFile = path.join(srcDir, 'Clean.tsx');
  const deleteTarget = path.join(srcDir, 'ToDelete.tsx');
  const renameSrc = path.join(srcDir, 'RenameOld.tsx');

  fs.writeFileSync(cleanFile, 'export function Clean() { return <div className="flex">Ok</div>; }\n');
  fs.writeFileSync(deleteTarget, 'export function ToDelete() { return <div className="uppercase">Del</div>; }\n');
  fs.writeFileSync(renameSrc, 'export function RenameMe() { return <div className="flex">Rename</div>; }\n');

  git(gitTmp, ['add', 'src', '.oxlintrc.json', '.gitignore']);
  git(gitTmp, ['commit', '-m', 'initial']);

  test('clean repo returns empty no-op response', () => {
    const out = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [gitTmp] }, gitTmp);
    assert.deepEqual(out, {});
  });

  test('dirty modified .tsx file triggers decision: continue', () => {
    fs.writeFileSync(cleanFile, 'export function Clean() { return <div className="uppercase">Bad</div>; }\n');
    const out = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [gitTmp] }, gitTmp);
    assert.equal(out.decision, 'continue', `expected continue, got ${JSON.stringify(out)}`);
    assert.match(out.reason, /no-uppercase/);
  });

  test('continuationActive: true skips cleanly even with dirty errors', () => {
    const out = runHook(
      'check-oxlint-on-stop.mjs',
      { workspacePaths: [gitTmp], continuationActive: true },
      gitTmp
    );
    assert.deepEqual(out, {});
    // Restore Clean.tsx
    fs.writeFileSync(cleanFile, 'export function Clean() { return <div className="flex">Ok</div>; }\n');
  });

  test('untracked dirty .tsx file triggers decision: continue', () => {
    const untracked = path.join(srcDir, 'UntrackedBad.tsx');
    fs.writeFileSync(untracked, 'export function Untracked() { return <div className="transition-all">Bad</div>; }\n');
    const out = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [gitTmp] }, gitTmp);
    assert.equal(out.decision, 'continue', `expected continue for untracked file, got ${JSON.stringify(out)}`);
    assert.match(out.reason, /no-transition-all/);
    fs.unlinkSync(untracked);
  });

  test('deleted .tsx file is skipped cleanly without crashing', () => {
    fs.unlinkSync(deleteTarget);
    const out = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [gitTmp] }, gitTmp);
    assert.deepEqual(out, {});
    git(gitTmp, ['checkout', '--', 'src/ToDelete.tsx']);
  });

  test('staged rename R new\\0old\\0 lints new path cleanly', () => {
    const renameDst = path.join(srcDir, 'RenameNew.tsx');
    git(gitTmp, ['mv', 'src/RenameOld.tsx', 'src/RenameNew.tsx']);
    const cleanOut = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [gitTmp] }, gitTmp);
    assert.deepEqual(cleanOut, {});

    fs.writeFileSync(renameDst, 'export function RenameMe() { return <div className="uppercase">Bad</div>; }\n');
    const dirtyOut = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [gitTmp] }, gitTmp);
    assert.equal(dirtyOut.decision, 'continue', `expected continue on dirty renamed file, got ${JSON.stringify(dirtyOut)}`);
    assert.match(dirtyOut.reason, /no-uppercase/);

    git(gitTmp, ['reset', '--hard', 'HEAD']);
  });

  test('monorepo subdirectory workspaceRoot resolves git top-level paths & ignores sibling packages', () => {
    const webApp = path.join(gitTmp, 'apps', 'web');
    const apiApp = path.join(gitTmp, 'apps', 'api');
    fs.mkdirSync(path.join(webApp, 'src'), { recursive: true });
    fs.mkdirSync(path.join(apiApp, 'src'), { recursive: true });
    installOxlintShim(webApp);
    fs.writeFileSync(
      path.join(webApp, '.oxlintrc.json'),
      JSON.stringify({ extends: [EOLAS_OXLINT_RC.replace(/\\/g, '/')] }, null, 2)
    );
    // Dirty file OUTSIDE apps/web should be ignored
    fs.writeFileSync(
      path.join(apiApp, 'src', 'ApiBad.tsx'),
      'export function ApiBad() { return <div className="uppercase">Outside</div>; }\n'
    );
    const outsideOnly = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [webApp] }, webApp);
    assert.deepEqual(outsideOnly, {});

    // Dirty file INSIDE apps/web should be caught
    fs.writeFileSync(
      path.join(webApp, 'src', 'WebBad.tsx'),
      'export function WebBad() { return <div className="uppercase">Inside</div>; }\n'
    );
    const insideBad = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [webApp] }, webApp);
    assert.equal(insideBad.decision, 'continue', `expected continue for subdir workspace, got ${JSON.stringify(insideBad)}`);
    assert.match(insideBad.reason, /no-uppercase/);
  });

  test('hoisted monorepo node_modules/oxlint & JSONC .oxlintrc.json with https:// $schema works cleanly', () => {
    const hoistedApp = path.join(gitTmp, 'packages', 'hoisted-app');
    fs.mkdirSync(path.join(hoistedApp, 'src'), { recursive: true });
    fs.mkdirSync(path.join(hoistedApp, 'ignored-dir'), { recursive: true });
    // Note: NO node_modules/oxlint inside hoistedApp — must resolve upward to gitTmp/node_modules/oxlint
    fs.writeFileSync(
      path.join(hoistedApp, '.oxlintrc.json'),
      `{\n  // JSONC line comment before schema URL\n  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",\n  "extends": [${JSON.stringify(EOLAS_OXLINT_RC.replace(/\\/g, '/'))}],\n  /* block comment */ "ignorePatterns": ["ignored-dir/**"],\n}\n`
    );
    fs.writeFileSync(
      path.join(hoistedApp, 'ignored-dir', 'SkipMe.tsx'),
      'export function SkipMe() { return <div className="uppercase">Ignored</div>; }\n'
    );
    const cleanOut = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [hoistedApp] }, hoistedApp);
    assert.deepEqual(cleanOut, {}, 'JSONC ignorePatterns should preserve https:// and skip ignored-dir');

    fs.writeFileSync(
      path.join(hoistedApp, 'src', 'HoistedBad.tsx'),
      'export function HoistedBad() { return <div className="uppercase">Bad</div>; }\n'
    );
    const badOut = runHook('check-oxlint-on-stop.mjs', { workspacePaths: [hoistedApp] }, hoistedApp);
    assert.equal(badOut.decision, 'continue', `expected hoisted oxlint resolution to catch error, got ${JSON.stringify(badOut)}`);
    assert.match(badOut.reason, /no-uppercase/);
  });
} finally {
  cleanupTempDir(gitTmp);
}

// ============================================================================
// 3. CHECK-ANTI-PATTERNS HOOK TESTS
// ============================================================================
console.log('\n[3/5] check-anti-patterns.mjs');

test('allows TypeScript comparisons and generics mentioning telemetry or everyday words', () => {
  const out = runHook('check-anti-patterns.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/features/Metrics.tsx',
        Content: `
          export function Metrics({ count, telemetry, max }: { count: number; telemetry: number; max: number }) {
            const ok = count > telemetry && count < max;
            const map: Record<string, typeof telemetry> = {};
            return <div title="Clinical workflow protocol affordance">{ok ? Object.keys(map).length : 0}</div>;
          }
        `,
      },
    },
  });
  assert.equal(out.decision, 'allow', `expected allow, got ${JSON.stringify(out)}`);
});

test('denies banned PROP_JARGON ("hydrated") without mismatching error message', () => {
  const out = runHook('check-anti-patterns.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/features/SyncBanner.tsx',
        Content: 'export function SyncBanner() { return <div title="Data hydrated from cache" />; }\n',
      },
    },
  });
  assert.equal(out.decision, 'deny', `expected deny for hydrated UI prop, got ${JSON.stringify(out)}`);
  assert.match(out.reason, /"hydrated"/);
  assert.doesNotMatch(out.reason, /affordance/i);
});

test('catches transition-property: all; and transition: all in CSS', () => {
  const outProp = runHook('check-anti-patterns.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/features/card.css',
        Content: '.panel { transition-property: all; transition-duration: 200ms; }',
      },
    },
  });
  assert.equal(outProp.decision, 'deny', `expected deny for transition-property: all, got ${JSON.stringify(outProp)}`);

  const outShorthand = runHook('check-anti-patterns.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/features/card.css',
        Content: '.panel { transition: all 200ms ease; }',
      },
    },
  });
  assert.equal(outShorthand.decision, 'deny', `expected deny for transition: all, got ${JSON.stringify(outShorthand)}`);
});

test('unmatched backtick in JSX text does not break subsequent comment stripping', () => {
  const out = runHook('check-anti-patterns.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/features/Hint.tsx',
        Content: `
          export function Hint() {
            return (
              <div>
                Press \` key to open
                {/* 🎉 comment emoji should still be stripped */}
              </div>
            );
          }
        `,
      },
    },
  });
  assert.equal(out.decision, 'allow', `expected allow when emoji is only in comment after unmatched backtick, got ${JSON.stringify(out)}`);
});

// ============================================================================
// 4. CHECK-SECRETS HOOK TESTS
// ============================================================================
console.log('\n[4/5] check-secrets.mjs');

test('blocks 3-segment JWT literal', () => {
  const fakeJwt = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0',
    'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  ].join('.');
  const out = runHook('check-secrets.mjs', {
    toolCall: {
      name: 'write_file',
      args: { Path: 'src/lib/auth.ts', Content: `export const token = "${fakeJwt}";\n` },
    },
  });
  assert.equal(out.decision, 'deny', `expected deny for JWT, got ${JSON.stringify(out)}`);
});

test('blocks DB connection URI with live password, allows placeholder passwords', () => {
  const liveUri = ['postgres', '://admin:S3cur3Pr0dP4ss99@db.prod.internal:5432/app'].join('');
  const denyOut = runHook('check-secrets.mjs', {
    toolCall: {
      name: 'write_file',
      args: { Path: 'src/lib/db.ts', Content: `export const url = "${liveUri}";\n` },
    },
  });
  assert.equal(denyOut.decision, 'deny', `expected deny for DB URI with live password, got ${JSON.stringify(denyOut)}`);

  const placeholderUris = [
    'postgres://user:password@localhost:5432/dev',
    'postgresql://user:changeme@localhost:5432/dev',
    'mongodb+srv://user:your_password@cluster.example.com/db',
    'redis://default:xxxxxxxx@localhost:6379',
  ];
  for (const uri of placeholderUris) {
    const allowOut = runHook('check-secrets.mjs', {
      toolCall: {
        name: 'write_file',
        args: { Path: 'src/lib/db.ts', Content: `export const url = "${uri}";\n` },
      },
    });
    assert.equal(allowOut.decision, 'allow', `expected allow for placeholder URI ${uri}, got ${JSON.stringify(allowOut)}`);
  }
});

test('blocks GitHub ghu_ user-to-server token', () => {
  const ghuToken = `ghu_${'aB3dE6gH9jK2mN5pQ8rS1tU4vW7xY0zA3bC6'}`;
  const out = runHook('check-secrets.mjs', {
    toolCall: {
      name: 'write_file',
      args: { Path: 'src/lib/github.ts', Content: `export const gh = "${ghuToken}";\n` },
    },
  });
  assert.equal(out.decision, 'deny', `expected deny for ghu_ token, got ${JSON.stringify(out)}`);
});

test('allows TypeScript secret types and snake_case password strings, catches punctuated high-entropy password', () => {
  const allowTs = runHook('check-secrets.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/types/auth.ts',
        Content: `
          export interface AuthConfig {
            clientSecret: string;
            jwtSecret: string;
          }
          export const err = { password: "must_be_at_least_eight_characters_long" };
        `,
      },
    },
  });
  assert.equal(allowTs.decision, 'allow', `expected allow for TS types & snake_case, got ${JSON.stringify(allowTs)}`);

  const askPw = runHook('check-secrets.mjs', {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/lib/creds.ts',
        Content: 'export const cfg = { password: "K9!mP2$vL8#qR5@nX3^wZ7&bT4*yH6_j" };\n',
      },
    },
  });
  assert.equal(askPw.decision, 'force_ask', `expected force_ask for punctuated high-entropy password, got ${JSON.stringify(askPw)}`);
});

// ============================================================================
// 5. CHECK-PRIMITIVE-INVENTORY HOOK TESTS
// ============================================================================
console.log('\n[5/5] check-primitive-inventory.mjs');

const invTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eolas-inv-test-'));

try {
  fs.mkdirSync(path.join(invTmp, 'src', 'components', 'ui', 'dialog'), { recursive: true });
  fs.mkdirSync(path.join(invTmp, 'src', 'components', 'blocks'), { recursive: true });
  fs.writeFileSync(path.join(invTmp, 'src', 'components', 'ui', 'dialog', 'index.tsx'), 'export const Dialog = () => null;\n');
  fs.writeFileSync(path.join(invTmp, 'src', 'components', 'blocks', 'chat-panel.tsx'), 'export const ChatPanel = () => null;\n');

  test('recursively detects nested ui/dialog/index.tsx primitive and its synonym Modal', () => {
    const outDirect = runHook(
      'check-primitive-inventory.mjs',
      {
        workspacePaths: [invTmp],
        toolCall: { name: 'write_file', args: { Path: path.join(invTmp, 'src', 'features', 'Dialog.tsx') } },
      },
      invTmp
    );
    assert.equal(outDirect.decision, 'force_ask', `expected force_ask for Dialog duplicate, got ${JSON.stringify(outDirect)}`);

    const outSyn = runHook(
      'check-primitive-inventory.mjs',
      {
        workspacePaths: [invTmp],
        toolCall: { name: 'write_file', args: { Path: path.join(invTmp, 'src', 'features', 'Modal.tsx') } },
      },
      invTmp
    );
    assert.equal(outSyn.decision, 'force_ask', `expected force_ask for Modal synonym, got ${JSON.stringify(outSyn)}`);
  });

  test('detects duplicate against components/blocks/ inventory', () => {
    const out = runHook(
      'check-primitive-inventory.mjs',
      {
        workspacePaths: [invTmp],
        toolCall: { name: 'write_file', args: { Path: path.join(invTmp, 'src', 'features', 'ChatPanel.tsx') } },
      },
      invTmp
    );
    assert.equal(out.decision, 'force_ask', `expected force_ask for blocks/ChatPanel duplicate, got ${JSON.stringify(out)}`);
    assert.match(out.reason, /chat-panel/);
  });

  test('allows non-overlapping feature component', () => {
    const out = runHook(
      'check-primitive-inventory.mjs',
      {
        workspacePaths: [invTmp],
        toolCall: { name: 'write_file', args: { Path: path.join(invTmp, 'src', 'features', 'PatientTimeline.tsx') } },
      },
      invTmp
    );
    assert.equal(out.decision, 'allow', `expected allow for non-overlapping component, got ${JSON.stringify(out)}`);
  });
} finally {
  cleanupTempDir(invTmp);
}

console.log(`\nSummary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
