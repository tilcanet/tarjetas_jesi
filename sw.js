/**
 * Service Worker para Mixturas Tilcara PWA
 * Permite el funcionamiento sin conexión y habilita la instalación de acceso directo en celulares
 */
const CACHE_NAME = 'mixturas-tilcara-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './trabajadores.html',
  './style.css',
  './trabajadores.css',
  './script.js',
  './trabajadores.js',
  './manifest.json',
  './icon.svg',
  './logo_jesi.jpg',
  './qr what.jpg',
  './contacto-mixturas-tilcara.vcf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => cachedResponse);
    })
  );
});
