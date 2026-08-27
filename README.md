Aplicación web progresiva y portable (SPA) diseñada para atletas y entrenadores de halterofilia y CrossFit. Permite calcular de forma automática y visual la distribución exacta de discos en la barra según el peso objetivo, además de gestionar los récords personales (PR) en los movimientos olímpicos de **Snatch** y **Clean & Jerk**.

---

## 🚀 Características Principales

- **Gestión de Récords Personales (PR):** Registro y comparación automática de marcas máximas para *Snatch* y *Clean & Jerk*.
- **Motor de Cálculo Inteligente:**
  - Soporte para barra pesada ($45\text{ lb}$) y barra liviana ($35\text{ lb}$).
  - Inventario de discos en libras ($45, 35, 25, 15, 10\text{ lb}$) en color negro.
  - Inventario de discos fraccionados en kilogramos ($2.5, 2.0, 1.5, 1.0, 0.5\text{ kg}$) con codificación de colores reglamentarios de la IWF (Rojo, Azul, Amarillo, Verde y Blanco).
  - Cálculo simétrico y optimizado por cada extremo de la barra.
- **Simulación Gráfica:** Representación visual interactiva en tiempo real de la barra cargada con las proporciones y colores de los discos calculados.
- **Módulo de Usuarios y Seguridad:**
  - Control de acceso inicial mediante clave de instalación.
  - Registro de perfil de atleta (Nombre, Apellido, Correo).
  - Botón de **Cambio de Usuario** para alternar entre múltiples perfiles locales.
- **100% Autónomo y Portable:** Construido en un único archivo (`HTML + CSS + JS`) con persistencia en `localStorage`, sin requerir bases de datos externas ni servidores.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica y soporte para WebApps en pantalla completa en iOS y Android.
- **CSS3:** Diseño responsivo en modo oscuro (*Dark Mode*) y estilización gráfica de la barra y discos.
- **JavaScript (ES6+):** Lógica matemática de distribución (algoritmo *greedy*), manipulación del DOM y persistencia de datos local.

---

## 📲 Despliegue e Instalación

### 1. Uso Local en Computadora (Windows / Mac / Linux)
1. Descarga o clona este repositorio.
2. Abre el archivo `index.html` (o `Asistente de Halterofilia V11.html`) directamente en cualquier navegador web (Chrome, Edge, Safari, Firefox).

### 2. Uso en Dispositivos Móviles (iPhone / Android) vía GitHub Pages
1. Aloja este repositorio en **GitHub**.
2. Ve a **Settings > Pages** y en *Branch* selecciona `main` y guarda los cambios.
3. Abre el enlace generado en el navegador de tu móvil (por ejemplo, **Safari** en iPhone).
4. Presiona el botón de **Compartir** y selecciona **"Agregar a pantalla de inicio"**.

---

## 🔑 Primer Uso

1. Al abrir la app por primera vez, pulsa el botón **`⚙️ Instalación`**.
2. Ingresa la contraseña de seguridad configurada para el sistema.
3. Registra los datos del atleta (Nombre, Apellido y Correo) para inicializar el perfil.

---

## 📄 Autoría y Contacto

**Análisis y Diseño:** Andres Aguiar  
**Versión:** 1.1 — Santiago de Chile (Agosto 2026)  
**Contacto / WhatsApp:** [+56933395447](https://wa.me/56933395447)
