/**
 * Service Worker for the PWA
 * Manages caching and offline behavior
 */

// Import version from version.js
importScripts('./js/version.js');

const CACHE_NAME = `calculadora-turnos-${CACHE_VERSION}`;
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/version.js',
  './js/turnos.js',
  './js/config.js',
  './js/export-csv.js',
  './js/export-pdf.js',
  './js/export-ics.js',
  './js/update-manager.js',
  './js/app.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'
];

// Service Worker install
self.addEventListener('install', event => {
  console.log('Service Worker instalando - versión:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Service Worker activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );

  console.log('Service Worker activado - versión:', CACHE_NAME);
});

// Listen to messages from the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Intercept network requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Serve from cache when available
        if (response) {
          return response;
        }

        // Otherwise fetch from network and cache it
        return fetch(event.request).then(response => {
          // Only cache valid responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => caches.match('./index.html'))
  );
});
