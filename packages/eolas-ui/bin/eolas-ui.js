#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTRY_DIR = path.resolve(__dirname, '../registry');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
eolas-ui - Private Base UI Component Registry CLI

USAGE:
  npx @seany9915/eolas-ui add <item-name...> [--overwrite] [--dry-run]
  npx @seany9915/eolas-ui add --all [--overwrite] [--dry-run]
  npx @seany9915/eolas-ui sync [--dry-run]
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

function rewriteImports(content, filePath, componentsConfig) {
  if (!/\.(tsx?|jsx?|mjs)$/i.test(filePath)) return content;
  const aliases = componentsConfig?.aliases;
  if (!aliases) return content;

  let next = content;
  const trimSlash = (val) => val.replace(/\/+$/, '');

  const utilsAlias = aliases.utils ? trimSlash(aliases.utils) : null;
  const libAlias = aliases.lib ? trimSlash(aliases.lib) : null;
  const componentsAlias = aliases.components ? trimSlash(aliases.components) : null;
  const uiAlias = aliases.ui
    ? trimSlash(aliases.ui)
    : componentsAlias && componentsAlias !== '@/components'
      ? `${componentsAlias}/ui`
      : null;

  if (utilsAlias && utilsAlias !== '@/lib/utils') {
    next = next.replace(/(['"])@\/lib\/utils\1/g, (_m, q) => `${q}${utilsAlias}${q}`);
  } else if (libAlias && libAlias !== '@/lib') {
    next = next.replace(/(['"])@\/lib\/utils\1/g, (_m, q) => `${q}${libAlias}/utils${q}`);
  }

  if (libAlias && libAlias !== '@/lib') {
    next = next.replace(/(['"])@\/lib\/([^'"]+)\1/g, (_m, q, rest) => `${q}${libAlias}/${rest}${q}`);
  }

  if (uiAlias && uiAlias !== '@/components/ui') {
    next = next.replace(/(['"])@\/components\/ui\/([^'"]+)\1/g, (_m, q, rest) => `${q}${uiAlias}/${rest}${q}`);
  }

  if (componentsAlias && componentsAlias !== '@/components') {
    next = next.replace(/(['"])@\/components\/blocks\/([^'"]+)\1/g, (_m, q, rest) => `${q}${componentsAlias}/blocks/${rest}${q}`);
  }

  return next;
}

function listComponents() {
  const indexPath = path.join(REGISTRY_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('Error: Registry index not found.');
    process.exit(1);
  }
  const items = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
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

  const cwd = process.cwd();
  const componentsConfig = loadComponentsConfig(cwd);
  const hasSrc = fs.existsSync(path.resolve(cwd, 'src'));
  const defaultSrc = hasSrc ? 'src' : '';

  const resolveAlias = (rawAlias, fallback) => {
    if (!rawAlias) return path.join(defaultSrc, fallback);
    if (rawAlias.startsWith('@/')) {
      const stripped = rawAlias.slice(2);
      return hasSrc && !stripped.startsWith('src/') ? path.join('src', stripped) : stripped;
    }
    if (rawAlias.startsWith('~/')) {
      return rawAlias.slice(2);
    }
    return rawAlias;
  };

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
    if (data.registryDependencies && Array.isArray(data.registryDependencies)) {
      for (const dep of data.registryDependencies) {
        const normalizedDep = dep
          .replace(/^https:\/\/seany9915\.github\.io\/eolas-ui\/r\//, '')
          .replace(/\.json$/, '')
          .replace(/^@seany9915\/eolas-ui\//, '');
        if (!processed.has(normalizedDep)) {
          queue.push(normalizedDep);
        }
      }
    }

    // Write item files
    for (const file of data.files) {
      let destPath;

      if (file.target.startsWith('~/')) {
        destPath = path.resolve(cwd, file.target.slice(2));
      } else if (file.target.startsWith('@ui/')) {
        const alias = resolveAlias(componentsConfig?.aliases?.ui, 'components/ui');
        destPath = path.resolve(cwd, alias, file.target.slice(4));
      } else if (file.target.startsWith('@components/')) {
        const alias = resolveAlias(componentsConfig?.aliases?.components, 'components');
        destPath = path.resolve(cwd, alias, file.target.slice(12));
      } else if (file.target.startsWith('@lib/')) {
        const alias = resolveAlias(componentsConfig?.aliases?.lib, 'lib');
        destPath = path.resolve(cwd, alias, file.target.slice(5));
      } else if (file.target.startsWith('@hooks/')) {
        const alias = resolveAlias(componentsConfig?.aliases?.hooks, 'hooks');
        destPath = path.resolve(cwd, alias, file.target.slice(7));
      } else {
        const isRootFile =
          file.target.startsWith('lint/') ||
          file.target.startsWith('.');

        const baseDir = isRootFile
          ? cwd
          : hasSrc
            ? path.resolve(cwd, 'src')
            : cwd;

        destPath = path.resolve(baseDir, file.target);
      }

      // Smart resolution for theme file when target is styles/globals.css
      if (file.target === 'styles/globals.css' || file.target === 'globals.css') {
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

      const relDest = path.relative(cwd, destPath).replace(/\\/g, '/');
      const outputContent = rewriteImports(file.content, relDest, componentsConfig);
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

// CLI Dispatcher
if (!command || command === '--help' || command === '-h' || command === 'help') {
  printHelp();
} else if (command === 'list') {
  listComponents();
} else if (command === 'sync') {
  const flags = args.slice(1).filter((a) => a.startsWith('-'));
  const dryRun = flags.includes('--dry-run');
  const indexPath = path.join(REGISTRY_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('Error: Registry index not found.');
    process.exit(1);
  }
  const items = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const allComponentNames = items
    .filter((i) => i.type === 'registry:ui' || i.type === 'registry:block')
    .map((i) => i.name);
  console.log(`${dryRun ? '[dry-run] Previewing sync of' : 'Syncing'} all ${allComponentNames.length} Eolas UI components and blocks...\n`);
  addComponents(allComponentNames, { overwrite: true, dryRun });
} else if (command === 'add') {
  const flags = args.slice(1).filter((a) => a.startsWith('-'));
  const names = args.slice(1).filter((a) => !a.startsWith('-'));
  const overwrite = flags.includes('--overwrite') || flags.includes('-o');
  const dryRun = flags.includes('--dry-run');

  if (flags.includes('--all') || flags.includes('-a') || names.includes('all')) {
    const indexPath = path.join(REGISTRY_DIR, 'index.json');
    if (!fs.existsSync(indexPath)) {
      console.error('Error: Registry index not found.');
      process.exit(1);
    }
    const items = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const allComponentNames = items
      .filter((i) => i.type === 'registry:ui' || i.type === 'registry:block')
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
