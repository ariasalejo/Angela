/* =========================================================================
   EL JARDÍN DE ÁNGELA — comportamiento
   JavaScript nativo. Sin librerías. Si falla, el contenido sigue ahí.
   ========================================================================= */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DATOS = window.DATOS || {};
  const FOTOS = Array.isArray(window.FOTOS) ? window.FOTOS : [];

  /* ─────────────────────────────────────────────── barra y progreso ────── */
  const barra = $("#barra");
  const progreso = $("#progreso");
  let frame = 0;

  function alDesplazar() {
    frame = 0;
    const y = window.scrollY;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    if (barra) barra.classList.toggle("barra--visible", y > window.innerHeight * 0.55);
    if (progreso) progreso.style.transform = `scaleX(${alto > 0 ? Math.min(y / alto, 1) : 0})`;
  }

  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(alDesplazar);
  }, { passive: true });
  alDesplazar();

  /* ─────────────────────────────────────────────────── preludio ───────── */
  const preludio = $("#preludio");

  if (preludio && !document.documentElement.classList.contains("sin-preludio")) {
    let retirado = false;

    const retirar = () => {
      if (retirado) return;
      retirado = true;
      preludio.classList.add("preludio--fuera");
      try { sessionStorage.setItem("jardin-preludio", "1"); } catch (e) { /* sin storage */ }
      window.setTimeout(() => preludio.remove(), 800);
    };

    const temporizador = window.setTimeout(retirar, 2400);
    const saltar = () => { window.clearTimeout(temporizador); retirar(); };

    preludio.addEventListener("click", saltar);
    document.addEventListener("keydown", saltar, { once: true });

    if (reduce.matches) {
      window.clearTimeout(temporizador);
      preludio.remove();
    }
  }

  /* ──────────────────────────────────────────────── riel de secciones ─── */
  const riel = $("#riel");

  if (riel) {
    const enlacesRiel = $$("a", riel);
    const secciones = $$("main > section[id]");
    const porId = new Map(enlacesRiel.map((a) => [a.getAttribute("href").slice(1), a]));

    if ("IntersectionObserver" in window && secciones.length) {
      riel.hidden = false;
      const ioRiel = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          enlacesRiel.forEach((a) => a.removeAttribute("aria-current"));
          const enlace = porId.get(entrada.target.id);
          if (enlace) enlace.setAttribute("aria-current", "true");
        });
      }, { rootMargin: "-46% 0px -46% 0px", threshold: 0 });
      secciones.forEach((s) => ioRiel.observe(s));
    }
  }

  /* ─────────────────────────────────────────────────── menú móvil ─────── */
  const menu = $("#menu");
  const abrirMenu = $("#abrir-menu");
  const cerrarMenu = $("#cerrar-menu");

  if (menu && abrirMenu) {
    const abrir = () => {
      menu.showModal();
      abrirMenu.setAttribute("aria-expanded", "true");
    };
    const cerrar = () => {
      menu.close();
      abrirMenu.setAttribute("aria-expanded", "false");
      abrirMenu.focus();
    };

    abrirMenu.addEventListener("click", abrir);
    if (cerrarMenu) cerrarMenu.addEventListener("click", cerrar);
    menu.addEventListener("click", (e) => { if (e.target === menu) cerrar(); });
    menu.addEventListener("close", () => abrirMenu.setAttribute("aria-expanded", "false"));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => menu.close()));
  }

  /* ─────────────────────────────────────────────── revelar al scroll ──── */
  const revelables = $$("[data-revelar]");

  if ("IntersectionObserver" in window && !reduce.matches && revelables.length) {
    revelables.forEach((el) => el.classList.add("revelar"));
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("es-visible");
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    revelables.forEach((el) => observador.observe(el));
    // Red de seguridad: nunca dejamos contenido invisible.
    window.setTimeout(() => revelables.forEach((el) => el.classList.add("es-visible")), 4500);
  }

  /* ────────────────────────────────────────────── línea de recuerdos ──── */
  const recuerdos = Array.isArray(DATOS.recuerdos) ? DATOS.recuerdos : [];
  const linea = $("#linea");
  const vacio = $("#recuerdos-vacio");
  const FLOR = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="8" r="3.2"/><path d="M12 11.2V21M12 15.5c-3.2 0-5-1.8-5-4.6 2.8 0 5 1.8 5 4.6Zm0-2.6c3.2 0 5-1.8 5-4.6-2.8 0-5 1.8-5 4.6Z"/></g></svg>';

  if (linea && recuerdos.length) {
    recuerdos.forEach((r) => {
      const li = document.createElement("li");
      li.className = "recuerdo";

      const caja = document.createElement("div");
      caja.className = "recuerdo__caja";

      if (r.fecha) {
        const p = document.createElement("p");
        p.className = "recuerdo__fecha";
        p.textContent = r.fecha;
        caja.append(p);
      }
      if (r.titulo) {
        const h = document.createElement("h3");
        h.className = "recuerdo__titulo";
        h.textContent = r.titulo;
        caja.append(h);
      }
      if (r.texto) {
        const p = document.createElement("p");
        p.className = "recuerdo__texto";
        p.textContent = r.texto;
        caja.append(p);
      }

      const marca = document.createElement("span");
      marca.className = "recuerdo__marca";
      marca.setAttribute("aria-hidden", "true");
      marca.innerHTML = FLOR;

      li.append(caja, marca);
      linea.append(li);
    });
    if (vacio) vacio.hidden = true;
  }

  /* ────────────────────────────────────────────────────── galería ─────── */
  const grilla = $("#grilla");
  const esVertical = (foto) => foto.ancho / foto.alto < 1.05;

  const srcset = (foto, ext) =>
    foto.variantes.map((v) => `${foto.base}-${v.w}.${ext} ${v.w}w`).join(", ");

  const jpgBase = (foto) => {
    const elegida = foto.variantes.filter((v) => v.w <= 720).pop() || foto.variantes[0];
    return `${foto.base}-${elegida.w}.jpg`;
  };

  if (grilla && FOTOS.length) {
    FOTOS.forEach((foto, i) => {
      const fig = document.createElement("figure");
      fig.className = "foto";

      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "foto__boton";
      boton.setAttribute("aria-label", `Ampliar fotografía: ${foto.alt || "sin descripción"}`);

      const marco = document.createElement("span");
      marco.className = "foto__marco";
      marco.style.setProperty("--ratio", `${foto.ancho} / ${foto.alto}`);
      if (foto.lqip) marco.style.backgroundImage = `url("${foto.lqip}")`;

      const picture = document.createElement("picture");
      const source = document.createElement("source");
      source.type = "image/webp";
      source.srcset = srcset(foto, "webp");

      const img = document.createElement("img");
      img.src = jpgBase(foto);
      img.srcset = srcset(foto, "jpg");
      img.sizes = esVertical(foto)
        ? "(min-width: 901px) 33vw, (min-width: 721px) 46vw, 92vw"
        : "(min-width: 901px) 66vw, 92vw";
      img.width = foto.ancho;
      img.height = foto.alto;
      img.alt = foto.alt || "";
      img.loading = "lazy";
      img.decoding = "async";

      picture.append(source, img);
      marco.append(picture);
      boton.append(marco);
      boton.addEventListener("click", () => abrirVisor(i));

      const tieneEpigrafe = Boolean(foto.epigrafe && foto.epigrafe.trim());
      const tieneFecha = Boolean(
        foto.fecha && (!DATOS.galeria || DATOS.galeria.mostrarFechas !== false)
      );

      if (FOTOS.length === 1) {
        fig.classList.add("foto--unica");
      } else {
        fig.classList.add(esVertical(foto) ? "foto--vertical" : "foto--panorama");
        fig.style.setProperty("--span", esVertical(foto) ? 4 : 8);
      }

      if (tieneEpigrafe || tieneFecha) {
        const pie = document.createElement("figcaption");
        const texto = document.createElement("span");
        texto.textContent = foto.epigrafe || "";
        pie.append(texto);
        if (tieneFecha) {
          const fecha = document.createElement("span");
          fecha.className = "foto__fecha";
          fecha.textContent = foto.fecha;
          pie.append(fecha);
        }
        fig.append(boton, pie);
      } else {
        fig.append(boton);
      }
      grilla.append(fig);
    });

    if (FOTOS.length < 3) {
      const nota = document.createElement("p");
      nota.className = "galeria__nota";
      nota.textContent = "Esta galería va a crecer con las fotografías que la familia elija.";
      grilla.after(nota);
    }
  }

  /* ─────────────────────────────────────────────────────── visor ──────── */
  const visor = $("#visor");
  const visorImg = $("#visor-img");
  const visorWebp = $("#visor-webp");
  const visorPie = $("#visor-pie");
  const visorContador = $("#visor-contador");
  const visorZoom = $("#visor-zoom");
  const visorTiras = $("#visor-tiras");
  let indice = 0;
  let focoPrevio = null;
  let zoomActivo = false;
  let arrastre = null;

  function reiniciarZoom() {
    zoomActivo = false;
    if (visor) visor.classList.remove("visor--zoom");
    if (visorImg) {
      visorImg.style.setProperty("--px", "0px");
      visorImg.style.setProperty("--py", "0px");
    }
    if (visorZoom) {
      visorZoom.setAttribute("aria-pressed", "false");
      visorZoom.setAttribute("aria-label", "Ampliar fotografía");
    }
  }

  function limitarPan(px, py) {
    if (!visorImg) return;
    const maxX = (visorImg.offsetWidth * 1.2) / 2;
    const maxY = (visorImg.offsetHeight * 1.2) / 2;
    visorImg.style.setProperty("--px", `${Math.max(-maxX, Math.min(maxX, px)).toFixed(1)}px`);
    visorImg.style.setProperty("--py", `${Math.max(-maxY, Math.min(maxY, py)).toFixed(1)}px`);
  }

  function alternarZoom(evento) {
    if (!visor || !visorImg || !FOTOS.length) return;
    if (zoomActivo) { reiniciarZoom(); return; }

    zoomActivo = true;
    visor.classList.add("visor--zoom");
    if (visorZoom) {
      visorZoom.setAttribute("aria-pressed", "true");
      visorZoom.setAttribute("aria-label", "Reducir fotografía");
    }

    // Si se amplía desde un punto, ese punto queda cerca del centro.
    if (evento && typeof evento.clientX === "number") {
      const caja = visorImg.getBoundingClientRect();
      const px = (caja.left + caja.width / 2 - evento.clientX) * 1.2;
      const py = (caja.top + caja.height / 2 - evento.clientY) * 1.2;
      limitarPan(px, py);
    }
  }

  function marcarTira() {
    if (!visorTiras) return;
    Array.from(visorTiras.children).forEach((tira, i) => {
      if (i === indice) tira.setAttribute("aria-current", "true");
      else tira.removeAttribute("aria-current");
    });
  }

  function pintarTiras() {
    if (!visorTiras) return;
    if (FOTOS.length < 2) { visorTiras.replaceChildren(); return; }
    if (visorTiras.childElementCount === FOTOS.length) { marcarTira(); return; }

    const fragmento = document.createDocumentFragment();
    FOTOS.forEach((foto, i) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "visor__tira";
      boton.setAttribute("aria-label", `Ver fotografía ${i + 1}: ${foto.alt || "sin descripción"}`);
      boton.addEventListener("click", () => pintarVisor(i));

      const img = document.createElement("img");
      const variante = foto.variantes[0];
      img.src = `${foto.base}-${variante.w}.jpg`;
      img.alt = "";
      img.width = 52;
      img.height = 52;
      img.loading = "lazy";
      img.decoding = "async";
      boton.append(img);
      fragmento.append(boton);
    });
    visorTiras.replaceChildren(fragmento);
    marcarTira();
  }

  function pintarVisor(i) {
    if (!FOTOS.length) return;
    indice = (i + FOTOS.length) % FOTOS.length;
    const foto = FOTOS[indice];
    const grande = foto.variantes[foto.variantes.length - 1];

    if (visorWebp) visorWebp.srcset = srcset(foto, "webp");
    visorImg.src = `${foto.base}-${grande.w}.jpg`;
    visorImg.srcset = srcset(foto, "jpg");
    visorImg.sizes = "min(94vw, 1500px)";
    visorImg.width = foto.ancho;
    visorImg.height = foto.alto;
    visorImg.alt = foto.alt || "";

    visorPie.textContent = [foto.epigrafe, foto.fecha].filter(Boolean).join(" · ");
    visorContador.textContent = `${indice + 1} / ${FOTOS.length}`;
    visor.classList.toggle("visor--unica", FOTOS.length < 2);

    reiniciarZoom();
    pintarTiras();

    const siguiente = FOTOS[(indice + 1) % FOTOS.length];
    const anterior = FOTOS[(indice - 1 + FOTOS.length) % FOTOS.length];
    [siguiente, anterior].forEach((f) => {
      if (!f) return;
      const v = f.variantes[f.variantes.length - 1];
      const im = new Image();
      im.src = `${f.base}-${v.w}.jpg`;
    });
  }

  function abrirVisor(i) {
    if (!visor) return;
    focoPrevio = document.activeElement;
    pintarVisor(i);
    visor.showModal();
    document.body.classList.add("sin-scroll");
    const cerrarBtn = $("#visor-cerrar");
    if (cerrarBtn) cerrarBtn.focus();
  }

  function moverVisor(paso) {
    pintarVisor(indice + paso);
  }

  if (visor) {
    visor.addEventListener("close", () => {
      document.body.classList.remove("sin-scroll");
      reiniciarZoom();
      if (focoPrevio && typeof focoPrevio.focus === "function") focoPrevio.focus();
    });

    visor.addEventListener("click", (e) => {
      if (e.target === visor) visor.close();
    });

    $("#visor-cerrar")?.addEventListener("click", () => visor.close());
    $("#visor-prev")?.addEventListener("click", () => moverVisor(-1));
    $("#visor-next")?.addEventListener("click", () => moverVisor(1));
    visorZoom?.addEventListener("click", () => alternarZoom());

    visor.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); moverVisor(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); moverVisor(-1); }
      if (e.key === "Home") { e.preventDefault(); pintarVisor(0); }
      if (e.key === "End") { e.preventDefault(); pintarVisor(FOTOS.length - 1); }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        if (!zoomActivo) alternarZoom();
      }
      if (e.key === "-" || e.key === "0") {
        if (zoomActivo) reiniciarZoom();
      }
    });

    // Ampliar desde un punto y arrastrar cuando está ampliada.
    if (visorImg) {
      visorImg.addEventListener("click", (e) => {
        if (arrastre && arrastre.movido) return;
        alternarZoom(e);
      });

      visorImg.addEventListener("pointerdown", (e) => {
        if (!zoomActivo) return;
        arrastre = {
          x: e.clientX,
          y: e.clientY,
          px: parseFloat(visorImg.style.getPropertyValue("--px")) || 0,
          py: parseFloat(visorImg.style.getPropertyValue("--py")) || 0,
          movido: false
        };
        if (visorImg.setPointerCapture) visorImg.setPointerCapture(e.pointerId);
      });

      visorImg.addEventListener("pointermove", (e) => {
        if (!arrastre) return;
        const dx = e.clientX - arrastre.x;
        const dy = e.clientY - arrastre.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) arrastre.movido = true;
        limitarPan(arrastre.px + dx, arrastre.py + dy);
      });

      const soltar = () => {
        if (!arrastre) return;
        window.setTimeout(() => { arrastre = null; }, 0);
      };
      visorImg.addEventListener("pointerup", soltar);
      visorImg.addEventListener("pointercancel", soltar);
    }

    // Deslizar con el dedo (solo cuando no está ampliada)
    let inicioX = null;
    let inicioY = null;
    visor.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || zoomActivo) return;
      inicioX = e.clientX;
      inicioY = e.clientY;
    });
    visor.addEventListener("pointerup", (e) => {
      if (inicioX === null || zoomActivo) return;
      const dx = e.clientX - inicioX;
      const dy = e.clientY - inicioY;
      inicioX = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) moverVisor(dx < 0 ? 1 : -1);
    });
    visor.addEventListener("pointercancel", () => { inicioX = null; });
  }

  /* ─────────────────────────────────────────────────────── jardín ─────── */
  const escena = $("[data-jardin]");
  const seccionJardin = $(".jardin");

  if (escena && seccionJardin) {
    const hojas = $$(".hoja", escena);
    const flores = $$(".flor", escena);
    const luciernagas = $$(".jardin__luciernagas circle", escena);

    hojas.forEach((el, i) => { el.style.transitionDelay = `${0.2 + (i % 14) * 0.05}s`; });
    flores.forEach((el, i) => { el.style.transitionDelay = `${0.7 + i * 0.16}s`; });
    luciernagas.forEach((el, i) => { el.style.animationDelay = `${(i % 9) * -1.1}s`; });

    if (reduce.matches) {
      seccionJardin.classList.add("jardin--activo");
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          seccionJardin.classList.add("jardin--activo");
          io.disconnect();
        });
      }, { threshold: 0.25 });
      io.observe(escena);
    } else {
      seccionJardin.classList.add("jardin--activo");
    }
  }

  /* ─────────────────────────────────────────────────────── cierre ─────── */
  const cierre = $(".cierre");
  if (cierre) {
    if (reduce.matches) {
      cierre.classList.add("cierre--activo");
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          cierre.classList.add("cierre--activo");
          io.disconnect();
        });
      }, { threshold: 0.3 });
      io.observe(cierre);
    } else {
      cierre.classList.add("cierre--activo");
    }
  }

  /* ──────────────────────────────────────── parallax y luz de portada ─── */
  const portada = $(".portada");
  const brillo = $("#brillo");
  const marcoRetrato = $(".portada__retrato .marco");
  const punteroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (marcoRetrato && !reduce.matches) {
    let pendiente = 0;
    const actualizar = () => {
      pendiente = 0;
      if (window.innerWidth < 900) return;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.15) return;
      marcoRetrato.style.setProperty("--par", `${Math.min(y * 0.05, 34).toFixed(1)}px`);
    };
    window.addEventListener("scroll", () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(actualizar);
    }, { passive: true });
  }

  if (portada && brillo && punteroFino && !reduce.matches) {
    let raf = 0;
    let x = portada.clientWidth * 0.68;
    let y = portada.clientHeight * 0.3;

    const pintar = () => {
      raf = 0;
      brillo.style.transform = `translate3d(${x.toFixed(0)}px, ${y.toFixed(0)}px, 0)`;
    };
    pintar();

    portada.addEventListener("pointermove", (e) => {
      const caja = portada.getBoundingClientRect();
      x = e.clientX - caja.left;
      y = e.clientY - caja.top;

      const retrato = marcoRetrato && marcoRetrato.parentElement;
      if (retrato) {
        const r = retrato.getBoundingClientRect();
        const tx = ((e.clientY - (r.top + r.height / 2)) / r.height) * -2.6;
        const ty = ((e.clientX - (r.left + r.width / 2)) / r.width) * 2.6;
        marcoRetrato.style.setProperty("--tx", `${tx.toFixed(2)}deg`);
        marcoRetrato.style.setProperty("--ty", `${ty.toFixed(2)}deg`);
      }
      if (!raf) raf = requestAnimationFrame(pintar);
    }, { passive: true });

    portada.addEventListener("pointerleave", () => {
      if (!marcoRetrato) return;
      marcoRetrato.style.setProperty("--tx", "0deg");
      marcoRetrato.style.setProperty("--ty", "0deg");
    });
  }

  /* ───────────────────────────────────────── profundidad del jardín ───── */
  const jardinSvg = $(".jardin__svg");

  if (escena && jardinSvg && !reduce.matches) {
    let pendiente = 0;
    const actualizar = () => {
      pendiente = 0;
      const caja = escena.getBoundingClientRect();
      const vh = window.innerHeight;
      if (caja.bottom < -140 || caja.top > vh + 140) return;
      const progreso = (caja.top + caja.height / 2 - vh / 2) / vh;
      jardinSvg.style.setProperty("--py", `${(-progreso * 30).toFixed(1)}px`);
    };
    window.addEventListener("scroll", () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(actualizar);
    }, { passive: true });
    actualizar();
  }

  /* ──────────────────────────────────────────────────────── pétalos ───── */
  function iniciarPetalos() {
    const lienzo = $("#petalos");
    if (!lienzo || reduce.matches) return;

    const ctx = lienzo.getContext("2d");
    if (!ctx) return;

    let ancho = 0;
    let alto = 0;
    let dpr = 1;
    let pausado = false;
    const cantidad = window.innerWidth < 720 ? 8 : 14;
    const petalos = [];

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      lienzo.width = Math.round(ancho * dpr);
      lienzo.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function crear(desdeArriba) {
      return {
        x: Math.random() * ancho,
        y: desdeArriba ? -20 : Math.random() * alto,
        r: 2 + Math.random() * 4.5,
        vx: 0.08 + Math.random() * 0.22,
        vy: 0.12 + Math.random() * 0.3,
        ang: Math.random() * Math.PI * 2,
        giro: (Math.random() - 0.5) * 0.012,
        alfa: 0.1 + Math.random() * 0.28
      };
    }

    function dibujar() {
      if (pausado) return;
      ctx.clearRect(0, 0, ancho, alto);
      petalos.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.ang += p.giro;
        if (p.y > alto + 20) Object.assign(p, crear(true));
        if (p.x > ancho + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.ang);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 217, 190, ${p.alfa})`;
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(dibujar);
    }

    medir();
    for (let i = 0; i < cantidad; i += 1) petalos.push(crear(false));
    requestAnimationFrame(dibujar);

    let temporizador = 0;
    window.addEventListener("resize", () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(medir, 200);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      pausado = document.hidden;
      if (!pausado) requestAnimationFrame(dibujar);
    });
  }

  iniciarPetalos();

  /* ───────────────────────────────────────────── música ambiental ────── */
  const audio = $("#audio");
  const musica = DATOS.musica || {};
  const selectorVideos = 'iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]';

  if (audio && musica.src) {
    audio.src = musica.src;
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;

    let iniciada = false;
    let intentando = false;
    let fundido = 0;

    const hayVideoActivo = () => Boolean(document.querySelector(selectorVideos));

    function fundir(destino) {
      window.clearInterval(fundido);
      const origen = audio.volume;
      const pasos = 14;
      let paso = 0;
      fundido = window.setInterval(() => {
        paso += 1;
        audio.volume = Math.max(0, Math.min(1, origen + (destino - origen) * (paso / pasos)));
        if (paso >= pasos) {
          window.clearInterval(fundido);
          audio.volume = destino;
        }
      }, 45);
    }

    function reanudarMusica() {
      if (!iniciada || audio.paused === false || document.hidden || hayVideoActivo()) return;
      audio.volume = 0;
      audio.play()
        .then(() => fundir(0.14))
        .catch(() => { /* El navegador puede bloquear la reproducción por sus políticas. */ });
    }

    function iniciarMusica(evento) {
      if (iniciada || intentando || hayVideoActivo()) return;
      if (evento?.target?.closest?.("#abrir-video, #abrir-testimonio")) return;

      intentando = true;
      audio.volume = 0;
      audio.play()
        .then(() => {
          iniciada = true;
          intentando = false;
          fundir(0.14);
          document.removeEventListener("click", iniciarMusica);
          document.removeEventListener("keydown", iniciarMusica);
        })
        .catch(() => {
          intentando = false;
        });
    }

    document.addEventListener("click", iniciarMusica);
    document.addEventListener("keydown", iniciarMusica);

    // YouTube se inserta sólo cuando la persona abre un vídeo.
    // Al retirarse el iframe, la música vuelve suavemente desde donde quedó.
    const observadorVideos = new MutationObserver(() => {
      if (hayVideoActivo()) {
        if (!audio.paused) {
          window.clearInterval(fundido);
          audio.pause();
          audio.volume = 0;
        }
      } else {
        reanudarMusica();
      }
    });
    observadorVideos.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!audio.paused) {
          window.clearInterval(fundido);
          audio.pause();
          audio.volume = 0;
        }
      } else {
        reanudarMusica();
      }
    });
  }

  /* ────────────────────────────────────────────────────── compartir ──── */
  const compartir = $("#compartir");

  if (compartir && navigator.share) {
    compartir.hidden = false;
    compartir.addEventListener("click", () => {
      navigator.share({
        title: document.title,
        text: "Un jardín para Ángela María Londoño.",
        url: window.location.href
      }).catch(() => { /* la persona canceló: no hacemos nada */ });
    });
  }

  /* ────────────────────────────────────────────────────── imprimir ────── */
  const imprimir = $("#imprimir");
  if (imprimir) {
    imprimir.hidden = false;
    imprimir.addEventListener("click", () => window.print());
  }
})();
