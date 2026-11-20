/**
 * @file sw.js
 * @description Offline-first Service Worker for Mystic 8-Ball PWA & Capacitor Android deployment.
 */

const CACHE_NAME = 'mystic-8ball-v1';
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './privacy.html',
    './manifest.json',
    './assets/icon.svg',
    './src/styles/sphere.css',
    './src/data/oracle-answers.js',
    './src/services/audio-service.js',
    './src/services/storage-service.js',
    './src/services/mobile-bridge.js',
    './src/state/oracle-store.js',
    './src/ui/sphere-view.js',
    './src/ui/chronicle-view.js',
    './src/main.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const networkFetch = fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});
