importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    /(.*)data\.xsp\/data\/(.*)/,
    workbox.strategies.networkFirst({
        cacheName: 'theater-cache'
    })
);

self.addEventListener('fetch', (event) => {
    console.log('serviceWorker fetch', event);
});

