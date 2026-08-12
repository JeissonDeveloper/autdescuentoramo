// URLS DE TUS FLUJOS DE POWER AUTOMATE
const URL_BUSQUEDA = "https://defaultaf5eb6a454944a9ea659b79c92301b.8e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/aed1a8e6527c409fa89020e534c2b5c5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=eO1cDqSsJme9vmuEXbqUEC0sZqHjRmJHA_a0_nqgH1U";

const URL_ENVIO = "https://defaultaf5eb6a454944a9ea659b79c92301b.8e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/83f64e1aa4d1493784bcf3cdfda6ebfd/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8eILHCINj0kUPRFCyeU5giWFrLJ2KTqKL6ndpF3AiUo"; 

let sigColab;
let enviandoFormulario = false;

document.addEventListener("DOMContentLoaded", () => {
    sigColab = setupCanvas("canvas_colaborador");
    ponerFechaActualColombia();
    
    // Captura del serial inyectado por la macro de SOTI MobiControl
    const params = new URLSearchParams(window.location.search);
    if(params.get("serial")) {
        document.getElementById("serial_equipo").value = sanitizeInput(params.get("serial"));
    }
});

// Función de seguridad (Prevención XSS básica)
const sanitizeInput = (str) => {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
};

function ponerFechaActualColombia() {
    const ahora = new Date();
    const fechaColombia = new Date(ahora.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    document.getElementById("txt_dia").innerText = String(fechaColombia.getDate()).padStart(2, '0');
    document.getElementById("txt_mes").innerText = meses[fechaColombia.getMonth()];
    document.getElementById("txt_anio").innerText = fechaColombia.getFullYear();
}

window.buscarColaborador = async () => {
    const cedula = document.getElementById("cedula").value.trim();
    if(!cedula) return;
    
    const msg = document.getElementById("msg-colaborador");
    msg.innerText = "Consultando base de datos..."; 
    msg.style.color = "var(--text-color)";

    const urlSinCache = URL_BUSQUEDA + "&t=" + new Date().getTime();

    try {
        const resp = await fetch(urlSinCache, {
            method: "POST", 
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ cedula: sanitizeInput(cedula) }),
            signal: AbortSignal.timeout(8000) // ES2026: Corte automático por timeout
        });
        
        if (!resp.ok) throw new Error();
        const data = await resp.json();

        if (data && data.nombre_colaborador) {
            msg.innerText = "✅ Colaborador encontrado"; 
            msg.style.color = "green";
            document.getElementById("txt_nombre").innerText = sanitizeInput(data.nombre_colaborador);
            document.getElementById("nombre_colaborador").value = sanitizeInput(data.nombre_colaborador);
            document.getElementById("txt_cedula").innerText = sanitizeInput(cedula);
        } else {
            msg.innerText = "❌ Cédula no registrada"; 
            msg.style.color = "red";
            document.getElementById("txt_nombre").innerText = ""; 
            document.getElementById("nombre_colaborador").value = "";
            document.getElementById("txt_cedula").innerText = ""; 
        }
    } catch (err) {
        msg.innerText = err.name === 'TimeoutError' ? "❌ Tiempo de espera agotado" : "❌ Error de conexión"; 
        msg.style.color = "red";
    }
};

document.getElementById('cedula').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, "");
});

function setupCanvas(id) {
    const c = document.getElementById(id);
    const ctx = c.getContext("2d", { willReadFrequently: true });
    let drawing = false, wasUsed = false;
    
    const resize = () => { c.width = c.offsetWidth; c.height = 160; };
    window.addEventListener("resize", resize); 
    resize();

    const getPos = (e) => {
        const r = c.getBoundingClientRect();
        const ev = e.touches ? e.touches[0] : e;
        return { x: ev.clientX - r.left, y: ev.clientY - r.top, pressure: 0.6 };
    };

    const draw = (p1, p2) => {
        ctx.beginPath(); 
        ctx.moveTo(p1.x, p1.y); 
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(10,10,10,0.95)"; 
        ctx.lineWidth = 2.5; 
        ctx.lineCap = "round"; 
        ctx.stroke();
    };

    let last = null;
    const start = (e) => { e.preventDefault(); drawing = true; wasUsed = true; last = getPos(e); c.style.borderColor = "var(--ramo-blue-brand)"; };
    const move = (e) => { if(!drawing) return; e.preventDefault(); const cur = getPos(e); draw(last, cur); last = cur; };
    const end = (e) => { if(!drawing) return; e.preventDefault(); drawing = false; };

    c.addEventListener("pointerdown", start); 
    c.addEventListener("pointermove", move); 
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
    c.addEventListener("pointerout", end);
    
    return { c, isSigned: () => wasUsed, reset: () => { wasUsed = false; ctx.clearRect(0,0,c.width,c.height); c.style.borderColor = "#b5d5e5"; }};
}

window.limpiarFirma = () => sigColab.reset();

document.getElementById("formulario-descuento").addEventListener("submit", async e => {
    e.preventDefault();
    if(enviandoFormulario) return;
    if(!sigColab.isSigned()) {
        alert("⚠️ La firma digital es obligatoria.");
        return;
    }
    
    const btn = document.querySelector(".btn-principal");
    const estadoDiv = document.getElementById("estado-envio");
    
    btn.disabled = true;
    enviandoFormulario = true;
    estadoDiv.innerText = "Enviando autorización...";
    estadoDiv.style.color = "var(--text-color)";

    // Generación del payload con sanitización de datos
    const payload = {
        cedula: sanitizeInput(document.getElementById("cedula").value),
        nombre: sanitizeInput(document.getElementById("nombre_colaborador").value),
        sap: sanitizeInput(document.getElementById("codigo_sap").value),
        serial: sanitizeInput(document.getElementById("serial_equipo").value),
        dia: document.getElementById("txt_dia").innerText,
        mes: document.getElementById("txt_mes").innerText,
        anio: document.getElementById("txt_anio").innerText,
        firma: sigColab.c.toDataURL().split(",")[1]
    };

    try {
        const r = await fetch(URL_ENVIO, { 
            method: "POST", 
            headers: {"Content-Type":"application/json"}, 
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(12000)
        });
        
        if(r.ok) {
            estadoDiv.innerText = "✅ ¡Autorización guardada exitosamente!";
            estadoDiv.style.color = "green";
            setTimeout(() => location.reload(), 3000);
        } else {
            throw new Error();
        }
    } catch (err) { 
        estadoDiv.innerText = err.name === 'TimeoutError' ? "❌ La red está inestable. Intenta de nuevo." : "❌ Error de conexión al enviar.";
        estadoDiv.style.color = "red";
        btn.disabled = false;
        enviandoFormulario = false;
    }
});
