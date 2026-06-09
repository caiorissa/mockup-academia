import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import os from 'os'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: path.join(os.homedir(), '.cache', 'vite', 'mockup-academia'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'recharts',
      'lucide-react',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
  },
})
