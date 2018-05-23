importScripts('./workbox/workbox-v3.2.0/workbox-sw.js');

workbox.setConfig({
    modulePathPrefix: './workbox/workbox-v3.2.0/',
    debug: true
});

workbox.core.setCacheNameDetails({
    prefix: 'theater',
    suffix: 'v1'
});

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    /(.*)data\.xsp\/data\/(.*)/,
    workbox.strategies.networkFirst({
        cacheName: 'theater-cache'
    })
);

const showNotificationSuccess = () => {
    self.registration.showNotification('Background sync - executed request from queue', {
        body: 'Ticket order accomplished successfully.'
    });
};

const showNotificationEnqueue = () => {
    self.registration.showNotification('Background sync - put request in queue', {
        body: 'Ticket order will be sent as soon as device is online again.'
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

