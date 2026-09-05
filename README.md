# Autorización Digital de Descuento

Aplicación web para digitalizar el proceso de autorización de descuentos asociados a dispositivos corporativos, integrando validación de colaboradores, datos del equipo, firma digital y automatización.

Proyecto inspirado en un caso real de automatización empresarial, adaptado con datos e información ficticios para portafolio.

## Objetivo

Reducir el uso de formatos manuales mediante un flujo digital que permita validar al colaborador, capturar información del equipo, registrar una firma y enviar la autorización a un proceso automatizado.

## Funcionalidades

- Búsqueda de colaboradores por número de identificación.
- Autocompletado del nombre del colaborador.
- Captura de código de activo interno.
- Captura o recepción automática del serial mediante parámetros URL.
- Fecha automática con zona horaria de Colombia.
- Firma digital mediante Canvas API.
- Validación de campos obligatorios.
- Sanitización básica de entradas.
- Manejo de errores y tiempos de espera.
- Integración con Microsoft Power Automate.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- Canvas API
- Fetch API
- Microsoft Power Automate
- Servicios HTTP / JSON

## Estructura

- `index.html`: formulario y documento de autorización.
- `estilos-descuento.css`: estilos de la interfaz.
- `script-descuento.js`: validaciones, firma digital e integración.
- `config.example.js`: ejemplo de configuración sin credenciales reales.
- `config.js`: configuración local o de despliegue; está excluida de Git.
- `SECURITY.md`: recomendaciones de seguridad del proyecto.
- `docs/capturas/`: espacio preparado para evidencias visuales (usar solo datos ficticios).

## Configuración

Este repositorio no almacena endpoints reales de Power Automate.

1. Copia `config.example.js` como `config.js`.
2. Define en `config.js` los endpoints correspondientes a tu propio entorno de prueba.
3. No subas `config.js` al repositorio (ya está en `.gitignore`).

```js
window.APP_CONFIG = {
  URL_BUSQUEDA: "ENDPOINT_DEL_ENTORNO",
  URL_ENVIO: "ENDPOINT_DEL_ENTORNO"
};
```

## Flujo general

1. El usuario ingresa su número de identificación.
2. La aplicación consulta el servicio de validación.
3. Se muestran los datos del colaborador.
4. Se registran el código de activo y el serial del dispositivo.
5. El colaborador revisa el documento y firma digitalmente.
6. La información se envía al flujo automatizado correspondiente.

## Seguridad

Las URLs firmadas, tokens y credenciales de servicios externos nunca deben almacenarse directamente en un repositorio público. Este proyecto usa configuración separada del código fuente (`config.js`, ignorado por Git) para evitar ese riesgo.

## Qué demuestra este proyecto

- Automatización de un proceso empresarial.
- Integración entre frontend y servicios externos (Power Automate).
- Manejo de formularios y validaciones.
- Firma digital en navegador.
- Uso de APIs HTTP y JSON.
- Buenas prácticas de separación entre código y configuración sensible.

## Estado

Proyecto funcional y documentado para portafolio. Usa datos ficticios; no representa la configuración ni los datos de ningún cliente real.

## Autor

Jeisson Javier Silva Beltrán — [JeissonDeveloper](https://github.com/JeissonDeveloper)
