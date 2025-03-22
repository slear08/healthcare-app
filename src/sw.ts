import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RouteHandlerCallbackOptions } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

// Clean up old caches
cleanupOutdatedCaches();

// Precache the offline page and other static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new NetworkFirst({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

// Cache static assets
registerRoute(
    /\.(?:js|css|png|jpg|jpeg|svg|gif)$/,
    new CacheFirst({
        cacheName: 'static-resources',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

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
