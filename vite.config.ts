import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['117.72.185.21', 'localhost'],
      proxy: {
        '/api/responses': {
          target: 'https://yunyi.cfd',
          changeOrigin: true,
          rewrite: () => '/codex/v1/responses',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.VITE_OPENAI_API_KEY
              if (key) {
                proxyReq.setHeader('Authorization', `Bearer ${key}`)
              }
            })
          },
        },
      },
    },
    base: '/',
  }
})
