#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: fires before a NEW file is written. If the
 * file looks like a new UI component living outside the shared primitive
 * directory, it lists the existing primitives back to the agent so it has
 * to actively confirm nothing already covers this need — enforcing the
 * "primitive-check-first" workflow in .agents/rules/component-library.md
 * instead of relying on the agent to remember to do it unprompted.
 *
 * Adjust PRIMITIVE_DIR_CANDIDATES below to match your actual repo layout.
 */

import fs from 'node:fs';
import path from 'node:path';

const PRIMITIVE_DIR_CANDIDATES = [
  'src/components/ui',
  'components/ui',
  'src/primitives',
  'src/components/primitives',
];

const BLOCK_DIR_CANDIDATES = [
  'src/components/blocks',
  'components/blocks',
];

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    main(JSON.parse(raw));
  } catch (err) {
    respond({ decision: 'allow' });
  }
});

function main(input) {
  const toolCall = input.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.TargetFile || '';
  const workspaceRoot = (input.workspacePaths && input.workspacePaths[0]) || process.cwd();

  if (!/\.(tsx|jsx)$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const normalized = '/' + targetFile.replace(/\\/g, '/').replace(/^\/+/, '');
  const isComponentLike = /\/components\//i.test(normalized) || /\/(ui|primitives|blocks)\//i.test(normalized);
  if (!isComponentLike) {
    return respond({ decision: 'allow' });
  }

  const absoluteTarget = path.isAbsolute(targetFile) ? targetFile : path.join(workspaceRoot, targetFile);

  // Editing an existing file is fine — only gate brand-new files.
  if (fs.existsSync(absoluteTarget)) {
    return respond({ decision: 'allow' });
  }

  // Writing directly into a primitive directory or composite blocks directory is allowed.
  const isInsideAllowedDir = [...PRIMITIVE_DIR_CANDIDATES, ...BLOCK_DIR_CANDIDATES].some((dir) =>
    normalized.includes(`/${dir.replace(/\\/g, '/')}/`)
  );
  if (isInsideAllowedDir) {
    return respond({ decision: 'allow' });
  }

  const inventory = buildPrimitiveInventory(workspaceRoot);
  if (!inventory.dir) {
    // No known primitive directory found in this repo — nothing to check against.
    return respond({ decision: 'allow' });
  }

  return respond({
    decision: 'deny',
    reason:
      `Primitive-check gate blocked this change:\n` +
      `New component file "${targetFile}" is being created outside the primitive directory ("${inventory.dir}").\n` +
      `Existing primitives in ${inventory.dir}: ${inventory.names.join(', ') || '(none yet)'}.\n` +
      'Rule: Before writing a new UI component, search and reuse or extend existing primitives in src/components/ui/. ' +
      'If a brand new primitive is genuinely needed, create it inside the primitive directory so it remains shared — see .agents/rules/component-library.md.',
  });
}

function buildPrimitiveInventory(workspaceRoot) {
  for (const dir of PRIMITIVE_DIR_CANDIDATES) {
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
