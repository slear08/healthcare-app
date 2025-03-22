import { RouteHandlerCallbackOptions } from 'workbox-core';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

// Clean up old caches
cleanupOutdatedCaches();

// Create a specific handler for navigation requests
const navigationHandler = async ({ event, request }: RouteHandlerCallbackOptions): Promise<Response> => {
    try {
        // Try the network first with a timeout
        const networkFirst = new NetworkFirst({
            cacheName: 'pages',
            networkTimeoutSeconds: 3,
        });
        return await networkFirst.handle({ event, request });
    } catch {
        // If network fails, return the offline page
        const offlineResponse = await caches.match('/offline.html');
        if (!offlineResponse) {
            throw new Error('Offline page not found in cache');
        }
        return offlineResponse;
    }
};

// Register the navigation route
registerRoute(new NavigationRoute(navigationHandler));

// Force activation
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            // Cache core assets
            caches.open('core-v1').then((cache) => {
                return cache.addAll(['/', '/offline.html', '/index.html', '/manifest.webmanifest']);
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
