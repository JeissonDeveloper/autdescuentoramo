# Autorización Digital de Descuento

Aplicación web desarrollada para digitalizar el proceso de autorización de descuentos asociados a dispositivos corporativos.

## Objetivo

Reducir el uso de formatos manuales mediante un flujo digital que permita validar al colaborador, capturar información del equipo, registrar una firma y enviar la autorización a procesos automatizados.

## Funcionalidades

- Búsqueda de colaboradores por número de cédula.
- Autocompletado del nombre del colaborador.
- Captura de código SAP.
- Captura o recepción automática del serial del equipo mediante parámetros URL.
- Fecha automática para Colombia.
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
- `script-descuento.js`: validaciones, firma digital e integraciones.
- `logo-ramo.png`: recurso gráfico utilizado por la interfaz.

## Flujo general

1. El usuario ingresa su número de cédula.
2. La aplicación consulta el servicio de validación.
3. Se muestran los datos del colaborador.
4. Se registran SAP y serial del dispositivo.
5. El colaborador revisa el documento y firma digitalmente.
6. La información se envía al flujo automatizado correspondiente.

## Seguridad

> **Importante:** las URLs firmadas o tokens de servicios externos no deben almacenarse directamente en repositorios públicos.

Las credenciales o URLs de Power Automate utilizadas durante el desarrollo deben considerarse información sensible. Para un despliegue seguro se recomienda:

- Revocar o regenerar cualquier URL firmada que haya sido publicada.
- Evitar guardar secretos directamente en archivos JavaScript públicos.
- Utilizar una capa backend o un servicio intermediario para proteger credenciales.
- Limitar permisos y validar todas las solicitudes en el servicio receptor.

## Valor del proyecto

Este proyecto demuestra automatización de un proceso empresarial real combinando desarrollo web, validación de información, firma digital e integración con servicios de Microsoft Power Platform.

## Estado

Proyecto funcional de práctica aplicada. Antes de utilizarlo en producción se debe completar la separación segura de las credenciales de integración.

## Autor

Jeisson Javier Silva Beltrán — [JeissonDeveloper](https://github.com/JeissonDeveloper)
