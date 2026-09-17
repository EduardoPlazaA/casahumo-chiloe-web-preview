# Casa Humo Chiloé — Sitio web

Sitio web estático, profesional y listo para subir a **Hostinger** (o cualquier
hosting estático). No requiere instalación, ni npm, ni base de datos: son
archivos que se arrastran y se suben.

---

## 1. Qué incluye

- **`index.html`** — página principal (hero, el fuego, carrusel de platos, historia, la cava, reservas, ubicación con mapa).
- **`carta.html`** — carta completa (17 cortes, entradas, guarniciones, postres, coctelería, cava y bebidas).
- **`carta-casa-humo-chiloe.pdf`** — la carta final en PDF, descargable desde la web.
- **`styles.css`, `main.js`** — diseño y comportamiento.
- **`assets/img/`** — todas las imágenes ya optimizadas a WebP.
  - Las imágenes de platos generadas con IA **fueron limpiadas de la marca de agua de Gemini**.
- Archivos de **SEO**: `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, `.htaccess`.

**Colores y tipografías** replican tu menú digital (paleta brasa/carbón/brass,
Cormorant Garamond + EB Garamond).

**Reservas:** el botón "Reservar" abre tu sistema de reservas ya creado (Google
Apps Script).

---

## 2. Cómo subirlo a Hostinger

1. Entra al **Administrador de archivos** de Hostinger (o usa FTP).
2. Abre la carpeta `public_html`.
3. **Sube todo el contenido de esta carpeta** (`CasaHumoChiloeWeb`) dentro de `public_html`.
   Importante: sube los archivos, no la carpeta contenedora. En la raíz deben quedar
   `index.html`, `carta.html`, `assets/`, etc.
4. Asegúrate de subir también el archivo **`.htaccess`** (empieza con punto; en el
   administrador de archivos activa "mostrar archivos ocultos" si no lo ves). Sin él,
   Hostinger puede servir versiones viejas en caché.
5. Listo: abre tu dominio en el navegador.

Sirve igual en **Netlify Drop** (arrastrar la carpeta a app.netlify.com/drop) si
quieres una prueba rápida sin configurar nada.

---

## 3. ⚠️ Datos por confirmar antes de publicar

Puse valores razonables, pero **revísalos** para que Google no muestre datos
equivocados. Todos se editan con un editor de texto simple.

| Dato | Valor puesto | Dónde cambiarlo |
|---|---|---|
| **Dominio** | `casahumochiloe.cl` | Busca y reemplaza `casahumochiloe.cl` en `index.html`, `carta.html`, `sitemap.xml`, `robots.txt`, `llms.txt` por tu dominio real |
| **Horario** | Jue a sáb, desde 19:00 | `index.html` (sección "Horario" y el bloque JSON-LD `openingHoursSpecification`) |
| **Teléfono** | (no incluido) | Si tienes un número público, agrégalo en el JSON-LD (`"telephone"`) y en la sección Contacto |
| **Instagram** | `@casahumochiloe` | Reemplaza si el usuario real es otro (en `index.html` y el JSON-LD `sameAs`) |
| **Coordenadas exactas** | Pastahué, Castro (aprox.) | En el JSON-LD (`geo`) y en las metaetiquetas `geo.position`. Ajusta cuando tengas el punto exacto de Google Maps |
| **Dirección exacta** | "Sector Pastahue" | Si tienes calle/número, complétalo en el JSON-LD (`streetAddress`) |

---

## 4. Para aparecer en Google, Google Maps e IA

El sitio ya trae todo lo técnico (datos estructurados Schema.org de restaurante,
sitemap, robots que permite a los buscadores e IA, Open Graph, etc.). Faltan dos
pasos que solo tú puedes hacer con tu cuenta:

1. **Google Search Console** (para búsquedas de Google):
   - Entra a search.google.com/search-console, agrega tu dominio y verifícalo.
   - En "Sitemaps", envía `https://TU-DOMINIO/sitemap.xml`.

2. **Google Business Profile / Perfil de Empresa** (para Google Maps):
   - Es lo que hace que Casa Humo aparezca en el mapa con ficha, fotos y reseñas.
   - Crea/reclama la ficha en business.google.com, marca la ubicación en Pastahue,
     y en el campo "Sitio web" pon tu dominio. Google conecta la ficha con la web.

Con eso, buscadores tradicionales y asistentes de IA (que leen el `llms.txt` y los
datos estructurados) tendrán todo lo necesario para mostrar el restaurante.

---

## 5. Actualizaciones frecuentes

- **Cambiar un precio o plato:** edita `carta.html` (y `index.html` si el plato aparece
  en la portada). Cada plato es un bloque fácil de identificar.
- **Reemplazar una foto:** deja la nueva imagen en `assets/img/` con el mismo nombre.
  Si cambias el nombre, actualiza el `src` en el HTML.
- **Después de cambiar `styles.css` o `main.js`:** sube el número de versión
  `?v=20260721` (por ejemplo a la fecha del día) en las etiquetas `<link>` y `<script>`
  de los HTML, así el navegador carga la versión nueva y no una cacheada.

---

## 6. Nota sobre las fotos de platos

Las fotos de los cortes son **maqueta generada con IA** (marca de agua de Gemini ya
eliminada). Se ven muy bien y sirven para lanzar, pero lo ideal es reemplazarlas por
**fotos reales** de tus platos cuando puedas: Google posiciona mejor las fichas cuyas
fotos coinciden con lo que se sirve. Las texturas (brasas, humo, tejuelas) y las fotos
de la casa y la familia **sí son reales** y no hace falta cambiarlas.
