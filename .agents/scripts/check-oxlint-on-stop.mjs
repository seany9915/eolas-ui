#!/usr/bin/env node
/**
 * Antigravity Stop hook: runs local Oxlint on modified/untracked source files
 * at the end of an agent turn, feeding AST diagnostics back into the loop once.
 * Safely no-ops if Oxlint / .oxlintrc.json is not installed or when continuationActive is true.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const IGNORED_PREFIXES = [
  'dist/',
  'public/',
  'node_modules/',
  '.agents/',
  'packages/eolas-ui/registry/',
  'packages/eolas-ui/lint/',
  'lint/',
  'scratch/',
  'docs/',
];

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    const input = raw.trim() ? JSON.parse(raw) : {};
    main(input);
  } catch (err) {
    process.stderr.write(`[check-oxlint-on-stop] Hook error: ${err?.message || err}\n`);
    respond({});
  }
});

function main(input) {
  if (
    process.env.EOLAS_SKIP_STOP_OXLINT === '1' ||
    process.env.EOLAS_SKIP_STOP_OXLINT === 'true'
  ) {
    return respond({});
  }
  if (input.continuationActive === true) {
    return respond({});
  }
  if (input.terminationReason && input.terminationReason !== 'NO_TOOL_CALL') {
    return respond({});
  }

  const fallbackCwd = path.basename(process.cwd()) === '.agents' ? path.resolve(process.cwd(), '..') : process.cwd();
  const workspaceRoot = (input.workspacePaths && input.workspacePaths[0]) || input.cwd || fallbackCwd;
  const resolvedWorkspaceRoot = safeRealpath(workspaceRoot);

  const oxlintRc = path.join(workspaceRoot, '.oxlintrc.json');
  if (!fs.existsSync(oxlintRc)) {
    return respond({});
  }

  const topRes = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: workspaceRoot,
    encoding: 'utf8',
    timeout: 5000,
  });
  const hasGitRepo = !topRes.error && topRes.status === 0 && Boolean(topRes.stdout?.trim());
  const gitTopLevel = hasGitRepo ? safeRealpath(topRes.stdout.trim()) : null;

  const resolvedOxlint = resolveOxlintBinary(resolvedWorkspaceRoot, gitTopLevel);
  if (!resolvedOxlint) {
    return respond({});
  }

  const ignoredPrefixes = [...IGNORED_PREFIXES];
  try {
    const rawRc = fs.readFileSync(oxlintRc, 'utf8');
    const oxlintCfg = JSON.parse(stripJsonCommentsAndTrailingCommas(rawRc));
    if (Array.isArray(oxlintCfg?.ignorePatterns)) {
      for (const pattern of oxlintCfg.ignorePatterns) {
        if (typeof pattern !== 'string') continue;
        const cleaned = pattern.replace(/^\.\//, '').replace(/\\/g, '/');
        const prefixMatch = cleaned.match(/^([^?*[\]{}]+?)(?:\/\*\*|\/\*|\/)?$/);
        if (prefixMatch && prefixMatch[1]) {
          const prefix = prefixMatch[1].endsWith('/') ? prefixMatch[1] : `${prefixMatch[1]}/`;
          if (!ignoredPrefixes.includes(prefix)) {
            ignoredPrefixes.push(prefix);
          }
        }
      }
    }
  } catch {
    // Fall back to default IGNORED_PREFIXES if .oxlintrc.json cannot be parsed
  }

  const scopedEnv = process.env.EOLAS_OXLINT_STOP_FILES;
  const filesToLint = [];
  const seen = new Set();

  if (scopedEnv && scopedEnv.trim()) {
    for (const entry of scopedEnv.split(/[,\r\n]+/)) {
      const rawFile = entry.trim();
      if (!rawFile) continue;
      const absPath = path.isAbsolute(rawFile)
        ? rawFile
        : path.resolve(resolvedWorkspaceRoot, rawFile);
      const relToWorkspace = path.relative(resolvedWorkspaceRoot, absPath);
      if (!relToWorkspace || relToWorkspace.startsWith('..') || path.isAbsolute(relToWorkspace)) {
        continue;
      }
      const norm = relToWorkspace.replace(/\\/g, '/').replace(/^\.\//, '');
      if (!/\.(?:ts|tsx|js|jsx|mjs|cjs)$/i.test(norm)) continue;
      if (ignoredPrefixes.some((prefix) => norm.startsWith(prefix))) continue;
      if (!fs.existsSync(absPath)) continue;
      try {
        if (!fs.statSync(absPath).isFile()) continue;
      } catch {
        continue;
      }
      if (!seen.has(norm)) {
        seen.add(norm);
        filesToLint.push(norm);
      }
    }
  } else {
    if (!gitTopLevel) {
      return respond({});
    }

    const gitRes = spawnSync('git', ['status', '--porcelain', '-uall', '-z'], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      timeout: 5000,
    });

    if (gitRes.error || gitRes.status !== 0 || !gitRes.stdout) {
      return respond({});
    }

    const tokens = gitRes.stdout.split('\0');

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!token || token.length < 4) continue;
      const statusCode = token.slice(0, 2);
      const relRaw = token.slice(3);
      if (statusCode[0] === 'R' || statusCode[0] === 'C' || statusCode[1] === 'R' || statusCode[1] === 'C') {
        i += 1;
      }
      if (!relRaw) continue;

      const absPath = path.resolve(gitTopLevel, relRaw);
      const relToWorkspace = path.relative(resolvedWorkspaceRoot, absPath);
      if (!relToWorkspace || relToWorkspace.startsWith('..') || path.isAbsolute(relToWorkspace)) {
        continue;
      }

      const norm = relToWorkspace.replace(/\\/g, '/').replace(/^\.\//, '');
      if (!/\.(?:ts|tsx|js|jsx|mjs|cjs)$/i.test(norm)) continue;
      if (ignoredPrefixes.some((prefix) => norm.startsWith(prefix))) continue;

      if (!fs.existsSync(absPath)) continue;
      try {
        if (!fs.statSync(absPath).isFile()) continue;
      } catch {
        continue;
      }

      if (!seen.has(norm)) {
        seen.add(norm);
        filesToLint.push(norm);
      }
    }
  }

  if (filesToLint.length === 0) {
    return respond({});
  }

  const lintRes = resolvedOxlint.isJsScript
    ? spawnSync(process.execPath, [resolvedOxlint.binPath, ...filesToLint], {
        cwd: workspaceRoot,
        encoding: 'utf8',
        timeout: 20000,
      })
    : spawnSync(resolvedOxlint.binPath, filesToLint, {
        cwd: workspaceRoot,
        encoding: 'utf8',
        shell: false,
        timeout: 20000,
      });

  if (lintRes.error) {
    process.stderr.write(`[check-oxlint-on-stop] Failed to run oxlint: ${lintRes.error.message}\n`);
    return respond({});
  }

  if (lintRes.status !== 0) {
    const combined = [lintRes.stdout, lintRes.stderr].filter(Boolean).join('\n').trim();
    if (/No files found to lint|Finished in \d+(?:\.\d+)?(?:ms|s) on 0 files/i.test(combined)) {
      return respond({});
    }
    const trimmed = combined.length > 3000 ? `${combined.slice(0, 3000)}\n... (truncated)` : combined;
    return respond({
      decision: 'continue',
      reason: `Oxlint reported errors in modified files. Fix them before finishing:\n\n${trimmed}`,
    });
  }

  return respond({});
}

function isWithinPath(childPath, parentPath) {
  const rel = path.relative(parentPath, childPath);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function isNodeJsScript(filePath) {
  if (/\.(?:cmd|bat|ps1|exe|sh)$/i.test(filePath)) return false;
  if (/\.(?:js|mjs|cjs)$/i.test(filePath)) return true;
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(512);
    const bytesRead = fs.readSync(fd, buf, 0, 512, 0);
    fs.closeSync(fd);
    if (bytesRead === 0) return false;
    const slice = buf.subarray(0, bytesRead);
    if (slice.includes(0)) return false;
    if (slice[0] === 0x4d && slice[1] === 0x5a) return false; // PE MZ
    if (slice[0] === 0x7f && slice[1] === 0x45 && slice[2] === 0x4c && slice[3] === 0x46) return false; // ELF
    const text = slice.toString('utf8');
    if (text.startsWith('#!')) {
      const firstLine = text.split(/\r?\n/, 1)[0];
      return /\b(?:node|nodejs)\b/i.test(firstLine);
    }
    return true;
  } catch {
    return false;
  }
}

function resolveOxlintBinary(resolvedWorkspaceRoot, gitTopLevel) {
  const stopBound = gitTopLevel && isWithinPath(resolvedWorkspaceRoot, gitTopLevel)
    ? gitTopLevel
    : path.parse(resolvedWorkspaceRoot).root;

  let curr = resolvedWorkspaceRoot;
  while (curr) {
    // 1. Package manager resolution (supports npm, hoisted monorepos, pnpm, Yarn PnP)
    try {
      const req = createRequire(path.join(curr, 'package.json'));
      const pkgJsonPath = req.resolve('oxlint/package.json');
      if (!gitTopLevel || isWithinPath(path.resolve(pkgJsonPath), stopBound)) {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.oxlint || 'bin/oxlint';
        const binPath = path.resolve(path.dirname(pkgJsonPath), binRel);
        if (fs.existsSync(binPath)) {
          return { binPath, isJsScript: isNodeJsScript(binPath) };
        }
      }
    } catch {
      // Fall through to direct node_modules lookup
    }

    // 2. Direct node_modules lookup (handles shims or packages without ./package.json export)
    const directPkgJson = path.join(curr, 'node_modules', 'oxlint', 'package.json');
    if (fs.existsSync(directPkgJson)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(directPkgJson, 'utf8'));
        const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.oxlint || 'bin/oxlint';
        const binPath = path.resolve(path.dirname(directPkgJson), binRel);
        if (fs.existsSync(binPath)) {
          return { binPath, isJsScript: isNodeJsScript(binPath) };
        }
      } catch {
        // Ignore malformed package.json
      }
    }

    const directBinScript = path.join(curr, 'node_modules', 'oxlint', 'bin', 'oxlint');
    if (fs.existsSync(directBinScript)) {
      return { binPath: directBinScript, isJsScript: isNodeJsScript(directBinScript) };
    }

    const dotBin = path.join(
      curr,
      'node_modules',
      '.bin',
      process.platform === 'win32' ? 'oxlint.exe' : 'oxlint'
    );
    if (fs.existsSync(dotBin)) {
      return { binPath: dotBin, isJsScript: isNodeJsScript(dotBin) };
    }

    if (curr === stopBound) break;
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }

  return null;
}

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

function safeRealpath(targetPath) {
  try {
    return fs.realpathSync(targetPath);
  } catch {
    return path.resolve(targetPath);
  }
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
