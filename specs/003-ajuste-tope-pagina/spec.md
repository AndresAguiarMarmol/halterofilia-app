# Spec 003 — Ajuste del Tope de la Pantalla Principal (Safe Area y Espaciado Superior)

Estado: implementada

## Contexto y objetivo
Tras la simplificación de la cabecera (Spec 002), el encabezado superior pasó de contener 11 botones a mostrar únicamente el título y el botón `#btnHeaderMenuToggle`. Al reducirse la altura global y carecer de compensación para la zona segura superior (`safe-area-inset-top`), el tope de la página principal quedó situado excesivamente arriba, pegado al límite físico de la pantalla. En dispositivos móviles con notch, cámara frontal o barra de estado translúcida (definida en el viewport con `viewport-fit=cover`), el botón de menú y la marca quedan superpuestos con los indicadores del sistema (reloj, batería, notch), volviéndose inaccesibles o muy difíciles de presionar.
El objetivo es incorporar un espaciado ergonómico superior en la cabecera y en el inicio de la pantalla principal que respete la zona segura de dispositivos móviles y proporcione un área de toque despejada y cómoda en cualquier pantalla.

## Usuarios
- Atletas y entrenadores de halterofilia que utilizan la aplicación en teléfonos móviles (PWA / Safari / Chrome) y ordenadores.

## Historias de usuario
- **HU-1:** Como usuario en teléfono móvil, quiero que la cabecera y el botón de menú queden ubicados debajo de la barra de estado y el notch para poder pulsarlos con facilidad sin conflicto táctil con el sistema operativo.
- **HU-2:** Como usuario en cualquier dispositivo, quiero una cabecera con altura y separación equilibradas para que el acceso a las funciones sea visible e inmediato.

## Requisitos funcionales (EARS)
- **RF-1:** EL SISTEMA aplicará a la cabecera superior (`<header>`) un espaciado interno superior que contemple tanto un valor base confortable como la zona segura del dispositivo: `padding-top: max(14px, calc(10px + env(safe-area-inset-top)))`.
- **RF-2:** EL SISTEMA definirá una altura mínima y márgenes confortables en el encabezado (`min-height: 56px`, `padding-bottom: 12px`, padding lateral con `env(safe-area-inset-left)` y `env(safe-area-inset-right)`), asegurando que el botón `#btnHeaderMenuToggle` mantenga un área de pulsación táctil amplia ($\ge 42\text{px}$) y cómoda.
- **RF-3:** EL SISTEMA mantendrá la posición del panel flotante `#headerDropdownMenu` coordinada con la cabecera, de modo que al desplegarse comience exactamente debajo de la barra ajustada (`top: calc(100% + 8px)`).
- **RF-4:** EL SISTEMA no alterará ninguna funcionalidad previa, estructura de datos en `localStorage`, botones ni lógica de cálculo de carga.

## Requisitos no funcionales
- **RNF-1:** Compatibilidad completa con pantallas con notch / isla dinámica (iOS Safari) y perforación de cámara (Android).
- **RNF-2:** Fallback limpio para navegadores sin safe-area (escritorio) utilizando valores mínimos en `max()`.
- **RNF-3:** Todas las pruebas automatizadas de codificación y menú deben mantenerse en verde (`npm test`).

## Casos límite
- Dispositivos antiguos o navegadores que no evalúan `env(safe-area-inset-top)`: La función CSS `max(14px, ...)` o fallback directo garantiza al menos 14px de acolchado superior.
- Despliegue del menú hamburguesa: El menú desplegable `#headerDropdownMenu` debe permanecer accesible y no quedar empujado fuera de la pantalla en dispositivos de baja altura.

## Fuera de alcance
- Modificación de colores, temas, tipografía o funcionalidades de cálculo.
- Alteración de los modales o barras de navegación secundarias.

## Criterios de finalización
1. La cabecera y el botón `#btnHeaderMenuToggle` cuentan con espaciado superior ergonómico visible y accesible en móviles y escritorio.
2. `tests/top_spacing.test.js` verifica la presencia de la regla de zona segura superior y altura ergonómica.
3. `npm test` y `npm run protect` se ejecutan al 100% con éxito.
4. Cambios sincronizados y subidos a GitHub.

## Dudas abiertas
- [NECESITA ACLARACIÓN] Ninguna. La solución estándar para este problema de diseño web móvil es aplicar `padding-top` con `env(safe-area-inset-top)` y altura mínima en el elemento `<header>`.
