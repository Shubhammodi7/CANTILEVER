import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Import Tailwind
import path from 'path' // 1. Import path module
import { fileURLToPath } from 'url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // 2. Enable the plugin
  ],
  resolve: {
    alias: {
     '@': path.resolve(__dirname, './src'), // 2. Map '@' straight to your 'src' folder
    },
  },
})