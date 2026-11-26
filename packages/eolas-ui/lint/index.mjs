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
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'figure',
  'main',
  'aside',
  'nav',
  'table',
  'th',
  'dt',
  'dd',
]);

const INTERACTIVE_ARIA_ROLES = new Set([
  'button',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'switch',
  'tab',
  'treeitem',
  'checkbox',
  'gridcell',
  'row',
  'combobox',
  'listbox',
  'slider',
  'spinbutton',
  'textbox',
  'searchbox',
]);

const LIGHT_SURFACE_TERTIARY_UTILITIES = new Set([
  'text-tertiary',
  'border-tertiary',
  'border-s-tertiary',
  'border-e-tertiary',
  'border-t-tertiary',
  'border-b-tertiary',
  'border-x-tertiary',
  'border-y-tertiary',
  'border-l-tertiary',
  'border-r-tertiary',
  'ring-tertiary',
  'outline-tertiary',
  'decoration-tertiary',
  'divide-tertiary',
  'fill-tertiary',
  'stroke-tertiary',
  'caret-tertiary',
  'accent-tertiary',
]);

const WRAPPED_HEADLESS_LIBS = [
  '@base-ui/react',
  '@base-ui-components/react',
  '@headlessui/react',
  'react-aria-components',
  '@ark-ui/react',
];

const ICON_BUTTON_COMPONENT_NAMES = new Set([
  'Button',
  'ButtonRoot',
  'Button.Root',
  'UnstyledButton',
  'Button.Unstyled',
  'IconButton',
  'InputGroupButton',
  'InputGroup.Button',
  'ToolbarButton',
  'Toolbar.Button',
]);

const ICON_ELEMENT_NAMES = new Set([
  'Icon',
  'Icon.Toggle',
  'Icon.CrossFade',
  'ToggleIcon',
  'CrossFadeIcon',
  'svg',
]);

const SQUARE_SHORTHAND_EXCLUDED_VALUES = new Set([
  'auto',
  'min',
  'max',
  'fit',
  'screen',
  'dvh',
  'svh',
  'lvh',
  'dvw',
  'svw',
  'lvw',
]);

const OVERLAY_HTML_TAGS = new Set(['div', 'section', 'aside']);

function isWrappedHeadlessSpecifier(source) {
  if (typeof source !== 'string') return false;
  return WRAPPED_HEADLESS_LIBS.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));
}

function getFileLayer(filename) {
  const norm = String(filename || '').replace(/\\/g, '/');
  if (/(?:^|\/)(?:src\/)?(?:components\/ui|ui)\//i.test(norm)) return 'ui';
  if (/(?:^|\/)(?:src\/)?components\/blocks\//i.test(norm)) return 'blocks';
  return null;
}

const BANNED_LAYER_PACKAGES = [
  /^firebase(?:\/|$)/,
  /^@firebase(?:\/|$)/,
  /^@supabase(?:\/|$)/,
  /^@tanstack\/react-query(?:\/|$)/,
];

const CARD_SURFACE_COMPONENTS = new Set([
  'Card',
  'Card.Root',
  'ChartCard',
  'AreaChartCard',
  'BarChartCard',
  'LineChartCard',
  'PieChartCard',
  'RadarChartCard',
  'RadialChartCard',
]);

const REST_PROP_SPREAD_NAMES = new Set(['props', 'rest', 'restProps']);

function isRestParamBoundIdentifier(node, name) {
  let curr = node?.parent;
  while (curr) {
    if (
      curr.type === 'FunctionDeclaration' ||
      curr.type === 'FunctionExpression' ||
      curr.type === 'ArrowFunctionExpression'
    ) {
      for (const param of curr.params || []) {
        if (param?.type === 'RestElement' && param.argument?.type === 'Identifier' && param.argument.name === name) {
          return true;
        }
        if (param?.type === 'ObjectPattern') {
          for (const prop of param.properties || []) {
            if (prop?.type === 'RestElement' && prop.argument?.type === 'Identifier' && prop.argument.name === name) {
              return true;
            }
          }
        }
      }
    }
    curr = curr.parent;
  }
  return false;
}

function getImportTargetLayer(specifier, filename) {
  if (typeof specifier !== 'string' || !specifier) return null;
  const normSpec = specifier.replace(/\\/g, '/');

  if (BANNED_LAYER_PACKAGES.some((re) => re.test(normSpec))) {
    return 'package';
  }

  let target = normSpec;

  if (normSpec.startsWith('./') || normSpec.startsWith('../')) {
    const normFile = String(filename || '').replace(/\\/g, '/');
    target = path.posix.normalize(path.posix.join(path.posix.dirname(normFile), normSpec));
  } else if (!normSpec.startsWith('@/') && !normSpec.startsWith('~/')) {
    return null;
  }

  if (/(?:^|\/)(?:src\/)?components\/blocks(?:\/|$)/i.test(target)) return 'blocks';
  if (/(?:^|\/)(?:src\/)?features(?:\/|$)/i.test(target)) return 'features';
  if (/(?:^|\/)(?:src\/)?views(?:\/|$)/i.test(target)) return 'views';
  if (/(?:^|\/)(?:src\/)?(services|api|auth)(?:\/|$)/i.test(target)) {
    const match = target.match(/(?:^|\/)(?:src\/)?(services|api|auth)(?:\/|$)/i);
    return match ? match[1].toLowerCase() : 'services';
  }
  return null;
}

function splitVariantSegments(variantStr) {
  if (!variantStr) return [];
  const segments = [];
  let bracketDepth = 0;
  let start = 0;
  for (let i = 0; i < variantStr.length; i++) {
    const ch = variantStr[i];
    if (ch === '[') bracketDepth += 1;
    else if (ch === ']' && bracketDepth > 0) bracketDepth -= 1;
    else if (ch === ':' && bracketDepth === 0) {
      segments.push(variantStr.slice(start, i));
      start = i + 1;
    }
  }
  segments.push(variantStr.slice(start));
  return segments;
}

function hasVariantSegment(variantStr, targetSegment) {
  return splitVariantSegments(variantStr).includes(targetSegment);
}

function hasReachInSelector(variantStr) {
  for (const seg of splitVariantSegments(variantStr)) {
    if (!seg.startsWith('[') || !seg.endsWith(']')) continue;
    const inner = seg.slice(1, -1);
    if (!inner.includes('&')) continue;

    let nestedBrackets = 0;
    let quote = null;
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (quote) {
        if (ch === '\\' && i + 1 < inner.length) {
          i += 1;
        } else if (ch === quote) {
          quote = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        continue;
      }
      if (ch === '[') {
        nestedBrackets += 1;
        continue;
      }
      if (ch === ']' && nestedBrackets > 0) {
        nestedBrackets -= 1;
        continue;
      }
      if (nestedBrackets === 0 && (ch === '_' || ch === '>' || ch === '+' || ch === '~')) {
        return true;
      }
    }
  }
  return false;
}

function isTransitionAllToken(base) {
  if (base === 'transition-all') return true;
  if (base.startsWith('transition-[') && base.endsWith(']')) {
    const payload = base.slice('transition-['.length, -1);
    return /(?:^|[,_\s])all(?:$|[,_\s])/i.test(payload);
  }
  return false;
}

function isComponentJsxName(nameNode) {
  if (!nameNode) return false;
  if (nameNode.type === 'JSXMemberExpression') return true;
  if (nameNode.type === 'JSXIdentifier') {
    return /^[A-Z]/.test(nameNode.name);
  }
  return false;
}

function collectReturnedRootJsxOpeningElements(exprNode, visitorKeys, outSet) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return;
  if (expr.type === 'JSXElement') {
    if (expr.openingElement) {
      outSet.add(expr.openingElement);
    }
    return;
  }
  if (expr.type === 'JSXFragment') {
    return;
  }
  if (expr.type === 'ConditionalExpression') {
    collectReturnedRootJsxOpeningElements(expr.consequent, visitorKeys, outSet);
    collectReturnedRootJsxOpeningElements(expr.alternate, visitorKeys, outSet);
    return;
  }
  if (expr.type === 'LogicalExpression') {
    collectReturnedRootJsxOpeningElements(expr.left, visitorKeys, outSet);
    collectReturnedRootJsxOpeningElements(expr.right, visitorKeys, outSet);
    return;
  }
  if (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') {
    if (!expr.body) return;
    if (expr.body.type !== 'BlockStatement') {
      collectReturnedRootJsxOpeningElements(expr.body, visitorKeys, outSet);
      return;
    }
    const visitBlockNode = (curr) => {
      if (!curr || typeof curr !== 'object') return;
      if (
        curr.type === 'FunctionDeclaration' ||
        curr.type === 'FunctionExpression' ||
        curr.type === 'ArrowFunctionExpression' ||
        curr.type === 'ClassDeclaration' ||
        curr.type === 'ClassExpression'
      ) {
        return;
      }
      if (curr.type === 'ReturnStatement') {
        if (curr.argument) {
          collectReturnedRootJsxOpeningElements(curr.argument, visitorKeys, outSet);
        }
        return;
      }
      const keys = visitorKeys[curr.type] || Object.keys(curr);
      for (const key of keys) {
        if (key === 'parent' || key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') continue;
        const child = curr[key];
        if (Array.isArray(child)) {
          for (const item of child) {
            if (item && typeof item.type === 'string') visitBlockNode(item);
          }
        } else if (child && typeof child.type === 'string') {
          visitBlockNode(child);
        }
      }
    };
    visitBlockNode(expr.body);
  }
}

const MAX_CLASS_BRANCHES = 32;

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
  let curr = unwrapTypeExpr(init);
  let depth = 0;
  while (curr && depth < 8) {
    if (curr.type === 'ArrowFunctionExpression' || curr.type === 'FunctionExpression') {
      return curr;
    }
    if (curr.type === 'CallExpression' && curr.arguments?.length > 0) {
      curr = unwrapTypeExpr(curr.arguments[0]);
      depth += 1;
      continue;
    }
    break;
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

const EQUALITY_OPERATORS = new Set(['===', '==', '!==', '!=']);

function astChecksEnterKey(fnNode, visitorKeys) {
  if (!fnNode) return false;
  const keyNames = collectDestructuredPropNames(fnNode, 'key', visitorKeys);
  return walkAst(fnNode, visitorKeys, (curr) => {
    if (curr.type === 'BinaryExpression' && EQUALITY_OPERATORS.has(curr.operator)) {
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

  return walkAst(fnNode, visitorKeys, (curr) => {
    if (curr.type === 'MemberExpression' && getMemberPropertyName(curr) === 'isComposing') {
      if (isNativeEventAccess(curr.object)) return true;
    }
    if (curr.type === 'ObjectPattern') {
      for (const prop of curr.properties || []) {
        if (prop.type !== 'Property') continue;
        if (getPropertyKeyName(prop.key, prop.computed) !== 'nativeEvent') continue;
        const nestedPattern = prop.value?.type === 'AssignmentPattern' ? prop.value.left : prop.value;
        if (nestedPattern?.type === 'ObjectPattern') {
          const hasIsComposing = (nestedPattern.properties || []).some(
            (sub) => sub.type === 'Property' && getPropertyKeyName(sub.key, sub.computed) === 'isComposing'
          );
          if (hasIsComposing) return true;
        }
      }
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
    if (curr.type === 'BinaryExpression' && EQUALITY_OPERATORS.has(curr.operator)) {
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
    const rawAfterVariant = lastColon === -1 ? rawToken : rawToken.slice(lastColon + 1);
    const hasImportant = /^!|!$/.test(rawAfterVariant);
    const afterVariant = rawAfterVariant.replace(/^!|!$/g, '');
    const slashIdx = findOpacitySlash(afterVariant);
    const base = slashIdx === -1 ? afterVariant : afterVariant.slice(0, slashIdx);
    tokens.push({
      raw: rawToken,
      variant,
      afterVariant,
      base,
      hasImportant,
      hasOpacity: slashIdx !== -1,
    });
  }
  return tokens;
}

function isTrackableClassInit(exprNode) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return false;
  if (expr.type === 'Literal' && typeof expr.value === 'string') return true;
  if (expr.type === 'TemplateLiteral') return true;
  if (expr.type === 'Identifier') return true;
  if (expr.type === 'CallExpression') {
    return CLASS_HELPER_NAMES.has(getCalleeName(expr.callee));
  }
  if (expr.type === 'ConditionalExpression') {
    return isTrackableClassInit(expr.consequent) || isTrackableClassInit(expr.alternate);
  }
  if (expr.type === 'LogicalExpression') {
    return isTrackableClassInit(expr.left) || isTrackableClassInit(expr.right);
  }
  if (expr.type === 'BinaryExpression' && expr.operator === '+') {
    return isTrackableClassInit(expr.left) || isTrackableClassInit(expr.right);
  }
  if (expr.type === 'ArrayExpression') {
    return (expr.elements || []).some((el) => el && isTrackableClassInit(el.type === 'SpreadElement' ? el.argument : el));
  }
  return false;
}

function markNestedHelperCalls(node, visitorKeys, targetSet) {
  if (!node || typeof node !== 'object') return;
  if (
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'FunctionExpression' ||
    node.type === 'FunctionDeclaration' ||
    node.type === 'JSXElement' ||
    node.type === 'JSXFragment'
  ) {
    return;
  }
  if (node.type === 'CallExpression' && CLASS_HELPER_NAMES.has(getCalleeName(node.callee))) {
    targetSet.add(node);
  }
  const keys = visitorKeys[node.type] || Object.keys(node);
  for (const key of keys) {
    if (key === 'parent' || key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item.type === 'string') {
          markNestedHelperCalls(item, visitorKeys, targetSet);
        }
      }
    } else if (child && typeof child.type === 'string') {
      markNestedHelperCalls(child, visitorKeys, targetSet);
    }
  }
}

function extractClassGroupsFromExpr(exprNode, visitedCalls, groups = [], resolveVar = null, seenVars = new Set(), overrideNode = null) {
  const expr = unwrapTypeExpr(exprNode);
  if (!expr) return groups;

  if (expr.type === 'Identifier' && resolveVar) {
    if (seenVars.has(expr.name)) return groups;
    const binding = resolveVar(expr.name);
    if (binding) {
      seenVars.add(expr.name);
      extractClassGroupsFromExpr(binding.init, visitedCalls, groups, resolveVar, seenVars, overrideNode || exprNode);
      seenVars.delete(expr.name);
    }
    return groups;
  }

  const direct = getStaticStringFromExpr(expr);
  if (direct !== null) {
    groups.push({ text: direct, node: overrideNode || exprNode });
    return groups;
  }

  if (expr.type === 'TemplateLiteral') {
    const quasisText = expr.quasis.map((q) => q.value?.cooked ?? '').join(' ');
    if (quasisText.trim()) {
      groups.push({ text: quasisText, node: overrideNode || expr });
    }
    for (const sub of expr.expressions || []) {
      extractClassGroupsFromExpr(sub, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    }
    return groups;
  }

  if (expr.type === 'BinaryExpression' && expr.operator === '+') {
    const leftStatic = getStaticStringFromExpr(expr.left);
    const rightStatic = getStaticStringFromExpr(expr.right);
    if (leftStatic !== null && rightStatic !== null) {
      groups.push({ text: `${leftStatic}${rightStatic}`, node: overrideNode || expr });
      return groups;
    }
    extractClassGroupsFromExpr(expr.left, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    extractClassGroupsFromExpr(expr.right, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    return groups;
  }

  if (expr.type === 'ConditionalExpression') {
    extractClassGroupsFromExpr(expr.consequent, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    extractClassGroupsFromExpr(expr.alternate, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    return groups;
  }

  if (expr.type === 'LogicalExpression') {
    if (expr.operator === '||' || expr.operator === '??') {
      extractClassGroupsFromExpr(expr.left, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    }
    extractClassGroupsFromExpr(expr.right, visitedCalls, groups, resolveVar, seenVars, overrideNode);
    return groups;
  }

  if (expr.type === 'ArrayExpression') {
    const unconditionalParts = [];
    for (const elem of expr.elements || []) {
      if (!elem) continue;
      if (elem.type === 'SpreadElement') {
        extractClassGroupsFromExpr(elem.argument, visitedCalls, groups, resolveVar, seenVars, overrideNode);
        continue;
      }
      const staticVal = getStaticStringFromExpr(elem);
      if (staticVal !== null) {
        unconditionalParts.push(staticVal);
      } else {
        extractClassGroupsFromExpr(elem, visitedCalls, groups, resolveVar, seenVars, overrideNode);
      }
    }
    if (unconditionalParts.length > 0) {
      groups.push({ text: unconditionalParts.join(' '), node: overrideNode || expr });
    }
    return groups;
  }

  if (expr.type === 'ObjectExpression') {
    for (const prop of expr.properties || []) {
      if (prop.type !== 'Property') continue;
      const keyName = getPropertyKeyName(prop.key, prop.computed);
      if (keyName) {
        groups.push({ text: keyName, node: overrideNode || prop.key });
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
        extractClassGroupsFromExpr(baseArg, visitedCalls, groups, resolveVar, seenVars, overrideNode);
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
                      extractClassGroupsFromExpr(optProp.value, visitedCalls, groups, resolveVar, seenVars, overrideNode);
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
                    extractClassGroupsFromExpr(itemProp.value, visitedCalls, groups, resolveVar, seenVars, overrideNode);
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
        extractClassGroupsFromExpr(arg.argument, visitedCalls, groups, resolveVar, seenVars, overrideNode);
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
            extractClassGroupsFromExpr(sub, visitedCalls, groups, resolveVar, seenVars, overrideNode);
          }
        } else {
          extractClassGroupsFromExpr(arg, visitedCalls, groups, resolveVar, seenVars, overrideNode);
        }
      }
    }
    if (unconditionalParts.length > 0) {
      groups.push({ text: unconditionalParts.join(' '), node: overrideNode || expr });
    }
  }

  return groups;
}

function extractClassGroupsFromAttr(attr, visitedCalls, resolveVar = null) {
  if (!attr || !attr.value) return [];
  if (attr.value.type === 'Literal' && typeof attr.value.value === 'string') {
    return [{ text: attr.value.value, node: attr.value }];
  }
  if (attr.value.type === 'JSXExpressionContainer') {
    return extractClassGroupsFromExpr(attr.value.expression, visitedCalls, [], resolveVar);
  }
  return [];
}

function getSimpleExprPath(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return null;
  if (expr.type === 'Identifier') return expr.name;
  if (expr.type === 'MemberExpression' && !expr.computed && expr.property?.type === 'Identifier') {
    const objPath = getSimpleExprPath(expr.object);
    return objPath ? `${objPath}.${expr.property.name}` : null;
  }
  return null;
}

function getConditionSignature(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return null;
  if (expr.type === 'UnaryExpression' && expr.operator === '!') {
    const inner = getConditionSignature(expr.argument);
    return inner ? { key: inner.key, negated: !inner.negated } : null;
  }
  const simplePath = getSimpleExprPath(expr);
  if (simplePath) {
    return { key: `path:${simplePath}`, negated: false };
  }
  return null;
}

function combineBranches(branchesA, branchesB, maxBranches = MAX_CLASS_BRANCHES) {
  if (!branchesA || branchesA.length === 0) return branchesB || [];
  if (!branchesB || branchesB.length === 0) return branchesA;
  const out = [];
  for (const a of branchesA) {
    for (const b of branchesB) {
      if (out.length >= maxBranches) return out;
      const text = a.text && b.text ? `${a.text} ${b.text}` : a.text || b.text;
      out.push({ text, node: a.node || b.node });
    }
  }
  return out;
}

const INVERTED_GUARD_NAME_RE = /(?:^|_)(?:is)?(?:inverted|dark|spotlight)(?:$|_)/i;

function isInvertedConditionExpr(node) {
  const expr = unwrapTypeExpr(node);
  if (!expr) return false;
  if (expr.type === 'Identifier') {
    return INVERTED_GUARD_NAME_RE.test(expr.name);
  }
  if (expr.type === 'MemberExpression') {
    const prop = getMemberPropertyName(expr);
    return Boolean(prop && INVERTED_GUARD_NAME_RE.test(prop));
  }
  if (expr.type === 'BinaryExpression' && (expr.operator === '===' || expr.operator === '==')) {
    const leftStr = getStaticStringFromExpr(expr.left);
    const rightStr = getStaticStringFromExpr(expr.right);
    if (leftStr === 'inverted' || leftStr === 'spotlight' || leftStr === 'dark') return true;
    if (rightStr === 'inverted' || rightStr === 'spotlight' || rightStr === 'dark') return true;
  }
  if (expr.type === 'LogicalExpression') {
    if (expr.operator === '&&') {
      return isInvertedConditionExpr(expr.left) || isInvertedConditionExpr(expr.right);
    }
    if (expr.operator === '||') {
      return isInvertedConditionExpr(expr.left) && isInvertedConditionExpr(expr.right);
    }
  }
  return false;
}

function isNegatedInvertedConditionExpr(node) {
  const expr = unwrapTypeExpr(node);
  return Boolean(expr?.type === 'UnaryExpression' && expr.operator === '!' && isInvertedConditionExpr(expr.argument));
}

function extractClassBranchesFromExpr(exprNode, opts = {}) {
  const {
    visitedCalls = null,
    resolveVar = null,
    seenVars = new Set(),
    rootNode = null,
    skipInvertedBranches = false,
  } = opts;
  const expr = unwrapTypeExpr(exprNode);
  const reportNode = rootNode || exprNode;
  const childOpts = { visitedCalls, resolveVar, seenVars, rootNode: reportNode, skipInvertedBranches };
  if (!expr) return [{ text: '', node: reportNode }];

  if (expr.type === 'Identifier') {
    if (resolveVar && !seenVars.has(expr.name)) {
      const binding = resolveVar(expr.name);
      if (binding) {
        seenVars.add(expr.name);
        const result = extractClassBranchesFromExpr(binding.init, childOpts);
        seenVars.delete(expr.name);
        return result;
      }
    }
    return [{ text: '', node: reportNode }];
  }

  const direct = getStaticStringFromExpr(expr);
  if (direct !== null) {
    return [{ text: direct, node: reportNode }];
  }

  if (expr.type === 'TemplateLiteral') {
    const quasisText = expr.quasis.map((q) => q.value?.cooked ?? '').join(' ').trim();
    let acc = [{ text: quasisText, node: reportNode }];
    for (const sub of expr.expressions || []) {
      acc = combineBranches(acc, extractClassBranchesFromExpr(sub, childOpts));
    }
    return acc;
  }

  if (expr.type === 'BinaryExpression' && expr.operator === '+') {
    const leftStatic = getStaticStringFromExpr(expr.left);
    const rightStatic = getStaticStringFromExpr(expr.right);
    if (leftStatic !== null && rightStatic !== null) {
      return [{ text: `${leftStatic}${rightStatic}`, node: reportNode }];
    }
    return combineBranches(
      extractClassBranchesFromExpr(expr.left, childOpts),
      extractClassBranchesFromExpr(expr.right, childOpts)
    );
  }

  if (expr.type === 'ConditionalExpression') {
    const cons =
      skipInvertedBranches && isInvertedConditionExpr(expr.test)
        ? [{ text: '', node: reportNode }]
        : extractClassBranchesFromExpr(expr.consequent, childOpts);
    const alt =
      skipInvertedBranches && isNegatedInvertedConditionExpr(expr.test)
        ? [{ text: '', node: reportNode }]
        : extractClassBranchesFromExpr(expr.alternate, childOpts);
    return [...cons, ...alt].slice(0, MAX_CLASS_BRANCHES);
  }

  if (expr.type === 'LogicalExpression') {
    if (expr.operator === '&&') {
      if (skipInvertedBranches && isInvertedConditionExpr(expr.left)) {
        return [{ text: '', node: reportNode }];
      }
      const right = extractClassBranchesFromExpr(expr.right, childOpts);
      return [{ text: '', node: reportNode }, ...right].slice(0, MAX_CLASS_BRANCHES);
    }
    if (expr.operator === '||' || expr.operator === '??') {
      const left = extractClassBranchesFromExpr(expr.left, childOpts);
      const right = extractClassBranchesFromExpr(expr.right, childOpts);
      return [...left, ...right].slice(0, MAX_CLASS_BRANCHES);
    }
    return [{ text: '', node: reportNode }];
  }

  if (expr.type === 'ArrayExpression') {
    let acc = [{ text: '', node: reportNode }];
    for (const elem of expr.elements || []) {
      if (!elem) continue;
      const target = elem.type === 'SpreadElement' ? elem.argument : elem;
      acc = combineBranches(acc, extractClassBranchesFromExpr(target, childOpts));
    }
    return acc;
  }

  if (expr.type === 'ObjectExpression') {
    const alwaysOn = [];
    const byCondKey = new Map();
    const dynamicIndependent = [];

    for (const prop of expr.properties || []) {
      if (prop.type !== 'Property') continue;
      const keyName = getPropertyKeyName(prop.key, prop.computed);
      if (!keyName) continue;

      const val = unwrapTypeExpr(prop.value);
      if (val?.type === 'Literal') {
        if (val.value) alwaysOn.push(keyName);
        continue;
      }
      if (val?.type === 'Identifier' && val.name === 'undefined') continue;
      if (skipInvertedBranches && isInvertedConditionExpr(val)) continue;

      const sig = getConditionSignature(val);
      if (sig) {
        let bucket = byCondKey.get(sig.key);
        if (!bucket) {
          bucket = { pos: [], neg: [] };
          byCondKey.set(sig.key, bucket);
        }
        if (sig.negated) bucket.neg.push(keyName);
        else bucket.pos.push(keyName);
      } else {
        dynamicIndependent.push(keyName);
      }
    }

    let acc = [{ text: alwaysOn.join(' '), node: reportNode }];
    const singleSideGroups = [];

    for (const bucket of byCondKey.values()) {
      if (bucket.pos.length > 0 && bucket.neg.length > 0) {
        acc = combineBranches(acc, [
          { text: bucket.pos.join(' '), node: reportNode },
          { text: bucket.neg.join(' '), node: reportNode },
        ]);
      } else {
        const keys = bucket.pos.length > 0 ? bucket.pos : bucket.neg;
        if (keys.length > 0) singleSideGroups.push(keys.join(' '));
      }
    }
    for (const key of dynamicIndependent) {
      singleSideGroups.push(key);
    }

    if (singleSideGroups.length <= 4) {
      for (const groupText of singleSideGroups) {
        acc = combineBranches(acc, [
          { text: '', node: reportNode },
          { text: groupText, node: reportNode },
        ]);
      }
    } else {
      const combinedOptions = [
        { text: '', node: reportNode },
        { text: singleSideGroups.join(' '), node: reportNode },
        ...singleSideGroups.map((groupText) => ({ text: groupText, node: reportNode })),
      ];
      acc = combineBranches(acc, combinedOptions);
    }

    return acc;
  }

  if (expr.type === 'CallExpression') {
    const calleeName = getCalleeName(expr.callee);
    if (!CLASS_HELPER_NAMES.has(calleeName)) return [{ text: '', node: reportNode }];
    visitedCalls?.add(expr);

    if (calleeName === 'cva') {
      const [baseArg, configArg] = expr.arguments || [];
      const baseBranches = baseArg
        ? extractClassBranchesFromExpr(baseArg, childOpts)
        : [{ text: '', node: reportNode }];
      const out = [...baseBranches];
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
                    if (optProp.type !== 'Property') continue;
                    const optBranches = extractClassBranchesFromExpr(optProp.value, {
                      ...childOpts,
                      rootNode: optProp.value,
                    });
                    for (const combined of combineBranches(baseBranches, optBranches)) {
                      out.push({ text: combined.text, node: optProp.value });
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
                    const cvBranches = extractClassBranchesFromExpr(itemProp.value, {
                      ...childOpts,
                      rootNode: itemProp.value,
                    });
                    for (const combined of combineBranches(baseBranches, cvBranches)) {
                      out.push({ text: combined.text, node: itemProp.value });
                    }
                  }
                }
              }
            }
          }
        }
      }
      return out;
    }

    let acc = [{ text: '', node: reportNode }];
    for (const arg of expr.arguments || []) {
      const target = arg.type === 'SpreadElement' ? arg.argument : arg;
      acc = combineBranches(acc, extractClassBranchesFromExpr(target, childOpts));
    }
    return acc;
  }

  return [{ text: '', node: reportNode }];
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

function mergeVisitors(base, extra) {
  if (!extra) return base;
  const merged = { ...base };
  for (const [key, fn] of Object.entries(extra)) {
    if (merged[key]) {
      const prev = merged[key];
      merged[key] = (node) => {
        prev(node);
        fn(node);
      };
    } else {
      merged[key] = fn;
    }
  }
  return merged;
}

function createClassRuleVisitor(context, { captureContext = null, onCheckExpr, createExtra = null }) {
  const sourceCode = context.sourceCode ?? context.getSourceCode();
  const visitorKeys = sourceCode.visitorKeys || {};
  const scopeStack = [];
  const visitedCalls = new WeakSet();
  const deferredHelperCalls = new WeakSet();
  const pendingChecks = [];
  const deferredEntries = [];

  const pushScope = () => {
    scopeStack.push(new Map());
  };
  const popScope = () => {
    scopeStack.pop();
  };
  const lookupVar = (name, chain, markConsumed = false) => {
    for (let i = chain.length - 1; i >= 0; i--) {
      const entry = chain[i].get(name);
      if (entry) {
        if (markConsumed) entry.consumed = true;
        return entry;
      }
    }
    return null;
  };
  const lookupCurrentVar = (name) => lookupVar(name, scopeStack, false);

  const baseVisitors = {
    Program: pushScope,
    'Program:exit'() {
      for (const check of pendingChecks) {
        const resolveVar = (name) => lookupVar(name, check.scopeChain, true);
        onCheckExpr({
          expr: check.expr,
          rootNode: check.rootNode,
          visitedCalls,
          resolveVar,
          snapshot: check.snapshot,
        });
      }
      for (let i = deferredEntries.length - 1; i >= 0; i--) {
        const entry = deferredEntries[i];
        if (entry.consumed) continue;
        entry.consumed = true;
        const resolveVar = (name) => lookupVar(name, entry.scopeChain, true);
        onCheckExpr({
          expr: entry.init,
          rootNode: entry.init,
          visitedCalls,
          resolveVar,
          snapshot: entry.snapshot,
        });
      }
      popScope();
    },
    BlockStatement: pushScope,
    'BlockStatement:exit': popScope,
    FunctionDeclaration: pushScope,
    'FunctionDeclaration:exit': popScope,
    FunctionExpression: pushScope,
    'FunctionExpression:exit': popScope,
    ArrowFunctionExpression: pushScope,
    'ArrowFunctionExpression:exit': popScope,
    VariableDeclaration(node) {
      if (node.kind !== 'const' || scopeStack.length === 0) return;
      const currentScope = scopeStack[scopeStack.length - 1];
      for (const decl of node.declarations || []) {
        if (decl.id?.type !== 'Identifier' || !decl.init) continue;
        const unwrapped = unwrapTypeExpr(decl.init);
        if (!isTrackableClassInit(unwrapped)) continue;
        const isHelperCall =
          unwrapped?.type === 'CallExpression' && CLASS_HELPER_NAMES.has(getCalleeName(unwrapped.callee));
        const entry = {
          name: decl.id.name,
          init: decl.init,
          isHelperCall,
          consumed: false,
          scopeChain: [...scopeStack],
          snapshot: captureContext ? captureContext() : null,
        };
        currentScope.set(decl.id.name, entry);
        if (isHelperCall) {
          markNestedHelperCalls(decl.init, visitorKeys, deferredHelperCalls);
          deferredEntries.push(entry);
        }
      }
    },
    JSXAttribute(node) {
      const attrName = node.name?.name;
      if (attrName !== 'className' && attrName !== 'class' || !node.value) return;
      if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
        pendingChecks.push({
          expr: node.value,
          rootNode: node.value,
          scopeChain: [...scopeStack],
          snapshot: captureContext ? captureContext() : null,
        });
      } else if (node.value.type === 'JSXExpressionContainer' && node.value.expression) {
        markNestedHelperCalls(node.value.expression, visitorKeys, visitedCalls);
        pendingChecks.push({
          expr: node.value.expression,
          rootNode: node.value.expression,
          scopeChain: [...scopeStack],
          snapshot: captureContext ? captureContext() : null,
        });
      }
    },
    CallExpression(node) {
      if (visitedCalls.has(node) || deferredHelperCalls.has(node)) return;
      const calleeName = getCalleeName(node.callee);
      if (!CLASS_HELPER_NAMES.has(calleeName)) return;
      markNestedHelperCalls(node, visitorKeys, visitedCalls);
      pendingChecks.push({
        expr: node,
        rootNode: node,
        scopeChain: [...scopeStack],
        snapshot: captureContext ? captureContext() : null,
      });
    },
  };

  const extraVisitors = createExtra ? createExtra({ lookupCurrentVar }) : null;
  return mergeVisitors(baseVisitors, extraVisitors);
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

function isInvertedOpeningElement(openingNode, resolveVar = null) {
  if (!openingNode) return false;
  const attrs = openingNode.attributes || [];
  for (const attr of attrs) {
    if (attr.type !== 'JSXAttribute') continue;
    const attrName = attr.name?.name;
    if (attrName === 'prominence') {
      const val = getStaticStringFromAttr(attr);
      if (val === 'inverted' || val === 'spotlight') return true;
    } else if (attrName === 'variant') {
      const val = getStaticStringFromAttr(attr);
      if (val === 'inverted' || val === 'spotlight') return true;
    } else if (attrName === 'data-surface' || attrName === 'data-prominence') {
      const val = getStaticStringFromAttr(attr);
      if (val === 'inverted' || val === 'spotlight') return true;
    } else if (attrName === 'className' || attrName === 'class') {
      const groups = extractClassGroupsFromAttr(attr, null, resolveVar);
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
              const expr = unwrapTypeExpr(attr.value.expression);
              if (!expr) continue;
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
            const roleVal = getStaticStringFromAttr(roleAttr)?.trim().toLowerCase();
            let hasInteractiveRole = false;
            if (roleAttr) {
              if (roleVal) {
                hasInteractiveRole = roleVal.split(/\s+/).some((r) => INTERACTIVE_ARIA_ROLES.has(r));
              } else if (roleAttr.value?.type === 'JSXExpressionContainer') {
                const candidates = collectStaticStringsFromExpr(roleAttr.value.expression);
                hasInteractiveRole =
                  candidates.length > 0
                    ? candidates.every((c) =>
                        c.trim().toLowerCase().split(/\s+/).some((r) => INTERACTIVE_ARIA_ROLES.has(r))
                      )
                    : true;
              }
            }

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
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const visitorKeys = sourceCode.visitorKeys || {};
        const exemptRenderOpeningNodes = new WeakSet();
        return {
          JSXOpeningElement(node) {
            if (isComponentJsxName(node.name)) {
              for (const attr of node.attributes || []) {
                if (
                  attr?.type === 'JSXAttribute' &&
                  attr.name?.name === 'render' &&
                  attr.value?.type === 'JSXExpressionContainer'
                ) {
                  collectReturnedRootJsxOpeningElements(
                    attr.value.expression,
                    visitorKeys,
                    exemptRenderOpeningNodes
                  );
                }
              }
            }

            if (exemptRenderOpeningNodes.has(node)) return;
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
            const tagFull = getJsxTagParts(node.openingElement?.name).full;
            const isCard = CARD_SURFACE_COMPONENTS.has(tagFull);
            cardStack.push(isCard);
            if (!isCard) return;
            if (cardDepth > 0) {
              context.report({
                node: node.openingElement,
                message: `Nested <${tagFull}> detected. DESIGN.md bans nesting Cards inside Cards; use unboxed layout, dividers, or <ClinicianTip />.`,
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
      create(context) {
        return createClassRuleVisitor(context, {
          onCheckExpr({ expr, rootNode, visitedCalls, resolveVar }) {
            const branches = extractClassBranchesFromExpr(expr, { visitedCalls, resolveVar, rootNode });
            const reportedNodes = new WeakSet();
            for (const branch of branches) {
              if (!branch.text || reportedNodes.has(branch.node)) continue;
              const hue = findTripleTintHueInTokens(splitTailwindTokens(branch.text));
              if (hue) {
                reportedNodes.add(branch.node);
                context.report({
                  node: branch.node,
                  message: `Triple-tint monochrome pattern ("bg-${hue}*", "border-${hue}*", and "text-${hue}*" share one hue). Use Filled, Outline + neutral surface, or Soft Wash (*-container + on-*-container + border-transparent).`,
                });
              }
            }
          },
        });
      },
    },
    'no-light-surface-tertiary': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow Sunny Amber text-tertiary, border-*-tertiary, ring-tertiary, outline-tertiary, decoration-tertiary, divide-tertiary, fill-tertiary, stroke-tertiary, caret-tertiary, and accent-tertiary on light surfaces (fails WCAG AA 1.97:1 contrast).',
        },
        schema: [],
      },
      create(context) {
        let invertedDepth = 0;
        const invertedStack = [];
        const message =
          'Sunny Amber (`text-tertiary` / `border-*-tertiary` / `ring-tertiary` / `outline-tertiary` / `decoration-tertiary` / `divide-tertiary` / `fill-tertiary` / `stroke-tertiary` / `caret-tertiary` / `accent-tertiary`) is banned on light surfaces (fails WCAG AA 1.97:1). Use `tertiary` only for solid fills with neutral text, `*-container` washes, or inside inverted dark surfaces (`inverted:text-tertiary`).';

        return createClassRuleVisitor(context, {
          captureContext: () => ({ inverted: invertedDepth > 0 }),
          onCheckExpr({ expr, rootNode, visitedCalls, resolveVar, snapshot }) {
            const branches = extractClassBranchesFromExpr(expr, {
              visitedCalls,
              resolveVar,
              rootNode,
              skipInvertedBranches: true,
            });
            if (snapshot?.inverted) return;
            const reportedNodes = new WeakSet();

            for (const branch of branches) {
              if (!branch.text || reportedNodes.has(branch.node)) continue;
              const tokens = splitTailwindTokens(branch.text);
              const hasSolidBgTertiaryForVariant = (variant) =>
                tokens.some((t) => t.variant === variant && t.base === 'bg-tertiary' && !t.hasOpacity);

              for (const token of tokens) {
                if (!LIGHT_SURFACE_TERTIARY_UTILITIES.has(token.base)) continue;
                if (hasInvertedVariantPrefix(token.variant)) continue;
                const isBorderTertiary =
                  token.base === 'border-tertiary' ||
                  (token.base.startsWith('border-') && token.base.endsWith('-tertiary'));
                if (isBorderTertiary && !token.hasOpacity && hasSolidBgTertiaryForVariant(token.variant)) {
                  continue;
                }
                reportedNodes.add(branch.node);
                context.report({ node: branch.node, message });
                break;
              }
            }
          },
          createExtra: ({ lookupCurrentVar }) => ({
            JSXElement(node) {
              const isInverted = isInvertedOpeningElement(node.openingElement, lookupCurrentVar);
              invertedStack.push(isInverted);
              if (isInverted) invertedDepth += 1;
            },
            'JSXElement:exit'() {
              if (invertedStack.pop()) {
                invertedDepth = Math.max(0, invertedDepth - 1);
              }
            },
          }),
        });
      },
    },
    'no-transition-all': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow blanket transition-all / transition-[all] utility classes and inline transition: all styles.',
        },
        schema: [],
      },
      create(context) {
        const styleKeys = new Set(['transition', 'transitionProperty']);
        const message =
          'Blanket `transition-all` is banned per DESIGN.md Motion Law. Declare explicit targeted properties (e.g. `transition-[box-shadow,border-color,background-color,transform]`).';

        return createClassRuleVisitor(context, {
          onCheckExpr({ expr, visitedCalls, resolveVar }) {
            const groups = extractClassGroupsFromExpr(expr, visitedCalls, [], resolveVar);
            for (const group of groups) {
              const tokens = splitTailwindTokens(group.text);
              if (tokens.some((t) => isTransitionAllToken(t.base))) {
                context.report({ node: group.node, message });
              }
            }
          },
          createExtra: () => ({
            JSXAttribute(node) {
              if (node.name?.name !== 'style') return;
              for (const prop of getInlineStyleProperties(node, styleKeys)) {
                if (/\ball\b/i.test(prop.value)) {
                  context.report({ node: prop.node, message });
                }
              }
            },
          }),
        });
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

        return createClassRuleVisitor(context, {
          captureContext: () => ({ celebratory: isInsideCelebratoryComponent() }),
          onCheckExpr({ expr, visitedCalls, resolveVar, snapshot }) {
            const groups = extractClassGroupsFromExpr(expr, visitedCalls, [], resolveVar);
            if (snapshot?.celebratory) return;
            for (const group of groups) {
              const tokens = splitTailwindTokens(group.text);
              const hasViolation = tokens.some(
                (t) => SPRING_EASING_CLASS_RE.test(t.base) || SPRING_EASING_VAR_RE.test(t.raw)
              );
              if (hasViolation) {
                context.report({ node: group.node, message });
              }
            }
          },
          createExtra: () => ({
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
              if (node.name?.name !== 'style' || isInsideCelebratoryComponent()) return;
              for (const prop of getInlineStyleProperties(node, styleKeys)) {
                if (SPRING_EASING_VAR_RE.test(prop.value)) {
                  context.report({ node: prop.node, message });
                }
              }
            },
          }),
        });
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
        const styleKeys = new Set(['textTransform']);
        const message =
          'All-caps `uppercase` styling is banned per DESIGN.md. Use sentence case on labels, badges, buttons, and headers.';

        return createClassRuleVisitor(context, {
          onCheckExpr({ expr, visitedCalls, resolveVar }) {
            const groups = extractClassGroupsFromExpr(expr, visitedCalls, [], resolveVar);
            for (const group of groups) {
              const tokens = splitTailwindTokens(group.text);
              if (tokens.some((t) => t.base === 'uppercase')) {
                context.report({ node: group.node, message });
              }
            }
          },
          createExtra: () => ({
            JSXAttribute(node) {
              if (node.name?.name !== 'style') return;
              for (const prop of getInlineStyleProperties(node, styleKeys)) {
                if (prop.value.trim().toLowerCase() === 'uppercase') {
                  context.report({ node: prop.node, message });
                }
              }
            },
          }),
        });
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
    'one-way-imports': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce strict architectural layer boundaries: ui primitives cannot import blocks/features/views, and blocks cannot import features/views.',
        },
        schema: [],
      },
      create(context) {
        const filename = getFilename(context);
        const fileLayer = getFileLayer(filename);
        if (!fileLayer) return {};

        const checkSpecifier = (node, specifier) => {
          const targetLayer = getImportTargetLayer(specifier, filename);
          if (!targetLayer) return;

          if (fileLayer === 'ui' && (targetLayer === 'blocks' || targetLayer === 'features' || targetLayer === 'views')) {
            context.report({
              node,
              message: `Layer violation: UI primitives cannot import from ${targetLayer}/. Keep dependencies strictly one-way (ui -> blocks -> features/views).`,
            });
          } else if (fileLayer === 'blocks' && (targetLayer === 'features' || targetLayer === 'views')) {
            context.report({
              node,
              message: `Layer violation: composite blocks cannot import from ${targetLayer}/. Keep blocks pure and controlled (props in, callbacks out).`,
            });
          } else if (targetLayer === 'services' || targetLayer === 'api' || targetLayer === 'auth') {
            context.report({
              node,
              message: `Layer violation: ${fileLayer === 'ui' ? 'UI primitives' : 'composite blocks'} cannot import from ${targetLayer}/ (zero network/DB/auth coupling).`,
            });
          } else if (targetLayer === 'package') {
            context.report({
              node,
              message: `Layer violation: ${fileLayer === 'ui' ? 'UI primitives' : 'composite blocks'} cannot import network/DB/query package "${specifier}". Pass data via props and callbacks instead.`,
            });
          }
        };

        return {
          ImportDeclaration(node) {
            checkSpecifier(node, node.source?.value);
          },
          ExportNamedDeclaration(node) {
            if (node.source) checkSpecifier(node, node.source.value);
          },
          ExportAllDeclaration(node) {
            if (node.source) checkSpecifier(node, node.source.value);
          },
          ImportExpression(node) {
            checkSpecifier(node, getStaticStringFromExpr(node.source));
          },
          CallExpression(node) {
            if (
              node.callee?.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments?.length > 0
            ) {
              checkSpecifier(node, getStaticStringFromExpr(node.arguments[0]));
            }
          },
        };
      },
    },
    'wrapped-libraries': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow direct runtime imports of wrapped headless UI libraries outside src/components/ui/; use Eolas UI primitives instead.',
        },
        schema: [],
      },
      create(context) {
        const utilsAllowedSpecifiers = new Set(['@base-ui/react/merge-props', '@base-ui/react/use-render']);
        const isUtilsModule = /(?:^|\/)(?:lib\/)?utils\.[cm]?[jt]sx?$/i.test(
          String(getFilename(context) || '').replace(/\\/g, '/')
        );
        const reportIfWrapped = (node, specifier) => {
          if (isUtilsModule && utilsAllowedSpecifiers.has(specifier)) return;
          if (isWrappedHeadlessSpecifier(specifier)) {
            context.report({
              node,
              message: `Do not import wrapped headless library "${specifier}" outside src/components/ui/. Use Eolas UI primitives from @/components/ui/ instead (type-only imports are allowed).`,
            });
          }
        };

        return {
          ImportDeclaration(node) {
            if (node.importKind === 'type') return;
            if (Array.isArray(node.specifiers) && node.specifiers.length > 0 && node.specifiers.every((s) => s.importKind === 'type')) {
              return;
            }
            reportIfWrapped(node, node.source?.value);
          },
          ExportNamedDeclaration(node) {
            if (!node.source || node.exportKind === 'type') return;
            if (Array.isArray(node.specifiers) && node.specifiers.length > 0 && node.specifiers.every((s) => s.exportKind === 'type')) {
              return;
            }
            reportIfWrapped(node, node.source.value);
          },
          ExportAllDeclaration(node) {
            if (!node.source || node.exportKind === 'type') return;
            reportIfWrapped(node, node.source.value);
          },
          ImportExpression(node) {
            reportIfWrapped(node, getStaticStringFromExpr(node.source));
          },
          CallExpression(node) {
            if (
              node.callee?.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments?.length > 0
            ) {
              reportIfWrapped(node, getStaticStringFromExpr(node.arguments[0]));
            }
          },
        };
      },
    },
    'no-reach-in-selectors': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow Tailwind arbitrary reach-in selectors ([&_svg], [&>button]) on components outside src/components/ui/.',
        },
        schema: [],
      },
      create(context) {
        const openingIsComponentStack = [];

        return createClassRuleVisitor(context, {
          captureContext: () => ({
            onComponent: openingIsComponentStack[openingIsComponentStack.length - 1] === true,
          }),
          onCheckExpr({ expr, visitedCalls, resolveVar, snapshot }) {
            if (!snapshot?.onComponent) return;
            const groups = extractClassGroupsFromExpr(expr, visitedCalls, [], resolveVar);
            for (const group of groups) {
              const tokens = splitTailwindTokens(group.text);
              const badToken = tokens.find((t) => hasReachInSelector(t.variant));
              if (badToken) {
                context.report({
                  node: group.node,
                  message: `Avoid reach-in selector "${badToken.raw}" on components. Use documented component props/variants or extend the primitive in src/components/ui/.`,
                });
              }
            }
          },
          createExtra: () => ({
            JSXOpeningElement(node) {
              openingIsComponentStack.push(isComponentJsxName(node.name));
            },
            'JSXOpeningElement:exit'() {
              openingIsComponentStack.pop();
            },
          }),
        });
      },
    },
    'icon-button-label': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require an accessible name (aria-label, aria-labelledby, title, or screen-reader text) on icon-only Button controls.',
        },
        schema: [],
      },
      create(context) {
        const isNonEmptyLabelValue = (valNode) => {
          if (!valNode) return false;
          if (valNode.type === 'Literal') {
            return typeof valNode.value === 'string' && valNode.value.trim().length > 0;
          }
          if (valNode.type === 'JSXExpressionContainer') {
            const staticVal = getStaticStringFromExpr(valNode.expression);
            return staticVal === null || staticVal.trim().length > 0;
          }
          const staticVal = getStaticStringFromExpr(valNode);
          return staticVal === null || staticVal.trim().length > 0;
        };

        const hasLabelAttr = (attrs, jsxNode) => {
          for (const attr of attrs) {
            if (attr.type === 'JSXSpreadAttribute') {
              const arg = unwrapTypeExpr(attr.argument);
              if (arg?.type === 'Identifier') {
                if (REST_PROP_SPREAD_NAMES.has(arg.name) || isRestParamBoundIdentifier(jsxNode, arg.name)) {
                  return true;
                }
              } else if (arg?.type === 'ObjectExpression') {
                for (const prop of arg.properties || []) {
                  if (prop?.type !== 'Property' || prop.computed) continue;
                  const keyName =
                    prop.key?.type === 'Identifier'
                      ? prop.key.name
                      : prop.key?.type === 'Literal'
                        ? String(prop.key.value)
                        : null;
                  if (
                    (keyName === 'aria-label' || keyName === 'aria-labelledby' || keyName === 'title') &&
                    isNonEmptyLabelValue(prop.value)
                  ) {
                    return true;
                  }
                }
              }
              continue;
            }
            if (attr.type !== 'JSXAttribute') continue;
            const name = attr.name?.name;
            if (name !== 'aria-label' && name !== 'aria-labelledby' && name !== 'title') continue;
            if (isNonEmptyLabelValue(attr.value)) return true;
          }
          return false;
        };

        return {
          JSXElement(node) {
            const tagFull = getJsxTagParts(node.openingElement?.name).full;
            if (!ICON_BUTTON_COMPONENT_NAMES.has(tagFull)) return;
            const attrs = node.openingElement?.attributes || [];
            if (hasLabelAttr(attrs, node)) return;

            let hasIconChild = false;
            let hasAccessibleContent = false;

            for (const child of node.children || []) {
              if (child.type === 'JSXText') {
                if (child.value.trim().length > 0) {
                  hasAccessibleContent = true;
                  break;
                }
              } else if (child.type === 'JSXExpressionContainer') {
                if (child.expression?.type !== 'JSXEmptyExpression') {
                  hasAccessibleContent = true;
                  break;
                }
              } else if (child.type === 'JSXFragment') {
                hasAccessibleContent = true;
                break;
              } else if (child.type === 'JSXElement') {
                const childTag = getJsxTagParts(child.openingElement?.name).full;
                if (ICON_ELEMENT_NAMES.has(childTag)) {
                  hasIconChild = true;
                } else {
                  hasAccessibleContent = true;
                  break;
                }
              }
            }

            if (hasIconChild && !hasAccessibleContent) {
              context.report({
                node: node.openingElement,
                message: `Icon-only <${tagFull}> requires an accessible label. Add aria-label="..." or a <span className="sr-only">...</span> child.`,
              });
            }
          },
        };
      },
    },
    'prefer-shorthand': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce DESIGN.md Tailwind shorthands: size-* over w-X h-X, flex/grid gap-* over space-x/space-y-*, and h-dvh over h-screen.',
        },
        schema: [],
      },
      create(context) {
        const reportedKindsByNode = new WeakMap();
        const reportOnce = (node, kind, message) => {
          let kinds = reportedKindsByNode.get(node);
          if (!kinds) {
            kinds = new Set();
            reportedKindsByNode.set(node, kinds);
          }
          if (kinds.has(kind)) return;
          kinds.add(kind);
          context.report({ node, message });
        };

        return createClassRuleVisitor(context, {
          onCheckExpr({ expr, rootNode, visitedCalls, resolveVar }) {
            const branches = extractClassBranchesFromExpr(expr, { visitedCalls, resolveVar, rootNode });
            for (const branch of branches) {
              if (!branch.text) continue;
              const tokens = splitTailwindTokens(branch.text);
              const widthsByVariant = new Map();
              const heightsByVariant = new Map();

              for (const token of tokens) {
                if (/^-?space-[xy]-/.test(token.base)) {
                  reportOnce(
                    branch.node,
                    `space:${token.raw}`,
                    `Avoid child-margin utility "${token.raw}". Use flex/grid with gap-* instead per DESIGN.md.`
                  );
                }

                if (token.base === 'h-screen' || token.base === 'min-h-screen') {
                  const replacement = token.base.replace('screen', 'dvh');
                  reportOnce(
                    branch.node,
                    `screen:${token.base}`,
                    `Use "${replacement}" instead of "${token.base}" for mobile viewport/keyboard safety.`
                  );
                }

                const wMatch = token.base.match(/^w-([^\s/]+)$/);
                if (wMatch) {
                  const val = wMatch[1];
                  if (!SQUARE_SHORTHAND_EXCLUDED_VALUES.has(val) && !val.startsWith('[')) {
                    let map = widthsByVariant.get(token.variant);
                    if (!map) {
                      map = new Map();
                      widthsByVariant.set(token.variant, map);
                    }
                    map.set(val, token.raw);
                  }
                }

                const hMatch = token.base.match(/^h-([^\s/]+)$/);
                if (hMatch) {
                  const val = hMatch[1];
                  if (!SQUARE_SHORTHAND_EXCLUDED_VALUES.has(val) && !val.startsWith('[')) {
                    let map = heightsByVariant.get(token.variant);
                    if (!map) {
                      map = new Map();
                      heightsByVariant.set(token.variant, map);
                    }
                    map.set(val, token.raw);
                  }
                }
              }

              for (const [variant, widthMap] of widthsByVariant.entries()) {
                const heightMap = heightsByVariant.get(variant);
                if (!heightMap) continue;
                for (const [val, wRaw] of widthMap.entries()) {
                  const hRaw = heightMap.get(val);
                  if (!hRaw) continue;
                  const prefix = variant ? `${variant}:` : '';
                  reportOnce(
                    branch.node,
                    `square:${prefix}${val}`,
                    `Use "${prefix}size-${val}" instead of "${wRaw} ${hRaw}".`
                  );
                }
              }
            }
          },
        });
      },
    },
    'no-dark-variant': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow Tailwind dark:* variants; Eolas UI scopes dark surfaces with [data-surface="inverted"] (inverted:*).',
        },
        schema: [],
      },
      create(context) {
        return createClassRuleVisitor(context, {
          onCheckExpr({ expr, visitedCalls, resolveVar }) {
            const groups = extractClassGroupsFromExpr(expr, visitedCalls, [], resolveVar);
            for (const group of groups) {
              const tokens = splitTailwindTokens(group.text);
              const badToken = tokens.find((t) => hasVariantSegment(t.variant, 'dark'));
              if (badToken) {
                context.report({
                  node: group.node,
                  message: `Avoid "${badToken.raw}". Eolas UI scopes dark surfaces via [data-surface="inverted"] (inverted:*) rather than Tailwind dark: variants.`,
                });
              }
            }
          },
        });
      },
    },
    'no-important': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow Tailwind important (!) modifiers outside src/components/ui/.',
        },
        schema: [],
      },
      create(context) {
        return createClassRuleVisitor(context, {
          onCheckExpr({ expr, visitedCalls, resolveVar }) {
            const groups = extractClassGroupsFromExpr(expr, visitedCalls, [], resolveVar);
            for (const group of groups) {
              const tokens = splitTailwindTokens(group.text);
              const badToken = tokens.find((t) => t.hasImportant);
              if (badToken) {
                context.report({
                  node: group.node,
                  message: `Avoid Tailwind important override "${badToken.raw}". Use documented component props/variants or adjust layout containers instead.`,
                });
              }
            }
          },
        });
      },
    },
    'no-rebuilt-overlay': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow hand-rolled "fixed inset-0" overlay containers outside src/components/ui/; use <Dialog>, <AlertDialog>, or <Drawer>.',
        },
        schema: [],
      },
      create(context) {
        const openingTagStack = [];

        return createClassRuleVisitor(context, {
          captureContext: () => ({
            tag: openingTagStack[openingTagStack.length - 1] || '',
          }),
          onCheckExpr({ expr, rootNode, visitedCalls, resolveVar, snapshot }) {
            if (!OVERLAY_HTML_TAGS.has(snapshot?.tag)) return;
            const branches = extractClassBranchesFromExpr(expr, { visitedCalls, resolveVar, rootNode });
            const reportedNodes = new WeakSet();

            for (const branch of branches) {
              if (!branch.text || reportedNodes.has(branch.node)) continue;
              const tokens = splitTailwindTokens(branch.text);
              if (tokens.some((t) => t.base === 'sr-only')) continue;

              const byVariant = new Map();
              for (const token of tokens) {
                let flags = byVariant.get(token.variant);
                if (!flags) {
                  flags = { hasFixed: false, hasInsetZero: false };
                  byVariant.set(token.variant, flags);
                }
                if (token.base === 'fixed') flags.hasFixed = true;
                if (token.base === 'inset-0') flags.hasInsetZero = true;
              }

              for (const flags of byVariant.values()) {
                if (flags.hasFixed && flags.hasInsetZero) {
                  reportedNodes.add(branch.node);
                  context.report({
                    node: branch.node,
                    message:
                      'Avoid hand-rolled "fixed inset-0" overlays. Use <Dialog>, <AlertDialog>, or <Drawer> from @/components/ui/ for accessible focus trapping and Escape dismissal.',
                  });
                  break;
                }
              }
            }
          },
          createExtra: () => ({
            JSXOpeningElement(node) {
              const tag = node.name?.type === 'JSXIdentifier' ? node.name.name : '';
              openingTagStack.push(tag);
            },
            'JSXOpeningElement:exit'() {
              openingTagStack.pop();
            },
          }),
        });
      },
    },
  },
};

export default plugin;
