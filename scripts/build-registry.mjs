import fs from 'node:fs';
import path from 'node:path';

const UI_DIR = path.resolve('src/components/ui');
const LIB_DIR = path.resolve('src/lib');
const OUT_DIR = path.resolve('public/r');
const REGISTRY_INDEX = path.resolve('public/r/index.json');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Scan src/components/ui for all .tsx files
const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx'));

console.log(`Found ${files.length} UI files to catalog.`);

const registryItems = [];

// Base utilities item (utils.ts)
if (fs.existsSync(path.join(LIB_DIR, 'utils.ts'))) {
  const utilsContent = fs.readFileSync(path.join(LIB_DIR, 'utils.ts'), 'utf8');
  const utilsItem = {
    name: 'utils',
    type: 'registry:lib',
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
    dependencies: utilsItem.dependencies,
  });
}

for (const file of files) {
  const name = file.replace('.tsx', '');
  const content = fs.readFileSync(path.join(UI_DIR, file), 'utf8');

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

  const item = {
    name,
    type: 'registry:ui',
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
  };

  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
  registryItems.push({
    name,
    type: 'registry:ui',
    dependencies: npmDeps,
    registryDependencies: item.registryDependencies,
  });
}

// Write the master index
fs.writeFileSync(REGISTRY_INDEX, JSON.stringify(registryItems, null, 2));

// Also mirror to packages/eolas-ui/registry for zero-dependency CLI bundling
const PKG_REGISTRY = path.resolve('packages/eolas-ui/registry');
if (!fs.existsSync(PKG_REGISTRY)) {
  fs.mkdirSync(PKG_REGISTRY, { recursive: true });
}
for (const item of registryItems) {
  const itemData = fs.readFileSync(path.join(OUT_DIR, `${item.name}.json`), 'utf8');
  fs.writeFileSync(path.join(PKG_REGISTRY, `${item.name}.json`), itemData);
}
fs.writeFileSync(path.join(PKG_REGISTRY, 'index.json'), JSON.stringify(registryItems, null, 2));

console.log(`Successfully generated registry at public/r/ and packages/eolas-ui/registry/ with ${registryItems.length} items.`);
