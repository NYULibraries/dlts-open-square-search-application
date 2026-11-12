import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/search/',
    server: {
      build: {
        sourcemap: mode === 'development' || 'develop',
      },
      port: 5173,
      host: '127.0.0.1',
      proxy: {
        '/solr': {
          target: env.VITE_SOLR_TARGET,
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    preview: {
      proxy: {
        '/solr': {
          target: env.VITE_SOLR_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
