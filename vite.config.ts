import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react(), pluginRewriteAll()],
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
        define: {
            __API_URL__: JSON.stringify(env.VITE_API_URL),
        },
    };
});