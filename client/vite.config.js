import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, /api is proxied to the Express server so no CORS setup or VITE_API_URL is needed.
// envDir points at the project root so the client reads VITE_API_URL from the same
// .env as the server. Vite only exposes VITE_-prefixed variables to browser code,
// so GROQ_API_KEY is never bundled.
export default defineConfig({
  plugins: [react()],
  envDir: '..',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
