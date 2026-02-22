const CACHE_NAME = 'game-hub-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './js/tictactoe.js',
    './js/rps.js',
    './js/snake.js',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
