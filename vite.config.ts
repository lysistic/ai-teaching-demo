import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// 简单的内存数据库用于词云功能
let submissions: string[] = []
let activePool: {text: string, count: number}[] = []

function wordCloudApi() {
  return {
    name: 'word-cloud-api',
    configureServer(server: any) {
      server.middlewares.use('/api/wordcloud', (req: any, res: any, next: any) => {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          let parsedBody: any = {};
          if (body) {
            try { parsedBody = JSON.parse(body); } catch(e) {}
          }
          
          res.setHeader('Content-Type', 'application/json');
          
          if (req.method === 'POST' && req.url === '/submit') {
            if (parsedBody.text) submissions.push(parsedBody.text);
            res.end(JSON.stringify({ success: true }));
          } else if (req.method === 'GET' && req.url === '/submissions') {
            res.end(JSON.stringify(submissions));
          } else if (req.method === 'POST' && req.url === '/merge') {
            const freq: Record<string, number> = {};
            submissions.forEach(w => freq[w] = (freq[w] || 0) + 1);
            
            const poolMap: Record<string, number> = {};
            activePool.forEach(w => poolMap[w.text] = w.count);
            
            Object.entries(freq).forEach(([text, count]) => {
              poolMap[text] = (poolMap[text] || 0) + count * 5;
            });
            
            activePool = Object.entries(poolMap).map(([text, count]) => ({ text, count }));
            submissions = []; // 清空表单池
            res.end(JSON.stringify(activePool));
          } else if (req.method === 'GET' && req.url === '/pool') {
            res.end(JSON.stringify(activePool));
          } else if (req.method === 'DELETE' && req.url === '/pool') {
            activePool = [];
            submissions = [];
            res.end(JSON.stringify({ success: true }));
          } else {
            next();
          }
        });
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), wordCloudApi()],
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
