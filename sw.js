// Eisenhower Grid service worker: keeps the app working offline and updates it reliably.
// Bump VERSION whenever any file changes so installed copies pick up the new files.
const VERSION = '2.0.1';
const CACHE = `eisenhower-grid-${VERSION}`;
const PAGE = './index.html';
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
  // cache: 'reload' skips the browser's HTTP cache, so a new version never stores an old copy of a file.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('eisenhower-grid-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Older pages ask a waiting worker to take over; keep honoring that.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirstPage(request) {
  const cache = await caches.open(CACHE);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(new Request(PAGE, { cache: 'no-cache', signal: controller.signal }));
    clearTimeout(timer);
    if (res && res.ok) { await cache.put(PAGE, res.clone()); return res; }
    throw new Error('bad response');
  } catch (e) {
    return (await cache.match(PAGE)) || (await cache.match('./')) || fetch(request);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope);
  const isPage = req.mode === 'navigate' || url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html';
  if (isPage) { event.respondWith(networkFirstPage(req)); return; }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  })());
});
