# Jáuregui Catering & Eventos

Catálogo gastronómico boliviano y formulario de solicitud de cotización. Atención únicamente por llamada y WhatsApp; la contratación se coordina de manera directa y se formaliza mediante contrato. No se publica dirección física.

## Estructura
- `index.html`: única entrada para escritorio, tablet y celular. El diseño cambia con CSS responsivo; no existe un segundo HTML móvil.
- `css/styles.css`: estilos, temas claro/oscuro y breakpoints.
- `js/app.js`: búsqueda, categorías, favoritos, selección de cantidades y cotizador.
- `json/platos.json`: platos de referencia con imagen asociada por plato.
- `assets/gallery/`: fotografías reales compartidas por el negocio.
- `assets/images/`: fotografías del catálogo.
- `manifest.json` y `sw.js`: instalación PWA y caché offline.
- `semanas/semana1..semana3/`: documentación progresiva por etapas y actividades; el código funcional se mantiene centralizado en la raíz.

## Contacto
Llamadas y WhatsApp: +591 77523256.

## Publicación
Subir el contenido de esta carpeta a GitHub Pages. La primera carga requiere conexión para descargar la caché; después se podrán consultar los recursos almacenados sin conexión. El envío a WhatsApp requiere internet.

## Catálogo
Los platos se presentan como referencias gastronómicas, no como menú cerrado ni precio fijo. Las cantidades y el precio final se coordinan con el responsable. Para añadir un plato, editar `json/platos.json` y asociar una fotografía real del mismo plato en `assets/images/`. No reutilizar una foto de otro plato.


## Prueba local
Puedes abrir `index.html` directamente para revisar la interfaz y el catálogo de referencia (incluye datos de respaldo para el modo `file://`). Para probar la instalación PWA y el funcionamiento completo del Service Worker, publica el sitio en GitHub Pages o ejecútalo mediante un servidor local (por ejemplo, Live Server de VS Code). El envío de solicitudes por WhatsApp necesita conexión a internet.

## Mensaje de cotización
El formulario genera un mensaje cordial y ordenado para WhatsApp con los datos del evento y los platos elegidos. No incluye texto interno ni instrucciones dirigidas al personal; el cliente solo solicita una propuesta y coordina los detalles.
