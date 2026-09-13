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
  npx @seany9915/eolas-ui add <component-name...> [--overwrite]
  npx @seany9915/eolas-ui list

EXAMPLES:
  npx @seany9915/eolas-ui add button dialog select
  npx @seany9915/eolas-ui add tabs --overwrite
  npx @seany9915/eolas-ui list
`);
}

function listComponents() {
  const indexPath = path.join(REGISTRY_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('Error: Registry index not found.');
    process.exit(1);
  }
  const items = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  console.log('\nAvailable Eolas UI Components (Total: ' + items.length + '):\n');
  const uiItems = items.filter(i => i.type === 'registry:ui').map(i => i.name);
  console.log(uiItems.join(', '));
  console.log('');
}

function addComponents(componentNames, overwrite = false) {
  if (componentNames.length === 0) {
    console.error('Error: Please specify one or more components to add.');
    console.log('Run `npx @seany9915/eolas-ui list` to see available components.');
    process.exit(1);
  }

  const cwd = process.cwd();
  const queue = [...componentNames];
  const processed = new Set();
  const installedFiles = [];

  while (queue.length > 0) {
    const name = queue.shift();
    if (processed.has(name)) continue;
    processed.add(name);

    const compFile = path.join(REGISTRY_DIR, name + '.json');
    if (!fs.existsSync(compFile)) {
      console.warn('Warning: Component ' + name + ' not found in Eolas UI registry. Skipping.');
      continue;
    }

    const data = JSON.parse(fs.readFileSync(compFile, 'utf8'));

    // Queue internal registry dependencies
    if (data.registryDependencies && Array.isArray(data.registryDependencies)) {
      for (const dep of data.registryDependencies) {
        if (!processed.has(dep)) {
          queue.push(dep);
        }
      }
    }

    // Write component files
    for (const file of data.files) {
      const destPath = path.resolve(cwd, 'src', file.target);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      if (fs.existsSync(destPath) && !overwrite) {
        console.log('  - Skipping ' + file.target + ' (already exists, pass --overwrite to replace)');
      } else {
        fs.writeFileSync(destPath, file.content, 'utf8');
        console.log('  + Installed ' + file.target);
        installedFiles.push(file.target);
      }
    }
  }

  console.log('\nSuccessfully processed ' + processed.size + ' components/dependencies.');
  console.log('Ensure peer dependencies are installed: npm install @base-ui/react clsx tailwind-merge\n');
}

// CLI Dispatcher
if (!command || command === '--help' || command === '-h' || command === 'help') {
  printHelp();
} else if (command === 'list') {
  listComponents();
} else if (command === 'add') {
  const flags = args.filter(a => a.startsWith('-'));
  const names = args.slice(1).filter(a => !a.startsWith('-'));
  const overwrite = flags.includes('--overwrite') || flags.includes('-o');
  addComponents(names, overwrite);
} else {
  console.error('Unknown command: ' + command + '\n');
  printHelp();
  process.exit(1);
}
