# MEMORY.md — Diario de Desarrollo

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- **Versión activa:** V3.26.10 (Noviembre 2026).
- **Entorno compilado y blindado:** `app.src.js` ofuscado en `index.html` y `V2/Index.html` con AST Control Flow Flattening y RC4 via `javascript-obfuscator`.
- **Codificación y Calidad:** 100% UTF-8 limpio sin BOM ni mojibake. Verificado con `npm test` (10 tests en verde).
- **Funcionalidades operativas:**
  - **Tope de página y zona segura (Safe Area):** Cabecera con `safe-area-inset-top`, altura mínima de 58px y botón `#btnHeaderMenuToggle` ergonómico ($\ge 42\text{px}$), evitando colisiones con notch, isla dinámica o barra de estado.
  - **Cabecera colapsable moderna:** Botón compacto `#btnHeaderMenuToggle` que despliega el panel flotante `#headerDropdownMenu` con los 11 controles del sistema (Atleta, Demo, Reportes, PRs, Licencia, Respaldo, Recuperar, Box, Unidad, Barra, Modo Visual) sin alterar IDs, listeners ni datos persistentes.
  - Persistencia de preferencias del atleta: box y pesos disponibles guardados por perfil.
  - Priorización estricta del menor número de pesas en la barra (`Opción 1` siempre es el óptimo físico).
  - Cálculo simétrico de barra olímpica en Kgs y Lbs con precisión $\ge 95\%$.
  - Inventario interactivo de discos por centro con persistencia en tiempo real.
  - Selector exclusivo Kgs / Lbs en cabecera y tarjeta de peso objetivo con conversión en caliente.
  - Gestor integral de Boxes (Crear, Modificar, Eliminar) y PRs en 11 disciplinas.
  - Licenciamiento offline SHA-256 con 7 días de trial y Device ID.

## Decisiones (y por qué)
  - **Safe Area en `<header>`:** Al aplicar `padding-top` con `env(safe-area-inset-top)` y `min-height: 58px` directamente en el header, el fondo del encabezado cubre la barra de estado y el contenido desciende a una zona accesible sin alterar el scroll del body.
  - **Cabecera colapsable con menú flotante contextual:** Reduce la saturación visual en móviles y escritorio, manteniendo acceso inmediato a todas las herramientas.
  - **Preservación estricta de IDs en el DOM:** Asegura 100% de compatibilidad con listeners y lógica de sincronización.
  - **Pruebas automatizadas con `node --test`:** Validación de codificación, DOM y espaciado de cabecera.

## Aprendizajes y errores a evitar
  - **Asegurar safe-area-inset-top al usar viewport-fit=cover:** Cuando el viewport cubre toda la pantalla, los elementos superiores pegados al tope quedan tapados por el hardware si no se incluye `env(safe-area-inset-top)`.
  - **NUNCA modificar `index.html` directamente:** Todo cambio en JavaScript debe realizarse en `app.src.js` y compilarse con `npm run protect`.

## Próximos pasos
  - Monitorear experiencia de usuario y accesibilidad en dispositivos iOS y Android físicos.
