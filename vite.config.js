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
      // using proxy in local development to bypass CORS for now
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
  };
});
