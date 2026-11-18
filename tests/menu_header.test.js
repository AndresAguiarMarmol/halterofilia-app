const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

const REQUIRED_CONTROLS = [
  'btnSwitchAthlete',
  'btnOpenDemoHeader',
  'btnOpenReports',
  'btnOpenPRModal',
  'btnOpenLicenseModal',
  'btnHeaderBackup',
  'btnHeaderRestore',
  'headerBoxSelect',
  'btnHeaderUnit',
  'btnHeaderBar',
  'btnHeaderTheme'
];

test('Verificar estructura HTML del menú superior colapsable en index.backup.html', () => {
  const htmlPath = path.join(ROOT_DIR, 'index.backup.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Debe existir el botón compacto de menú en la cabecera
  assert.match(
    html,
    /id=["']btnHeaderMenuToggle["']/,
    'Debe existir el botón #btnHeaderMenuToggle en la cabecera'
  );

  // 2. Debe existir el contenedor desplegable del menú
  assert.match(
    html,
    /id=["']headerDropdownMenu["']/,
    'Debe existir el contenedor #headerDropdownMenu'
  );

  // 3. Extraer el bloque del menú desplegable y verificar que contiene todos los controles requeridos
  const dropdownMatch = html.match(/<div[^>]*id=["']headerDropdownMenu["'][\s\S]*?<\/div>\s*<\/div>\s*<\/header>/i);
  assert.ok(dropdownMatch, 'El dropdown #headerDropdownMenu debe estar definido en la cabecera');
  const dropdownContent = dropdownMatch[0];

  for (const controlId of REQUIRED_CONTROLS) {
    const regex = new RegExp(`id=["']${controlId}["']`);
    assert.match(
      dropdownContent,
      regex,
      `El control #${controlId} debe residir dentro de #headerDropdownMenu`
    );
  }
});

test('Verificar que index.html y V2/Index.html contengan el botón de menú y el dropdown', () => {
  for (const file of ['index.html', 'V2/Index.html', 'index.dev.html']) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
    assert.match(content, /id=["']btnHeaderMenuToggle["']/, `${file} debe contener #btnHeaderMenuToggle`);
    assert.match(content, /id=["']headerDropdownMenu["']/, `${file} debe contener #headerDropdownMenu`);
  }
});

test('Verificar lógica de control del menú colapsable en app.src.js', () => {
  const jsPath = path.join(ROOT_DIR, 'app.src.js');
  const js = fs.readFileSync(jsPath, 'utf8');

  // 1. Debe referenciar el botón y el menú desplegable
  assert.ok(
    js.includes('btnHeaderMenuToggle'),
    'app.src.js debe referenciar btnHeaderMenuToggle'
  );
  assert.ok(
    js.includes('headerDropdownMenu'),
    'app.src.js debe referenciar headerDropdownMenu'
  );

  // 2. Debe implementar cierre al hacer clic fuera o presionar Escape
  assert.ok(
    js.includes('Escape'),
    'app.src.js debe contemplar cierre con la tecla Escape'
  );
});
