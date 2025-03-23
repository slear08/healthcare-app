import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RouteHandlerCallbackOptions } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

// Disable Workbox logging
self.__WB_DISABLE_DEV_LOGS = true;

// Clean up old caches
cleanupOutdatedCaches();

// Create a specific handler for navigation requests
const navigationHandler = async ({ event, request }: RouteHandlerCallbackOptions): Promise<Response> => {
    try {
        // Try the network first with a timeout
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
        // If network fails, use CacheFirst strategy for offline page
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

// Create a handler for static assets with fallback
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
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                }),
            ],
        });
        return await cacheFirst.handle({ event, request });
    } catch (error) {
        // If the asset can't be fetched, return a 404 response
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
