# Spec 001 — Corrección de Codificación UTF-8 (Acentos y Caracteres Especiales)

Estado: implementada

## Contexto y objetivo
En la última generación de código (`commit cc27522`), se introdujo una corrupción de codificación de caracteres (mojibake) al guardar archivos UTF-8 interpretados como Windows-1252/ISO-8859-1. Esto causó que letras acentuadas (á, é, í, ó, ú), la letra ñ y diversos emojis/símbolos de la interfaz se mostraran como caracteres extraños (`Ã­`, `Ã¡`, `Ã³`, `Ã±`, ``, etc.) en `app.src.js`, `index.backup.html`, `index.html`, `V2/Index.html` e `index.dev.html`.
El objetivo es restaurar la codificación UTF-8 limpia y correcta en todos los archivos del proyecto, conservando intactas todas las funcionalidades y la estandarización del email `su-usuario@dominio.com`.

## Usuarios
- Atletas y entrenadores de halterofilia que utilizan la aplicación web y PWA.

## Historias de usuario
- HU-1: Como atleta/usuario de Halterofilia Pro, quiero ver todos los textos, tildes, la letra 'ñ' y emojis correctamente representados en la interfaz para tener una experiencia visual y funcional impecable sin caracteres corruptos.

## Requisitos funcionales (EARS)
- RF-1: EL SISTEMA mantendrá todos los archivos fuente (`app.src.js`, `index.backup.html`) y de distribución (`index.html`, `V2/Index.html`, `index.dev.html`) en codificación UTF-8 válida y estricta sin marcas BOM.
- RF-2: EL SISTEMA mostrará correctamente todos los caracteres del idioma español (vocales con tilde: á, é, í, ó, ú, Á, É, Í, Ó, Ú; consonante ñ, Ñ; signos ¿, ¡) y los símbolos/emojis de interfaz (✅, ❌, ✉️, 📞, 🔑, ✏️, 💾, 🛡️).
- RF-3: EL SISTEMA mantendrá el correo de muestra estandarizado `su-usuario@dominio.com` en el módulo de Licencia Activa, tal como fue definido en el último cambio.
- RF-4: EL SISTEMA preservará intacta la totalidad de la lógica de cálculo de barra olímpica, persistencia de preferencias de atletas y boxes, gestión de PRs y licenciamiento offline.

## Requisitos no funcionales
- RNF-1: Cero apariciones de secuencias mojibake (como `Ã`, ``, `\uFFFD`) en el código fuente ni en los artefactos de producción.
- RNF-2: La compilación de producción con `scripts/protect.js` debe ejecutarse con éxito y generar artefactos sintácticamente válidos.
- RNF-3: Compatibilidad 100% offline y PWA.

## Casos límite
- Preservación de cadenas en expresiones regulares que contengan rangos de caracteres españoles (ej. `[A-Za-zñáéíóúÁÉÍÓÚ]`).
- Preservación de emojis con modificadores de variación (ej. `✉️`, `✏️`).

## Fuera de alcance
- Modificación de nuevas reglas de negocio de barra o cálculo de discos.
- Modificación de la arquitectura de ofuscación en `scripts/protect.js`.

## Criterios de finalización
- Verificación automatizada con `node --test tests/encoding.test.js` en verde (0 errores de codificación).
- Generación exitosa de `index.html` y `V2/Index.html` mediante `node scripts/protect.js`.
