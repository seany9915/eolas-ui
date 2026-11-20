import path from 'node:path';

const RAW_HTML_CONTROL_MESSAGES = {
  button: 'Direct <button> usage is prohibited outside primitives. Use <Button> or <UnstyledButton> from @/components/ui/button.',
  input: 'Direct <input> usage is prohibited outside primitives. Use <Input> from @/components/ui/input.',
  select: 'Direct <select> usage is prohibited outside primitives. Use <Select> from @/components/ui/select.',
  textarea: 'Direct <textarea> usage is prohibited outside primitives. Use <Textarea> from @/components/ui/textarea.',
  dialog: 'Direct <dialog> usage is prohibited outside primitives. Use <Dialog> from @/components/ui/dialog.',
};

const STATIC_CLICKABLE_TAGS = new Set([
  'div',
  'span',
  'li',
  'tr',
  'td',
  'section',
  'svg',
  'article',
  'header',
  'footer',
  'p',
  'img',
]);

const NON_TEXT_INPUT_TYPES = new Set([
  'checkbox',
  'radio',
  'button',
  'submit',
  'reset',
  'range',
  'file',
  'hidden',
]);

const TEXT_ENTRY_COMPONENT_RE = /(?:Input|Textarea|TextArea|Search|Editor|Combobox|Autocomplete|OTP|Field)$/;

const CLASS_HELPER_NAMES = new Set(['cn', 'clsx', 'twMerge', 'cva']);

const BANNED_SPARKLE_ICONS = new Set(['stars', 'auto_awesome', 'auto_fix_high']);
const ICON_COMPONENT_NAMES = new Set(['Icon', 'Icon.Toggle', 'Icon.CrossFade', 'ToggleIcon', 'CrossFadeIcon']);
const ICON_PROP_NAMES = new Set(['name', 'onName', 'offName', 'fromName', 'toName', 'icon']);
const GENERIC_ICON_PROP_NAMES = new Set(['icon', 'onName', 'offName', 'fromName', 'toName']);

const SEMANTIC_TRIPLE_TINT_HUES = 'primary|secondary|tertiary|error|warning|success|neutral';
const NUMERIC_TINT_RE = /^(bg|border|text)-([a-z]+)-\d{2,3}$/;
const SEMANTIC_BG_BORDER_RE = new RegExp(`^(bg|border)-(${SEMANTIC_TRIPLE_TINT_HUES})(?:-container)?$`);
const SEMANTIC_TEXT_RE = new RegExp(`^text-(${SEMANTIC_TRIPLE_TINT_HUES})$`);

const INVERTED_BG_TOKENS = new Set([
  'bg-on-surface',
  'bg-neutral',
  'bg-gray-900',
  'bg-slate-900',
  'bg-zinc-900',
  'bg-black',
]);

const SPRING_EASING_CLASS_RE = /^(?:ease-bounce|ease-bounce-strong|ease-spring)$/;
const SPRING_EASING_VAR_RE = /--ease-(?:spring|bounce)/;
const CELEBRATORY_NAME_RE = /success[-_]?check|confetti|celebrat/i;

function getFilename(context) {
  return context.physicalFilename ?? context.filename ?? context.getFilename?.() ?? '';
}

function unwrapTypeExpr(node) {
  let curr = node;
  while (
    curr &&
    (curr.type === 'ParenthesizedExpression' ||
      curr.type === 'ChainExpression' ||
      curr.type === 'TSAsExpression' ||
      curr.type === 'TSSatisfiesExpression' ||
      curr.type === 'TSNonNullExpression' ||
      curr.type === 'TSTypeAssertion')
  ) {
    curr = curr.expression;
  }
  return curr;
}

function evalStaticNumericLiteral(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return null;
  if (expr.type === 'Literal') {
    if (typeof expr.value === 'number' && !Number.isNaN(expr.value)) return expr.value;
    if (typeof expr.value === 'string' && expr.value.trim() !== '') {
      const parsed = Number(expr.value);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }
  if (expr.type === 'UnaryExpression' && (expr.operator === '+' || expr.operator === '-')) {
    const inner = evalStaticNumericLiteral(expr.argument);
    if (inner === null) return null;
    return expr.operator === '-' ? -inner : inner;
  }
  return null;
}

function containsPositiveNumericLiteral(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return false;
  const staticVal = evalStaticNumericLiteral(expr);
  if (staticVal !== null) return staticVal > 0;
  if (expr.type === 'ConditionalExpression') {
    return containsPositiveNumericLiteral(expr.consequent) || containsPositiveNumericLiteral(expr.alternate);
  }
  if (expr.type === 'LogicalExpression') {
    return containsPositiveNumericLiteral(expr.left) || containsPositiveNumericLiteral(expr.right);
  }
  return false;
}

function getStaticStringFromExpr(exprNode) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return null;
  if (expr.type === 'Literal' && typeof expr.value === 'string') {
    return expr.value;
  }
  if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
    return expr.quasis[0]?.value?.cooked ?? null;
  }
  return null;
}

function getStaticStringFromAttr(attr) {
  if (!attr || !attr.value) return null;
  if (attr.value.type === 'Literal' && typeof attr.value.value === 'string') {
    return attr.value.value;
  }
  if (attr.value.type === 'JSXExpressionContainer') {
    return getStaticStringFromExpr(attr.value.expression);
  }
  return null;
}

function collectStaticStringsFromExpr(exprNode, out = []) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return out;
  const direct = getStaticStringFromExpr(expr);
  if (direct !== null) {
    out.push(direct);
    return out;
  }
  if (expr.type === 'ConditionalExpression') {
    collectStaticStringsFromExpr(expr.consequent, out);
    collectStaticStringsFromExpr(expr.alternate, out);
  } else if (expr.type === 'LogicalExpression') {
    collectStaticStringsFromExpr(expr.left, out);
    collectStaticStringsFromExpr(expr.right, out);
  }
  return out;
}

function getJsxTagParts(nameNode) {
  if (!nameNode) return { full: '', leaf: '' };
  if (nameNode.type === 'JSXIdentifier') {
    return { full: nameNode.name, leaf: nameNode.name };
  }
  if (nameNode.type === 'JSXMemberExpression') {
    const obj = getJsxTagParts(nameNode.object);
    const prop = nameNode.property?.name || '';
    return {
      full: obj.full ? `${obj.full}.${prop}` : prop,
      leaf: prop,
    };
  }
  return { full: '', leaf: '' };
}

function getPropertyKeyName(keyNode, computed = false) {
  if (!keyNode) return null;
  if (!computed && keyNode.type === 'Identifier') return keyNode.name;
  if (keyNode.type === 'Literal' && typeof keyNode.value === 'string') return keyNode.value;
  return null;
}

function getCalleeName(calleeNode) {
  const callee = unwrapTypeExpr(calleeNode);
  if (!callee) return null;
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression' && !callee.computed && callee.property?.type === 'Identifier') {
    return callee.property.name;
  }
  return null;
}

function walkAst(node, visitorKeys, visitor) {
  if (!node || typeof node !== 'object') return false;
  if (visitor(node) === true) return true;
  const keys = visitorKeys[node.type] || Object.keys(node);
  for (const key of keys) {
    if (key === 'parent' || key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item.type === 'string' && walkAst(item, visitorKeys, visitor)) {
          return true;
        }
      }
    } else if (child && typeof child.type === 'string' && walkAst(child, visitorKeys, visitor)) {
      return true;
    }
  }
  return false;
}

function isTextEntryElement(openingNode) {
  if (!openingNode) return false;
  const { leaf } = getJsxTagParts(openingNode.name);
  const attrs = openingNode.attributes || [];
  const hasContentEditable = attrs.some((a) => {
    if (a.type !== 'JSXAttribute' || a.name?.name !== 'contentEditable') return false;
    if (!a.value) return true;
    const str = getStaticStringFromAttr(a);
    if (str === 'false') return false;
    if (a.value.type === 'JSXExpressionContainer' && a.value.expression?.type === 'Literal' && a.value.expression.value === false) {
      return false;
    }
    return true;
  });
  if (hasContentEditable) return true;

  if (leaf === 'textarea' || leaf === 'form') return true;
  if (leaf === 'input') {
    const typeAttr = attrs.find((a) => a.type === 'JSXAttribute' && a.name?.name === 'type');
    const typeVal = getStaticStringFromAttr(typeAttr)?.toLowerCase();
    return !typeVal || !NON_TEXT_INPUT_TYPES.has(typeVal);
  }
  return TEXT_ENTRY_COMPONENT_RE.test(leaf);
}

function collectCalleeNames(node, visitorKeys, out = new Set()) {
  walkAst(node, visitorKeys, (curr) => {
    if (curr.type === 'CallExpression' && curr.callee?.type === 'Identifier') {
      out.add(curr.callee.name);
    }
    return false;
  });
  return out;
}

function getFunctionExpressionFromInit(init) {
  const unwrapped = unwrapTypeExpr(init);
  if (!unwrapped) return null;
  if (unwrapped.type === 'ArrowFunctionExpression' || unwrapped.type === 'FunctionExpression') {
    return unwrapped;
  }
  if (unwrapped.type === 'CallExpression' && unwrapped.arguments?.length > 0) {
    const firstArg = unwrapTypeExpr(unwrapped.arguments[0]);
    if (firstArg?.type === 'ArrowFunctionExpression' || firstArg?.type === 'FunctionExpression') {
      return firstArg;
    }
  }
  return null;
}

function getMemberPropertyName(memberNode) {
  if (!memberNode || memberNode.type !== 'MemberExpression') return null;
  if (!memberNode.computed && memberNode.property?.type === 'Identifier') {
    return memberNode.property.name;
  }
  if (memberNode.computed) {
    return getStaticStringFromExpr(memberNode.property);
  }
  return null;
}

function isNativeEventAccess(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return false;
  if (expr.type === 'Identifier' && expr.name === 'nativeEvent') return true;
  return getMemberPropertyName(expr) === 'nativeEvent';
}

function collectDestructuredPropNames(fnNode, propName, visitorKeys) {
  const names = new Set();
  walkAst(fnNode, visitorKeys, (curr) => {
    if (curr.type === 'ObjectPattern') {
      for (const prop of curr.properties || []) {
        if (prop.type !== 'Property') continue;
        const keyName = getPropertyKeyName(prop.key, prop.computed);
        if (keyName === propName && prop.value?.type === 'Identifier') {
          names.add(prop.value.name);
        }
      }
    }
    return false;
  });
  return names;
}

function isKeyAccessExpr(node, destructuredKeyNames) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return false;
  if (getMemberPropertyName(expr) === 'key') return true;
  return expr.type === 'Identifier' && destructuredKeyNames.has(expr.name);
}

function astChecksEnterKey(fnNode, visitorKeys) {
  if (!fnNode) return false;
  const keyNames = collectDestructuredPropNames(fnNode, 'key', visitorKeys);
  return walkAst(fnNode, visitorKeys, (curr) => {
    if (curr.type === 'BinaryExpression' && (curr.operator === '===' || curr.operator === '==')) {
      const leftIsKey = isKeyAccessExpr(curr.left, keyNames);
      const rightIsKey = isKeyAccessExpr(curr.right, keyNames);
      if (leftIsKey && getStaticStringFromExpr(curr.right) === 'Enter') return true;
      if (rightIsKey && getStaticStringFromExpr(curr.left) === 'Enter') return true;
    }
    if (curr.type === 'SwitchStatement' && isKeyAccessExpr(curr.discriminant, keyNames)) {
      if ((curr.cases || []).some((c) => c.test && getStaticStringFromExpr(c.test) === 'Enter')) {
        return true;
      }
    }
    return false;
  });
}

function astChecksReactImeComposing(fnNode, visitorKeys) {
  if (!fnNode) return false;
  const keyCodeNames = collectDestructuredPropNames(fnNode, 'keyCode', visitorKeys);
  const keyCodeEqOps = new Set(['===', '!==', '==', '!=']);

  return walkAst(fnNode, visitorKeys, (curr) => {
    if (curr.type === 'MemberExpression' && getMemberPropertyName(curr) === 'isComposing') {
      if (isNativeEventAccess(curr.object)) return true;
    }
    if (
      curr.type === 'VariableDeclarator' &&
      curr.id?.type === 'ObjectPattern' &&
      isNativeEventAccess(curr.init)
    ) {
      const hasIsComposing = (curr.id.properties || []).some(
        (prop) => prop.type === 'Property' && getPropertyKeyName(prop.key, prop.computed) === 'isComposing'
      );
      if (hasIsComposing) return true;
    }
    if (curr.type === 'BinaryExpression' && keyCodeEqOps.has(curr.operator)) {
      const leftExpr = unwrapTypeExpr(curr.left);
      const rightExpr = unwrapTypeExpr(curr.right);
      const leftIsKeyCode =
        getMemberPropertyName(leftExpr) === 'keyCode' ||
        (leftExpr?.type === 'Identifier' && keyCodeNames.has(leftExpr.name));
      const rightIsKeyCode =
        getMemberPropertyName(rightExpr) === 'keyCode' ||
        (rightExpr?.type === 'Identifier' && keyCodeNames.has(rightExpr.name));
      if (leftIsKeyCode && evalStaticNumericLiteral(rightExpr) === 229) return true;
      if (rightIsKeyCode && evalStaticNumericLiteral(leftExpr) === 229) return true;
    }
    return false;
  });
}

function isRadixSpecifier(source) {
  return (
    typeof source === 'string' &&
    (source === 'radix-ui' || source.startsWith('radix-ui/') || source.startsWith('@radix-ui/'))
  );
}

function findOpacitySlash(afterVariant) {
  let bracketDepth = 0;
  for (let i = 0; i < afterVariant.length; i++) {
    const ch = afterVariant[i];
    if (ch === '[') bracketDepth += 1;
    else if (ch === ']' && bracketDepth > 0) bracketDepth -= 1;
    else if (ch === '/' && bracketDepth === 0) return i;
  }
  return -1;
}

function splitTailwindTokens(str) {
  const tokens = [];
  for (const rawToken of str.split(/\s+/)) {
    if (!rawToken) continue;
    let bracketDepth = 0;
    let lastColon = -1;
    for (let i = 0; i < rawToken.length; i++) {
      if (rawToken[i] === '[') bracketDepth += 1;
      else if (rawToken[i] === ']' && bracketDepth > 0) bracketDepth -= 1;
      else if (rawToken[i] === ':' && bracketDepth === 0) lastColon = i;
    }
    const variant = lastColon === -1 ? '' : rawToken.slice(0, lastColon);
    const afterVariant = (lastColon === -1 ? rawToken : rawToken.slice(lastColon + 1)).replace(/^!/, '');
    const slashIdx = findOpacitySlash(afterVariant);
    const base = slashIdx === -1 ? afterVariant : afterVariant.slice(0, slashIdx);
    tokens.push({
      raw: rawToken,
      variant,
      afterVariant,
      base,
      hasOpacity: slashIdx !== -1,
    });
  }
  return tokens;
}

function extractClassGroupsFromExpr(exprNode, visitedCalls, groups = []) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return groups;

  const direct = getStaticStringFromExpr(expr);
  if (direct !== null) {
    groups.push({ text: direct, node: exprNode });
    return groups;
  }

  if (expr.type === 'TemplateLiteral') {
    const quasisText = expr.quasis.map((q) => q.value?.cooked ?? '').join(' ');
    if (quasisText.trim()) {
      groups.push({ text: quasisText, node: expr });
    }
    for (const sub of expr.expressions || []) {
      extractClassGroupsFromExpr(sub, visitedCalls, groups);
    }
    return groups;
  }

  if (expr.type === 'BinaryExpression' && expr.operator === '+') {
    const leftStatic = getStaticStringFromExpr(expr.left);
    const rightStatic = getStaticStringFromExpr(expr.right);
    if (leftStatic !== null && rightStatic !== null) {
      groups.push({ text: `${leftStatic}${rightStatic}`, node: expr });
      return groups;
    }
    extractClassGroupsFromExpr(expr.left, visitedCalls, groups);
    extractClassGroupsFromExpr(expr.right, visitedCalls, groups);
    return groups;
  }

  if (expr.type === 'ConditionalExpression') {
    extractClassGroupsFromExpr(expr.consequent, visitedCalls, groups);
    extractClassGroupsFromExpr(expr.alternate, visitedCalls, groups);
    return groups;
  }

  if (expr.type === 'LogicalExpression') {
    if (expr.operator === '||' || expr.operator === '??') {
      extractClassGroupsFromExpr(expr.left, visitedCalls, groups);
    }
    extractClassGroupsFromExpr(expr.right, visitedCalls, groups);
    return groups;
  }

  if (expr.type === 'ArrayExpression') {
    const unconditionalParts = [];
    for (const elem of expr.elements || []) {
      if (!elem) continue;
      if (elem.type === 'SpreadElement') {
        extractClassGroupsFromExpr(elem.argument, visitedCalls, groups);
        continue;
      }
      const staticVal = getStaticStringFromExpr(elem);
      if (staticVal !== null) {
        unconditionalParts.push(staticVal);
      } else {
        extractClassGroupsFromExpr(elem, visitedCalls, groups);
      }
    }
    if (unconditionalParts.length > 0) {
      groups.push({ text: unconditionalParts.join(' '), node: expr });
    }
    return groups;
  }

  if (expr.type === 'ObjectExpression') {
    for (const prop of expr.properties || []) {
      if (prop.type !== 'Property') continue;
      const keyName = getPropertyKeyName(prop.key, prop.computed);
      if (keyName) {
        groups.push({ text: keyName, node: prop.key });
      }
    }
    return groups;
  }

  if (expr.type === 'CallExpression') {
    const calleeName = getCalleeName(expr.callee);
    if (!CLASS_HELPER_NAMES.has(calleeName)) return groups;
    visitedCalls?.add(expr);

    if (calleeName === 'cva') {
      const [baseArg, configArg] = expr.arguments || [];
      if (baseArg) {
        extractClassGroupsFromExpr(baseArg, visitedCalls, groups);
      }
      const config = unwrapTypeExpr(configArg);
      if (config?.type === 'ObjectExpression') {
        for (const prop of config.properties || []) {
          if (prop.type !== 'Property') continue;
          const propName = getPropertyKeyName(prop.key, prop.computed);
          if (propName === 'variants') {
            const variantsObj = unwrapTypeExpr(prop.value);
            if (variantsObj?.type === 'ObjectExpression') {
              for (const groupProp of variantsObj.properties || []) {
                if (groupProp.type !== 'Property') continue;
                const optionsObj = unwrapTypeExpr(groupProp.value);
                if (optionsObj?.type === 'ObjectExpression') {
                  for (const optProp of optionsObj.properties || []) {
                    if (optProp.type === 'Property') {
                      extractClassGroupsFromExpr(optProp.value, visitedCalls, groups);
                    }
                  }
                }
              }
            }
          } else if (propName === 'compoundVariants') {
            const compoundArr = unwrapTypeExpr(prop.value);
            if (compoundArr?.type === 'ArrayExpression') {
              for (const item of compoundArr.elements || []) {
                const itemObj = unwrapTypeExpr(item);
                if (itemObj?.type !== 'ObjectExpression') continue;
                for (const itemProp of itemObj.properties || []) {
                  if (itemProp.type !== 'Property') continue;
                  const itemKey = getPropertyKeyName(itemProp.key, itemProp.computed);
                  if (itemKey === 'class' || itemKey === 'className') {
                    extractClassGroupsFromExpr(itemProp.value, visitedCalls, groups);
                  }
                }
              }
            }
          }
        }
      }
      return groups;
    }

    const unconditionalParts = [];
    for (const arg of expr.arguments || []) {
      if (arg.type === 'SpreadElement') {
        extractClassGroupsFromExpr(arg.argument, visitedCalls, groups);
        continue;
      }
      const staticVal = getStaticStringFromExpr(arg);
      if (staticVal !== null) {
        unconditionalParts.push(staticVal);
      } else {
        const inner = unwrapTypeExpr(arg);
        if (inner?.type === 'TemplateLiteral' && inner.expressions.length > 0) {
          const quasisText = inner.quasis.map((q) => q.value?.cooked ?? '').join(' ');
          if (quasisText.trim()) unconditionalParts.push(quasisText);
          for (const sub of inner.expressions) {
            extractClassGroupsFromExpr(sub, visitedCalls, groups);
          }
        } else {
          extractClassGroupsFromExpr(arg, visitedCalls, groups);
        }
      }
    }
    if (unconditionalParts.length > 0) {
      groups.push({ text: unconditionalParts.join(' '), node: expr });
    }
  }

  return groups;
}

function extractClassGroupsFromAttr(attr, visitedCalls) {
  if (!attr || !attr.value) return [];
  if (attr.value.type === 'Literal' && typeof attr.value.value === 'string') {
    return [{ text: attr.value.value, node: attr.value }];
  }
  if (attr.value.type === 'JSXExpressionContainer') {
    return extractClassGroupsFromExpr(attr.value.expression, visitedCalls);
  }
  return [];
}

function getInlineStyleProperties(attr, targetKeys) {
  if (!attr || attr.name?.name !== 'style' || attr.value?.type !== 'JSXExpressionContainer') {
    return [];
  }
  const obj = unwrapTypeExpr(attr.value.expression);
  if (obj?.type !== 'ObjectExpression') return [];
  const matches = [];
  for (const prop of obj.properties || []) {
    if (prop.type !== 'Property') continue;
    const keyName = getPropertyKeyName(prop.key, prop.computed);
    if (!keyName || !targetKeys.has(keyName)) continue;
    for (const valueStr of collectStaticStringsFromExpr(prop.value)) {
      matches.push({ key: keyName, value: valueStr, node: prop });
    }
  }
  return matches;
}

function createClassGroupVisitor(onGroups) {
  return (context) => {
    const visitedCalls = new WeakSet();
    return {
      JSXAttribute(node) {
        const attrName = node.name?.name;
        if (attrName !== 'className' && attrName !== 'class') return;
        const groups = extractClassGroupsFromAttr(node, visitedCalls);
        if (groups.length > 0) onGroups(context, groups, node);
      },
      CallExpression(node) {
        if (visitedCalls.has(node)) return;
        const calleeName = getCalleeName(node.callee);
        if (!CLASS_HELPER_NAMES.has(calleeName)) return;
        visitedCalls.add(node);
        const groups = extractClassGroupsFromExpr(node, visitedCalls);
        if (groups.length > 0) onGroups(context, groups, node);
      },
    };
  };
}

function findTripleTintHueInTokens(tokens) {
  const roleMap = new Map();
  for (const token of tokens) {
    let kind = null;
    let role = null;
    let hue = null;
    const numMatch = token.base.match(NUMERIC_TINT_RE);
    if (numMatch) {
      kind = 'num';
      role = numMatch[1];
      hue = numMatch[2];
    } else {
      const bgBorderMatch = token.base.match(SEMANTIC_BG_BORDER_RE);
      if (bgBorderMatch) {
        kind = 'sem';
        role = bgBorderMatch[1];
        hue = bgBorderMatch[2];
      } else {
        const textMatch = token.base.match(SEMANTIC_TEXT_RE);
        if (textMatch) {
          kind = 'sem';
          role = 'text';
          hue = textMatch[1];
        }
      }
    }
    if (!hue) continue;
    const key = `${token.variant}|${kind}|${hue}`;
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

function isInvertedOpeningElement(openingNode) {
  if (!openingNode) return false;
  const attrs = openingNode.attributes || [];
  for (const attr of attrs) {
    if (attr.type !== 'JSXAttribute') continue;
    const attrName = attr.name?.name;
    if (attrName === 'prominence') {
      const val = getStaticStringFromAttr(attr);
      if (val === 'inverted' || val === 'spotlight') return true;
    } else if (attrName === 'variant') {
      if (getStaticStringFromAttr(attr) === 'inverted') return true;
    } else if (attrName === 'data-surface' || attrName === 'data-prominence') {
      if (getStaticStringFromAttr(attr) === 'inverted') return true;
    } else if (attrName === 'className' || attrName === 'class') {
      const groups = extractClassGroupsFromAttr(attr, null);
      for (const group of groups) {
        for (const token of splitTailwindTokens(group.text)) {
          if (token.variant === '' && !token.hasOpacity && INVERTED_BG_TOKENS.has(token.base)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function hasInvertedVariantPrefix(variant) {
  if (!variant) return false;
  return /(?:^|:)(?:inverted|dark)(?:$|:)|data-\[(?:surface|prominence)=["']?inverted["']?\]|\[data-(?:surface|prominence)=["']?inverted["']?\]/.test(
    variant
  );
}

function unwrapImmediateUnknownCast(node) {
  let curr = node;
  while (curr && (curr.type === 'ParenthesizedExpression' || curr.type === 'TSNonNullExpression')) {
    curr = curr.expression;
  }
  return curr;
}

/**
 * Oxlint JS plugin for Eolas UI behavior, accessibility, and Base UI primitive guardrails.
 */
export const plugin = {
  meta: {
    name: 'eolas',
  },
  rules: {
    'no-positive-tabindex': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow positive tabIndex values that break natural focus order and roving focus.',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name?.name !== 'tabIndex' || !node.value) return;
            const isPositive =
              node.value.type === 'Literal'
                ? (evalStaticNumericLiteral(node.value) ?? 0) > 0
                : node.value.type === 'JSXExpressionContainer'
                  ? containsPositiveNumericLiteral(node.value.expression)
                  : false;
            if (isPositive) {
              context.report({
                node,
                message: 'Avoid positive tabIndex (> 0). Use 0, -1 (roving focus), or natural DOM order.',
              });
            }
          },
        };
      },
    },
    'require-iscomposing-on-enter': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Require React nativeEvent.isComposing or keyCode === 229 guard in text-entry Enter key handlers.',
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
          const existing = currentScope.get(name);
          if (existing) existing.push(fnNode);
          else currentScope.set(name, [fnNode]);
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
          'Program:exit'() {
            for (const { attr, scopeChain } of onKeyDownEntries) {
              const expr = attr.value.expression;
              if (astChecksReactImeComposing(expr, visitorKeys)) {
                continue;
              }
              const candidates = [expr];

              if (expr.type === 'Identifier') {
                const defs = lookupFunctions(expr.name, scopeChain);
                if (defs) candidates.push(...defs);
              } else if (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') {
                const callees = collectCalleeNames(expr, visitorKeys);
                for (const calleeName of callees) {
                  const defs = lookupFunctions(calleeName, scopeChain);
                  if (defs) candidates.push(...defs);
                }
              }

              for (const candidateNode of candidates) {
                if (
                  astChecksEnterKey(candidateNode, visitorKeys) &&
                  !astChecksReactImeComposing(candidateNode, visitorKeys)
                ) {
                  context.report({
                    node: attr,
                    message:
                      'Enter key handler on text input must guard against IME composition (e.g. !e.nativeEvent.isComposing && e.keyCode !== 229).',
                  });
                  break;
                }
              }
            }
            popScope();
          },
          BlockStatement: pushScope,
          'BlockStatement:exit': popScope,
          FunctionDeclaration(node) {
            if (node.id?.name) {
              recordFunction(node.id.name, node);
            }
            pushScope();
          },
          'FunctionDeclaration:exit': popScope,
          FunctionExpression: pushScope,
          'FunctionExpression:exit': popScope,
          ArrowFunctionExpression: pushScope,
          'ArrowFunctionExpression:exit': popScope,
          VariableDeclarator(node) {
            if (node.id?.type !== 'Identifier') return;
            const fnNode = getFunctionExpressionFromInit(node.init);
            if (fnNode) {
              recordFunction(node.id.name, fnNode);
            }
          },
          JSXOpeningElement(node) {
            openingStack.push(node);
          },
          'JSXOpeningElement:exit'() {
            openingStack.pop();
          },
          JSXAttribute(node) {
            if (
              node.name?.name === 'onKeyDown' &&
              node.value?.type === 'JSXExpressionContainer' &&
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
    'no-static-clickable-elements': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require interactive role, non-negative tabIndex, and keyboard handler when attaching onClick to static HTML elements.',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const tagName = node.name?.name;
            if (!STATIC_CLICKABLE_TAGS.has(tagName)) return;
            const attrs = node.attributes || [];
            const hasOnClick = attrs.some((a) => a.type === 'JSXAttribute' && a.name?.name === 'onClick');
            if (!hasOnClick) return;

            const roleAttr = attrs.find((a) => a.type === 'JSXAttribute' && a.name?.name === 'role');
            const roleVal = getStaticStringFromAttr(roleAttr)?.toLowerCase();
            const hasInteractiveRole = Boolean(roleAttr) && roleVal !== 'presentation' && roleVal !== 'none';

            const tabIndexAttr = attrs.find((a) => a.type === 'JSXAttribute' && a.name?.name === 'tabIndex');
            let hasValidTabIndex = false;
            if (tabIndexAttr?.value) {
              if (tabIndexAttr.value.type === 'JSXExpressionContainer') {
                const staticNum = evalStaticNumericLiteral(tabIndexAttr.value.expression);
                hasValidTabIndex = staticNum === null ? true : staticNum >= 0;
              } else {
                const staticNum = evalStaticNumericLiteral(tabIndexAttr.value);
                hasValidTabIndex = staticNum !== null && staticNum >= 0;
              }
            }

            const hasKeyHandler = attrs.some(
              (a) => a.type === 'JSXAttribute' && (a.name?.name === 'onKeyDown' || a.name?.name === 'onKeyUp')
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
    'no-raw-html-controls': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Forbid raw HTML interactive elements (<button>, <input>, <select>, <textarea>, <dialog>) outside primitive libraries and Base UI render props.',
        },
        schema: [],
      },
      create(context) {
        const renderElementDepthStack = [];
        const rootRenderOpeningNodes = new WeakSet();
        return {
          JSXAttribute(node) {
            if (node.name?.name === 'render') {
              renderElementDepthStack.push(0);
            }
          },
          'JSXAttribute:exit'(node) {
            if (node.name?.name === 'render') {
              renderElementDepthStack.pop();
            }
          },
          JSXElement(node) {
            if (renderElementDepthStack.length > 0) {
              const topIdx = renderElementDepthStack.length - 1;
              const depthBefore = renderElementDepthStack[topIdx];
              if (depthBefore === 0 && node.openingElement) {
                rootRenderOpeningNodes.add(node.openingElement);
              }
              renderElementDepthStack[topIdx] = depthBefore + 1;
            }
          },
          'JSXElement:exit'() {
            if (renderElementDepthStack.length > 0) {
              const topIdx = renderElementDepthStack.length - 1;
              renderElementDepthStack[topIdx] = Math.max(0, renderElementDepthStack[topIdx] - 1);
            }
          },
          JSXOpeningElement(node) {
            if (rootRenderOpeningNodes.has(node)) return;
            if (node.name?.type !== 'JSXIdentifier') return;
            const tag = node.name.name;
            const message = RAW_HTML_CONTROL_MESSAGES[tag];
            if (!message) return;

            if (tag === 'input') {
              const typeAttr = (node.attributes || []).find(
                (a) => a.type === 'JSXAttribute' && a.name?.name === 'type'
              );
              const typeVal = getStaticStringFromAttr(typeAttr)?.toLowerCase();
              if (typeVal === 'hidden' || typeVal === 'file') return;
            }

            context.report({ node, message });
          },
        };
      },
    },
    'no-radix-imports': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Forbid @radix-ui/* and radix-ui imports; use Base UI primitives from @/components/ui/.',
        },
        schema: [],
      },
      create(context) {
        const reportIfRadix = (node, specifier) => {
          if (isRadixSpecifier(specifier)) {
            context.report({
              node,
              message: 'Radix UI (@radix-ui/* / radix-ui) is prohibited. Use Base UI primitives from @/components/ui/.',
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
              node.callee?.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments?.length > 0
            ) {
              reportIfRadix(node, getStaticStringFromExpr(node.arguments[0]));
            }
          },
        };
      },
    },
    'no-nested-card': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow nesting <Card> inside <Card> per DESIGN.md surface hierarchy.',
        },
        schema: [],
      },
      create(context) {
        let cardDepth = 0;
        const cardStack = [];
        return {
          JSXElement(node) {
            const isCard =
              node.openingElement?.name?.type === 'JSXIdentifier' && node.openingElement.name.name === 'Card';
            cardStack.push(isCard);
            if (!isCard) return;
            if (cardDepth > 0) {
              context.report({
                node: node.openingElement,
                message:
                  'Nested <Card> detected. DESIGN.md bans nesting Cards inside Cards; use unboxed layout, dividers, or <ClinicianTip />.',
              });
            }
            cardDepth += 1;
          },
          'JSXElement:exit'() {
            if (cardStack.pop()) {
              cardDepth = Math.max(0, cardDepth - 1);
            }
          },
        };
      },
    },
    'no-sparkle-icons': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow generic sparkle/magic icons (stars, auto_awesome, auto_fix_high) for AI features.',
        },
        schema: [],
      },
      create(context) {
        const message =
          'Generic sparkle/magic icons ("stars", "auto_awesome", "auto_fix_high") are banned. Use a functional task icon (e.g. translate, summarize, spellcheck, tune, bolt).';

        return {
          JSXElement(node) {
            const opening = node.openingElement;
            if (!opening) return;
            const { full } = getJsxTagParts(opening.name);
            const attrs = opening.attributes || [];
            const propSet = ICON_COMPONENT_NAMES.has(full) ? ICON_PROP_NAMES : GENERIC_ICON_PROP_NAMES;

            let isMaterialSymbol = false;
            for (const attr of attrs) {
              if (attr.type !== 'JSXAttribute' || !attr.name?.name) continue;
              const attrName = attr.name.name;

              if (propSet.has(attrName) && attr.value) {
                const values =
                  attr.value.type === 'Literal' && typeof attr.value.value === 'string'
                    ? [attr.value.value]
                    : attr.value.type === 'JSXExpressionContainer'
                      ? collectStaticStringsFromExpr(attr.value.expression)
                      : [];
                if (values.some((v) => BANNED_SPARKLE_ICONS.has(v.trim()))) {
                  context.report({ node: attr, message });
                }
              }

              if (attrName === 'className' || attrName === 'class') {
                const groups = extractClassGroupsFromAttr(attr, null);
                if (groups.some((g) => /\bmaterial-symbols(?:-outlined|-rounded|-sharp)?\b/.test(g.text))) {
                  isMaterialSymbol = true;
                }
              }
            }

            if (isMaterialSymbol) {
              for (const child of node.children || []) {
                if (child.type === 'JSXText' && BANNED_SPARKLE_ICONS.has(child.value.trim())) {
                  context.report({ node: child, message });
                } else if (child.type === 'JSXExpressionContainer') {
                  const vals = collectStaticStringsFromExpr(child.expression);
                  if (vals.some((v) => BANNED_SPARKLE_ICONS.has(v.trim()))) {
                    context.report({ node: child, message });
                  }
                }
              }
            }
          },
        };
      },
    },
    'no-triple-tint': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow triple-tint monochrome bg + border + text classes sharing the same hue.',
        },
        schema: [],
      },
      create: createClassGroupVisitor((context, groups) => {
        for (const group of groups) {
          const hue = findTripleTintHueInTokens(splitTailwindTokens(group.text));
          if (hue) {
            context.report({
              node: group.node,
              message: `Triple-tint monochrome pattern ("bg-${hue}*", "border-${hue}*", and "text-${hue}*" share one hue). Use Filled, Outline + neutral surface, or Soft Wash (*-container + on-*-container + border-transparent).`,
            });
          }
        }
      }),
    },
    'no-light-surface-tertiary': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow Sunny Amber text-tertiary and border-tertiary on light surfaces (fails WCAG AA 1.99:1 contrast).',
        },
        schema: [],
      },
      create(context) {
        let invertedDepth = 0;
        const invertedStack = [];
        const visitedCalls = new WeakSet();
        const message =
          'Sunny Amber (`text-tertiary` / `border-tertiary`) is banned on light surfaces (fails WCAG AA 1.99:1). Use `tertiary` only for solid fills with neutral text, `*-container` washes, or inside inverted dark surfaces (`inverted:text-tertiary`).';

        const checkGroups = (groups) => {
          if (invertedDepth > 0) return;
          for (const group of groups) {
            const tokens = splitTailwindTokens(group.text);
            const hasSolidBgTertiaryForVariant = (variant) =>
              tokens.some((t) => t.variant === variant && t.base === 'bg-tertiary' && !t.hasOpacity);

            for (const token of tokens) {
              if (token.base !== 'text-tertiary' && token.base !== 'border-tertiary') continue;
              if (hasInvertedVariantPrefix(token.variant)) continue;
              if (token.base === 'border-tertiary' && !token.hasOpacity && hasSolidBgTertiaryForVariant(token.variant)) {
                continue;
              }
              context.report({ node: group.node, message });
              break;
            }
          }
        };

        return {
          JSXElement(node) {
            const isInverted = isInvertedOpeningElement(node.openingElement);
            invertedStack.push(isInverted);
            if (isInverted) invertedDepth += 1;
          },
          'JSXElement:exit'() {
            if (invertedStack.pop()) {
              invertedDepth = Math.max(0, invertedDepth - 1);
            }
          },
          JSXAttribute(node) {
            const attrName = node.name?.name;
            if (attrName !== 'className' && attrName !== 'class') return;
            checkGroups(extractClassGroupsFromAttr(node, visitedCalls));
          },
          CallExpression(node) {
            if (visitedCalls.has(node)) return;
            if (!CLASS_HELPER_NAMES.has(getCalleeName(node.callee))) return;
            visitedCalls.add(node);
            checkGroups(extractClassGroupsFromExpr(node, visitedCalls));
          },
        };
      },
    },
    'no-transition-all': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow blanket transition-all utility classes and inline transition: all styles.',
        },
        schema: [],
      },
      create(context) {
        const visitedCalls = new WeakSet();
        const styleKeys = new Set(['transition', 'transitionProperty']);
        const message =
          'Blanket `transition-all` is banned per DESIGN.md Motion Law. Declare explicit targeted properties (e.g. `transition-[box-shadow,border-color,background-color,transform]`).';

        const checkGroups = (groups) => {
          for (const group of groups) {
            const tokens = splitTailwindTokens(group.text);
            if (tokens.some((t) => t.base === 'transition-all')) {
              context.report({ node: group.node, message });
            }
          }
        };

        return {
          JSXAttribute(node) {
            const attrName = node.name?.name;
            if (attrName === 'className' || attrName === 'class') {
              checkGroups(extractClassGroupsFromAttr(node, visitedCalls));
            } else if (attrName === 'style') {
              for (const prop of getInlineStyleProperties(node, styleKeys)) {
                if (/\ball\b/i.test(prop.value)) {
                  context.report({ node: prop.node, message });
                }
              }
            }
          },
          CallExpression(node) {
            if (visitedCalls.has(node)) return;
            if (!CLASS_HELPER_NAMES.has(getCalleeName(node.callee))) return;
            visitedCalls.add(node);
            checkGroups(extractClassGroupsFromExpr(node, visitedCalls));
          },
        };
      },
    },
    'no-spring-easing': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Restrict spring/bounce easing to celebratory milestone moments (e.g. SuccessCheck).',
        },
        schema: [],
      },
      create(context) {
        const baseFile = path.basename(getFilename(context));
        if (CELEBRATORY_NAME_RE.test(baseFile)) return {};

        const visitedCalls = new WeakSet();
        const fnNameStack = [];
        const styleKeys = new Set([
          'transition',
          'transitionTimingFunction',
          'animation',
          'animationTimingFunction',
        ]);
        const message =
          'Bounce/spring easing (`ease-spring`, `ease-bounce`, `--ease-spring`) is restricted to celebratory milestone moments (e.g. SuccessCheck). Use `--ease-standard` on standard UI chrome.';

        const isInsideCelebratoryComponent = () => fnNameStack.some((n) => CELEBRATORY_NAME_RE.test(n));

        const checkGroups = (groups) => {
          if (isInsideCelebratoryComponent()) return;
          for (const group of groups) {
            const tokens = splitTailwindTokens(group.text);
            const hasViolation = tokens.some(
              (t) => SPRING_EASING_CLASS_RE.test(t.base) || SPRING_EASING_VAR_RE.test(t.raw)
            );
            if (hasViolation) {
              context.report({ node: group.node, message });
            }
          }
        };

        return {
          FunctionDeclaration(node) {
            fnNameStack.push(node.id?.name || '');
          },
          'FunctionDeclaration:exit'() {
            fnNameStack.pop();
          },
          VariableDeclarator(node) {
            const fnNode = getFunctionExpressionFromInit(node.init);
            if (fnNode && node.id?.type === 'Identifier') {
              fnNameStack.push(node.id.name);
            }
          },
          'VariableDeclarator:exit'(node) {
            const fnNode = getFunctionExpressionFromInit(node.init);
            if (fnNode && node.id?.type === 'Identifier') {
              fnNameStack.pop();
            }
          },
          JSXAttribute(node) {
            const attrName = node.name?.name;
            if (attrName === 'className' || attrName === 'class') {
              checkGroups(extractClassGroupsFromAttr(node, visitedCalls));
            } else if (attrName === 'style' && !isInsideCelebratoryComponent()) {
              for (const prop of getInlineStyleProperties(node, styleKeys)) {
                if (SPRING_EASING_VAR_RE.test(prop.value)) {
                  context.report({ node: prop.node, message });
                }
              }
            }
          },
          CallExpression(node) {
            if (visitedCalls.has(node)) return;
            if (!CLASS_HELPER_NAMES.has(getCalleeName(node.callee))) return;
            visitedCalls.add(node);
            checkGroups(extractClassGroupsFromExpr(node, visitedCalls));
          },
        };
      },
    },
    'no-uppercase': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow all-caps `uppercase` Tailwind class and `textTransform: uppercase` inline style.',
        },
        schema: [],
      },
      create(context) {
        const visitedCalls = new WeakSet();
        const styleKeys = new Set(['textTransform']);
        const message =
          'All-caps `uppercase` styling is banned per DESIGN.md. Use sentence case on labels, badges, buttons, and headers.';

        const checkGroups = (groups) => {
          for (const group of groups) {
            const tokens = splitTailwindTokens(group.text);
            if (tokens.some((t) => t.base === 'uppercase')) {
              context.report({ node: group.node, message });
            }
          }
        };

        return {
          JSXAttribute(node) {
            const attrName = node.name?.name;
            if (attrName === 'className' || attrName === 'class') {
              checkGroups(extractClassGroupsFromAttr(node, visitedCalls));
            } else if (attrName === 'style') {
              for (const prop of getInlineStyleProperties(node, styleKeys)) {
                if (prop.value.trim().toLowerCase() === 'uppercase') {
                  context.report({ node: prop.node, message });
                }
              }
            }
          },
          CallExpression(node) {
            if (visitedCalls.has(node)) return;
            if (!CLASS_HELPER_NAMES.has(getCalleeName(node.callee))) return;
            visitedCalls.add(node);
            checkGroups(extractClassGroupsFromExpr(node, visitedCalls));
          },
        };
      },
    },
    'no-unsafe-type-cast': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow `as any` and `as unknown as T` double-cast escape hatches.',
        },
        schema: [],
      },
      create(context) {
        const checkAssertion = (node) => {
          if (node.typeAnnotation?.type === 'TSAnyKeyword') {
            context.report({
              node,
              message:
                'Unsafe type assertion (`as any`) is prohibited. Use proper discriminated unions, generics, or runtime narrowing.',
            });
            return;
          }
          const inner = unwrapImmediateUnknownCast(node.expression);
          if (
            inner &&
            (inner.type === 'TSAsExpression' || inner.type === 'TSTypeAssertion') &&
            inner.typeAnnotation?.type === 'TSUnknownKeyword'
          ) {
            context.report({
              node,
              message:
                'Unsafe double assertion (`as unknown as T`) is prohibited. Align types properly or narrow with a type guard.',
            });
          }
        };

        return {
          TSAsExpression: checkAssertion,
          TSTypeAssertion: checkAssertion,
        };
      },
    },
  },
};

export default plugin;
