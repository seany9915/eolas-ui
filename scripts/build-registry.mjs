import nodeFs from 'node:fs';
import path from 'node:path';

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

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const formatRegistryDep = (dep) =>
  dep.startsWith('@') || dep.startsWith('http')
    ? dep
    : `https://seany9915.github.io/eolas-ui/r/${dep}.json`;

const NPM_PACKAGE_DETECTORS = [
  ['thinking-orbs', /from\s+['"]thinking-orbs['"]/],
  ['bot-avatars', /from\s+['"]bot-avatars['"]/],
  ['embla-carousel-react', /from\s+['"]embla-carousel-react['"]/],
  ['recharts', /from\s+['"]recharts['"]/],
  ['react-resizable-panels', /from\s+['"]react-resizable-panels['"]/],
  ['cmdk', /from\s+['"]cmdk['"]/],
  ['react-day-picker', /from\s+['"]react-day-picker['"]/],
  ['@dnd-kit/react', /from\s+['"]@dnd-kit\/react(?:\/[^'"]+)?['"]/],
  ['@dnd-kit/helpers', /from\s+['"]@dnd-kit\/helpers['"]/],
  ['@tanstack/react-table', /from\s+['"]@tanstack\/react-table['"]/],
];

function detectNpmDeps(content, includeBase = true) {
  const deps = new Set(includeBase ? ['@base-ui/react', 'clsx', 'tailwind-merge'] : []);
  for (const [pkg, pattern] of NPM_PACKAGE_DETECTORS) {
    if (pattern.test(content)) {
      deps.add(pkg);
    }
  }
  return Array.from(deps);
}

function detectLibFiles(content, excludeName = 'utils') {
  const seen = new Set();
  const libFiles = [];
  for (const match of content.matchAll(/from\s+['"]@\/lib\/([^'"]+)['"]/g)) {
    const libName = match[1];
    if (!libName || libName === 'utils' || libName === excludeName || seen.has(libName)) continue;
    const libPath = path.join(LIB_DIR, `${libName}.ts`);
    if (fs.existsSync(libPath)) {
      seen.add(libName);
      libFiles.push({
        path: `lib/${libName}.ts`,
        content: fs.readFileSync(libPath, 'utf8'),
        type: 'registry:lib',
        target: `@lib/${libName}.ts`,
      });
    }
  }
  return libFiles;
}

function parseComponentDoc(content, name) {
  const humanTitle = name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  const match = content.match(/^\/\*\*([\s\S]*?)\*\//);
  if (!match) {
    return {
      title: humanTitle,
      description: `Eolas UI ${humanTitle} component built on Base UI and DESIGN.md design tokens.`,
      taxonomy: [],
      docs: undefined,
    };
  }

  const lines = match[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trim());
  const cleanDoc = lines.filter(Boolean);
  const firstLine = cleanDoc[0] || humanTitle;

  const descLines = [];
  const taxonomyLines = [];
  let inTaxonomy = false;

  for (const line of cleanDoc) {
    if (/TAXONOMY|USAGE/i.test(line)) {
      inTaxonomy = true;
      continue;
    }
    if (inTaxonomy) {
      if (line.startsWith('-') || line.startsWith('*')) {
        taxonomyLines.push(line.replace(/^[-*]\s*/, ''));
      } else if (taxonomyLines.length > 0) {
        taxonomyLines[taxonomyLines.length - 1] += ` ${line}`;
      }
    } else if (!line.startsWith('Base UI Documentation:')) {
      descLines.push(line);
    }
  }

  const description = descLines.join(' ').trim() || firstLine;
  return {
    title: humanTitle,
    description,
    taxonomy: taxonomyLines,
    docs: cleanDoc.join('\n'),
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
    description: 'Core utility library exporting cn(), assetUrl(), sanitizeUrl(), and Base UI authoring hooks: mergeProps(), mergePropsN(), mergeClassNames(), makeEventPreventable(), and useRender().',
    dependencies: ['clsx', 'tailwind-merge', '@base-ui/react'],
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
  registryItems.push({
    name: 'utils',
    type: 'registry:lib',
    title: utilsItem.title,
    description: utilsItem.description,
    dependencies: utilsItem.dependencies,
  });
}

// Standalone publishable library utilities
const STANDALONE_LIBS = ['sanitize', 'scheduler', 'built-in-ai', 'scroll-completion', 'format-duration'];
for (const libName of STANDALONE_LIBS) {
  const libPath = path.join(LIB_DIR, `${libName}.ts`);
  if (!fs.existsSync(libPath)) continue;
  const libContent = fs.readFileSync(libPath, 'utf8');
  const docMeta = parseComponentDoc(libContent, libName);
  const npmDeps = detectNpmDeps(libContent, false);
  const extraLibFiles = detectLibFiles(libContent, libName);
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: libName,
    type: 'registry:lib',
    title: docMeta.title,
    description: docMeta.description,
    ...(npmDeps.length > 0 ? { dependencies: npmDeps } : {}),
    files: [
      {
        path: `lib/${libName}.ts`,
        content: libContent,
        type: 'registry:lib',
        target: `@lib/${libName}.ts`,
      },
      ...extraLibFiles,
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, `${libName}.json`), JSON.stringify(item, null, 2));
  registryItems.push({
    name: libName,
    type: 'registry:lib',
    title: item.title,
    description: item.description,
    ...(npmDeps.length > 0 ? { dependencies: npmDeps } : {}),
  });
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
    description: 'Tailwind CSS v4 theme, design tokens, color roles, surface hierarchies, Google Fonts & Material Symbols imports, and motion tokens conforming to DESIGN.md',
    docs: 'Includes Google Fonts @import rules for Atkinson Hyperlegible Next, Lexend, Roboto Mono, and Material Symbols Outlined. Toggle dark mode by adding class="dark" to <html>.',
    files: [
      {
        path: 'styles/globals.css',
        content: globalsContent,
        type: 'registry:file',
        target: 'styles/globals.css',
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'theme.json'), JSON.stringify(themeItem, null, 2));
  registryItems.push({
    name: 'theme',
    type: 'registry:file',
    title: themeItem.title,
    description: themeItem.description,
  });
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
    description: 'Canonical design tokens, color roles, surface hierarchy, typography, and motion rules for AI agents and developers',
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
  registryItems.push({
    name: 'design-md',
    type: 'registry:file',
    title: designMdItem.title,
    description: designMdItem.description,
  });
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
    type: 'registry:file',
    title: 'Eolas UI Agent Rules & Anti-Pattern Checker',
    description: 'Strict architectural contracts, AGENTS.md, Antigravity hooks, DESIGN.md tokens, and anti-pattern enforcement scripts for AI agents and developers',
    docs: 'For full AST lint enforcement (nested Card, sparkle icons, triple-tint, tertiary contrast, transition-all, spring easing, uppercase, unsafe type casts), also run: npx @seany9915/eolas-ui add lint',
    ...(hasDesignMd ? { registryDependencies: [formatRegistryDep('design-md')] } : {}),
    files: agentFiles,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'agent-rules.json'), JSON.stringify(agentRulesItem, null, 2));
  registryItems.push({
    name: 'agent-rules',
    type: 'registry:file',
    title: agentRulesItem.title,
    description: agentRulesItem.description,
    ...(agentRulesItem.registryDependencies ? { registryDependencies: agentRulesItem.registryDependencies } : {}),
  });
} else {
  // `.agents/` is gitignored, so it is absent in worktrees and fresh clones: keep the committed item instead of dropping it.
  const existingAgentRules = path.join(OUT_DIR, 'agent-rules.json');
  if (fs.existsSync(existingAgentRules)) {
    const existing = JSON.parse(fs.readFileSync(existingAgentRules, 'utf8'));
    console.warn('.agents/ sources not found: keeping existing agent-rules.json unchanged.');
    registryItems.push({
      name: 'agent-rules',
      type: 'registry:file',
      title: existing.title,
      description: existing.description,
      ...(existing.registryDependencies ? { registryDependencies: existing.registryDependencies } : {}),
    });
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
    type: 'registry:file',
    title: 'Eolas UI Lint',
    description: '@shadcn/lint and Eolas UI Oxlint config for Base UI design contracts',
    devDependencies: [
      '@shadcn/lint',
      'oxlint',
    ],
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
  registryItems.push({
    name: 'lint',
    type: 'registry:file',
    title: lintItem.title,
    description: lintItem.description,
    devDependencies: lintItem.devDependencies,
  });
}

// 1. Scan src/components/ui for all .tsx files
const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx'));
console.log(`Found ${files.length} UI files to catalog.`);

for (const file of files) {
  const name = file.replace('.tsx', '');
  const content = fs.readFileSync(path.join(UI_DIR, file), 'utf8');
  const docMeta = parseComponentDoc(content, name);

  // Detect internal component dependencies
  const internalDeps = [];
  const regex = /from\s+['"](?:\.\/|@\/components\/ui\/)([^'"]+)['"]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    if (m[1] && m[1] !== name) {
      internalDeps.push(m[1]);
    }
  }

  const npmDeps = detectNpmDeps(content, true);
  const libFiles = detectLibFiles(content);

  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:ui',
    title: docMeta.title,
    description: docMeta.description,
    dependencies: npmDeps,
    registryDependencies: [...new Set(['utils', ...internalDeps])].map(formatRegistryDep),
    files: [
      {
        path: `ui/${file}`,
        content,
        type: 'registry:ui',
        target: `@ui/${file}`,
      },
      ...libFiles,
    ],
    ...(docMeta.taxonomy && docMeta.taxonomy.length > 0 ? { meta: { taxonomy: docMeta.taxonomy } } : {}),
    ...(docMeta.docs ? { docs: docMeta.docs } : {}),
  };

  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
  registryItems.push({
    name,
    type: 'registry:ui',
    title: item.title,
    description: item.description,
    dependencies: npmDeps,
    registryDependencies: item.registryDependencies,
    ...(docMeta.taxonomy && docMeta.taxonomy.length > 0 ? { meta: { taxonomy: docMeta.taxonomy } } : {}),
  });
}

// 2. Scan src/components/blocks for all .tsx files
if (fs.existsSync(BLOCKS_DIR)) {
  const blockFiles = fs.readdirSync(BLOCKS_DIR).filter((f) => f.endsWith('.tsx'));
  console.log(`Found ${blockFiles.length} composite block files to catalog.`);

  for (const file of blockFiles) {
    const name = file.replace('.tsx', '');
    const content = fs.readFileSync(path.join(BLOCKS_DIR, file), 'utf8');
    const docMeta = parseComponentDoc(content, name);

    // Detect internal component dependencies (from UI and blocks)
    const internalDeps = [];
    const regex = /from\s+['"](?:\.\.\/ui\/|@\/components\/ui\/|\.\/|@\/components\/blocks\/)([^'"]+)['"]/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
      if (m[1] && m[1] !== name) {
        const cleanDep = m[1].replace(/^\.\//, '').split('/')[0];
        internalDeps.push(cleanDep);
      }
    }

    const npmDeps = detectNpmDeps(content, true);
    const libFiles = detectLibFiles(content);

    const item = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name,
      type: 'registry:block',
      title: docMeta.title,
      description: docMeta.description,
      dependencies: npmDeps,
      registryDependencies: [...new Set(['utils', ...internalDeps])].map(formatRegistryDep),
      files: [
        {
          path: `blocks/${file}`,
          content,
          type: 'registry:block',
          target: `@components/blocks/${file}`,
        },
        ...libFiles,
      ],
      ...(docMeta.taxonomy && docMeta.taxonomy.length > 0 ? { meta: { taxonomy: docMeta.taxonomy } } : {}),
      ...(docMeta.docs ? { docs: docMeta.docs } : {}),
    };

    fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
    registryItems.push({
      name,
      type: 'registry:block',
      title: item.title,
      description: item.description,
      dependencies: npmDeps,
      registryDependencies: item.registryDependencies,
      ...(docMeta.taxonomy && docMeta.taxonomy.length > 0 ? { meta: { taxonomy: docMeta.taxonomy } } : {}),
    });
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
  if (regFilePath.startsWith('styles/')) {
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
  return regFilePath;
}

const rootItems = registryItems.map((item) => {
  const itemFile = path.join(OUT_DIR, `${item.name}.json`);
  if (!fs.existsSync(itemFile)) return item;
  const fullItem = JSON.parse(fs.readFileSync(itemFile, 'utf8'));
  return {
    name: fullItem.name,
    type: fullItem.type,
    title: fullItem.title,
    description: fullItem.description,
    dependencies: fullItem.dependencies,
    devDependencies: fullItem.devDependencies,
    registryDependencies: fullItem.registryDependencies,
    files: (fullItem.files || []).map((f) => ({
      path: mapRegistryFilePathToRepoSource(f.path),
      type: f.type,
      target: f.target,
    })),
    ...(fullItem.meta ? { meta: fullItem.meta } : {}),
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
        target: f.target,
      })),
    };
  });
fs.writeFileSync(
  path.resolve('src/components/ui/registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: '@seany9915/eolas-ui/ui',
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
        target: f.target,
      })),
    };
  });
fs.writeFileSync(
  path.resolve('src/components/blocks/registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: '@seany9915/eolas-ui/blocks',
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
