/* =========================================================================
   PRELUDIO — se ejecuta antes del primer pintado.
   Marca que hay JavaScript y decide si el preludio cinematográfico aparece.
   Archivo aparte para respetar la CSP (sin scripts en línea).
   ========================================================================= */
document.documentElement.classList.add("js");

try {
  if (sessionStorage.getItem("jardin-preludio") === "1") {
    document.documentElement.classList.add("sin-preludio");
  }
} catch (e) {
  /* Navegación privada sin storage: mostramos el preludio igual. */
}
