#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTRY_DIR = path.resolve(__dirname, '../registry');

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
]);

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
eolas-ui - Private Base UI Component Registry CLI

USAGE:
  npx @seany9915/eolas-ui add <item-name...> [--overwrite] [--dry-run]
  npx @seany9915/eolas-ui add --all [--overwrite] [--dry-run] [--include-deprecated]
  npx @seany9915/eolas-ui sync [--all] [--dry-run] [--include-deprecated]
  npx @seany9915/eolas-ui list

EXAMPLES:
  npx @seany9915/eolas-ui add button dialog select
  npx @seany9915/eolas-ui add design-md agent-rules lint theme
  npx @seany9915/eolas-ui add tabs --overwrite
  npx @seany9915/eolas-ui add data-table --dry-run
  npx @seany9915/eolas-ui sync --dry-run
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

function loadTsconfigPaths(cwd) {
  const tsconfigPath = path.resolve(cwd, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) return null;
  try {
    const raw = fs.readFileSync(tsconfigPath, 'utf8');
    const parsed = JSON.parse(stripJsonCommentsAndTrailingCommas(raw));
    const paths = parsed?.compilerOptions?.paths;
    return paths && typeof paths === 'object' ? paths : null;
  } catch {
    return null;
  }
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

function rewriteImports(content, filePath, componentsConfig) {
  if (!/\.(tsx?|jsx?|mjs)$/i.test(filePath)) return content;
  const aliases = componentsConfig?.aliases;
  if (!aliases) return content;

  let next = content;
  const trimSlash = (val) => val.replace(/\/+$/, '');

  const utilsAlias = aliases.utils ? trimSlash(aliases.utils) : null;
  const libAlias = aliases.lib ? trimSlash(aliases.lib) : null;
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

function resolveFromTsconfigPaths(rawAlias, tsconfigPaths) {
  if (!tsconfigPaths) return null;
  for (const [pattern, targets] of Object.entries(tsconfigPaths)) {
    if (!Array.isArray(targets) || targets.length === 0) continue;
    const firstTarget = targets[0];
    if (typeof firstTarget !== 'string') continue;

    if (pattern.endsWith('/*') && firstTarget.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      const targetPrefix = firstTarget.slice(0, -1).replace(/^\.\//, '');
      if (rawAlias.startsWith(prefix)) {
        return `${targetPrefix}${rawAlias.slice(prefix.length)}`;
      }
      if (rawAlias === prefix.slice(0, -1)) {
        return targetPrefix.replace(/\/+$/, '');
      }
    } else if (pattern === rawAlias) {
      return firstTarget.replace(/^\.\//, '');
    }
  }
  return null;
}

function resolveAlias(rawAlias, fallback, { hasSrc, tsconfigPaths }) {
  const defaultSrc = hasSrc ? 'src' : '';
  if (!rawAlias) return path.join(defaultSrc, fallback);

  const tsMapped = resolveFromTsconfigPaths(rawAlias, tsconfigPaths);
  if (tsMapped !== null) {
    return tsMapped;
  }

  if (rawAlias.startsWith('@/')) {
    const stripped = rawAlias.slice(2);
    return hasSrc && !stripped.startsWith('src/') ? path.join('src', stripped) : stripped;
  }
  if (rawAlias.startsWith('~/')) {
    return rawAlias.slice(2);
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
    const alias = resolveAlias(componentsConfig?.aliases?.lib, 'lib', ctx);
    destPath = path.resolve(cwd, alias, target.slice(5));
  } else if (target.startsWith('@hooks/')) {
    const alias = resolveAlias(componentsConfig?.aliases?.hooks, 'hooks', ctx);
    destPath = path.resolve(cwd, alias, target.slice(7));
  } else {
    const isRootFile = target.startsWith('lint/') || target.startsWith('.');
    const baseDir = isRootFile ? cwd : hasSrc ? path.resolve(cwd, 'src') : cwd;
    destPath = path.resolve(baseDir, target);
  }

  // Smart resolution for theme stylesheet target
  if (target === '~/src/globals.css' || target === 'styles/globals.css' || target === 'globals.css') {
    if (componentsConfig?.tailwind?.css) {
      destPath = path.resolve(cwd, componentsConfig.tailwind.css);
    } else {
      const candidates = [
        path.resolve(cwd, 'src/globals.css'),
        path.resolve(cwd, 'src/styles/globals.css'),
        path.resolve(cwd, 'src/app/globals.css'),
        path.resolve(cwd, 'app/globals.css'),
        path.resolve(cwd, 'styles/globals.css'),
        path.resolve(cwd, 'src/index.css'),
        path.resolve(cwd, 'globals.css'),
      ];
      const existing = candidates.find((p) => fs.existsSync(p));
      if (existing) destPath = existing;
    }
  }

  return destPath;
}

function normalizeRegistryDep(dep) {
  return dep
    .replace(/#.*$/, '')
    .replace(/^https?:\/\/[^/]+\/eolas-ui\/r\//, '')
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

  const queue = [...componentNames];
  const processed = new Set();
  const installedFiles = [];
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

    if (Array.isArray(data.dependencies)) {
      for (const dep of data.dependencies) requiredDeps.add(dep);
    }
    if (Array.isArray(data.devDependencies)) {
      for (const dep of data.devDependencies) requiredDevDeps.add(dep);
    }
    if (typeof data.docs === 'string' && data.docs.trim()) {
      docsNotes.push({ name: data.name, docs: data.docs.trim() });
    }

    // Queue internal registry dependencies
    if (Array.isArray(data.registryDependencies)) {
      for (const dep of data.registryDependencies) {
        const normalizedDep = normalizeRegistryDep(dep);
        if (!processed.has(normalizedDep)) {
          queue.push(normalizedDep);
        }
      }
    }

    if (!Array.isArray(data.files)) continue;

    // Write item files
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

  if (missing.length > 0) {
    console.error(`\nFailed: could not resolve ${missing.join(', ')}.`);
    process.exit(1);
  }

  console.log(`\n${dryRun ? '[dry-run] Would process' : 'Successfully processed'} ${processed.size} items/dependencies (${installedFiles.length} file(s)).`);
  if (requiredDeps.size > 0) {
    console.log(`Required dependencies:\n  npm install ${Array.from(requiredDeps).sort().join(' ')}`);
  }
  if (requiredDevDeps.size > 0) {
    console.log(`Required devDependencies:\n  npm install -D ${Array.from(requiredDevDeps).sort().join(' ')}`);
  }
  if (docsNotes.length > 0) {
    console.log('\nSetup notes:');
    for (const note of docsNotes) {
      console.log(`- ${note.name}: ${note.docs}`);
    }
  }
  console.log('');
}

function detectInstalledItems(items, cwd) {
  const componentsConfig = loadComponentsConfig(cwd);
  const hasSrc = fs.existsSync(path.resolve(cwd, 'src'));
  const tsconfigPaths = loadTsconfigPaths(cwd);
  const ctx = { cwd, hasSrc, tsconfigPaths };

  const installed = [];
  for (const item of items) {
    if (item.type !== 'registry:ui' && item.type !== 'registry:block' && item.type !== 'registry:lib') {
      continue;
    }
    if (item.name === 'utils') continue;
    const itemFile = path.join(REGISTRY_DIR, `${item.name}.json`);
    if (!fs.existsSync(itemFile)) continue;
    const data = JSON.parse(fs.readFileSync(itemFile, 'utf8'));
    const primaryFile = Array.isArray(data.files) ? data.files[0] : null;
    if (!primaryFile) continue;
    const destPath = resolveDestPath(primaryFile, data.type, componentsConfig, ctx);
    if (fs.existsSync(destPath)) {
      installed.push(item.name);
    }
  }
  return installed;
}

// CLI Dispatcher
if (!command || command === '--help' || command === '-h' || command === 'help') {
  printHelp();
} else if (command === 'list') {
  listComponents();
} else if (command === 'sync') {
  const flags = args.slice(1).filter((a) => a.startsWith('-'));
  warnUnknownFlags(flags);
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
    console.log(`${dryRun ? '[dry-run] Previewing sync of' : 'Syncing'} all ${nonDeprecatedNames.length} Eolas UI components, blocks, and utilities...\n`);
    addComponents(nonDeprecatedNames, { overwrite: true, dryRun });
  } else {
    const detected = detectInstalledItems(items, process.cwd());
    if (detected.length > 0) {
      console.log(`${dryRun ? '[dry-run] Previewing sync of' : 'Syncing'} ${detected.length} installed Eolas UI item(s) and their dependencies...\n`);
      addComponents(detected, { overwrite: true, dryRun });
    } else {
      console.log(
        `No existing Eolas UI components detected; ${dryRun ? 'previewing' : 'installing'} all ${nonDeprecatedNames.length} non-deprecated items (pass --all to force full catalog sync explicitly)...\n`
      );
      addComponents(nonDeprecatedNames, { overwrite: true, dryRun });
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
    addComponents(allComponentNames, { overwrite, dryRun });
  } else {
    addComponents(names, { overwrite, dryRun });
  }
} else {
  console.error(`Unknown command: ${command}\n`);
  printHelp();
  process.exit(1);
}
