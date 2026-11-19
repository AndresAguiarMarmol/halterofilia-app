# Tareas — Spec 003: Ajuste del Tope de la Pantalla Principal

- [x] **T1. Diseñar e implementar prueba automatizada de espaciado en rojo.** RF-1, RF-2, RNF-1
  - Hecho cuando: `tests/top_spacing.test.js` verifique la presencia de `safe-area-inset-top` y la altura ergonómica en la cabecera, fallando inicialmente con `node --test`.
- [x] **T2. Modificar el espaciado y zona segura de la cabecera en `index.backup.html`.** RF-1, RF-2, RF-3, RNF-1
  - Hecho cuando: `header` contenga `padding-top: max(14px, calc(10px + env(safe-area-inset-top)))`, altura mínima y paddings laterales seguros, y el botón `#btnHeaderMenuToggle` tenga altura de pulsación amplia.
- [x] **T3. Compilar con `scripts/protect.js` hacia `index.html` y `V2/Index.html`.** RNF-3
  - Hecho cuando: `npm run protect` compile exitosamente con sintaxis AST 100% válida.
- [x] **T4. Validar suite completa de pruebas `npm test` en verde.** RF-1 a RF-4, RNF-1 a RNF-3
  - Hecho cuando: Todos los tests pasen (codificación, menú y espaciado superior).
- [x] **T5. Actualizar `memory.md` y sincronizar cambios en GitHub.**
  - Hecho cuando: Se actualice `memory.md`, se realice el commit semántico y se suba a `origin/main`.
