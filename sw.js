const CACHE = 'jauregui-catering-v3';
const CORE = ['./','./index.html','./css/styles.css','./js/app.js','./json/platos.json','./json/configuracion.json','./manifest.json','./assets/icons/icon.svg','./assets/gallery/trabajo-cocina.webp','./assets/gallery/preparacion-equipo.webp','./assets/gallery/preparacion-insumos.webp','./assets/gallery/plato-servido.webp','./assets/images/evento-familiar.webp','./assets/images/boda-evento.webp','./assets/images/buffet-empresarial.webp','./assets/images/servicio-personalizado.webp',...Array.from({length:7},(_,i)=>`./assets/images/prato-${i+1}.webp`)];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok && /\.(webp|svg|css|js|json|html)$/.test(url.pathname)) { const cache = await caches.open(CACHE); cache.put(event.request, response.clone()); }
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return await caches.match('./index.html');
      return new Response('Sin conexión', {status:503,statusText:'Offline'});
    }
  })());
});
