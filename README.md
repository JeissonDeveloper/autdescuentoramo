# Autorización Digital de Descuento

Aplicación web orientada a digitalizar el proceso de autorización de descuentos asociados a dispositivos corporativos, integrando validación de colaboradores, datos del equipo, firma digital y automatización.

## Objetivo

Reducir el uso de formatos manuales mediante un flujo digital que permita validar al colaborador, capturar información del equipo, registrar una firma y enviar la autorización a procesos automatizados.

## Funcionalidades

- Búsqueda de colaboradores por número de cédula.
- Autocompletado del nombre del colaborador.
- Captura de código SAP.
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
- `docs/capturas/`: espacio preparado para evidencias visuales.
- `logo-ramo.png`: recurso gráfico utilizado por la interfaz.

## Configuración

El repositorio no almacena endpoints firmados de Power Automate en el código público actual.

1. Copia `config.example.js` como `config.js`.
2. Define en `config.js` los endpoints correspondientes al entorno donde se ejecute la aplicación.
3. No subas `config.js` al repositorio.

Ejemplo conceptual:

```js
window.APP_CONFIG = {
  URL_BUSQUEDA: "ENDPOINT_DEL_ENTORNO",
  URL_ENVIO: "ENDPOINT_DEL_ENTORNO"
};
```

## Flujo general

1. El usuario ingresa su número de cédula.
2. La aplicación consulta el servicio de validación.
3. Se muestran los datos del colaborador.
4. Se registran SAP y serial del dispositivo.
5. El colaborador revisa el documento y firma digitalmente.
6. La información se envía al flujo automatizado correspondiente.

## Seguridad

Las URLs firmadas, tokens y credenciales de servicios externos no deben almacenarse directamente en repositorios públicos.

La versión actual utiliza configuración separada del código fuente. Si una credencial o URL firmada fue publicada anteriormente, debe considerarse comprometida y rotarse en el servicio correspondiente, incluso si ya fue retirada del código actual.

Para despliegues reales se recomienda además utilizar una capa backend o intermediaria cuando sea necesario proteger secretos que no deben llegar al navegador.

## Qué demuestra este proyecto

- Automatización de un proceso empresarial real.
- Integración entre frontend y servicios externos.
- Manejo de formularios y validaciones.
- Firma digital en navegador.
- Uso de APIs HTTP y JSON.
- Consideraciones de seguridad y separación de configuración.

## Capturas

La guía de evidencias visuales recomendadas está disponible en [`docs/capturas/`](docs/capturas/README.md). Las imágenes deben utilizar información ficticia o anonimizada.

## Estado

Proyecto funcional y documentado para portafolio. Los endpoints reales deben configurarse únicamente en el entorno autorizado y las credenciales históricamente expuestas deben rotarse.

## Autor

Jeisson Javier Silva Beltrán — [JeissonDeveloper](https://github.com/JeissonDeveloper)
