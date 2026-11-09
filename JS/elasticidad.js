(function () {
  "use strict";
 
  const CAPACIDAD = 1000;
  const MAX_SERVIDORES = 10;
  const FIJOS = 3;
 
  const rango = document.getElementById("e-users");
  if (!rango) return;
 
  const el = {
    valor: document.getElementById("e-users-v"),
    encendidos: document.getElementById("e-on"),
    capacidad: document.getElementById("e-cap"),
    uso: document.getElementById("e-use"),
    barra: document.getElementById("e-bar"),
    estado: document.getElementById("e-state"),
    mensaje: document.getElementById("e-msg"),
    slots: Array.from(document.querySelectorAll("#e-stage .server")),
    modos: Array.from(document.querySelectorAll('input[name="e-mode"]')),
    presets: Array.from(document.querySelectorAll("[data-users]")),
  };
 
  const fmt = (n) => n.toLocaleString("es");
 
  function modoActual() {
    const m = el.modos.find((r) => r.checked);
    return m ? m.value : "elastico";
  }
 
  function simular() {
    const usuarios = Number(rango.value);
    const elastico = modoActual() === "elastico";
 
    const servidores = elastico
      ? Math.min(MAX_SERVIDORES, Math.max(1, Math.ceil(usuarios / CAPACIDAD)))
      : FIJOS;
    const capacidad = servidores * CAPACIDAD;
    const atendidos = Math.min(usuarios, capacidad);
    const sinAtender = usuarios - atendidos;
    const uso = capacidad ? Math.round((usuarios / capacidad) * 100) : 0;
 
    el.valor.textContent = fmt(usuarios);
    el.encendidos.textContent = servidores + " de " + MAX_SERVIDORES;
    el.capacidad.textContent = fmt(capacidad) + " usuarios";
    el.uso.textContent = uso + " %";
    el.barra.style.width = Math.min(uso, 100) + "%";
 
    let nivel = "ok";
    if (uso > 100) nivel = "bad";
    else if (uso >= 80) nivel = "warn";
    el.barra.className = "meter__fill meter__fill--" + nivel;
    el.estado.className = "state state--" + nivel;
    el.estado.textContent = nivel === "bad" ? "Saturado" : nivel === "warn" ? "Casi lleno" : "Estable";
 
    el.slots.forEach((slot, i) => {
      const encendido = i < servidores;
      slot.classList.toggle("is-on", encendido);
      slot.classList.toggle("is-over", encendido && nivel === "bad");
    });
 
    let msg;
    if (elastico) {
      msg =
        servidores === 1 && usuarios <= CAPACIDAD
          ? "Poca demanda: la nube mantiene solo 1 servidor encendido y no pagas por los demás."
          : "La nube ajustó la capacidad a " +
            servidores +
            " servidor(es) para atender a " +
            fmt(usuarios) +
            " usuarios.";
    } else if (sinAtender > 0) {
      msg =
        "Con " +
        FIJOS +
        " servidores fijos, " +
        fmt(sinAtender) +
        " usuarios se quedan sin servicio. Cambia a «Con elasticidad» y compara.";
    } else if (usuarios < CAPACIDAD) {
      msg =
        "Con poca demanda, " +
        (FIJOS - 1) +
        " servidores están encendidos sin hacer casi nada, y los pagas igual.";
    } else {
      msg = "Con " + FIJOS + " servidores fijos la demanda actual se atiende, pero no hay margen si sube.";
    }
    el.mensaje.textContent = msg;
    rango.setAttribute("aria-valuetext", fmt(usuarios) + " usuarios");
  }
 
  rango.addEventListener("input", simular);
  el.modos.forEach((r) => r.addEventListener("change", simular));
  el.presets.forEach((b) =>
    b.addEventListener("click", () => {
      rango.value = b.dataset.users;
      simular();
    }),
  );
  simular();
})();