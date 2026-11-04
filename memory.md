# MEMORY.md — Diario de Desarrollo

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- **Versión activa:** V3.26.08 (Noviembre 2026).
- **Entorno compilado y blindado:** `app.src.js` ofuscado en `index.html` y `V2/Index.html` con AST Control Flow Flattening y RC4 via `javascript-obfuscator`.
- **Codificación:** 100% UTF-8 limpio sin BOM ni mojibake. Verificado con `npm test` (`node --test tests/encoding.test.js`).
- **Funcionalidades operativas:**
  - Codificación UTF-8 estricta en español (acentos, ñ, símbolos/emojis y correo estándar `su-usuario@dominio.com`).
  - Persistencia de preferencias del atleta: el gimnasio actual y los pesos disponibles se guardan en los datos del usuario entre sesiones.
  - Presentación de opciones de pesas con priorización estricta del menor número de pesas en la barra (`Opción 1` siempre es el mínimo de discos).
  - Cálculo simétrico de barra olímpica con soporte para discos en Kgs y Lbs y selección de alternativas.
  - Inventario interactivo de discos por centro con persistencia en tiempo real al hacer clic.
  - Selector de Unidad Objetivo en cabecera con alternancia binaria exclusiva entre Kgs $\leftrightarrow$ Lbs.
  - Selector de Unidad en la tarjeta de Peso Objetivo (Kgs / Lbs) sincronizado con cabecera y conversión en caliente.
  - Desacople total de la unidad visual respecto a las alternativas de carga (pueden ser Kgs, Lbs o mixtas).
  - Selector y gestor integral de Boxes / Centros (Crear, Modificar, Eliminar).
  - Motor de armado con garantía de precisión mínima del 95% y badge visual de precisión.
  - Gestión de PRs en 11 movimientos olímpicos y gráficas de progreso.
  - Licenciamiento offline con 7 días de trial, Device ID y validación criptográfica SHA-256.
  - Selector de temas (Oscuro, Claro, Sistema) y barra visual centrada.

## Decisiones (y por qué)
  - **Restauración UTF-8 base limpia:** Ante corrupción por guardado en Windows-1252/ISO-8859-1 en `cc27522`, se restauró la base fiel `04e529f` manteniendo `su-usuario@dominio.com` y compilando con `scripts/protect.js`.
  - **Suite de pruebas de codificación automatizada (`tests/encoding.test.js`):** Previene regresiones de mojibake y asegura que los bundles protegidos y de desarrollo se generen con codificación pura.
  - **Priorización estricta de menor número de discos:** Minimiza el esfuerzo físico del atleta para cargar y descargar la barra.
  - **Selector de unidad exclusivo Kgs / Lbs:** No tiene sentido una meta en "Ambas", se restringe a Kgs y Lbs en objetivo.
  - **Offline-First sin dependencias runtime:** Portabilidad total en móviles y despliegue PWA / APK vía PWABuilder.

## Aprendizajes y errores a evitar
- **Asegurar UTF-8 sin BOM al guardar:** Evitar editores o scripts que guarden texto en Windows-1252 o inserten BOM, lo cual destruye tildes y emojis.
- **NUNCA modificar `index.html` directamente:** Todo cambio en JavaScript debe realizarse en `app.src.js` y compilarse con `npm run protect`.

## Próximos pasos
- Mantener validación con `npm test` antes de cada compilación y despliegue.
