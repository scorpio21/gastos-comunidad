import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/duplicados/gastos/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Asegurarse de que los assets tengan rutas correctas
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    proxy: {
      '/duplicados/gastos/api': {
        target: 'http://localhost/duplicados/gastos/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/duplicados\/gastos\/api/, '')
      }
    }
  }
});
