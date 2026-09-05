# Seguridad

Este proyecto usa `config.js` (excluido del repositorio mediante `.gitignore`) para separar
endpoints y credenciales del código fuente publicado.

## Recomendaciones

- Nunca subas URLs firmadas, tokens o credenciales directamente al código.
- Usa siempre `config.example.js` como plantilla y `config.js` como archivo local, no versionado.
- Si necesitas exponer este formulario en producción, considera una capa backend intermedia
  para no exponer endpoints sensibles directamente al navegador.
- Antes de hacer público cualquier repositorio, revisa el historial completo de commits
  (no solo el estado actual del código) para confirmar que nunca se haya subido información sensible.

## Reportar un problema

Si encuentras un problema de seguridad relacionado con este proyecto de portafolio,
puedes abrir un issue describiendo el hallazgo de forma general, sin incluir datos sensibles.
