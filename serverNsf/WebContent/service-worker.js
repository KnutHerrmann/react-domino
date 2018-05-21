importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  {
    "url": "asset-manifest.json",
    "revision": "3abbce2e89b40b7118a5cd8606dc3f9f"
  },
  {
    "url": "icons/favicon.ico",
    "revision": "4822ce3b6f1e4cd80cea1791eda12611"
  },
  {
    "url": "index.html",
    "revision": "6b1bf6c6b3d76396f1da660c672e8f98"
  },
  {
    "url": "manifest.json",
    "revision": "616fd417bdc707c07cda76f019a180a9"
  },
  {
    "url": "static/css/main.0d9c2449.css",
    "revision": "05ff512c26a44543c2d0d059c6306272"
  },
  {
    "url": "static/js/main.b3ae9101.js",
    "revision": "463d15825e90ce555950ba83c7ecd51b"
  },
  {
    "url": "static/media/glyphicons-halflings-regular.89889688.svg",
    "revision": "89889688147bd7575d6327160d64e760"
  }
]);

workbox.routing.registerRoute(/(.*)data\.xsp\/data\/(.*)/,
    workbox.strategies.networkFirst({cacheName: 'theater-cache'})
);

self.addEventListener('fetch', (event) => {
    console.log('serviceWorker fetch', event);
});

