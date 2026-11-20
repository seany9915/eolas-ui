#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: scans code about to be written for the
 * anti-patterns banned in .agents/rules/anti-patterns.md, BEFORE the file
 * is written. Hard-blocks (`deny`) violations by default so the agent is
 * forced to self-correct even when folder write permissions are cached,
 * while respecting each violation's configured `severity` (`deny`, `force_ask`, `ask`).
 *
 * This is a heuristic scanner — tune the patterns below for your project's
 * conventions if needed.
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
    // Fail open — never block the agent because the hook itself errored.
    respond({ decision: 'allow' });
  }
});

function main(input) {
  const toolCall = input.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.Path || args.TargetFile || args.FilePath || '';

  // Only scan UI-relevant files.
  if (!/\.(tsx|jsx|css|ts|js)$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }
  // Don't scan the files where real hex codes / raw CSS values are meant to live or rule messages are defined.
  if (/(?:globals|index)\.css$|design\.md$|tailwind\.config\.(js|ts|cjs|mjs)$|oxlint\.config\.(js|ts|mjs|mts)$|\.oxlintrc\.json$|[\\/]lint[\\/]index\.(?:js|mjs)$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const content = extractContent(toolCall.name, args);
  if (!content) {
    return respond({ decision: 'allow' });
  }

  const violations = scan(content);
  if (violations.length > 0) {
    const decision = violations.some((v) => v.severity === 'deny')
      ? 'deny'
      : violations.some((v) => v.severity === 'force_ask')
        ? 'force_ask'
        : 'ask';
    return respond({ decision, reason: buildReason(violations) });
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

function hasClosingQuoteOnLine(code, startIdx, quote) {
  for (let i = startIdx + 1; i < code.length; i++) {
    const ch = code[i];
    if (ch === '\n' || ch === '\r') return false;
    if (ch === '\\') {
      i += 1;
      continue;
    }
    if (ch === quote) return true;
  }
  return false;
}

const REGEX_PRECEDING_KEYWORDS = new Set([
  'return',
  'case',
  'in',
  'of',
  'typeof',
  'void',
  'delete',
  'throw',
  'new',
  'else',
  'do',
  'yield',
  'await',
]);

function readRegexLiteralEnd(code, startIdx) {
  let i = startIdx + 1;
  let inCharClass = false;
  while (i < code.length) {
    const ch = code[i];
    if (ch === '\n' || ch === '\r') return -1;
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === '[' && !inCharClass) {
      inCharClass = true;
      i += 1;
      continue;
    }
    if (ch === ']' && inCharClass) {
      inCharClass = false;
      i += 1;
      continue;
    }
    if (ch === '/' && !inCharClass) {
      i += 1;
      while (i < code.length && /[a-zA-Z]/.test(code[i])) {
        i += 1;
      }
      return i;
    }
    i += 1;
  }
  return -1;
}

/**
 * Strip `//` line comments and `/* ... * /` block comments while preserving
 * string/template/regex literals (e.g. URLs and `/https:\/\//`) and avoiding JSX text apostrophes.
 */
function stripComments(code) {
  let out = '';
  let i = 0;
  let stringQuote = null;
  let canStartRegex = true;
  let prevNonSpaceChar = '';

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];

    if (stringQuote) {
      out += ch;
      if (ch === '\\' && i + 1 < code.length) {
        out += next;
        i += 2;
        continue;
      }
      if (ch === stringQuote) {
        stringQuote = null;
        canStartRegex = false;
        prevNonSpaceChar = ch;
      } else if ((stringQuote === "'" || stringQuote === '"') && (ch === '\n' || ch === '\r')) {
        stringQuote = null;
        canStartRegex = true;
        prevNonSpaceChar = ch;
      }
      i += 1;
      continue;
    }

    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') {
        i += 1;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      const closeIdx = code.indexOf('*/', i + 2);
      if (closeIdx !== -1) {
        const segment = code.slice(i, closeIdx + 2);
        out += segment.replace(/[^\n\r]/g, ' ');
        i = closeIdx + 2;
        continue;
      }
    }

    if (ch === '/' && canStartRegex && prevNonSpaceChar !== '<') {
      const regexEnd = readRegexLiteralEnd(code, i);
      if (regexEnd !== -1) {
        out += code.slice(i, regexEnd);
        i = regexEnd;
        canStartRegex = false;
        prevNonSpaceChar = '/';
        continue;
      }
    }

    if (ch === '`') {
      stringQuote = '`';
      out += ch;
      i += 1;
      continue;
    }

    if (ch === '"' && hasClosingQuoteOnLine(code, i, '"')) {
      stringQuote = '"';
      out += ch;
      i += 1;
      continue;
    }

    if (ch === "'") {
      const prev = i > 0 ? code[i - 1] : '';
      if (!/[A-Za-z0-9]/.test(prev) && hasClosingQuoteOnLine(code, i, "'")) {
        stringQuote = "'";
      } else {
        canStartRegex = false;
        prevNonSpaceChar = ch;
      }
      out += ch;
      i += 1;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let end = i + 1;
      while (end < code.length && /[A-Za-z0-9_$]/.test(code[end])) {
        end += 1;
      }
      const word = code.slice(i, end);
      out += word;
      canStartRegex = REGEX_PRECEDING_KEYWORDS.has(word);
      prevNonSpaceChar = word[word.length - 1];
      i = end;
      continue;
    }

    if (!/\s/.test(ch)) {
      canStartRegex = '([{,;:=!&|?+-*%^~<>'.includes(ch);
      prevNonSpaceChar = ch;
    }

    out += ch;
    i += 1;
  }

  return out;
}

function readBalanced(code, startIdx, openChar, closeChar) {
  let depth = 0;
  let i = startIdx;
  let stringQuote = null;

  while (i < code.length) {
    const ch = code[i];
    if (stringQuote) {
      if (ch === '\\' && i + 1 < code.length) {
        i += 2;
        continue;
      }
      if (ch === stringQuote) {
        stringQuote = null;
      }
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      stringQuote = ch;
      i += 1;
      continue;
    }
    if (ch === openChar) depth += 1;
    else if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return { text: code.slice(startIdx, i + 1), endIdx: i + 1 };
      }
    }
    i += 1;
  }
  return { text: code.slice(startIdx), endIdx: code.length };
}

/**
 * Extract class expression segments from `className=...`, `class=...`, `cn(...)`, `cva(...)`, and `clsx(...)`.
 */
function extractClassExpressions(code) {
  const results = [];
  const attrPattern = /\b(?:className|class)\s*=\s*(["'{`])|\b(?:cn|cva|clsx)\s*\(/g;
  let match;

  while ((match = attrPattern.exec(code)) !== null) {
    const full = match[0];
    const lastChar = full[full.length - 1];
    const startIdx = match.index + full.length - 1;

    if (lastChar === '{') {
      const balanced = readBalanced(code, startIdx, '{', '}');
      results.push(balanced.text);
      attrPattern.lastIndex = balanced.endIdx;
    } else if (lastChar === '(') {
      const balanced = readBalanced(code, startIdx, '(', ')');
      results.push(balanced.text);
      attrPattern.lastIndex = balanced.endIdx;
    } else {
      // Quoted or backtick string attribute value
      let i = startIdx + 1;
      while (i < code.length) {
        if (code[i] === '\\') {
          i += 2;
          continue;
        }
        if (code[i] === lastChar) {
          i += 1;
          break;
        }
        i += 1;
      }
      results.push(code.slice(startIdx, i));
      attrPattern.lastIndex = i;
    }
  }

  return results;
}

function findTagEnd(code, startIdx) {
  let i = startIdx;
  let braceDepth = 0;
  let stringQuote = null;

  while (i < code.length) {
    const ch = code[i];
    if (stringQuote) {
      if (ch === '\\' && i + 1 < code.length) {
        i += 2;
        continue;
      }
      if (ch === stringQuote) {
        stringQuote = null;
      }
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      stringQuote = ch;
      i += 1;
      continue;
    }
    if (ch === '{') {
      braceDepth += 1;
      i += 1;
      continue;
    }
    if (ch === '}') {
      if (braceDepth > 0) braceDepth -= 1;
      i += 1;
      continue;
    }
    if (ch === '>' && braceDepth === 0) {
      const prevNonSpace = code.slice(startIdx, i).trimEnd();
      return { endIdx: i + 1, selfClosing: prevNonSpace.endsWith('/') };
    }
    i += 1;
  }
  return { endIdx: code.length, selfClosing: false };
}

/**
 * Track <Card> open/close depth so sibling <Card> elements do not trigger false positives.
 * Ignores subcomponents like <Card.Header> and <CardHeader>.
 */
function hasNestedCard(code) {
  const tagPattern = /<\/?Card(?=\s|>|\/)/g;
  let depth = 0;
  let match;

  while ((match = tagPattern.exec(code)) !== null) {
    const isClose = match[0].startsWith('</');
    const tag = findTagEnd(code, match.index + match[0].length);
    tagPattern.lastIndex = tag.endIdx;

    if (isClose) {
      depth = Math.max(0, depth - 1);
    } else if (!tag.selfClosing) {
      depth += 1;
      if (depth > 1) return true;
    }
  }

  return false;
}

const SEMANTIC_TRIPLE_TINT_HUES =
  'primary|secondary|tertiary|error|warning|success|neutral';
const NUMERIC_TINT_RE = /^(bg|border|text)-([a-z]+)-\d{2,3}$/;
const SEMANTIC_BG_BORDER_RE = new RegExp(
  `^(bg|border)-(${SEMANTIC_TRIPLE_TINT_HUES})(?:-container)?$`
);
const SEMANTIC_TEXT_RE = new RegExp(`^text-(${SEMANTIC_TRIPLE_TINT_HUES})$`);

function extractStaticStrings(expr, out = []) {
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === "'" || ch === '"') {
      let j = i + 1;
      let val = '';
      while (j < expr.length) {
        if (expr[j] === '\\' && j + 1 < expr.length) {
          val += expr[j] + expr[j + 1];
          j += 2;
          continue;
        }
        if (expr[j] === ch) {
          j += 1;
          break;
        }
        val += expr[j];
        j += 1;
      }
      out.push(val);
      i = j;
      continue;
    }
    if (ch === '`') {
      let j = i + 1;
      let quasis = '';
      while (j < expr.length) {
        if (expr[j] === '\\' && j + 1 < expr.length) {
          quasis += expr[j] + expr[j + 1];
          j += 2;
          continue;
        }
        if (expr[j] === '$' && expr[j + 1] === '{') {
          const balanced = readBalanced(expr, j + 1, '{', '}');
          extractStaticStrings(balanced.text.slice(1, -1), out);
          quasis += ' ';
          j = balanced.endIdx;
          continue;
        }
        if (expr[j] === '`') {
          j += 1;
          break;
        }
        quasis += expr[j];
        j += 1;
      }
      out.push(quasis);
      i = j;
      continue;
    }
    i += 1;
  }
  return out;
}

function findTripleTintHueInClassString(staticStr) {
  const roleMap = new Map();
  for (const rawToken of staticStr.split(/\s+/)) {
    if (!rawToken) continue;
    let bracketDepth = 0;
    let lastColon = -1;
    for (let i = 0; i < rawToken.length; i++) {
      if (rawToken[i] === '[') bracketDepth += 1;
      else if (rawToken[i] === ']' && bracketDepth > 0) bracketDepth -= 1;
      else if (rawToken[i] === ':' && bracketDepth === 0) lastColon = i;
    }
    const variant = lastColon === -1 ? '' : rawToken.slice(0, lastColon);
    const base = (lastColon === -1 ? rawToken : rawToken.slice(lastColon + 1))
      .replace(/^!/, '')
      .replace(/\/\d+$/, '');

    let kind = null;
    let role = null;
    let hue = null;
    const numMatch = base.match(NUMERIC_TINT_RE);
    if (numMatch) {
      kind = 'num';
      role = numMatch[1];
      hue = numMatch[2];
    } else {
      const bgBorderMatch = base.match(SEMANTIC_BG_BORDER_RE);
      if (bgBorderMatch) {
        kind = 'sem';
        role = bgBorderMatch[1];
        hue = bgBorderMatch[2];
      } else {
        const textMatch = base.match(SEMANTIC_TEXT_RE);
        if (textMatch) {
          kind = 'sem';
          role = 'text';
          hue = textMatch[1];
        }
      }
    }

    if (!hue) continue;
    const key = `${variant}|${kind}|${hue}`;
    let roles = roleMap.get(key);
    if (!roles) {
      roles = new Set();
      roleMap.set(key, roles);
    }
    roles.add(role);
    if (roles.has('bg') && roles.has('border') && roles.has('text')) {
      return hue;
    }
  }
  return null;
}

function findTripleTintHue(classExpr) {
  for (const segment of extractStaticStrings(classExpr)) {
    const hue = findTripleTintHueInClassString(segment);
    if (hue) return hue;
  }
  return null;
}

function scan(content) {
  const violations = [];
  const stripped = stripComments(content);
  const classExpressions = extractClassExpressions(stripped);

  // 1. Radix imports — unambiguous, this project standardizes on Base UI.
  if (/from\s+['"]@radix-ui\//.test(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Radix import found (`@radix-ui/*`). This project\'s component foundation is Base UI (`@base-ui/react`) — see .agents/rules/component-library.md. Migrate this to Base UI, or state explicitly why Radix is required here.',
    });
  }

  // 2. Sparkle/magic icons for AI features.
  const sparkleTextRegex = />\s*(stars|auto_awesome|auto_fix_high)\s*</;
  const sparkleMaterialRegex = /material-symbols-outlined[^>]*>\s*(stars|auto_awesome|auto_fix_high)/;
  const sparklePropRegex =
    /(?:<Icon(?:\.\w+)?\b[^>]*\b(?:name|onName|offName|fromName|toName)|\b(?:icon|onName|offName|fromName|toName))\s*=\s*(?:\{\s*)?['"`](stars|auto_awesome|auto_fix_high)['"`]/;
  if (sparkleTextRegex.test(stripped) || sparkleMaterialRegex.test(stripped) || sparklePropRegex.test(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Found a "stars"/"auto_awesome"/"auto_fix_high" icon. Anti-patterns rule bans generic sparkle icons for AI/smart features — use a functional icon matching the specific action (e.g. translate, summarize, spellcheck, tune, filter, bolt).',
    });
  }

  // 3. All-caps styling on text (only inside CSS properties or class expressions).
  const hasCssUppercase = /text-transform\s*:\s*uppercase\b/.test(stripped);
  const hasClassUppercase = classExpressions.some((expr) => /(?:^|[\s:'"`])uppercase(?=$|[\s'"`])/.test(expr));
  if (hasCssUppercase || hasClassUppercase) {
    violations.push({
      severity: 'deny',
      message:
        'Found `uppercase` styling. Casing rule bans all-caps text on eyebrows/badges/labels/buttons/table headers (acronyms excepted) — confirm this isn\'t one of those, or remove it.',
    });
  }

  // 4. Emoji characters (excluding geometric/UI symbols such as check/cross/arrows).
  const emojiRegex = /\p{Extended_Pictographic}/u;
  if (emojiRegex.test(stripped)) {
    violations.push({
      severity: 'deny',
      message: 'Found an emoji character. Anti-patterns rule bans decorative emojis in UI copy.',
    });
  }

  // 5. Triple-tint monochrome chips/badges — order-independent per static class string.
  for (const expr of classExpressions) {
    const hue = findTripleTintHue(expr);
    if (hue) {
      violations.push({
        severity: 'deny',
        message: `Possible triple-tint monochrome pattern: "bg-${hue}*", "border-${hue}*", and "text-${hue}*" all share the same hue in one class expression. Anti-patterns rule requires a neutral fill (surface) or soft *-container + on-*-container + border-transparent — see .agents/rules/anti-patterns.md.`,
      });
      break;
    }
  }

  // 6. Hardcoded hex colors in color contexts outside token-definition files.
  const arbitraryHexColor = /\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\]/;
  const propertyHexColor =
    /(?:color|background(?:-?color)?|border(?:-?(?:top|right|bottom|left|inline|block))?(?:-?color)?|fill|stroke|outline(?:-?color)?|accent(?:-?color)?|caret(?:-?color)?|stop(?:-?color)?|box-?shadow|text-?shadow)\s*[:=]\s*(?:\{\s*)?['"`]?[^'"`\n;}]*#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/i;
  if (arbitraryHexColor.test(stripped) || propertyHexColor.test(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Found a hardcoded hex color. Design tokens rule requires using semantic CSS variables/Tailwind theme tokens instead of raw hex codes — confirm this value is defined in DESIGN.md/globals.css, or replace it with a token.',
    });
  }

  // 7. Lazy placeholder code stubs / truncation comments (scanned on raw content).
  if (/\/\/\s*(TODO:?\s*implement|\.\.\.\s*rest of|handle other cases|insert logic here)|\/\*\s*\.\.\.\s*\*\//i.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found placeholder / truncation comment (e.g. "// TODO: implement", "// ... rest of"). Anti-patterns rule requires fully complete code or explicit runtime error guards.',
    });
  }

  // 8. Type suppression escape hatches.
  if (/\bas\s+any\b|\bas\s+unknown\s+as\b/.test(stripped) || /(?:\/\/|\/\*)\s*@ts-ignore\b/.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found type suppression (`as any`, `@ts-ignore`, or `as unknown as`). Use proper discriminated unions, generic constraints, or runtime schema narrowing.',
    });
  }

  // 9. AI copywriting cliché buzzwords and inflated dev/enterprise jargon in UI text.
  const aiBuzzwords = /\b(delve|tapestry|unleash|elevate|spearhead|testament|enclave|telemetric|apparatus)\b/i;
  if (aiBuzzwords.test(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Found banned AI cliché or inflated vocabulary ("delve", "tapestry", "unleash", "elevate", "enclave", "telemetric", "apparatus", etc.). Write in plain, everyday English — call things what they are.',
    });
  }

  // 9b. Dev/database/CSS jargon or pompous nouns inside JSX text nodes or UI string props.
  const uiCopyJargon = /(?:>\s*[^<{]*?\b(committed to|unconstrained|hydrated|synchronized|telemetry|safety matrix|drill matrix|caseload repository|narrative storage)\b|(?:label|title|description|placeholder|heading)\s*=\s*["'][^"']*?\b(committed to|unconstrained|hydrated|synchronized|telemetry|matrix|repository|affordances)\b)/i;
  if (uiCopyJargon.test(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Found developer/database/CSS jargon or inflated nouns in user-facing UI copy (e.g. "committed to", "unconstrained", "synchronized", "telemetry", "matrix", "repository", "affordances"). Describe user outcomes in plain, everyday English (1–2 simple nouns).',
    });
  }

  // 10. Sunny Amber text/border on light backgrounds (violates WCAG AA contrast in DESIGN.md)
  const hasLightTertiary = classExpressions.some((expr) =>
    /(?:^|[\s'"`])(?:(?:[\w-]+|\[\S+\]):)*(?:text|border)-tertiary(?:\/\d+)?(?=$|[\s'"`])/g
      .test(expr) &&
    Array.from(
      expr.matchAll(/(?:^|[\s'"`])((?:(?:[\w-]+|\[\S+\]):)*(?:text|border)-tertiary(?:\/\d+)?)(?=$|[\s'"`])/g)
    ).some((m) => !/(?:^|:)(?:inverted|dark):|\[data-(?:surface|prominence)=["']?inverted["']?\]/.test(m[1]))
  );
  if (
    (hasLightTertiary || (/(?:\btext-tertiary\b|\bborder-tertiary\b)/.test(stripped) && classExpressions.length === 0)) &&
    !/prominence=["']inverted["']|data-surface=["']inverted["']|bg-(on-surface|neutral|gray-900|black)/.test(stripped)
  ) {
    violations.push({
      severity: 'deny',
      message:
        'Sunny Amber text/border (`text-tertiary`, `border-tertiary`) found. DESIGN.md bans tertiary amber text/borders on light surfaces (fails WCAG AA 1.99:1). Use tertiary only for solid fills with neutral text, container washes with neutral text, or inside inverted dark cards (`inverted:text-tertiary`).',
    });
  }

  // 11. Nested Card pattern (violates Surface Hierarchy in DESIGN.md)
  if (hasNestedCard(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Nested `<Card>` detected. DESIGN.md bans nesting Cards inside Cards to prevent visual clutter. Use unboxed layout, list dividers, or ClinicianTip lockups instead.',
    });
  }

  // 12. Blanket transition-all (violates Motion Law in DESIGN.md)
  const hasTransitionAllClass = classExpressions.some((expr) => /\btransition-all\b/.test(expr));
  const hasTransitionAllCss = /transition\s*:\s*all\b/.test(stripped);
  if (hasTransitionAllClass || hasTransitionAllCss) {
    violations.push({
      severity: 'deny',
      message:
        'Blanket `transition-all` found. DESIGN.md bans transition-all because it causes paint thrashing and layout recalculations. Always declare explicit targeted properties (e.g. `transition-[box-shadow,border-color,background-color,transform]`).',
    });
  }

  // 13. Bounce or spring easing on standard UI chrome (violates Motion Law in DESIGN.md)
  if (/\b(ease-bounce|ease-bounce-strong|ease-spring)\b|--ease-spring\b/.test(stripped) && !/SuccessCheck|confetti|celebrat/i.test(stripped)) {
    violations.push({
      severity: 'deny',
      message:
        'Bounce/spring easing (`ease-bounce`, `ease-bounce-strong`, `ease-spring`) found on standard UI chrome. DESIGN.md restricts spring/bounce easing strictly to celebratory milestone moments (e.g. SuccessCheck); standard UI chrome must use `--ease-standard`.',
    });
  }

  return violations;
}

function buildReason(violations) {
  const lines = violations.map((v) => `- ${v.message}`);
  return `Design & anti-pattern gate blocked this change:\n${lines.join('\n')}`;
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
