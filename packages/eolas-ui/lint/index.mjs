const RAW_HTML_CONTROL_MESSAGES = {
  button: "Direct <button> usage is prohibited outside primitives. Use <Button> from @/components/ui/button.",
  input: "Direct <input> usage is prohibited outside primitives. Use <Input> from @/components/ui/input.",
  select: "Direct <select> usage is prohibited outside primitives. Use <Select> from @/components/ui/select.",
  textarea: "Direct <textarea> usage is prohibited outside primitives. Use <Textarea> from @/components/ui/textarea.",
  dialog: "Direct <dialog> usage is prohibited outside primitives. Use <Dialog> from @/components/ui/dialog.",
};

const STATIC_CLICKABLE_TAGS = new Set([
  "div",
  "span",
  "li",
  "tr",
  "td",
  "section",
  "svg",
  "article",
  "header",
  "footer",
  "p",
  "img",
]);

const NON_TEXT_INPUT_TYPES = new Set([
  "checkbox",
  "radio",
  "button",
  "submit",
  "reset",
  "range",
  "file",
  "hidden",
]);

const TEXT_ENTRY_COMPONENT_RE = /(?:Input|Textarea|TextArea|Search|Editor|Combobox|Autocomplete|OTP|Field)$/;

function unwrapTypeExpr(node) {
  let curr = node;
  while (
    curr &&
    (curr.type === "ParenthesizedExpression" ||
      curr.type === "TSAsExpression" ||
      curr.type === "TSSatisfiesExpression" ||
      curr.type === "TSNonNullExpression" ||
      curr.type === "TSTypeAssertion")
  ) {
    curr = curr.expression;
  }
  return curr;
}

function evalStaticNumericLiteral(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return null;
  if (expr.type === "Literal") {
    if (typeof expr.value === "number" && !Number.isNaN(expr.value)) return expr.value;
    if (typeof expr.value === "string" && expr.value.trim() !== "") {
      const parsed = Number(expr.value);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }
  if (expr.type === "UnaryExpression" && (expr.operator === "+" || expr.operator === "-")) {
    const inner = evalStaticNumericLiteral(expr.argument);
    if (inner === null) return null;
    return expr.operator === "-" ? -inner : inner;
  }
  return null;
}

function containsPositiveNumericLiteral(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return false;
  const staticVal = evalStaticNumericLiteral(expr);
  if (staticVal !== null) return staticVal > 0;
  if (expr.type === "ConditionalExpression") {
    return containsPositiveNumericLiteral(expr.consequent) || containsPositiveNumericLiteral(expr.alternate);
  }
  if (expr.type === "LogicalExpression") {
    return containsPositiveNumericLiteral(expr.left) || containsPositiveNumericLiteral(expr.right);
  }
  return false;
}

function getStaticStringFromAttr(attr) {
  if (!attr || !attr.value) return null;
  if (attr.value.type === "Literal" && typeof attr.value.value === "string") {
    return attr.value.value;
  }
  if (attr.value.type === "JSXExpressionContainer") {
    const expr = unwrapTypeExpr(attr.value.expression);
    if (expr?.type === "Literal" && typeof expr.value === "string") {
      return expr.value;
    }
    if (expr?.type === "TemplateLiteral" && expr.expressions.length === 0) {
      return expr.quasis[0]?.value?.cooked ?? null;
    }
  }
  return null;
}

function getStaticStringFromExpr(exprNode) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return null;
  if (expr.type === "Literal" && typeof expr.value === "string") {
    return expr.value;
  }
  if (expr.type === "TemplateLiteral" && expr.expressions.length === 0) {
    return expr.quasis[0]?.value?.cooked ?? null;
  }
  return null;
}

function getJsxTagParts(nameNode) {
  if (!nameNode) return { full: "", leaf: "" };
  if (nameNode.type === "JSXIdentifier") {
    return { full: nameNode.name, leaf: nameNode.name };
  }
  if (nameNode.type === "JSXMemberExpression") {
    const obj = getJsxTagParts(nameNode.object);
    const prop = nameNode.property?.name || "";
    return {
      full: obj.full ? `${obj.full}.${prop}` : prop,
      leaf: prop,
    };
  }
  return { full: "", leaf: "" };
}

function isTextEntryElement(openingNode) {
  if (!openingNode) return false;
  const { leaf } = getJsxTagParts(openingNode.name);
  const attrs = openingNode.attributes || [];
  const hasContentEditable = attrs.some((a) => {
    if (a.type !== "JSXAttribute" || a.name?.name !== "contentEditable") return false;
    if (!a.value) return true;
    const str = getStaticStringFromAttr(a);
    if (str === "false") return false;
    if (a.value.type === "JSXExpressionContainer" && a.value.expression?.type === "Literal" && a.value.expression.value === false) {
      return false;
    }
    return true;
  });
  if (hasContentEditable) return true;

  if (leaf === "textarea" || leaf === "form") return true;
  if (leaf === "input") {
    const typeAttr = attrs.find((a) => a.type === "JSXAttribute" && a.name?.name === "type");
    const typeVal = getStaticStringFromAttr(typeAttr)?.toLowerCase();
    return !typeVal || !NON_TEXT_INPUT_TYPES.has(typeVal);
  }
  return TEXT_ENTRY_COMPONENT_RE.test(leaf);
}

function stripJsComments(code) {
  let out = "";
  let i = 0;
  let stringQuote = null;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    if (stringQuote) {
      out += ch;
      if (ch === "\\" && i + 1 < code.length) {
        out += next;
        i += 2;
        continue;
      }
      if (ch === stringQuote) {
        stringQuote = null;
      } else if ((stringQuote === "'" || stringQuote === '"') && (ch === "\n" || ch === "\r")) {
        stringQuote = null;
      }
      i += 1;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      const closeIdx = code.indexOf("*/", i + 2);
      if (closeIdx !== -1) {
        out += code.slice(i, closeIdx + 2).replace(/[^\n\r]/g, " ");
        i = closeIdx + 2;
        continue;
      }
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      stringQuote = ch;
    }
    out += ch;
    i += 1;
  }
  return out;
}

function collectCalleeNames(node, visitorKeys, out = new Set()) {
  if (!node || typeof node !== "object") return out;
  if (node.type === "CallExpression" && node.callee?.type === "Identifier") {
    out.add(node.callee.name);
  }
  const keys = visitorKeys[node.type] || Object.keys(node);
  for (const key of keys) {
    if (key === "parent") continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item.type === "string") {
          collectCalleeNames(item, visitorKeys, out);
        }
      }
    } else if (child && typeof child.type === "string") {
      collectCalleeNames(child, visitorKeys, out);
    }
  }
  return out;
}

function getFunctionExpressionFromInit(init) {
  const unwrapped = unwrapTypeExpr(init);
  if (!unwrapped) return null;
  if (unwrapped.type === "ArrowFunctionExpression" || unwrapped.type === "FunctionExpression") {
    return unwrapped;
  }
  if (unwrapped.type === "CallExpression" && unwrapped.arguments?.length > 0) {
    const firstArg = unwrapTypeExpr(unwrapped.arguments[0]);
    if (firstArg?.type === "ArrowFunctionExpression" || firstArg?.type === "FunctionExpression") {
      return firstArg;
    }
  }
  return null;
}

function checksEnterKey(cleanedCode) {
  if (/\.key\s*===?\s*['"]Enter['"]|['"]Enter['"]\s*===?\s*[\w$.?)[\]]+\.key\b/.test(cleanedCode)) {
    return true;
  }
  if (/switch\s*\([^)]*\.key\b[^)]*\)\s*\{[\s\S]*?\bcase\s*['"]Enter['"]\s*:/.test(cleanedCode)) {
    return true;
  }
  const destructuresKey = /\{[^}]*\bkey\b[^}]*\}/.test(cleanedCode);
  if (
    destructuresKey &&
    (/(?:^|[^\w$.])key\s*===?\s*['"]Enter['"]|['"]Enter['"]\s*===?\s*key\b/.test(cleanedCode) ||
      /switch\s*\(\s*key\s*\)\s*\{[\s\S]*?\bcase\s*['"]Enter['"]\s*:/.test(cleanedCode))
  ) {
    return true;
  }
  return false;
}

function checksReactImeComposing(cleanedCode) {
  return (
    /nativeEvent(?:\?\.)?\.isComposing\b/.test(cleanedCode) ||
    /\bkeyCode\s*===?\s*229\b|\b229\s*===?\s*[\w$.]*keyCode\b/.test(cleanedCode) ||
    /\{[^}]*\bisComposing\b[^}]*\}\s*=\s*[\w$.?]*\bnativeEvent\b/.test(cleanedCode)
  );
}

function isRadixSpecifier(source) {
  return (
    typeof source === "string" &&
    (source === "radix-ui" || source.startsWith("radix-ui/") || source.startsWith("@radix-ui/"))
  );
}

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
            const isPositive =
              node.value.type === "Literal"
                ? (evalStaticNumericLiteral(node.value) ?? 0) > 0
                : node.value.type === "JSXExpressionContainer"
                  ? containsPositiveNumericLiteral(node.value.expression)
                  : false;
            if (isPositive) {
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
          description: "Require React nativeEvent.isComposing or keyCode === 229 guard in text-entry Enter key handlers.",
        },
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const visitorKeys = sourceCode.visitorKeys || {};
        const scopeStack = [];
        const openingStack = [];
        const onKeyDownEntries = [];

        const pushScope = () => {
          scopeStack.push(new Map());
        };
        const popScope = () => {
          scopeStack.pop();
        };
        const recordFunction = (name, fnNode) => {
          if (!name || !fnNode || scopeStack.length === 0) return;
          const currentScope = scopeStack[scopeStack.length - 1];
          const text = stripJsComments(sourceCode.getText(fnNode));
          const existing = currentScope.get(name);
          if (existing) existing.push(text);
          else currentScope.set(name, [text]);
        };
        const lookupFunctions = (name, capturedScopes) => {
          for (let i = capturedScopes.length - 1; i >= 0; i--) {
            const defs = capturedScopes[i].get(name);
            if (defs) return defs;
          }
          return null;
        };

        return {
          Program: pushScope,
          "Program:exit"() {
            for (const { attr, scopeChain } of onKeyDownEntries) {
              const expr = attr.value.expression;
              const candidates = [stripJsComments(sourceCode.getText(expr))];

              if (expr.type === "Identifier") {
                const defs = lookupFunctions(expr.name, scopeChain);
                if (defs) candidates.push(...defs);
              } else if (expr.type === "ArrowFunctionExpression" || expr.type === "FunctionExpression") {
                const callees = collectCalleeNames(expr, visitorKeys);
                for (const calleeName of callees) {
                  const defs = lookupFunctions(calleeName, scopeChain);
                  if (defs) candidates.push(...defs);
                }
              }

              for (const cleanedText of candidates) {
                if (checksEnterKey(cleanedText) && !checksReactImeComposing(cleanedText)) {
                  context.report({
                    node: attr,
                    message:
                      "Enter key handler on text input must guard against IME composition (e.g. !e.nativeEvent.isComposing && e.keyCode !== 229).",
                  });
                  break;
                }
              }
            }
            popScope();
          },
          BlockStatement: pushScope,
          "BlockStatement:exit": popScope,
          FunctionDeclaration(node) {
            if (node.id?.name) {
              recordFunction(node.id.name, node);
            }
            pushScope();
          },
          "FunctionDeclaration:exit": popScope,
          FunctionExpression: pushScope,
          "FunctionExpression:exit": popScope,
          ArrowFunctionExpression: pushScope,
          "ArrowFunctionExpression:exit": popScope,
          VariableDeclarator(node) {
            if (node.id?.type !== "Identifier") return;
            const fnNode = getFunctionExpressionFromInit(node.init);
            if (fnNode) {
              recordFunction(node.id.name, fnNode);
            }
          },
          JSXOpeningElement(node) {
            openingStack.push(node);
          },
          "JSXOpeningElement:exit"() {
            openingStack.pop();
          },
          JSXAttribute(node) {
            if (
              node.name?.name === "onKeyDown" &&
              node.value?.type === "JSXExpressionContainer" &&
              node.value.expression
            ) {
              const currentOpening = openingStack[openingStack.length - 1];
              if (isTextEntryElement(currentOpening)) {
                onKeyDownEntries.push({
                  attr: node,
                  scopeChain: [...scopeStack],
                });
              }
            }
          },
        };
      },
    },
    "no-static-clickable-elements": {
      meta: {
        type: "problem",
        docs: {
          description: "Require interactive role, non-negative tabIndex, and keyboard handler when attaching onClick to static HTML elements.",
        },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const tagName = node.name?.name;
            if (!STATIC_CLICKABLE_TAGS.has(tagName)) return;
            const attrs = node.attributes || [];
            const hasOnClick = attrs.some((a) => a.type === "JSXAttribute" && a.name?.name === "onClick");
            if (!hasOnClick) return;

            const roleAttr = attrs.find((a) => a.type === "JSXAttribute" && a.name?.name === "role");
            const roleVal = getStaticStringFromAttr(roleAttr)?.toLowerCase();
            const hasInteractiveRole = Boolean(roleAttr) && roleVal !== "presentation" && roleVal !== "none";

            const tabIndexAttr = attrs.find((a) => a.type === "JSXAttribute" && a.name?.name === "tabIndex");
            let hasValidTabIndex = false;
            if (tabIndexAttr?.value) {
              if (tabIndexAttr.value.type === "JSXExpressionContainer") {
                const staticNum = evalStaticNumericLiteral(tabIndexAttr.value.expression);
                hasValidTabIndex = staticNum === null ? true : staticNum >= 0;
              } else {
                const staticNum = evalStaticNumericLiteral(tabIndexAttr.value);
                hasValidTabIndex = staticNum !== null && staticNum >= 0;
              }
            }

            const hasKeyHandler = attrs.some(
              (a) => a.type === "JSXAttribute" && (a.name?.name === "onKeyDown" || a.name?.name === "onKeyUp"),
            );
            if (!hasInteractiveRole || !hasValidTabIndex || !hasKeyHandler) {
              context.report({
                node,
                message: `Clickable <${tagName}> must use <Button> / a Base UI primitive, or include an interactive role, non-negative tabIndex, and onKeyDown.`,
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
          description: "Forbid raw HTML interactive elements (<button>, <input>, <select>, <textarea>, <dialog>) outside primitive libraries and Base UI render props.",
        },
        schema: [],
      },
      create(context) {
        let renderPropDepth = 0;
        return {
          JSXAttribute(node) {
            if (node.name?.name === "render") {
              renderPropDepth += 1;
            }
          },
          "JSXAttribute:exit"(node) {
            if (node.name?.name === "render") {
              renderPropDepth = Math.max(0, renderPropDepth - 1);
            }
          },
          JSXOpeningElement(node) {
            if (renderPropDepth > 0) return;
            if (node.name?.type !== "JSXIdentifier") return;
            const tag = node.name.name;
            const message = RAW_HTML_CONTROL_MESSAGES[tag];
            if (!message) return;

            if (tag === "input") {
              const typeAttr = (node.attributes || []).find(
                (a) => a.type === "JSXAttribute" && a.name?.name === "type",
              );
              const typeVal = getStaticStringFromAttr(typeAttr)?.toLowerCase();
              if (typeVal === "hidden" || typeVal === "file") return;
            }

            context.report({ node, message });
          },
        };
      },
    },
    "no-radix-imports": {
      meta: {
        type: "problem",
        docs: {
          description: "Forbid @radix-ui/* and radix-ui imports; use Base UI primitives from @/components/ui/.",
        },
        schema: [],
      },
      create(context) {
        const reportIfRadix = (node, specifier) => {
          if (isRadixSpecifier(specifier)) {
            context.report({
              node,
              message: "Radix UI (@radix-ui/* / radix-ui) is prohibited. Use Base UI primitives from @/components/ui/.",
            });
          }
        };
        return {
          ImportDeclaration(node) {
            reportIfRadix(node, node.source?.value);
          },
          ExportNamedDeclaration(node) {
            if (node.source) reportIfRadix(node, node.source.value);
          },
          ExportAllDeclaration(node) {
            if (node.source) reportIfRadix(node, node.source.value);
          },
          ImportExpression(node) {
            reportIfRadix(node, getStaticStringFromExpr(node.source));
          },
          CallExpression(node) {
            if (
              node.callee?.type === "Identifier" &&
              node.callee.name === "require" &&
              node.arguments?.length > 0
            ) {
              reportIfRadix(node, getStaticStringFromExpr(node.arguments[0]));
            }
          },
        };
      },
    },
  },
};

export default plugin;
