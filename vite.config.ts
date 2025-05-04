import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Usar '/gastos/' como base URL
  base: '/gastos/',
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
      '/gastos/api': {
        target: 'http://localhost/gastos/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gastos\/api/, '')
      }
    }
  }
});
