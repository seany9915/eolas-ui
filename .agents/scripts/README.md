# Enforcement hook scripts

These are [Antigravity `PreToolUse` hooks](https://antigravity.google/docs/hooks) wired up in `.agents/hooks.json`. They exist because prompting alone ("never do X") is not reliable enforcement for a fast-moving model — these scripts give a real technical backstop that runs before a file is written, independent of whether the model remembered the rule that turn.

## What each script does

- **`pre-invocation-reminder.mjs`** — runs as a `SessionStart` hook when a session starts, injecting a concise `systemMessage` with the core contract anchors (Base UI, primitive check first, DESIGN.md tokens, contrast rules, focus vs selection).
- **`check-anti-patterns.mjs`** — scans the code about to be written for patterns banned in [`../rules/anti-patterns.md`](../rules/anti-patterns.md) and [`../../DESIGN.md`](../../DESIGN.md): Radix imports, triple-tint monochrome chips, all-caps styling, sparkle/magic icons, emojis, hardcoded hex colors, TODO stubs, type suppressions (`as any`), AI cliché buzzwords, Sunny Amber text on light surfaces, and nested Cards. All violations trigger an immediate `deny` so the agent is blocked and forced to self-correct even when folder write permissions are enabled.
- **`check-primitive-inventory.mjs`** — fires when a brand-new `.tsx`/`.jsx` file is created under a `components`/`ui`/`primitives`-looking path outside the shared primitive (`src/components/ui`), composite block (`src/components/blocks`), or playground/demo directories. It prompts for confirmation (`force_ask`) and returns the inventory of existing primitives, enforcing the primitive-check-first rule from [`../rules/component-library.md`](../rules/component-library.md).
- **`check-secrets.mjs`** — scans code about to be written for production API keys, private keys, and credential tokens, returning `deny` on confirmed key formats and `force_ask` on generic high-entropy credential assignments.

## Antigravity Decision Model ("deny" vs "ask")

In Antigravity's permission model:
- `decision: "ask"` only prompts when permissions are unset; once write permissions are enabled or cached ("Always allow"), `"ask"` is silently satisfied and skipped.
- `decision: "deny"` halts tool execution unconditionally and feeds the `reason` back into the agent context as an error, ensuring the agent corrects itself without human intervention.
- `decision: "force_ask"` prompts the user every time, ignoring cached permissions.

These scripts use `deny` for technical enforcement so the agent cannot bypass rules even when write permissions are pre-approved.

## Configuration you likely need to change

1. **`PRIMITIVE_DIR_CANDIDATES`** in `check-primitive-inventory.mjs` — matches where your project keeps shared primitives (`src/components/ui` by default).
2. **Node on `PATH`** — `hooks.json` invokes `node ./scripts/...`. Assumes `node` is available in `PATH`.

## Testing a hook manually

You can pipe a sample payload into either script directly to see its output without going through Antigravity:

```powershell
'{"toolCall":{"name":"write_file","args":{"Path":"src/components/Badge.tsx","Content":"import { X } from \"@radix-ui/react-dialog\";"}},"workspacePaths":["C:/path/to/repo"]}' | node .agents/scripts/check-anti-patterns.mjs
```
