// Eisenhower Grid service worker: keeps the app working offline.
// Bump VERSION whenever any file below changes so installed copies update.
const VERSION = '2.0.0';
const CACHE = `eisenhower-grid-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/shortcut-new-96.png',
  './fonts/public-sans-latin-400-normal.woff2',
  './fonts/public-sans-latin-500-normal.woff2',
  './fonts/public-sans-latin-600-normal.woff2',
  './fonts/public-sans-latin-700-normal.woff2',
  './fonts/libre-caslon-text-latin-400-normal.woff2',
  './fonts/libre-caslon-text-latin-700-normal.woff2',
  './fonts/libre-caslon-text-latin-400-italic.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('eisenhower-grid-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // App shell: serve the cached page instantly, fall back to the network.
    event.respondWith((async () => {
      const cached = await caches.match('./index.html');
      if (cached) return cached;
      try { return await fetch(req); } catch (e) { return caches.match('./'); }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
    }
    return res;
  })());
});
