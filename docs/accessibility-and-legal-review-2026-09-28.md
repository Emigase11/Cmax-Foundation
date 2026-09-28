# Revisión legal y de accesibilidad — 28 de septiembre de 2026

## Contenido legal

Se agregaron /privacy y /terms, accesibles desde el pie y el sitemap. Son singletons de Keystatic en el grupo Legal, con título, introducción, fecha, nota de revisión y secciones editables. El aviso breve del formulario también se edita en Privacy notice. Los componentes cliente reciben el texto por props; no importan lib/content.ts.

La redacción se contrastó con components/support-form.tsx, app/api/support/route.ts, lib/sheets.ts, components/video-on-demand.tsx, app/layout.tsx, package.json y la configuración pública del sitio. No se leyeron ni expusieron credenciales.

El formulario exige nombre, email, motivo y mensaje; organización es opcional. Envía además la URL actual y la referencia/etiqueta del registro, cuando existe. El servidor añade fecha y hora. Resend y Google Sheets son vías independientes y condicionadas a configuración. El archivo local se intenta escribir, pero no es una vía de almacenamiento en Vercel con filesystem de aplicación de solo lectura. Esto no es una comprobación de las credenciales o de las preferencias de retención de producción.

No se encontró analítica, cookies propias ni rastreo publicitario en el sitio público. Se distingue esa afirmación del acceso administrativo y del procesamiento de terceros al reproducir videos. YouTube usa youtube-nocookie.com después de una acción del visitante, lo cual no equivale a ausencia de procesamiento de datos por Google.

**Pendiente de CMAX, visible en las páginas:** plazo y procedimiento de conservación/borrado, contacto y proceso para ejercer derechos, ley aplicable y jurisdicción. No se inventaron plazos ni se afirmó cumplimiento de una ley determinada.

## Correcciones de accesibilidad

- Hidratación de home: el título SVG del gráfico tenía varios hijos de React. El HTML del servidor no coincidía con la hidratación del título. Ahora se produce una sola cadena, conservando su nombre accesible y su descripción. No se ocultó el error con suppressHydrationWarning.
- /about no reprodujo una falla propia en cargas nuevas. /our-work es una ruta retirada por una decisión anterior y conserva su 404; los programas de detalle continúan disponibles.
- Se mantuvieron lang="en" y el enlace inicial Skip to content. main tiene ahora tabIndex=-1 para recibir el foco del salto.
- El comparador responde a flechas con pasos de 1%, anunciados con aria-valuetext. Su animación introductoria se detiene al enfocarlo, manipularlo o activar movimiento reducido, evitando que sobreescriba una elección.
- Se reforzó el ciclo de Tab/Shift+Tab en los diálogos de Gallery, MedPhoto, AeroPhoto y el menú móvil. Escape y foco de retorno se conservan.
- El reproductor a demanda mueve el foco al player al abrirlo y no anuncia subtítulos de terceros como disponibles sin evidencia.
- El formulario enfoca el primer campo inválido y asocia sus mensajes mediante aria-describedby. También se conserva el foco al mostrar confirmación o volver a escribir.
- El DOM de Support sigue intro, formulario, contacto, igual que su disposición móvil. El aviso de privacidad está junto al envío, a 16px y con enlace subrayado.
- Se aclararon nombres accesibles de enlaces de campaña, registro y LinkedIn. Los retratos conservan el nombre de cada persona; imágenes decorativas como el mapa base y la marca usan alt vacío.
- Se ampliaron enlaces independientes pequeños a un mínimo de 24px. Los enlaces dentro de prosa mantienen el flujo de texto, contemplado por la excepción de enlaces en línea.
- Se oscureció el naranja usado como texto, manteniendo el naranja de marca como fondo de botones. También se corrigieron tonos secundarios en About, Cmax Med, AeroCabin, Approach y el gráfico de home. El pie de la fotografía de About tiene fondo oscuro estable.
- El foco global combina borde oscuro y halo claro para distinguirse sobre superficies claras y oscuras. Los campos del formulario tienen bordes visibles y margen de desplazamiento para el encabezado fijo.

## Contraste medido

Cálculo de luminancia relativa sRGB y razón (L1 + 0.05)/(L2 + 0.05). Se inspeccionaron estilos computados en el navegador y pares concretos del CSS. Se usó 4.5:1 para texto, incluso en varios números grandes; para límites de controles, 3:1. El naranja original de la tabla es la medición previa, no un color admitido para texto sobre papel.

| Uso | Primer plano | Fondo | Razón |
| --- | --- | --- | --- |
| ink-2/paper | `#3f3d39` | `#fffefa` | 10.74:1 |
| ink-3/paper | `#66625b` | `#fffefa` | 6.01:1 |
| ink-3/warm | `#66625b` | `#f2f0e9` | 5.32:1 |
| orange original/paper | `#e87722` | `#fffefa` | 2.93:1 |
| orange-ink/paper | `#a3440b` | `#fffefa` | 6.14:1 |
| button ink/orange | `#1c1b19` | `#e87722` | 5.81:1 |
| button hover | `#1c1b19` | `#d66a1b` | 4.87:1 |
| About numbers | `#50634f` | `#dde6d6` | 5.05:1 |
| About year | `#596f50` | `#f7f5ef` | 5.05:1 |
| Med accent | `#a53725` | `#e8dcd0` | 4.91:1 |
| Med numbers | `#4c6052` | `#e4ebdf` | 5.56:1 |
| Aero muted | `#425c61` | `#ccded2` | 5.09:1 |
| Aero accent | `#93421b` | `#ccded2` | 4.92:1 |
| Approach index | `#705c42` | `#efe1ce` | 4.95:1 |
| Approach accent | `#9b451e` | `#efe1ce` | 5.00:1 |
| Home graph heading | `#53614c` | `#eae8df` | 5.38:1 |
| Focus black/white | `#1c1b19` | `#fffefa` | 17.05:1 |
| Focus white/dark green | `#fffefa` | `#203c35` | 11.83:1 |
| Form boundary | `#817b70` | `#f2f0e9` | 3.68:1 |

Los grises ink-2 e ink-3 ya superaban el umbral sobre papel y warm. Se conservaron. El símbolo decorativo de ondas de AeroCabin está marcado aria-hidden; no es texto informativo. Sobre fotografías no se tomó el color de fondo del contenedor como una medición de los píxeles de la imagen: se revisaron las superposiciones y se estabilizó el pie de About.

## Verificación

- TypeScript, ESLint y build de producción sin errores.
- check:site pasó con 24 páginas, 41 enlaces internos, 51 recursos, cuatro solicitudes inválidas y un 404. Se añadieron comprobaciones de lang, un h1, alt en imágenes, enlaces legales y título SVG sin fragmentos SSR.
- Inspección de encabezados y alternativas en páginas principales y las fichas de las seis acciones, dos campañas y tres programas: un h1 por página, sin saltos encontrados en la jerarquía inspeccionada, ningún img sin atributo alt. Los dieciséis retratos tienen el nombre correspondiente.
- Recorrido completo con Tab de home, Support, Privacy y Terms; todos los controles del sitio visitados mostraron foco. No se enviaron consultas válidas ni correos de prueba.
- Formulario vacío: foco en Name, cuatro campos aria-invalid con descripciones de error.
- Comparador: ArrowRight cambió el valor; mapa: Enter seleccionó Mexico y actualizó los registros manteniendo el foco.
- Gallery: apertura con Enter, siete pasos Tab permanecieron dentro del diálogo; ArrowRight cambió de fotografía 1 a 2; Escape cerró y devolvió el foco al botón de apertura.
- Cmax Med: Interior, punto Space for privacy y During a response respondieron a Enter; visor con Tab contenido, Escape y retorno al botón.
- Video de archivo ONU: pausa por teclado y desplazamiento temporal con flecha. Menú móvil: ciclo completo de Tab, Escape y retorno al disparador.
- Revisión visual de home, Privacy, Terms y formulario a 390, 768 y 1440px. Las páginas revisadas no presentaron desbordamiento horizontal.
- Cargas nuevas de home y About sin errores de hidratación. El navegador del usuario registró errores ajenos al sitio de su extensión MetaMask; no se desactivó ni se modificó la extensión.

## Alcance y mantenimiento

Esta es una revisión técnica orientada a WCAG 2.2 AA, no una certificación integral ni una prueba con todos los lectores de pantalla. Los textos alternativos futuros y los subtítulos o alternativas de nuevos videos requieren revisión editorial. Actualmente no hay videos a demanda configurados en home: se revisó su código y se probó el video de archivo ONU que sí está publicado. No se afirmó que un video remoto tenga subtítulos sin verificarlos.

## Referencias verificadas

- [WCAG 2.2, W3C](https://www.w3.org/TR/WCAG22/) y [novedades AA de WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).
- [Resend — Security](https://www.resend.com/security), sobre almacenamiento en Estados Unidos.
- [Google — Privacy Policy](https://policies.google.com/privacy?hl=en), sobre procesamiento internacional y datos técnicos.
- [YouTube — Privacy-enhanced embedding](https://support.google.com/youtube/answer/171780?hl=en).
- [Vercel — Logs reference](https://vercel.com/docs/drains/reference/logs), incluidos datos de solicitudes e IP.
