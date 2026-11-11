#!/usr/bin/env node
/**
 * Antigravity PreInvocation hook:
 * Proactively injects a concise, high-signal design contract reminder into the agent's
 * context window before the model begins reasoning on each turn.
 *
 * Uses `ephemeralMessage` so it never bloats the permanent conversation transcript.
 */

const REMINDER_TEXT = `[CORE CONTRACT & DESIGN SYSTEM ANCHORS]
• Headless Foundation: Base UI (@base-ui/react) only. Search src/components/ui/ before authoring any interactive element — reuse or extend existing primitives; never hand-roll duplicates.
• Tokens & Typography: Never hardcode hex codes. Use semantic Tailwind tokens from DESIGN.md. Headlines: Atkinson Hyperlegible Next (font-heading). Body: Lexend (font-sans, min 1rem floor for body copy).
• Accessibility & Contrast: No triple-tint monochrome chips. No uppercase styling. No generic sparkle icons or decorative emojis. Never use Sunny Amber (text-tertiary) on light surfaces (fails WCAG AA). Never nest <Card> inside <Card>.
• Focus vs Selection: Floating 2px focus ring (outline-offset: 2px) for keyboard navigation; flush 2px border + surface wash for active selection.
• Motion & Polish: Never use transition-all on containers. Strictly respect the 5-item stagger cap (max 200ms). Enforce mandatory prefers-reduced-motion.
• Plain-English UI Copy: Call things what they are ("Saved", "Patients", "Notes", "Preview: Full width"). Keep labels to 1–2 simple nouns and describe user outcomes — never expose dev, database, or CSS terms (committed, synchronized, unconstrained, affordance, telemetry, matrix, repository).`;

const payload = {
  injectSteps: [
    {
      ephemeralMessage: REMINDER_TEXT,
    },
  ],
};

process.stdout.write(JSON.stringify(payload));
