# El Jardín de Ángela

Homenaje digital a **Ángela María Londoño**, hecho por su hijo.

Un sitio estático, sin dependencias, sin rastreadores y sin cookies. Se publica
con GitHub Pages desde la carpeta `docs/` de la rama `main`.

```
https://ariasalejo.github.io/Angela/
```

---

## Cómo está armado

```
docs/
├── index.html                 la página completa
├── 404.html                   página de error
├── robots.txt · sitemap.xml
├── favicon.svg
├── assets/
│   ├── css/estilos.css        todo el diseño
│   ├── js/preludio.js         marca «hay JavaScript» antes del primer pintado
│   ├── js/app.js              comportamiento (galería, visor, jardín)
│   ├── js/datos.js            recuerdos y música  ← editar acá
│   ├── js/fotos.js            manifiesto de fotos  ← generado
│   ├── fuentes/               Fraunces, Cormorant, Karla (locales)
│   └── img/                   fotos optimizadas
└── herramientas/
    └── optimizar_fotos.py     pipeline de imágenes
originales/                    fotos originales (ignorada por Git)
```

Sin frameworks. Sin CDN. Sin build obligatorio: lo que está en `docs/` es lo
que se publica.

---

## Editar los textos

Todo el texto vive en `docs/index.html`, dentro de bloques marcados con **✏️**:

- Portada
- Carta
- Gratitud
- Perdón

Los recuerdos y la música viven en `docs/assets/js/datos.js`.

**Regla de la casa:** no se inventan fechas, nombres ni recuerdos. Si un dato no
está confirmado, no se escribe.

---

## Agregar fotografías

1. Poné los originales en `originales/` (esa carpeta nunca se publica).
2. Editá `originales/album.json`:

```json
[
  {
    "archivo": "angela-1985.jpg",
    "alt": "Ángela María sonriendo en el patio de la casa.",
    "epigrafe": "El patio de la casa.",
    "fecha": "1985"
  }
]
```

3. Ejecutá:

```bash
python3 docs/herramientas/optimizar_fotos.py
```

Genera versiones de 480, 720, 960, 1280, 1600 y 2000 px en WebP y JPEG,
sin EXIF ni GPS, y reescribe `docs/assets/js/fotos.js`.

4. Revisá las imágenes y recién entonces hacé commit.

El `alt` es obligatorio: es lo que escucha una persona ciega. Describí la foto,
no la interpretes.

---

## Ver el sitio en tu computadora

```bash
cd docs
python3 -m http.server 8080
```

Abrí <http://localhost:8080>. No abras `index.html` con doble clic: la CSP y
las fuentes necesitan un servidor.

---

## Publicar

GitHub Pages ya está configurado: rama `main`, carpeta `/docs`, HTTPS forzado.
Un commit en `main` publica en un minuto. No hace falta tocar nada más.

---

## Privacidad

El repositorio y el sitio son **públicos**. GitHub Pages no tiene contraseña:
si el repositorio fuera privado, el sitio seguiría siendo público (salvo en
GitHub Enterprise Cloud con Pages privadas).

Si en algún momento querés que sólo lo vea la familia, hay que moverlo a
Cloudflare Pages + Cloudflare Access o a Netlify con protección por contraseña.
Decilo antes de subir fotos íntimas.

---

## Accesibilidad y rendimiento

- Contraste verificado AA en todos los textos (axe sin violaciones).
- Navegación completa por teclado, visor con `<dialog>` nativo y foco devuelto.
- El visor amplía la foto (botón, clic o teclas `+` / `-`) y se puede arrastrar.
- `prefers-reduced-motion`: se apagan pétalos, parallax, preludio y animaciones.
- El preludio de entrada dura menos de tres segundos, se puede saltar con
  cualquier tecla o clic, y no vuelve a aparecer durante la misma sesión
  (se recuerda con `sessionStorage`, no con cookies).
- Imágenes con `srcset`, `width`/`height` y carga diferida.
- Fuentes locales con `preload`; cero peticiones a terceros.
- CSP estricta: sólo se ejecuta lo que está en este repositorio.
- Sin JavaScript el contenido completo se lee igual; sólo se pierden la
  galería, el visor y el preludio.

---

Hecho con amor por su hijo.
