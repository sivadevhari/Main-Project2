import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset(), require.resolve('@babel/preset-react')] })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Forward cookies properly
            const cookie = req.headers.cookie;
            if (cookie) {
              proxyReq.setHeader('Cookie', cookie);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Forward set-cookie headers - ensure cookie is passed through
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              res.setHeader('set-cookie', cookies);
            }
          });
        }
      }
    }
  }
})
