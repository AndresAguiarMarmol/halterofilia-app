# MEMORY.md — Diario de Desarrollo

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- **Versión activa:** V3.26.02 (Octubre 2026).
- **Entorno compilado y blindado:** `app.src.js` ofuscado en `index.html` y `V2/Index.html` con AST Control Flow Flattening y RC4 via `javascript-obfuscator`.
- **Funcionalidades operativas:**
  - Cálculo simétrico de barra olímpica con soporte híbrido Kg/Lbs y selección de alternativas.
  - Inventario interactivo de discos por centro de entrenamiento (Box Central, Garage Gym, Halterofilia Club).
  - Selector de Unidad Objetivo en cabecera con alternancia cíclica entre Kgs / Lbs / Ambas (modo híbrido).
  - Selector y gestor integral de Boxes / Centros: opciones directas para Crear, Modificar y Eliminar centros desde el botón/selector de cabecera y modal de administración.
  - Gestión de PRs en 11 movimientos olímpicos y gráficas temporales de progreso.
  - Licenciamiento offline con 7 días de trial, Device ID y validación criptográfica SHA-256.
  - Selector de temas (Oscuro, Claro, Sistema) y barra visual centrada sin huecos.

## Decisiones (y por qué)
- **Separación estricta `app.src.js` vs `index.html`:** Permite desarrollar y depurar en texto claro (`index.dev.html`) sin arriesgar la exposición del código fuente de producción.
- **Offline-First sin dependencias runtime:** Garantiza portabilidad total en móviles y despliegue rápido como PWA o APK/AAB vía PWABuilder.
- **Límite físico de 4 discos por lado:** Evita configuraciones irreales en la manga de la barra olímpica.
- **Conversión bidireccional histórica:** Convertir tanto los PRs actuales como el historial temporal al cambiar unidad para evitar quiebres en gráficos.

## Aprendizajes y errores a evitar
- **NUNCA modificar `index.html` directamente:** Todo cambio en JavaScript debe realizarse en `app.src.js` y compilarse con `npm run protect`.
- **Verificar `localStorage` defensivamente:** Inicializar siempre estructuras por defecto si las llaves no existen o están corruptas.

## Próximos pasos
- Monitorear métricas de uso y posibles requerimientos de exportación avanzada o integración adicional de movimientos.
