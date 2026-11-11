#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: scans code about to be written for the
 * anti-patterns banned in .agents/rules/anti-patterns.md, BEFORE the file
 * is written. Blocks (deny) only the most unambiguous violation (Radix
 * imports); everything else surfaces as "ask" so a human/agent can confirm
 * it's a false positive rather than getting silently blocked.
 *
 * This is a heuristic regex scan, not a full parser — tune the patterns
 * below for your project's conventions if you get too many false positives.
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
  const targetFile = args.TargetFile || '';

  // Only scan UI-relevant files.
  if (!/\.(tsx|jsx|css|ts|js)$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }
  // Don't scan the files where real hex codes / raw CSS values are meant to live or rule messages are defined.
  if (/globals\.css$|design\.md$|tailwind\.config\.(js|ts|cjs|mjs)$|eslint\.config\.(js|ts|cjs|mjs)$|[\\/]lint[\\/]index\.js$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const content = extractContent(toolCall.name, args);
  if (!content) {
    return respond({ decision: 'allow' });
  }

  const violations = scan(content);
  if (violations.length > 0) {
    return respond({ decision: 'deny', reason: buildReason(violations) });
  }
  return respond({ decision: 'allow' });
}

function extractContent(toolName, args) {
  if (toolName === 'write_to_file') return args.CodeContent || '';
  if (toolName === 'replace_file_content') return args.ReplacementContent || '';
  if (toolName === 'multi_replace_file_content') {
    const chunks = args.ReplacementChunks || [];
    return chunks.map((c) => c.ReplacementContent || '').join('\n');
  }
  return '';
}

function scan(content) {
  const violations = [];

  // 1. Radix imports — unambiguous, this project standardizes on Base UI.
  if (/from\s+['"]@radix-ui\//.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Radix import found (`@radix-ui/*`). This project\'s component foundation is Base UI (`@base-ui/react`) — see .agents/rules/component-library.md. Migrate this to Base UI, or state explicitly why Radix is required here.',
    });
  }

  // 2. Sparkle/magic icons for AI features.
  if (/>(\s*)(stars|auto_awesome)(\s*)</.test(content) || /material-symbols-outlined[^>]*>\s*(stars|auto_awesome)/.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found a "stars"/"auto_awesome" icon. Anti-patterns rule bans generic sparkle icons for AI/smart features — use a functional icon matching the specific action (e.g. translate, summarize, spellcheck, tune, filter, bolt).',
    });
  }

  // 3. All-caps styling on text.
  if (/text-transform:\s*uppercase/.test(content) || /\buppercase\b/.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found `uppercase` styling. Casing rule bans all-caps text on eyebrows/badges/labels/buttons/table headers (acronyms excepted) — confirm this isn\'t one of those, or remove it.',
    });
  }

  // 4. Emoji characters.
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  if (emojiRegex.test(content)) {
    violations.push({
      severity: 'deny',
      message: 'Found an emoji character. Anti-patterns rule bans decorative emojis in UI copy.',
    });
  }

  // 5. Triple-tint monochrome chips/badges — same color word in bg-/border-/text- utilities
  //    within the same className value.
  const classNameMatches = content.match(/className\s*=\s*(\{`[^`]*`\}|"[^"]*"|'[^']*'|\{[^}]*\})/g) || [];
  for (const raw of classNameMatches) {
    const tripleTint = /bg-(\w+)-(\d{2,3})(?=[^"'`}]*\bborder-\1-(\d{2,3})\b)(?=[^"'`}]*\btext-\1-(\d{2,3})\b)/;
    const match = raw.match(tripleTint);
    if (match) {
      violations.push({
        severity: 'deny',
        message: `Possible triple-tint monochrome pattern: "bg-${match[1]}-*", "border-${match[1]}-*", and "text-${match[1]}-*" all share the same hue in one className. Anti-patterns rule requires the fill to be genuinely neutral (surface/white) when the border and text share a brand hue — see .agents/rules/anti-patterns.md.`,
      });
      break; // one report is enough context for the agent to re-check the whole file
    }
  }

  // 6. Hardcoded hex colors outside token-definition files.
  if (/#[0-9a-fA-F]{3,8}\b/.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found a hardcoded hex color. Design tokens rule requires using semantic CSS variables/Tailwind theme tokens instead of raw hex codes — confirm this value is defined in DESIGN.md/globals.css, or replace it with a token.',
    });
  }

  // 7. Lazy placeholder code stubs / truncation comments.
  if (/\/\/\s*(TODO:?\s*implement|\.\.\.\s*rest of|handle other cases|insert logic here)|\/\*\s*\.\.\.\s*\*\//i.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found placeholder / truncation comment (e.g. "// TODO: implement", "// ... rest of"). Anti-patterns rule requires fully complete code or explicit runtime error guards.',
    });
  }

  // 8. Type suppression escape hatches.
  if (/\bas\s+any\b|\b@ts-ignore\b|\bas\s+unknown\s+as\b/.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found type suppression (`as any`, `@ts-ignore`, or `as unknown as`). Use proper discriminated unions, generic constraints, or runtime schema narrowing.',
    });
  }

  // 9. AI copywriting cliché buzzwords and inflated dev/enterprise jargon in UI text.
  const aiBuzzwords = /\b(delve|tapestry|unleash|elevate|spearhead|testament|enclave|telemetric|apparatus)\b/i;
  if (aiBuzzwords.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found banned AI cliché or inflated vocabulary ("delve", "tapestry", "unleash", "elevate", "enclave", "telemetric", "apparatus", etc.). Write in plain, everyday English — call things what they are.',
    });
  }

  // 9b. Dev/database/CSS jargon or pompous nouns inside JSX text nodes or UI string props.
  const uiCopyJargon = /(?:>\s*[^<{]*?\b(committed to|unconstrained|hydrated|synchronized|telemetry|safety matrix|drill matrix|caseload repository|narrative storage)\b|(?:label|title|description|placeholder|heading)\s*=\s*["'][^"']*?\b(committed to|unconstrained|hydrated|synchronized|telemetry|matrix|repository|affordances)\b)/i;
  if (uiCopyJargon.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Found developer/database/CSS jargon or inflated nouns in user-facing UI copy (e.g. "committed to", "unconstrained", "synchronized", "telemetry", "matrix", "repository", "affordances"). Describe user outcomes in plain, everyday English (1–2 simple nouns).',
    });
  }

  // 10. Sunny Amber text/border on light backgrounds (violates WCAG AA contrast in DESIGN.md)
  if (/\btext-tertiary\b|\bborder-tertiary\b/.test(content) && !/prominence=["']inverted["']|bg-(on-surface|neutral|gray-900|black)/.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Sunny Amber text/border (`text-tertiary`, `border-tertiary`) found. DESIGN.md bans tertiary amber text/borders on light surfaces (fails WCAG AA 1.99:1). Use tertiary only for solid fills with neutral text, container washes with neutral text, or inside inverted dark cards.',
    });
  }

  // 11. Nested Card pattern (violates Surface Hierarchy in DESIGN.md)
  if (/<Card\b[^>]*>[\s\S]*?<Card\b/i.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Nested `<Card>` detected. DESIGN.md bans nesting Cards inside Cards to prevent visual clutter. Use unboxed layout, list dividers, or ClinicianTip lockups instead.',
    });
  }

  // 12. Blanket transition-all on container components (violates Motion Law in DESIGN.md)
  if (/<(Card|Dialog|Drawer|Dropdown|Popover)\b[^>]*\btransition-all\b/i.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Blanket `transition-all` found on container/card component. DESIGN.md bans transition-all because it causes paint thrashing and layout recalculations. Always declare explicit targeted properties (e.g. `transition-[box-shadow,border-color,background-color,transform]`).',
    });
  }

  // 13. Bounce or spring easing on standard UI chrome (violates Motion Law in DESIGN.md)
  if (/\b(ease-bounce|ease-bounce-strong)\b/.test(content) && !/SuccessCheck|confetti|celebrat/i.test(content)) {
    violations.push({
      severity: 'deny',
      message:
        'Bounce/spring easing (`ease-bounce`, `ease-bounce-strong`) found on standard UI chrome. DESIGN.md restricts spring/bounce easing strictly to celebratory milestone moments (e.g. SuccessCheck); standard UI chrome must use `--ease-standard`.',
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
