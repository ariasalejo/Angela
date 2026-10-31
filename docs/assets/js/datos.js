/* =========================================================================
   EL JARDÍN DE ÁNGELA — datos editables
   -------------------------------------------------------------------------
   Acá vive lo que cambia con el tiempo: los recuerdos, la música y los
   ajustes de la galería. Los textos largos están en index.html, dentro de
   bloques marcados con  ✏️  para que los encuentres fácil.
   ========================================================================= */

window.DATOS = {
  /* ------------------------------------------------------------ RECUERDOS
     Sólo acontecimientos confirmados. Nada inventado.
     Estructura:
       { fecha: "1985", titulo: "El día de la casa nueva", texto: "…" }

     Si el array queda vacío, la sección muestra un mensaje sereno en lugar
     de relleno. */
  recuerdos: [],

  /* --------------------------------------------------------------- MÚSICA
     Opcional. Dejá src vacío y el reproductor no aparece.
     Usá sólo audio propio o con licencia. */
  musica: {
    src: "assets/audio/solo-dejenme-adorarle.mp3",
    titulo: "Solo déjenme adorarle · Grupo Peniel"
  },

  /* -------------------------------------------------------------- GALERÍA
     Ajustes de presentación. Las fotos salen de assets/js/fotos.js,
     que genera herramientas/optimizar_fotos.py */
  galeria: {
    // Cuántas columnas como máximo en pantallas grandes
    columnas: 12,
    // Mostrar la fecha bajo el epígrafe cuando exista
    mostrarFechas: true
  }
};
