# Tareas — Spec 001: Corrección de Codificación UTF-8

- [x] **T1. Crear suite de pruebas de codificación UTF-8.** RF-1, RF-2, RNF-1
  - Hecho cuando: `tests/encoding.test.js` existe y detecta fallas en los archivos actualmente corruptos con `node --test`.
- [x] **T2. Restaurar codificación limpia en `app.src.js` y `index.backup.html`.** RF-1, RF-2, RF-3, RF-4
  - Hecho cuando: Ambos archivos estén en UTF-8 puro, contengan `su-usuario@dominio.com` y no contengan patrones mojibake.
- [x] **T3. Ejecutar motor de protección `scripts/protect.js` para compilar artefactos.** RF-1, RNF-2
  - Hecho cuando: `index.html`, `V2/Index.html` e `index.dev.html` se compilen exitosamente sin errores de sintaxis ni mojibake.
- [x] **T4. Ejecutar validación completa de pruebas `node --test`.** RF-1, RF-2, RF-3, RF-4, RNF-1
  - Hecho cuando: `node --test tests/encoding.test.js` retorne código de salida 0 con 100% de tests en verde.
- [x] **T5. Actualizar `memory.md` y documentar cierre de la spec.** RF-1, RF-2
  - Hecho cuando: `memory.md` refleje la resolución de la incidencia de codificación.
