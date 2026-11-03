import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const UI_DIR = path.resolve(ROOT, 'src/components/ui');
const BLOCKS_DIR = path.resolve(ROOT, 'src/components/blocks');
const DEMOS_INDEX = path.resolve(ROOT, 'src/components/playground/registry/demos/index.ts');

console.log('=== Verifying Registry Showcase Demo Coverage ===\n');

if (!fs.existsSync(DEMOS_INDEX)) {
  console.error(`❌ Error: Demos index file not found at ${DEMOS_INDEX}`);
  process.exit(1);
}

// 1. Discover all UI primitives (*.tsx)
const uiFiles = fs
  .readdirSync(UI_DIR)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => f.replace(/\.tsx$/, ''));

// 2. Discover all composite blocks (*.tsx)
const blockFiles = fs.existsSync(BLOCKS_DIR)
  ? fs
      .readdirSync(BLOCKS_DIR)
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => f.replace(/\.tsx$/, ''))
  : [];

// 3. Extract registered demo keys from REGISTRY_DEMOS map in demos/index.ts
const demosContent = fs.readFileSync(DEMOS_INDEX, 'utf8');

// Match entries like 'button': ButtonDemo or "data-table": DataTableDemo
const demoMapMatch = demosContent.match(/export const REGISTRY_DEMOS[^=]*=\s*\{([\s\S]*?)\};/);
if (!demoMapMatch) {
  console.error('❌ Error: Could not locate REGISTRY_DEMOS object in demos/index.ts');
  process.exit(1);
}

const mapBody = demoMapMatch[1];
const registeredDemoKeys = new Set();
const keyRegex = /['"]([a-z0-9-]+)['"]\s*:/g;
let match;
while ((match = keyRegex.exec(mapBody)) !== null) {
  registeredDemoKeys.add(match[1]);
}

// 4. Calculate coverage
const missingUi = uiFiles.filter((id) => !registeredDemoKeys.has(id));
const missingBlocks = blockFiles.filter((id) => !registeredDemoKeys.has(id));

const totalComponents = uiFiles.length + blockFiles.length;
const totalMissing = missingUi.length + missingBlocks.length;
const totalCovered = totalComponents - totalMissing;
const coveragePercent = ((totalCovered / totalComponents) * 100).toFixed(1);

console.log(`UI Primitives:    ${uiFiles.length - missingUi.length}/${uiFiles.length} covered`);
console.log(`Composite Blocks: ${blockFiles.length - missingBlocks.length}/${blockFiles.length} covered`);
console.log(`Total Coverage:   ${totalCovered}/${totalComponents} (${coveragePercent}%)\n`);

let hasError = false;

if (missingUi.length > 0) {
  hasError = true;
  console.error(`❌ Missing showcase demos for ${missingUi.length} UI primitive(s):`);
  missingUi.forEach((id) => console.error(`   - src/components/ui/${id}.tsx`));
}

if (missingBlocks.length > 0) {
  hasError = true;
  console.error(`❌ Missing showcase demos for ${missingBlocks.length} Composite Block(s):`);
  missingBlocks.forEach((id) => console.error(`   - src/components/blocks/${id}.tsx`));
}

if (hasError) {
  console.error('\nRun `npm run dev` and register the missing demos in src/components/playground/registry/demos/index.ts.');
  process.exit(1);
}

console.log('✅ 100% Showcase Coverage: All primitives and composite blocks have live interactive playground demos.\n');
process.exit(0);
