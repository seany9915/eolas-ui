#!/usr/bin/env node
/**
 * Antigravity Stop hook: runs local Oxlint on modified/untracked source files
 * at the end of an agent turn, feeding AST diagnostics back into the loop once.
 * Safely no-ops if Oxlint / .oxlintrc.json is not installed or when continuationActive is true.
 */

import fs from 'node:fs';
import path from 'node:path';
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
  if (input.continuationActive === true) {
    return respond({});
  }
  if (input.terminationReason && input.terminationReason !== 'NO_TOOL_CALL') {
    return respond({});
  }

  const fallbackCwd = path.basename(process.cwd()) === '.agents' ? path.resolve(process.cwd(), '..') : process.cwd();
  const workspaceRoot = (input.workspacePaths && input.workspacePaths[0]) || input.cwd || fallbackCwd;

  const oxlintRc = path.join(workspaceRoot, '.oxlintrc.json');
  const oxlintScript = path.join(workspaceRoot, 'node_modules', 'oxlint', 'bin', 'oxlint');
  const oxlintBin = path.join(
    workspaceRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'oxlint.cmd' : 'oxlint'
  );

  if (!fs.existsSync(oxlintRc)) {
    return respond({});
  }
  const hasScript = fs.existsSync(oxlintScript);
  const hasBin = fs.existsSync(oxlintBin);
  if (!hasScript && !hasBin) {
    return respond({});
  }

  const ignoredPrefixes = [...IGNORED_PREFIXES];
  try {
    const oxlintCfg = JSON.parse(fs.readFileSync(oxlintRc, 'utf8'));
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

  const gitRes = spawnSync('git', ['status', '--porcelain', '-uall', '-z', '--relative'], {
    cwd: workspaceRoot,
    encoding: 'utf8',
    timeout: 5000,
  });

  if (gitRes.error || gitRes.status !== 0 || !gitRes.stdout) {
    return respond({});
  }

  const tokens = gitRes.stdout.split('\0');
  const filesToLint = [];
  const seen = new Set();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token || token.length < 4) continue;
    const statusCode = token.slice(0, 2);
    const relRaw = token.slice(3);
    if (statusCode[0] === 'R' || statusCode[0] === 'C' || statusCode[1] === 'R' || statusCode[1] === 'C') {
      i += 1;
    }
    if (!relRaw) continue;

    const norm = relRaw.replace(/\\/g, '/').replace(/^\.\//, '');
    if (!/\.(?:ts|tsx|js|jsx|mjs|cjs)$/i.test(norm)) continue;
    if (ignoredPrefixes.some((prefix) => norm.startsWith(prefix))) continue;

    const absPath = path.join(workspaceRoot, norm);
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

  if (filesToLint.length === 0) {
    return respond({});
  }

  const lintRes = hasScript
    ? spawnSync(process.execPath, [oxlintScript, ...filesToLint], {
        cwd: workspaceRoot,
        encoding: 'utf8',
        timeout: 20000,
      })
    : spawnSync(oxlintBin, filesToLint, {
        cwd: workspaceRoot,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: 20000,
      });

  if (lintRes.error) {
    process.stderr.write(`[check-oxlint-on-stop] Failed to run oxlint: ${lintRes.error.message}\n`);
    return respond({});
  }

  if (lintRes.status !== 0) {
    const combined = [lintRes.stdout, lintRes.stderr].filter(Boolean).join('\n').trim();
    if (/No files found to lint|Finished in \d+m?s on 0 files/i.test(combined)) {
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

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
