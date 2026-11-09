(function () {
  "use strict";
 
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
 
  const toggle = $(".nav-toggle");
  const list = $(".nav-list");
  if (toggle && list) {
    toggle.addEventListener("click", () => {
      const open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕ Cerrar menú" : "☰ Menú";
    });
  }
 
  const topBtn = $(".to-top");
  function onScroll() {
    const h = document.documentElement;
    if (topBtn) topBtn.classList.toggle("is-on", h.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0 }));
 
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }
 
  $$(".tabs").forEach((tabs) => {
    const btns = $$('[role="tab"]', tabs);
    const panels = $$('[role="tabpanel"]', tabs);
    function select(i) {
      btns.forEach((b, j) => {
        b.setAttribute("aria-selected", String(i === j));
        b.tabIndex = i === j ? 0 : -1;
        panels[j].hidden = i !== j;
      });
    }
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(i));
      b.addEventListener("keydown", (e) => {
        let n = null;
        if (e.key === "ArrowRight") n = (i + 1) % btns.length;
        if (e.key === "ArrowLeft") n = (i - 1 + btns.length) % btns.length;
        if (n !== null) {
          select(n);
          btns[n].focus();
          e.preventDefault();
        }
      });
    });
    select(0);
  });
 
  const q = $("#glosario-q");
  if (q) {
    const items = $$("#glosario > div");
    const status = $("#glosario-estado");
    q.addEventListener("input", () => {
      const t = q.value.trim().toLowerCase();
      let n = 0;
      items.forEach((it) => {
        const ok = it.textContent.toLowerCase().includes(t);
        it.hidden = !ok;
        if (ok) n++;
      });
      status.textContent = t
        ? n
          ? n + " término(s) encontrado(s)."
          : "Sin resultados para «" + q.value + "». Prueba con otra palabra."
        : "";
    });
  }
 
  $$(".code").forEach((box) => {
    const btn = $(".code__copy", box);
    const pre = $("pre", box);
    if (!btn || !pre) return;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = "¡Copiado!";
      } catch (e) {
        btn.textContent = "Selecciona y copia";
      }
      setTimeout(() => (btn.textContent = "Copiar"), 1800);
    });
  });
})();