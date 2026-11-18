# MEMORY.md — Diario de Desarrollo

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- **Versión activa:** V3.26.09 (Noviembre 2026).
- **Entorno compilado y blindado:** `app.src.js` ofuscado en `index.html` y `V2/Index.html` con AST Control Flow Flattening y RC4 via `javascript-obfuscator`.
- **Codificación y Calidad:** 100% UTF-8 limpio sin BOM ni mojibake. Verificado con `npm test` (8 tests en verde).
- **Funcionalidades operativas:**
  - **Cabecera colapsable moderna:** Botón compacto `#btnHeaderMenuToggle` que despliega el panel flotante `#headerDropdownMenu` con los 11 controles del sistema (Atleta, Demo, Reportes, PRs, Licencia, Respaldo, Recuperar, Box, Unidad, Barra, Modo Visual) sin alterar IDs, listeners ni datos persistentes.
  - Persistencia de preferencias del atleta: box y pesos disponibles guardados por perfil.
  - Priorización estricta del menor número de pesas en la barra (`Opción 1` siempre es el óptimo físico).
  - Cálculo simétrico de barra olímpica en Kgs y Lbs con precisión $\ge 95\%$.
  - Inventario interactivo de discos por centro con persistencia en tiempo real.
  - Selector exclusivo Kgs / Lbs en cabecera y tarjeta de peso objetivo con conversión en caliente.
  - Gestor integral de Boxes (Crear, Modificar, Eliminar) y PRs en 11 disciplinas.
  - Licenciamiento offline SHA-256 con 7 días de trial y Device ID.

## Decisiones (y por qué)
  - **Cabecera colapsable con menú flotante contextual:** Reduce la saturación visual en móviles y escritorio, manteniendo acceso inmediato a todas las herramientas sin colisionar con el dock lateral.
  - **Preservación estricta de IDs en el DOM:** Asegura 100% de compatibilidad con listeners existentes y lógica de sincronización de atletas, unidades y temas.
  - **Pruebas automatizadas con `node --test`:** Validación de codificación y consistencia del DOM en cada build.

## Aprendizajes y errores a evitar
  - **Asegurar UTF-8 sin BOM al guardar:** Evitar editores que guarden en Windows-1252 o corrompan tildes/emojis.
  - **NUNCA modificar `index.html` directamente:** Todo cambio en JavaScript debe realizarse en `app.src.js` y compilarse con `npm run protect`.

## Próximos pasos
  - Monitorear experiencia de usuario y desempeño en PWA y empaquetado móvil.
