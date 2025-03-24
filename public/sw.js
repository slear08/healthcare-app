self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

self.__WB_MANIFEST;

self.addEventListener('push', function (event) {
    let payload;
    try {
        payload = event.data.json();
    } catch (error) {
        console.error('Error parsing push payload:', error);
        payload = {
            title: 'Medicine Reminder',
            body: 'Time to take your medicine',
            icon: '/pwa-192x192.png',
            badge: '/pwa-64x64.png',
        };
    }

    const options = {
        body: payload.body,
        icon: payload.icon || '/pwa-192x192.png',
        badge: payload.badge || '/pwa-64x64.png',
        vibrate: [100, 50, 100],
        data: payload.data || {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/pwa-64x64.png',
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/pwa-64x64.png',
            },
        ],
    };

    event.waitUntil(self.registration.showNotification(payload.title || 'Medicine Reminder', options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(clients.openWindow('/'));
    }
});
