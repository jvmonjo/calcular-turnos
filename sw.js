/**
 * Service Worker per a PWA
 * Gestiona el caching i el funcionament offline
 */

const CACHE_NAME = 'calculadora-torns-v8';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
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

// Instal·lació del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instal·lant - versió:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache obert');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Forçar que el nou SW esperi fins que s'activi
        return self.skipWaiting();
      })
  );
});

// Activació del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminant cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre control de tots els clients immediatament
      return self.clients.claim();
    })
  );

  console.log('Service Worker activat - versió:', CACHE_NAME);
});

// Missatge per comunicar amb la pàgina
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Interceptar peticions de xarxa
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si està a la cache, retornar-lo
        if (response) {
          return response;
        }

        // Si no, fer la petició a la xarxa
        return fetch(event.request).then(response => {
          // Comprovar si la resposta és vàlida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar la resposta
          const responseToCache = response.clone();

          // Afegir a la cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Si falla tot, retornar una pàgina offline
        return caches.match('./index.html');
      })
  );
});
