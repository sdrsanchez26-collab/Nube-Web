(function () {
  "use strict";
  const root = document.getElementById("quiz");
  if (!root) return;
 
  const preguntas = [
    {
      q: "¿Cuál de estas NO es una característica esencial de la nube según el NIST?",
      o: [
        "Autoservicio bajo demanda",
        "Elasticidad rápida",
        "Hardware propio instalado en tu oficina",
        "Servicio medido",
      ],
      c: 2,
      e: "El NIST define cinco características: autoservicio bajo demanda, amplio acceso por red, agrupación de recursos, elasticidad rápida y servicio medido. El hardware es del proveedor.",
    },
    {
      q: "Quieres controlar el sistema operativo y la red, pero no comprar servidores físicos. ¿Qué modelo eliges?",
      o: ["SaaS", "PaaS", "IaaS", "On-premise"],
      c: 2,
      e: "IaaS te entrega infraestructura virtualizada (máquinas, redes, discos); tú gestionas desde el sistema operativo hacia arriba.",
    },
    {
      q: "Gmail y Microsoft 365 son ejemplos típicos de…",
      o: ["IaaS", "PaaS", "SaaS", "Nube privada"],
      c: 2,
      e: "En SaaS el proveedor gestiona todo y tú solo usas la aplicación desde el navegador o el móvil.",
    },
    {
      q: "En el modelo de responsabilidad compartida, ¿quién es siempre responsable de los datos y accesos de tu cuenta?",
      o: ["El proveedor", "El cliente", "El proveedor de internet", "Nadie"],
      c: 1,
      e: "El proveedor protege la nube en sí; el cliente protege lo que pone en la nube: datos, identidades y configuraciones.",
    },
    {
      q: "¿Qué ventaja principal ofrece la computación serverless (por ejemplo, funciones tipo Lambda)?",
      o: [
        "No existen servidores físicos",
        "Pagas por ejecución y no administras servidores",
        "Es siempre gratis",
        "No necesita código",
      ],
      c: 1,
      e: "Los servidores existen, pero los gestiona el proveedor. Se factura por uso (invocaciones y tiempo) y escala automáticamente.",
    },
    {
      q: "Una empresa combina su centro de datos con servicios de un proveedor público. Es una nube…",
      o: ["Pública", "Privada", "Híbrida", "Comunitaria"],
      c: 2,
      e: "La nube híbrida integra infraestructura propia (o privada) con nube pública, con datos y aplicaciones que pueden moverse entre ambas.",
    },
    {
      q: "¿Para qué sirven las zonas de disponibilidad (AZ)?",
      o: [
        "Para cambiar el idioma de la consola",
        "Para aislar fallos dentro de una región",
        "Para bajar la factura automáticamente",
        "Para cifrar archivos",
      ],
      c: 1,
      e: "Cada región tiene varias zonas independientes; distribuir tu aplicación entre ellas mejora la tolerancia a fallos.",
    },
    {
      q: "Una buena práctica de seguridad en IAM es…",
      o: [
        "Usar la cuenta raíz para todo",
        "Dar permisos de administrador a todos",
        "Aplicar el principio de mínimo privilegio y activar MFA",
        "Compartir contraseñas en el equipo",
      ],
      c: 2,
      e: "Da solo los permisos necesarios, activa autenticación multifactor y evita usar la cuenta raíz para el trabajo diario.",
    },
  ];
 
  let i = 0,
    aciertos = 0,
    bloqueado = false;
  const el = {
    n: root.querySelector("#q-n"),
    sc: root.querySelector("#q-sc"),
    tr: root.querySelector("#q-tr"),
    box: root.querySelector("#q-box"),
  };
 
  function pintar() {
    const p = preguntas[i];
    bloqueado = false;
    el.n.textContent = "Pregunta " + (i + 1) + " de " + preguntas.length;
    el.sc.textContent = "Aciertos: " + aciertos;
    el.tr.style.width = (i / preguntas.length) * 100 + "%";
    el.box.innerHTML = "";
 
    const h = document.createElement("h2");
    h.className = "quiz__q";
    h.tabIndex = -1;
    h.textContent = p.q;
    el.box.appendChild(h);
 
    const ul = document.createElement("ul");
    ul.className = "quiz__opts";
    p.o.forEach((txt, k) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quiz__opt";
      b.textContent = String.fromCharCode(65 + k) + ".  " + txt;
      b.addEventListener("click", () => responder(k, ul, fb));
      li.appendChild(b);
      ul.appendChild(li);
    });
    el.box.appendChild(ul);
 
    const fb = document.createElement("div");
    fb.className = "quiz__fb";
    fb.setAttribute("role", "status");
    fb.setAttribute("aria-live", "polite");
    el.box.appendChild(fb);
    h.focus();
  }
 
  function responder(k, ul, fb) {
    if (bloqueado) return;
    bloqueado = true;
    const p = preguntas[i];
    const btns = ul.querySelectorAll("button");
    btns.forEach((b, j) => {
      b.disabled = true;
      if (j === p.c) b.classList.add("is-right");
      if (j === k && k !== p.c) b.classList.add("is-wrong");
    });
    const ok = k === p.c;
    if (ok) aciertos++;
    el.sc.textContent = "Aciertos: " + aciertos;
    fb.innerHTML = "<p><strong>" + (ok ? "¡Correcto! " : "No exactamente. ") + "</strong>" + p.e + "</p>";
 
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn";
    next.textContent = i === preguntas.length - 1 ? "Ver resultado" : "Siguiente pregunta →";
    next.addEventListener("click", () => {
      i++;
      i < preguntas.length ? pintar() : fin();
    });
    fb.appendChild(next);
    next.focus();
  }
 
  function fin() {
    el.tr.style.width = "100%";
    el.n.textContent = "Quiz completado";
    const pct = Math.round((aciertos / preguntas.length) * 100);
    let msg = "Buen inicio. Repasa las secciones de fundamentos y modelos.";
    if (pct >= 60) msg = "¡Bien! Ya dominas lo esencial de la nube.";
    if (pct >= 85) msg = "¡Excelente! Estás listo para desplegar tu primer proyecto en la nube.";
    el.box.innerHTML =
      '<div class="center"><p class="quiz__score">' +
      aciertos +
      "/" +
      preguntas.length +
      "</p><p>" +
      msg +
      '</p><div class="btn-row" style="justify-content:center">' +
      '<button type="button" class="btn" id="q-again">Reintentar</button>' +
      '<a class="btn btn--ghost" href="fundamentos.html">Repasar fundamentos</a></div></div>';
    document.getElementById("q-again").addEventListener("click", () => {
      i = 0;
      aciertos = 0;
      pintar();
    });
  }
 
  pintar();
})();