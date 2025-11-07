import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/star-engine-liff-v2/apps/v2-admin/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@supabase/supabase-js', '@line/liff'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      input: 'index.html',
      external: [],
    },
  },
});
