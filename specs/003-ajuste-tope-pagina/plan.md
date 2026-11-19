# Plan Técnico — Spec 003: Ajuste del Tope de la Pantalla Principal

## 1. Archivos que se modifican y responsabilidades
- `index.backup.html`:
  - En la sección `<style>`:
    - Actualizar la regla `header`:
      ```css
      header {
        width: 100%;
        background: var(--header-bg);
        border-bottom: 1px solid var(--card-border);
        padding-top: max(14px, calc(10px + env(safe-area-inset-top)));
        padding-bottom: 12px;
        padding-left: max(16px, calc(14px + env(safe-area-inset-left)));
        padding-right: max(16px, calc(14px + env(safe-area-inset-right)));
        min-height: 58px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 50;
        gap: 10px;
        transition: background-color 0.25s ease, border-color 0.25s ease;
      }
      ```
    - Mejorar el botón `#btnHeaderMenuToggle`:
      - Añadir `min-height: 40px`, padding ergonómico y alineación vertical centrada para facilitar el toque con el pulgar.
    - Asegurar que `.header-dropdown-menu` mantenga `top: calc(100% + 8px);` para que comience justo debajo del encabezado acolchado.
- `tests/top_spacing.test.js`:
  - Nueva prueba automatizada para verificar:
    - Que `header` en `index.backup.html` define `safe-area-inset-top`.
    - Que `min-height` o padding superior confortable esté presente.
    - Que los artefactos generados en `index.html` y `V2/Index.html` contengan el ajuste.
- `scripts/protect.js`:
  - Compilación hacia `index.html` y `V2/Index.html`, regeneración de `index.dev.html`.
- `memory.md`:
  - Registro de la solución implementada.

## 2. Decisiones Técnicas Justificadas
- **Ajustar el padding superior de `header` con `env(safe-area-inset-top)` en lugar de modificar `body`:**
  - *Alternativa descartada:* Colocar `padding-top` en `body` causaría que el fondo del `header` sticky se corte o deje una franja desalineada al hacer scroll.
  - *Decisión elegida:* Al colocar el `safe-area-inset-top` dentro del propio `<header>`, el color de fondo del encabezado (`var(--header-bg)`) cubre de forma continua y elegante la barra de estado del teléfono mientras el contenido y los botones se mantienen a salvo debajo de ella.

## 3. Estrategia de Tests
- Crear `tests/top_spacing.test.js` con `node:test`.
- Ejecutar en fase roja (fallo previo al cambio).
- Implementar en `index.backup.html`.
- Compilar con `node scripts/protect.js`.
- Comprobar pase en verde de la suite completa (`npm test`).
- Push a GitHub.
