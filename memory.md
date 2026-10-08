# MEMORY.md — Diario de Desarrollo

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- **Versión activa:** V3.26.03 (Octubre 2026).
- **Entorno compilado y blindado:** `app.src.js` ofuscado en `index.html` y `V2/Index.html` con AST Control Flow Flattening y RC4 via `javascript-obfuscator`.
- **Funcionalidades operativas:**
  - Cálculo simétrico de barra olímpica con soporte para discos en Kgs y Lbs y selección de alternativas.
  - Inventario interactivo de discos por centro de entrenamiento (Box Central, Garage Gym, Halterofilia Club) con visualización simultánea de pesas en ambas medidas (Kgs y Lbs).
  - Selector de Unidad Objetivo en cabecera con alternancia binaria exclusiva entre Kgs $\leftrightarrow$ Lbs.
  - Selector de Unidad en la tarjeta de Peso Objetivo (Kgs / Lbs) sincronizado con cabecera y conversión numérica en caliente.
  - Desacople total de la unidad visual: la elección de Kgs o Lbs solo afecta la visualización del objetivo; las alternativas pueden contener discos en cualquiera de las opciones (Kgs/Lbs).
  - Selector y gestor integral de Boxes / Centros: opciones para Crear, Modificar y Eliminar centros.
  - Motor de armado de discos con garantía de precisión mínima del 95% (evaluación de exactitud física y badge de precisión en la tarjeta y en cada alternativa).
  - Gestión de PRs en 11 movimientos olímpicos y gráficas temporales de progreso.
  - Licenciamiento offline con 7 días de trial, Device ID y validación criptográfica SHA-256.
  - Selector de temas (Oscuro, Claro, Sistema) y barra visual centrada sin huecos.

## Decisiones (y por qué)
  - **Selector de unidad exclusivo Kgs / Lbs:** Un peso objetivo en barra se conceptualiza en una sola unidad métrica o imperial. No tiene sentido una meta en "Ambas", por lo que se restringe a Kgs y Lbs.
  - **Desacople de la unidad visual del objetivo respecto a las alternativas de carga:** Permite que un atleta ingrese su objetivo en Kgs (o Lbs) y el sistema aproveche libremente todo el equipamiento del box (kilos, libras o combinaciones mixtas).
  - **Inventario visible con ambas medidas:** Los discos disponibles en el box se muestran en el inventario interactivo sin filtrarse por la unidad elegida para la barra.
- **Offline-First sin dependencias runtime:** Garantiza portabilidad total en móviles y despliegue rápido como PWA o APK/AAB vía PWABuilder.
- **Límite físico de 4 discos por lado:** Evita configuraciones irreales en la manga de la barra olímpica.
- **Conversión bidireccional histórica:** Convertir tanto los PRs actuales como el historial temporal al cambiar unidad para evitar quiebres en gráficos.

## Aprendizajes y errores a evitar
- **NUNCA modificar `index.html` directamente:** Todo cambio en JavaScript debe realizarse en `app.src.js` y compilarse con `npm run protect`.
- **Verificar `localStorage` defensivamente:** Inicializar siempre estructuras por defecto si las llaves no existen o están corruptas.

## Próximos pasos
- Monitorear métricas de uso y posibles requerimientos de exportación avanzada o integración adicional de movimientos.
