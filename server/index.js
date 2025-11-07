import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function createServer() {
  const app = express()
  
  // 创建Vite服务器以支持热重载
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  
  // 使用Vite的connect实例作为中间件
  app.use(vite.middlewares)
  
  // SSR处理
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    
    try {
      // 加载服务器入口
      const { render } = await vite.ssrLoadModule('/src/ssr/entry-server.tsx')
      
      // 渲染应用
      const { html } = render(url)
      
      // 注入HTML模板
      const template = `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Agentic Coding Template</title>
  </head>
  <body>
    <div id="root">${html}</div>
    <script type="module" src="/src/ssr/entry-client.tsx"></script>
  </body>
</html>`
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      console.error(error)
      res.status(500).end(error.message)
    }
  })
  
  app.listen(3000, () => {
    console.log('SSR服务器运行在 http://localhost:3000')
  })
}

createServer()