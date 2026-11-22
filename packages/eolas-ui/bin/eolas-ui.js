#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTRY_DIR = path.resolve(__dirname, '../registry');
const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');

const CLI_VERSION = (() => {
  try {
    return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8')).version || '0.0.0';
  } catch {
    return '0.0.0';
  }
})();

const DEPRECATED_ITEMS = new Set([
  'selection-controls',
  'toggles',
  'steppers',
  'empty-state',
  'number-roll',
  'approval-card',
  'metric-card',
  'delete-confirmation-dialog',
]);

const KNOWN_FLAGS = new Set([
  '--overwrite',
  '-o',
  '--dry-run',
  '--all',
  '-a',
  '--include-deprecated',
  '--version',
  '-v',
]);

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
eolas-ui v${CLI_VERSION} - Base UI Component Registry CLI

USAGE:
  npx @seany9915/eolas-ui add <item-name...> [--overwrite] [--dry-run]
  npx @seany9915/eolas-ui add --all [--overwrite] [--dry-run] [--include-deprecated]
  npx @seany9915/eolas-ui sync [item-name...] [--all] [--dry-run] [--include-deprecated]
  npx @seany9915/eolas-ui list
  npx @seany9915/eolas-ui --version

NOTES:
  --all installs all non-deprecated UI primitives, composite blocks, and utilities
  (pass --include-deprecated to also include legacy compatibility items).
  Presets (theme, design-md, agent-rules, lint) can be added explicitly via \`add\`
  and are automatically updated by \`sync\` once installed in your project.

EXAMPLES:
  npx @seany9915/eolas-ui add button dialog select
  npx @seany9915/eolas-ui add @eolas/button
  npx @seany9915/eolas-ui add theme design-md agent-rules lint
  npx @seany9915/eolas-ui add tabs --overwrite
  npx @seany9915/eolas-ui add data-table --dry-run
  npx @seany9915/eolas-ui sync --dry-run
  npx @seany9915/eolas-ui sync --all
  npx @seany9915/eolas-ui list
`);
}

function loadRegistryIndex() {
  const indexPath = path.join(REGISTRY_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('Error: Registry index not found.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
}

function loadComponentsConfig(cwd) {
  const componentsJsonPath = path.resolve(cwd, 'components.json');
  if (!fs.existsSync(componentsJsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(componentsJsonPath, 'utf8'));
  } catch {
    console.warn('Warning: Could not parse components.json; using default path aliases.');
    return null;
  }
}

function stripJsonCommentsAndTrailingCommas(text) {
  let out = '';
  let inString = false;
  let quote = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inString) {
      out += ch;
      if (ch === '\\' && i + 1 < text.length) {
        out += next;
        i += 1;
      } else if (ch === quote) {
        inString = false;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i + 1 < text.length && text[i + 1] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      const closeIdx = text.indexOf('*/', i + 2);
      if (closeIdx !== -1) {
        i = closeIdx + 1;
        continue;
      }
    }
    out += ch;
  }
  return out.replace(/,\s*([}\]])/g, '$1');
}

function resolveTsconfigFile(fromDir, spec) {
  if (typeof spec !== 'string' || !spec.trim()) return null;
  const candidate = path.resolve(fromDir, spec);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  if (!candidate.endsWith('.json') && fs.existsSync(`${candidate}.json`) && fs.statSync(`${candidate}.json`).isFile()) {
    return `${candidate}.json`;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const tsInDir = path.join(candidate, 'tsconfig.json');
    if (fs.existsSync(tsInDir) && fs.statSync(tsInDir).isFile()) return tsInDir;
    const jsInDir = path.join(candidate, 'jsconfig.json');
    if (fs.existsSync(jsInDir) && fs.statSync(jsInDir).isFile()) return jsInDir;
  }
  return null;
}

function loadTsconfigRecursive(configPath, ancestorChain = new Set(), refVisited = new Set()) {
  const absPath = path.resolve(configPath);
  if (ancestorChain.has(absPath)) {
    return { baseUrlAbs: null, entries: [] };
  }

  let parsed;
  try {
    const raw = fs.readFileSync(absPath, 'utf8');
    parsed = JSON.parse(stripJsonCommentsAndTrailingCommas(raw));
  } catch {
    return { baseUrlAbs: null, entries: [] };
  }

  const nextAncestors = new Set(ancestorChain);
  nextAncestors.add(absPath);
  refVisited.add(absPath);

  const configDir = path.dirname(absPath);
  let inheritedBaseUrlAbs = null;
  const entryMap = new Map();

  // Follow `extends` (string or array of strings)
  const extendsList = Array.isArray(parsed?.extends)
    ? parsed.extends
    : typeof parsed?.extends === 'string'
      ? [parsed.extends]
      : [];

  for (const ext of extendsList) {
    const extPath = resolveTsconfigFile(configDir, ext);
    if (!extPath) continue;
    const parent = loadTsconfigRecursive(extPath, nextAncestors, refVisited);
    if (parent.baseUrlAbs) {
      inheritedBaseUrlAbs = parent.baseUrlAbs;
    }
    for (const entry of parent.entries) {
      entryMap.set(entry.pattern, entry);
    }
  }

  // Own compilerOptions.baseUrl and compilerOptions.paths
  const ownBaseUrl = parsed?.compilerOptions?.baseUrl;
  const effectiveBaseUrlAbs =
    typeof ownBaseUrl === 'string' && ownBaseUrl.trim()
      ? path.resolve(configDir, ownBaseUrl)
      : inheritedBaseUrlAbs;

  const pathsRoot = effectiveBaseUrlAbs || configDir;
  const ownPaths = parsed?.compilerOptions?.paths;
  if (ownPaths && typeof ownPaths === 'object') {
    for (const [pattern, targets] of Object.entries(ownPaths)) {
      entryMap.set(pattern, { pattern, targets, resolveRoot: pathsRoot });
    }
  }

  // Follow `references` (e.g., Vite tsconfig.json -> tsconfig.app.json)
  if (Array.isArray(parsed?.references)) {
    for (const ref of parsed.references) {
      if (!ref || typeof ref.path !== 'string') continue;
      const refPath = resolveTsconfigFile(configDir, ref.path);
      if (!refPath || refVisited.has(path.resolve(refPath))) continue;
      const refData = loadTsconfigRecursive(refPath, nextAncestors, refVisited);
      for (const entry of refData.entries) {
        if (!entryMap.has(entry.pattern)) {
          entryMap.set(entry.pattern, entry);
        }
      }
    }
  }

  return {
    baseUrlAbs: effectiveBaseUrlAbs,
    entries: Array.from(entryMap.values()),
  };
}

function loadTsconfigPaths(cwd) {
  const tsconfigPath = path.resolve(cwd, 'tsconfig.json');
  const jsconfigPath = path.resolve(cwd, 'jsconfig.json');
  const rootConfig = fs.existsSync(tsconfigPath)
    ? tsconfigPath
    : fs.existsSync(jsconfigPath)
      ? jsconfigPath
      : null;

  if (!rootConfig) return null;

  const result = loadTsconfigRecursive(rootConfig);
  if (result.entries.length === 0 && !result.baseUrlAbs) return null;
  return result;
}

function getUiAlias(componentsConfig) {
  const trimSlash = (val) => val.replace(/\/+$/, '');
  if (componentsConfig?.aliases?.ui) {
    return trimSlash(componentsConfig.aliases.ui);
  }
  if (componentsConfig?.aliases?.components) {
    return `${trimSlash(componentsConfig.aliases.components)}/ui`;
  }
  return null;
}

function getLibAlias(componentsConfig) {
  const trimSlash = (val) => val.replace(/\/+$/, '');
  if (componentsConfig?.aliases?.lib) {
    return trimSlash(componentsConfig.aliases.lib);
  }
  if (componentsConfig?.aliases?.utils) {
    const normalizedUtils = trimSlash(componentsConfig.aliases.utils);
    const lastSlash = normalizedUtils.lastIndexOf('/');
    if (lastSlash > 0) {
      return normalizedUtils.slice(0, lastSlash);
    }
  }
  return null;
}

function rewriteImports(content, filePath, componentsConfig) {
  if (!/\.(tsx?|jsx?|mjs)$/i.test(filePath)) return content;
  const aliases = componentsConfig?.aliases;
  if (!aliases) return content;

  let next = content;
  const trimSlash = (val) => val.replace(/\/+$/, '');

  const utilsAlias = aliases.utils ? trimSlash(aliases.utils) : null;
  const libAlias = getLibAlias(componentsConfig);
  const componentsAlias = aliases.components ? trimSlash(aliases.components) : null;
  const uiAlias = getUiAlias(componentsConfig);

  if (libAlias && libAlias !== '@/lib') {
    next = next.replace(/(['"])@\/lib\/(?!utils\1)([^'"]+)\1/g, (_m, q, rest) => `${q}${libAlias}/${rest}${q}`);
  }

  const targetUtilsImport =
    utilsAlias && utilsAlias !== '@/lib/utils'
      ? utilsAlias
      : libAlias && libAlias !== '@/lib'
        ? `${libAlias}/utils`
        : null;

  if (targetUtilsImport) {
    next = next.replace(/(['"])@\/lib\/utils\1/g, (_m, q) => `${q}${targetUtilsImport}${q}`);
  }

  if (uiAlias && uiAlias !== '@/components/ui') {
    next = next.replace(/(['"])@\/components\/ui\/([^'"]+)\1/g, (_m, q, rest) => `${q}${uiAlias}/${rest}${q}`);
  }

  if (componentsAlias && componentsAlias !== '@/components') {
    next = next.replace(/(['"])@\/components\/blocks\/([^'"]+)\1/g, (_m, q, rest) => `${q}${componentsAlias}/blocks/${rest}${q}`);
  }

  return next;
}

function resolveFromTsconfigPaths(rawAlias, tsconfigPaths, cwd) {
  if (!tsconfigPaths || !Array.isArray(tsconfigPaths.entries)) return null;

  const sortedEntries = [...tsconfigPaths.entries].sort((a, b) => {
    const aWild = a.pattern.includes('*');
    const bWild = b.pattern.includes('*');
    if (aWild !== bWild) return aWild ? 1 : -1;
    return b.pattern.length - a.pattern.length;
  });

  for (const { pattern, targets, resolveRoot } of sortedEntries) {
    if (!Array.isArray(targets) || targets.length === 0) continue;
    const firstTarget = targets[0];
    if (typeof firstTarget !== 'string') continue;

    let mapped = null;
    if (pattern.includes('*') && firstTarget.includes('*')) {
      const [patPrefix, patSuffix] = pattern.split('*');
      const [tgtPrefix, tgtSuffix] = firstTarget.split('*');
      if (rawAlias.startsWith(patPrefix) && rawAlias.endsWith(patSuffix)) {
        const matched = rawAlias.slice(patPrefix.length, rawAlias.length - patSuffix.length);
        mapped = `${tgtPrefix}${matched}${tgtSuffix}`;
      } else if (patSuffix === '' && patPrefix.endsWith('/') && rawAlias === patPrefix.slice(0, -1)) {
        mapped = tgtPrefix.replace(/\/+$/, '') || '.';
      }
    } else if (pattern === rawAlias) {
      mapped = firstTarget;
    }

    if (mapped !== null) {
      const absTarget = path.resolve(resolveRoot, mapped);
      return path.relative(cwd, absTarget).replace(/\\/g, '/');
    }
  }
  return null;
}

function resolveAlias(rawAlias, fallback, { cwd, hasSrc, tsconfigPaths }) {
  const defaultSrc = hasSrc ? 'src' : '';
  if (!rawAlias) return path.join(defaultSrc, fallback);

  const tsMapped = resolveFromTsconfigPaths(rawAlias, tsconfigPaths, cwd);
  if (tsMapped !== null) {
    return tsMapped;
  }

  if (rawAlias.startsWith('@/') || rawAlias.startsWith('~/')) {
    const stripped = rawAlias.slice(2);
    return hasSrc && !stripped.startsWith('src/') ? path.join('src', stripped) : stripped;
  }
  if (tsconfigPaths?.baseUrlAbs && !rawAlias.startsWith('.') && !path.isAbsolute(rawAlias)) {
    const absTarget = path.resolve(tsconfigPaths.baseUrlAbs, rawAlias);
    return path.relative(cwd, absTarget).replace(/\\/g, '/');
  }
  return rawAlias;
}

function getFallbackTarget(file, itemType) {
  const baseName = path.basename(file.path || '');
  const kind = file.type || itemType;
  if (kind === 'registry:ui') return `@ui/${baseName}`;
  if (kind === 'registry:block') return `@components/blocks/${baseName}`;
  if (kind === 'registry:lib') return `@lib/${baseName}`;
  if (kind === 'registry:hook') return `@hooks/${baseName}`;
  return file.path || baseName;
}

const THEME_TARGET_NAMES = new Set([
  '~/src/eolas-theme.css',
  '~/src/globals.css',
  'styles/eolas-theme.css',
  'styles/globals.css',
  'globals.css',
]);

function getThemeCandidatePaths(cwd, componentsConfig) {
  const candidates = [];
  if (componentsConfig?.tailwind?.css) {
    candidates.push(path.resolve(cwd, componentsConfig.tailwind.css));
  }
  for (const rel of [
    'src/eolas-theme.css',
    'src/globals.css',
    'src/styles/globals.css',
    'src/app/globals.css',
    'app/globals.css',
    'styles/globals.css',
    'src/index.css',
    'globals.css',
  ]) {
    const abs = path.resolve(cwd, rel);
    if (!candidates.includes(abs)) candidates.push(abs);
  }
  return candidates;
}

function resolveDestPath(file, itemType, componentsConfig, ctx) {
  const { cwd, hasSrc } = ctx;
  const target = file.target || getFallbackTarget(file, itemType);
  let destPath;

  if (target === '@lib/utils.ts' && componentsConfig?.aliases?.utils) {
    const utilsTarget = resolveAlias(componentsConfig.aliases.utils, 'lib/utils', ctx);
    const utilsFile = /\.[jt]sx?$/i.test(utilsTarget) ? utilsTarget : `${utilsTarget}.ts`;
    destPath = path.resolve(cwd, utilsFile);
  } else if (target.startsWith('~/')) {
    destPath = path.resolve(cwd, target.slice(2));
  } else if (target.startsWith('@ui/')) {
    const uiAlias = getUiAlias(componentsConfig);
    const alias = resolveAlias(uiAlias, 'components/ui', ctx);
    destPath = path.resolve(cwd, alias, target.slice(4));
  } else if (target.startsWith('@components/')) {
    const alias = resolveAlias(componentsConfig?.aliases?.components, 'components', ctx);
    destPath = path.resolve(cwd, alias, target.slice(12));
  } else if (target.startsWith('@lib/')) {
    const alias = resolveAlias(getLibAlias(componentsConfig), 'lib', ctx);
    destPath = path.resolve(cwd, alias, target.slice(5));
  } else if (target.startsWith('@hooks/')) {
    const alias = resolveAlias(componentsConfig?.aliases?.hooks, 'hooks', ctx);
    destPath = path.resolve(cwd, alias, target.slice(7));
  } else {
    const isRootFile = target.startsWith('lint/') || target.startsWith('.');
    const baseDir = isRootFile ? cwd : hasSrc ? path.resolve(cwd, 'src') : cwd;
    destPath = path.resolve(baseDir, target);
  }

  // Smart resolution for theme stylesheet target (never hijack an existing non-Eolas stylesheet)
  if (THEME_TARGET_NAMES.has(target)) {
    if (componentsConfig?.tailwind?.css) {
      const configuredCss = path.resolve(cwd, componentsConfig.tailwind.css);
      if (!fs.existsSync(configuredCss) || hasEolasThemeSignature(configuredCss)) {
        destPath = configuredCss;
      }
    } else {
      const candidates = getThemeCandidatePaths(cwd, null);
      const existing = candidates.find((p) => hasEolasThemeSignature(p));
      if (existing) destPath = existing;
    }
  }

  // Guard against path traversal outside workspace root
  const relToCwd = path.relative(cwd, destPath);
  if (relToCwd.startsWith('..') || path.isAbsolute(relToCwd)) {
    throw new Error(`Refusing to resolve target outside workspace root: "${destPath}"`);
  }

  return destPath;
}

function normalizeRegistryDep(dep) {
  return String(dep)
    .trim()
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/^https?:\/\/.+\/r\//, '')
    .replace(/\.json$/, '')
    .replace(/^(?:@seany9915\/eolas-ui|seany9915\/eolas-ui|@eolas)\//, '');
}

function isValidItemName(name, catalogMap) {
  if (!name || typeof name !== 'string') return false;
  if (name === 'index' || name === 'registry') return false;
  if (name.includes('/') || name.includes('\\') || name.includes('..')) return false;
  return catalogMap.has(name);
}

function warnUnknownFlags(flags) {
  for (const flag of flags) {
    if (!KNOWN_FLAGS.has(flag)) {
      console.warn(`Warning: Unknown flag "${flag}" ignored.`);
    }
  }
}

function listComponents() {
  const items = loadRegistryIndex();
  const uiItems = items.filter((i) => i.type === 'registry:ui').map((i) => i.name);
  const blockItems = items.filter((i) => i.type === 'registry:block').map((i) => i.name);
  const otherItems = items.filter((i) => i.type !== 'registry:ui' && i.type !== 'registry:block').map((i) => i.name);

  console.log(`\nAvailable Eolas UI Primitives (Total: ${uiItems.length}):\n`);
  console.log(uiItems.join(', '));

  if (blockItems.length > 0) {
    console.log(`\nComposite Blocks (Total: ${blockItems.length}):\n`);
    console.log(blockItems.join(', '));
  }

  if (otherItems.length > 0) {
    console.log(`\nPresets, Rules & Utilities (Total: ${otherItems.length}):\n`);
    console.log(otherItems.join(', '));
  }
  console.log('');
}

function addComponents(componentNames, { overwrite = false, dryRun = false } = {}) {
  if (componentNames.length === 0) {
    console.error('Error: Please specify one or more components or items to add.');
    console.log('Run `npx @seany9915/eolas-ui list` to see available items.');
    process.exit(1);
  }

  const indexItems = loadRegistryIndex();
  const catalogMap = new Map(indexItems.map((i) => [i.name, i]));

  const cwd = process.cwd();
  const componentsConfig = loadComponentsConfig(cwd);
  const hasSrc = fs.existsSync(path.resolve(cwd, 'src'));
  const tsconfigPaths = loadTsconfigPaths(cwd);
  const ctx = { cwd, hasSrc, tsconfigPaths };

  // Phase 1: Validate and resolve the complete item + dependency graph in memory before touching disk
  const queue = componentNames.map(normalizeRegistryDep);
  const processed = new Set();
  const resolvedItems = [];
  const missing = [];
  const requiredDeps = new Set();
  const requiredDevDeps = new Set();
  const docsNotes = [];

  while (queue.length > 0) {
    const name = queue.shift();
    if (processed.has(name)) continue;
    processed.add(name);

    if (!isValidItemName(name, catalogMap)) {
      console.error(`Error: Item ${name} not found in Eolas UI registry.`);
      missing.push(name);
      continue;
    }

    const compFile = path.join(REGISTRY_DIR, `${name}.json`);
    if (!fs.existsSync(compFile)) {
      console.error(`Error: Item ${name} not found in Eolas UI registry.`);
      missing.push(name);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(compFile, 'utf8'));
    resolvedItems.push(data);

    if (Array.isArray(data.dependencies)) {
      for (const dep of data.dependencies) requiredDeps.add(dep);
    }
    if (Array.isArray(data.devDependencies)) {
      for (const dep of data.devDependencies) requiredDevDeps.add(dep);
    }
    if (typeof data.docs === 'string' && data.docs.trim()) {
      docsNotes.push({ name: data.name, docs: data.docs.trim() });
    }

    if (Array.isArray(data.registryDependencies)) {
      for (const dep of data.registryDependencies) {
        const normalizedDep = normalizeRegistryDep(dep);
        if (!processed.has(normalizedDep)) {
          queue.push(normalizedDep);
        }
      }
    }
  }

  if (missing.length > 0) {
    console.error(`\nFailed: could not resolve ${missing.join(', ')}. No files were written.`);
    process.exit(1);
  }

  // Phase 2: Write (or preview) files after full graph validation succeeds
  const installedFiles = [];
  for (const data of resolvedItems) {
    if (!Array.isArray(data.files)) continue;

    for (const file of data.files) {
      const destPath = resolveDestPath(file, data.type, componentsConfig, ctx);
      const relDest = path.relative(cwd, destPath).replace(/\\/g, '/');
      const outputContent = rewriteImports(file.content ?? '', relDest, componentsConfig);
      const exists = fs.existsSync(destPath);

      if (exists && !overwrite) {
        if (dryRun) {
          console.log(`  [dry-run] Would skip ${relDest} (already exists)`);
        } else {
          console.log(`  - Skipping ${relDest} (already exists, pass --overwrite to replace)`);
        }
      } else if (dryRun) {
        console.log(`  [dry-run] Would write ${relDest}${exists ? ' (overwrite)' : ''}`);
        installedFiles.push(relDest);
      } else {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.writeFileSync(destPath, outputContent, 'utf8');
        console.log(`  + Installed ${relDest}`);
        installedFiles.push(relDest);
      }
    }
  }

  const formatInstallSpec = (spec) => (/[\^~><\s]/.test(spec) ? `"${spec}"` : spec);
  console.log(`\n${dryRun ? '[dry-run] Would process' : 'Successfully processed'} ${resolvedItems.length} items/dependencies (${installedFiles.length} file(s)).`);
  if (requiredDeps.size > 0) {
    console.log(`Required dependencies:\n  npm install ${Array.from(requiredDeps).sort().map(formatInstallSpec).join(' ')}`);
  }
  if (requiredDevDeps.size > 0) {
    console.log(`Required devDependencies:\n  npm install -D ${Array.from(requiredDevDeps).sort().map(formatInstallSpec).join(' ')}`);
  }
  if (docsNotes.length > 0) {
    console.log('\nSetup notes:');
    for (const note of docsNotes) {
      console.log(`- ${note.name}: ${note.docs}`);
    }
  }
  console.log('');
}

function hasEolasThemeSignature(filePath) {
  if (!fs.existsSync(filePath)) return false;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return (
      content.includes('--surface-container-low') ||
      content.includes('Eolas High-Contrast') ||
      content.includes('data-surface="inverted"')
    );
  } catch {
    return false;
  }
}

function detectInstalledItems(items, cwd) {
  const componentsConfig = loadComponentsConfig(cwd);
  const hasSrc = fs.existsSync(path.resolve(cwd, 'src'));
  const tsconfigPaths = loadTsconfigPaths(cwd);
  const ctx = { cwd, hasSrc, tsconfigPaths };
  const catalogNames = new Set(items.map((i) => i.name));

  const installed = [];
  for (const item of items) {
    if (item.type !== 'registry:ui' && item.type !== 'registry:block' && item.type !== 'registry:lib') {
      continue;
    }
    const itemFile = path.join(REGISTRY_DIR, `${item.name}.json`);
    if (!fs.existsSync(itemFile)) continue;
    const data = JSON.parse(fs.readFileSync(itemFile, 'utf8'));
    const primaryFile = Array.isArray(data.files) ? data.files[0] : null;
    if (!primaryFile) continue;
    const destPath = resolveDestPath(primaryFile, data.type, componentsConfig, ctx);
    if (fs.existsSync(destPath)) {
      if (item.name === 'utils') {
        try {
          const utilsSrc = fs.readFileSync(destPath, 'utf8');
          if (!utilsSrc.includes('composeClassName') && !utilsSrc.includes('resolveNativeButton')) {
            continue;
          }
        } catch {
          continue;
        }
      }
      installed.push(item.name);
    }
  }

  // Detect installed non-component presets (theme, design-md, agent-rules, lint)
  if (catalogNames.has('theme')) {
    const themeCandidates = getThemeCandidatePaths(cwd, componentsConfig);
    if (themeCandidates.some((candidate) => hasEolasThemeSignature(candidate))) {
      installed.push('theme');
    }
  }

  if (catalogNames.has('design-md')) {
    const designMdPath = path.resolve(cwd, 'DESIGN.md');
    if (fs.existsSync(designMdPath)) {
      try {
        if (fs.readFileSync(designMdPath, 'utf8').includes('Eolas')) {
          installed.push('design-md');
        }
      } catch {
        // Ignore unreadable DESIGN.md
      }
    }
  }

  if (catalogNames.has('agent-rules')) {
    if (fs.existsSync(path.resolve(cwd, '.agents/rules/00-core-contract.md'))) {
      installed.push('agent-rules');
    }
  }

  if (catalogNames.has('lint')) {
    const lintIndexPath = path.resolve(cwd, 'lint/index.mjs');
    const oxlintPath = path.resolve(cwd, '.oxlintrc.json');
    let hasLint = fs.existsSync(lintIndexPath);
    if (!hasLint && fs.existsSync(oxlintPath)) {
      try {
        hasLint = fs.readFileSync(oxlintPath, 'utf8').includes('./lint/index.mjs');
      } catch {
        hasLint = false;
      }
    }
    if (hasLint) {
      installed.push('lint');
    }
  }

  return installed;
}

// CLI Dispatcher
if (!command || command === '--help' || command === '-h' || command === 'help') {
  printHelp();
} else if (command === '--version' || command === '-v' || command === 'version') {
  console.log(CLI_VERSION);
} else if (command === 'list') {
  listComponents();
} else if (command === 'sync') {
  const flags = args.slice(1).filter((a) => a.startsWith('-'));
  warnUnknownFlags(flags);
  const requestedNames = args.slice(1).filter((a) => !a.startsWith('-'));
  const dryRun = flags.includes('--dry-run');
  const syncAll = flags.includes('--all') || flags.includes('-a');
  const includeDeprecated = flags.includes('--include-deprecated');
  const items = loadRegistryIndex();

  const nonDeprecatedNames = items
    .filter(
      (i) =>
        (i.type === 'registry:ui' || i.type === 'registry:block' || i.type === 'registry:lib') &&
        (includeDeprecated || !DEPRECATED_ITEMS.has(i.name))
    )
    .map((i) => i.name);

  if (syncAll) {
    const installedPresets = detectInstalledItems(items, process.cwd()).filter((name) =>
      ['theme', 'design-md', 'agent-rules', 'lint'].includes(name)
    );
    const syncTargets = Array.from(new Set([...nonDeprecatedNames, ...installedPresets, ...requestedNames]));
    console.log(
      `${dryRun ? '[dry-run] Previewing sync of' : 'Syncing'} all ${nonDeprecatedNames.length} Eolas UI components, blocks, and utilities${installedPresets.length > 0 ? ` plus ${installedPresets.length} installed preset(s) (${installedPresets.join(', ')})` : ''}...\n`
    );
    addComponents(syncTargets, { overwrite: true, dryRun });
  } else if (requestedNames.length > 0) {
    console.log(`${dryRun ? '[dry-run] Previewing sync of' : 'Syncing'} ${requestedNames.length} specified Eolas UI item(s) and their dependencies...\n`);
    addComponents(requestedNames, { overwrite: true, dryRun });
  } else {
    const detected = detectInstalledItems(items, process.cwd());
    if (detected.length > 0) {
      console.log(`${dryRun ? '[dry-run] Previewing sync of' : 'Syncing'} ${detected.length} installed Eolas UI item(s) and their dependencies...\n`);
      addComponents(detected, { overwrite: true, dryRun });
    } else {
      console.log(
        'No installed Eolas UI items detected in this project. Run `eolas-ui add <item...>` to install specific items, or `eolas-ui sync --all` to install the full catalog.'
      );
      process.exit(0);
    }
  }
} else if (command === 'add') {
  const flags = args.slice(1).filter((a) => a.startsWith('-'));
  warnUnknownFlags(flags);
  const names = args.slice(1).filter((a) => !a.startsWith('-'));
  const overwrite = flags.includes('--overwrite') || flags.includes('-o');
  const dryRun = flags.includes('--dry-run');
  const includeDeprecated = flags.includes('--include-deprecated');

  if (flags.includes('--all') || flags.includes('-a') || names.includes('all')) {
    const items = loadRegistryIndex();
    const allComponentNames = items
      .filter(
        (i) =>
          (i.type === 'registry:ui' || i.type === 'registry:block' || i.type === 'registry:lib') &&
          (includeDeprecated || !DEPRECATED_ITEMS.has(i.name))
      )
      .map((i) => i.name);
    const extraNames = names.filter((n) => n !== 'all');
    const combinedNames = Array.from(new Set([...allComponentNames, ...extraNames]));
    addComponents(combinedNames, { overwrite, dryRun });
  } else {
    addComponents(names, { overwrite, dryRun });
  }
} else {
  console.error(`Unknown command: ${command}\n`);
  printHelp();
  process.exit(1);
}
