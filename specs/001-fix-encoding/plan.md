# Plan de Implementación — Spec 001: Corrección de Codificación UTF-8

## Archivos y responsabilidades
- `tests/encoding.test.js`: Suite de pruebas automatizadas con `node:test` para escanear archivos fuente y artefactos generados, detectando patrones mojibake y validando UTF-8 puro. (RF-1, RF-2, RNF-1)
- `app.src.js`: Código fuente JavaScript principal. Restaurar codificación UTF-8 desde el punto base limpio (`commit 04e529f`), manteniendo la estandarización `su-usuario@dominio.com`. (RF-1, RF-2, RF-3, RF-4)
- `index.backup.html`: Plantilla base HTML de producción. Restaurar codificación UTF-8 manteniendo `su-usuario@dominio.com`. (RF-1, RF-2, RF-3)
- `scripts/protect.js`: Motor de ofuscación. Se ejecuta para regenerar `index.html`, `V2/Index.html` e `index.dev.html` libres de caracteres extraños. (RF-1, RNF-2)

## Algoritmo / Estrategia
1. Diseñar suite de pruebas en `tests/encoding.test.js` que busque secuencias comunes de mojibake (`/(?:[\u00C0-\u00C3\u00C5\u00C7\u00C9\u00D1\u00D3\u00DA][\u0080-\u00BF]|\uFFFD)/g`) y verifique la presencia de caracteres legítimos en español y el email `su-usuario@dominio.com`.
2. Ejecutar prueba inicial: constatar que falla (rojo) debido a los 270+ patrones mojibake presentes actualmente.
3. Restaurar `app.src.js` y `index.backup.html` a partir de la versión limpia `04e529f`, aplicando la actualización requerida de `"atleta@halterofilia.com"` a `"su-usuario@dominio.com"` en ambos archivos en codificación UTF-8 estricta.
4. Compilar con `node scripts/protect.js` para generar los bundles protegidos (`index.html`, `V2/Index.html`) y de desarrollo (`index.dev.html`).
5. Ejecutar `node --test tests/encoding.test.js` para constatar que pasa (verde).
6. Actualizar `memory.md`.

## Decisiones justificadas
- **Restauración desde el commit `04e529f` + reaplicación de `su-usuario@dominio.com` vs. intentar decodificar/reemplazar heurísticamente las cadenas corruptas:**
  - *Alternativa descartada:* Reemplazo heurístico de bytes binarios o regex. Puede generar inconsistencias sutiles con emojis multicódigo o secuencias mixtas.
  - *Decisión elegida:* Restaurar la base exacta previa limpia y reaplicar el único cambio que se introdujo en `cc27522`. Esto garantiza 100% de fidelidad al código original probado y funcional.

