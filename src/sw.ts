/// <reference lib="webworker" />

import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RouteHandlerCallbackOptions } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

interface SyncEvent extends Event {
    tag: string;
    waitUntil(promise: Promise<void>): void;
}

interface PeriodicSyncEvent extends Event {
    tag: string;
    waitUntil(promise: Promise<void>): void;
}

interface MedicineSchedule {
    id: string;
    name: string;
    dueTime: string;
    dosage: string;
}

self.__WB_DISABLE_DEV_LOGS = true;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const navigationHandler = async ({ event, request }: RouteHandlerCallbackOptions): Promise<Response> => {
    try {
        const networkFirst = new NetworkFirst({
            cacheName: 'pages',
            networkTimeoutSeconds: 3,
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ],
        });
        return await networkFirst.handle({ event, request });
    } catch {
        const cacheFirst = new CacheFirst({
            cacheName: 'core-v1',
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ],
        });
        return await cacheFirst.handle({ event, request: new Request('/offline.html') });
    }
};

const staticAssetHandler = async ({ event, request }: RouteHandlerCallbackOptions): Promise<Response> => {
    try {
        const cacheFirst = new CacheFirst({
            cacheName: 'static-assets',
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ],
        });
        return await cacheFirst.handle({ event, request });
    } catch (error) {
        return new Response('Not Found ' + error, { status: 404 });
    }
};

// Register routes for static assets with error handling
registerRoute(
    ({ request }) =>
        request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
    staticAssetHandler
);

// Register the navigation route
registerRoute(new NavigationRoute(navigationHandler));

// Force activation
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            // Cache core assets with error handling
            caches.open('core-v1').then((cache) => {
                const assetsToCache = [
                    '/',
                    '/offline.html',
                    '/index.html',
                    '/manifest.webmanifest',
                    '/src/main.tsx',
                    '/@vite/client',
                    '/@react-refresh',
                    '/@vite-plugin-pwa/pwa-entry-point-loaded',
                ];

                // Only add assets that exist
                return Promise.allSettled(
                    assetsToCache.map((asset) => {
                        return cache.add(asset).catch((error) => {
                            console.warn(`Failed to cache ${asset}:`, error);
                        });
                    })
                );
            }),
        ])
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName.startsWith('core-'))
                        .filter((cacheName) => cacheName !== 'core-v1')
                        .map((cacheName) => caches.delete(cacheName))
                );
            }),
        ])
    );
});

// Handle subscription changes
self.addEventListener('pushsubscriptionchange', async () => {
    try {
        const registration = self.registration;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
                'BInk419lZ2jkHZYxcqdAByTYfQqykKb3f98UUzcRsad9V-xIO8fpa9xtVz4og8vk9vX_SknH46U1t0oI0WenyYc', // Replace with your VAPID public key
        });

        // Send the new subscription to the server
        await fetch('http://localhost:5000/api/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
            credentials: 'include', // Important for cookies
        });
    } catch (error) {
        console.error('Error handling subscription change:', error);
    }
});

// Handle push notifications with improved error handling
self.addEventListener('push', async (event: PushEvent) => {
    try {
        if (!event.data) {
            console.warn('Push event received but no data was found');
            return;
        }

        // Check if notifications are enabled
        const notificationState = await self.registration.pushManager.getSubscription();
        if (!notificationState) {
            console.warn('Notifications are disabled');
            return;
        }

        const data = event.data.json();

        // Validate required fields
        if (!data.title || !data.body) {
            console.error('Push notification missing required fields');
            return;
        }

        const options = {
            body: data.body,
            icon: data.icon || '/icons/icon-192x192.png',
            badge: data.badge || '/icons/badge-72x72.png',
            data: data.data,
            vibrate: [100, 50, 100],
            requireInteraction: true,
            actions: [
                {
                    action: 'take',
                    title: 'Take Medicine',
                    icon: '/icons/check.png',
                },
                {
                    action: 'snooze',
                    title: 'Snooze',
                    icon: '/icons/snooze.png',
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/icons/close.png',
                },
            ],
            tag: data.tag || 'medicine-reminder',
            renotify: true,
        };

        await self.registration.showNotification(data.title, options);
    } catch (error) {
        console.error('Error handling push notification:', error);
    }
});

// Handle notification clicks with improved actions
self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();

    const action = event.action || 'default';

    switch (action) {
        case 'take':
            event.waitUntil(
                self.clients
                    .openWindow('/reminders')
                    .catch((error) => console.error('Error opening medicine reminders:', error))
            );
            break;

        case 'snooze':
            // Handle snooze action - you can implement custom logic here
            event.waitUntil(
                self.registration.showNotification('Medicine Reminder Snoozed', {
                    body: 'You will be reminded again in 15 minutes',
                    icon: '/icons/icon-192x192.png',
                })
            );
            break;

        case 'dismiss':
            // Handle dismiss action
            break;

        default:
            // Default action - open the app
            event.waitUntil(
                self.clients.openWindow('/').catch((error) => console.error('Error opening main page:', error))
            );
    }
});

// Handle background sync
self.addEventListener('sync', ((event: Event) => {
    const syncEvent = event as SyncEvent;
    if (syncEvent.tag === 'sync-medicine-data') {
        syncEvent.waitUntil(syncMedicineData());
    }
}) as EventListener);

// Function to sync medicine data
async function syncMedicineData() {
    try {
        const response = await fetch('http://localhost:5000/api/medicine-data');
        const data = await response.json();

        const cache = await caches.open('medicine-data');
        await cache.put(
            '/api/medicine-data',
            new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            })
        );
    } catch (error) {
        console.error('Error syncing medicine data:', error);
    }
}

// Handle periodic sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', ((event: Event) => {
        const periodicSyncEvent = event as PeriodicSyncEvent;
        if (periodicSyncEvent.tag === 'check-medicine-schedule') {
            periodicSyncEvent.waitUntil(checkMedicineSchedule());
        }
    }) as EventListener);
}

// Function to check medicine schedule
async function checkMedicineSchedule() {
    try {
        const response = await fetch('http://localhost:5000/api/medicine-schedule');
        const schedule: MedicineSchedule[] = await response.json();

        // Check if any medicines are due
        const now = new Date();
        const dueMedicines = schedule.filter((medicine: MedicineSchedule) => {
            const dueTime = new Date(medicine.dueTime);
            return dueTime <= now && dueTime > new Date(now.getTime() - 5 * 60 * 1000); // Within last 5 minutes
        });

        if (dueMedicines.length > 0) {
            // Show notification for due medicines
            await self.registration.showNotification('Medicine Reminder', {
                body: `You have ${dueMedicines.length} medicine(s) due`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                data: { medicines: dueMedicines },
                requireInteraction: true,
            });
        }
    } catch (error) {
        console.error('Error checking medicine schedule:', error);
    }
}

// Updated push event listener with improved error handling
self.addEventListener('push', function (event: PushEvent) {
    let payload;
    try {
        payload = event.data?.json();
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

self.addEventListener('notificationclick', function (event: NotificationEvent) {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(self.clients.openWindow('/'));
    }
});
