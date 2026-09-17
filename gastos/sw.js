/* MANNA Gastos — service worker: permite abrir la app sin conexión.
   Estrategia: red primero (para recibir actualizaciones), caché como
   respaldo cuando no hay conexión. */
const CACHE = 'manna-gastos-v1';

self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', ev => {
  ev.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', ev => {
  const pedido = ev.request;
  if (pedido.method !== 'GET') return;
  let mismoOrigen = false;
  try { mismoOrigen = new URL(pedido.url).origin === self.location.origin; } catch (e) {}
  if (!mismoOrigen) return;
  ev.respondWith((async () => {
    try {
      const respuesta = await fetch(pedido);
      if (respuesta && respuesta.status === 200 && respuesta.type === 'basic') {
        const c = await caches.open(CACHE);
        c.put(pedido, respuesta.clone());
      }
      return respuesta;
    } catch (err) {
      const guardada = await caches.match(pedido, { ignoreSearch: true });
      if (guardada) return guardada;
      if (pedido.mode === 'navigate') {
        const inicio = await caches.match(self.registration.scope, { ignoreSearch: true });
        if (inicio) return inicio;
      }
      throw err;
    }
  })());
});
