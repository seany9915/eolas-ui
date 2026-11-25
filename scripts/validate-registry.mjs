import fs from 'node:fs';
import path from 'node:path';
import {
  CATEGORY_MAP,
  PUBLIC_SYSTEM_LIBS,
  TRANSITIONS_DEV_MAP,
  extractInternalRegistryImports,
  stripComments,
} from './registry-meta.mjs';

const ROOT = process.cwd();
const OUT_DIR = path.resolve(ROOT, 'public/r');
const PKG_REGISTRY_DIR = path.resolve(ROOT, 'packages/eolas-ui/registry');
const CATALOG_PATH = path.resolve(OUT_DIR, 'registry.json');
const INDEX_PATH = path.resolve(OUT_DIR, 'index.json');
const LIB_DIR = path.resolve(ROOT, 'src/lib');
const UI_DIR = path.resolve(ROOT, 'src/components/ui');
const BLOCKS_DIR = path.resolve(ROOT, 'src/components/blocks');
const EOLAS_DEP_PREFIX = `${(
  process.env.EOLAS_REGISTRY_BASE_URL || 'https://seany9915.github.io/eolas-ui/r'
).replace(/\/+$/, '')}/`;
const EOLAS_GITHUB_PREFIX = 'seany9915/eolas-ui/';

const VALID_SHADCN_ICON_LIBRARIES = new Set([
  'lucide',
  'tabler',
  'hugeicons',
  'phosphor',
  'remixicon',
  'radix',
]);

console.log('=== Checking Registry Alignment with shadcn/ui Specs ===\n');

if (!fs.existsSync(CATALOG_PATH)) {
  console.error('Error: public/r/registry.json does not exist. Run `npm run build:registry` first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
let failed = false;

const normalizeLineEndings = (text) => text.replace(/\r\n/g, '\n');

function mapRegistryFilePathToRepoSource(regFilePath) {
  if (regFilePath.startsWith('ui/') || regFilePath.startsWith('blocks/')) {
    return `src/components/${regFilePath}`;
  }
  if (regFilePath.startsWith('lib/')) {
    return `src/${regFilePath}`;
  }
  if (regFilePath === 'styles/eolas-theme.css' || regFilePath.startsWith('styles/')) {
    return 'src/globals.css';
  }
  if (regFilePath === 'hooks.json') {
    return '.agents/hooks.json';
  }
  if (regFilePath.startsWith('rules/') || regFilePath.startsWith('scripts/')) {
    return `.agents/${regFilePath}`;
  }
  if (regFilePath.startsWith('lint/')) {
    return `packages/eolas-ui/${regFilePath}`;
  }
  if (regFilePath.startsWith('logos/')) {
    return `public/${regFilePath}`;
  }
  return regFilePath;
}

function normalizeBuiltDep(dep) {
  if (dep.startsWith(EOLAS_DEP_PREFIX)) {
    return dep.slice(EOLAS_DEP_PREFIX.length).replace(/\.json$/, '');
  }
  return dep;
}

function normalizeSourceDep(dep) {
  if (dep.startsWith(EOLAS_GITHUB_PREFIX)) {
    return dep.slice(EOLAS_GITHUB_PREFIX.length);
  }
  return normalizeBuiltDep(dep);
}

const ALLOWED_PEER_DEPS = {
  recharts: new Set(['react-is']),
};

function stripNpmVersion(spec) {
  if (typeof spec !== 'string') return spec;
  const idx = spec.startsWith('@') ? spec.indexOf('@', 1) : spec.indexOf('@');
  return idx > 0 ? spec.slice(0, idx) : spec;
}

function extractPackageImports(content) {
  const clean = stripComments(content);
  const pkgs = new Set();
  const patterns = [
    /(?:import|export)\s+(?:type\s+)?(?:[^;'"]*?\s+from\s+)?['"]([^.'"][^'"]*)['"]/g,
    /\bimport\s*\(\s*['"]([^.'"][^'"]*)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    for (const match of clean.matchAll(re)) {
      const spec = match[1];
      if (!spec || spec.startsWith('@/') || spec.startsWith('~/') || spec.startsWith('node:')) continue;
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (pkg === 'react' || pkg === 'react-dom') continue;
      pkgs.add(pkg);
    }
  }
  return pkgs;
}

function extractInternalImports(content, itemType) {
  return extractInternalRegistryImports(content, itemType, { fs, libDir: LIB_DIR });
}

// 0. Validate components.json
let componentsJsonPassed = false;
const COMPONENTS_JSON_PATH = path.resolve(ROOT, 'components.json');
if (!fs.existsSync(COMPONENTS_JSON_PATH)) {
  failed = true;
  console.error('components.json is missing.');
} else {
  const compConfig = JSON.parse(fs.readFileSync(COMPONENTS_JSON_PATH, 'utf8'));
  const compErrs = [];
  if (compConfig.$schema !== 'https://ui.shadcn.com/schema.json') {
    compErrs.push(`Expected $schema "https://ui.shadcn.com/schema.json", got "${compConfig.$schema}"`);
  }
  if ('iconLibrary' in compConfig && !VALID_SHADCN_ICON_LIBRARIES.has(compConfig.iconLibrary)) {
    compErrs.push(
      `Invalid iconLibrary "${compConfig.iconLibrary}". Omit it or use a valid shadcn iconLibrary (${[...VALID_SHADCN_ICON_LIBRARIES].join(', ')}).`
    );
  }
  if (!compConfig.aliases || typeof compConfig.aliases !== 'object') {
    compErrs.push('Missing "aliases" object');
  } else {
    for (const key of ['components', 'utils', 'ui', 'lib', 'hooks']) {
      const val = compConfig.aliases[key];
      if (!val || typeof val !== 'string') {
        compErrs.push(`Missing or invalid aliases.${key}`);
        continue;
      }
      if (val.startsWith('@/')) {
        const rel = path.join('src', val.slice(2));
        const abs = path.resolve(ROOT, rel);
        const exists =
          fs.existsSync(abs) || fs.existsSync(`${abs}.ts`) || fs.existsSync(`${abs}.tsx`);
        if (!exists) {
          compErrs.push(`aliases.${key} ("${val}") points to nonexistent path "${rel}"`);
        }
      }
    }
  }
  if (compErrs.length > 0) {
    failed = true;
    console.error('components.json validation errors:');
    compErrs.forEach((e) => console.error(`  - ${e}`));
  } else {
    componentsJsonPassed = true;
  }
}

// 1. Validate Catalog (public/r/registry.json) & public/r/index.json parity
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

let indexParityPassed = false;
if (!fs.existsSync(INDEX_PATH)) {
  failed = true;
  catalogErrors.push('public/r/index.json is missing');
} else {
  const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  if (JSON.stringify(indexData) !== JSON.stringify(catalog.items)) {
    failed = true;
    catalogErrors.push('public/r/index.json does not match public/r/registry.json items');
  } else {
    indexParityPassed = true;
  }
}

if (catalogErrors.length > 0) {
  failed = true;
  console.error('Catalog schema errors:');
  catalogErrors.forEach((e) => console.error(`  - ${e}`));
} else {
  console.log(`Catalog schema valid (${catalog.items.length} items, name: "${catalog.name}", homepage: "${catalog.homepage}")`);
}

// 2. Validate Items against registry-item.json + src/ content parity + missing/extra deps + cycles
const itemFiles = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'registry.json' && f !== 'index.json')
  .sort();
const availableItemSet = new Set(itemFiles);

const utilsJsonPath = path.join(OUT_DIR, 'utils.json');
const utilsDeps = fs.existsSync(utilsJsonPath)
  ? new Set(JSON.parse(fs.readFileSync(utilsJsonPath, 'utf8')).dependencies ?? [])
  : new Set();

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
const srcParityErrors = [];
const builtItemsByName = new Map();
const depGraph = new Map();

for (const file of itemFiles) {
  const item = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
  const errs = [];

  if (item.$schema !== 'https://ui.shadcn.com/schema/registry-item.json') {
    errs.push(`Invalid $schema: ${item.$schema}`);
  }
  if (!item.name || typeof item.name !== 'string') {
    errs.push('Missing or invalid name');
  } else {
    builtItemsByName.set(item.name, item);
  }
  if (!validTypes.has(item.type)) {
    errs.push(`Invalid type: ${item.type}`);
  }
  if (!Array.isArray(item.categories) || item.categories.length === 0) {
    errs.push('Missing non-empty "categories" array');
  }

  const declaredNpmDeps = new Set(
    (Array.isArray(item.dependencies) ? item.dependencies : []).map(stripNpmVersion)
  );
  const normalizedRegDeps = new Set(
    (Array.isArray(item.registryDependencies) ? item.registryDependencies : []).map(normalizeBuiltDep)
  );
  if (item.name) {
    depGraph.set(item.name, Array.from(normalizedRegDeps));
  }
  const itemFileBasenames = new Set(
    (Array.isArray(item.files) ? item.files : []).map((f) => path.basename(f.path || '').replace(/\.(tsx?|jsx?|mjs)$/, ''))
  );

  const isSourceModuleItem =
    item.type === 'registry:ui' || item.type === 'registry:block' || item.type === 'registry:lib';
  const actualNpmDeps = new Set();
  const actualInternalRefs = new Set();

  if (!Array.isArray(item.files)) {
    errs.push('Missing files array');
  } else {
    for (const f of item.files) {
      if (!f.path || typeof f.path !== 'string') errs.push('File missing path');
      if (!validFileTypes.has(f.type)) errs.push(`File has invalid type: ${f.type}`);
      if (typeof f.content !== 'string') errs.push(`File missing content for ${f.path}`);

      if ((f.type === 'registry:file' || f.type === 'registry:page') && (!f.target || typeof f.target !== 'string' || !f.target.trim())) {
        errs.push(`File ${f.path} of type ${f.type} requires a non-empty target`);
      }

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
          errs.push(`File ${f.path} uses non-portable target "${f.target}". Use @ui/, @components/, @lib/, @hooks/, or ~/.`);
        }
      }

      // Check src/ <-> public/r/ file content parity
      if (typeof f.path === 'string' && typeof f.content === 'string') {
        const repoSourceRel = mapRegistryFilePathToRepoSource(f.path);
        const repoSourceAbs = path.resolve(ROOT, repoSourceRel);
        if (!fs.existsSync(repoSourceAbs)) {
          srcParityErrors.push(`${item.name}: mapped source file "${repoSourceRel}" does not exist`);
        } else {
          const diskContent = normalizeLineEndings(fs.readFileSync(repoSourceAbs, 'utf8'));
          const builtContent = normalizeLineEndings(f.content);
          if (diskContent !== builtContent) {
            srcParityErrors.push(`${item.name}: public/r/${file} (${f.path}) is stale vs "${repoSourceRel}"`);
          }
        }
      }

      if (typeof f.content === 'string' && /\.(tsx?|jsx?)$/.test(f.path || '') && isSourceModuleItem) {
        for (const pkg of extractPackageImports(f.content)) {
          actualNpmDeps.add(pkg);
          const satisfiedByUtils = normalizedRegDeps.has('utils') && utilsDeps.has(pkg);
          if (!declaredNpmDeps.has(pkg) && !satisfiedByUtils) {
            errs.push(`File ${f.path} imports "${pkg}" which is missing from item.dependencies`);
          }
        }
        for (const ref of extractInternalImports(f.content, item.type)) {
          if (ref === item.name || itemFileBasenames.has(ref)) continue;
          actualInternalRefs.add(ref);
          if (!normalizedRegDeps.has(ref)) {
            errs.push(`File ${f.path} imports internal module "${ref}" missing from registryDependencies`);
          }
        }
      }
    }
  }

  // Check for extra/phantom dependencies or registryDependencies on TS/TSX source items
  if (isSourceModuleItem) {
    const allowedPeers = new Set();
    for (const pkg of actualNpmDeps) {
      const peers = ALLOWED_PEER_DEPS[pkg];
      if (peers) {
        for (const peer of peers) allowedPeers.add(peer);
      }
    }
    for (const declaredPkg of declaredNpmDeps) {
      if (!actualNpmDeps.has(declaredPkg) && !allowedPeers.has(declaredPkg)) {
        errs.push(`Extra/phantom npm dependency "${declaredPkg}" is declared but not imported`);
      }
    }
    for (const declaredReg of normalizedRegDeps) {
      if (!actualInternalRefs.has(declaredReg)) {
        errs.push(`Extra/phantom registryDependency "${declaredReg}" is declared but not imported`);
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

// Check that no src/ UI, block, or lib source files are missing from public/r/
for (const f of fs.readdirSync(UI_DIR).filter((x) => x.endsWith('.tsx'))) {
  const name = f.replace(/\.tsx$/, '');
  if (!builtItemsByName.has(name)) {
    srcParityErrors.push(`src/components/ui/${f} is missing from public/r/`);
  }
}
if (fs.existsSync(BLOCKS_DIR)) {
  for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => x.endsWith('.tsx'))) {
    const name = f.replace(/\.tsx$/, '');
    if (!builtItemsByName.has(name)) {
      srcParityErrors.push(`src/components/blocks/${f} is missing from public/r/`);
    }
  }
}
for (const f of fs.readdirSync(LIB_DIR).filter((x) => x.endsWith('.ts') && !x.endsWith('.d.ts'))) {
  const name = f.replace(/\.ts$/, '');
  if (!builtItemsByName.has(name)) {
    srcParityErrors.push(`src/lib/${f} is missing from public/r/`);
  }
}

const srcParityPassed = srcParityErrors.length === 0;
if (!srcParityPassed) {
  failed = true;
  console.error('\nSource <-> public/r/ content parity errors (run `npm run build:registry`):');
  srcParityErrors.forEach((e) => console.error(`  - ${e}`));
}

// DFS cycle check across registryDependencies
const color = new Map(); // 0=unvisited, 1=visiting, 2=visited
const cycles = [];
const stack = [];

function dfs(node) {
  color.set(node, 1);
  stack.push(node);
  for (const dep of depGraph.get(node) ?? []) {
    if (!depGraph.has(dep)) continue;
    const state = color.get(dep) ?? 0;
    if (state === 1) {
      const idx = stack.indexOf(dep);
      cycles.push([...stack.slice(idx), dep].join(' -> '));
    } else if (state === 0) {
      dfs(dep);
    }
  }
  stack.pop();
  color.set(node, 2);
}

for (const node of depGraph.keys()) {
  if ((color.get(node) ?? 0) === 0) {
    dfs(node);
  }
}

const noCyclesPassed = cycles.length === 0;
if (!noCyclesPassed) {
  failed = true;
  console.error('\nCircular registryDependencies detected:');
  cycles.forEach((c) => console.error(`  - ${c}`));
}

if (hardcodedTargetCount > 0) {
  failed = true;
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

// 3. Validate root registry.json, included sub-registries, uniqueness, source files, and parity with public/r/*.json
const ROOT_REGISTRY = path.resolve(ROOT, 'registry.json');
let modularCheckPassed = false;
if (!fs.existsSync(ROOT_REGISTRY)) {
  failed = true;
  console.error('Root registry.json is missing.');
} else {
  const rootData = JSON.parse(fs.readFileSync(ROOT_REGISTRY, 'utf8'));
  const rootMetaErrors = [];
  if (rootData.$schema !== 'https://ui.shadcn.com/schema/registry.json') {
    rootMetaErrors.push(`Invalid root $schema: ${rootData.$schema}`);
  }
  if (!rootData.name || typeof rootData.name !== 'string') {
    rootMetaErrors.push('Root registry.json missing valid "name"');
  }
  if (!rootData.homepage || typeof rootData.homepage !== 'string') {
    rootMetaErrors.push('Root registry.json missing valid "homepage"');
  }
  if (!Array.isArray(rootData.include) || rootData.include.length === 0) {
    rootMetaErrors.push('Root registry.json has no "include" entries.');
  }

  const missingIncludes = [];
  const missingSubRegistrySources = [];
  const subRegistryErrors = [];
  const duplicateNames = [];
  const rootParityErrors = [];
  const seenItemNames = new Set();
  const sourceItemsByName = new Map();

  const recordItem = (item, source) => {
    if (seenItemNames.has(item.name)) {
      duplicateNames.push(`${item.name} (duplicate in ${source})`);
    }
    seenItemNames.add(item.name);
    sourceItemsByName.set(item.name, { item, source });
  };

  for (const item of rootData.items ?? []) {
    recordItem(item, 'registry.json');
  }

  if (Array.isArray(rootData.include)) {
    for (const includeRel of rootData.include) {
      const includeAbs = path.resolve(ROOT, includeRel);
      if (!fs.existsSync(includeAbs)) {
        missingIncludes.push(includeRel);
        continue;
      }
      const subDir = path.dirname(includeAbs);
      const subRegistry = JSON.parse(fs.readFileSync(includeAbs, 'utf8'));
      if (subRegistry.$schema !== 'https://ui.shadcn.com/schema/registry.json') {
        subRegistryErrors.push(`${includeRel}: invalid $schema "${subRegistry.$schema}"`);
      }
      if ('name' in subRegistry || 'homepage' in subRegistry) {
        subRegistryErrors.push(`${includeRel}: included sub-registry should omit "name" and "homepage"`);
      }
      if (!Array.isArray(subRegistry.items)) {
        subRegistryErrors.push(`${includeRel}: missing "items" array`);
        continue;
      }
      for (const item of subRegistry.items) {
        recordItem(item, includeRel);
        for (const f of item.files ?? []) {
          if (f.path && !fs.existsSync(path.resolve(subDir, f.path))) {
            missingSubRegistrySources.push(`${includeRel} -> ${item.name}: ${f.path}`);
          }
        }
      }
    }
  }

  const missingSources = [];
  for (const item of rootData.items ?? []) {
    for (const f of item.files ?? []) {
      if (f.path && !fs.existsSync(path.resolve(ROOT, f.path))) {
        missingSources.push(`${item.name}: ${f.path}`);
      }
    }
  }

  // Verify root + sub-registries item/field parity with public/r/*.json
  for (const [name, builtItem] of builtItemsByName.entries()) {
    const entry = sourceItemsByName.get(name);
    if (!entry) {
      rootParityErrors.push(`Missing item "${name}" in root/sub-registries`);
      continue;
    }
    const { item: srcItem, source } = entry;
    for (const field of ['type', 'title', 'description', 'categories', 'dependencies', 'devDependencies', 'docs', 'meta', 'cssVars']) {
      const a = JSON.stringify(srcItem[field] ?? null);
      const b = JSON.stringify(builtItem[field] ?? null);
      if (a !== b) {
        rootParityErrors.push(`${source} -> ${name}: field "${field}" differs from public/r/${name}.json`);
      }
    }
    const srcRegDeps = srcItem.registryDependencies ?? [];
    const builtRegDeps = builtItem.registryDependencies ?? [];
    for (const dep of srcRegDeps) {
      if (dep.startsWith(EOLAS_DEP_PREFIX)) {
        rootParityErrors.push(
          `${source} -> ${name}: registryDependency "${dep}" should use "${EOLAS_GITHUB_PREFIX}<name>" in source registries`
        );
      }
    }
    const normSrcDeps = srcRegDeps.map(normalizeSourceDep);
    const normBuiltDeps = builtRegDeps.map(normalizeBuiltDep);
    if (JSON.stringify(normSrcDeps) !== JSON.stringify(normBuiltDeps)) {
      rootParityErrors.push(`${source} -> ${name}: registryDependencies differ from public/r/${name}.json`);
    }
    const srcFiles = (srcItem.files ?? []).map((f) => ({ type: f.type, target: f.target ?? null }));
    const builtFiles = (builtItem.files ?? []).map((f) => ({ type: f.type, target: f.target ?? null }));
    if (JSON.stringify(srcFiles) !== JSON.stringify(builtFiles)) {
      rootParityErrors.push(`${source} -> ${name}: files metadata differs from public/r/${name}.json`);
    }
  }
  for (const name of sourceItemsByName.keys()) {
    if (!builtItemsByName.has(name)) {
      rootParityErrors.push(`Extra item "${name}" in root/sub-registries not present in public/r/`);
    }
  }

  if (rootMetaErrors.length > 0) {
    failed = true;
    console.error('\nRoot registry.json metadata errors:');
    rootMetaErrors.forEach((e) => console.error(`  - ${e}`));
  }
  if (missingIncludes.length > 0) {
    failed = true;
    console.error('Root registry.json has missing includes:', missingIncludes);
  }
  if (subRegistryErrors.length > 0) {
    failed = true;
    console.error('Included sub-registry schema errors:');
    subRegistryErrors.forEach((e) => console.error(`  - ${e}`));
  }
  if (duplicateNames.length > 0) {
    failed = true;
    console.error('Duplicate item names across root and included registries:');
    duplicateNames.forEach((d) => console.error(`  - ${d}`));
  }
  if (missingSubRegistrySources.length > 0) {
    failed = true;
    console.error('Included sub-registries reference missing source files:');
    missingSubRegistrySources.forEach((m) => console.error(`  - ${m}`));
  }
  if (missingSources.length > 0) {
    failed = true;
    console.error('\nRoot registry.json references source files that do not exist:');
    missingSources.forEach((m) => console.error(`  - ${m}`));
  }
  if (rootParityErrors.length > 0) {
    failed = true;
    console.error('\nRoot/sub-registry parity errors with public/r/*.json:');
    rootParityErrors.forEach((e) => console.error(`  - ${e}`));
  }

  modularCheckPassed =
    rootMetaErrors.length === 0 &&
    missingIncludes.length === 0 &&
    subRegistryErrors.length === 0 &&
    duplicateNames.length === 0 &&
    missingSubRegistrySources.length === 0 &&
    missingSources.length === 0 &&
    rootParityErrors.length === 0;
}

// 4. Verify packages/eolas-ui/registry parity with public/r
let pkgParityPassed = false;
if (!fs.existsSync(PKG_REGISTRY_DIR)) {
  failed = true;
  console.error('\npackages/eolas-ui/registry directory is missing.');
} else {
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

// 5. Verify consumer.oxlintrc.json matches oxlintrc.json derivation
let lintConfigParityPassed = false;
const OXLINT_BASE = path.resolve(ROOT, 'packages/eolas-ui/lint/oxlintrc.json');
const OXLINT_CONSUMER = path.resolve(ROOT, 'packages/eolas-ui/lint/consumer.oxlintrc.json');
if (!fs.existsSync(OXLINT_BASE) || !fs.existsSync(OXLINT_CONSUMER)) {
  failed = true;
  console.error('\nMissing oxlintrc.json or consumer.oxlintrc.json in packages/eolas-ui/lint/.');
} else {
  const baseConfig = JSON.parse(fs.readFileSync(OXLINT_BASE, 'utf8'));
  const expectedConsumer = `${JSON.stringify(
    {
      $schema: './node_modules/oxlint/configuration_schema.json',
      ...baseConfig,
      jsPlugins: (baseConfig.jsPlugins ?? []).map((entry) =>
        entry === './index.mjs' || entry === './index.js' ? './lint/index.mjs' : entry
      ),
      ignorePatterns: ['dist/**', 'public/**', 'node_modules/**', '.agents/**', 'lint/**'],
    },
    null,
    2
  )}\n`;
  const actualConsumer = normalizeLineEndings(fs.readFileSync(OXLINT_CONSUMER, 'utf8'));
  if (actualConsumer !== expectedConsumer) {
    failed = true;
    console.error('\npackages/eolas-ui/lint/consumer.oxlintrc.json is out of sync with oxlintrc.json. Run `npm run build:registry`.');
  } else {
    lintConfigParityPassed = true;
  }
}

// 6. Verify root package.json version matches packages/eolas-ui/package.json version
let versionParityPassed = false;
const rootPkg = JSON.parse(fs.readFileSync(path.resolve(ROOT, 'package.json'), 'utf8'));
const cliPkg = JSON.parse(fs.readFileSync(path.resolve(ROOT, 'packages/eolas-ui/package.json'), 'utf8'));
if (rootPkg.version !== cliPkg.version) {
  failed = true;
  console.error(`\nVersion mismatch: root package.json (${rootPkg.version}) != packages/eolas-ui/package.json (${cliPkg.version})`);
} else {
  versionParityPassed = true;
}

// 7. Verify registry-manifest.ts parity (IDs AND title/description/category/dependencies)
let manifestParityPassed = false;
const MANIFEST_PATH = path.resolve(ROOT, 'src/components/playground/registry/registry-manifest.ts');
if (!fs.existsSync(MANIFEST_PATH)) {
  failed = true;
  console.error('\nregistry-manifest.ts is missing.');
} else {
  const manifestSrc = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const arrMatch = manifestSrc.match(/REGISTRY_ENTRIES:\s*RegistryEntry\[\]\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!arrMatch) {
    failed = true;
    console.error('\nCould not parse REGISTRY_ENTRIES in registry-manifest.ts');
  } else {
    const manifestEntries = JSON.parse(arrMatch[1]);
    const manifestById = new Map(manifestEntries.map((e) => [e.id, e]));
    const catalogByName = new Map(catalog.items.map((i) => [i.name, i]));
    const expectedManifestIds = new Set(
      catalog.items
        .filter((i) => i.type === 'registry:ui' || i.type === 'registry:block' || (i.type === 'registry:lib' && PUBLIC_SYSTEM_LIBS.has(i.name)))
        .map((i) => i.name)
    );
    const missingFromManifest = [...expectedManifestIds].filter((id) => !manifestById.has(id));
    const staleInManifest = [...manifestById.keys()].filter((id) => !expectedManifestIds.has(id));
    const fieldDrifts = [];

    for (const id of expectedManifestIds) {
      const entry = manifestById.get(id);
      const item = catalogByName.get(id);
      if (!entry || !item) continue;

      const expectedTitle = item.title;
      const expectedDescription = TRANSITIONS_DEV_MAP[id] || item.description;
      const expectedCategory = item.categories?.[0] || CATEGORY_MAP[id];
      const expectedDeps = item.dependencies || [];

      if (entry.title !== expectedTitle) {
        fieldDrifts.push(`${id}: title "${entry.title}" != "${expectedTitle}"`);
      }
      if (entry.description !== expectedDescription) {
        fieldDrifts.push(`${id}: description out of sync with public/r/registry.json`);
      }
      if (entry.category !== expectedCategory) {
        fieldDrifts.push(`${id}: category "${entry.category}" != "${expectedCategory}"`);
      }
      if (JSON.stringify(entry.dependencies || []) !== JSON.stringify(expectedDeps)) {
        fieldDrifts.push(`${id}: dependencies ${JSON.stringify(entry.dependencies || [])} != ${JSON.stringify(expectedDeps)}`);
      }
    }

    if (missingFromManifest.length > 0 || staleInManifest.length > 0 || fieldDrifts.length > 0) {
      failed = true;
      console.error('\nregistry-manifest.ts is out of sync with public/r/registry.json:');
      if (missingFromManifest.length > 0) console.error('  Missing from manifest:', missingFromManifest);
      if (staleInManifest.length > 0) console.error('  Stale in manifest:', staleInManifest);
      if (fieldDrifts.length > 0) {
        console.error('  Field drift:');
        fieldDrifts.forEach((d) => console.error(`    - ${d}`));
      }
    } else {
      manifestParityPassed = true;
    }
  }
}

console.log('\n=== Feature Parity Checks ===');
console.log(`- components.json schema & aliases: ${componentsJsonPassed ? 'PASS' : 'FAIL'}`);
console.log(`- public/r/index.json parity with registry.json: ${indexParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Modular root registry.json via include & field parity: ${modularCheckPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Item schema & exact dependency resolution: ${itemErrors === 0 && catalogErrors.length === 0 ? 'PASS' : 'FAIL'}`);
console.log(`- Source <-> public/r/ content parity: ${srcParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Acyclic registryDependencies graph: ${noCyclesPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Portable placeholder/root targets only: ${hardcodedTargetCount === 0 ? 'PASS' : 'FAIL'}`);
console.log(`- CLI bundled registry parity (packages/eolas-ui/registry): ${pkgParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Oxlint consumer config parity: ${lintConfigParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Package version parity (${rootPkg.version}): ${versionParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Playground manifest ID & field parity: ${manifestParityPassed ? 'PASS' : 'FAIL'}`);

if (failed) {
  process.exit(1);
}
