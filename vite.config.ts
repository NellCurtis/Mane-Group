import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js', 'lucide-react']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui-icons': ['lucide-react']
        },
        // Optimize for smaller chunks
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      }
    },
    cssCodeSplit: true,
    target: 'es2015',
  },
});