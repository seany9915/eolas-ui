import fs from 'node:fs';
import path from 'node:path';

const UI_DIR = path.resolve('src/components/ui');
const LIB_DIR = path.resolve('src/lib');
const OUT_DIR = path.resolve('public/r');
const REGISTRY_INDEX = path.resolve('public/r/index.json');
const REGISTRY_CATALOG = path.resolve('public/r/registry.json');
const PKG_REGISTRY = path.resolve('packages/eolas-ui/registry');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
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

// 1. Scan src/components/ui for all .tsx files
const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx'));

console.log(`Found ${files.length} UI files to catalog.`);

const registryItems = [];

// Base utilities item (utils.ts)
if (fs.existsSync(path.join(LIB_DIR, 'utils.ts'))) {
  const utilsContent = fs.readFileSync(path.join(LIB_DIR, 'utils.ts'), 'utf8');
  const utilsItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'utils',
    type: 'registry:lib',
    title: 'Eolas UI Utilities',
    description: 'Utility functions including cn() class merger for Tailwind CSS and Base UI',
    dependencies: ['clsx', 'tailwind-merge', '@base-ui/react'],
    files: [
      {
        path: 'lib/utils.ts',
        content: utilsContent,
        type: 'registry:lib',
        target: 'lib/utils.ts',
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

// Eolas Theme item (theme.json)
const GLOBALS_CSS = path.resolve('src/globals.css');
if (fs.existsSync(GLOBALS_CSS)) {
  const globalsContent = fs.readFileSync(GLOBALS_CSS, 'utf8');
  const themeItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'theme',
    type: 'registry:file',
    title: 'Eolas UI Clinical Theme',
    description: 'Tailwind CSS v4 theme, design tokens, color roles, surface hierarchies, and motion tokens conforming to DESIGN.md',
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

// Eolas Agent Rules & Anti-Pattern Checker (agent-rules.json)
const CORE_CONTRACT = path.resolve('.agents/rules/00-core-contract.md');
const ANTI_PATTERNS = path.resolve('.agents/rules/anti-patterns.md');
const COMPONENT_LIB = path.resolve('.agents/rules/component-library.md');
const DESIGN_SYSTEM = path.resolve('.agents/rules/design-system.md');
const CHECK_SCRIPT = path.resolve('.agents/scripts/check-anti-patterns.mjs');

if (fs.existsSync(CORE_CONTRACT) && fs.existsSync(ANTI_PATTERNS) && fs.existsSync(CHECK_SCRIPT)) {
  const agentRulesItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'agent-rules',
    type: 'registry:file',
    title: 'Eolas UI Agent Rules & Anti-Pattern Checker',
    description: 'Strict architectural contracts, DESIGN.md tokens, and anti-pattern enforcement scripts for AI agents and developers',
    files: [
      {
        path: 'rules/00-core-contract.md',
        content: fs.readFileSync(CORE_CONTRACT, 'utf8'),
        type: 'registry:file',
        target: '.agents/rules/00-core-contract.md',
      },
      {
        path: 'rules/anti-patterns.md',
        content: fs.readFileSync(ANTI_PATTERNS, 'utf8'),
        type: 'registry:file',
        target: '.agents/rules/anti-patterns.md',
      },
      ...(fs.existsSync(COMPONENT_LIB)
        ? [
            {
              path: 'rules/component-library.md',
              content: fs.readFileSync(COMPONENT_LIB, 'utf8'),
              type: 'registry:file',
              target: '.agents/rules/component-library.md',
            },
          ]
        : []),
      ...(fs.existsSync(DESIGN_SYSTEM)
        ? [
            {
              path: 'rules/design-system.md',
              content: fs.readFileSync(DESIGN_SYSTEM, 'utf8'),
              type: 'registry:file',
              target: '.agents/rules/design-system.md',
            },
          ]
        : []),
      {
        path: 'scripts/check-anti-patterns.mjs',
        content: fs.readFileSync(CHECK_SCRIPT, 'utf8'),
        type: 'registry:file',
        target: '.agents/scripts/check-anti-patterns.mjs',
      },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'agent-rules.json'), JSON.stringify(agentRulesItem, null, 2));
  registryItems.push({
    name: 'agent-rules',
    type: 'registry:file',
    title: agentRulesItem.title,
    description: agentRulesItem.description,
  });
}

// Eolas Lint preset item (lint.json)
const LINT_INDEX = path.resolve('packages/eolas-ui/lint/index.js');
if (fs.existsSync(LINT_INDEX)) {
  const lintContent = fs.readFileSync(LINT_INDEX, 'utf8');
  const eslintConfigContent = `import tsParser from "@typescript-eslint/parser";
import { eolasLintPreset } from "./lint/index.js";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  ...eolasLintPreset,
  {
    ignores: [
      "dist/**",
      "public/**",
      "node_modules/**",
      ".agents/**",
    ],
  },
];
`;

  const lintItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'lint',
    type: 'registry:file',
    title: 'Eolas UI Lint',
    description: '@shadcn/lint preset and ESLint config for Eolas UI Base UI design contracts',
    devDependencies: [
      '@shadcn/lint',
      'eslint',
      '@typescript-eslint/parser',
    ],
    files: [
      {
        path: 'lint/index.js',
        content: lintContent,
        type: 'registry:file',
        target: 'lint/index.js',
      },
      {
        path: 'eslint.config.mjs',
        content: eslintConfigContent,
        type: 'registry:file',
        target: 'eslint.config.mjs',
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

  // Detect npm packages needed
  const npmDeps = ['@base-ui/react', 'clsx', 'tailwind-merge'];
  if (content.includes("from 'thinking-orbs'")) {
    npmDeps.push('thinking-orbs');
  }
  if (content.includes("from 'bot-avatars'")) {
    npmDeps.push('bot-avatars');
  }
  if (content.includes("from 'embla-carousel-react'") || content.includes('from "embla-carousel-react"')) {
    npmDeps.push('embla-carousel-react');
  }
  if (content.includes("from 'recharts'") || content.includes('from "recharts"')) {
    npmDeps.push('recharts');
  }
  if (content.includes("from 'react-resizable-panels'") || content.includes('from "react-resizable-panels"')) {
    npmDeps.push('react-resizable-panels');
  }

  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:ui',
    title: docMeta.title,
    description: docMeta.description,
    dependencies: npmDeps,
    registryDependencies: [...new Set(['utils', ...internalDeps])],
    files: [
      {
        path: `ui/${file}`,
        content,
        type: 'registry:ui',
        target: `components/ui/${file}`,
      },
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

// Scan src/components/blocks for all .tsx files
const BLOCKS_DIR = path.resolve('src/components/blocks');
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

    const npmDeps = ['@base-ui/react', 'clsx', 'tailwind-merge'];

    const item = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name,
      type: 'registry:block',
      title: docMeta.title,
      description: docMeta.description,
      dependencies: npmDeps,
      registryDependencies: [...new Set(['utils', ...internalDeps])],
      files: [
        {
          path: `blocks/${file}`,
          content,
          type: 'registry:block',
          target: `components/blocks/${file}`,
        },
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

// Mirror all to packages/eolas-ui/registry for zero-dependency CLI bundling
if (!fs.existsSync(PKG_REGISTRY)) {
  fs.mkdirSync(PKG_REGISTRY, { recursive: true });
}
for (const item of registryItems) {
  const itemData = fs.readFileSync(path.join(OUT_DIR, `${item.name}.json`), 'utf8');
  fs.writeFileSync(path.join(PKG_REGISTRY, `${item.name}.json`), itemData);
}
fs.writeFileSync(path.join(PKG_REGISTRY, 'index.json'), JSON.stringify(registryItems, null, 2));
fs.writeFileSync(path.join(PKG_REGISTRY, 'registry.json'), JSON.stringify(registryCatalog, null, 2));

console.log(`Successfully generated registry at public/r/ and packages/eolas-ui/registry/ with ${registryItems.length} items.`);
