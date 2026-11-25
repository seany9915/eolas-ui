import fs from 'node:fs';
import {
  CATEGORY_MAP,
  PUBLIC_SYSTEM_LIBS,
  TRANSITIONS_DEV_MAP,
} from './registry-meta.mjs';

const r = JSON.parse(fs.readFileSync('public/r/registry.json', 'utf8'));

const IMPORT_STATEMENT_OVERRIDES = {
  'csp-provider': "import { CSPProvider } from '@/components/ui/csp-provider';",
  'otp-field': "import { OTPField } from '@/components/ui/otp-field';",
  utils: "import { cn, sanitizeUrl, mergeProps, useRender } from '@/lib/utils';",
  sanitize: "import { sanitizeHtml, SanitizedHtml } from '@/lib/sanitize';",
  scheduler: "import { yieldToMain, processChunked, useYieldingFilter } from '@/lib/scheduler';",
  'built-in-ai': "import { useLanguageModel, useSummarizer, useTranslator } from '@/lib/built-in-ai';",
  'scroll-completion': "import { scrollIntoViewAsync, scrollToAsync } from '@/lib/scroll-completion';",
  'format-duration': "import { formatDuration, useDurationFormat } from '@/lib/format-duration';",
};

function inferImportStatement(name, title, tier, filePath, fileContent) {
  if (IMPORT_STATEMENT_OVERRIDES[name]) return IMPORT_STATEMENT_OVERRIDES[name];
  const importPath =
    tier === 'block'
      ? `@/components/blocks/${name}`
      : tier === 'utility' && filePath.startsWith('src/lib/')
        ? `@/lib/${name}`
        : `@/components/ui/${name}`;
  const pascalCandidate = title.replace(/[^A-Za-z0-9]+/g, '');
  const namedExports = [];
  for (const m of fileContent.matchAll(/export\s+(?:async\s+)?(?:const|function|class)\s+([A-Z][A-Za-z0-9_]*)/g)) {
    namedExports.push(m[1]);
  }
  for (const m of fileContent.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith('type ')) continue;
      const alias = trimmed.includes(' as ') ? trimmed.split(/\s+as\s+/)[1].trim() : trimmed;
      if (/^[A-Z]/.test(alias)) namedExports.push(alias);
    }
  }
  const exact =
    namedExports.find((e) => e.toLowerCase() === pascalCandidate.toLowerCase()) ||
    namedExports[0] ||
    pascalCandidate;
  return `import { ${exact} } from '${importPath}';`;
}

const items = r.items.filter(
  (i) => i.type === 'registry:ui' || i.type === 'registry:block' || (i.type === 'registry:lib' && PUBLIC_SYSTEM_LIBS.has(i.name))
);

const registryEntries = items.map((item) => {
  const isBlock = item.type === 'registry:block';
  const isLib = item.type === 'registry:lib';
  const filePath = isBlock
    ? `src/components/blocks/${item.name}.tsx`
    : isLib
      ? `src/lib/${item.name}.ts`
      : `src/components/ui/${item.name}.tsx`;
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch {
    console.warn('Could not read', filePath);
  }

  const isTransitionsDev = Boolean(TRANSITIONS_DEV_MAP[item.name]) || fileContent.includes('transitions.dev');

  const baseUIMatch = fileContent.match(/@base-ui\/react\/([a-z0-9-]+)/);
  const basePrimitive = isLib
    ? 'Eolas Utility Module'
    : isTransitionsDev
      ? 'transitions.dev (@jakubantalik)'
      : baseUIMatch
        ? `@base-ui/react/${baseUIMatch[1]}`
        : isBlock
          ? 'Composite Block'
          : 'DESIGN.md Token Primitive';

  const platformReference = isTransitionsDev
    ? 'https://transitions.dev/library.html'
    : item.name === 'view-transition'
      ? 'https://developer.chrome.com/docs/web-platform/view-transitions'
      : item.name === 'swipe-reveal'
        ? 'https://developer.chrome.com'
        : undefined;

  const category = item.categories?.[0] || CATEGORY_MAP[item.name] || (isBlock ? 'blocks' : 'layout');
  const tier = isBlock ? 'block' : isLib ? 'utility' : 'primitive';

  const title = item.title || item.name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const description = TRANSITIONS_DEV_MAP[item.name] || item.description || `Eolas UI ${title} component.`;
  const taxonomy = item.meta?.taxonomy || [];
  const dependencies = item.dependencies || [];
  const importStatement = inferImportStatement(item.name, title, tier, filePath, fileContent);
  const shadcnCommand = `npx shadcn@latest add @eolas/${item.name}`;
  const eolasCommand = `npx @seany9915/eolas-ui add ${item.name}`;

  return {
    id: item.name,
    name: item.name,
    title,
    description,
    category,
    tier,
    basePrimitive,
    ...(platformReference ? { platformReference } : {}),
    sourcePath: filePath,
    ...(taxonomy.length > 0 ? { taxonomy } : {}),
    ...(dependencies.length > 0 ? { dependencies } : {}),
    importStatement,
    shadcnCommand,
    eolasCommand,
  };
});

const fileHeader = `// AUTO-GENERATED REGISTRY MANIFEST
import { RegistryEntry } from './types';

export const REGISTRY_ENTRIES: RegistryEntry[] = ${JSON.stringify(registryEntries, null, 2)};

export const REGISTRY_MAP: Record<string, RegistryEntry> = Object.fromEntries(
  REGISTRY_ENTRIES.map((entry) => [entry.id, entry])
);
`;

fs.writeFileSync('src/components/playground/registry/registry-manifest.ts', fileHeader);
console.log(`Generated manifest with ${registryEntries.length} entries.`);
