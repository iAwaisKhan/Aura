const CACHE_NAME = 'aura-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './js/state.js',
    './js/utils.js',
    './js/ui.js',
    './js/storage.js',
    './js/db.js',
    './js/init.js',
    './js/events.js',
    './js/dashboard.js',
    './js/clock.js',
    './js/quotes.js',
    './js/visuals.js',
    './js/scroll.js',
    './js/settings.js',
    './js/notes.js',
    './js/tasks.js',
    './js/snippets.js',
    './js/resources.js',
    './js/pomodoro.js',
    './js/search.js',
    './js/legacy-logic.js',
    'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((response) => {
                // If it's a valid response, maybe add to cache for future use if it's an asset
                // For simplicity, we just return the fetch response here if not in cache
                return response;
            });
        })
    );
});
