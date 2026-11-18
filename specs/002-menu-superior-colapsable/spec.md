# Spec 002 — Menú Superior Colapsable en Pantalla Principal

Estado: implementada

## Contexto y objetivo
Actualmente, la cabecera superior (`<header>`) de la aplicación muestra de forma directa y fija un conjunto numeroso de 11 controles y accesos directos (`.header-actions`): cambio de atleta, demo animado, reportes, PRs, licencia, respaldo, recuperación, selector de Box, unidad objetivo (Kgs/Lbs), tipo de barra olímpica y modo visual (tema). 
Esto satura el espacio superior en dispositivos móviles y genera ruido visual en la pantalla principal.
El objetivo es reemplazar la visualización directa de este menú por un único botón compacto (icono de menú hamburguesa `☰`) en la cabecera superior. Al hacer clic o tap sobre este botón, se desplegará un menú/panel flotante elegante y accesible que contendrá la totalidad de las opciones retiradas, manteniendo el 100% de las funcionalidades, listeners, sincronizaciones dinámicas y datos sin alteración.

## Usuarios
- Atletas y entrenadores de halterofilia que requieren una interfaz más limpia y enfocada en el cálculo de cargas en barra sin perder acceso rápido a la configuración del sistema.

## Historias de usuario
- **HU-1:** Como atleta/entrenador, quiero que la parte superior de la pantalla principal se vea despejada y moderna, mostrando únicamente la marca y un botón discreto de menú, para concentrarme en la barra y los pesos.
- **HU-2:** Como atleta/entrenador, quiero tocar el botón de menú superior y ver desplegadas todas las herramientas y ajustes de la app (Atleta, Demo, Reportes, PRs, Licencia, Respaldo, Recuperar, Box, Unidad, Barra, Modo) en un solo lugar accesible.
- **HU-3:** Como atleta/entrenador, quiero que al seleccionar una opción o tocar fuera del menú, este se cierre automáticamente y ejecute la acción correspondiente sin alterar ningún dato guardado.

## Requisitos funcionales (EARS)
- **RF-1:** EL SISTEMA ocultará de la vista fija permanente de la cabecera superior el contenedor de opciones `.header-actions`.
- **RF-2:** EL SISTEMA mostrará en la cabecera superior, junto al título de la marca, un botón compacto de menú (`#btnHeaderMenuToggle`) con icono representativo (`☰`) y accesibilidad táctil adecuada (mínimo 44x44px de área de pulsación).
- **RF-3:** CUANDO el usuario presione el botón `#btnHeaderMenuToggle`, EL SISTEMA alternará la visibilidad (apertura / cierre) de un menú desplegable flotante (`#headerDropdownMenu`).
- **RF-4:** EL SISTEMA ubicará dentro del menú desplegable `#headerDropdownMenu` todos los controles que estaban en la cabecera:
  1. `#btnSwitchAthlete` (Selector/Gestor de Atletas con su avatar e icono)
  2. `#btnOpenDemoHeader` (Acceso al Demo animado)
  3. `#btnOpenReports` (Reportes de rendimiento)
  4. `#btnOpenPRModal` (Gestor de Récords Personales)
  5. `#btnOpenLicenseModal` (Estado y activación de Licencia)
  6. `#btnHeaderBackup` (Respaldo por correo electrónico)
  7. `#btnHeaderRestore` (Recuperación de datos)
  8. `#headerBoxSelect` (Selector desplegable de Box / Centro)
  9. `#btnHeaderUnit` (Alternancia de Unidad Kgs / Lbs)
  10. `#btnHeaderBar` (Alternancia de Barra 15 kg / 20 kg)
  11. `#btnHeaderTheme` (Alternancia de Tema Oscuro / Claro / Sistema)
- **RF-5:** CUANDO el menú desplegable esté abierto y el usuario haga clic o tap fuera de su área, o presione la tecla `Escape`, EL SISTEMA cerrará el menú.
- **RF-6:** CUANDO el usuario haga clic en cualquier opción que abra un modal (Atleta, Demo, Reportes, PRs, Licencia, Respaldo, Recuperar), EL SISTEMA cerrará el menú desplegable y abrirá el modal correspondiente.
- **RF-7:** EL SISTEMA preservará intactos todos los IDs, clases funcionales, event listeners, datos en `localStorage` y mecanismos de sincronización en tiempo real (avatar de atleta, texto de unidad en botón, peso de barra y tema activo).

## Requisitos no funcionales
- **RNF-1:** Estética consistente con el diseño de Halterofilia Pro (fondo oscuro translúcido con desenfoque de fondo `backdrop-filter: blur`, borde cian/gris sutil, sombras y transiciones suaves).
- **RNF-2:** Totalmente adaptable tanto a pantallas móviles (smartphones de 360px a 480px) como a tablets y escritorios.
- **RNF-3:** No requerir ninguna librería ni dependencia externa (código HTML5, CSS3 y Vanilla JavaScript puro).
- **RNF-4:** Cumplimiento estricto del flujo de compilación de `AGENTS.md` (`app.src.js` -> `scripts/protect.js` -> `index.html` y `V2/Index.html`).

## Casos límite
- **Interacción con selects (`#headerBoxSelect`):** Al desplegar la lista de opciones del selector de centros dentro del menú, no debe cerrarse el menú prematuramente por eventos de clic internos.
- **Convivencia con la barra vertical lateral (`#verticalAppToolbar`):** El nuevo menú colapsable de la cabecera no debe superponerse visualmente de forma conflictiva con el dock vertical ni bloquear sus acciones.
- **Cambio de orientación o tamaño de pantalla:** El menú debe adaptarse a la altura disponible con scroll vertical (`overflow-y: auto`) si la pantalla es de altura reducida en horizontal (landscape).

## Fuera de alcance
- Alterar el funcionamiento interno de los modales o del motor de cálculo de barra olímpica.
- Modificar o eliminar la barra lateral de herramientas (`#verticalAppToolbar`).
- Crear un nuevo sistema de almacenamiento o cambiar las llaves de `localStorage`.

## Criterios de finalización
1. La cabecera superior solo muestra el logo/título y el botón compacto de menú `☰`.
2. Al pulsar `☰`, el menú se despliega mostrando las 11 opciones completas con estilos pulidos.
3. Al pulsar cualquier opción o hacer clic fuera / presionar Escape, el menú se cierra y la acción se ejecuta sin errores.
4. `npm test` y `npm run protect` se ejecutan con 100% de éxito.

## Dudas abiertas
- [NECESITA ACLARACIÓN] Ninguna crítica identificada. Se plantea formato desplegable contextual (dropdown flotante anclado a la esquina superior derecha) como el más ergonómico y estándar para este tipo de aplicación.
