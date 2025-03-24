import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        plugins: [
            react(),
            pluginRewriteAll(),
            VitePWA({
                devOptions: {
                    enabled: true,
                    type: 'module',
                },
                strategies: 'injectManifest',
                srcDir: 'src',
                filename: 'sw.ts',
                registerType: 'autoUpdate',
                injectManifest: {
                    swSrc: 'src/sw.ts',
                    swDest: 'dist/sw.js',
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
                },
                manifest: {
                    name: 'Senior Check',
                    short_name: 'Senior Check',
                    description: 'Your Secure Healthcare Portal',
                    icons: [
                        {
                            src: 'pwa-64x64.png',
                            sizes: '64x64',
                            type: 'image/png',
                        },
                        {
                            src: 'pwa-192x192.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'any',
                        },
                        {
                            src: 'pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any',
                        },
                        {
                            src: 'maskable-icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'maskable',
                        },
                    ],
                    theme_color: '#1a1a1a',
                    background_color: '#1a1a1a',
                    start_url: '/',
                    id: '/',
                    scope: '/',
                    display: 'standalone',
                    display_override: ['window-controls-overlay', 'standalone'],
                    orientation: 'portrait',
                    categories: ['healthcare', 'medical'],
                    prefer_related_applications: false,
                    shortcuts: [
                        {
                            name: 'Home',
                            url: '/',
                            description: 'Go to home page',
                        },
                    ],
                    screenshots: [
                        {
                            src: 'screenshot1.png',
                            sizes: '1080x1920',
                            type: 'image/png',
                            form_factor: 'narrow',
                        },
                    ],
                },
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
        server: {
            port: 4000,
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
        },
    };
});
