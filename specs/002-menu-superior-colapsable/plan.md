# Plan de Implementación — Spec 002: Menú Superior Colapsable en Pantalla Principal

## 1. Archivos y responsabilidades
- `index.backup.html`:
  - Enriquecer la estructura del `<header>`:
    - Agregar el botón compacto `#btnHeaderMenuToggle` (con icono `☰`, `aria-label="Abrir Menú de Opciones"`, `aria-expanded="false"`).
    - Envolver el contenedor `.header-actions` o transformarlo en `#headerDropdownMenu` con clase CSS `.header-dropdown-menu`, posicionado de forma absoluta debajo del botón de menú, oculto por defecto (`display: none` o transform/opacity) y visible al activarse con la clase `.open`.
    - Añadir reglas CSS elegantes para el dropdown: diseño tipo tarjeta flotante oscura con `backdrop-filter: blur(10px)`, borde redondeado, sombra profunda, padding y disposición en grid/columna organizada para los 11 controles.
- `app.src.js`:
  - Agregar lógica pura y de control para el menú colapsable:
    - Escucha de evento `click` en `#btnHeaderMenuToggle` para alternar la clase `.open` y el atributo `aria-expanded`.
    - Escucha global de clics en `document` para cerrar el menú si se hace clic fuera de `#btnHeaderMenuToggle` y `#headerDropdownMenu`.
    - Escucha de tecla `Escape` en `document` para cerrar el menú.
    - Cierre automático del menú al hacer clic en botones de acción que abren modales.
    - Garantizar que las funciones de actualización del DOM existentes (`updateHeaderAthlete()`, `renderHeaderBoxOptions()`, etc.) sigan apuntando a los mismos elementos sin roturas.
- `scripts/protect.js`:
  - Se ejecuta mediante `npm run protect` para compilar y ofuscar el código desde `app.src.js` hacia `index.html` y `V2/Index.html`, y actualizar `index.dev.html`.
- `tests/menu_header.test.js`:
  - Nueva suite de pruebas automatizadas con `node:test` para verificar:
    - Existencia del botón `#btnHeaderMenuToggle` en la plantilla y artefactos.
    - Presencia de los 11 controles originales dentro del menú desplegable `#headerDropdownMenu`.
    - Integridad de IDs y clases funcionales requeridas.
- `memory.md`:
  - Registro del avance de la spec 002 y nueva decisión de UX en cabecera.

## 2. Pseudocódigo del Algoritmo del Menú
```javascript
const menuToggleBtn = document.getElementById("btnHeaderMenuToggle");
const dropdownMenu = document.getElementById("headerDropdownMenu");

function toggleHeaderMenu(forceState) {
  const isOpen = forceState !== undefined ? forceState : !dropdownMenu.classList.contains("open");
  if (isOpen) {
    dropdownMenu.classList.add("open");
    menuToggleBtn.setAttribute("aria-expanded", "true");
    menuToggleBtn.classList.add("active");
  } else {
    dropdownMenu.classList.remove("open");
    menuToggleBtn.setAttribute("aria-expanded", "false");
    menuToggleBtn.classList.remove("active");
  }
}

// Click en el botón de hamburguesa
menuToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleHeaderMenu();
});

// Evitar que clics dentro del menú lo cierren prematuramente (ej. al interactuar con el select)
dropdownMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  // Si se hizo click en un botón de acción modal, cerrar menú
  if (e.target.closest("#btnSwitchAthlete, #btnOpenDemoHeader, #btnOpenReports, #btnOpenPRModal, #btnOpenLicenseModal, #btnHeaderBackup, #btnHeaderRestore")) {
    toggleHeaderMenu(false);
  }
});

// Clic fuera del menú
document.addEventListener("click", (e) => {
  if (dropdownMenu.classList.contains("open")) {
    toggleHeaderMenu(false);
  }
});

// Tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dropdownMenu.classList.contains("open")) {
    toggleHeaderMenu(false);
  }
});
```

## 3. Decisiones Técnicas Justificadas
- **Menú Dropdown flotante anclado a la derecha vs. Menú lateral (Drawer/Off-canvas):**
  - *Alternativa descartada (Drawer lateral):* Requiere un overlay completo a toda la pantalla que oculta toda la vista y puede competir con el dock vertical de acceso rápido existente (`#verticalAppToolbar`).
  - *Decisión elegida (Dropdown flotante):* Es ligero, no compite con el dock vertical, se ancla de forma natural a la esquina superior derecha y permite un acceso rápido con mínimo desplazamiento visual.
- **Mantener los mismos elementos en el DOM con sus IDs idénticos:**
  - Garantiza 100% de retrocompatibilidad con toda la lógica de modales, listeners, sincronización de temas, cambio de unidad en caliente y persistencia de atletas.

## 4. Estrategia de Tests
- Test unitario con `node:test` (`tests/menu_header.test.js`):
  1. Verificar que `#btnHeaderMenuToggle` existe en `index.backup.html`.
  2. Verificar que `#headerDropdownMenu` contiene los 11 IDs exactos.
  3. Verificar que `app.src.js` implementa la lógica de apertura/cierre y eventos de escape y clic exterior.
  4. Ejecución conjunta con `npm test`.
