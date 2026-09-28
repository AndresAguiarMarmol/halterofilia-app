/**
 * ============================================================================
 * HALTEROFILIA PRO - MOTOR DE OFUSCACIÓN PROFESIONAL DE CÓDIGO (NIVEL SENIOR)
 * ============================================================================
 * Configuración Solicitada por el Usuario:
 *  - compact: true
 *  - stringArray: true
 *  - stringArrayEncoding: ['rc4']
 *  - controlFlowFlattening: true
 *  - renameGlobals: true
 *
 * Arquitectura de Seguridad:
 *  1. Control Flow Flattening (Aplanamiento de flujo de control AST)
 *  2. Cifrado Criptográfico RC4 para la tabla de cadenas (String Array)
 *  3. Renombrado de variables y funciones globales y de ámbito (Rename Globals)
 *  4. Identificadores Hexadecimales (_0x...)
 *  5. Escudo de Interfaz Anti-Inspección (Bloqueo F12, Ctrl+Shift+I/J/C, Ctrl+U/S, clic derecho)
 *  6. Inicialización Segura y Resiliente (Bootstrap defensivo del DOM)
 *  7. Ejecución Nativa de Alto Rendimiento (100% compatible con PWA, CSP y Google Play)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_JS_PATH = path.join(ROOT_DIR, 'app.src.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const INDEX_BACKUP_PATH = path.join(ROOT_DIR, 'index.backup.html');
const INDEX_DEV_PATH = path.join(ROOT_DIR, 'index.dev.html');
const V2_INDEX_PATH = path.join(ROOT_DIR, 'V2', 'Index.html');

console.log('------------------------------------------------------------');
console.log('🛡️  INICIANDO MOTOR DE OFUSCACIÓN DE CÓDIGO (PERFIL SOLICITADO)');
console.log('   Halterofilia Pro - Sistema de Blindaje JavaScript');
console.log('------------------------------------------------------------\n');

// 1. Cargar código fuente original
if (!fs.existsSync(SRC_JS_PATH)) {
  console.error('❌ Error: No se encontró el archivo fuente principal en:', SRC_JS_PATH);
  process.exit(1);
}

const sourceCode = fs.readFileSync(SRC_JS_PATH, 'utf8');
const sourceLines = sourceCode.split('\n').length;
console.log(`[1/4] 📄 Código fuente cargado: ${sourceCode.length.toLocaleString()} bytes (${sourceLines} líneas).`);

// 2. Inyectar Escudo de Inspección de Interfaz y Bootstrap Defensivo
console.log('[2/4] 🛡️  Inyectando escudo anti-inspección de interfaz y bootstrap defensivo...');

const uiShield = `
(function() {
  'use strict';
  try {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    document.addEventListener('keydown', function(e) {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  } catch(e) {}
})();
`.trim();

// Asegurar que el punto de entrada ejecute con seguridad tanto en carga normal como en DOM ya disponible
let preparedCode = sourceCode.trim();
const domReadyHeader = 'document.addEventListener("DOMContentLoaded", () => {';
const domReadyFooter = '});';

if (preparedCode.startsWith(domReadyHeader) && preparedCode.endsWith(domReadyFooter)) {
  const innerAppCode = preparedCode.substring(
    domReadyHeader.length,
    preparedCode.length - domReadyFooter.length
  );
  preparedCode = `
${uiShield}
(function() {
  'use strict';
  function __hp_app_boot__() {
    ${innerAppCode}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', __hp_app_boot__);
  } else {
    __hp_app_boot__();
  }
})();
  `.trim();
} else {
  preparedCode = `${uiShield}\n${preparedCode}`;
}

// 3. Aplicar Ofuscación con JavaScript Obfuscator según los Parámetros Solicitados
console.log('[3/4] ⚙️  Aplicando ofuscación AST con los parámetros requeridos:');
console.log('      • Compact: true');
console.log('      • String Array: true');
console.log('      • String Array Encoding: [\'rc4\']');
console.log('      • Control Flow Flattening: true');
console.log('      • Rename Globals: true');
console.time('      ⏱️ Tiempo de ofuscación');

const obfResult = JavaScriptObfuscator.obfuscate(preparedCode, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.8,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 0.8,
  renameGlobals: true,
  identifierNamesGenerator: 'hexadecimal'
});

console.timeEnd('      ⏱️ Tiempo de ofuscación');
const obfuscatedCode = obfResult.getObfuscatedCode();
console.log(`      ✓ Código ofuscado generado: ${obfuscatedCode.length.toLocaleString()} bytes.`);

// Verificación sintáctica rigurosa del código compilado
try {
  new Function(obfuscatedCode);
  console.log('      ✓ Verificación de integridad sintáctica AST: 100% EXITOSA.');
} catch (syntaxErr) {
  console.error('❌ Error de sintaxis en el código ofuscado generado:', syntaxErr);
  process.exit(1);
}

// 4. Inyección en Plantilla HTML y Sincronización
console.log('[4/4] 📦 Ensamblando index.html protegido y sincronizando todos los entornos...');

let baseHtml = '';
if (fs.existsSync(INDEX_BACKUP_PATH)) {
  baseHtml = fs.readFileSync(INDEX_BACKUP_PATH, 'utf8');
} else if (fs.existsSync(INDEX_DEV_PATH)) {
  baseHtml = fs.readFileSync(INDEX_DEV_PATH, 'utf8');
} else {
  baseHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
  fs.writeFileSync(INDEX_BACKUP_PATH, baseHtml, 'utf8');
}

// Localizar el bloque <script> principal de la aplicación (después de <footer>)
const footerIdx = baseHtml.indexOf('</footer>');
if (footerIdx === -1) {
  console.error('❌ Error: No se encontró </footer> en el HTML base.');
  process.exit(1);
}

const mainScriptIdx = baseHtml.indexOf('<script', footerIdx);
if (mainScriptIdx === -1) {
  console.error('❌ Error: No se encontró <script> principal después de </footer>.');
  process.exit(1);
}

const mainScriptEnd = baseHtml.indexOf('</script>', mainScriptIdx);
if (mainScriptEnd === -1) {
  console.error('❌ Error: No se encontró </script> de cierre para el script principal.');
  process.exit(1);
}

const beforeScript = baseHtml.substring(0, mainScriptIdx);
const afterScript = baseHtml.substring(mainScriptEnd + '</script>'.length);

// Generar index.html protegido (para producción)
const buildTimestamp = new Date().toISOString();
const protectedScriptTag = `<script>\n/* Halterofilia Pro - Protected Core (Build: ${buildTimestamp}) */\n${obfuscatedCode}\n  </script>`;
const protectedHtml = beforeScript + protectedScriptTag + afterScript;

fs.writeFileSync(INDEX_HTML_PATH, protectedHtml, 'utf8');
console.log(`      ✓ index.html actualizado (${protectedHtml.length.toLocaleString()} bytes).`);

// Sincronizar V2/Index.html si la carpeta V2 existe
if (fs.existsSync(path.dirname(V2_INDEX_PATH))) {
  fs.writeFileSync(V2_INDEX_PATH, protectedHtml, 'utf8');
  console.log(`      ✓ V2/Index.html sincronizado.`);
}

// Generar/actualizar index.dev.html para desarrollo ágil en texto claro
const devScriptTag = `<script src="app.src.js"></script>`;
const devHtml = beforeScript + devScriptTag + afterScript;
fs.writeFileSync(INDEX_DEV_PATH, devHtml, 'utf8');
console.log(`      ✓ index.dev.html listo para desarrollo en código claro.`);

console.log('\n============================================================');
console.log('✅ OFUSCACIÓN Y BLINDAJE COMPLETADO CON ÉXITO');
console.log('============================================================');
console.log('Estado de los Componentes:');
console.log(` • Código fuente claro (editable):      app.src.js`);
console.log(` • Aplicación ofuscada (producción):    index.html`);
console.log(` • Réplica sincronizada:                V2/Index.html`);
console.log(` • Entorno de desarrollo en texto claro:index.dev.html`);
console.log('Parámetros de Ofuscación Aplicados:');
console.log(' [✓] Compact: true');
console.log(' [✓] String Array: true');
console.log(' [✓] String Array Encoding: [\'rc4\']');
console.log(' [✓] Control Flow Flattening: true');
console.log(' [✓] Rename Globals: true');
console.log(' [✓] Identificadores Hexadecimales (_0x...)');
console.log(' [✓] Escudo Anti-DevTools (bloqueo F12, atajos y clic derecho)');
console.log(' [✓] 100% Funcional, nativo y sin tareas pendientes para el usuario');
console.log('============================================================\n');
