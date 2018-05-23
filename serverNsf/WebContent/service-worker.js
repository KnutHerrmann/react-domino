importScripts('./workbox/workbox-v3.2.0/workbox-sw.js');

workbox.setConfig({
    modulePathPrefix: './workbox/workbox-v3.2.0/',
    debug: true
});

workbox.core.setCacheNameDetails({
    prefix: 'theater',
    suffix: 'v1'
});

workbox.precaching.precacheAndRoute([
  {
    "url": "asset-manifest.json",
    "revision": "8227613f6b83054bd8cc546133a77ab2"
  },
  {
    "url": "icons/favicon.ico",
    "revision": "4822ce3b6f1e4cd80cea1791eda12611"
  },
  {
    "url": "index.html",
    "revision": "f95b91083a81ac4afb4939b10d7bb308"
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
    "url": "static/js/main.82fcfceb.js",
    "revision": "b345e9245d7f6f5538b28f61bc421277"
  },
  {
    "url": "static/media/glyphicons-halflings-regular.89889688.svg",
    "revision": "89889688147bd7575d6327160d64e760"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-background-sync.dev.js",
    "revision": "0eda3090463b8cd36457401a8872fb48"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-background-sync.prod.js",
    "revision": "2002a84c63d5833a034982cdd16f6a93"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-broadcast-cache-update.dev.js",
    "revision": "4ca06f2d6ba378d4d027c1cc8607009e"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-broadcast-cache-update.prod.js",
    "revision": "c7474a7cde8821130994c942d6c7d0af"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-cache-expiration.dev.js",
    "revision": "e9717c44a4faba9a8626459d41aaa3fb"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-cache-expiration.prod.js",
    "revision": "d063232af6ebedfade7a752c1d7069c4"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-cacheable-response.dev.js",
    "revision": "0ef20f214db2ff13ab0856fafe7d086e"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-cacheable-response.prod.js",
    "revision": "85567843933de37dd9012e95572f601b"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-core.dev.js",
    "revision": "300366d76f9ebb1ce2901d3ed3e27963"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-core.prod.js",
    "revision": "98251a98e107d94d737cb19c1f3bcec7"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-google-analytics.dev.js",
    "revision": "5cd2df38446cd79f66f201242332e486"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-google-analytics.prod.js",
    "revision": "e3bb65a3ac584ab819b9ef71517bfbf1"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-precaching.dev.js",
    "revision": "27e10c95149800bd15fa2b6acfc8e669"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-precaching.prod.js",
    "revision": "de0f145c9f78f661021a5f9681e4efd4"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-range-requests.dev.js",
    "revision": "a5bd2b4986b2c18794436c53ae31ca24"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-range-requests.prod.js",
    "revision": "2dbb3fc265b9f5e69ef22bf6eec6d190"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-routing.dev.js",
    "revision": "516481e6cd7ada440ef487fb7190a8b3"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-routing.prod.js",
    "revision": "ff45303634e5cf943cdf2866e9397452"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-strategies.dev.js",
    "revision": "980222f516b558783f91e8871a1595fb"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-strategies.prod.js",
    "revision": "e4248e696e5647cb1ff9b01f825f002a"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-streams.dev.js",
    "revision": "db59c481c2e63f96c1279684b2890f3c"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-streams.prod.js",
    "revision": "005fd88f751522ec30f36ca7c7657e84"
  },
  {
    "url": "workbox/workbox-v3.2.0/workbox-sw.js",
    "revision": "bb7d64a121c44e6670d91290df6a5406"
  }
]);

workbox.routing.registerRoute(
    /(.*)data\.xsp\/data\/(.*)/,
    workbox.strategies.networkFirst({
        cacheName: 'theater-cache'
    })
);

const showNotificationSuccess = () => {
    self.registration.showNotification('Background sync - executed request from queue', {
        body: 'Ticket order accomplished successfully.',
        icon: './icons/icon-512x512.png'
    });
};

const showNotificationEnqueue = () => {
    self.registration.showNotification('Background sync - put request in queue', {
        body: 'Ticket order will be sent as soon as device is online again.',
        icon: './icons/icon-512x512.png'
    });
};

const bgSyncPlugin = new workbox.backgroundSync.Plugin(
    'theater-queue',
    {
        callbacks: {
            requestWillEnqueue: showNotificationEnqueue,
            queueDidReplay: showNotificationSuccess,
       }
    }
);

const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
});

workbox.routing.registerRoute(
    /(.*)data\.xsp\/data\/(.*)/,
    networkWithBackgroundSync,
    'POST'
);

self.addEventListener('fetch', (event) => {
    console.log('serviceWorker fetch', event);
});

