# Tareas — Spec 002: Menú Superior Colapsable en Pantalla Principal

- [x] **T1. Diseñar e implementar prueba automatizada en rojo.** RF-1, RF-2, RF-4, RNF-4
  - Hecho cuando: `tests/menu_header.test.js` exista y verifique la existencia del botón `#btnHeaderMenuToggle` y el contenedor `#headerDropdownMenu` con los 11 elementos, fallando inicialmente con `node --test`.
- [x] **T2. Modificar la plantilla HTML y estilos en `index.backup.html`.** RF-1, RF-2, RF-4, RNF-1, RNF-2
  - Hecho cuando: La cabecera muestre solo el logo/marca y el botón compacto `#btnHeaderMenuToggle`, y los 11 controles residan dentro de `#headerDropdownMenu` con estilos CSS de dropdown flotante.
- [x] **T3. Implementar la lógica del menú colapsable en `app.src.js`.** RF-3, RF-5, RF-6, RF-7
  - Hecho cuando: Se soporte apertura/cierre por click, cierre por clic exterior, cierre por tecla Escape y cierre automático al abrir modales, manteniendo intactas todas las funcionalidades.
- [x] **T4. Ejecutar compilación y ofuscación con `scripts/protect.js`.** RNF-4
  - Hecho cuando: `npm run protect` compile exitosamente `index.html`, `V2/Index.html` e `index.dev.html`.
- [x] **T5. Validar suite de pruebas automatizadas en verde.** RF-1 a RF-7, RNF-1 a RNF-4
  - Hecho cuando: `npm test` pase al 100% (todas las pruebas de codificación y del menú en verde).
- [x] **T6. Actualizar `memory.md` y `AGENTS.md` con la nueva arquitectura de cabecera.**
  - Hecho cuando: Ambos documentos registren la nueva especificación y decisión arquitectónica.
