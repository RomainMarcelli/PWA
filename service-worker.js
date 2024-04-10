// service-worker.js


const VERSION = "v12";
const DIR = '/pwa_series/';
const HOST = location.protocol + '//' + location.host;
// const CACHE_NAME = "pwa-series-cache-" + VERSION;

const FILECACHE = [
    HOST+DIR+'index.html',
    HOST+DIR+'details.html',
    HOST+DIR+'details.js',
    HOST+DIR+'function.js',
    HOST+DIR+'script.js',
];


self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log('Version :', VERSION);

    e.waitUntil(
        (async () =>{
            const cache = await caches.open(VERSION);
            
            await Promise.all(
                FILECACHE.map((path) => {
                    return cache.add(path);
                })
            );
        })()
    );
});

self.addEventListener('activate', (e)=> {
    e.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys.map((k) => {
                    if(!k.includes(VERSION))
                        return caches.delete(k);
                })
            );
        })()
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch :', event.request);
    console.log('Fetch :', event.request.mode);
    console.log("SOMETHING");

    const request = event.request;

    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadedResponse = await event.preloadResponse;

                    if (preloadedResponse)
                        return preloadedResponse;

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
                        const cache = await caches.open('search-results-cache');
                        cache.put(request, response.clone());
                        return response;
                    } catch (error) {
                        const cache = await caches.open('search-results-cache');
                        return cache.match(request);
                    }
                }
            })
        );
    } else {
        // Gérer la mise en cache et la récupération des autres ressources statiques
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request);
            })
        );
    }
});


