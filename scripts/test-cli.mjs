import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const CLI_PATH = path.resolve(ROOT, 'packages/eolas-ui/bin/eolas-ui.js');
const CLI_PKG = JSON.parse(fs.readFileSync(path.resolve(ROOT, 'packages/eolas-ui/package.json'), 'utf8'));

function runCli(args, cwd) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8',
    env: process.env,
  });
}

function withTempWorkspace(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eolas-ui-cli-test-'));
  try {
    fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function listFilesRecursive(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(abs, base));
    } else {
      results.push(path.relative(base, abs).replace(/\\/g, '/'));
    }
  }
  return results.sort();
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test('1. --version and -v print package version and exit 0', () => {
  withTempWorkspace((dir) => {
    for (const flag of ['--version', '-v']) {
      const res = runCli([flag], dir);
      assert.equal(res.status, 0, `${flag} failed: ${res.stderr}`);
      assert.equal(res.stdout.trim(), CLI_PKG.version);
    }
  });
});

test('2. Vite tsconfig.json references resolve @ui and ~/* into src/...', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    writeJson(path.join(dir, 'tsconfig.json'), {
      files: [],
      references: [{ path: './tsconfig.app.json' }],
    });
    writeJson(path.join(dir, 'tsconfig.app.json'), {
      compilerOptions: {
        paths: {
          '@ui/*': ['./src/components/ui/*'],
          '~/*': ['./src/*'],
        },
      },
    });
    writeJson(path.join(dir, 'components.json'), {
      aliases: {
        components: '~/components',
        ui: '@ui',
        lib: '~/lib',
        utils: '~/lib/utils',
      },
    });

    const res = runCli(['add', 'button'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'src/components/ui/button.tsx')), true, 'button.tsx should be written under src/components/ui/');
    assert.equal(fs.existsSync(path.join(dir, 'src/lib/utils.ts')), true, 'utils.ts should be written under src/lib/');
    assert.equal(fs.existsSync(path.join(dir, '@ui')), false, 'must NOT create literal @ui/ directory at root');
  });
});

test('3. tsconfig.json baseUrl "./src" + "@/*": ["./*"] writes into src/components/ui/button.tsx and src/lib/utils.ts', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    writeJson(path.join(dir, 'tsconfig.json'), {
      compilerOptions: {
        baseUrl: './src',
        paths: {
          '@/*': ['./*'],
        },
      },
    });
    writeJson(path.join(dir, 'components.json'), {
      aliases: {
        components: '@/components',
        ui: '@/components/ui',
        lib: '@/lib',
        utils: '@/lib/utils',
      },
    });

    const res = runCli(['add', 'button'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'src/components/ui/button.tsx')), true);
    assert.equal(fs.existsSync(path.join(dir, 'src/lib/utils.ts')), true);
    assert.equal(fs.existsSync(path.join(dir, 'components/ui/button.tsx')), false, 'must NOT write outside src/');
  });
});

test('4. eolas-ui add @eolas/button normalizes namespace and succeeds', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    const res = runCli(['add', '@eolas/button'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'src/components/ui/button.tsx')), true);
    assert.equal(fs.existsSync(path.join(dir, 'src/lib/utils.ts')), true);
  });
});

test('5. eolas-ui add button does-not-exist exits non-zero and writes 0 files', () => {
  withTempWorkspace((dir) => {
    const res = runCli(['add', 'button', 'does-not-exist'], dir);
    assert.notEqual(res.status, 0, 'Expected non-zero exit code for invalid item');
    const files = listFilesRecursive(dir);
    assert.deepEqual(files, [], `Expected 0 files written on failed pre-validation, found: ${files.join(', ')}`);
  });
});

test('6. eolas-ui sync in empty workspace exits 0 and writes 0 files', () => {
  withTempWorkspace((dir) => {
    const res = runCli(['sync'], dir);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    assert.match(res.stdout, /No installed Eolas UI items detected/i);
    const files = listFilesRecursive(dir);
    assert.deepEqual(files, [], `Expected 0 files written when nothing installed, found: ${files.join(', ')}`);
  });
});

test('7. eolas-ui sync --dry-run detects and plans updates for button, theme, lint, and agent-rules', () => {
  withTempWorkspace((dir) => {
    writeJson(path.join(dir, 'components.json'), {
      tailwind: { css: 'src/eolas-theme.css' },
      aliases: {
        components: '@/components',
        ui: '@/components/ui',
        lib: '@/lib',
        utils: '@/lib/utils',
      },
    });
    fs.mkdirSync(path.join(dir, 'src/components/ui'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src/components/ui/button.tsx'), '// existing button\n', 'utf8');
    fs.writeFileSync(
      path.join(dir, 'src/eolas-theme.css'),
      ':root { --surface-container-low: #f7f9fa; }\n',
      'utf8'
    );
    fs.mkdirSync(path.join(dir, 'lint'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'lint/index.mjs'), '// existing lint plugin\n', 'utf8');
    fs.mkdirSync(path.join(dir, '.agents/rules'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.agents/rules/00-core-contract.md'), '# Core Contract\n', 'utf8');

    const res = runCli(['sync', '--dry-run'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.match(res.stdout, /4 installed Eolas UI item\(s\)/);
    assert.match(res.stdout, /src\/components\/ui\/button\.tsx/);
    assert.match(res.stdout, /src\/eolas-theme\.css/);
    assert.match(res.stdout, /lint\/index\.mjs/);
    assert.match(res.stdout, /\.agents\/rules\/00-core-contract\.md/);
  });
});

test('8. eolas-ui add theme does not hijack an existing non-Eolas src/index.css', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src/index.css'), '@import "tailwindcss";\n/* custom app css */\n', 'utf8');

    const res = runCli(['add', 'theme'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.ok(fs.existsSync(path.join(dir, 'src/eolas-theme.css')), 'Expected src/eolas-theme.css to be created');
    const indexCss = fs.readFileSync(path.join(dir, 'src/index.css'), 'utf8');
    assert.match(indexCss, /custom app css/, 'Expected existing src/index.css to remain untouched');
  });
});

test('9. eolas-ui sync --all --dry-run also updates already-installed presets', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'src/eolas-theme.css'),
      ':root { --surface-container-low: #f7f9fa; }\n',
      'utf8'
    );
    fs.mkdirSync(path.join(dir, 'lint'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'lint/index.mjs'), '// existing lint plugin\n', 'utf8');

    const res = runCli(['sync', '--all', '--dry-run'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.match(res.stdout, /plus 2 installed preset\(s\)/);
    assert.match(res.stdout, /src\/eolas-theme\.css/);
    assert.match(res.stdout, /lint\/index\.mjs/);
  });
});

test('10. omitting aliases.lib derives lib alias from aliases.utils and rewrites @/lib/* imports', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    writeJson(path.join(dir, 'components.json'), {
      aliases: {
        components: '~/components',
        ui: '~/components/ui',
        utils: '~/lib/utils',
      },
    });

    const res = runCli(['add', 'chip'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'src/lib/contrast.ts')), true, 'contrast.ts should be written under src/lib/');
    const chipSrc = fs.readFileSync(path.join(dir, 'src/components/ui/chip.tsx'), 'utf8');
    assert.match(chipSrc, /['"]~\/lib\/contrast['"]/, 'Expected @/lib/contrast to be rewritten to ~/lib/contrast');
    assert.doesNotMatch(chipSrc, /['"]@\/lib\/contrast['"]/, 'Must not leave broken @/lib/contrast import');
  });
});

test('11. eolas-ui sync <item> updates only the specified item without overwriting other installed items', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src/components/ui'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src/components/ui/button.tsx'), '// stale button\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'src/components/ui/badge.tsx'), '// custom badge\n', 'utf8');

    const res = runCli(['sync', 'button'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.doesNotMatch(fs.readFileSync(path.join(dir, 'src/components/ui/button.tsx'), 'utf8'), /stale button/);
    assert.equal(fs.readFileSync(path.join(dir, 'src/components/ui/badge.tsx'), 'utf8'), '// custom badge\n');
  });
});

test('12. eolas-ui add --all theme --dry-run includes extra positional items alongside full catalog', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    const res = runCli(['add', '--all', 'theme', '--dry-run'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.match(res.stdout, /src\/eolas-theme\.css/);
  });
});

test('13. eolas-ui add theme does not overwrite or skip existing non-Eolas components.json tailwind.css', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src/index.css'), '@import "tailwindcss";\n/* app styles */\n', 'utf8');
    writeJson(path.join(dir, 'components.json'), {
      tailwind: { css: 'src/index.css' },
      aliases: { components: '@/components', ui: '@/components/ui', utils: '@/lib/utils' },
    });

    const res = runCli(['add', 'theme'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'src/eolas-theme.css')), true, 'Expected src/eolas-theme.css to be created');
    assert.match(fs.readFileSync(path.join(dir, 'src/index.css'), 'utf8'), /app styles/, 'Existing src/index.css must remain untouched');
  });
});

test('14. path traversal in components.json aliases is rejected without writing outside workspace', () => {
  withTempWorkspace((dir) => {
    writeJson(path.join(dir, 'components.json'), {
      aliases: { ui: '../../escaped-ui', utils: '@/lib/utils' },
    });

    const res = runCli(['add', 'button'], dir);
    assert.notEqual(res.status, 0, 'Expected non-zero exit code for path traversal');
    assert.match(res.stderr, /outside workspace root/i);
  });
});

test('15. logos preset is detected by sync --dry-run and sync --all --dry-run', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'public/logos'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'public/logos/horizontal-lockup.svg'), '<svg></svg>\n', 'utf8');

    const syncRes = runCli(['sync', '--dry-run'], dir);
    assert.equal(syncRes.status, 0, `CLI exited ${syncRes.status}:\n${syncRes.stdout}\n${syncRes.stderr}`);
    assert.match(syncRes.stdout, /1 installed Eolas UI item\(s\)/);
    assert.match(syncRes.stdout, /public\/logos\/horizontal-lockup\.svg/);

    const syncAllRes = runCli(['sync', '--all', '--dry-run'], dir);
    assert.equal(syncAllRes.status, 0, `CLI exited ${syncAllRes.status}:\n${syncAllRes.stdout}\n${syncAllRes.stderr}`);
    assert.match(syncAllRes.stdout, /plus 1 installed preset\(s\) \(logos\)/);
  });
});

test('16. pre-validates all destination paths so secondary aliases.lib traversal writes zero files', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    writeJson(path.join(dir, 'components.json'), {
      aliases: { ui: '@/components/ui', lib: '../../escaped-lib', utils: '@/lib/utils' },
    });

    const res = runCli(['add', 'chip'], dir);
    assert.notEqual(res.status, 0, 'Expected non-zero exit code for aliases.lib traversal');
    assert.match(res.stderr, /outside workspace root/i);
    assert.equal(fs.existsSync(path.join(dir, 'src/components/ui/chip.tsx')), false, 'Must NOT partially write chip.tsx');
  });
});

test('17. automatic sync preserves customized .oxlintrc.json and AGENTS.md, creates missing, and explicit sync overwrites', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'lint'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'lint/index.mjs'), '// stale lint plugin\n', 'utf8');
    fs.writeFileSync(path.join(dir, '.oxlintrc.json'), '{"rules":{"custom":true}}\n', 'utf8');
    fs.mkdirSync(path.join(dir, '.agents/rules'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.agents/rules/00-core-contract.md'), '# stale\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Custom team AGENTS.md\n', 'utf8');

    const autoSync = runCli(['sync'], dir);
    assert.equal(autoSync.status, 0, `CLI exited ${autoSync.status}:\n${autoSync.stdout}\n${autoSync.stderr}`);
    assert.match(autoSync.stdout, /Preserving \.oxlintrc\.json/);
    assert.match(autoSync.stdout, /Preserving AGENTS\.md/);
    assert.equal(fs.readFileSync(path.join(dir, '.oxlintrc.json'), 'utf8'), '{"rules":{"custom":true}}\n');
    assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), '# Custom team AGENTS.md\n');
    assert.doesNotMatch(fs.readFileSync(path.join(dir, 'lint/index.mjs'), 'utf8'), /stale lint plugin/);

    // Deleting .oxlintrc.json causes automatic sync to recreate it
    fs.unlinkSync(path.join(dir, '.oxlintrc.json'));
    const recreateSync = runCli(['sync'], dir);
    assert.equal(recreateSync.status, 0);
    assert.equal(fs.existsSync(path.join(dir, '.oxlintrc.json')), true, 'Missing .oxlintrc.json should be created on sync');

    // Re-customize and verify explicit `sync agent-rules` overwrites AGENTS.md
    const explicitSync = runCli(['sync', 'agent-rules'], dir);
    assert.equal(explicitSync.status, 0);
    assert.doesNotMatch(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), /Custom team AGENTS\.md/);
  });
});

test('18. non-src tailwind.css places fallback eolas-theme.css beside configured stylesheet', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'app/globals.css'), '@import "tailwindcss";\n/* next app */\n', 'utf8');
    writeJson(path.join(dir, 'components.json'), {
      tailwind: { css: 'app/globals.css' },
      aliases: { components: '@/components', ui: '@/components/ui', utils: '@/lib/utils' },
    });

    const res = runCli(['add', 'theme'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'app/eolas-theme.css')), true, 'Expected app/eolas-theme.css beside app/globals.css');
    assert.equal(fs.existsSync(path.join(dir, 'src/eolas-theme.css')), false, 'Must not create src/eolas-theme.css in non-src project');
  });
});

test('19. sync all works positionally and --version passed to add/sync warns as unknown flag', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    const syncAllRes = runCli(['sync', 'all', '--dry-run'], dir);
    assert.equal(syncAllRes.status, 0, `CLI exited ${syncAllRes.status}:\n${syncAllRes.stdout}\n${syncAllRes.stderr}`);
    assert.match(syncAllRes.stdout, /Previewing sync of all \d+ Eolas UI components/);

    const addVerRes = runCli(['add', 'button', '--version', '--dry-run'], dir);
    assert.equal(addVerRes.status, 0);
    assert.match(addVerRes.stderr, /Unknown flag "--version" ignored/);
  });
});

test('20. multi-reference tsconfig resolves each reference paths against its own baseUrl', () => {
  withTempWorkspace((dir) => {
    fs.mkdirSync(path.join(dir, 'app-src'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'worker-src'), { recursive: true });
    writeJson(path.join(dir, 'tsconfig.json'), {
      files: [],
      references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }],
    });
    writeJson(path.join(dir, 'tsconfig.app.json'), {
      compilerOptions: {
        baseUrl: './app-src',
        paths: { '@app/*': ['./*'] },
      },
    });
    writeJson(path.join(dir, 'tsconfig.node.json'), {
      compilerOptions: {
        baseUrl: './worker-src',
        paths: { '@worker/*': ['./*'] },
      },
    });
    writeJson(path.join(dir, 'components.json'), {
      aliases: {
        components: '@app/components',
        ui: '@app/components/ui',
        lib: '@app/lib',
        utils: '@app/lib/utils',
      },
    });

    const res = runCli(['add', 'button'], dir);
    assert.equal(res.status, 0, `CLI exited ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.equal(fs.existsSync(path.join(dir, 'app-src/components/ui/button.tsx')), true, 'button.tsx should resolve under app-src');
    assert.equal(fs.existsSync(path.join(dir, 'worker-src/components/ui/button.tsx')), false, 'must NOT resolve @app/* against tsconfig.node.json baseUrl');
  });
});

console.log('=== Running Eolas UI CLI Test Suite ===\n');
let passed = 0;
for (const t of tests) {
  try {
    t.fn();
    console.log(`  PASS  ${t.name}`);
    passed += 1;
  } catch (err) {
    console.error(`  FAIL  ${t.name}`);
    console.error(`        ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}

console.log(`\n${passed}/${tests.length} CLI tests passed.`);
if (passed !== tests.length) {
  process.exit(1);
}
