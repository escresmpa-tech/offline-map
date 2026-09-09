const CACHE_NAME = 'map-app-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/AMSL_115.json',
    '/AMSL_125.json',
    '/C_TINN_BNDY.json',
    '/Camp_sites.json',
    '/Contour.json',
    '/DAM.json',
    '/Diversion_canal.json',
    '/Excavation area.json',
    '/Existing_Buildings.json',
    '/Irrigation_outlet.json',
    '/New_access.json',
    '/Power_house.json',
    '/PS.json',
    '/Road.geojson',
    '/Saddle_dam.json',
    '/Wee_Oya.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install: Cache all core files and spatial data
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Fetch: Intercept requests. If offline, serve from cache.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) return cachedResponse;
                
                return fetch(event.request).then(networkResponse => {
                    // Dynamically cache basemap tiles as the user pans around on Wi-Fi
                    if (event.request.url.includes('tile.openstreetmap.org')) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                });
            })
    );
});
