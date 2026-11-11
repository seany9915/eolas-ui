#!/usr/bin/env node
/**
 * Antigravity PreToolUse hook: scans code and config about to be written
 * for hardcoded secrets, private keys, and high-entropy API tokens BEFORE
 * the file is written.
 *
 * Hard-blocks (decision: "deny") live production API keys and private keys.
 * Surfaces ambiguous matches as "ask".
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
    // Fail open if the hook itself errors so it doesn't block legitimate operations
    respond({ decision: 'allow' });
  }
});

function main(input) {
  const toolCall = input.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.TargetFile || args.FilePath || '';

  // Exclude example files, documentation, and lockfiles from strict secret checks
  if (/\.env\.example$|\.md$|package-lock\.json$|yarn\.lock$|pnpm-lock\.yaml$/i.test(targetFile)) {
    return respond({ decision: 'allow' });
  }

  const content = extractContent(toolCall.name, args);
  if (!content) {
    return respond({ decision: 'allow' });
  }

  const violations = scanForSecrets(content);
  if (violations.length > 0) {
    return respond({ decision: 'deny', reason: buildReason(violations) });
  }
  return respond({ decision: 'allow' });
}

function extractContent(toolName, args) {
  if (toolName === 'write_to_file') return args.CodeContent || args.content || '';
  if (toolName === 'replace_file_content') return args.ReplacementContent || args.newString || '';
  if (toolName === 'multi_replace_file_content') {
    const chunks = args.ReplacementChunks || [];
    return chunks.map((c) => c.ReplacementContent || '').join('\n');
  }
  return '';
}

function scanForSecrets(content) {
  const violations = [];

  // Ignore obvious placeholders / mock templates
  const isMock = (str) =>
    /test|mock|dummy|example|placeholder|changeme|xxxx|<your|your[-_]api/i.test(str);

  // 1. Google / Firebase / Gemini API Key
  const googleKeyMatch = content.match(/AIza[0-9A-Za-z-_]{35}/);
  if (googleKeyMatch && !isMock(googleKeyMatch[0])) {
    violations.push({
      severity: 'deny',
      message:
        'Detected hardcoded Google/Firebase/Gemini API Key (starts with "AIza..."). Move this secret to environment variables (.env.local) or use secret manager.',
    });
  }

  // 2. OpenAI / Model API Key
  const openAiMatch = content.match(/sk-(?:proj-|live-)?[a-zA-Z0-9_-]{24,}/);
  if (openAiMatch && !isMock(openAiMatch[0])) {
    violations.push({
      severity: 'deny',
      message:
        'Detected hardcoded API Secret Key (starts with "sk-..."). Never commit live API tokens into source code.',
    });
  }

  // 3. GitHub Personal Access / OAuth / App Tokens
  const githubMatch = content.match(/(?:ghp|gho|ghs|ghr)_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/);
  if (githubMatch && !isMock(githubMatch[0])) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded GitHub Token. Revoke and move to secure secret storage.',
    });
  }

  // 4. AWS Access Key ID
  const awsMatch = content.match(/\bAKIA[0-9A-Z]{16}\b/);
  if (awsMatch && !isMock(awsMatch[0])) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded AWS Access Key ID. Use IAM roles or environment variables.',
    });
  }

  // 5. Private Keys (RSA / DSA / EC / OPENSSH / PGP)
  if (/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/.test(content)) {
    violations.push({
      severity: 'deny',
      message: 'Detected Private Key block. Private keys must never be written to application files.',
    });
  }

  // 6. Slack API Tokens
  const slackMatch = content.match(/xox[baprs]-[0-9a-zA-Z]{10,48}/);
  if (slackMatch && !isMock(slackMatch[0])) {
    violations.push({
      severity: 'deny',
      message: 'Detected hardcoded Slack Token.',
    });
  }

  // 7. Stripe Live Secret Key
  const stripeMatch = content.match(/sk_live_[0-9a-zA-Z]{24}/);
  if (stripeMatch && !isMock(stripeMatch[0])) {
    violations.push({
      severity: 'deny',
      message: 'Detected Stripe Live Secret Key. Live billing credentials must remain server-side in secure environment variables.',
    });
  }

  // 8. Generic hardcoded high-entropy credentials assigned to variables
  const genericSecretAssignment = content.match(
    /(?:api_key|apiKey|secret_key|secretKey|auth_token|authToken|password)\s*[:=]\s*["']([A-Za-z0-9+/=_-]{32,})["']/i
  );
  if (genericSecretAssignment && !isMock(genericSecretAssignment[1])) {
    violations.push({
      severity: 'ask',
      message: `Detected potential hardcoded credential assignment for "${genericSecretAssignment[0].slice(0, 20)}...". Confirm if this is a test dummy or real secret before writing.`,
    });
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
