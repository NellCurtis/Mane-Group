// Service Worker for offline capabilities
const CACHE_NAME = 'manegroup-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    // Cache important assets during installation
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/manifest.json',
        '/src/index.css',
        // Add common static assets
        '/images/hero/hero1.jpg',
        '/images/hero/hero2.jpg',
        '/images/hero/hero3.jpg',
        '/images/placeholder.jpg',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // Try network first, fallback to cache
    fetch(event.request).then(response => {
      // If request succeeded, cache a copy
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // If network fails, try cache
      return caches.match(event.request).then(response => {
        return response || fetch(event.request); // Final fallback
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});