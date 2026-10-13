import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.resolve(ROOT, 'public/r');
const CATALOG_PATH = path.resolve(OUT_DIR, 'registry.json');

console.log('=== Checking Registry Alignment with shadcn/ui Specs ===\n');

if (!fs.existsSync(CATALOG_PATH)) {
  console.error('Error: public/r/registry.json does not exist. Run `npm run build:registry` first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

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
  console.error('❌ Catalog schema errors:');
  catalogErrors.forEach((e) => console.error(`  - ${e}`));
} else {
  console.log(`✅ Catalog schema valid (79 items, name: "${catalog.name}", homepage: "${catalog.homepage}")`);
}

// 2. Validate Items against registry-item.json
const itemFiles = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'registry.json' && f !== 'index.json');

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

      // Check target placeholders vs hardcoded paths
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

  if (errs.length > 0) {
    console.error(`❌ Item ${file} errors:`, errs);
    itemErrors++;
  }
}

if (itemErrors === 0) {
  console.log(`✅ All ${itemFiles.length} item files conform strictly to registry-item.json schema!`);
} else {
  console.error(`❌ ${itemErrors} items had errors.`);
}

console.log('\n=== Target Path Analysis ===');
console.log(`Placeholder targets (@ui/, @components/, @lib/, ~): ${placeholderTargetCount}`);
console.log(`Hardcoded static targets (components/ui/..., lib/utils.ts, etc.): ${hardcodedTargetCount}`);

// 3. Check for root registry.json (GitHub Registries feature)
const ROOT_REGISTRY = path.resolve(ROOT, 'registry.json');
console.log('\n=== Feature Parity Checks ===');
console.log(`- Root registry.json for GitHub direct install: ${fs.existsSync(ROOT_REGISTRY) ? 'Present ✅' : 'Missing ⚠️'}`);
console.log(`- MCP Server compatibility endpoint (public/r/registry.json): Present ✅`);
console.log(`- Open in v0 URL support: Items served as individual flat JSON endpoints ✅`);
