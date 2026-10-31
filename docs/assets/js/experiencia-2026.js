/* EL JARDÍN DE ÁNGELA — interacciones de la experiencia 2026 */
(() => {
  "use strict";
  const $ = (selector, context = document) => context.querySelector(selector);

  const plantar = $("#plantar-flor");
  const flores = $("#flores-usuario");
  const respuestaFlor = $("#respuesta-flor");
  let totalFlores = 0;
  if (plantar && flores && respuestaFlor) {
    plantar.addEventListener("click", () => {
      totalFlores += 1;
      const flor = document.createElement("span");
      flor.className = "flor-plantada";
      flor.textContent = "✿";
      flor.setAttribute("aria-hidden", "true");
      flores.append(flor);
      respuestaFlor.textContent = totalFlores === 1
        ? "Tu primera flor ya forma parte de este pequeño jardín."
        : "Has dejado " + totalFlores + " flores en este jardín.";
    });
  }

  const encender = $("#encender-vela");
  const vela = $(".perdon__vela");
  const estadoVela = $("#estado-vela");
  if (encender && vela && estadoVela) {
    encender.addEventListener("click", () => {
      const encendida = encender.getAttribute("aria-pressed") !== "true";
      encender.setAttribute("aria-pressed", String(encendida));
      vela.classList.toggle("perdon__vela--encendida", encendida);
      encender.textContent = encendida ? "Apagar la luz" : "Encender una luz";
      estadoVela.textContent = encendida
        ? "Que esta luz recuerde la intención de estar más cerca."
        : "La intención permanece; puedes volver a encenderla cuando quieras.";
    });
  }

  const abrirVideo = $("#abrir-video");
  const dialogoVideo = $("#video");
  const cerrarVideo = $("#cerrar-video");
  const cajaVideo = $("#video-caja");
  const videoUrl = "https://www.youtube-nocookie.com/embed/Lp59AJkjSzI?autoplay=1&rel=0";

  function restaurarAviso() {
    if (!cajaVideo) return;
    cajaVideo.replaceChildren();
    const aviso = document.createElement("p");
    aviso.textContent = "El video se conectará únicamente cuando pulses reproducir.";
    cajaVideo.append(aviso);
  }
  function cerrar() {
    if (dialogoVideo && dialogoVideo.open) dialogoVideo.close();
    restaurarAviso();
  }

  if (abrirVideo && dialogoVideo && cajaVideo && typeof dialogoVideo.showModal === "function") {
    abrirVideo.addEventListener("click", () => {
      if (!cajaVideo.querySelector("iframe")) {
        const iframe = document.createElement("iframe");
        iframe.src = videoUrl;
        iframe.title = "Video musical: Aunque no sea mes de mayo, de Felix Mora";
        iframe.loading = "eager";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        cajaVideo.replaceChildren(iframe);
      }
      dialogoVideo.showModal();
    });
    if (cerrarVideo) cerrarVideo.addEventListener("click", cerrar);
    dialogoVideo.addEventListener("click", event => {
      if (event.target === dialogoVideo) cerrar();
    });
    dialogoVideo.addEventListener("close", restaurarAviso);
  } else if (abrirVideo) {
    abrirVideo.addEventListener("click", () => {
      window.open("https://www.youtube.com/watch?v=Lp59AJkjSzI", "_blank", "noopener,noreferrer");
    });
  }
})();
