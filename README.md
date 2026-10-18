# PLAYMAKER

Minijuegos de fútbol diarios: **Player Career**, **Trophy Room** y **All-Time XI**.

## Estado del proyecto
- Fase 1 (diseño y pantallas): hecha.
- Fase 2 (reglas y guardado de rachas en el dispositivo): hecha y probada con tests del motor.
- Fase 3 (base de datos compartida, retos verificados, publicación en Cloudflare): **pendiente**.

## Qué hay de verdad y qué no
- Las rachas y los resultados se guardan **solo en el navegador del dispositivo** (`localStorage`). No hay sincronización entre dispositivos.
- Los retos de `js/games-demo.js` son **ejemplos sin verificar** y son los mismos todos los días.
- Las respuestas están en el código público. Se corregirá en la Fase 3.

## Estructura
- `index.html`: página principal.
- `css/style.css`: diseño.
- `js/engine.js`: reglas (rachas, un intento por modalidad y día, fallos, marcador).
- `js/games-demo.js`: retos de ejemplo.
- `js/app.js`: pantallas y eventos.
- `tests/engine.test.js`: pruebas automáticas del motor.
- `prototipo-original/`: copia del prototipo en un solo archivo, sin tocar.

## Probar
- Web: abre `index.html` en el navegador.
- Tests (necesita Node.js): `node tests/engine.test.js`
