const RAW_HTML_CONTROL_MESSAGES = {
  button: "Direct <button> usage is prohibited outside primitives. Use <Button> from @/components/ui/button.",
  input: "Direct <input> usage is prohibited outside primitives. Use <Input> from @/components/ui/input.",
  select: "Direct <select> usage is prohibited outside primitives. Use <Select> from @/components/ui/select.",
  textarea: "Direct <textarea> usage is prohibited outside primitives. Use <Textarea> from @/components/ui/textarea.",
  dialog: "Direct <dialog> usage is prohibited outside primitives. Use <Dialog> from @/components/ui/dialog.",
};

/**
 * Oxlint JS plugin for Eolas UI behavior, accessibility, and Base UI primitive guardrails.
 */
export const plugin = {
  meta: {
    name: "eolas",
  },
  rules: {
    "no-positive-tabindex": {
      meta: {
        type: "problem",
        docs: {
          description: "Disallow positive tabIndex values that break natural focus order and roving focus.",
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name?.name !== "tabIndex" || !node.value) return;
            const raw =
              node.value.type === "Literal"
                ? Number(node.value.value)
                : node.value.type === "JSXExpressionContainer" && node.value.expression?.type === "Literal"
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
        docs: {
          description: "Require isComposing guard in text-input Enter key handlers so IME/dictation does not prematurely submit.",
        },
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        return {
          JSXAttribute(node) {
            if (node.name?.name !== "onKeyDown" || node.value?.type !== "JSXExpressionContainer" || !node.value.expression) {
              return;
            }
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
        docs: {
          description: "Require role and keyboard handler when attaching onClick to div, span, or li outside primitives.",
        },
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
    "no-raw-html-controls": {
      meta: {
        type: "problem",
        docs: {
          description: "Forbid raw HTML interactive elements (<button>, <input>, <select>, <textarea>, <dialog>) outside primitive libraries.",
        },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            if (node.name?.type !== "JSXIdentifier") return;
            const message = RAW_HTML_CONTROL_MESSAGES[node.name.name];
            if (message) {
              context.report({ node, message });
            }
          },
        };
      },
    },
    "no-radix-imports": {
      meta: {
        type: "problem",
        docs: {
          description: "Forbid @radix-ui/* imports; use Base UI primitives from @/components/ui/.",
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            const source = node.source?.value;
            if (typeof source === "string" && source.startsWith("@radix-ui/")) {
              context.report({
                node,
                message: "Radix UI (@radix-ui/*) is prohibited. Use Base UI primitives from @/components/ui/.",
              });
            }
          },
        };
      },
    },
  },
};

export default plugin;
