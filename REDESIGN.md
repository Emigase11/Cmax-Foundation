# Rediseño visual — septiembre de 2026

## Implementado

- Home de once secciones: fotografía a sangre, ONU, escala del desplazamiento, tres necesidades, soluciones, comparador y video, mapa, campañas, recaudación, prensa y cierre.
- `/approach` recibe la secuencia antes/durante/después y sus fotografías; `/about/press` reúne las notas verificadas. Ambas están enlazadas y en el sitemap.
- Cabecera sin barra institucional. Mención completa de ECOSOC debajo del hero y mención breve en el pie.
- Paleta con lino, arena, verde cálido y carbón; curvas de nivel SVG locales.
- Comparador operable con puntero, tacto y flechas; mapa con botones de países; galerías con diálogo modal, Escape, flechas y devolución del foco.
- Contadores con cifra final en HTML y animación al entrar en pantalla. El movimiento reducido desactiva contadores y transiciones; también se atienden cambios de preferencia durante la sesión.
- Calidad fotográfica 90, tamaños responsive limitados al contenedor real, imágenes de detalle sin recortes forzados y variantes hasta 2800 px configuradas en Next.

## Edición

En `/keystatic`, **Visual home: media and figures** controla fotografías, videos ONU, videos de despliegue, comparador, imágenes de etapas/necesidades, datos de respaldo y recaudación.

Las rutas de imágenes se normalizaron al prefijo `/images/content/` que espera Keystatic. Se verificó que el editor vuelve a reconocer los archivos existentes; antes, las rutas relativas podían perderse al guardar una ficha.

**Press coverage** contiene siete borradores con logos. Completar titular real, fecha y URL directa, y marcar como verificado/publicado. Solo entonces aparecen en la franja y el archivo público. No se enlaza a la portada del medio como sustituto de la nota.

**Countries explicitly confirmed for the map** se guarda en cada acción. Se migraron las ubicaciones nacionales ya explícitas en las fichas de Argentina, Haití, México y Ucrania; los estados pendientes siguen visibles como tales. El registro regional de COVID-19 no se asignó a ningún país; Venezuela permanece como campaña. Para ampliar el catálogo geográfico, agregar el código ISO y su posición a `components/field-map.tsx` y a la selección del gestor.

La recaudación exige publicación, monto, moneda, fecha de corte, finalidad y enlace al informe. Sin esos datos no muestra un cero ni un monto de ejemplo. `lib/fundraising.ts` es el punto de integración futura con Stripe.

## ACNUR: precisión del dato

La serie histórica se consulta en una sola petición de servidor a `population/`, desde 2015 hasta el último año completo, con revalidación de 24 horas. Se suman `refugees + asylum_seekers + idps + oip`; se aceptan números, strings numéricos y el marcador `-` como categoría sin población reportada. Campos vacíos, años duplicados o faltantes, respuestas paginadas y totales fuera de 1–500 millones rechazan la serie completa.

Esta serie no equivale al total global publicado: el campo IDP tiene la cobertura operativa de ACNUR y no se incluyen refugiados de UNRWA. La diferencia está explicada en pantalla. El selector incluye todos los años disponibles y el gráfico comienza en 2015. Cada cifra tiene año y fuente; una tabla ofrece la alternativa sin JavaScript. No se muestran proyecciones.

Si la API falla, se muestra el respaldo del gestor, explícitamente como valor guardado y como estimación global separada, sin insertarlo en el gráfico. Sin respaldo completo y válido, se muestra pendiente. El número inicial se sirve en HTML; los cambios de año animan desde el valor anterior salvo con movimiento reducido.

- Fuente del respaldo: https://www.unhcr.org/about-unhcr/overview/figures-glance
- Metodología: https://www.unhcr.org/refugee-statistics/insights/explainers/forcibly-displaced-pocs.html
- API: https://api.unhcr.org/docs/refugee-statistics.html

## Imágenes y material pendiente

`npm run images:prepare` conserva originales, produce variantes por ancho y escribe `data/image-report.json`. Fotos documentales: Lanczos clásico con máximo 2×, sin generación de rostros ni detalles. Renders: resolución nativa disponible. Este proceso evita una recompresión excesiva, pero no recupera detalle ausente.

El hero original tiene 1100 px y su derivado llega a 2200 px, por debajo de los 2800 px deseados. El render principal de AeroCabin conserva sus 2026 px; todavía no alcanza los 2400 px objetivo. El informe enumera las demás diferencias. No se realizó escalado generativo.

CMAX debe aportar: originales de mayor resolución, foto confirmada de la campaña Venezuela, URLs/titulares/fechas de prensa, video ONU y videos nuevos con subtítulos, monto recaudado y respaldo. Los espacios están implementados; usan contenido existente o un estado editorial vacío hasta completar esos datos.

La cartografía es de Natural Earth, dominio público: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson. `node scripts/prepare-map.mjs` regenera el SVG desde el GeoJSON local.

## Verificación

- `npm run lint`
- `npm run build`
- `npx tsc --noEmit`
- `npm run check:site` con el servidor en localhost:3000.
- `node scripts/check-data.mjs` (Node 22.18+): tipos mixtos, categorías, integridad de la serie, años futuros, fallo de API y condiciones de publicación de recaudación.
- Revisión de navegador a 390, 768 y 1440 px; menú, mapa, comparador y visor con teclado.

Resultados: 23 páginas, 39 enlaces internos y 19 recursos correctos; formulario vacío devuelve el foco al primer campo inválido; la cifra y la fuente de ACNUR están en el HTML servido. La portada tiene 11 secciones y unas 446 palabras (incluyendo pies y controles).

La captura real con DPR 2 y la emulación de movimiento reducido del navegador no estuvieron disponibles en la superficie de prueba. La lógica y las reglas CSS de movimiento reducido están implementadas; estos dos controles visuales quedan pendientes en un dispositivo compatible. Los originales documentales siguen limitando el detalle real, especialmente en pantallas de alta densidad.
