import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.resolve(ROOT, 'public/r');
const PKG_REGISTRY_DIR = path.resolve(ROOT, 'packages/eolas-ui/registry');
const CATALOG_PATH = path.resolve(OUT_DIR, 'registry.json');
const EOLAS_DEP_PREFIX = `${(
  process.env.EOLAS_REGISTRY_BASE_URL || 'https://seany9915.github.io/eolas-ui/r'
).replace(/\/+$/, '')}/`;

console.log('=== Checking Registry Alignment with shadcn/ui Specs ===\n');

if (!fs.existsSync(CATALOG_PATH)) {
  console.error('Error: public/r/registry.json does not exist. Run `npm run build:registry` first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
let failed = false;

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
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
  const clean = stripComments(content);
  const refs = new Set();
  for (const match of clean.matchAll(/(?:import|export)\s+(?:type\s+)?(?:[^;'"]*?\s+from\s+)?['"]([^'"]+)['"]/g)) {
    const spec = match[1];
    if (spec.startsWith('@/components/ui/')) {
      refs.add(spec.slice('@/components/ui/'.length).replace(/\.(tsx?|jsx?)$/, ''));
    } else if (spec.startsWith('@/components/blocks/')) {
      refs.add(spec.slice('@/components/blocks/'.length).replace(/\.(tsx?|jsx?)$/, ''));
    } else if (spec.startsWith('@/lib/')) {
      refs.add(spec.slice('@/lib/'.length).replace(/\.ts$/, ''));
    } else if (spec.startsWith('./') && (itemType === 'registry:ui' || itemType === 'registry:block')) {
      refs.add(spec.slice(2).split('/')[0].replace(/\.(tsx?|jsx?)$/, ''));
    } else if (spec.startsWith('../ui/')) {
      refs.add(spec.slice('../ui/'.length).split('/')[0].replace(/\.(tsx?|jsx?)$/, ''));
    }
  }
  return refs;
}

// 1. Validate Catalog (public/r/registry.json)
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

  const declaredNpmDeps = new Set(Array.isArray(item.dependencies) ? item.dependencies : []);
  const normalizedRegDeps = new Set(
    (Array.isArray(item.registryDependencies) ? item.registryDependencies : []).map((dep) =>
      dep.startsWith(EOLAS_DEP_PREFIX) ? dep.slice(EOLAS_DEP_PREFIX.length).replace(/\.json$/, '') : dep
    )
  );
  const itemFileBasenames = new Set(
    (Array.isArray(item.files) ? item.files : []).map((f) => path.basename(f.path || '').replace(/\.(tsx?|jsx?|mjs)$/, ''))
  );

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

      if (typeof f.content === 'string' && /\.(tsx?|jsx?)$/.test(f.path || '') && (item.type === 'registry:ui' || item.type === 'registry:block' || item.type === 'registry:lib')) {
        for (const pkg of extractPackageImports(f.content)) {
          const satisfiedByUtils = normalizedRegDeps.has('utils') && utilsDeps.has(pkg);
          if (!declaredNpmDeps.has(pkg) && !satisfiedByUtils) {
            errs.push(`File ${f.path} imports "${pkg}" which is missing from item.dependencies`);
          }
        }
        for (const ref of extractInternalImports(f.content, item.type)) {
          if (ref === item.name) continue;
          if (!normalizedRegDeps.has(ref) && !itemFileBasenames.has(ref)) {
            errs.push(`File ${f.path} imports internal module "${ref}" missing from registryDependencies`);
          }
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

// 3. Validate root registry.json, its included sub-registries, uniqueness, and every declared source file
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
  const seenItemNames = new Set();

  const recordName = (name, source) => {
    if (seenItemNames.has(name)) {
      duplicateNames.push(`${name} (duplicate in ${source})`);
    }
    seenItemNames.add(name);
  };

  for (const item of rootData.items ?? []) {
    recordName(item.name, 'registry.json');
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
        recordName(item.name, includeRel);
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

  modularCheckPassed =
    rootMetaErrors.length === 0 &&
    missingIncludes.length === 0 &&
    subRegistryErrors.length === 0 &&
    duplicateNames.length === 0 &&
    missingSubRegistrySources.length === 0 &&
    missingSources.length === 0;
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
  const actualConsumer = fs.readFileSync(OXLINT_CONSUMER, 'utf8').replace(/\r\n/g, '\n');
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

// 7. Verify registry-manifest.ts parity
let manifestParityPassed = false;
const MANIFEST_PATH = path.resolve(ROOT, 'src/components/playground/registry/registry-manifest.ts');
const PUBLIC_SYSTEM_LIBS = new Set(['utils', 'sanitize', 'scheduler', 'built-in-ai', 'scroll-completion', 'format-duration']);
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
    const manifestIds = new Set(manifestEntries.map((e) => e.id));
    const expectedManifestIds = new Set(
      catalog.items
        .filter((i) => i.type === 'registry:ui' || i.type === 'registry:block' || (i.type === 'registry:lib' && PUBLIC_SYSTEM_LIBS.has(i.name)))
        .map((i) => i.name)
    );
    const missingFromManifest = [...expectedManifestIds].filter((id) => !manifestIds.has(id));
    const staleInManifest = [...manifestIds].filter((id) => !expectedManifestIds.has(id));
    if (missingFromManifest.length > 0 || staleInManifest.length > 0) {
      failed = true;
      console.error('\nregistry-manifest.ts is out of sync with public/r/registry.json:');
      if (missingFromManifest.length > 0) console.error('  Missing from manifest:', missingFromManifest);
      if (staleInManifest.length > 0) console.error('  Stale in manifest:', staleInManifest);
    } else {
      manifestParityPassed = true;
    }
  }
}

console.log('\n=== Feature Parity Checks ===');
console.log(`- Modular root registry.json via include: ${modularCheckPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Item schema & dependency resolution: ${itemErrors === 0 && catalogErrors.length === 0 ? 'PASS' : 'FAIL'}`);
console.log(`- Portable placeholder/root targets only: ${hardcodedTargetCount === 0 ? 'PASS' : 'FAIL'}`);
console.log(`- CLI bundled registry parity (packages/eolas-ui/registry): ${pkgParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Oxlint consumer config parity: ${lintConfigParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Package version parity (${rootPkg.version}): ${versionParityPassed ? 'PASS' : 'FAIL'}`);
console.log(`- Playground manifest parity: ${manifestParityPassed ? 'PASS' : 'FAIL'}`);

if (failed) {
  process.exit(1);
}
