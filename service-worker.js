const VERSION = 'v9';
const DIR = '/pwa_series2/';
const HOST = location.protocol + '//' + location.host;
const OFFLINE_URL = "/pwa_series/offline.html";

const FICHIERS_CACHE = [
  HOST + DIR + 'index.html',
  HOST + DIR + 'details.html',
  HOST + DIR + 'details.js',
  HOST + DIR + 'function.js',
  HOST + DIR + 'script.js',
];

const CACHE_API = 'search-results-cache';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  console.log('Version :', VERSION);

  e.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      await cache.addAll(FICHIERS_CACHE);
    })()
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => {
          if (!k.includes(VERSION)) {
            return caches.delete(k);
          }
        })
      );
    })()
  );
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch:', event.request.url);

    const request = event.request;

    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadedResponse = await event.preloadResponse;
                    if (preloadedResponse) return preloadedResponse;
                    return await fetch(request);
                } catch (error) {
                    const cache = await caches.open(VERSION);
                    return await cache.match(DIR + 'index.html');
                }
            })()
        );
    } else if (request.url.startsWith('https://api.tvmaze.com/search/shows')) {
        event.respondWith(
            caches.match(request).then(async (cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    try {
                        const response = await fetch(request);
                        const cache = await caches.open(CACHE_API);
                        cache.put(request, response.clone());
                        return response;
                    } catch (error) {
                        console.error("Failed to fetch:", error);
                        return new Response("Failed to fetch. You are offline.", { status: 404, statusText: "Offline" });
                    }
                }
            })
        );
    } else if (request.url.startsWith('https://api.tvmaze.com/shows/')) {
        event.respondWith(
            caches.match(request).then(async (cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    try {
                        const response = await fetch(request);
                        const cache = await caches.open(CACHE_API);
                        cache.put(request, response.clone());
                        return response;
                    } catch (error) {
                        console.error("Failed to fetch:", error);
                        return new Response("Failed to fetch. You are offline.", { status: 404, statusText: "Offline" });
                    }
                }
            })
        );
    } else {
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request);
            })
        );
    }
});




