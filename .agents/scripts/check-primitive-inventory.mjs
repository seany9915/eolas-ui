#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: fires before a NEW UI component file is written.
 * Catches likely duplicate/synonym primitives anywhere in src/ and new components
 * placed directly under top-level components/ outside ui/, blocks/, or playground/demos/.
 */

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_PRIMITIVE_DIRS = [
  'src/components/ui',
  'components/ui',
  'src/primitives',
  'src/components/primitives',
];

const DEFAULT_BLOCK_DIRS = [
  'src/components/blocks',
  'components/blocks',
];

const PLAYGROUND_DIRS = [
  'src/components/playground',
  'components/playground',
  'src/components/demos',
  'components/demos',
];

const PRIMITIVE_SYNONYMS = {
  modal: ['dialog', 'alert-dialog', 'drawer'],
  popup: ['popover', 'dialog', 'tooltip'],
  dropdown: ['menu', 'select', 'combobox'],
  'dropdown-menu': ['menu', 'select', 'combobox'],
  listbox: ['select', 'combobox', 'autocomplete'],
  textbox: ['input', 'textarea', 'field'],
  textfield: ['input', 'textarea', 'field'],
  'text-field': ['input', 'textarea', 'field'],
  loader: ['spinner', 'skeleton', 'progress'],
  loading: ['spinner', 'skeleton', 'progress'],
  snackbar: ['toast'],
  notification: ['toast', 'inline-alert', 'notification-badge'],
  banner: ['inline-alert'],
  alert: ['inline-alert', 'alert-dialog'],
  btn: ['button', 'button-group'],
  pill: ['badge', 'chip'],
  tag: ['badge', 'chip'],
  divider: ['separator'],
  collapse: ['collapsible', 'accordion'],
  expander: ['collapsible', 'accordion'],
  'toggle-button': ['toggle', 'toggle-group'],
  segmented: ['toggle-group', 'tabs'],
  'segmented-control': ['toggle-group', 'tabs'],
  datepicker: ['calendar'],
  'date-picker': ['calendar'],
  'combo-box': ['combobox'],
  typeahead: ['autocomplete', 'combobox'],
  'search-input': ['input-group', 'autocomplete'],
  'file-upload': ['attachment'],
  'side-panel': ['drawer', 'sidebar'],
  'slide-over': ['drawer', 'sidebar'],
};

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    main(JSON.parse(raw));
  } catch (err) {
    process.stderr.write(`[check-primitive-inventory] Hook error: ${err?.message || err}\n`);
    respond({ decision: 'allow' });
  }
});

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
    return { baseUrlAbs: null, refBaseUrls: [], entries: [] };
  }

  let parsed;
  try {
    const raw = fs.readFileSync(absPath, 'utf8');
    parsed = JSON.parse(stripJsonCommentsAndTrailingCommas(raw));
  } catch {
    return { baseUrlAbs: null, refBaseUrls: [], entries: [] };
  }

  const nextAncestors = new Set(ancestorChain);
  nextAncestors.add(absPath);
  refVisited.add(absPath);

  const configDir = path.dirname(absPath);
  let inheritedBaseUrlAbs = null;
  const entryMap = new Map();

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

  const refBaseUrls = [];
  if (Array.isArray(parsed?.references)) {
    for (const ref of parsed.references) {
      if (!ref || typeof ref.path !== 'string') continue;
      const refPath = resolveTsconfigFile(configDir, ref.path);
      if (!refPath || refVisited.has(path.resolve(refPath))) continue;
      const refData = loadTsconfigRecursive(refPath, nextAncestors, refVisited);
      if (refData.baseUrlAbs && !refBaseUrls.includes(refData.baseUrlAbs)) {
        refBaseUrls.push(refData.baseUrlAbs);
      }
      for (const candidate of refData.refBaseUrls) {
        if (!refBaseUrls.includes(candidate)) refBaseUrls.push(candidate);
      }
      for (const entry of refData.entries) {
        if (!entryMap.has(entry.pattern)) {
          entryMap.set(entry.pattern, entry);
        }
      }
    }
  }

  return {
    baseUrlAbs: effectiveBaseUrlAbs,
    refBaseUrls,
    entries: Array.from(entryMap.values()),
  };
}

function loadTsconfigPaths(workspaceRoot) {
  const tsconfigPath = path.join(workspaceRoot, 'tsconfig.json');
  const jsconfigPath = path.join(workspaceRoot, 'jsconfig.json');
  const rootConfig = fs.existsSync(tsconfigPath)
    ? tsconfigPath
    : fs.existsSync(jsconfigPath)
      ? jsconfigPath
      : null;

  if (!rootConfig) return null;

  const result = loadTsconfigRecursive(rootConfig);
  if (result.entries.length === 0 && !result.baseUrlAbs && result.refBaseUrls.length === 0) {
    return null;
  }
  return result;
}

function resolveFromTsconfigPaths(rawAlias, tsconfigPaths, workspaceRoot) {
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
      if (
        rawAlias.length >= patPrefix.length + patSuffix.length &&
        rawAlias.startsWith(patPrefix) &&
        rawAlias.endsWith(patSuffix)
      ) {
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
      return path.relative(workspaceRoot, absTarget).replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    }
  }
  return null;
}

function resolveAliasDir(rawAlias, workspaceRoot, hasSrc, tsconfigPaths = null) {
  if (!rawAlias || typeof rawAlias !== 'string') return null;
  const tsMapped = resolveFromTsconfigPaths(rawAlias, tsconfigPaths, workspaceRoot);
  if (tsMapped) return tsMapped;
  if (rawAlias.startsWith('@/') || rawAlias.startsWith('~/')) {
    const stripped = rawAlias.slice(2).replace(/^\/+|\/+$/g, '');
    return hasSrc && !stripped.startsWith('src/') ? `src/${stripped}` : stripped;
  }
  if (!rawAlias.startsWith('.') && !path.isAbsolute(rawAlias)) {
    const baseCandidates = [
      ...(tsconfigPaths?.baseUrlAbs ? [tsconfigPaths.baseUrlAbs] : []),
      ...(tsconfigPaths?.refBaseUrls || []),
    ];
    if (baseCandidates.length > 0) {
      const matchedBase =
        baseCandidates.find((base) => fs.existsSync(path.resolve(base, rawAlias))) || baseCandidates[0];
      const absTarget = path.resolve(matchedBase, rawAlias);
      return path.relative(workspaceRoot, absTarget).replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    }
  }
  return rawAlias.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function getConfiguredDirs(workspaceRoot) {
  const hasSrc = fs.existsSync(path.join(workspaceRoot, 'src'));
  const tsconfigPaths = loadTsconfigPaths(workspaceRoot);
  const primitiveDirs = [...DEFAULT_PRIMITIVE_DIRS];
  const blockDirs = [...DEFAULT_BLOCK_DIRS];

  const configPath = path.join(workspaceRoot, 'components.json');
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const uiDir = resolveAliasDir(cfg?.aliases?.ui, workspaceRoot, hasSrc, tsconfigPaths);
      if (uiDir) {
        primitiveDirs.unshift(uiDir);
      }
      const compDir = resolveAliasDir(cfg?.aliases?.components, workspaceRoot, hasSrc, tsconfigPaths);
      if (compDir) {
        if (!cfg?.aliases?.ui) {
          primitiveDirs.unshift(`${compDir}/ui`);
        }
        blockDirs.unshift(`${compDir}/blocks`);
      }
    } catch {
      // Ignore malformed components.json
    }
  }

  return {
    primitiveDirs: [...new Set(primitiveDirs)],
    blockDirs: [...new Set(blockDirs)],
  };
}

function toKebabCase(str) {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function main(input) {
  const toolCall = input.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.Path || args.path || args.TargetFile || args.FilePath || args.filePath || '';

  if (!/\.(tsx|jsx)$/i.test(targetFile) || /\.(?:test|spec)\.[jt]sx?$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const fallbackCwd = path.basename(process.cwd()) === '.agents' ? path.resolve(process.cwd(), '..') : process.cwd();
  const workspaceRoot = (input.workspacePaths && input.workspacePaths[0]) || input.cwd || fallbackCwd;

  const isWindowsDriveAbs = /^[a-zA-Z]:[\\/]/.test(targetFile);
  const absoluteTarget =
    isWindowsDriveAbs || (process.platform !== 'win32' && path.isAbsolute(targetFile))
      ? targetFile
      : path.resolve(workspaceRoot, targetFile.replace(/^\/+/, ''));

  // Editing an existing file is fine — only gate brand-new files.
  if (fs.existsSync(absoluteTarget)) {
    return respond({ decision: 'allow' });
  }

  const computedRel = path.relative(workspaceRoot, absoluteTarget).replace(/\\/g, '/');
  const relPath =
    computedRel && !computedRel.startsWith('..') && !path.isAbsolute(computedRel)
      ? computedRel
      : targetFile.replace(/\\/g, '/').replace(/^\/+/, '');
  const relLower = relPath.toLowerCase();

  const { primitiveDirs, blockDirs } = getConfiguredDirs(workspaceRoot);
  const inventory = buildComponentInventory(workspaceRoot, primitiveDirs);
  const blockInventory = buildComponentInventory(workspaceRoot, blockDirs);
  if (!inventory.dir && !blockInventory.dir) {
    return respond({ decision: 'allow' });
  }

  const existingSet = new Set([
    ...inventory.names.map((n) => n.toLowerCase()),
    ...blockInventory.names.map((n) => n.toLowerCase()),
  ]);
  const uiSet = new Set(inventory.names.map((n) => n.toLowerCase()));
  const blockSet = new Set(blockInventory.names.map((n) => n.toLowerCase()));
  const baseName = path.basename(relPath).replace(/\.(tsx|jsx)$/i, '');
  const kebabName = toKebabCase(baseName);
  const strippedKebab = kebabName.replace(/^(?:custom|base|my|ui|app)-/, '');

  const isExcludedFromDuplicateCheck = /(?:^|\/)(?:blocks|playground|demos)\//i.test(relLower);
  const isInComponentScope = /^(?:src\/|(?:components|features|views|ui|primitives)\/)/i.test(relLower);

  // 1. Duplicate / synonym primitive & block check across src/ (including src/components/ui/, features/, views/)
  if (isInComponentScope && !isExcludedFromDuplicateCheck) {
    const matches = new Set();
    for (const candidate of [kebabName, strippedKebab]) {
      if (existingSet.has(candidate)) {
        matches.add(candidate);
      }
      const synonyms = PRIMITIVE_SYNONYMS[candidate];
      if (synonyms) {
        for (const syn of synonyms) {
          if (existingSet.has(syn)) matches.add(syn);
        }
      }
    }

    if (matches.size > 0) {
      const matchedList = [...matches];
      const matchedDirs = [];
      if (inventory.dir && matchedList.some((m) => uiSet.has(m))) matchedDirs.push(inventory.dir);
      if (blockInventory.dir && matchedList.some((m) => blockSet.has(m))) matchedDirs.push(blockInventory.dir);
      const locationLabel = matchedDirs.join(' / ') || inventory.dir || blockInventory.dir;
      return respond({
        decision: 'force_ask',
        reason:
          `Primitive-check gate requires confirmation:\n` +
          `New component "${targetFile}" appears to overlap with existing component(s) in ${locationLabel}: ${matchedList.join(', ')}.\n` +
          `Rule: Reuse or extend the existing component (${matchedList.join(', ')}) instead of creating a duplicate — see .agents/rules/component-library.md.`,
      });
    }
  }

  // 2. Top-level components/ layer check (excludes feature-local src/features/*/components/)
  const isTopLevelComponents = /^(?:src\/)?components\//i.test(relLower);
  if (isTopLevelComponents) {
    const allowedDirsLower = [...primitiveDirs, ...blockDirs, ...PLAYGROUND_DIRS].map((d) =>
      `${d.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '').toLowerCase()}/`
    );
    const isInsideAllowedDir = allowedDirsLower.some((dirPrefix) => relLower.startsWith(dirPrefix));

    if (!isInsideAllowedDir) {
      const primaryInventory = inventory.dir ? inventory : blockInventory;
      const sample = primaryInventory.names.slice(0, 12).join(', ');
      const extraCount = primaryInventory.names.length > 12 ? ` (+${primaryInventory.names.length - 12} more)` : '';
      return respond({
        decision: 'force_ask',
        reason:
          `Primitive-check gate requires confirmation:\n` +
          `New component "${targetFile}" sits directly under top-level components/ outside ui/, blocks/, or playground/.\n` +
          `Place reusable primitives in ${primaryInventory.dir} (${primaryInventory.names.length} existing: ${sample}${extraCount}), composite assemblies in src/components/blocks/, or domain components in src/features/ or src/views/.`,
      });
    }
  }

  return respond({ decision: 'allow' });
}

function collectComponentNames(rootDir, currentDir = rootDir, names = new Set()) {
  let entries;
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch {
    return names;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      collectComponentNames(rootDir, fullPath, names);
    } else if (entry.isFile() && /\.(?:tsx|jsx|ts|js)$/i.test(entry.name)) {
      if (/\.(?:test|spec|stories)\.[jt]sx?$/i.test(entry.name)) continue;
      const stem = entry.name.replace(/\.(?:tsx|jsx|ts|js)$/i, '');
      if (stem.toLowerCase() === 'index') {
        if (currentDir !== rootDir) {
          names.add(toKebabCase(path.basename(currentDir)));
        }
      } else {
        names.add(toKebabCase(stem));
      }
    }
  }
  return names;
}

function buildComponentInventory(workspaceRoot, candidateDirs) {
  for (const dir of candidateDirs) {
    const absoluteDir = path.join(workspaceRoot, dir);
    if (fs.existsSync(absoluteDir) && fs.statSync(absoluteDir).isDirectory()) {
      const names = [...collectComponentNames(absoluteDir)].sort();
      return { dir, names };
    }
  }
  return { dir: null, names: [] };
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
