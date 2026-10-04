# AGENTS.md — Halterofilia Pro

Instrucciones maestras, arquitectura y reglas operativas para agentes de IA que desarrollen o modifiquen esta base de código.

---

## 1. Visión General del Proyecto

- **Nombre:** Halterofilia Pro (Atleta & Barra Olímpica)
- **Tipo:** Progressive Web App (PWA) / Single Page Application (SPA) para atletas y entrenadores de Halterofilia y CrossFit.
- **Filosofía Arquitectónica:**
  - **100% Offline-First y Portable:** No requiere servidores ni bases de datos remotas. Todo persiste en `localStorage`.
  - **Cero dependencias en runtime:** Ejecución nativa pura en navegador (`HTML5`, `CSS3`, `JavaScript ES6+`).
  - **Empaquetado PWA / Mobile:** Compatible con iOS Safari (Add to Home Screen), Android PWA y empaquetado para Google Play Store mediante PWABuilder.

---

## 2. Estructura de Archivos y Flujo de Trabajo CRÍTICO

> [!CAUTION]
> **REGLA DE ORO DE DESARROLLO:**
> **NUNCA** edites código JavaScript directamente en `index.html` ni en `V2/Index.html`. Esos archivos contienen código ofuscado generado automáticamente por el build pipeline.

| Archivo / Carpeta | Propósito | Rol Operativo |
| :--- | :--- | :--- |
| [`app.src.js`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/app.src.js) | **Código fuente JavaScript claro** (~3,240 líneas) | **EDITAR AQUÍ** toda la lógica JavaScript. |
| [`index.dev.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/index.dev.html) | Entorno de desarrollo en texto claro | Consume `<script src="app.src.js"></script>`. Úsalo para depurar en navegador sin ofuscación. |
| [`index.backup.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/index.backup.html) | Plantilla base de producción (HTML/CSS) | Plantilla leída por `protect.js` para inyectar el bundle ofuscado. |
| [`index.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/index.html) | Artefacto de **Producción** | Contiene el bundle JS ofuscado y blindado. Generado por `scripts/protect.js`. |
| [`V2/Index.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/V2/Index.html) | Réplica sincronizada de producción | Actualizada automáticamente por `protect.js`. |
| [`scripts/protect.js`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/scripts/protect.js) | Motor de ofuscación y empaquetado | AST Control Flow Flattening, RC4, Rename Globals, Escudo anti-inspección y sincronizador de versión. |
| [`scripts/serve.js`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/scripts/serve.js) | Servidor HTTP local nativo | Servidor en Node.js sobre puerto `8089`. |
| [`panel_administrador_de_licencias.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/panel_administrador_de_licencias.html) | Generador privado de licencias | Herramienta local privada (en `.gitignore`) para generar tokens a partir de códigos `REQ`. |

---

## 3. Comandos de Construcción y Ejecución

```bash
# Iniciar servidor local de desarrollo (http://127.0.0.1:8089)
node scripts/serve.js

# Compilar y ofuscar código de app.src.js a index.html y V2/Index.html
npm run protect
# O bien:
npm run build:protect
```

### Ciclo de trabajo estándar ante cualquier cambio:
1. Modifica la lógica en [`app.src.js`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/app.src.js) (o estilos/markup en [`index.backup.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/index.backup.html)).
2. Verifica en navegador cargando [`index.dev.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/index.dev.html).
3. Ejecuta `npm run protect` para compilar la versión protegida hacia [`index.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/index.html) y [`V2/Index.html`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/V2/Index.html).

---

## 4. Reglas de Negocio y Lógica Central

### 4.1. Sistema de Licenciamiento y Seguridad Offline
- **Período de Prueba:** 7 días completos (`TRIAL_DAYS = 7`, `604800000 ms`) desde la primera apertura.
- **Bloqueo Trial:** Al expirar, se superpone un modal modal/overlay no eludible que solicita activación y muestra el contacto `+56933395447`.
- **Criptografía:** Generación de `Device ID` único por dispositivo. Cadena de solicitud: `REQ|<DeviceID>|<correo>`.
- **Validación de Token:** Token en Base64 con payload `{ deviceId, email, exp, signature }`.
- **Firma:** SHA-256 con sal fija: `"Halterofilia-SuperSecret-Salt-2026"`. Validable 100% offline mediante `crypto.subtle`.

### 4.2. Perfiles y Conversión de Unidades
- **Atleta por dispositivo:** Regla de registro de 1 atleta activo en el primer arranque, con capacidad de cambio o adición de perfiles desde el gestor.
- **Factor de conversión exacto:** $1\text{ kg} = 2.20462\text{ lbs}$.
- **Coherencia histórica:** Al cambiar la unidad preferida del atleta (Kg $\leftrightarrow$ Lbs), se convierten automáticamente:
  1. Los PRs vigentes de todos los movimientos.
  2. El historial temporal de PRs (`prHistory`) para evitar saltos o inconsistencias en gráficos y reportes.

### 4.3. Motor de Cálculo de Barra y Discos
- **Barras:** Olímpica Hombre ($20\text{ kg} / 45\text{ lb}$) y Olímpica Mujer ($15\text{ kg} / 35\text{ lb}$).
- **Inventario:**
  - Libras: `45, 35, 25, 15, 10 lb` (gris oscuro / negro).
  - Kilos IWF: `25 kg` (rojo), `20 kg` (azul), `15 kg` (amarillo), `10 kg` (verde), `5 kg` (blanco).
  - Fraccionales Kilos: `2.5 kg` (rojo), `2.0 kg` (azul), `1.5 kg` (amarillo), `1.0 kg` (verde), `0.5 kg` (blanco).
- **Restricción física:** Máximo 4 discos del mismo peso por manga para reflejar la capacidad física de la barra olímpica.
- **Estrategias:** Generación de alternativas de carga (menor número de discos, prioridad kilos, prioridad libras, balance híbrido).
- **Renderizado visual:** Mangas de acero con soporte completo y discos alineados verticalmente sin huecos en los extremos.

### 4.4. Estándar de Pie de Página y Versión
- **Formato:** `Análisis/Diseño de Andres Aguiar V3.26.<consecutivo> Santiago de Chile [Mes] [Año] - Contacto +56933395447 - Whatsapp +56933395447`.
- `protect.js` actualiza automáticamente el consecutivo y la fecha tomando la versión de [`package.json`](file:///d:/Carpetas/Desarrollos/Desarrollos%20WEB/Halterofilia/package.json).

---

## 5. Llaves de Persistencia (`localStorage`)

- `halterofilia_athletes`: Array JSON con los perfiles registrados y sus PRs.
- `halterofilia_active_athlete_id`: ID del atleta seleccionado actualmente.
- `halterofilia_device_id`: Identificador persistente del dispositivo.
- `halterofilia_install_time`: Timestamp del primer arranque para el cálculo del trial.
- `halterofilia_license_token`: Token Base64 de la licencia validada.
- `halterofilia_centers_v2`: Catálogo de centros de entrenamiento (WODs) y disponibilidad de discos por centro.
- `halterofilia_theme`: Preferencia de tema visual (`dark`, `light`, `system`).
