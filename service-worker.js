/* Service worker - Rendimiento Academico DCFyCCCO */
const CACHE = 'rend-v3';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Red primero (para que siempre traiga la ultima version), cache de respaldo si no hay internet */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(resp => {
      try { const c = resp.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); } catch (_) {}
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
