const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Patrón de detección de secuencias mojibake clásicas (UTF-8 interpretado como ISO-8859-1/Win-1252)
// y el caracter de reemplazo Unicode \uFFFD
const MOJIBAKE_REGEX = /(?:[\u00C0-\u00C3\u00C5\u00C7\u00C9\u00D1\u00D3\u00DA][\u0080-\u00BF]|\uFFFD)/g;

function checkFileEncoding(relativePath) {
  const fullPath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Archivo no encontrado: ${relativePath}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const matches = content.match(MOJIBAKE_REGEX);
  return {
    path: relativePath,
    mojibakeCount: matches ? matches.length : 0,
    matches: matches ? matches.slice(0, 10) : [],
    content
  };
}

test('Verificar que app.src.js no contenga mojibake y tenga caracteres españoles válidos', () => {
  const result = checkFileEncoding('app.src.js');
  assert.strictEqual(
    result.mojibakeCount,
    0,
    `app.src.js contiene ${result.mojibakeCount} secuencias mojibake: ${JSON.stringify(result.matches)}`
  );
  assert.ok(result.content.includes('su-usuario@dominio.com'), 'Debe contener su-usuario@dominio.com');
  assert.ok(result.content.includes('Licencia Activa ✅'), 'Debe contener emoji de licencia activa');
  assert.ok(result.content.includes('configuración'), 'Debe contener palabras con tilde');
  assert.ok(result.content.includes('Egaña'), 'Debe contener la letra eñe');
});

test('Verificar que index.backup.html no contenga mojibake', () => {
  const result = checkFileEncoding('index.backup.html');
  assert.strictEqual(
    result.mojibakeCount,
    0,
    `index.backup.html contiene ${result.mojibakeCount} secuencias mojibake: ${JSON.stringify(result.matches)}`
  );
  assert.ok(result.content.includes('su-usuario@dominio.com'), 'Debe contener su-usuario@dominio.com');
});

test('Verificar que index.html no contenga mojibake', () => {
  const result = checkFileEncoding('index.html');
  assert.strictEqual(
    result.mojibakeCount,
    0,
    `index.html contiene ${result.mojibakeCount} secuencias mojibake: ${JSON.stringify(result.matches)}`
  );
});

test('Verificar que V2/Index.html no contenga mojibake', () => {
  const result = checkFileEncoding('V2/Index.html');
  assert.strictEqual(
    result.mojibakeCount,
    0,
    `V2/Index.html contiene ${result.mojibakeCount} secuencias mojibake: ${JSON.stringify(result.matches)}`
  );
});

test('Verificar que index.dev.html no contenga mojibake', () => {
  const result = checkFileEncoding('index.dev.html');
  assert.strictEqual(
    result.mojibakeCount,
    0,
    `index.dev.html contiene ${result.mojibakeCount} secuencias mojibake: ${JSON.stringify(result.matches)}`
  );
});
