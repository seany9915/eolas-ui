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
  'side-panel': ['drawer', 'sheet', 'sidebar'],
  'slide-over': ['drawer', 'sheet', 'sidebar'],
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

function loadTsconfigPaths(workspaceRoot) {
  const tsconfigPath = path.join(workspaceRoot, 'tsconfig.json');
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
        return `${targetPrefix}${rawAlias.slice(prefix.length)}`.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
      }
      if (rawAlias === prefix.slice(0, -1)) {
        return targetPrefix.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
      }
    } else if (pattern === rawAlias) {
      return firstTarget.replace(/^\.\//, '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    }
  }
  return null;
}

function resolveAliasDir(rawAlias, workspaceRoot, hasSrc, tsconfigPaths = null) {
  if (!rawAlias || typeof rawAlias !== 'string') return null;
  const tsMapped = resolveFromTsconfigPaths(rawAlias, tsconfigPaths);
  if (tsMapped) return tsMapped;
  if (rawAlias.startsWith('@/')) {
    const stripped = rawAlias.slice(2).replace(/^\/+|\/+$/g, '');
    return hasSrc && !stripped.startsWith('src/') ? `src/${stripped}` : stripped;
  }
  if (rawAlias.startsWith('~/')) {
    return rawAlias.slice(2).replace(/^\/+|\/+$/g, '');
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
  const inventory = buildPrimitiveInventory(workspaceRoot, primitiveDirs);
  if (!inventory.dir) {
    return respond({ decision: 'allow' });
  }

  const existingSet = new Set(inventory.names.map((n) => n.toLowerCase()));
  const baseName = path.basename(relPath).replace(/\.(tsx|jsx)$/i, '');
  const kebabName = toKebabCase(baseName);
  const strippedKebab = kebabName.replace(/^(?:custom|base|my|ui|app)-/, '');

  const isExcludedFromDuplicateCheck = /(?:^|\/)(?:blocks|playground|demos)\//i.test(relLower);
  const isInComponentScope = /^(?:src\/|(?:components|features|views|ui|primitives)\/)/i.test(relLower);

  // 1. Duplicate / synonym primitive check across src/ (including src/components/ui/, features/, views/)
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
      return respond({
        decision: 'force_ask',
        reason:
          `Primitive-check gate requires confirmation:\n` +
          `New component "${targetFile}" appears to overlap with existing primitive(s) in ${inventory.dir}: ${matchedList.join(', ')}.\n` +
          `Rule: Reuse or extend the existing primitive (${matchedList.join(', ')}) instead of creating a duplicate — see .agents/rules/component-library.md.`,
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
      const sample = inventory.names.slice(0, 12).join(', ');
      const extraCount = inventory.names.length > 12 ? ` (+${inventory.names.length - 12} more)` : '';
      return respond({
        decision: 'force_ask',
        reason:
          `Primitive-check gate requires confirmation:\n` +
          `New component "${targetFile}" sits directly under top-level components/ outside ui/, blocks/, or playground/.\n` +
          `Place reusable primitives in ${inventory.dir} (${inventory.names.length} existing: ${sample}${extraCount}), composite assemblies in src/components/blocks/, or domain components in src/features/ or src/views/.`,
      });
    }
  }

  return respond({ decision: 'allow' });
}

function buildPrimitiveInventory(workspaceRoot, primitiveDirs) {
  for (const dir of primitiveDirs) {
    const absoluteDir = path.join(workspaceRoot, dir);
    if (fs.existsSync(absoluteDir) && fs.statSync(absoluteDir).isDirectory()) {
      const names = fs
        .readdirSync(absoluteDir)
        .filter((f) => /\.(tsx|jsx|ts|js)$/i.test(f))
        .map((f) => f.replace(/\.(tsx|jsx|ts|js)$/i, ''));
      return { dir, names };
    }
  }
  return { dir: null, names: [] };
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
