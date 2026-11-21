#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: scans code and config about to be written
 * for hardcoded secrets, private keys, and high-entropy API tokens BEFORE
 * the file is written.
 *
 * Hard-blocks (decision: "deny") live production API keys and private keys.
 * Surfaces ambiguous matches as "force_ask".
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
    process.stderr.write(`[check-secrets] Hook error: ${err?.message || err}\n`);
    respond({
      decision: 'force_ask',
      reason: 'Secret-scanning hook encountered an unexpected error and could not verify this write. Review for secrets before proceeding.',
    });
  }
});

function main(input) {
  const toolCall = input.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.Path || args.path || args.TargetFile || args.FilePath || args.filePath || '';

  // Exclude example files and lockfiles from strict secret checks
  if (/\.env\.example$|package-lock\.json$|yarn\.lock$|pnpm-lock\.yaml$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const content = extractContent(toolCall.name, args);
  if (!content) {
    return respond({ decision: 'allow' });
  }

  const isMarkdown = /\.md$/i.test(targetFile);
  const violations = scanForSecrets(content, { isMarkdown });
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

function scanForSecrets(content, { isMarkdown = false } = {}) {
  const violations = [];

  // Ignore only unambiguous placeholder templates — never bare substrings like "test" inside random key entropy.
  const isExplicitPlaceholder = (str) =>
    /(.)\1{5,}/.test(str) ||
    /<[^>]+>/.test(str) ||
    /(?:^|[_-])(?:mock|dummy|example|placeholder|changeme|fake|sample|replace[_-]?me|your[_-]?api|your[_-]?key|your[_-]?token|your[_-]?pass(?:word)?)(?:[_-]|$)/i.test(str) ||
    /(?:^|[^a-zA-Z0-9])(?:test|mock|dummy|fake|example)[_-](?:key|token|secret|password)(?:$|[^a-zA-Z0-9])/i.test(str);

  const DB_PLACEHOLDER_PW_RE =
    /^(?:password|passwd|secret|changeme|example|placeholder|your[_-]?pass(?:word)?|postgres|mysql|redis|mongo|admin|root|test|demo|local|dev|xxx+)$/i;

  const isPlausibleGenericSecret = (val) =>
    !val.includes('${') &&
    !/^[a-z]+(?:-[a-z]+)+$/.test(val) &&
    !/^[a-z]+(?:_[a-z]+)+$/.test(val) &&
    !/^[a-z]+(?:\.[a-z]+)+$/.test(val) &&
    !/^(?:https?:\/\/|\/)/i.test(val) &&
    (/[0-9]/.test(val) || (/[A-Z]/.test(val) && /[a-z]/.test(val)));

  const findLiveMatch = (globalRegex, groupIdx = 0, extraFilter = null) => {
    for (const match of content.matchAll(globalRegex)) {
      const candidate = match[groupIdx] ?? match[0];
      if (!candidate) continue;
      if (extraFilter && !extraFilter(candidate, match)) continue;
      if (!isExplicitPlaceholder(candidate)) return match;
    }
    return null;
  };

  // 1. Google / Firebase / Gemini API Key
  if (findLiveMatch(/AIza[0-9A-Za-z-_]{35}/g)) {
    violations.push({
      severity: 'deny',
      message:
        'Detected hardcoded Google/Firebase/Gemini API Key (starts with "AIza..."). Move this secret to environment variables (.env.local) or use secret manager.',
    });
  }

  // 2. OpenAI / Anthropic / Model API Key (anchored to avoid kebab-case false positives like "task-...")
  if (
    findLiveMatch(
      /(?:^|[^a-zA-Z0-9_-])(sk-(?:proj-|ant-|live-|svcacct-)[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{32,})(?=$|[^a-zA-Z0-9_-])/g,
      1,
      (val) => /[A-Z0-9]/.test(val.slice(3))
    )
  ) {
    violations.push({
      severity: 'deny',
      message:
        'Detected hardcoded API Secret Key (starts with "sk-..."). Never commit live API tokens into source code.',
    });
  }

  // 3. GitHub Personal Access / OAuth / User-to-Server / App Tokens
  if (findLiveMatch(/(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g)) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded GitHub Token. Revoke and move to secure secret storage.',
    });
  }

  // 4. AWS Access Key ID
  if (findLiveMatch(/\bAKIA[0-9A-Z]{16}\b/g)) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded AWS Access Key ID. Use IAM roles or environment variables.',
    });
  }

  // 5. Private Keys (RSA / DSA / EC / OPENSSH / ENCRYPTED / PGP)
  if (/-----BEGIN (?:(?:RSA|EC|OPENSSH|DSA|ENCRYPTED|PGP) )?PRIVATE KEY(?: BLOCK)?-----/.test(content)) {
    violations.push({
      severity: 'deny',
      message: 'Detected Private Key block. Private keys must never be written to application files.',
    });
  }

  // 6. Slack API Tokens (including multi-segment xox* and xapp tokens)
  if (findLiveMatch(/\bxox[baprs]-[0-9a-zA-Z-]{10,}\b|\bxapp-\d-[A-Za-z0-9-]{10,}\b/g)) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded Slack Token.',
    });
  }

  // 7. Stripe Live Secret / Restricted Keys
  if (findLiveMatch(/\b[sr]k_live_[0-9a-zA-Z]{24,}\b/g)) {
    violations.push({
      severity: 'deny',
      message: 'Detected Stripe Live Secret Key. Live billing credentials must remain server-side in secure environment variables.',
    });
  }

  // 8. Signed 3-segment JSON Web Tokens (JWT)
  if (findLiveMatch(/\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g)) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded JWT token literal. Never commit signed bearer tokens into source files.',
    });
  }

  // 9. Database connection URIs with embedded non-placeholder passwords
  if (
    findLiveMatch(
      /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|rediss):\/\/[^:\s/'"]+:([^@\s/'"]{8,})@/gi,
      1,
      (val) => !val.includes('${') && !DB_PLACEHOLDER_PW_RE.test(val)
    )
  ) {
    violations.push({
      severity: 'deny',
      message: 'Detected database connection URI with an embedded password. Move credentials to environment variables.',
    });
  }

  // 10. Generic hardcoded high-entropy credentials in JS/TS/JSON or unquoted .env (skipped in Markdown docs)
  if (!isMarkdown) {
    const genericSecretAssignment =
      findLiveMatch(
        /(?:["']?)(api_key|apiKey|secret_key|secretKey|auth_token|authToken|access_token|accessToken|private_key|privateKey|password)(?:["']?)\s*[:=]\s*(["'`])([^\s"'`\\]{32,})\2/gi,
        3,
        isPlausibleGenericSecret
      ) ||
      findLiveMatch(
        /^[ \t]*(?:export[ \t]+)?([A-Z0-9_]*(?:API_KEY|SECRET_KEY|AUTH_TOKEN|ACCESS_TOKEN|PRIVATE_KEY|PASSWORD))[ \t]*=[ \t]*([^\s#]{32,})[ \t]*(?:#.*)?$/gm,
        2,
        isPlausibleGenericSecret
      );

    if (genericSecretAssignment) {
      const matchedKeyName = genericSecretAssignment[1];
      violations.push({
        severity: 'force_ask',
        message: `Detected potential hardcoded credential assignment for "${matchedKeyName}". Confirm if this is a test dummy or real secret before writing.`,
      });
    }
  }

  return violations;
}

function buildReason(violations) {
  const lines = violations.map((v) => `- ${v.message}`);
  return `Secret-scanning gate blocked this change:\n${lines.join('\n')}`;
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}
