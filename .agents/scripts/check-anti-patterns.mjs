#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: fast text/copy and CSS-fallback anti-pattern gate.
 * Structural AST rules (nested <Card>, sparkle icons, triple-tint, tertiary contrast,
 * transition-all, spring easing, uppercase, unsafe casts) run in Oxlint (packages/eolas-ui/lint).
 */

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    main(JSON.parse(raw));
  } catch (err) {
    process.stderr.write(`[check-anti-patterns] Hook error: ${err?.message || err}\n`);
    respond({ decision: 'allow' });
  }
});

function main(input) {
  const toolCall = input.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.Path || args.path || args.TargetFile || args.FilePath || args.filePath || '';

  if (!/\.(tsx|jsx|css|ts|js)$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }
  if (/(?:globals|index|eolas-theme)\.css$|tailwind\.config\.[cm]?[jt]s$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }
  if (/\.(?:test|spec)\.[jt]sx?$/i.test(targetFile) || /AntiPatternAuditBench\.tsx$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const content = extractContent(toolCall.name, args);
  if (!content) {
    return respond({ decision: 'allow' });
  }

  const violations = scan(content, targetFile);
  if (violations.length > 0) {
    return respond({ decision: 'deny', reason: buildReason(violations) });
  }
  return respond({ decision: 'allow' });
}

function extractContent(toolName, args) {
  if (toolName === 'write_file') return args.Content || args.content || '';
  if (toolName === 'edit_file') return args.Replacement || args.newString || '';
  if (toolName === 'write_to_file') return args.CodeContent || args.content || '';
  if (toolName === 'replace_file_content') return args.ReplacementContent || args.newString || '';
  if (toolName === 'multi_replace_file_content') {
    const chunks = args.ReplacementChunks || [];
    return chunks.map((c) => c.ReplacementContent || c.newString || '').join('\n');
  }
  return '';
}

function hasMatchingBacktick(code, startIdx) {
  for (let j = startIdx; j < code.length; j++) {
    if (code[j] === '\\') {
      j += 1;
      continue;
    }
    if (code[j] === '`') return true;
  }
  return false;
}

function stripComments(code) {
  let out = '';
  let quote = null;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1];
    if (quote) {
      out += ch;
      if (ch === '\\' && i + 1 < code.length) {
        out += next;
        i += 1;
      } else if (ch === quote || ((quote === "'" || quote === '"') && (ch === '\n' || ch === '\r'))) {
        quote = null;
      }
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i + 1 < code.length && code[i + 1] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      const closeIdx = code.indexOf('*/', i + 2);
      if (closeIdx !== -1) {
        out += code.slice(i, closeIdx + 2).replace(/[^\n\r]/g, ' ');
        i = closeIdx + 1;
        continue;
      }
    }
    if (ch === '"') {
      quote = '"';
    } else if (ch === '`' && hasMatchingBacktick(code, i + 1)) {
      quote = '`';
    } else if (ch === "'" && (i === 0 || !/[A-Za-z0-9]/.test(code[i - 1]))) {
      quote = "'";
    }
    out += ch;
  }
  return out;
}

const STUB_RE =
  /\/\/\s*(?:TODO:?\s*implement|\.\.\.\s*rest of|handle other cases|insert logic here)|\/\*\s*\.\.\.\s*\*\/|\{\/\*\s*\.\.\.\s*rest of[^*]*\*\/\}/i;
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u;
const AI_BUZZWORDS = 'delve|tapestry|unleash|elevate|spearhead|testament|enclave|telemetric|apparatus|seamless';
const PROP_JARGON = 'committed to|unconstrained|hydrated|synchronized|telemetry|matrix|repository';
const UI_PROP_NAMES = '(?:label|title|description|placeholder|heading|alt|aria-label|emptyText|helperText)';

const PROP_BUZZWORD_RE = new RegExp(`\\b${UI_PROP_NAMES}\\s*=\\s*["'][^"']*?\\b(?:${AI_BUZZWORDS})\\b`, 'i');
const PROP_JARGON_RE = new RegExp(`\\b${UI_PROP_NAMES}\\s*=\\s*["'][^"']*?\\b(?:${PROP_JARGON})\\b`, 'i');
const JSX_TEXT_BUZZWORD_RE = new RegExp(`<[A-Za-z][A-Za-z0-9._-]*(?:\\s[^<>]*)?>[^<{}]*?\\b(?:${AI_BUZZWORDS})\\b[^<{}]*</[A-Za-z][A-Za-z0-9._-]*>`, 'i');
const JSX_TEXT_JARGON_RE = new RegExp(`<[A-Za-z][A-Za-z0-9._-]*(?:\\s[^<>]*)?>[^<{}]*?\\b(?:${PROP_JARGON})\\b[^<{}]*</[A-Za-z][A-Za-z0-9._-]*>`, 'i');

function scan(content, targetFile) {
  const violations = [];
  const isJsx = /\.(tsx|jsx)$/i.test(targetFile);
  const isCss = /\.css$/i.test(targetFile);
  const stripped = stripComments(content);

  if (STUB_RE.test(content)) {
    violations.push('Found placeholder / truncation comment (e.g. "// TODO: implement", "// ... rest of"). Write complete runnable code.');
  }

  if (isJsx) {
    if (EMOJI_RE.test(stripped)) {
      violations.push('Found a decorative emoji character. Anti-patterns rule bans emojis in UI copy — use Material Symbols via <Icon>.');
    }
    if (PROP_BUZZWORD_RE.test(stripped) || JSX_TEXT_BUZZWORD_RE.test(stripped)) {
      violations.push('Found banned AI cliché vocabulary ("delve", "tapestry", "unleash", "elevate", "seamless", "enclave", "apparatus", etc.) in UI copy. Write in plain everyday English.');
    }
    if (PROP_JARGON_RE.test(stripped) || JSX_TEXT_JARGON_RE.test(stripped)) {
      violations.push('Found dev/database/CSS jargon in UI copy ("committed to", "unconstrained", "synchronized", "telemetry", "affordance", "matrix", "repository"). Describe user outcomes in plain English.');
    }
  }

  if (isCss) {
    if (/text-transform\s*:\s*uppercase\b/i.test(stripped)) {
      violations.push('Found `text-transform: uppercase` in CSS. DESIGN.md bans all-caps styling.');
    }
    if (/transition(?:-property)?\s*:\s*all\b/i.test(stripped)) {
      violations.push('Found `transition: all` / `transition-property: all` in CSS. Declare explicit targeted properties.');
    }
    if (/--ease-(?:spring|bounce)\b/.test(stripped)) {
      violations.push('Found `--ease-spring` or `--ease-bounce` in CSS outside theme stylesheets. Standard UI chrome must use `--ease-standard`.');
    }
  }

  return violations;
}

function buildReason(violations) {
  return `Design & anti-pattern gate blocked this change:\n${violations.map((m) => `- ${m}`).join('\n')}`;
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
