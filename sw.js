/* =========================================================
   AgriTrace Offline PWA Service Worker
   Full-Stack Offline-First Cache & Resilience Architecture
   ========================================================= */

const CACHE_NAME = 'agritrace-pwa-v1.3.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/features.js',
  './js/blockchain.js',
  './js/wallet.js',
  './js/i18n.js',
  './assets/agritrace-icon.svg',
  './manifest.json'
];

// 1. Install Event: Pre-cache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[AgriTrace SW] Pre-caching offline application shell...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[AgriTrace SW] Precache partial error (continuing):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[AgriTrace SW] Removing deprecated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Stale-While-Revalidate + Cache-First + Offline Navigation Fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests
  if (req.method !== 'GET') {
    return;
  }

  // A. Navigation requests: always serve index.html if network is unavailable
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        console.log('[AgriTrace SW] Offline detected, serving cached index.html');
        return caches.match('./index.html') || caches.match('/');
      })
    );
    return;
  }

  // B. Local static assets: Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resToCache));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C. External assets (e.g. Google Fonts): Cache-First with network fallback
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        }).catch(() => new Response('', { status: 408, statusText: 'Offline Font' }));
      })
    );
    return;
  }

  // D. General fetch fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// 4. Message Event: Allow clients to force skip-waiting or refresh cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
