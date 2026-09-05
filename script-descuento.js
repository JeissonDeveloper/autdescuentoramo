// Autorización Digital de Descuento
// Lógica de validación, búsqueda de colaborador, firma digital e integración con Power Automate.
// Usa datos ficticios: no representa la configuración ni los datos de ningún cliente real.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAutorizacion");
  const inputIdentificacion = document.getElementById("identificacion");
  const inputNombre = document.getElementById("nombre");
  const inputCodigoActivo = document.getElementById("codigoActivo");
  const inputSerial = document.getElementById("serial");
  const inputFecha = document.getElementById("fecha");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiarFirma = document.getElementById("btnLimpiarFirma");
  const btnEnviar = document.getElementById("btnEnviar");
  const canvas = document.getElementById("firmaCanvas");
  const ctx = canvas.getContext("2d");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  let dibujando = false;
  let firmaVacia = true;

  // ---------- Fecha automática (zona horaria Colombia) ----------
  function establecerFechaActual() {
    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    });
    inputFecha.value = fecha;
  }
  establecerFechaActual();

  // ---------- Serial por parámetro de URL (opcional) ----------
  const params = new URLSearchParams(window.location.search);
  if (params.has("serial")) {
    inputSerial.value = params.get("serial");
  }

  // ---------- Firma digital (Canvas API) ----------
  function obtenerPosicion(evento) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evento.touches ? evento.touches[0].clientX : evento.clientX;
    const clientY = evento.touches ? evento.touches[0].clientY : evento.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function iniciarTrazo(evento) {
    dibujando = true;
    firmaVacia = false;
    const { x, y } = obtenerPosicion(evento);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function dibujarTrazo(evento) {
    if (!dibujando) return;
    const { x, y } = obtenerPosicion(evento);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1c1c1c";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    evento.preventDefault();
  }

  function finalizarTrazo() {
    dibujando = false;
  }

  canvas.addEventListener("mousedown", iniciarTrazo);
  canvas.addEventListener("mousemove", dibujarTrazo);
  canvas.addEventListener("mouseup", finalizarTrazo);
  canvas.addEventListener("mouseleave", finalizarTrazo);
  canvas.addEventListener("touchstart", iniciarTrazo, { passive: false });
  canvas.addEventListener("touchmove", dibujarTrazo, { passive: false });
  canvas.addEventListener("touchend", finalizarTrazo);

  btnLimpiarFirma.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    firmaVacia = true;
  });

  // ---------- Búsqueda de colaborador (servicio externo) ----------
  btnBuscar.addEventListener("click", async () => {
    ocultarMensajes();
    const identificacion = inputIdentificacion.value.trim();

    if (!/^\d{6,12}$/.test(identificacion)) {
      mostrarError("Ingresa un número de identificación válido.");
      return;
    }

    try {
      btnBuscar.disabled = true;
      btnBuscar.textContent = "Buscando...";

      const respuesta = await fetchConTimeout(
        `${window.APP_CONFIG.URL_BUSQUEDA}?identificacion=${encodeURIComponent(identificacion)}`,
        { method: "GET" },
        8000
      );

      if (!respuesta.ok) {
        throw new Error("No se encontró el colaborador.");
      }

      const datos = await respuesta.json();
      inputNombre.value = sanitizarTexto(datos.nombre || "");
    } catch (error) {
      mostrarError(error.message || "No fue posible completar la búsqueda.");
    } finally {
      btnBuscar.disabled = false;
      btnBuscar.textContent = "Buscar colaborador";
    }
  });

  // ---------- Envío del formulario ----------
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    ocultarMensajes();

    if (!validarFormulario()) return;

    const payload = {
      identificacion: sanitizarTexto(inputIdentificacion.value),
      nombre: sanitizarTexto(inputNombre.value),
      codigoActivo: sanitizarTexto(inputCodigoActivo.value),
      serial: sanitizarTexto(inputSerial.value),
      fecha: inputFecha.value,
      firma: canvas.toDataURL("image/png"),
    };

    try {
      btnEnviar.disabled = true;
      btnEnviar.textContent = "Enviando...";

      const respuesta = await fetchConTimeout(
        window.APP_CONFIG.URL_ENVIO,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        10000
      );

      if (!respuesta.ok) {
        throw new Error("El servicio de autorización no respondió correctamente.");
      }

      mostrarExito("Autorización enviada correctamente.");
      form.reset();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      firmaVacia = true;
      establecerFechaActual();
    } catch (error) {
      mostrarError(error.message || "No fue posible enviar la autorización.");
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar autorización";
    }
  });

  // ---------- Utilidades ----------
  function validarFormulario() {
    if (!inputIdentificacion.value.trim()) {
      mostrarError("Ingresa el número de identificación.");
      return false;
    }
    if (!inputNombre.value.trim()) {
      mostrarError("Busca y confirma el colaborador antes de continuar.");
      return false;
    }
    if (!inputCodigoActivo.value.trim()) {
      mostrarError("Ingresa el código de activo.");
      return false;
    }
    if (!inputSerial.value.trim()) {
      mostrarError("Ingresa el serial del equipo.");
      return false;
    }
    if (firmaVacia) {
      mostrarError("La firma digital es obligatoria.");
      return false;
    }
    return true;
  }

  function sanitizarTexto(texto) {
    return String(texto)
      .replace(/[<>]/g, "")
      .trim();
  }

  async function fetchConTimeout(url, opciones, ms) {
    const controlador = new AbortController();
    const timeout = setTimeout(() => controlador.abort(), ms);
    try {
      return await fetch(url, { ...opciones, signal: controlador.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.hidden = false;
  }

  function mostrarExito(texto) {
    mensajeExito.textContent = texto;
    mensajeExito.hidden = false;
  }

  function ocultarMensajes() {
    mensajeError.hidden = true;
    mensajeExito.hidden = true;
  }
});
