import nodeFs from 'node:fs';
import path from 'node:path';
import { CATEGORY_MAP, DESCRIPTION_OVERRIDES, extractInternalRegistryImports, stripComments } from './registry-meta.mjs';

// Normalise CRLF to LF so generated JSON is identical regardless of each machine's git line-ending settings.
const fs = {
  ...nodeFs,
  readFileSync: (file, options) => {
    const data = nodeFs.readFileSync(file, options);
    return typeof data === 'string' ? data.replace(/\r\n/g, '\n') : data;
  },
};

const UI_DIR = path.resolve('src/components/ui');
const BLOCKS_DIR = path.resolve('src/components/blocks');
const LIB_DIR = path.resolve('src/lib');
const OUT_DIR = path.resolve('public/r');
const REGISTRY_INDEX = path.resolve('public/r/index.json');
const REGISTRY_CATALOG = path.resolve('public/r/registry.json');
const PKG_REGISTRY = path.resolve('packages/eolas-ui/registry');
const EOLAS_REGISTRY_BASE_URL = (
  process.env.EOLAS_REGISTRY_BASE_URL || 'https://seany9915.github.io/eolas-ui/r'
).replace(/\/+$/, '');
const EOLAS_GITHUB_REGISTRY = 'seany9915/eolas-ui';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const formatRegistryDep = (dep) =>
  dep.startsWith('@') || dep.startsWith('http')
    ? dep
    : `${EOLAS_REGISTRY_BASE_URL}/${dep}.json`;

const formatSourceRegistryDep = (dep) => {
  const prefix = `${EOLAS_REGISTRY_BASE_URL}/`;
  if (dep.startsWith(prefix)) {
    return `${EOLAS_GITHUB_REGISTRY}/${dep.slice(prefix.length).replace(/\.json$/, '')}`;
  }
  return dep;
};

const getCategory = (name, type) =>
  CATEGORY_MAP[name] || (type === 'registry:block' ? 'blocks' : type === 'registry:lib' ? 'system' : 'layout');

const TITLE_ACRONYMS = {
  ai: 'AI',
  otp: 'OTP',
  csp: 'CSP',
  ui: 'UI',
  kbd: 'Kbd',
  md: 'MD',
  url: 'URL',
  api: 'API',
  html: 'HTML',
  css: 'CSS',
};

const TITLE_OVERRIDES = {
  'built-in-ai': 'Built-in AI',
  'csp-provider': 'CSP Provider',
  'otp-field': 'OTP Field',
};

function formatTitle(name) {
  if (TITLE_OVERRIDES[name]) return TITLE_OVERRIDES[name];
  return name
    .split('-')
    .map((s) => TITLE_ACRONYMS[s] || s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

const NPM_DEP_VERSION_RANGES = {
  '@tanstack/react-table': '^9.0.0',
  'react-resizable-panels': '^4.0.0',
  'react-day-picker': '^10.0.0',
  recharts: '^3.0.0',
};

const NPM_PEER_DEPS = {
  recharts: ['react-is'],
};

function detectNpmDeps(content) {
  const clean = stripComments(content);
  const deps = new Set();
  const patterns = [
    /(?:import|export)\s+(?:type\s+)?(?:[^;'"]*?\s+from\s+)?['"]([^.'"][^'"]*)['"]/g,
    /\bimport\s*\(\s*['"]([^.'"][^'"]*)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    for (const match of clean.matchAll(re)) {
      const spec = match[1];
      if (!spec || spec.startsWith('@/') || spec.startsWith('~/') || spec.startsWith('node:')) continue;
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (pkg === 'react' || pkg === 'react-dom') continue;
      const range = NPM_DEP_VERSION_RANGES[pkg];
      deps.add(range ? `${pkg}@${range}` : pkg);
      if (NPM_PEER_DEPS[pkg]) {
        for (const peer of NPM_PEER_DEPS[pkg]) deps.add(peer);
      }
    }
  }
  return Array.from(deps).sort();
}

function parseComponentDoc(content, name) {
  const humanTitle = formatTitle(name);
  const stripped = content.replace(/^\s*['"]use client['"];?\s*/, '');
  const match = stripped.match(/^\/\*\*([\s\S]*?)\*\//);
  if (!match) {
    return {
      title: humanTitle,
      description:
        DESCRIPTION_OVERRIDES[name] ||
        `Eolas UI ${humanTitle} component built on Base UI and DESIGN.md design tokens.`,
      taxonomy: [],
    };
  }

  const lines = match[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trim());
  const cleanDoc = lines.filter(Boolean);

  const descLines = [];
  const taxonomyLines = [];
  let inTaxonomy = false;
  let stopDesc = false;

  const bareNameRe = new RegExp(`^${name.replace(/-/g, '')}$`, 'i');
  const stopDescRe =
    /^(?:TAXONOMY|USAGE|ANATOMY|FEATURES|Layer:|Foundation:|Platform Reference:|Base UI Documentation:|Base UI Ecosystem Documentation:|Shadcn UI Reference:|Base UI Integration:|Aligned with|Full API(?: reference)? and feature parity|Dedicated modular files|Canonical primitive)/i;

  for (const line of cleanDoc) {
    if (/TAXONOMY|USAGE/i.test(line)) {
      inTaxonomy = true;
      stopDesc = true;
      continue;
    }
    if (inTaxonomy) {
      if (line.startsWith('-') || line.startsWith('*')) {
        taxonomyLines.push(line.replace(/^[-*]\s*/, ''));
      } else if (taxonomyLines.length > 0) {
        taxonomyLines[taxonomyLines.length - 1] += ` ${line}`;
      }
      continue;
    }
    if (stopDescRe.test(line) || /^[-*└├│]/.test(line)) {
      stopDesc = true;
      continue;
    }
    if (!stopDesc) {
      if (descLines.length === 0 && bareNameRe.test(line)) {
        continue;
      }
      descLines.push(line.replace(/^@deprecated\s+/i, 'Deprecated: '));
    }
  }

  let description = descLines.join(' ').replace(/\s+/g, ' ').trim();
  if (!description) {
    description = cleanDoc[0] || `Eolas UI ${humanTitle} component built on Base UI and DESIGN.md design tokens.`;
  }
  if (description.length > 240) {
    const cut = description.slice(0, 237);
    const lastSpace = cut.lastIndexOf(' ');
    description = `${(lastSpace > 140 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\s]+$/, '')}...`;
  }

  return {
    title: humanTitle,
    description: DESCRIPTION_OVERRIDES[name] || description,
    taxonomy: taxonomyLines,
  };
}

function toCatalogSummary(item) {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.categories && item.categories.length > 0 ? { categories: item.categories } : {}),
    ...(item.dependencies && item.dependencies.length > 0 ? { dependencies: item.dependencies } : {}),
    ...(item.devDependencies && item.devDependencies.length > 0 ? { devDependencies: item.devDependencies } : {}),
    ...(item.registryDependencies && item.registryDependencies.length > 0
      ? { registryDependencies: item.registryDependencies }
      : {}),
    files: (item.files || []).map((f) => ({
      path: f.path,
      type: f.type,
      ...(f.target ? { target: f.target } : {}),
    })),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    ...(item.meta ? { meta: item.meta } : {}),
    ...(item.docs ? { docs: item.docs } : {}),
  };
}

function pruneStaleJsonFiles(dir, expectedNames) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith('.json') && !expectedNames.has(entry)) {
      fs.rmSync(path.join(dir, entry), { force: true });
    }
  }
}

const registryItems = [];

// Base utilities item (utils.ts)
if (fs.existsSync(path.join(LIB_DIR, 'utils.ts'))) {
  const utilsContent = fs.readFileSync(path.join(LIB_DIR, 'utils.ts'), 'utf8');
  const utilsItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'utils',
    type: 'registry:lib',
    title: 'Eolas UI Utilities',
    description:
      'Core utility library exporting cn(), assetUrl(), sanitizeUrl(), composeClassName(), resolveNativeButton(), and Base UI authoring hooks: mergeProps(), mergePropsN(), mergeClassNames(), makeEventPreventable(), and useRender().',
    categories: [getCategory('utils', 'registry:lib')],
    dependencies: detectNpmDeps(utilsContent),
    files: [
      {
        path: 'lib/utils.ts',
        content: utilsContent,
        type: 'registry:lib',
        target: '@lib/utils.ts',
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'utils.json'), JSON.stringify(utilsItem, null, 2));
  registryItems.push(toCatalogSummary(utilsItem));
}

// Standalone publishable library utilities (all src/lib/*.ts except utils.ts)
const standaloneLibs = fs
  .readdirSync(LIB_DIR)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts') && f !== 'utils.ts')
  .sort();

for (const libFile of standaloneLibs) {
  const libName = libFile.replace(/\.ts$/, '');
  const libPath = path.join(LIB_DIR, libFile);
  const libContent = fs.readFileSync(libPath, 'utf8');
  const docMeta = parseComponentDoc(libContent, libName);
  const npmDeps = detectNpmDeps(libContent);
  const libRegDeps = Array.from(
    extractInternalRegistryImports(libContent, 'registry:lib', { fs, libDir: LIB_DIR, excludeName: libName })
  ).map(formatRegistryDep);

  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: libName,
    type: 'registry:lib',
    title: docMeta.title,
    description: docMeta.description,
    categories: [getCategory(libName, 'registry:lib')],
    ...(npmDeps.length > 0 ? { dependencies: npmDeps } : {}),
    ...(libRegDeps.length > 0 ? { registryDependencies: libRegDeps } : {}),
    files: [
      {
        path: `lib/${libFile}`,
        content: libContent,
        type: 'registry:lib',
        target: `@lib/${libFile}`,
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, `${libName}.json`), JSON.stringify(item, null, 2));
  registryItems.push(toCatalogSummary(item));
}

// Eolas Theme item (theme.json)
const GLOBALS_CSS = path.resolve('src/globals.css');
if (fs.existsSync(GLOBALS_CSS)) {
  const globalsContent = fs.readFileSync(GLOBALS_CSS, 'utf8');
  const themeItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'theme',
    type: 'registry:file',
    title: 'Eolas UI Clinical Theme',
    description:
      'Tailwind CSS v4 theme, design tokens, color roles, surface hierarchies, and motion tokens conforming to DESIGN.md.',
    categories: [getCategory('theme', 'registry:file')],
    docs: 'Tailwind CSS v4 @theme tokens, semantic color roles, surface hierarchy, and descendant-scoped inverted surface rules ([data-surface="inverted"]). Writes to `src/eolas-theme.css` (without overwriting an existing non-Eolas stylesheet). Import it inside your main Tailwind CSS entry file (`@import "./eolas-theme.css";` in your `components.json` `tailwind.css` file) — or point `tailwind.css` directly to `src/eolas-theme.css` — so both Tailwind v4 and `@shadcn/lint` resolve all Eolas tokens. Load Atkinson Hyperlegible Next, Lexend, Roboto Mono, and Material Symbols Outlined non-blocking via <link rel="stylesheet"> in your document <head> (see README.md).',
    files: [
      {
        path: 'styles/eolas-theme.css',
        content: globalsContent,
        type: 'registry:file',
        target: '~/src/eolas-theme.css',
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'theme.json'), JSON.stringify(themeItem, null, 2));
  registryItems.push(toCatalogSummary(themeItem));
}

// Eolas Design System Spec (design-md.json)
const DESIGN_MD = path.resolve('DESIGN.md');
const hasDesignMd = fs.existsSync(DESIGN_MD);
if (hasDesignMd) {
  const designMdContent = fs.readFileSync(DESIGN_MD, 'utf8');
  const designMdItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'design-md',
    type: 'registry:file',
    title: 'Eolas UI Design System Spec (DESIGN.md)',
    description:
      'Canonical design tokens, color roles, surface hierarchy, typography, and motion rules for AI agents and developers.',
    categories: [getCategory('design-md', 'registry:file')],
    files: [
      {
        path: 'DESIGN.md',
        content: designMdContent,
        type: 'registry:file',
        target: '~/DESIGN.md',
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'design-md.json'), JSON.stringify(designMdItem, null, 2));
  registryItems.push(toCatalogSummary(designMdItem));
}

// Eolas Agent Rules, Hooks & Enforcement Scripts (agent-rules.json)
const AGENT_RULE_SOURCES = [
  { src: '.agents/rules/00-core-contract.md', regPath: 'rules/00-core-contract.md', target: '~/.agents/rules/00-core-contract.md', required: true },
  { src: '.agents/rules/anti-patterns.md', regPath: 'rules/anti-patterns.md', target: '~/.agents/rules/anti-patterns.md', required: true },
  { src: '.agents/rules/component-library.md', regPath: 'rules/component-library.md', target: '~/.agents/rules/component-library.md', required: false },
  { src: '.agents/rules/design-system.md', regPath: 'rules/design-system.md', target: '~/.agents/rules/design-system.md', required: false },
  { src: '.agents/hooks.json', regPath: 'hooks.json', target: '~/.agents/hooks.json', required: false },
  { src: '.agents/scripts/check-anti-patterns.mjs', regPath: 'scripts/check-anti-patterns.mjs', target: '~/.agents/scripts/check-anti-patterns.mjs', required: true },
  { src: '.agents/scripts/check-primitive-inventory.mjs', regPath: 'scripts/check-primitive-inventory.mjs', target: '~/.agents/scripts/check-primitive-inventory.mjs', required: false },
  { src: '.agents/scripts/check-secrets.mjs', regPath: 'scripts/check-secrets.mjs', target: '~/.agents/scripts/check-secrets.mjs', required: false },
  { src: '.agents/scripts/check-oxlint-on-stop.mjs', regPath: 'scripts/check-oxlint-on-stop.mjs', target: '~/.agents/scripts/check-oxlint-on-stop.mjs', required: false },
  { src: 'AGENTS.md', regPath: 'AGENTS.md', target: '~/AGENTS.md', required: false },
];

const hasRequiredAgentSources = AGENT_RULE_SOURCES
  .filter((entry) => entry.required)
  .every((entry) => fs.existsSync(path.resolve(entry.src)));

if (hasRequiredAgentSources) {
  const agentFiles = AGENT_RULE_SOURCES
    .filter((entry) => fs.existsSync(path.resolve(entry.src)))
    .map((entry) => ({
      path: entry.regPath,
      content: fs.readFileSync(path.resolve(entry.src), 'utf8'),
      type: 'registry:file',
      target: entry.target,
    }));

  const agentRulesItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'agent-rules',
    type: 'registry:item',
    title: 'Eolas UI Agent Rules & Anti-Pattern Checker',
    description:
      'Strict architectural contracts, AGENTS.md, Antigravity hooks, DESIGN.md tokens, and anti-pattern enforcement scripts for AI agents and developers.',
    categories: [getCategory('agent-rules', 'registry:item')],
    docs: 'For full AST lint enforcement (nested Card, sparkle icons, triple-tint, tertiary contrast, transition-all, spring easing, uppercase, unsafe type casts), also run: npx shadcn@latest add @eolas/lint (or npx @seany9915/eolas-ui add lint).',
    ...(hasDesignMd ? { registryDependencies: [formatRegistryDep('design-md')] } : {}),
    files: agentFiles,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'agent-rules.json'), JSON.stringify(agentRulesItem, null, 2));
  registryItems.push(toCatalogSummary(agentRulesItem));
} else {
  // Fallback if `.agents/` is absent in an isolated build environment: preserve committed item.
  const existingAgentRules = path.join(OUT_DIR, 'agent-rules.json');
  if (fs.existsSync(existingAgentRules)) {
    const existing = JSON.parse(fs.readFileSync(existingAgentRules, 'utf8'));
    if (!existing.categories || existing.categories.length === 0) {
      existing.categories = [getCategory('agent-rules', 'registry:item')];
    }
    console.warn('.agents/ sources not found: keeping existing agent-rules.json unchanged.');
    registryItems.push(toCatalogSummary(existing));
  }
}

// Eolas Lint preset item (lint.json)
const LINT_INDEX = path.resolve('packages/eolas-ui/lint/index.mjs');
const LINT_OXLINT_CONFIG = path.resolve('packages/eolas-ui/lint/oxlintrc.json');
const LINT_CONSUMER_OXLINT = path.resolve('packages/eolas-ui/lint/consumer.oxlintrc.json');
if (fs.existsSync(LINT_INDEX) && fs.existsSync(LINT_OXLINT_CONFIG)) {
  const lintContent = fs.readFileSync(LINT_INDEX, 'utf8');
  const baseConfig = JSON.parse(fs.readFileSync(LINT_OXLINT_CONFIG, 'utf8'));
  const oxlintConfig = {
    $schema: './node_modules/oxlint/configuration_schema.json',
    ...baseConfig,
    jsPlugins: (baseConfig.jsPlugins ?? []).map((entry) =>
      entry === './index.mjs' || entry === './index.js' ? './lint/index.mjs' : entry
    ),
    ignorePatterns: ['dist/**', 'public/**', 'node_modules/**', '.agents/**', 'lint/**'],
  };
  const oxlintConfigContent = `${JSON.stringify(oxlintConfig, null, 2)}\n`;
  fs.writeFileSync(LINT_CONSUMER_OXLINT, oxlintConfigContent);

  const lintItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'lint',
    type: 'registry:item',
    title: 'Eolas UI Lint',
    description: '@shadcn/lint and Eolas UI Oxlint config for Base UI design contracts.',
    categories: [getCategory('lint', 'registry:item')],
    docs: 'Run "npx oxlint ." to enforce Eolas UI and @shadcn/lint contracts. Ensure your `components.json` `tailwind.css` file imports `./eolas-theme.css` (or points directly to `src/eolas-theme.css`) so `shadcn/no-unknown-classes` recognizes Eolas tokens. If your UI primitives live outside src/components/ui or components/ui, add your custom directory glob to overrides[0].files in .oxlintrc.json.',
    devDependencies: ['@shadcn/lint', 'oxlint'],
    files: [
      {
        path: 'lint/index.mjs',
        content: lintContent,
        type: 'registry:file',
        target: '~/lint/index.mjs',
      },
      {
        path: 'lint/consumer.oxlintrc.json',
        content: oxlintConfigContent,
        type: 'registry:file',
        target: '~/.oxlintrc.json',
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'lint.json'), JSON.stringify(lintItem, null, 2));
  registryItems.push(toCatalogSummary(lintItem));
}

// Eolas Brand Logos item (logos.json)
const LOGOS_DIR = path.resolve('public/logos');
if (fs.existsSync(LOGOS_DIR)) {
  const logoFiles = fs
    .readdirSync(LOGOS_DIR)
    .filter((f) => f.endsWith('.svg'))
    .sort();
  if (logoFiles.length > 0) {
    const logosItem = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'logos',
      type: 'registry:item',
      title: 'Eolas Brand Logos',
      description:
        'Official Eolas SVG brand marks (stacked primary mark, horizontal lockups, pictorial marks, and wordmarks) aligned with DESIGN.md color tokens.',
      categories: [getCategory('logos', 'registry:item')],
      docs: 'Installs all Eolas SVG brand marks into `public/logos/`. Reference them via `/logos/horizontal-lockup.svg` (or `assetUrl(\'/logos/horizontal-lockup.svg\')` for subpath deployments).',
      files: logoFiles.map((file) => ({
        path: `logos/${file}`,
        content: fs.readFileSync(path.join(LOGOS_DIR, file), 'utf8'),
        type: 'registry:file',
        target: `~/public/logos/${file}`,
      })),
    };
    fs.writeFileSync(path.join(OUT_DIR, 'logos.json'), JSON.stringify(logosItem, null, 2));
    registryItems.push(toCatalogSummary(logosItem));
  }
}

// 1. Scan src/components/ui for all .tsx files
const uiFiles = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx')).sort();
console.log(`Found ${uiFiles.length} UI files to catalog.`);

for (const file of uiFiles) {
  const name = file.replace('.tsx', '');
  const content = fs.readFileSync(path.join(UI_DIR, file), 'utf8');
  const docMeta = parseComponentDoc(content, name);

  // Detect internal registry dependencies (UI, blocks, and lib utilities from comment-stripped source)
  const npmDeps = detectNpmDeps(content);
  const internalRefs = Array.from(
    extractInternalRegistryImports(content, 'registry:ui', { fs, libDir: LIB_DIR, excludeName: name })
  );
  const regDeps = internalRefs.map(formatRegistryDep);

  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:ui',
    title: docMeta.title,
    description: docMeta.description,
    categories: [getCategory(name, 'registry:ui')],
    ...(npmDeps.length > 0 ? { dependencies: npmDeps } : {}),
    ...(regDeps.length > 0 ? { registryDependencies: regDeps } : {}),
    files: [
      {
        path: `ui/${file}`,
        content,
        type: 'registry:ui',
        target: `@ui/${file}`,
      },
    ],
    ...(docMeta.taxonomy && docMeta.taxonomy.length > 0 ? { meta: { taxonomy: docMeta.taxonomy } } : {}),
  };

  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
  registryItems.push(toCatalogSummary(item));
}

// 2. Scan src/components/blocks for all .tsx files
if (fs.existsSync(BLOCKS_DIR)) {
  const blockFiles = fs.readdirSync(BLOCKS_DIR).filter((f) => f.endsWith('.tsx')).sort();
  console.log(`Found ${blockFiles.length} composite block files to catalog.`);

  for (const file of blockFiles) {
    const name = file.replace('.tsx', '');
    const content = fs.readFileSync(path.join(BLOCKS_DIR, file), 'utf8');
    const docMeta = parseComponentDoc(content, name);

    const npmDeps = detectNpmDeps(content);
    const internalRefs = Array.from(
      extractInternalRegistryImports(content, 'registry:block', { fs, libDir: LIB_DIR, excludeName: name })
    );
    const regDeps = internalRefs.map(formatRegistryDep);

    const item = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name,
      type: 'registry:block',
      title: docMeta.title,
      description: docMeta.description,
      categories: [getCategory(name, 'registry:block')],
      ...(npmDeps.length > 0 ? { dependencies: npmDeps } : {}),
      ...(regDeps.length > 0 ? { registryDependencies: regDeps } : {}),
      files: [
        {
          path: `blocks/${file}`,
          content,
          type: 'registry:block',
          target: `@components/blocks/${file}`,
        },
      ],
      ...(docMeta.taxonomy && docMeta.taxonomy.length > 0 ? { meta: { taxonomy: docMeta.taxonomy } } : {}),
    };

    fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
    registryItems.push(toCatalogSummary(item));
  }
}

// Prune stale item JSONs before writing index and catalog
const expectedJsonNames = new Set([
  'index.json',
  'registry.json',
  ...registryItems.map((item) => `${item.name}.json`),
]);
pruneStaleJsonFiles(OUT_DIR, expectedJsonNames);

// Master index (legacy shadcn / CLI array format)
fs.writeFileSync(REGISTRY_INDEX, JSON.stringify(registryItems, null, 2));

// Official modern shadcn registry catalog conforming to https://ui.shadcn.com/schema/registry.json
const registryCatalog = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: '@seany9915/eolas-ui',
  homepage: 'https://github.com/seany9915/eolas-ui',
  items: registryItems,
};
fs.writeFileSync(REGISTRY_CATALOG, JSON.stringify(registryCatalog, null, 2));

// Generate modular source registries and root registry.json
const ROOT_REGISTRY = path.resolve('registry.json');
function mapRegistryFilePathToRepoSource(regFilePath) {
  if (regFilePath.startsWith('ui/') || regFilePath.startsWith('blocks/')) {
    return `src/components/${regFilePath}`;
  }
  if (regFilePath.startsWith('lib/')) {
    return `src/${regFilePath}`;
  }
  if (regFilePath === 'styles/eolas-theme.css' || regFilePath.startsWith('styles/')) {
    return 'src/globals.css';
  }
  if (regFilePath === 'hooks.json') {
    return '.agents/hooks.json';
  }
  if (regFilePath.startsWith('rules/') || regFilePath.startsWith('scripts/')) {
    return `.agents/${regFilePath}`;
  }
  if (regFilePath.startsWith('lint/')) {
    return `packages/eolas-ui/${regFilePath}`;
  }
  if (regFilePath.startsWith('logos/')) {
    return `public/${regFilePath}`;
  }
  return regFilePath;
}

const rootItems = registryItems.map((item) => {
  const itemFile = path.join(OUT_DIR, `${item.name}.json`);
  if (!fs.existsSync(itemFile)) return item;
  const fullItem = JSON.parse(fs.readFileSync(itemFile, 'utf8'));
  const sourceRegDeps =
    fullItem.registryDependencies && fullItem.registryDependencies.length > 0
      ? fullItem.registryDependencies.map(formatSourceRegistryDep)
      : [];
  return {
    name: fullItem.name,
    type: fullItem.type,
    title: fullItem.title,
    description: fullItem.description,
    ...(fullItem.categories && fullItem.categories.length > 0 ? { categories: fullItem.categories } : {}),
    ...(fullItem.dependencies && fullItem.dependencies.length > 0 ? { dependencies: fullItem.dependencies } : {}),
    ...(fullItem.devDependencies && fullItem.devDependencies.length > 0 ? { devDependencies: fullItem.devDependencies } : {}),
    ...(sourceRegDeps.length > 0 ? { registryDependencies: sourceRegDeps } : {}),
    files: (fullItem.files || []).map((f) => ({
      path: mapRegistryFilePathToRepoSource(f.path),
      type: f.type,
      ...(f.target ? { target: f.target } : {}),
    })),
    ...(fullItem.cssVars ? { cssVars: fullItem.cssVars } : {}),
    ...(fullItem.meta ? { meta: fullItem.meta } : {}),
    ...(fullItem.docs ? { docs: fullItem.docs } : {}),
  };
});

const isInsideDir = (dir, filePath) => {
  const rel = path.relative(dir, path.resolve(filePath));
  return !rel.startsWith('..') && !path.isAbsolute(rel);
};

// 1. Modular UI Primitives Registry (src/components/ui/registry.json)
const UI_REGISTRY_DIR = path.resolve('src/components/ui');
const uiLocalNames = new Set();
const uiRegistryItems = rootItems
  .filter((i) => i.type === 'registry:ui' && i.files.every((f) => isInsideDir(UI_REGISTRY_DIR, f.path)))
  .map((item) => {
    uiLocalNames.add(item.name);
    return {
      ...item,
      files: item.files.map((f) => ({
        path: path.relative(UI_REGISTRY_DIR, path.resolve(f.path)).replace(/\\/g, '/'),
        type: f.type,
        ...(f.target ? { target: f.target } : {}),
      })),
    };
  });
fs.writeFileSync(
  path.resolve('src/components/ui/registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      items: uiRegistryItems,
    },
    null,
    2
  )
);

// 2. Modular Composite Blocks Registry (src/components/blocks/registry.json)
const blockLocalNames = new Set();
const blockRegistryItems = rootItems
  .filter((i) => i.type === 'registry:block' && i.files.every((f) => isInsideDir(BLOCKS_DIR, f.path)))
  .map((item) => {
    blockLocalNames.add(item.name);
    return {
      ...item,
      files: item.files.map((f) => ({
        path: path.relative(BLOCKS_DIR, path.resolve(f.path)).replace(/\\/g, '/'),
        type: f.type,
        ...(f.target ? { target: f.target } : {}),
      })),
    };
  });
fs.writeFileSync(
  path.resolve('src/components/blocks/registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      items: blockRegistryItems,
    },
    null,
    2
  )
);

// 3. Modular Root Registry with includes (registry.json)
const rootCatalog = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: '@seany9915/eolas-ui',
  homepage: 'https://github.com/seany9915/eolas-ui',
  include: [
    'src/components/ui/registry.json',
    'src/components/blocks/registry.json',
  ],
  items: rootItems.filter((i) => !uiLocalNames.has(i.name) && !blockLocalNames.has(i.name)),
};
fs.writeFileSync(ROOT_REGISTRY, JSON.stringify(rootCatalog, null, 2));

// Mirror all to packages/eolas-ui/registry for zero-dependency CLI bundling
if (!fs.existsSync(PKG_REGISTRY)) {
  fs.mkdirSync(PKG_REGISTRY, { recursive: true });
}
pruneStaleJsonFiles(PKG_REGISTRY, expectedJsonNames);
for (const item of registryItems) {
  const itemData = fs.readFileSync(path.join(OUT_DIR, `${item.name}.json`), 'utf8');
  fs.writeFileSync(path.join(PKG_REGISTRY, `${item.name}.json`), itemData);
}
fs.writeFileSync(path.join(PKG_REGISTRY, 'index.json'), JSON.stringify(registryItems, null, 2));
fs.writeFileSync(path.join(PKG_REGISTRY, 'registry.json'), JSON.stringify(registryCatalog, null, 2));

console.log(`Successfully generated registry at public/r/, packages/eolas-ui/registry/, and root registry.json with ${registryItems.length} items.`);
