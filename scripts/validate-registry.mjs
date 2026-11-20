import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.resolve(ROOT, 'public/r');
const PKG_REGISTRY_DIR = path.resolve(ROOT, 'packages/eolas-ui/registry');
const CATALOG_PATH = path.resolve(OUT_DIR, 'registry.json');

console.log('=== Checking Registry Alignment with shadcn/ui Specs ===\n');

if (!fs.existsSync(CATALOG_PATH)) {
  console.error('Error: public/r/registry.json does not exist. Run `npm run build:registry` first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
let failed = false;

// 1. Validate Catalog (registry.json)
const catalogErrors = [];
if (catalog.$schema !== 'https://ui.shadcn.com/schema/registry.json') {
  catalogErrors.push(`Expected $schema "https://ui.shadcn.com/schema/registry.json", got "${catalog.$schema}"`);
}
if (!catalog.name || typeof catalog.name !== 'string') {
  catalogErrors.push('Missing or invalid "name" string');
}
if (!catalog.homepage || typeof catalog.homepage !== 'string') {
  catalogErrors.push('Missing or invalid "homepage" string');
}
if (!Array.isArray(catalog.items)) {
  catalogErrors.push('Missing "items" array');
}

if (catalogErrors.length > 0) {
  failed = true;
  console.error('Catalog schema errors:');
  catalogErrors.forEach((e) => console.error(`  - ${e}`));
} else {
  console.log(`Catalog schema valid (${catalog.items.length} items, name: "${catalog.name}", homepage: "${catalog.homepage}")`);
}

// 2. Validate Items against registry-item.json
const itemFiles = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'registry.json' && f !== 'index.json');
const availableItemSet = new Set(itemFiles);

const validTypes = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:font',
  'registry:item',
]);

const validFileTypes = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:item',
]);

let itemErrors = 0;
let placeholderTargetCount = 0;
let hardcodedTargetCount = 0;
const EOLAS_DEP_PREFIX = 'https://seany9915.github.io/eolas-ui/r/';

for (const file of itemFiles) {
  const item = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
  const errs = [];

  if (item.$schema !== 'https://ui.shadcn.com/schema/registry-item.json') {
    errs.push(`Invalid $schema: ${item.$schema}`);
  }
  if (!item.name || typeof item.name !== 'string') {
    errs.push('Missing or invalid name');
  }
  if (!validTypes.has(item.type)) {
    errs.push(`Invalid type: ${item.type}`);
  }
  if (!Array.isArray(item.files)) {
    errs.push('Missing files array');
  } else {
    for (const f of item.files) {
      if (!f.path || typeof f.path !== 'string') errs.push('File missing path');
      if (!validFileTypes.has(f.type)) errs.push(`File has invalid type: ${f.type}`);
      if (typeof f.content !== 'string') errs.push(`File missing content for ${f.path}`);

      if (f.target) {
        if (
          f.target.startsWith('@ui/') ||
          f.target.startsWith('@components/') ||
          f.target.startsWith('@lib/') ||
          f.target.startsWith('@hooks/') ||
          f.target.startsWith('~')
        ) {
          placeholderTargetCount++;
        } else {
          hardcodedTargetCount++;
        }
      }
    }
  }

  // Validate registryDependencies format and ensure internal URLs resolve to generated items
  if (Array.isArray(item.registryDependencies)) {
    for (const dep of item.registryDependencies) {
      if (!dep.startsWith('https://') && !dep.startsWith('@') && !dep.includes('/')) {
        errs.push(`registryDependency "${dep}" is a bare name. Cross-component dependencies must use full URLs (e.g. "${EOLAS_DEP_PREFIX}${dep}.json") or namespaces.`);
      } else if (dep.startsWith(EOLAS_DEP_PREFIX)) {
        const depFile = dep.slice(EOLAS_DEP_PREFIX.length);
        if (!availableItemSet.has(depFile)) {
          errs.push(`registryDependency "${dep}" points to missing generated item ${depFile}`);
        }
      }
    }
  }

  if (errs.length > 0) {
    console.error(`Item ${file} errors:`, errs);
    itemErrors++;
  }
}

if (itemErrors > 0) {
  failed = true;
  console.error(`${itemErrors} item(s) failed schema validation.`);
} else {
  console.log(`All ${itemFiles.length} item files conform strictly to registry-item.json schema.`);
}

console.log('\n=== Target Path Analysis ===');
console.log(`Placeholder targets (@ui/, @components/, @lib/, ~): ${placeholderTargetCount}`);
console.log(`Hardcoded static targets (components/ui/..., lib/utils.ts, etc.): ${hardcodedTargetCount}`);

// 3. Validate root registry.json, its included sub-registries, and every declared source file
const ROOT_REGISTRY = path.resolve(ROOT, 'registry.json');
let modularCheckPassed = false;
if (!fs.existsSync(ROOT_REGISTRY)) {
  failed = true;
  console.error('Root registry.json is missing.');
} else {
  const rootData = JSON.parse(fs.readFileSync(ROOT_REGISTRY, 'utf8'));
  const missingIncludes = [];
  const missingSubRegistrySources = [];

  if (!Array.isArray(rootData.include) || rootData.include.length === 0) {
    failed = true;
    console.error('Root registry.json has no "include" entries.');
  } else {
    for (const includeRel of rootData.include) {
      const includeAbs = path.resolve(ROOT, includeRel);
      if (!fs.existsSync(includeAbs)) {
        missingIncludes.push(includeRel);
        continue;
      }
      const subDir = path.dirname(includeAbs);
      const subRegistry = JSON.parse(fs.readFileSync(includeAbs, 'utf8'));
      for (const item of subRegistry.items ?? []) {
        for (const f of item.files ?? []) {
          if (f.path && !fs.existsSync(path.resolve(subDir, f.path))) {
            missingSubRegistrySources.push(`${includeRel} -> ${item.name}: ${f.path}`);
          }
        }
      }
    }

    if (missingIncludes.length > 0) {
      failed = true;
      console.error('Root registry.json has missing includes:', missingIncludes);
    }
    if (missingSubRegistrySources.length > 0) {
      failed = true;
      console.error('Included sub-registries reference missing source files:');
      missingSubRegistrySources.forEach((m) => console.error(`  - ${m}`));
    }
    modularCheckPassed = missingIncludes.length === 0 && missingSubRegistrySources.length === 0;
  }

  const missingSources = [];
  for (const item of rootData.items ?? []) {
    for (const f of item.files ?? []) {
      if (f.path && !fs.existsSync(path.resolve(ROOT, f.path))) {
        missingSources.push(`${item.name}: ${f.path}`);
      }
    }
  }
  if (missingSources.length > 0) {
    failed = true;
    console.error('\nRoot registry.json references source files that do not exist:');
    missingSources.forEach((m) => console.error(`  - ${m}`));
  }
}

// 4. Verify packages/eolas-ui/registry parity with public/r
let pkgParityPassed = false;
if (!fs.existsSync(PKG_REGISTRY_DIR)) {
  failed = true;
  console.error('\npackages/eolas-ui/registry directory is missing.');
} else {
  const normalizeLineEndings = (text) => text.replace(/\r\n/g, '\n');
  const outAll = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.json')).sort();
  const pkgAll = fs.readdirSync(PKG_REGISTRY_DIR).filter((f) => f.endsWith('.json')).sort();
  const extraInPkg = pkgAll.filter((f) => !outAll.includes(f));
  const missingInPkg = outAll.filter((f) => !pkgAll.includes(f));
  const driftedFiles = [];

  for (const f of outAll) {
    if (!pkgAll.includes(f)) continue;
    const outContent = normalizeLineEndings(fs.readFileSync(path.join(OUT_DIR, f), 'utf8'));
    const pkgContent = normalizeLineEndings(fs.readFileSync(path.join(PKG_REGISTRY_DIR, f), 'utf8'));
    if (outContent !== pkgContent) {
      driftedFiles.push(f);
    }
  }

  if (extraInPkg.length > 0 || missingInPkg.length > 0 || driftedFiles.length > 0) {
    failed = true;
    console.error('\npackages/eolas-ui/registry is out of sync with public/r/:');
    if (missingInPkg.length > 0) console.error('  Missing in package:', missingInPkg);
    if (extraInPkg.length > 0) console.error('  Stale files in package:', extraInPkg);
    if (driftedFiles.length > 0) console.error('  Content mismatch:', driftedFiles);
  } else {
    pkgParityPassed = true;
  }
}

console.log('\n=== Feature Parity Checks ===');
console.log(`- Modular root registry.json via include: ${modularCheckPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Item schema & dependency resolution: ${itemErrors === 0 && catalogErrors.length === 0 ? 'PASS' : 'FAIL'}`);
console.log(`- CLI bundled registry parity (packages/eolas-ui/registry): ${pkgParityPassed ? 'PASS' : 'FAIL'}`);

if (failed) {
  process.exit(1);
}
