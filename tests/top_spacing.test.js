const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

test('Verificar soporte de safe-area-inset-top y espaciado ergonómico en header en index.backup.html', () => {
  const htmlPath = path.join(ROOT_DIR, 'index.backup.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Debe existir safe-area-inset-top en los estilos de header
  assert.match(
    html,
    /header\s*\{[^}]*safe-area-inset-top[^}]*\}/s,
    'header debe contener safe-area-inset-top para soportar notch y barras de estado'
  );

  // 2. Debe definir altura mínima en header
  assert.match(
    html,
    /header\s*\{[^}]*min-height\s*:\s*[0-9]+px[^}]*\}/s,
    'header debe definir una altura mínima (min-height)'
  );

  // 3. El botón de menú debe definir altura mínima para área táctil
  assert.match(
    html,
    /\.btn-header-menu-toggle\s*\{[^}]*min-height\s*:\s*[0-9]+px[^}]*\}/s,
    '.btn-header-menu-toggle debe definir min-height para área táctil ergonómica'
  );
});

test('Verificar que index.html y V2/Index.html contengan safe-area-inset-top', () => {
  for (const file of ['index.html', 'V2/Index.html', 'index.dev.html']) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
    assert.match(
      content,
      /safe-area-inset-top/,
      `${file} debe incluir soporte para safe-area-inset-top`
    );
  }
});
