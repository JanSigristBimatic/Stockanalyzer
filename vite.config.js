import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { proxyYahoo } from './server/yahooProxy.js'

/**
 * Serves /api/yahoo during development with the same proxy code as the Vercel function
 */
function yahooProxyDevServer() {
  return {
    name: 'yahoo-proxy-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/yahoo', async (req, res) => {
        const rawUrl = new URL(req.url, 'http://localhost').searchParams.get('url')
        const { status, body } = await proxyYahoo(rawUrl)
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), yahooProxyDevServer()],
  server: {
    port: 3000,
    open: true
  }
})
