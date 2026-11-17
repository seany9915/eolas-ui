import { plugin as shadcn } from "@shadcn/lint";

/**
 * Lightweight local AST plugin for Eolas UI behavior & accessibility guardrails.
 */
const eolasBehaviorsPlugin = {
  rules: {
    "no-positive-tabindex": {
      meta: {
        type: "problem",
        docs: { description: "Disallow positive tabIndex values that break natural focus order and roving focus." },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name?.name !== "tabIndex" || !node.value) return;
            const raw =
              node.value.type === "Literal"
                ? Number(node.value.value)
                : node.value.type === "JSXExpressionContainer" && node.value.expression.type === "Literal"
                  ? Number(node.value.expression.value)
                  : NaN;
            if (!Number.isNaN(raw) && raw > 0) {
              context.report({
                node,
                message: "Avoid positive tabIndex (> 0). Use 0, -1 (roving focus), or natural DOM order.",
              });
            }
          },
        };
      },
    },
    "require-iscomposing-on-enter": {
      meta: {
        type: "problem",
        docs: { description: "Require isComposing guard in text-input Enter key handlers so IME/dictation does not prematurely submit." },
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        return {
          JSXAttribute(node) {
            if (node.name?.name !== "onKeyDown" || !node.value?.expression) return;
            const text = sourceCode.getText(node.value.expression);
            const checksEnter = /\.key\s*===\s*['"]Enter['"]/.test(text);
            const checksSpace = /\.key\s*===\s*['"]\s['"]/.test(text);
            const checksComposing = /isComposing/.test(text);
            if (checksEnter && !checksSpace && !checksComposing) {
              context.report({
                node,
                message:
                  "Enter key handler in onKeyDown must guard against IME composition (e.g. !e.nativeEvent.isComposing).",
              });
            }
          },
        };
      },
    },
    "no-static-clickable-elements": {
      meta: {
        type: "problem",
        docs: { description: "Require role and keyboard handler when attaching onClick to div, span, or li outside primitives." },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const tagName = node.name?.name;
            if (tagName !== "div" && tagName !== "span" && tagName !== "li") return;
            const attrs = node.attributes || [];
            const hasOnClick = attrs.some((a) => a.type === "JSXAttribute" && a.name?.name === "onClick");
            if (!hasOnClick) return;
            const hasRole = attrs.some((a) => a.type === "JSXAttribute" && a.name?.name === "role");
            const hasKeyHandler = attrs.some(
              (a) => a.type === "JSXAttribute" && (a.name?.name === "onKeyDown" || a.name?.name === "onKeyUp"),
            );
            if (!hasRole || !hasKeyHandler) {
              context.report({
                node,
                message: `Clickable <${tagName}> must use <Button> / a Base UI primitive, or include both role and onKeyDown.`,
              });
            }
          },
        };
      },
    },
  },
};

/**
 * Pre-configured @shadcn/lint configuration preset for Eolas UI.
 * Enforces semantic token usage and Base UI component contracts for AI coding agents and human developers.
 */
export const eolasLintPreset = [
  {
    plugins: {
      shadcn,
      eolas: eolasBehaviorsPlugin,
    },
    rules: {
      "eolas/no-positive-tabindex": "error",
      "eolas/require-iscomposing-on-enter": "error",
      "eolas/no-static-clickable-elements": "error",
      // 1. Strict semantic tokens: scan all strings to catch palette colors in helper functions/objects
      "shadcn/no-raw-colors": [
        "error",
        {
          scanAllStrings: true,
        },
      ],

      // 2. Strict spacing scale: forbid arbitrary bracket values (p-[13px]) across all strings
      "shadcn/no-arbitrary-values": [
        "error",
        {
          scanAllStrings: true,
        },
      ],

      // 3. Forbid inline styles
      "shadcn/no-inline-styles": [
        "error",
        {
          message:
            "Inline styles are forbidden. Use Tailwind classes with Eolas design tokens.",
        },
      ],

      // 4. Validate Tailwind v4 classes against installed theme
      "shadcn/no-unknown-classes": "error",

      // 5. Require statically analyzable classes
      "shadcn/require-static-classes": "error",

      // 6. Forbid direct HTML interactive elements outside primitive libraries
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='button']",
          message:
            "Direct <button> usage is prohibited outside primitives. Use <Button> from @/components/ui/button.",
        },
        {
          selector: "JSXOpeningElement[name.name='input']",
          message:
            "Direct <input> usage is prohibited outside primitives. Use <Input> from @/components/ui/input.",
        },
        {
          selector: "JSXOpeningElement[name.name='select']",
          message:
            "Direct <select> usage is prohibited outside primitives. Use <Select> from @/components/ui/select.",
        },
        {
          selector: "JSXOpeningElement[name.name='textarea']",
          message:
            "Direct <textarea> usage is prohibited outside primitives. Use <Textarea> from @/components/ui/textarea.",
        },
        {
          selector: "JSXOpeningElement[name.name='dialog']",
          message:
            "Direct <dialog> usage is prohibited outside primitives. Use <Dialog> from @/components/ui/dialog.",
        },
        {
          selector: "ImportDeclaration[source.value=/^@radix-ui\\//]",
          message:
            "Radix UI (@radix-ui/*) is prohibited. Use Base UI primitives from @/components/ui/.",
        },
      ],

      // 7. Restyle contracts tailored to Eolas UI Base UI primitives
      "shadcn/no-restyle": [
        "error",
        {
          allow: ["layout"],
          contracts: [
            {
              pattern: "^Button$",
              allow: ["w-full", "mt-*", "mb-*", "mx-*", "my-*", "shrink-*", "self-*", "whitespace-nowrap"],
              deny: [
                "p-*",
                "px-*",
                "py-*",
                "h-*",
                "min-h-*",
                "bg-*",
                "text-*",
                "rounded-*",
                "border-*",
                "uppercase",
                "outline-offset-0",
                "transition-all",
              ],
              message: {
                spacing:
                  "Button controls its own padding and touch floors (44px min). Use size='sm'|'md'|'lg'|'icon', or apply margin/parent gap.",
                color:
                  "Button controls its own colors to guarantee WCAG AA contrast. Use variant='filled'|'soft'|'outline'|'text' and colorRole='primary'|'secondary'|'tertiary'|'error'|'warning'|'success'|'neutral'.",
                shape:
                  "Button enforces standard design-system border radius. Do not override rounded-*.",
                typography:
                  "All-caps styling (uppercase) is strictly banned on buttons per DESIGN.md.",
                motion:
                  "Blanket transition-all is banned. Button manages its own targeted transitions.",
              },
            },
            {
              pattern: "^(Badge|Chip)$",
              allow: ["layout"],
              deny: ["bg-*", "text-*", "border-*", "rounded-*", "uppercase"],
              message: {
                default:
                  "Badge/Chip enforces high-contrast clinical status rules. Use variant='filled'|'soft'|'outline' and colorRole='primary'|'secondary'|'tertiary'|'error'|'warning'|'success'|'neutral'. Do not apply ad-hoc background/border color overrides (triple-tint anti-pattern).",
                typography:
                  "All-caps styling (uppercase) is strictly banned on chips/badges per DESIGN.md.",
              },
            },
            {
              pattern: "^Card$",
              allow: ["layout", "w-*", "max-w-*"],
              deny: ["bg-*", "rounded-*", "border-*", "shadow-*", "transition-all"],
              message:
                "Card defines clinical elevation and containment. Use CardHeader, CardContent, and CardFooter. Never nest cards inside cards, and never use transition-all (use explicit targeted transitions).",
            },
            {
              pattern: "^InlineAlert$",
              allow: ["layout", "w-*"],
              deny: ["rounded-*"],
              message:
                "InlineAlert must maintain standard rectangular shape with solid 4px accent bar. Do not apply rounded-*.",
            },
            {
              pattern: "^Toast$",
              allow: ["layout", "w-*"],
              deny: ["rounded-*"],
              message:
                "Toast must maintain standard flat rectangular shape (rounded-none) and 44x44px dismiss button. Do not apply rounded-*.",
            },
            {
              pattern: "^(Tabs|TabsList|TabsTrigger|Tabs\\.List|Tabs\\.Trigger)$",
              allow: ["layout", "w-*"],
              deny: ["bg-*", "uppercase"],
              message:
                "Tabs manage their own selection wash and active borders. Do not override backgrounds or apply uppercase styling.",
            },
            {
              pattern: "^(Input|Field|Textarea)$",
              allow: ["layout", "w-*"],
              deny: ["h-*", "min-h-*"],
              message:
                "Inputs own their touch floors (44px/48px standard). Do not override height dimensions directly.",
            },
            {
              pattern: "^(Dialog|AlertDialog|Drawer|Sheet|Dialog\\.Popup|AlertDialog\\.Popup|Drawer\\.Popup|Sheet\\.Popup)$",
              allow: ["layout"],
              deny: ["bg-*", "rounded-*"],
              message:
                "Modal overlays must maintain standard surface styling, focus traps, and backdrop filters defined by Eolas UI.",
            },
            {
              pattern: "^(Skeleton|SkeletonReveal|Skeleton\\.Reveal)$",
              allow: ["layout", "shape"],
              message:
                "Skeleton loaders support layout dimensions (w-*, h-*) and shapes (rounded, rounded-full) to mirror target components.",
            },
            {
              pattern: "^(TextSwap|NotificationBadge|TextsReveal|NumberRoll|NumberPopIn|SpinningCounter|ShimmerText|ErrorShake|SuccessCheck)$",
              allow: ["layout"],
              message:
                "Shared motion primitives manage their own transitions and reduced-motion fallbacks per DESIGN.md.",
            },
            {
              pattern: "^(CardContent|Card\\.Content)$",
              allow: ["layout", "spacing"],
              message:
                "CardContent permits internal spacing adjustments (e.g. p-0 for full-bleed media or custom padding).",
            },
            {
              pattern: "^(TableCell|TableHead|Table\\.Cell|Table\\.Head)$",
              allow: ["layout", "typography"],
              deny: ["uppercase"],
              message:
                "Table cells permit text alignment (text-right, text-center) and tabular numbers. All-caps styling (uppercase) is prohibited.",
            },
          ],
        },
      ],
    },
  },
  // Allow internal primitive and block files inside ui/, blocks/, and showcase/playground testbeds to define their own styles, floors, spacing, and native elements
  {
    files: [
      "**/components/ui/**",
      "**/src/components/ui/**",
      "**/components/blocks/**",
      "**/src/components/blocks/**",
      "**/playground/**",
      "**/showcase/**",
      "**/*Showcase*/**",
      "**/*Showcase.tsx",
    ],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/no-inline-styles": "off",
      "shadcn/require-static-classes": "off",
      "shadcn/no-raw-colors": ["error", { scanAllStrings: false }],
      "no-restricted-syntax": "off",
      "eolas/no-static-clickable-elements": "off",
    },
  },
];

export default eolasLintPreset;
